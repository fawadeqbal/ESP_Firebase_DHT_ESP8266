"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    emailAddress: "user@example.com",
    smsEnabled: false,
    phoneNumber: "",
    pushEnabled: true,
    criticalAlertsOnly: false,
  })

  const handleSave = () => {
    console.log("Saving notification settings:", settings)
    // Here you would typically save to your backend
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="critical-only"
              checked={settings.criticalAlertsOnly}
              onCheckedChange={(checked) => setSettings({ ...settings, criticalAlertsOnly: checked })}
            />
            <Label htmlFor="critical-only">Only notify for Critical alerts</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            If enabled, you will only receive notifications for alerts marked as "Critical" severity.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="email-enabled"
              checked={settings.emailEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, emailEnabled: checked })}
            />
            <Label htmlFor="email-enabled">Enable Email Notifications</Label>
          </div>
          {settings.emailEnabled && (
            <div className="space-y-2">
              <Label htmlFor="email-address">Email Address</Label>
              <Input
                id="email-address"
                type="email"
                value={settings.emailAddress}
                onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
                placeholder="your@example.com"
                required
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="sms-enabled"
              checked={settings.smsEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, smsEnabled: checked })}
            />
            <Label htmlFor="sms-enabled">Enable SMS Notifications</Label>
          </div>
          {settings.smsEnabled && (
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Standard SMS rates may apply. Ensure your phone number is correct.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="push-enabled"
              checked={settings.pushEnabled}
              onCheckedChange={(checked) => setSettings({ ...settings, pushEnabled: checked })}
            />
            <Label htmlFor="push-enabled">Enable Push Notifications</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Receive instant notifications directly to your browser or mobile device (if supported).
          </p>
          {settings.pushEnabled && (
            <Button variant="outline" className="w-full bg-transparent">
              Manage Push Subscriptions
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}
