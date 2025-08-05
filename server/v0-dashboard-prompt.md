# Vercel v0 Prompt: ESP8266 IoT Sensor Dashboard

## 🎯 Project Brief
Create a modern, responsive IoT dashboard for monitoring ESP8266 DHT sensor data with real-time temperature and humidity readings, historical charts, and statistics.

---

## 📋 Requirements

### Core Features
- **Real-time sensor data display** (temperature & humidity)
- **Interactive time-series charts** for historical data
- **Statistics cards** showing min/max/average values
- **System status indicators** and health monitoring
- **Data export functionality** (CSV download)
- **Responsive design** (mobile-first approach)
- **Auto-refresh** every 30 seconds

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Charts**: Recharts or Chart.js
- **Icons**: Lucide React
- **API**: REST endpoints (provided below)

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--temperature-color: #ef4444 /* red-500 */
--humidity-color: #3b82f6    /* blue-500 */
--success-color: #10b981     /* emerald-500 */
--warning-color: #f59e0b     /* amber-500 */
--error-color: #ef4444       /* red-500 */

/* Background */
--bg-primary: #f8fafc       /* slate-50 */
--bg-secondary: #ffffff     /* white */
--bg-card: #ffffff          /* white */

/* Text */
--text-primary: #0f172a     /* slate-900 */
--text-secondary: #64748b   /* slate-500 */
--text-muted: #94a3b8       /* slate-400 */
```

### Typography
- **Headers**: font-bold text-2xl
- **Card titles**: font-semibold text-lg
- **Values**: font-mono text-3xl
- **Labels**: text-sm text-slate-500

---

## 📊 Sample API Data

### Current Readings (`/api/sensors/sensor1/current`)
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

### Statistics (`/api/sensors/sensor1/statistics`)
```json
{
  "success": true,
  "data": {
    "min_temperature": 27.8,
    "max_temperature": 29.3,
    "avg_temperature": 28.4,
    "min_humidity": 95,
    "max_humidity": 95,
    "avg_humidity": 95,
    "total_readings": 80,
    "sessionDurationFormatted": "42m 15s",
    "lastUpdateFormatted": "2024-01-26 18:30:45"
  }
}
```

### Historical Data (`/api/sensors/sensor1/history?limit=24`)
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
      "formattedTime": "18:25:40"
    },
    {
      "id": "2471446",
      "temperature": 28.4,
      "humidity": 94,
      "timestamp": 2471446,
      "reading_number": 80,
      "formattedTime": "18:26:10"
    }
  ],
  "count": 24
}
```

---

## 🏗️ Component Structure

### 1. Main Dashboard Layout
```tsx
// app/page.tsx
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TemperatureCard />
          <HumidityCard />
          <SystemStatusCard />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <ChartCard />
          <StatisticsCard />
        </div>
        <RecentReadingsTable />
      </main>
    </div>
  );
}
```

### 2. Temperature Card Component
```tsx
// components/TemperatureCard.tsx
interface TemperatureCardProps {
  current: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
}

export function TemperatureCard({ current, min, max, trend }: TemperatureCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Temperature</h3>
        <Thermometer className="h-5 w-5 text-red-500" />
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline">
          <span className="text-3xl font-mono font-bold text-red-500">
            {current.toFixed(1)}
          </span>
          <span className="text-lg text-slate-500 ml-1">°C</span>
          <TrendIcon trend={trend} />
        </div>
        <div className="flex justify-between text-sm text-slate-500">
          <span>Min: {min.toFixed(1)}°C</span>
          <span>Max: {max.toFixed(1)}°C</span>
        </div>
      </div>
    </Card>
  );
}
```

