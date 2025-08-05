"use client"

import { Database, HardDrive, Archive, Download, Upload, Trash2, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StorageSettings } from "@/components/storage-settings"
import { DataRetentionChart } from "@/components/data-retention-chart"
import { useStorageData } from "@/hooks/use-storage-data"

export default function StoragePage() {
  const { storageData, loading, exportData, deleteData, optimizeStorage } = useStorageData()

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Data Storage</h1>
            <p className="text-muted-foreground">Manage sensor data storage and retention policies</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={optimizeStorage}>
              <Archive className="h-4 w-4 mr-2" />
              Optimize
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Storage Settings</DialogTitle>
                </DialogHeader>
                <StorageSettings />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Storage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(storageData?.totalStorage || 0)}</div>
              <Progress value={75} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">75% used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sensor Data</CardTitle>
              <Database className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(storageData?.sensorData || 0)}</div>
              <p className="text-xs text-muted-foreground">Active readings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archived Data</CardTitle>
              <Archive className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(storageData?.archivedData || 0)}</div>
              <p className="text-xs text-muted-foreground">Compressed storage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Growth</CardTitle>
              <Upload className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(storageData?.dailyGrowth || 0)}</div>
              <p className="text-xs text-muted-foreground">Average per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sensors">By Sensor</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
            <TabsTrigger value="exports">Exports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <DataRetentionChart data={storageData?.retentionData || []} />

            <Card>
              <CardHeader>
                <CardTitle>Storage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Temperature Data</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={45} className="w-32" />
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Humidity Data</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={35} className="w-32" />
                      <span className="text-sm text-muted-foreground">35%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Device Logs</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={15} className="w-32" />
                      <span className="text-sm text-muted-foreground">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Metadata</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={5} className="w-32" />
                      <span className="text-sm text-muted-foreground">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Storage by Sensor</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sensor</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Data Size</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Last Backup</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storageData?.sensorStorage?.map((sensor) => (
                      <TableRow key={sensor.id}>
                        <TableCell className="font-medium">{sensor.name}</TableCell>
                        <TableCell>{sensor.location}</TableCell>
                        <TableCell>{formatBytes(sensor.dataSize)}</TableCell>
                        <TableCell>{sensor.recordCount.toLocaleString()}</TableCell>
                        <TableCell>{sensor.lastBackup}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={exportData}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteData(sensor.id)}>
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

          <TabsContent value="retention" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Retention Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Real-time Data</p>
                        <p className="text-xs text-muted-foreground">Keep for 7 days</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Hourly Aggregates</p>
                        <p className="text-xs text-muted-foreground">Keep for 30 days</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Daily Summaries</p>
                        <p className="text-xs text-muted-foreground">Keep for 1 year</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Monthly Archives</p>
                        <p className="text-xs text-muted-foreground">Keep indefinitely</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cleanup Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Next Cleanup: Tonight at 2:00 AM
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Will remove data older than retention policy
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Last Cleanup: Yesterday at 2:00 AM
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">Freed 2.3 GB of storage space</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="exports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Exports</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Export Name</TableHead>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Monthly Report - December</TableCell>
                      <TableCell>Dec 1-31, 2024</TableCell>
                      <TableCell>CSV</TableCell>
                      <TableCell>15.2 MB</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Ready</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">All Sensors - Q4 2024</TableCell>
                      <TableCell>Oct 1 - Dec 31, 2024</TableCell>
                      <TableCell>JSON</TableCell>
                      <TableCell>45.8 MB</TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" disabled>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
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
