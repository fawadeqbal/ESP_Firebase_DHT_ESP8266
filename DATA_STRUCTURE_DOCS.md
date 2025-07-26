# IoT Sensor Data Structure Documentation

## Overview
This document describes the Firebase Realtime Database structure for the ESP8266 DHT sensor system. The data is organized for real-time dashboards, historical analytics, and device management.

## Database Structure

### Root Path: `/`
```
├── realtime/
│   └── sensor1/
│       ├── temperature: float
│       ├── humidity: float
│       ├── last_update: timestamp
│       ├── status: "online" | "error"
│       ├── error_count: int
│       └── last_error: timestamp
├── timeseries/
│   └── sensor1/
│       └── {timestamp}/
│           ├── temperature: float
│           ├── humidity: float
│           └── timestamp: timestamp
├── analytics/
│   └── sensor1/
│       ├── temperature/
│       │   ├── min: float
│       │   ├── max: float
│       │   └── avg: float
│       ├── humidity/
│       │   ├── min: float
│       │   ├── max: float
│       │   └── avg: float
│       └── readings_count: int
└── devices/
    └── sensor1/
        ├── firmware_version: string
        ├── location: string
        ├── sensor_type: string
        └── last_seen: timestamp
```

## Data Types

### Real-time Data
**Path**: `realtime/{sensorId}/`

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| temperature | float | Current temperature in Celsius | 25.5 |
| humidity | float | Current humidity percentage | 60.2 |
| last_update | timestamp | Last successful reading time | 1234567890 |
| status | string | Device status | "online" or "error" |
| error_count | int | Consecutive error count | 0 |
| last_error | timestamp | Last error timestamp | 1234567890 |

### Time-series Data
**Path**: `timeseries/{sensorId}/{timestamp}/`

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| temperature | float | Temperature reading | 25.5 |
| humidity | float | Humidity reading | 60.2 |
| timestamp | timestamp | Reading timestamp | 1234567890 |

### Analytics Data
**Path**: `analytics/{sensorId}/`

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| temperature/min | float | Minimum temperature | 20.1 |
| temperature/max | float | Maximum temperature | 30.5 |
| temperature/avg | float | Average temperature | 25.3 |
| humidity/min | float | Minimum humidity | 45.0 |
| humidity/max | float | Maximum humidity | 75.0 |
| humidity/avg | float | Average humidity | 60.2 |
| readings_count | int | Total readings taken | 150 |

### Device Metadata
**Path**: `devices/{sensorId}/`

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| firmware_version | string | Device firmware version | "1.0.0" |
| location | string | Device location | "room_1" |
| sensor_type | string | Sensor model | "DHT11" |
| last_seen | timestamp | Last device activity | 1234567890 |

## API Endpoints for Dashboard

### 1. Get Current Sensor Data
```javascript
// Firebase SDK
const currentData = await firebase.database()
  .ref('realtime/sensor1')
  .once('value');
```

### 2. Get Historical Data
```javascript
// Get last 24 hours of data
const startTime = Date.now() - (24 * 60 * 60 * 1000);
const historicalData = await firebase.database()
  .ref('timeseries/sensor1')
  .orderByKey()
  .startAt(startTime.toString())
  .once('value');
```

### 3. Get Analytics
```javascript
// Get statistical data
const analytics = await firebase.database()
  .ref('analytics/sensor1')
  .once('value');
```

### 4. Get Device Status
```javascript
// Get device metadata and status
const deviceInfo = await firebase.database()
  .ref('devices/sensor1')
  .once('value');
```

## Dashboard Integration Examples

### Real-time Temperature Chart
```javascript
// Listen for real-time temperature updates
firebase.database()
  .ref('realtime/sensor1/temperature')
  .on('value', (snapshot) => {
    const temperature = snapshot.val();
    updateTemperatureChart(temperature);
  });
```

### Historical Data Chart
```javascript
// Get historical data for chart
firebase.database()
  .ref('timeseries/sensor1')
  .orderByKey()
  .limitToLast(100)
  .on('value', (snapshot) => {
    const data = snapshot.val();
    updateHistoricalChart(data);
  });
```

### Device Status Dashboard
```javascript
// Monitor device status
firebase.database()
  .ref('realtime/sensor1/status')
  .on('value', (snapshot) => {
    const status = snapshot.val();
    updateDeviceStatus(status);
  });
```

## Data Update Frequency

- **Real-time data**: Updated every 30 seconds
- **Time-series data**: Stored with each reading
- **Analytics data**: Updated with each reading
- **Device metadata**: Updated with each reading

## Error Handling

### Error States
- `status: "error"` - Device experiencing issues
- `error_count` - Number of consecutive failed readings
- `last_error` - Timestamp of last error

### Error Recovery
- Device automatically resets error count on successful reading
- Status returns to "online" after successful reading

## Scaling for Multiple Sensors

### Adding New Sensors
1. Change `sensorId` in the code
2. Update device metadata
3. Data automatically creates new paths

### Example Multi-Sensor Structure
```
├── realtime/
│   ├── sensor1/
│   ├── sensor2/
│   └── sensor3/
├── timeseries/
│   ├── sensor1/
│   ├── sensor2/
│   └── sensor3/
├── analytics/
│   ├── sensor1/
│   ├── sensor2/
│   └── sensor3/
└── devices/
    ├── sensor1/
    ├── sensor2/
    └── sensor3/
```

## Security Rules (Firebase)

```json
{
  "rules": {
    "realtime": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "timeseries": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "analytics": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "devices": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## Dashboard Recommendations

### Essential Widgets
1. **Current Values Display**
   - Temperature and humidity cards
   - Last update timestamp
   - Device status indicator

2. **Real-time Charts**
   - Line chart for temperature trends
   - Line chart for humidity trends
   - Update every 30 seconds

3. **Historical Analysis**
   - Time-range selector
   - Min/max/average displays
   - Trend analysis

4. **Device Management**
   - Device status overview
   - Error monitoring
   - Firmware version tracking

### Recommended Technologies
- **Frontend**: React, Vue.js, or Angular
- **Charts**: Chart.js, D3.js, or ApexCharts
- **Real-time**: Firebase SDK or WebSocket
- **Styling**: Material-UI, Bootstrap, or Tailwind CSS

## Data Export Options

### CSV Export
```javascript
// Export time-series data
const exportData = async () => {
  const data = await firebase.database()
    .ref('timeseries/sensor1')
    .once('value');
  
  const csv = convertToCSV(data.val());
  downloadCSV(csv, 'sensor_data.csv');
};
```

### JSON Export
```javascript
// Export all data
const exportAllData = async () => {
  const data = await firebase.database()
    .ref()
    .once('value');
  
  downloadJSON(data.val(), 'sensor_data.json');
};
```

## Performance Considerations

### Data Retention
- **Real-time**: Keep current values only
- **Time-series**: Consider archiving old data
- **Analytics**: Keep running totals

### Query Optimization
- Use specific paths instead of root queries
- Implement pagination for large datasets
- Use Firebase indexes for complex queries

## Troubleshooting

### Common Issues
1. **No data updates**: Check device status and error count
2. **Missing historical data**: Verify time-series path structure
3. **Dashboard not updating**: Check Firebase connection and auth

### Debug Information
- Monitor `error_count` for device issues
- Check `last_seen` for device connectivity
- Review `status` field for device health

---

*Last Updated: [Current Date]*
*Version: 1.0.0* 