"use client"

import { useState, useEffect } from "react"

interface SensorStorage {
  id: string
  name: string
  location: string
  dataSize: number
  recordCount: number
  lastBackup: string
}

interface StorageData {
  totalStorage: number
  sensorData: number
  archivedData: number
  dailyGrowth: number
  sensorStorage: SensorStorage[]
  retentionData: Array<{
    date: string
    realTime: number
    hourly: number
    daily: number
    archived: number
  }>
}

export function useStorageData() {
  const [storageData, setStorageData] = useState<StorageData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStorageData = async () => {
    try {
      // Mock storage data
      const mockSensorStorage: SensorStorage[] = [
        {
          id: "sensor1",
          name: "Living Room Sensor",
          location: "Living Room",
          dataSize: 1024 * 1024 * 150, // 150 MB
          recordCount: 125000,
          lastBackup: "2 hours ago",
        },
        {
          id: "sensor2",
          name: "Kitchen Sensor",
          location: "Kitchen",
          dataSize: 1024 * 1024 * 120, // 120 MB
          recordCount: 98000,
          lastBackup: "2 hours ago",
        },
        {
          id: "sensor3",
          name: "Bedroom Sensor",
          location: "Master Bedroom",
          dataSize: 1024 * 1024 * 85, // 85 MB
          recordCount: 67000,
          lastBackup: "2 hours ago",
        },
        {
          id: "sensor4",
          name: "Garden Sensor",
          location: "Outdoor Garden",
          dataSize: 1024 * 1024 * 200, // 200 MB
          recordCount: 156000,
          lastBackup: "1 day ago",
        },
      ]

      // Generate retention data for the last 30 days
      const retentionData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))

        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          realTime: Math.floor(Math.random() * 100) + 50,
          hourly: Math.floor(Math.random() * 200) + 100,
          daily: Math.floor(Math.random() * 500) + 200,
          archived: Math.floor(Math.random() * 1000) + 500,
        }
      })

      const totalSensorData = mockSensorStorage.reduce((acc, sensor) => acc + sensor.dataSize, 0)
      const archivedData = totalSensorData * 0.6 // 60% archived
      const totalStorage = totalSensorData + archivedData
      const dailyGrowth = 1024 * 1024 * 25 // 25 MB per day

      const mockStorageData: StorageData = {
        totalStorage,
        sensorData: totalSensorData,
        archivedData,
        dailyGrowth,
        sensorStorage: mockSensorStorage,
        retentionData,
      }

      setStorageData(mockStorageData)
    } catch (error) {
      console.error("Failed to fetch storage data:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    // Mock export functionality
    console.log("Exporting storage data...")
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Export completed")
  }

  const deleteData = async (sensorId: string) => {
    // Mock delete functionality
    console.log("Deleting data for sensor:", sensorId)
    if (storageData) {
      setStorageData({
        ...storageData,
        sensorStorage: storageData.sensorStorage.filter((s) => s.id !== sensorId),
      })
    }
  }

  const optimizeStorage = async () => {
    // Mock optimization
    console.log("Optimizing storage...")
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log("Storage optimization completed")
  }

  useEffect(() => {
    fetchStorageData()

    // Set up refresh interval
    const interval = setInterval(fetchStorageData, 60000) // 1 minute

    return () => clearInterval(interval)
  }, [])

  return {
    storageData,
    loading,
    exportData,
    deleteData,
    optimizeStorage,
  }
}
