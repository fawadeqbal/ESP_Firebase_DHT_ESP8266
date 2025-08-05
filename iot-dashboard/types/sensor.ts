export interface SensorCurrent {
  temperature: number
  humidity: number
  timestamp: number
  reading_number: number
  battery_level?: number
  signal_strength?: number
}

export interface HistoricalReading {
  id: string
  temperature: number
  humidity: number
  timestamp: number
  reading_number: number
  formattedTime: string
}

export interface SensorStatistics {
  min_temperature: number
  max_temperature: number
  avg_temperature: number
  min_humidity: number
  max_humidity: number
  avg_humidity: number
  total_readings: number
  session_duration: string
  sessionDurationFormatted: string
  last_update: string
  lastUpdateFormatted: string
}

export interface Device {
  id: string
  name: string
  type: "relay" | "led" | "fan" | "heater" | "pump" | "motor"
  status: "on" | "off"
  power_consumption?: number
  last_updated: string
  sensor_id: string
  description?: string
}

export interface Sensor {
  id: string
  name: string
  location: string
  type: string
  status: "online" | "offline" | "warning"
  current: SensorCurrent
  statistics: SensorStatistics
  devices: Device[]
  last_seen: string
}

export interface DashboardResponse {
  current: SensorCurrent
  statistics: SensorStatistics
  recentHistory: HistoricalReading[]
  sensorId: string
}

export interface HealthStatus {
  status: "healthy" | "warning" | "error"
  uptime: string
  lastReading: string
  message: string
  sensors_online: number
  total_sensors: number
}
