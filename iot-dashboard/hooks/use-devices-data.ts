"use client"

import { useState, useEffect } from "react"
import type { Device } from "@/types/sensor"

export function useDevicesData() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock device data
    const mockDevices: Device[] = [
      {
        id: "device1",
        name: "Living Room Light",
        type: "led",
        status: "on",
        power_consumption: 12,
        last_updated: "2 minutes ago",
        sensor_id: "sensor1",
        description: "Smart LED bulb with dimming",
      },
      {
        id: "device2",
        name: "Ceiling Fan",
        type: "fan",
        status: "off",
        power_consumption: 45,
        last_updated: "5 minutes ago",
        sensor_id: "sensor1",
        description: "Variable speed ceiling fan",
      },
      {
        id: "device3",
        name: "Kitchen Exhaust Fan",
        type: "fan",
        status: "on",
        power_consumption: 35,
        last_updated: "1 minute ago",
        sensor_id: "sensor2",
        description: "Kitchen ventilation fan",
      },
      {
        id: "device4",
        name: "Water Pump",
        type: "pump",
        status: "off",
        power_consumption: 120,
        last_updated: "10 minutes ago",
        sensor_id: "sensor2",
        description: "Water circulation pump",
      },
      {
        id: "device5",
        name: "Night Light",
        type: "led",
        status: "on",
        power_consumption: 5,
        last_updated: "3 minutes ago",
        sensor_id: "sensor3",
        description: "Ambient night lighting",
      },
      {
        id: "device6",
        name: "Space Heater",
        type: "heater",
        status: "off",
        power_consumption: 800,
        last_updated: "15 minutes ago",
        sensor_id: "sensor3",
        description: "Portable electric heater",
      },
      {
        id: "device7",
        name: "Garden Sprinkler",
        type: "pump",
        status: "off",
        power_consumption: 200,
        last_updated: "30 minutes ago",
        sensor_id: "sensor4",
        description: "Automated irrigation system",
      },
      {
        id: "device8",
        name: "Garden Light",
        type: "led",
        status: "off",
        power_consumption: 25,
        last_updated: "30 minutes ago",
        sensor_id: "sensor4",
        description: "Outdoor LED spotlight",
      },
    ]

    setDevices(mockDevices)
    setLoading(false)
  }, [])

  const toggleDevice = async (deviceId: string, status: "on" | "off") => {
    setDevices((prev) =>
      prev.map((device) => (device.id === deviceId ? { ...device, status, last_updated: "Just now" } : device)),
    )
  }

  const addDevice = async (deviceData: any) => {
    const newDevice: Device = {
      id: `device${devices.length + 1}`,
      name: deviceData.name,
      type: deviceData.type,
      status: "off",
      power_consumption: deviceData.powerConsumption,
      last_updated: "Just now",
      sensor_id: deviceData.sensorId,
      description: deviceData.description,
    }
    setDevices((prev) => [...prev, newDevice])
  }

  const updateDevice = async (id: string, data: any) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === id ? { ...device, ...data, last_updated: "Just now" } : device)),
    )
  }

  const deleteDevice = async (id: string) => {
    setDevices((prev) => prev.filter((device) => device.id !== id))
  }

  return {
    devices,
    loading,
    toggleDevice,
    addDevice,
    updateDevice,
    deleteDevice,
  }
}
