"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { SensorCurrent } from "@/types/sensor"
import { cn } from "@/lib/utils"

interface TemperatureCardProps {
  current: SensorCurrent
  previousReading?: number
}

export function TemperatureCard({ current, previousReading }: TemperatureCardProps) {
  const getTrend = () => {
    if (!previousReading) return "stable"
    const diff = current.temperature - previousReading
    if (diff > 0.5) return "up"
    if (diff < -0.5) return "down"
    return "stable"
  }

  const trend = getTrend()
  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  }
  const TrendIcon = trendIcons[trend]

  const getTemperatureColor = (temp: number) => {
    if (temp > 30) return "text-red-500"
    if (temp > 20) return "text-orange-500"
    if (temp > 10) return "text-yellow-500"
    return "text-blue-500"
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Temperature</CardTitle>
        <Thermometer className={cn("h-4 w-4", getTemperatureColor(current.temperature))} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className={cn("text-2xl font-bold", getTemperatureColor(current.temperature))}>
            {current.temperature.toFixed(1)}°C
          </div>
          <div
            className={cn(
              "flex items-center text-xs",
              trend === "up" ? "text-red-500" : trend === "down" ? "text-blue-500" : "text-gray-500",
            )}
          >
            <TrendIcon className="h-3 w-3 mr-1" />
            {trend}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {new Date(current.timestamp).toLocaleTimeString()}
        </p>

        {/* Temperature gauge background */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 opacity-20" />
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 transition-all duration-500"
          style={{ width: `${Math.min(Math.max(((current.temperature + 10) / 50) * 100, 0), 100)}%` }}
        />
      </CardContent>
    </Card>
  )
}
