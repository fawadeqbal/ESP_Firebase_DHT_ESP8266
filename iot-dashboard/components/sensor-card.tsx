"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Battery, Wifi, MapPin, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Sensor } from "@/types/sensor"
import { cn } from "@/lib/utils"

interface SensorCardProps {
  sensor: Sensor
  onSelect: (sensorId: string) => void
  isSelected: boolean
}

export function SensorCard({ sensor, onSelect, isSelected }: SensorCardProps) {
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

  const getSignalStrength = (strength?: number) => {
    if (!strength) return "Unknown"
    if (strength > -50) return "Excellent"
    if (strength > -60) return "Good"
    if (strength > -70) return "Fair"
    return "Poor"
  }

  return (
    <Card
      className={cn("cursor-pointer transition-all hover:shadow-md", isSelected && "ring-2 ring-primary")}
      onClick={() => onSelect(sensor.id)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {sensor.location}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getStatusColor(sensor.status)}>{sensor.status.toUpperCase()}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Configure</DropdownMenuItem>
              <DropdownMenuItem>Reset</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <div>
              <div className="text-lg font-semibold">{sensor.current.temperature.toFixed(1)}°C</div>
              <div className="text-xs text-muted-foreground">Temperature</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-lg font-semibold">{sensor.current.humidity.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Humidity</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Battery className="h-3 w-3" />
            <span>{sensor.current.battery_level || 100}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wifi className="h-3 w-3" />
            <span>{getSignalStrength(sensor.current.signal_strength)}</span>
          </div>
          <div>{sensor.devices.length} devices</div>
        </div>

        <div className="text-xs text-muted-foreground">Last seen: {sensor.last_seen}</div>
      </CardContent>
    </Card>
  )
}
