"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Droplets, Zap, Wifi, TrendingUp, Activity } from "lucide-react"
import type { DashboardResponse } from "@/types/sensor"

interface OverviewStatsProps {
  data: DashboardResponse
}

export function OverviewStats({ data }: OverviewStatsProps) {
  const onlineSensors = data.sensors.filter((s) => s.status === "online").length
  const avgTemperature = data.sensors.reduce((acc, s) => acc + s.current.temperature, 0) / data.sensors.length
  const avgHumidity = data.sensors.reduce((acc, s) => acc + s.current.humidity, 0) / data.sensors.length
  const powerConsumption = data.sensors
    .flatMap((s) => s.devices)
    .filter((d) => d.status === "on")
    .reduce((acc, d) => acc + (d.power_consumption || 0), 0)

  const stats = [
    {
      title: "Online Sensors",
      value: `${onlineSensors}/${data.sensors.length}`,
      icon: Wifi,
      color: "text-green-500",
      description: "Active monitoring points",
    },
    {
      title: "Avg Temperature",
      value: `${avgTemperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: "text-red-500",
      description: "Across all sensors",
    },
    {
      title: "Avg Humidity",
      value: `${avgHumidity.toFixed(1)}%`,
      icon: Droplets,
      color: "text-blue-500",
      description: "Environmental moisture",
    },
    {
      title: "Active Devices",
      value: `${data.activeDevices}/${data.totalDevices}`,
      icon: Zap,
      color: "text-yellow-500",
      description: "Currently powered on",
    },
    {
      title: "Power Usage",
      value: `${powerConsumption}W`,
      icon: Activity,
      color: "text-purple-500",
      description: "Total consumption",
    },
    {
      title: "Total Readings",
      value: data.totalReadings.toLocaleString(),
      icon: TrendingUp,
      color: "text-indigo-500",
      description: "Data points collected",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
