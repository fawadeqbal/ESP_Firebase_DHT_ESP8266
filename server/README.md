# ESP8266 Firebase DHT Sensor Integration System

## 🚨 **CRITICAL DATA STRUCTURE DOCUMENTATION**
**This README contains the standardized data formats for ESP8266, Server, and Frontend integration. All components MUST follow these exact specifications to ensure data consistency.**

---

## 📋 Table of Contents
- [System Overview](#system-overview)
- [Data Structure Standards](#data-structure-standards)
- [Firebase Database Schema](#firebase-database-schema)
- [ESP8266 Integration](#esp8266-integration)
- [Server API Documentation](#server-api-documentation)
- [Frontend Integration](#frontend-integration)
- [Data Consistency Issues & Solutions](#data-consistency-issues--solutions)
- [Installation & Setup](#installation--setup)
- [Troubleshooting](#troubleshooting)

---

## 🔧 System Overview

This is a complete IoT system consisting of:

1. **ESP8266 Sensors** → Send DHT data to Firebase
2. **Firebase Realtime Database** → Central data storage
3. **Node.js Server** → RESTful API for data access
4. **React Frontend** → Dashboard for data visualization

### Architecture Flow
```
ESP8266 → Firebase Realtime Database → Node.js Server → React Frontend
```

---

## 📊 Data Structure Standards

### **Core Data Types (MUST BE CONSISTENT)**

#### **SensorReading** (Single Reading)
```typescript
interface SensorReading {
  temperature: number      // Float value in Celsius
  humidity: number         // Float value in percentage
  timestamp: number        // Unix timestamp in milliseconds
  reading_number: number   // Incremental reading counter
}
```

#### **SensorStatistics** (Aggregated Data)
```typescript
interface SensorStatistics {
  min_temperature: number      // Float
  max_temperature: number      // Float  
  avg_temperature: number      // Float
  min_humidity: number         // Float
  max_humidity: number         // Float
  avg_humidity: number         // Float
  total_readings: number       // Integer
  session_duration: number     // Milliseconds as number (NOT string)
  last_update: number          // Unix timestamp in milliseconds (NOT string)
}
```

#### **Historical Data Entry**
```typescript
interface HistoricalReading {
  id: string                   // Timestamp as string key
  temperature: number          // Float value
  humidity: number             // Float value  
  timestamp: number            // Unix timestamp in milliseconds
  reading_number: number       // Incremental counter
  formattedTime: string        // Server-generated formatted time
}
```

---

## 🗄️ Firebase Database Schema

### **REQUIRED Database Structure**
```
firebase-database/
├── sensor1/                     # Primary sensor (ESP8266 default)
│   ├── current/                 # Latest readings
│   │   ├── temperature: 25.5    # number
│   │   ├── humidity: 60.2       # number
│   │   ├── timestamp: 1703123456789  # number (milliseconds)
│   │   └── reading_number: 42   # number
│   ├── history/                 # Historical data
│   │   ├── 1703123456789/       # Timestamp as key
│   │   │   ├── temperature: 25.5
│   │   │   ├── humidity: 60.2
│   │   │   ├── timestamp: 1703123456789
│   │   │   └── reading_number: 42
│   │   └── 1703123486789/       # Next reading...
│   └── statistics/              # Computed statistics
│       ├── min_temperature: 20.1     # number
│       ├── max_temperature: 30.5     # number
│       ├── avg_temperature: 25.3     # number
│       ├── min_humidity: 45.2        # number
│       ├── max_humidity: 75.8        # number
│       ├── avg_humidity: 60.5        # number
│       ├── total_readings: 1000      # number
│       ├── session_duration: 86400000 # number (milliseconds)
│       └── last_update: 1703123456789 # number (milliseconds)
├── sensor2/                     # Additional sensors (future)
└── sensor3/                     # Additional sensors (future)
```

### **Database Rules** (firebase.rules)
```json
{
  "rules": {
    ".read": true,
    ".write": true,
    "sensor1": {
      "current": {
        ".validate": "newData.hasChildren(['temperature', 'humidity', 'timestamp', 'reading_number'])"
      },
      "history": {
        "$timestamp": {
          ".validate": "newData.hasChildren(['temperature', 'humidity', 'timestamp', 'reading_number'])"
        }
      },
      "statistics": {
        ".validate": "newData.hasChildren(['total_readings', 'last_update'])"
      }
    }
  }
}
```

---

## 🔌 ESP8266 Integration

### **Current Issues in ESP8266 Code**
1. ❌ `session_duration` and `last_update` sent as **String** instead of **number**
2. ❌ Hardcoded sensor ID `"sensor1"`
3. ❌ Using `millis()` instead of proper Unix timestamps
4. ❌ No error handling for Firebase failures

### **REQUIRED ESP8266 Code Changes**

#### **Fix Data Types in `sendStatistics()` function**
```cpp
// ❌ WRONG (Current implementation)
sendData(sensorId + "/statistics/session_duration", String(millis() - sessionStartTime));
sendData(sensorId + "/statistics/last_update", String(millis()));

// ✅ CORRECT (Required fix)
sendData(sensorId + "/statistics/session_duration", (millis() - sessionStartTime));
sendData(sensorId + "/statistics/last_update", millis());
```

#### **Fix Timestamp Generation**
```cpp
// ❌ WRONG - millis() is device uptime, not real timestamp
unsigned long timestamp = millis();

// ✅ CORRECT - Use NTP for real timestamps
#include <NTPClient.h>
#include <WiFiUdp.h>

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

void setup() {
  // ... existing code ...
  timeClient.begin();
  timeClient.setTimeOffset(0); // UTC
}

unsigned long getCurrentTimestamp() {
  timeClient.update();
  return timeClient.getEpochTime() * 1000; // Convert to milliseconds
}
```

#### **Dynamic Sensor ID Configuration**
```cpp
// ✅ CORRECT - Allow configurable sensor ID
String sensorId = "sensor001"; // Use consistent naming convention
// Or read from EEPROM/config file
```

### **Complete ESP8266 Data Sending Functions**
```cpp
void sendCurrentReadings(float temp, float hum) {
  unsigned long timestamp = getCurrentTimestamp();
  
  sendData(sensorId + "/current/temperature", temp);
  sendData(sensorId + "/current/humidity", hum);
  sendData(sensorId + "/current/timestamp", timestamp);
  sendData(sensorId + "/current/reading_number", (int)totalReadings);
}

void sendHistoricalData(float temp, float hum) {
  unsigned long timestamp = getCurrentTimestamp();
  String timeKey = String(timestamp);
  
  sendData(sensorId + "/history/" + timeKey + "/temperature", temp);
  sendData(sensorId + "/history/" + timeKey + "/humidity", hum);
  sendData(sensorId + "/history/" + timeKey + "/timestamp", timestamp);
  sendData(sensorId + "/history/" + timeKey + "/reading_number", (int)totalReadings);
}

void sendStatistics() {
  unsigned long currentTime = getCurrentTimestamp();
  unsigned long sessionDuration = currentTime - sessionStartTimestamp;
  
  sendData(sensorId + "/statistics/min_temperature", minTemp);
  sendData(sensorId + "/statistics/max_temperature", maxTemp);
  sendData(sensorId + "/statistics/avg_temperature", avgTemp);
  sendData(sensorId + "/statistics/min_humidity", minHum);
  sendData(sensorId + "/statistics/max_humidity", maxHum);
  sendData(sensorId + "/statistics/avg_humidity", avgHum);
  sendData(sensorId + "/statistics/total_readings", (int)totalReadings);
  sendData(sensorId + "/statistics/session_duration", sessionDuration); // NUMBER not String
  sendData(sensorId + "/statistics/last_update", currentTime); // NUMBER not String
}
```

---

## 🖥️ Server API Documentation

### **Installation & Setup**
```bash
cd server
npm install
cp env.example .env
npm run dev # Development mode
npm start   # Production mode
```

### **Environment Variables**
```env
PORT=8000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### **API Endpoints**

#### **Base URL**: `http://localhost:8000/api/sensors`

| Method | Endpoint | Description | Response Format |
|--------|----------|-------------|-----------------|
| GET | `/` | All sensors current readings | `AllSensorsResponse` |
| GET | `/:sensorId/current` | Current readings for sensor | `CurrentResponse` |
| GET | `/:sensorId/history` | Historical data with filters | `HistoryResponse` |
| GET | `/:sensorId/statistics` | Sensor statistics | `StatisticsResponse` |
| GET | `/:sensorId/dashboard` | Complete dashboard data | `DashboardResponse` |
| GET | `/dashboard/overview` | Overview of all sensors | `OverviewResponse` |
| GET | `/:sensorId/export` | Export data (JSON/CSV) | `ExportResponse` |
| GET | `/health` | API health check | `HealthResponse` |

### **Response Formats**

#### **Standard API Response Structure**
```typescript
interface APIResponse<T> {
  success: boolean
  data: T
  timestamp: number
  count?: number
  message?: string
  error?: string
}
```

#### **CurrentResponse**
```typescript
interface CurrentResponse extends APIResponse<SensorReading> {
  data: {
    temperature: number
    humidity: number
    timestamp: number
    reading_number: number
  }
}
```

#### **HistoryResponse**
```typescript
interface HistoryResponse extends APIResponse<HistoricalReading[]> {
  data: Array<{
    id: string
    temperature: number
    humidity: number
    timestamp: number
    reading_number: number
    formattedTime: string
  }>
  count: number
}
```

#### **StatisticsResponse**
```typescript
interface StatisticsResponse extends APIResponse<SensorStatistics> {
  data: {
    min_temperature: number
    max_temperature: number
    avg_temperature: number
    min_humidity: number
    max_humidity: number
    avg_humidity: number
    total_readings: number
    session_duration: number           // Milliseconds as number
    last_update: number               // Unix timestamp as number
    sessionDurationFormatted: string  // Human readable
    lastUpdateFormatted: string       // Human readable
  }
}
```

### **Query Parameters**

#### **History Endpoint**
- `startDate`: Date in YYYY-MM-DD format
- `endDate`: Date in YYYY-MM-DD format
- `startTime`: Unix timestamp (milliseconds)
- `endTime`: Unix timestamp (milliseconds)
- `limit`: Number of records (default: 100, max: 1000)

#### **Export Endpoint**
- `format`: 'json' | 'csv' (default: 'json')
- `startDate`: Date in YYYY-MM-DD format
- `endDate`: Date in YYYY-MM-DD format

### **Example API Calls**
```bash
# Get current readings
curl http://localhost:8000/api/sensors/sensor1/current

# Get historical data with date range
curl "http://localhost:8000/api/sensors/sensor1/history?startDate=2024-01-01&endDate=2024-01-31&limit=500"

# Get statistics
curl http://localhost:8000/api/sensors/sensor1/statistics

# Export data as CSV
curl "http://localhost:8000/api/sensors/sensor1/export?format=csv&startDate=2024-01-01&endDate=2024-01-31" -o sensor_data.csv

# Health check
curl http://localhost:8000/api/sensors/health
```

---

## ⚛️ Frontend Integration

### **TypeScript Interfaces** (Must match server responses)
```typescript
// File: types/sensor.ts

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
  session_duration: number              // NUMBER not string
  sessionDurationFormatted: string
  last_update: number                   // NUMBER not string
  lastUpdateFormatted: string
}

export interface Sensor {
  id: string
  name: string
  location: string
  type: string
  status: "online" | "offline" | "warning"
  current: SensorCurrent
  statistics: SensorStatistics
  last_seen: string
}

export interface DashboardResponse {
  current: SensorCurrent
  statistics: SensorStatistics
  recentHistory: HistoricalReading[]
  sensorId: string
}
```

### **API Client Example**
```typescript
// File: lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class SensorAPI {
  private static async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE}/api/sensors${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  static async getCurrentReadings(sensorId: string): Promise<APIResponse<SensorCurrent>> {
    return this.request(`/${sensorId}/current`);
  }

  static async getHistory(
    sensorId: string, 
    startDate?: string, 
    endDate?: string, 
    limit?: number
  ): Promise<APIResponse<HistoricalReading[]>> {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    if (limit) params.set('limit', limit.toString());
    
    return this.request(`/${sensorId}/history?${params}`);
  }

  static async getStatistics(sensorId: string): Promise<APIResponse<SensorStatistics>> {
    return this.request(`/${sensorId}/statistics`);
  }

  static async getDashboard(sensorId: string): Promise<APIResponse<DashboardResponse>> {
    return this.request(`/${sensorId}/dashboard`);
  }
}
```

---

## 🚨 Data Consistency Issues & Solutions

### **Issue 1: Data Type Mismatches**

#### Problem:
- ESP8266 sends `session_duration` and `last_update` as **String**
- Server expects **number**
- Frontend types expect **number**

#### Solution:
```cpp
// ESP8266 Fix:
sendData(sensorId + "/statistics/session_duration", sessionDuration); // Remove String()
sendData(sensorId + "/statistics/last_update", currentTime);          // Remove String()
```

### **Issue 2: Timestamp Inconsistency**

#### Problem:
- ESP8266 uses `millis()` (device uptime)
- Server/Frontend expect Unix timestamps

#### Solution:
```cpp
// ESP8266 Fix: Use NTP client
#include <NTPClient.h>
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

unsigned long getCurrentTimestamp() {
  timeClient.update();
  return timeClient.getEpochTime() * 1000; // Milliseconds
}
```

### **Issue 3: Sensor ID Management**

#### Problem:
- ESP8266 hardcoded to "sensor1"
- No multi-sensor support

#### Solution:
```cpp
// ESP8266 Configuration
String sensorId = "sensor001"; // Use consistent naming
// Or load from EEPROM/config file
```

### **Issue 4: Server Data Path**

#### Problem:
- Server looks for data at root level
- May conflict with other Firebase data

#### Solution:
```javascript
// Server Fix: Use consistent base path
class SensorService {
  constructor() {
    this.basePath = 'sensors'; // Add sensors prefix
  }
  
  async getCurrentReadings(sensorId) {
    const currentRef = ref(database, `${this.basePath}/${sensorId}/current`);
    // ...
  }
}
```

---

## 🛠️ Installation & Setup

### **1. ESP8266 Setup**
```cpp
// Required libraries in platformio.ini or Arduino IDE:
// - ESP8266WiFi
// - Firebase_ESP_Client
// - DHT sensor library
// - NTPClient

// Update your ESP8266 code with:
// 1. Fix data types (remove String() from numbers)
// 2. Add NTP client for proper timestamps
// 3. Configure sensor ID properly
```

### **2. Server Setup**
```bash
cd server
npm install
cp env.example .env

# Edit .env with your settings
# Start server
npm run dev  # Development
npm start    # Production
```

### **3. Frontend Setup**
```bash
cd iot-dashboard
npm install

# Update .env.local with server URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

npm run dev
```

### **4. Firebase Setup**
1. Create Firebase project
2. Enable Realtime Database
3. Set database rules (see schema section)
4. Update Firebase config in both ESP8266 and server

---

## 🔍 Troubleshooting

### **Common Issues**

#### **1. ESP8266 not sending data**
```
Check Serial Monitor for:
- WiFi connection status
- Firebase authentication success
- Data sending confirmations
```

#### **2. Server getting null/undefined data**
```bash
# Test Firebase connection directly
curl https://enviroment-controll-default-rtdb.firebaseio.com/sensor1/current.json

# Check server logs
npm run dev # See console output
```

#### **3. Frontend not displaying data**
```typescript
// Check API calls in browser network tab
// Verify data structure matches TypeScript interfaces
// Check console for type errors
```

### **4. Data Type Validation**
```javascript
// Server validation middleware
const validateSensorData = (req, res, next) => {
  const { temperature, humidity, timestamp } = req.body;
  
  if (typeof temperature !== 'number' || 
      typeof humidity !== 'number' || 
      typeof timestamp !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'Invalid data types'
    });
  }
  next();
};
```

---

## 📈 Performance & Monitoring

### **Database Optimization**
- Index on timestamp field for historical queries
- Implement data retention policy (auto-delete old data)
- Use Firebase database rules for validation

### **Server Monitoring**
```javascript
// Add metrics collection
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});
```

### **ESP8266 Error Handling**
```cpp
void sendDataWithRetry(const String& path, float value, int maxRetries = 3) {
  for (int i = 0; i < maxRetries; i++) {
    if (Firebase.RTDB.setFloat(&fbdo, path, value)) {
      Serial.println("Data sent successfully");
      return;
    }
    Serial.printf("Retry %d failed: %s\n", i+1, fbdo.errorReason().c_str());
    delay(1000);
  }
  Serial.println("Failed to send data after retries");
}
```

---

## 📝 Changelog & Migration

### **Version 1.1 - Data Structure Fixes**
- ✅ Fixed ESP8266 data type issues
- ✅ Added NTP timestamp support
- ✅ Standardized API responses
- ✅ Added comprehensive validation

### **Migration Guide**
1. Update ESP8266 code with fixes above
2. Clear existing Firebase data to remove inconsistent types
3. Restart ESP8266 to begin sending properly formatted data
4. Verify server API responses match new format
5. Update frontend if necessary

---

## 🤝 Support & Contributing

For issues:
1. Check this README for data format specifications
2. Verify all components use consistent data types
3. Test each component independently
4. Check Firebase database structure matches schema

---

## 📄 License
MIT License - Use freely for your IoT projects 