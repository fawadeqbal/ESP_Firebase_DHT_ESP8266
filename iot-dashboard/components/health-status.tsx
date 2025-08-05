"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import type { HealthStatus as HealthStatusType } from "@/types/sensor"

interface HealthStatusProps {
  health: HealthStatusType
}

export function HealthStatus({ health }: HealthStatusProps) {
  const getStatusIcon = () => {
    switch (health.status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (health.status) {
      case "healthy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">System Health</CardTitle>
        {getStatusIcon()}
      </CardHeader>
      <CardContent className="space-y-2">
        <Badge className={getStatusColor()}>{health.status.toUpperCase()}</Badge>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>Uptime: {health.uptime}</p>
          <p>Last Reading: {health.lastReading}</p>
          {health.message && <p className="text-xs">{health.message}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
