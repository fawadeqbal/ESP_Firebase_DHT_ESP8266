"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"
import type { Device } from "@/types/sensor"

interface PowerConsumptionChartProps {
  devices: Device[]
}

export function PowerConsumptionChart({ devices }: PowerConsumptionChartProps) {
  const powerData = devices
    .filter((device) => device.power_consumption && device.status === "on")
    .map((device) => ({
      name: device.name,
      power: device.power_consumption || 0,
      type: device.type,
    }))

  const totalPower = powerData.reduce((sum, device) => sum + device.power, 0)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  const pieData = devices
    .filter((device) => device.power_consumption && device.status === "on")
    .map((device, index) => ({
      name: device.name,
      value: device.power_consumption || 0,
      color: COLORS[index % COLORS.length],
    }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Power Consumption by Device</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={powerData}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}W`, "Power"]} />
                  <Bar dataKey="power" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Power Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}W`, "Power"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Power Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalPower}W</div>
              <div className="text-sm text-muted-foreground">Total Active Power</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{devices.filter((d) => d.status === "on").length}</div>
              <div className="text-sm text-muted-foreground">Active Devices</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{((totalPower * 24) / 1000).toFixed(2)} kWh</div>
              <div className="text-sm text-muted-foreground">Daily Consumption</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