### 3. Interactive Chart Component
```tsx
// components/ChartCard.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ChartCard({ data }: { data: HistoricalReading[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Sensor Trends</h3>
        <div className="flex gap-2">
          <TimeRangeSelector />
          <RefreshButton />
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="formattedTime" />
            <YAxis yAxisId="temp" orientation="left" />
            <YAxis yAxisId="humidity" orientation="right" />
            <Tooltip />
            <Line 
              yAxisId="temp"
              type="monotone" 
              dataKey="temperature" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Temperature (°C)"
            />
            <Line 
              yAxisId="humidity"
              type="monotone" 
              dataKey="humidity" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Humidity (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
```

### 4. System Status Component
```tsx
// components/SystemStatusCard.tsx
export function SystemStatusCard({ isOnline, lastUpdate, totalReadings }: SystemStatusProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">System Status</h3>
        <div className={`flex items-center gap-2 ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-500">Last Update:</span>
          <span className="font-mono text-sm">{lastUpdate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Total Readings:</span>
          <span className="font-mono font-semibold">{totalReadings.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}
```

### 5. Real-time Data Hook
```tsx
// hooks/useRealTimeData.ts
export function useRealTimeData(refreshInterval = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensors/sensor1/dashboard');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error };
}
```

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Stacked cards
- Compact chart (height: 250px)
- Simplified table (2-3 columns)

### Tablet (768px - 1024px)
- 2-column grid for cards
- Full-width chart
- 4-column table

### Desktop (> 1024px)
- 3-column grid for cards
- Side-by-side chart and stats
- Full table with all columns

---

## ⚡ Interactive Features

### 1. Auto-refresh Indicator
```tsx
// Show countdown timer for next refresh
<div className="flex items-center gap-2 text-sm text-slate-500">
  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
  <span>Next update in {countdown}s</span>
</div>
```

### 2. Export Functionality
```tsx
// Export button with loading state
<Button 
  onClick={handleExport} 
  disabled={isExporting}
  className="flex items-center gap-2"
>
  <Download className="h-4 w-4" />
  {isExporting ? 'Exporting...' : 'Export CSV'}
</Button>
```

### 3. Alert Thresholds
```tsx
// Temperature alert (> 30°C or < 20°C)
{temperature > 30 && (
  <Alert className="border-red-200 bg-red-50">
    <AlertTriangle className="h-4 w-4 text-red-500" />
    <AlertTitle>High Temperature Warning</AlertTitle>
    <AlertDescription>
      Temperature is {temperature.toFixed(1)}°C - above normal range
    </AlertDescription>
  </Alert>
)}
```

---

## 🎯 Key Interactions

1. **Real-time Updates**: Auto-refresh every 30 seconds with visual indicator
2. **Chart Interactions**: Hover tooltips, zoom, time range selection
3. **Export Data**: One-click CSV download with date range selection
4. **Status Monitoring**: Color-coded status indicators and alerts
5. **Mobile Gestures**: Swipe between cards on mobile

---

## 🚀 v0 Implementation Prompt

**Create a modern IoT sensor dashboard with the following specifications:**

1. **Build a responsive dashboard** using Next.js 14, Tailwind CSS, and Recharts
2. **Include 4 main sections**: Temperature card, Humidity card, Time-series chart, System status
3. **Use the provided API endpoints** and sample data structure
4. **Implement real-time updates** with 30-second polling
5. **Add interactive features**: chart tooltips, export functionality, status indicators
6. **Follow the design system**: Red for temperature, blue for humidity, clean card layouts
7. **Make it mobile-responsive** with appropriate breakpoints
8. **Include error handling** and loading states
9. **Add smooth animations** for data updates and interactions
10. **Use TypeScript** with proper interfaces for type safety

**Key Components to Generate:**
- Main dashboard layout with grid system
- Temperature and humidity cards with trend indicators
- Interactive line chart with dual y-axes
- System status card with online/offline indicator
- Recent readings table with pagination
- Export functionality with CSV download
- Real-time data hook with error handling

**API Base URL**: `http://localhost:3000/api`
**Primary Sensor**: `sensor1`
**Update Frequency**: 30 seconds
**Chart Data Points**: Last 24 readings

This dashboard should look modern, professional, and suitable for IoT monitoring applications. 