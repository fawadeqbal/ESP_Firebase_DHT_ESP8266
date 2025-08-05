"use client"

import { useState } from "react"
import { Bell, Plus, AlertTriangle, CheckCircle, XCircle, Settings, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AlertRuleForm } from "@/components/alert-rule-form"
import { NotificationSettings } from "@/components/notification-settings"
import { useAlertsData } from "@/hooks/use-alerts-data"

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)
  const { alerts, alertRules, loading, createAlert, updateAlert, deleteAlert, acknowledgeAlert } = useAlertsData()

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Alert Management</h1>
            <p className="text-muted-foreground">Monitor system alerts and configure notification rules</p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>
                <NotificationSettings />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Alert Rule</DialogTitle>
                </DialogHeader>
                <AlertRuleForm onSubmit={createAlert} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts?.filter((a) => a.status === "active").length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts?.filter((a) => a.severity === "critical").length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts?.filter((a) => a.severity === "warning").length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alert Rules</CardTitle>
              <Settings className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alertRules?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Alerts</TabsTrigger>
            <TabsTrigger value="history">Alert History</TabsTrigger>
            <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Triggered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts
                      ?.filter((alert) => alert.status === "active")
                      .map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getAlertIcon(alert.severity)}
                              <div>
                                <div className="font-medium">{alert.title}</div>
                                <div className="text-xs text-muted-foreground">{alert.description}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>{alert.source}</TableCell>
                          <TableCell>{alert.triggeredAt}</TableCell>
                          <TableCell>
                            <Badge variant={alert.acknowledged ? "secondary" : "destructive"}>
                              {alert.acknowledged ? "Acknowledged" : "New"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {!alert.acknowledged && (
                                <Button variant="outline" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                                  Acknowledge
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alert History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Triggered</TableHead>
                      <TableHead>Resolved</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts
                      ?.filter((alert) => alert.status === "resolved")
                      .map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getAlertIcon(alert.severity)}
                              <div>
                                <div className="font-medium">{alert.title}</div>
                                <div className="text-xs text-muted-foreground">{alert.description}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>{alert.source}</TableCell>
                          <TableCell>{alert.triggeredAt}</TableCell>
                          <TableCell>{alert.resolvedAt}</TableCell>
                          <TableCell>{alert.duration}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alert Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Enabled</TableHead>
                      <TableHead>Last Triggered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertRules?.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>{rule.condition}</TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(rule.severity)}>{rule.severity.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) => updateAlert(rule.id, { enabled: checked })}
                          />
                        </TableCell>
                        <TableCell>{rule.lastTriggered || "Never"}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
