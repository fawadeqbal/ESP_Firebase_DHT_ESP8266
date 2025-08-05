"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HeatmapChartProps {
  data: any[]
}

export function HeatmapChart({ data }: HeatmapChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-24 gap-1">
          {Array.from({ length: 168 }, (_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm bg-blue-100 dark:bg-blue-900"
              style={{
                opacity: Math.random(),
              }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Less</span>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
