"use client"

import { useState, useEffect, useCallback } from "react"
import type { DashboardResponse, HistoricalReading, HealthStatus } from "@/types/sensor"

export function useSensorData(sensorId = "sensor1") {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null)
  const [historyData, setHistoryData] = useState<HistoricalReading[]>([])
  const [healthData, setHealthData] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real API calls to your ESP8266 sensor data
  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/sensors/${sensorId}/dashboard`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      
      if (result.success) {
        setDashboardData(result.data)
        setError(null)
      } else {
        throw new Error(result.message || 'Failed to fetch dashboard data')
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
    }
  }, [sensorId])

  const fetchHistoryData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/sensors/${sensorId}/history?limit=48`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      
      if (result.success) {
        setHistoryData(result.data || [])
        setError(null)
      } else {
        throw new Error(result.message || 'Failed to fetch history data')
      }
    } catch (err) {
      console.error('History fetch error:', err)
      setError(err instanceof Error ? err.message : "Failed to fetch history data")
    }
  }, [sensorId])

  const fetchHealthData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/sensors/health`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      
      if (result.success) {
        const healthStatus: HealthStatus = {
          status: "healthy",
          uptime: `${Math.floor(result.uptime / 3600)}h ${Math.floor((result.uptime % 3600) / 60)}m`,
          lastReading: "Just now",
          message: result.message,
          sensors_online: 1,
          total_sensors: 1
        }
        setHealthData(healthStatus)
        setError(null)
      } else {
        throw new Error(result.message || 'Failed to fetch health data')
      }
    } catch (err) {
      console.error('Health fetch error:', err)
      const errorHealth: HealthStatus = {
        status: "error",
        uptime: "Unknown",
        lastReading: "Connection failed",
        message: "Unable to connect to sensor API",
        sensors_online: 0,
        total_sensors: 1
      }
      setHealthData(errorHealth)
      setError(err instanceof Error ? err.message : "Failed to fetch health data")
    }
  }, [])

  const exportData = useCallback(async () => {
    // Mock CSV export
    const csvContent = historyData
      .map((reading) => `${reading.formattedTime},${reading.temperature},${reading.humidity},${reading.reading_number}`)
      .join("\n")

    const blob = new Blob([`Time,Temperature,Humidity,Reading Number\n${csvContent}`], {
      type: "text/csv",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sensor-data-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [historyData])

  const refreshData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([fetchDashboardData(), fetchHistoryData(), fetchHealthData()])
    } finally {
      setLoading(false)
    }
  }, [fetchDashboardData, fetchHistoryData, fetchHealthData])

  useEffect(() => {
    refreshData()

    // Set up refresh interval
    const interval = setInterval(refreshData, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [refreshData])

  return {
    dashboardData,
    historyData,
    healthData,
    loading,
    error,
    refreshData,
    exportData,
  }
}
