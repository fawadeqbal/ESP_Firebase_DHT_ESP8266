"use client"

import { useState } from "react"
import { CalendarDays, Download, TrendingUp, Activity, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsChart } from "@/components/analytics-chart"
import { MetricsTable } from "@/components/metrics-table"
import { HeatmapChart } from "@/components/heatmap-chart"
import { useAnalyticsData } from "@/hooks/use-analytics-data"

export default function AnalyticsPage() {
  const [selectedSensor, setSelectedSensor] = useState("all")
  const [timeRange, setTimeRange] = useState("7d")
  const { analyticsData, loading, exportData } = useAnalyticsData(selectedSensor, timeRange)

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
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive sensor data analysis and insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={selectedSensor} onValueChange={setSelectedSensor}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select sensor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sensors</SelectItem>
                <SelectItem value="sensor1">Living Room</SelectItem>
                <SelectItem value="sensor2">Kitchen</SelectItem>
                <SelectItem value="sensor3">Bedroom</SelectItem>
                <SelectItem value="sensor4">Garden</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Rest of the content remains the same */}
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23.4°C</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Humidity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">52.8%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-600">-1.3%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2 kWh</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-5.2%</span> from last period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15,847</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analysis */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <AnalyticsChart data={analyticsData?.trends || []} />
            <MetricsTable data={analyticsData?.metrics || []} />
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <HeatmapChart data={analyticsData?.heatmap || []} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={analyticsData?.temperatureComparison || []} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Humidity Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnalyticsChart data={analyticsData?.humidityComparison || []} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Badge variant="secondary">Temperature</Badge>
                      <div>
                        <p className="text-sm font-medium">Peak hours: 2-4 PM</p>
                        <p className="text-xs text-muted-foreground">Highest temperatures recorded during afternoon</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge variant="secondary">Humidity</Badge>
                      <div>
                        <p className="text-sm font-medium">Optimal range: 45-55%</p>
                        <p className="text-xs text-muted-foreground">Most sensors maintain healthy humidity levels</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge variant="secondary">Energy</Badge>
                      <div>
                        <p className="text-sm font-medium">Peak usage: Evening hours</p>
                        <p className="text-xs text-muted-foreground">Device usage increases after 6 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Energy Optimization</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Consider scheduling high-power devices during off-peak hours
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">Climate Control</p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Bedroom sensor shows low humidity - consider adding humidifier
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Maintenance</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Garden sensor battery low - schedule replacement
                      </p>
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
