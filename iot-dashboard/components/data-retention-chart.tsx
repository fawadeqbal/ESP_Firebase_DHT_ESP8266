"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

interface RetentionData {
  date: string
  realTime: number
  hourly: number
  daily: number
  archived: number
}

interface DataRetentionChartProps {
  data: RetentionData[]
}

export function DataRetentionChart({ data }: DataRetentionChartProps) {
  // Generate mock data if none provided
  const chartData =
    data.length > 0
      ? data
      : Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))

          return {
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            realTime: Math.floor(Math.random() * 100) + 50,
            hourly: Math.floor(Math.random() * 200) + 100,
            daily: Math.floor(Math.random() * 500) + 200,
            archived: Math.floor(Math.random() * 1000) + 500,
          }
        })

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 MB"
    const k = 1024
    const sizes = ["MB", "GB", "TB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Retention Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="realTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="hourly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="daily" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="archived" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff7300" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string) => [formatBytes(value), name]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="archived"
                stackId="1"
                stroke="#ff7300"
                fill="url(#archived)"
                name="Archived Data"
              />
              <Area
                type="monotone"
                dataKey="daily"
                stackId="1"
                stroke="#ffc658"
                fill="url(#daily)"
                name="Daily Summaries"
              />
              <Area
                type="monotone"
                dataKey="hourly"
                stackId="1"
                stroke="#82ca9d"
                fill="url(#hourly)"
                name="Hourly Aggregates"
              />
              <Area
                type="monotone"
                dataKey="realTime"
                stackId="1"
                stroke="#8884d8"
                fill="url(#realTime)"
                name="Real-time Data"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Real-time</div>
            <div className="text-xs text-blue-700 dark:text-blue-300">7 days retention</div>
          </div>
          <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
            <div className="text-sm font-medium text-green-900 dark:text-green-100">Hourly</div>
            <div className="text-xs text-green-700 dark:text-green-300">30 days retention</div>
          </div>
          <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
            <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Daily</div>
            <div className="text-xs text-yellow-700 dark:text-yellow-300">1 year retention</div>
          </div>
          <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded">
            <div className="text-sm font-medium text-orange-900 dark:text-orange-100">Archived</div>
            <div className="text-xs text-orange-700 dark:text-orange-300">Permanent storage</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
