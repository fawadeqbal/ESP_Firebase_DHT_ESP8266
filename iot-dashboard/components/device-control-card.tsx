"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Lightbulb, Fan, HeaterIcon, Droplets, Settings, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Device } from "@/types/sensor"
import { cn } from "@/lib/utils"

interface DeviceControlCardProps {
  device: Device
  onToggle: (deviceId: string, status: "on" | "off") => void
  isLoading?: boolean
}

export function DeviceControlCard({ device, onToggle, isLoading }: DeviceControlCardProps) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "led":
        return Lightbulb
      case "fan":
        return Fan
      case "heater":
        return HeaterIcon
      case "pump":
        return Droplets
      case "relay":
        return Zap
      default:
        return Settings
    }
  }

  const getDeviceColor = (type: string, status: string) => {
    if (status === "off") return "text-gray-400"

    switch (type) {
      case "led":
        return "text-yellow-500"
      case "fan":
        return "text-blue-500"
      case "heater":
        return "text-red-500"
      case "pump":
        return "text-blue-600"
      case "relay":
        return "text-green-500"
      default:
        return "text-gray-500"
    }
  }

  const DeviceIcon = getDeviceIcon(device.type)

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <DeviceIcon className={cn("h-5 w-5", getDeviceColor(device.type, device.status))} />
          <CardTitle className="text-sm font-medium">{device.name}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={device.status === "on" ? "default" : "secondary"}>{device.status.toUpperCase()}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Schedule</DropdownMenuItem>
              <DropdownMenuItem>Configure</DropdownMenuItem>
              <DropdownMenuItem>View Logs</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {device.description && <p className="text-xs text-muted-foreground">{device.description}</p>}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Power Control</div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={device.status === "on"}
                onCheckedChange={(checked) => onToggle(device.id, checked ? "on" : "off")}
                disabled={isLoading}
              />
              <span className="text-sm font-medium">{device.status === "on" ? "ON" : "OFF"}</span>
            </div>
          </div>

          {device.power_consumption && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Power Usage</div>
              <div className="text-sm font-medium">{device.power_consumption}W</div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">Last updated: {device.last_updated}</div>
      </CardContent>

      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}
    </Card>
  )
}
