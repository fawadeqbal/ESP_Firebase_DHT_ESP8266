import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    label: string
  }
}

export function StatCard({ title, value, unit, icon: Icon, description, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === "number" ? value.toFixed(1) : value}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span className={trend.value > 0 ? "text-green-600" : trend.value < 0 ? "text-red-600" : ""}>
              {trend.value > 0 ? "+" : ""}
              {trend.value}
            </span>
            <span className="ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
