"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface NetworkDevice {
  id: string
  name: string
  ipAddress: string
  status: string
  signalStrength: number
  lastSeen: string
  dataUsage: string
}

interface SignalStrengthChartProps {
  devices: NetworkDevice[]
}

export function SignalStrengthChart({ devices }: SignalStrengthChartProps) {
  // Generate mock historical signal data for the last 24 hours
  const generateSignalHistory = () => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const time = new Date()
      time.setHours(time.getHours() - (23 - i))
      return time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    })

    return hours.map((time) => {
      const dataPoint: any = { time }
      devices.forEach((device) => {
        // Simulate signal fluctuation around the current strength
        const baseStrength = device.signalStrength
        const variation = Math.random() * 10 - 5 // ±5 dBm variation
        dataPoint[device.name] = Math.max(-90, Math.min(-30, baseStrength + variation))
      })
      return dataPoint
    })
  }

  const chartData = generateSignalHistory()
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00", "#ff00ff"]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Signal Strength Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                <YAxis
                  domain={[-90, -30]}
                  tick={{ fontSize: 12 }}
                  label={{ value: "Signal Strength (dBm)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)} dBm`, "Signal"]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend />
                {devices.map((device, index) => (
                  <Line
                    key={device.id}
                    type="monotone"
                    dataKey={device.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {devices.map((device, index) => {
          const getSignalQuality = (strength: number) => {
            if (strength > -50) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100" }
            if (strength > -60) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100" }
            if (strength > -70) return { label: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" }
            return { label: "Poor", color: "text-red-600", bg: "bg-red-100" }
          }

          const quality = getSignalQuality(device.signalStrength)

          return (
            <Card key={device.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{device.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Current Signal</span>
                  <span className="text-sm font-medium">{device.signalStrength} dBm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Quality</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${quality.bg} ${quality.color}`}>
                    {quality.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span
                    className={`text-xs font-medium ${
                      device.status === "connected"
                        ? "text-green-600"
                        : device.status === "unstable"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {device.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
