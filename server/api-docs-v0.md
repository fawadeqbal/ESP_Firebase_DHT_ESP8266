# ESP8266 IoT Sensor Dashboard API Documentation

## Overview
This API provides real-time access to ESP8266 DHT sensor data stored in Firebase. Perfect for building modern IoT dashboards with temperature and humidity monitoring.

**Base URL**: `http://localhost:3000/api`  
**Response Format**: JSON  
**Authentication**: None required  

---

## 📊 Dashboard Data Structure

### Current Readings Response
```json
{
  "success": true,
  "data": {
    "temperature": 28.2,
    "humidity": 95,
    "timestamp": 2471446,
    "reading_number": 80
  },
  "timestamp": 1753554509139
}
```

### Historical Data Response
```json
{
  "success": true,
  "data": [
    {
      "id": "2440860",
      "temperature": 28.2,
      "humidity": 95,
      "timestamp": 2440860,
      "reading_number": 79,
      "formattedTime": "1970-01-01 05:40:40"
    }
  ],
  "count": 1,
  "timestamp": 1753554527081
}
```

### Statistics Response
```json
{
  "success": true,
  "data": {
    "min_temperature": 27.8,
    "max_temperature": 29.3,
    "avg_temperature": 28.4075,
    "min_humidity": 95,
    "max_humidity": 95,
    "avg_humidity": 95,
    "total_readings": 79,
    "session_duration": "2434779",
    "sessionDurationFormatted": "40m 34s",
    "last_update": "2448002",
    "lastUpdateFormatted": "2448-01-02 00:00:00"
  },
  "timestamp": 1753554509139
}
```

---

## 🔗 API Endpoints

### 1. Get Current Sensor Readings
**Perfect for: Real-time dashboard widgets**

```http
GET /api/sensors/sensor1/current
```

**Use Case**: Display current temperature and humidity in dashboard cards
**Update Frequency**: Every 30 seconds
**Response Time**: ~200ms

**Dashboard Implementation**:
```typescript
// For temperature card
const currentTemp = data.temperature; // 28.2
const currentHumidity = data.humidity; // 95
const lastReading = data.reading_number; // 80
```

---

### 2. Get Historical Data
**Perfect for: Charts and graphs**

```http
GET /api/sensors/sensor1/history?limit=24
```

**Query Parameters**:
- `limit` (number): Number of readings (default: 100, max: 1000)
- `startDate` (string): Start date (YYYY-MM-DD format)
- `endDate` (string): End date (YYYY-MM-DD format)
- `startTime` (number): Unix timestamp start
- `endTime` (number): Unix timestamp end

**Chart Data Examples**:
```typescript
// For line chart (last 24 hours)
GET /api/sensors/sensor1/history?limit=48

// For date range chart
GET /api/sensors/sensor1/history?startDate=2024-01-01&endDate=2024-01-31

// Chart.js format
const chartData = {
  labels: data.map(item => item.formattedTime),
  datasets: [
    {
      label: 'Temperature (°C)',
      data: data.map(item => item.temperature),
      borderColor: '#ff6384',
      backgroundColor: 'rgba(255, 99, 132, 0.1)'
    },
    {
      label: 'Humidity (%)',
      data: data.map(item => item.humidity),
      borderColor: '#36a2eb',
      backgroundColor: 'rgba(54, 162, 235, 0.1)'
    }
  ]
};
```

---

### 3. Get Sensor Statistics
**Perfect for: KPI cards and summary widgets**

```http
GET /api/sensors/sensor1/statistics
```

**Dashboard Widgets**:
```typescript
// Temperature stats card
const tempStats = {
  current: currentData.temperature,
  min: stats.min_temperature,
  max: stats.max_temperature,
  avg: stats.avg_temperature.toFixed(1)
};

// Session info card
const sessionInfo = {
  totalReadings: stats.total_readings,
  duration: stats.sessionDurationFormatted,
  lastUpdate: stats.lastUpdateFormatted
};
```

---

### 4. Get Dashboard Overview
**Perfect for: Complete dashboard data in one call**

```http
GET /api/sensors/sensor1/dashboard
```

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "current": { /* current readings */ },
    "statistics": { /* min/max/avg data */ },
    "recentHistory": [ /* last 24 readings */ ],
    "sensorId": "sensor1"
  }
}
```

**Single API Call Dashboard**:
```typescript
// Get everything needed for dashboard
const { current, statistics, recentHistory } = dashboardData.data;

