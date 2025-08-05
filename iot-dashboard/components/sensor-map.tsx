"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Sensor } from "@/types/sensor"

interface SensorMapProps {
  sensors: Sensor[]
}

export function SensorMap({ sensors }: SensorMapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Interactive map view</p>
            <p className="text-sm text-muted-foreground mt-1">Showing {sensors.length} sensors</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
