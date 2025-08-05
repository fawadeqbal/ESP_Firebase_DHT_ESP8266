"use client"

import { Wifi, Router, Signal, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { NetworkTopology } from "@/components/network-topology"
import { SignalStrengthChart } from "@/components/signal-strength-chart"
import { useConnectivityData } from "@/hooks/use-connectivity-data"

export default function ConnectivityPage() {
  const { networkData, loading, refreshNetwork } = useConnectivityData()

  const getSignalQuality = (strength: number) => {
    if (strength > -50) return { label: "Excellent", color: "text-green-600", value: 100 }
    if (strength > -60) return { label: "Good", color: "text-blue-600", value: 75 }
    if (strength > -70) return { label: "Fair", color: "text-yellow-600", value: 50 }
    return { label: "Poor", color: "text-red-600", value: 25 }
  }

  const getConnectionStatus = (status: string) => {
    switch (status) {
      case "connected":
        return { icon: CheckCircle, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900" }
      case "disconnected":
        return { icon: XCircle, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900" }
      case "unstable":
        return { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900" }
      default:
        return { icon: AlertTriangle, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-900" }
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Network Connectivity</h1>
            <p className="text-muted-foreground">Monitor WiFi connections and network health</p>
          </div>
          <Button onClick={refreshNetwork} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Network
          </Button>
        </div>

        {/* Network Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Devices</CardTitle>
              <Wifi className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkData?.connectedDevices || 0}</div>
              <p className="text-xs text-muted-foreground">{networkData?.totalDevices || 0} total devices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Uptime</CardTitle>
              <Router className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkData?.uptime || "99.9%"}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Signal</CardTitle>
              <Signal className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkData?.avgSignal || "-55"}dBm</div>
              <p className="text-xs text-muted-foreground">Good quality</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Usage</CardTitle>
              <Router className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{networkData?.dataUsage || "2.3"}GB</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="devices">Device Status</TabsTrigger>
            <TabsTrigger value="topology">Network Topology</TabsTrigger>
            <TabsTrigger value="signals">Signal Analysis</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Connection Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Signal Strength</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead>Data Usage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {networkData?.devices?.map((device) => {
                      const signal = getSignalQuality(device.signalStrength)
                      const status = getConnectionStatus(device.status)
                      const StatusIcon = status.icon

                      return (
                        <TableRow key={device.id}>
                          <TableCell className="font-medium">{device.name}</TableCell>
                          <TableCell>{device.ipAddress}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-16">
                                <Progress value={signal.value} className="h-2" />
                              </div>
                              <span className={`text-xs ${signal.color}`}>{device.signalStrength}dBm</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className={`h-4 w-4 ${status.color}`} />
                              <Badge className={status.bg}>{device.status}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>{device.lastSeen}</TableCell>
                          <TableCell>{device.dataUsage}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topology" className="space-y-4">
            <NetworkTopology devices={networkData?.devices || []} />
          </TabsContent>

          <TabsContent value="signals" className="space-y-4">
            <SignalStrengthChart devices={networkData?.devices || []} />
          </TabsContent>

          <TabsContent value="diagnostics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Network Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Router Connection</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Internet Access</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>DNS Resolution</span>
                      <Badge className="bg-green-100 text-green-800">Working</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bandwidth</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connection Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Garden Sensor</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Weak signal strength (-78dBm)</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">Basement Device</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Connection timeout (offline for 2h)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
