"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Sensor } from "@/types/sensor"

interface SensorSelectorProps {
  sensors: Sensor[]
  selectedSensorId: string
  onSensorChange: (sensorId: string) => void
}

export function SensorSelector({ sensors, selectedSensorId, onSensorChange }: SensorSelectorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "offline":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Select value={selectedSensorId} onValueChange={onSensorChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a sensor" />
      </SelectTrigger>
      <SelectContent>
        {sensors.map((sensor) => (
          <SelectItem key={sensor.id} value={sensor.id}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <span>{sensor.name}</span>
                <span className="text-xs text-muted-foreground">({sensor.location})</span>
              </div>
              <Badge className={getStatusColor(sensor.status)} variant="outline">
                {sensor.status}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
