"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function StorageSettings() {
  const [settings, setSettings] = useState({
    autoCleanup: true,
    compressionEnabled: true,
    retentionPeriod: "30",
    backupEnabled: true,
    backupFrequency: "daily",
    maxStorageSize: "10",
    alertThreshold: "80",
  })

  const handleSave = () => {
    console.log("Saving storage settings:", settings)
    // Here you would typically save to your backend
  }

  return (
    <Tabs defaultValue="retention" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="retention">Retention</TabsTrigger>
        <TabsTrigger value="backup">Backup</TabsTrigger>
        <TabsTrigger value="optimization">Optimization</TabsTrigger>
      </TabsList>

      <TabsContent value="retention" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Retention Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retention-period">Default Retention Period (days)</Label>
              <Input
                id="retention-period"
                type="number"
                value={settings.retentionPeriod}
                onChange={(e) => setSettings({ ...settings, retentionPeriod: e.target.value })}
                placeholder="30"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Data Type Specific Retention</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Real-time Data</Label>
                  <Select defaultValue="7">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Hourly Aggregates</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Daily Summaries</Label>
                  <Select defaultValue="365">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="1095">3 years</SelectItem>
                      <SelectItem value="-1">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Device Logs</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-cleanup"
                checked={settings.autoCleanup}
                onCheckedChange={(checked) => setSettings({ ...settings, autoCleanup: checked })}
              />
              <Label htmlFor="auto-cleanup">Enable automatic cleanup</Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="backup" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Backup Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="backup-enabled"
                checked={settings.backupEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, backupEnabled: checked })}
              />
              <Label htmlFor="backup-enabled">Enable automatic backups</Label>
            </div>

            {settings.backupEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select
                    value={settings.backupFrequency}
                    onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Backup Location</Label>
                  <Select defaultValue="local">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="external">External Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Backup Retention</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 backups</SelectItem>
                      <SelectItem value="30">30 backups</SelectItem>
                      <SelectItem value="90">90 backups</SelectItem>
                      <SelectItem value="-1">Keep all</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="optimization" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Storage Optimization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="compression"
                checked={settings.compressionEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, compressionEnabled: checked })}
              />
              <Label htmlFor="compression">Enable data compression</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-storage">Maximum Storage Size (GB)</Label>
              <Input
                id="max-storage"
                type="number"
                value={settings.maxStorageSize}
                onChange={(e) => setSettings({ ...settings, maxStorageSize: e.target.value })}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alert-threshold">Storage Alert Threshold (%)</Label>
              <Input
                id="alert-threshold"
                type="number"
                value={settings.alertThreshold}
                onChange={(e) => setSettings({ ...settings, alertThreshold: e.target.value })}
                placeholder="80"
                min="1"
                max="100"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Optimization Schedule</h4>

              <div className="space-y-2">
                <Label>Cleanup Schedule</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every hour</SelectItem>
                    <SelectItem value="daily">Daily at 2:00 AM</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="manual">Manual only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Compression Schedule</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="manual">Manual only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </Tabs>
  )
}
