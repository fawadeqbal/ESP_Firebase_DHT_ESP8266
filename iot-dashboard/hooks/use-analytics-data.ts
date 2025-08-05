"use client"

import { useState, useEffect } from "react"

export function useAnalyticsData(sensorId: string, timeRange: string) {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock analytics data
    const mockData = {
      trends: Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 30,
      })),
      metrics: [
        { sensor: "Living Room", avgTemp: 23.4, avgHumidity: 52.1, readings: 1247 },
        { sensor: "Kitchen", avgTemp: 25.8, avgHumidity: 58.3, readings: 892 },
        { sensor: "Bedroom", avgTemp: 22.1, avgHumidity: 45.7, readings: 654 },
        { sensor: "Garden", avgTemp: 18.9, avgHumidity: 68.2, readings: 423 },
      ],
      heatmap: Array.from({ length: 7 }, (_, day) =>
        Array.from({ length: 24 }, (_, hour) => ({
          day,
          hour,
          value: Math.random() * 100,
        })),
      ).flat(),
    }

    setAnalyticsData(mockData)
    setLoading(false)
  }, [sensorId, timeRange])

  const exportData = async () => {
    // Mock export functionality
    console.log("Exporting analytics data...")
  }

  return { analyticsData, loading, exportData }
}