// Use for different components
const temperatureCard = current.temperature;
const humidityCard = current.humidity;
const statsCards = statistics;
const chartData = recentHistory;
```

---

### 5. Export Data
**Perfect for: Download functionality**

```http
GET /api/sensors/sensor1/export?format=csv&startDate=2024-01-01&endDate=2024-01-31
```

**Parameters**:
- `format`: 'json' | 'csv' (default: 'json')
- `startDate`: Start date for export
- `endDate`: End date for export

**Download Implementation**:
```typescript
// CSV download
const downloadCSV = async () => {
  const response = await fetch('/api/sensors/sensor1/export?format=csv');
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sensor-data.csv';
  a.click();
};
```

---

### 6. Health Check
**Perfect for: System status indicator**

```http
GET /api/sensors/health
```

**Status Indicator**:
```typescript
const healthCheck = async () => {
  try {
    const response = await fetch('/api/sensors/health');
    const data = await response.json();
    return data.success; // true = online, false = offline
  } catch {
    return false; // API unreachable
  }
};
```

---

## 🎨 Dashboard Components Suggestions

### 1. Real-time Cards
```typescript
// Temperature Card
interface TemperatureCardProps {
  current: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
}

// Humidity Card
interface HumidityCardProps {
  current: number;
  min: number;
  max: number;
  optimal: boolean; // 40-60% is optimal
}
```

### 2. Chart Components
```typescript
// Time Series Chart
interface ChartProps {
  data: HistoricalReading[];
  timeRange: '1h' | '24h' | '7d' | '30d';
  metrics: ('temperature' | 'humidity')[];
}

// Gauge Component
interface GaugeProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  color: string;
}
```

### 3. Status Components
```typescript
// System Status
interface StatusProps {
  isOnline: boolean;
  lastReading: string;
  totalReadings: number;
  uptime: string;
}

// Alert Component
interface AlertProps {
  type: 'warning' | 'error' | 'info';
  message: string;
  threshold?: number;
  currentValue?: number;
}
```

---

## 📱 Responsive Dashboard Layout

### Desktop Layout (1200px+)
```
┌─────────────────────────────────────────┐
│  Header (Status, Time, Export)          │
├─────────────┬─────────────┬─────────────┤
│ Temp Card   │ Humidity    │ Stats Card  │
│             │ Card        │             │
├─────────────┴─────────────┴─────────────┤
│        Time Series Chart                │
│                                         │
├─────────────────────────────────────────┤
│        Recent Readings Table            │
└─────────────────────────────────────────┘
```

### Mobile Layout (768px-)
```
┌─────────────────────┐
│     Header          │
├─────────────────────┤
│   Temperature       │
│      Card           │
├─────────────────────┤
│    Humidity         │
│      Card           │
├─────────────────────┤
│    Statistics       │
│      Card           │
├─────────────────────┤
│      Chart          │
│   (Compact)         │
└─────────────────────┘
```

---

## 🔄 Real-time Updates

### WebSocket Alternative (Polling)
```typescript
// Polling for real-time updates
const useRealTimeData = (interval = 30000) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/sensors/sensor1/current');
      const result = await response.json();
      setData(result.data);
    };
    
    fetchData();
    const timer = setInterval(fetchData, interval);
    
    return () => clearInterval(timer);
  }, [interval]);
  
  return data;
};
```

### Data Refresh Strategy
```typescript
// Smart refresh based on data age
const getRefreshInterval = (lastUpdate: number) => {
  const age = Date.now() - lastUpdate;
  if (age < 60000) return 10000;  // 10s if fresh
  if (age < 300000) return 30000; // 30s if recent
  return 60000; // 1min if old
};
```

---

## 🎯 Performance Optimization

### Caching Strategy
```typescript
// Cache current readings for 30 seconds
const cacheKey = 'sensor1-current';
const cacheTime = 30000;

// Cache historical data for 5 minutes
const historyCacheKey = 'sensor1-history';
const historyCacheTime = 300000;
```

### Error Handling
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const handleApiError = (error: any) => {
  if (error.name === 'TypeError') {
    return 'Network error - check connection';
  }
  return error.message || 'Unknown error occurred';
};
```

---

## 🚀 Quick Start for v0

### 1. Environment Setup
```typescript
// .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SENSOR_ID=sensor1
```

### 2. API Client
```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const SENSOR_ID = process.env.NEXT_PUBLIC_SENSOR_ID;

export const sensorApi = {
  getCurrent: () => fetch(`${API_BASE}/sensors/${SENSOR_ID}/current`),
  getHistory: (limit = 24) => fetch(`${API_BASE}/sensors/${SENSOR_ID}/history?limit=${limit}`),
  getStats: () => fetch(`${API_BASE}/sensors/${SENSOR_ID}/statistics`),
  getDashboard: () => fetch(`${API_BASE}/sensors/${SENSOR_ID}/dashboard`),
};
```

### 3. Dashboard Hook
```typescript
// hooks/useDashboard.ts
export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await sensorApi.getDashboard();
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return { data, loading };
};
```

---

This API is designed for modern dashboard development with real-time IoT sensor monitoring. All endpoints return consistent JSON responses perfect for React/Next.js applications. 