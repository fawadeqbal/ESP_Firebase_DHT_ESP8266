"use client"

import { useState } from "react"
import { RefreshCw, Plus, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DashboardLayout } from "@/components/dashboard-layout"
import { SplashScreen } from "@/components/splash-screen"
import { OverviewStats } from "@/components/overview-stats"
import { SensorCard } from "@/components/sensor-card"
import { DeviceControlCard } from "@/components/device-control-card"
import { HealthStatus } from "@/components/health-status"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { SensorSelector } from "@/components/sensor-selector"
import { Loader } from "@/components/loader"
import { useSensorsData } from "@/hooks/use-sensors-data"
import { useSensorData } from "@/hooks/use-sensor-data"

export default function Dashboard() {
  const [showSplash, setShowSplash] = useState(true)
  const [selectedSensorId, setSelectedSensorId] = useState<string>("sensor1")
  const [searchQuery, setSearchQuery] = useState("")

  const { sensors, loading: sensorsLoading, error: sensorsError, refreshSensors } = useSensorsData()
  const { dashboardData, historyData, healthData, loading: sensorLoading, error: sensorError, refreshData } = useSensorData(selectedSensorId)
  
  const loading = sensorsLoading || sensorLoading
  const error = sensorsError || sensorError

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  if (loading && !dashboardData) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader size="lg" text="Loading IoT dashboard..." />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={refreshData}>Try Again</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!sensors || sensors.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No sensors available</p>
            <Button onClick={refreshSensors}>Refresh</Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const selectedSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0]

  const filteredSensors = sensors.filter(
    (sensor) =>
      sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sensor.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Real historical data is loaded from the API via useSensorData hook

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Overview Stats */}
        <OverviewStats data={{
          sensors: sensors,
          totalDevices: sensors.reduce((acc, sensor) => acc + sensor.devices.length, 0),
          activeDevices: sensors.reduce((acc, sensor) => acc + sensor.devices.filter(d => d.status === 'on').length, 0),
          totalReadings: sensors.reduce((acc, sensor) => acc + sensor.statistics.total_readings, 0)
        } as any} />

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sensors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <SensorSelector
              sensors={sensors}
              selectedSensorId={selectedSensorId || sensors[0]?.id}
              onSensorChange={setSelectedSensorId}
            />
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Sensor
            </Button>
            <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Sensors Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Sensor Network</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                onSelect={setSelectedSensorId}
                isSelected={
                  selectedSensorId === sensor.id || (!selectedSensorId && sensor.id === sensors[0]?.id)
                }
              />
            ))}
          </div>
        </div>

        {/* Selected Sensor Details */}
        {selectedSensor && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedSensor.name} - Device Controls</h2>
              {healthData && <HealthStatus health={healthData} />}
            </div>

            {/* Device Controls */}
            {selectedSensor.devices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedSensor.devices.map((device) => (
                  <DeviceControlCard
                    key={device.id}
                    device={device}
                    onToggle={() => console.log('Device control not implemented')}
                    isLoading={false}
                  />
                ))}
              </div>
            )}

            {/* Historical Chart */}
            <TimeSeriesChart 
              data={historyData || []} 
              title={`${selectedSensor.name} - Historical Data`} 
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
