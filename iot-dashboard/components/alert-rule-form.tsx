"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface AlertRuleFormProps {
  onSubmit: (data: any) => void
  initialData?: {
    name: string
    condition: string
    severity: string
    notificationChannels: string[]
    enabled: boolean
  }
}

export function AlertRuleForm({ onSubmit, initialData }: AlertRuleFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      condition: "",
      severity: "warning",
      notificationChannels: ["email"],
      enabled: true,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChannelChange = (channel: string, checked: boolean) => {
    setFormData((prev) => {
      const newChannels = checked
        ? [...prev.notificationChannels, channel]
        : prev.notificationChannels.filter((c) => c !== channel)
      return { ...prev, notificationChannels: newChannels }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Rule Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., High Temperature Alert"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="condition">Condition</Label>
        <Textarea
          id="condition"
          value={formData.condition}
          onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
          placeholder="e.g., temperature > 30 AND humidity < 40"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="severity">Severity</Label>
        <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Notification Channels</Label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="channel-email"
              checked={formData.notificationChannels.includes("email")}
              onCheckedChange={(checked) => handleChannelChange("email", checked)}
            />
            <Label htmlFor="channel-email">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="channel-sms"
              checked={formData.notificationChannels.includes("sms")}
              onCheckedChange={(checked) => handleChannelChange("sms", checked)}
            />
            <Label htmlFor="channel-sms">SMS</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="channel-push"
              checked={formData.notificationChannels.includes("push")}
              onCheckedChange={(checked) => handleChannelChange("push", checked)}
            />
            <Label htmlFor="channel-push">Push Notification</Label>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="rule-enabled"
          checked={formData.enabled}
          onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
        />
        <Label htmlFor="rule-enabled">Enable Rule</Label>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Rule" : "Create Rule"}
      </Button>
    </form>
  )
}
