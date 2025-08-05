"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface DeviceConfigFormProps {
  onSubmit: (data: any) => void
}

export function DeviceConfigForm({ onSubmit }: DeviceConfigFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "led",
    sensorId: "",
    description: "",
    powerConsumption: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      powerConsumption: formData.powerConsumption ? Number.parseInt(formData.powerConsumption) : 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Device Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter device name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Device Type</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="led">LED Light</SelectItem>
            <SelectItem value="fan">Fan</SelectItem>
            <SelectItem value="heater">Heater</SelectItem>
            <SelectItem value="pump">Pump</SelectItem>
            <SelectItem value="relay">Relay</SelectItem>
            <SelectItem value="motor">Motor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sensorId">Associated Sensor</Label>
        <Select value={formData.sensorId} onValueChange={(value) => setFormData({ ...formData, sensorId: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select sensor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sensor1">Living Room Sensor</SelectItem>
            <SelectItem value="sensor2">Kitchen Sensor</SelectItem>
            <SelectItem value="sensor3">Bedroom Sensor</SelectItem>
            <SelectItem value="sensor4">Garden Sensor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="powerConsumption">Power Consumption (W)</Label>
        <Input
          id="powerConsumption"
          type="number"
          value={formData.powerConsumption}
          onChange={(e) => setFormData({ ...formData, powerConsumption: e.target.value })}
          placeholder="Enter power consumption in watts"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Optional description"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Add Device
      </Button>
    </form>
  )
}
