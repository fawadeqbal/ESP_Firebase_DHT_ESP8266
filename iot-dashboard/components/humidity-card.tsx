"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets } from "lucide-react"
import type { SensorCurrent } from "@/types/sensor"
import { cn } from "@/lib/utils"

interface HumidityCardProps {
  current: SensorCurrent
}

export function HumidityCard({ current }: HumidityCardProps) {
  const getHumidityColor = (humidity: number) => {
    if (humidity > 70) return "text-blue-600"
    if (humidity > 40) return "text-green-500"
    return "text-orange-500"
  }

  const getHumidityStatus = (humidity: number) => {
    if (humidity > 70) return "High"
    if (humidity > 40) return "Optimal"
    if (humidity > 20) return "Low"
    return "Very Low"
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Humidity</CardTitle>
        <Droplets className={cn("h-4 w-4", getHumidityColor(current.humidity))} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn("text-2xl font-bold", getHumidityColor(current.humidity))}>
            {current.humidity.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">{getHumidityStatus(current.humidity)}</div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Reading #{current.reading_number}</p>

        {/* Humidity level indicator */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                getHumidityColor(current.humidity).replace("text-", "bg-"),
              )}
              style={{ width: `${current.humidity}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
