"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Router, Smartphone } from "lucide-react"

interface NetworkDevice {
  id: string
  name: string
  ipAddress: string
  status: string
  signalStrength: number
  lastSeen: string
  dataUsage: string
}

interface NetworkTopologyProps {
  devices: NetworkDevice[]
}

export function NetworkTopology({ devices }: NetworkTopologyProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "disconnected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "unstable":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getSignalStrength = (strength: number) => {
    if (strength > -50) return { bars: 4, quality: "Excellent" }
    if (strength > -60) return { bars: 3, quality: "Good" }
    if (strength > -70) return { bars: 2, quality: "Fair" }
    return { bars: 1, quality: "Poor" }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Topology</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Router/Gateway */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex flex-col items-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <Router className="h-8 w-8 text-primary mb-2" />
                <div className="text-sm font-medium">WiFi Router</div>
                <div className="text-xs text-muted-foreground">192.168.1.1</div>
                <Badge className="mt-1 bg-green-100 text-green-800">Online</Badge>
              </div>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="flex justify-center">
            <div className="w-px h-8 bg-border"></div>
          </div>

          {/* Devices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.map((device) => {
              const signal = getSignalStrength(device.signalStrength)
              return (
                <div key={device.id} className="relative">
                  {/* Connection line to router */}
                  <div className="absolute -top-8 left-1/2 w-px h-8 bg-border transform -translate-x-1/2"></div>

                  <div className="flex flex-col items-center p-3 bg-card rounded-lg border">
                    <div className="relative mb-2">
                      <Smartphone className="h-6 w-6 text-muted-foreground" />
                      {/* Signal strength indicator */}
                      <div className="absolute -top-1 -right-1 flex space-x-px">
                        {Array.from({ length: 4 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-current ${i < signal.bars ? "text-green-500" : "text-gray-300"}`}
                            style={{ height: `${(i + 1) * 2 + 2}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-xs font-medium text-center mb-1">{device.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">{device.ipAddress}</div>

                    <Badge className={getStatusColor(device.status)} variant="outline">
                      {device.status}
                    </Badge>

                    <div className="text-xs text-muted-foreground mt-1">{device.signalStrength}dBm</div>
                    <div className="text-xs text-muted-foreground">{signal.quality}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Network Statistics */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{devices.length}</div>
                <div className="text-xs text-muted-foreground">Total Devices</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {devices.filter((d) => d.status === "connected").length}
                </div>
                <div className="text-xs text-muted-foreground">Connected</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-600">
                  {devices.filter((d) => d.status === "unstable").length}
                </div>
                <div className="text-xs text-muted-foreground">Unstable</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-600">
                  {devices.filter((d) => d.status === "disconnected").length}
                </div>
                <div className="text-xs text-muted-foreground">Offline</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
