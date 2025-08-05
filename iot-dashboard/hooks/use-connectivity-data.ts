"use client"

import { useState, useEffect } from "react"

interface NetworkDevice {
  id: string
  name: string
  ipAddress: string
  status: string
  signalStrength: number
  lastSeen: string
  dataUsage: string
}

interface NetworkData {
  connectedDevices: number
  totalDevices: number
  uptime: string
  avgSignal: string
  dataUsage: string
  devices: NetworkDevice[]
}

export function useConnectivityData() {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchNetworkData = async () => {
    try {
      // Mock network data
      const mockDevices: NetworkDevice[] = [
        {
          id: "device1",
          name: "Living Room Sensor",
          ipAddress: "192.168.1.101",
          status: "connected",
          signalStrength: -45,
          lastSeen: "2 minutes ago",
          dataUsage: "1.2 MB",
        },
        {
          id: "device2",
          name: "Kitchen Sensor",
          ipAddress: "192.168.1.102",
          status: "connected",
          signalStrength: -38,
          lastSeen: "1 minute ago",
          dataUsage: "0.8 MB",
        },
        {
          id: "device3",
          name: "Bedroom Sensor",
          ipAddress: "192.168.1.103",
          status: "unstable",
          signalStrength: -72,
          lastSeen: "8 minutes ago",
          dataUsage: "0.5 MB",
        },
        {
          id: "device4",
          name: "Garden Sensor",
          ipAddress: "192.168.1.104",
          status: "disconnected",
          signalStrength: -85,
          lastSeen: "30 minutes ago",
          dataUsage: "0.1 MB",
        },
        {
          id: "device5",
          name: "Garage Sensor",
          ipAddress: "192.168.1.105",
          status: "connected",
          signalStrength: -55,
          lastSeen: "5 minutes ago",
          dataUsage: "0.9 MB",
        },
        {
          id: "device6",
          name: "Basement Sensor",
          ipAddress: "192.168.1.106",
          status: "disconnected",
          signalStrength: -88,
          lastSeen: "2 hours ago",
          dataUsage: "0.0 MB",
        },
      ]

      const mockNetworkData: NetworkData = {
        connectedDevices: mockDevices.filter((d) => d.status === "connected").length,
        totalDevices: mockDevices.length,
        uptime: "99.9%",
        avgSignal: "-55",
        dataUsage: "2.3",
        devices: mockDevices,
      }

      setNetworkData(mockNetworkData)
    } catch (error) {
      console.error("Failed to fetch network data:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshNetwork = async () => {
    setLoading(true)
    await fetchNetworkData()
  }

  useEffect(() => {
    fetchNetworkData()

    // Set up refresh interval
    const interval = setInterval(fetchNetworkData, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    networkData,
    loading,
    refreshNetwork,
  }
}
