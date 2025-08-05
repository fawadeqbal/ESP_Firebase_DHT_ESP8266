"use client"

import { useState, useEffect, useCallback } from "react"
import type { Sensor } from "@/types/sensor"

const API_BASE_URL = "http://localhost:8000/api"

export function useSensorsData() {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSensors = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all sensors from your backend
      const response = await fetch(`${API_BASE_URL}/sensors`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        // Transform the API response to match the Sensor interface
        const transformedSensors: Sensor[] = Object.entries(result.data).map(([sensorId, sensorData]: [string, any]) => ({
          id: sensorId,
          name: `${sensorId.charAt(0).toUpperCase() + sensorId.slice(1)} DHT Sensor`,
          location: "ESP8266 Device",
          type: "DHT11/DHT22",
          status: "online" as const,
          current: {
            temperature: sensorData.temperature,
            humidity: sensorData.humidity,
            timestamp: sensorData.timestamp,
            reading_number: sensorData.reading_number,
            battery_level: 90, // Mock battery level
            signal_strength: -45, // Mock signal strength
          },
          statistics: {
            min_temperature: 0,
            max_temperature: 0,
            avg_temperature: 0,
            min_humidity: 0,
            max_humidity: 0,
            avg_humidity: 0,
            total_readings: 0,
            session_duration: "Unknown",
            sessionDurationFormatted: "Unknown",
            last_update: new Date().toISOString(),
            lastUpdateFormatted: sensorData.formattedTime || new Date().toLocaleString(),
          },
          devices: [],
          last_seen: sensorData.formattedTime || "Just now",
        }))

        // If no sensors found, try to get individual sensor data
        if (transformedSensors.length === 0) {
          const sensorResponse = await fetch(`${API_BASE_URL}/sensors/sensor1/current`)
          if (sensorResponse.ok) {
            const sensorResult = await sensorResponse.json()
            if (sensorResult.success) {
              const statsResponse = await fetch(`${API_BASE_URL}/sensors/sensor1/statistics`)
              let statistics = {
                min_temperature: 0,
                max_temperature: 0,
                avg_temperature: 0,
                min_humidity: 0,
                max_humidity: 0,
                avg_humidity: 0,
                total_readings: 0,
                session_duration: "Unknown",
                sessionDurationFormatted: "Unknown",
                last_update: new Date().toISOString(),
                lastUpdateFormatted: new Date().toLocaleString(),
              }

              if (statsResponse.ok) {
                const statsResult = await statsResponse.json()
                if (statsResult.success) {
                  statistics = {
                    min_temperature: statsResult.data.min_temperature,
                    max_temperature: statsResult.data.max_temperature,
                    avg_temperature: statsResult.data.avg_temperature,
                    min_humidity: statsResult.data.min_humidity,
                    max_humidity: statsResult.data.max_humidity,
                    avg_humidity: statsResult.data.avg_humidity,
                    total_readings: statsResult.data.total_readings,
                    session_duration: statsResult.data.session_duration || "Unknown",
                    sessionDurationFormatted: statsResult.data.sessionDurationFormatted || "Unknown",
                    last_update: statsResult.data.last_update,
                    lastUpdateFormatted: statsResult.data.lastUpdateFormatted,
                  }
                }
              }

              const singleSensor: Sensor = {
                id: "sensor1",
                name: "ESP8266 DHT Sensor",
                location: "IoT Device",
                type: "DHT11/DHT22",
                status: "online",
                current: {
                  temperature: sensorResult.data.temperature,
                  humidity: sensorResult.data.humidity,
                  timestamp: sensorResult.data.timestamp,
                  reading_number: sensorResult.data.reading_number,
                  battery_level: 90,
                  signal_strength: -45,
                },
                statistics,
                devices: [],
                last_seen: "Just now",
              }
              
              setSensors([singleSensor])
            }
          } else {
            throw new Error('No sensors found')
          }
        } else {
          setSensors(transformedSensors)
        }
      } else {
        throw new Error(result.message || 'Failed to fetch sensors')
      }
    } catch (err) {
      console.error('Sensors fetch error:', err)
      setError(err instanceof Error ? err.message : "Failed to fetch sensors")
      
      // Fallback to empty array on error
      setSensors([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSensors()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchSensors, 30000)
    
    return () => clearInterval(interval)
  }, [fetchSensors])

  const addSensor = async (sensorData: any) => {
    try {
      // For now, this is not supported by your current API
      // You would need to implement sensor registration endpoint
      console.log("Adding sensor:", sensorData)
      throw new Error("Add sensor functionality not yet implemented in backend API")
    } catch (err) {
      console.error("Add sensor error:", err)
      throw err
    }
  }

  const updateSensor = async (id: string, data: any) => {
    try {
      // For now, this is not supported by your current API
      // You would need to implement sensor update endpoint
      console.log("Updating sensor:", id, data)
      throw new Error("Update sensor functionality not yet implemented in backend API")
    } catch (err) {
      console.error("Update sensor error:", err)
      throw err
    }
  }

  const deleteSensor = async (id: string) => {
    try {
      // For now, this is not supported by your current API
      // You would need to implement sensor deletion endpoint
      console.log("Deleting sensor:", id)
      throw new Error("Delete sensor functionality not yet implemented in backend API")
    } catch (err) {
      console.error("Delete sensor error:", err)
      throw err
    }
  }

  const refreshSensors = useCallback(() => {
    fetchSensors()
  }, [fetchSensors])

  return { 
    sensors, 
    loading, 
    error,
    addSensor, 
    updateSensor, 
    deleteSensor,
    refreshSensors
  }
}
