"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface MetricsTableProps {
  data: any[]
}

export function MetricsTable({ data }: MetricsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Metrics Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sensor</TableHead>
              <TableHead>Avg Temperature</TableHead>
              <TableHead>Avg Humidity</TableHead>
              <TableHead>Total Readings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((metric, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{metric.sensor}</TableCell>
                <TableCell>{metric.avgTemp}°C</TableCell>
                <TableCell>{metric.avgHumidity}%</TableCell>
                <TableCell>{metric.readings}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
