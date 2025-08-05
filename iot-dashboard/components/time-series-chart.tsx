"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import type { HistoricalReading } from "@/types/sensor"

interface TimeSeriesChartProps {
  data: HistoricalReading[]
  title?: string
}

export function TimeSeriesChart({ data, title = "24 Hour Sensor Data" }: TimeSeriesChartProps) {
  const chartData = data.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: reading.temperature,
    humidity: reading.humidity,
    fullTime: reading.formattedTime,
  }))

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis
                yAxisId="temp"
                orientation="left"
                tick={{ fontSize: 12 }}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <YAxis yAxisId="humidity" orientation="right" tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}${name === "temperature" ? "°C" : "%"}`,
                  name === "temperature" ? "Temperature" : "Humidity",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Line
                yAxisId="temp"
                type="monotone"
                dataKey="temperature"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 3 }}
                name="Temperature"
              />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidity"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 3 }}
                name="Humidity"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
