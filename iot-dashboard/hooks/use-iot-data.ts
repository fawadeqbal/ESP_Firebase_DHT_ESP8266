"use client"

import { useState, useEffect, useCallback } from "react"
import type { DashboardResponse, Sensor, HealthStatus } from "@/types/sensor"

export function useIoTData() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null)
  const [healthData, setHealthData] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceLoading, setDeviceLoading] = useState<string | null>(null)

  // Mock data generation
  const generateMockData = useCallback((): DashboardResponse => {
    const sensors: Sensor[] = [
      {
        id: "sensor1",
        name: "Living Room Sensor",
        location: "Living Room",
        type: "DHT22",
        status: "online",
        current: {
          temperature: 23.5 + Math.random() * 3,
          humidity: 45 + Math.random() * 15,
          timestamp: Math.floor(Date.now() / 1000),
          reading_number: Math.floor(Math.random() * 1000) + 1000,
          battery_level: 85 + Math.random() * 15,
          signal_strength: -45 - Math.random() * 20,
        },
        statistics: {
          min_temperature: 18.2,
          max_temperature: 28.7,
          avg_temperature: 23.1,
          min_humidity: 35.1,
          max_humidity: 68.9,
          avg_humidity: 52.3,
          total_readings: 1247,
          session_duration: "2h 34m",
          sessionDurationFormatted: "2 hours 34 minutes",
          last_update: new Date().toISOString(),
          lastUpdateFormatted: new Date().toLocaleString(),
        },
        devices: [
          {
            id: "device1",
            name: "Living Room Light",
            type: "led",
            status: "on",
            power_consumption: 12,
            last_updated: "2 minutes ago",
            sensor_id: "sensor1",
            description: "Smart LED bulb with dimming",
          },
          {
            id: "device2",
            name: "Ceiling Fan",
            type: "fan",
            status: "off",
            power_consumption: 45,
            last_updated: "5 minutes ago",
            sensor_id: "sensor1",
            description: "Variable speed ceiling fan",
          },
        ],
        last_seen: "2 minutes ago",
      },
      {
        id: "sensor2",
        name: "Kitchen Sensor",
        location: "Kitchen",
        type: "DHT11",
        status: "online",
        current: {
          temperature: 25.2 + Math.random() * 4,
          humidity: 55 + Math.random() * 20,
          timestamp: Math.floor(Date.now() / 1000),
          reading_number: Math.floor(Math.random() * 1000) + 2000,
          battery_level: 92,
          signal_strength: -38,
        },
        statistics: {
          min_temperature: 20.1,
          max_temperature: 32.4,
          avg_temperature: 25.8,
          min_humidity: 40.2,
          max_humidity: 75.6,
          avg_humidity: 58.1,
          total_readings: 892,
          session_duration: "1h 45m",
          sessionDurationFormatted: "1 hour 45 minutes",
          last_update: new Date().toISOString(),
          lastUpdateFormatted: new Date().toLocaleString(),
        },
        devices: [
          {
            id: "device3",
            name: "Exhaust Fan",
            type: "fan",
            status: "on",
            power_consumption: 35,
            last_updated: "1 minute ago",
            sensor_id: "sensor2",
            description: "Kitchen ventilation fan",
          },
          {
            id: "device4",
            name: "Water Pump",
            type: "pump",
            status: "off",
            power_consumption: 120,
            last_updated: "10 minutes ago",
            sensor_id: "sensor2",
            description: "Water circulation pump",
          },
        ],
        last_seen: "1 minute ago",
      },
      {
        id: "sensor3",
        name: "Bedroom Sensor",
        location: "Master Bedroom",
        type: "DHT22",
        status: "warning",
        current: {
          temperature: 21.8 + Math.random() * 2,
          humidity: 42 + Math.random() * 10,
          timestamp: Math.floor(Date.now() / 1000),
          reading_number: Math.floor(Math.random() * 1000) + 3000,
          battery_level: 23,
          signal_strength: -72,
        },
        statistics: {
          min_temperature: 19.5,
          max_temperature: 26.3,
          avg_temperature: 22.1,
          min_humidity: 38.7,
          max_humidity: 58.2,
          avg_humidity: 45.8,
          total_readings: 654,
          session_duration: "3h 12m",
          sessionDurationFormatted: "3 hours 12 minutes",
          last_update: new Date().toISOString(),
          lastUpdateFormatted: new Date().toLocaleString(),
        },
        devices: [
          {
            id: "device5",
            name: "Night Light",
            type: "led",
            status: "on",
            power_consumption: 5,
            last_updated: "3 minutes ago",
            sensor_id: "sensor3",
            description: "Ambient night lighting",
          },
          {
            id: "device6",
            name: "Space Heater",
            type: "heater",
            status: "off",
            power_consumption: 800,
            last_updated: "15 minutes ago",
            sensor_id: "sensor3",
            description: "Portable electric heater",
          },
        ],
        last_seen: "8 minutes ago",
      },
      {
        id: "sensor4",
        name: "Garden Sensor",
        location: "Outdoor Garden",
        type: "Weatherproof DHT22",
        status: "offline",
        current: {
          temperature: 18.5,
          humidity: 68,
          timestamp: Math.floor(Date.now() / 1000) - 1800,
          reading_number: 4234,
          battery_level: 5,
          signal_strength: -85,
        },
        statistics: {
          min_temperature: 12.3,
          max_temperature: 35.7,
          avg_temperature: 22.4,
          min_humidity: 25.1,
          max_humidity: 95.8,
          avg_humidity: 62.3,
          total_readings: 2156,
          session_duration: "6h 23m",
          sessionDurationFormatted: "6 hours 23 minutes",
          last_update: new Date(Date.now() - 1800000).toISOString(),
          lastUpdateFormatted: new Date(Date.now() - 1800000).toLocaleString(),
        },
        devices: [
          {
            id: "device7",
            name: "Garden Sprinkler",
            type: "pump",
            status: "off",
            power_consumption: 200,
            last_updated: "30 minutes ago",
            sensor_id: "sensor4",
            description: "Automated irrigation system",
          },
          {
            id: "device8",
            name: "Garden Light",
            type: "led",
            status: "off",
            power_consumption: 25,
            last_updated: "30 minutes ago",
            sensor_id: "sensor4",
            description: "Outdoor LED spotlight",
          },
        ],
        last_seen: "30 minutes ago",
      },
    ]

    const totalDevices = sensors.reduce((acc, sensor) => acc + sensor.devices.length, 0)
    const activeDevices = sensors.reduce(
      (acc, sensor) => acc + sensor.devices.filter((device) => device.status === "on").length,
      0,
    )
    const totalReadings = sensors.reduce((acc, sensor) => acc + sensor.statistics.total_readings, 0)

    return {
      sensors,
      totalDevices,
      activeDevices,
      totalReadings,
    }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const mockData = generateMockData()
      setDashboardData(mockData)

      // Mock health data
      const mockHealth: HealthStatus = {
        status: mockData.sensors.some((s) => s.status === "offline") ? "warning" : "healthy",
        uptime: "2d 14h 23m",
        lastReading: "1 minute ago",
        message: "All systems operational",
        sensors_online: mockData.sensors.filter((s) => s.status === "online").length,
        total_sensors: mockData.sensors.length,
      }
      setHealthData(mockHealth)
    } catch (err) {
      setError("Failed to fetch IoT data")
    } finally {
      setLoading(false)
    }
  }, [generateMockData])

  const toggleDevice = useCallback(
    async (deviceId: string, status: "on" | "off") => {
      if (!dashboardData) return

      setDeviceLoading(deviceId)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setDashboardData((prev) => {
        if (!prev) return prev

        return {
          ...prev,
          sensors: prev.sensors.map((sensor) => ({
            ...sensor,
            devices: sensor.devices.map((device) =>
              device.id === deviceId ? { ...device, status, last_updated: "Just now" } : device,
            ),
          })),
          activeDevices: prev.sensors
            .flatMap((s) => s.devices.map((d) => (d.id === deviceId ? { ...d, status } : d)))
            .filter((d) => d.status === "on").length,
        }
      })

      setDeviceLoading(null)
    },
    [dashboardData],
  )

  const refreshData = useCallback(async () => {
    setLoading(true)
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()

    // Set up refresh interval
    const interval = setInterval(fetchData, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchData])

  return {
    dashboardData,
    healthData,
    loading,
    error,
    deviceLoading,
    refreshData,
    toggleDevice,
  }
}
