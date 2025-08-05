import { database, ref, get, query, orderByChild, startAt, endAt, limitToLast } from '../config/firebase.js';
import moment from 'moment';

class SensorService {
  constructor() {
    this.basePath = '';  // No prefix needed, data is stored directly under sensor IDs
  }

  // Get current readings for a specific sensor
  async getCurrentReadings(sensorId) {
    try {
      const currentRef = ref(database, `${this.basePath}/${sensorId}/current`);
      const snapshot = await get(currentRef);
      
      if (snapshot.exists()) {
        const currentData = snapshot.val();
        if (currentData.timestamp) {
          console.log('DEBUG: Raw current timestamp from DB:', currentData.timestamp, 'Length:', currentData.timestamp?.toString().length);
        }
        return {
          success: true,
          data: {
            ...currentData,
            formattedTime: moment(currentData.timestamp * 1000).utc().format('YYYY-MM-DD HH:mm:ss UTC')
          },
          timestamp: Date.now()
        };
      } else {
        return {
          success: false,
          message: 'No current readings found for this sensor',
          data: null
        };
      }
    } catch (error) {
      console.error('Error fetching current readings:', error);
      return {
        success: false,
        message: 'Failed to fetch current readings',
        error: error.message
      };
    }
  }

  // Get historical data with time range filtering
  async getHistoricalData(sensorId, startTime = null, endTime = null, limit = 100) {
    try {
      const historyRef = ref(database, `${this.basePath}/${sensorId}/history`);
      
      let historyQuery = historyRef;
      
      // Apply time filters if provided
      if (startTime && endTime) {
        historyQuery = query(
          historyRef,
          orderByChild('timestamp'),
          startAt(parseInt(startTime)),
          endAt(parseInt(endTime)),
          limitToLast(limit)
        );
      } else if (startTime) {
        historyQuery = query(
          historyRef,
          orderByChild('timestamp'),
          startAt(parseInt(startTime)),
          limitToLast(limit)
        );
      } else if (endTime) {
        historyQuery = query(
          historyRef,
          orderByChild('timestamp'),
          endAt(parseInt(endTime)),
          limitToLast(limit)
        );
      } else {
        // Get latest data if no time range specified
        historyQuery = query(historyRef, limitToLast(limit));
      }

      const snapshot = await get(historyQuery);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedData = Object.keys(data).map(key => {
          const item = data[key];
          console.log('DEBUG: Raw history timestamp from DB:', item.timestamp, 'Length:', item.timestamp?.toString().length);
          return {
            id: key,
            ...item,
            formattedTime: moment(item.timestamp * 1000).utc().format('YYYY-MM-DD HH:mm:ss UTC')
          };
        }).sort((a, b) => a.timestamp - b.timestamp);

        return {
          success: true,
          data: formattedData,
          count: formattedData.length,
          timestamp: Date.now()
        };
      } else {
        return {
          success: false,
          message: 'No historical data found for this sensor',
          data: []
        };
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return {
        success: false,
        message: 'Failed to fetch historical data',
        error: error.message
      };
    }
  }

  // Get statistics for a specific sensor
  async getStatistics(sensorId) {
    try {
      const statsRef = ref(database, `${this.basePath}/${sensorId}/statistics`);
      const snapshot = await get(statsRef);
      
      if (snapshot.exists()) {
        const statsData = snapshot.val();
        if (statsData.last_update) {
          console.log('DEBUG: Raw statistics last_update from DB:', statsData.last_update, 'Length:', statsData.last_update?.toString().length);
        }
        return {
          success: true,
          data: {
            ...statsData,
            lastUpdateFormatted: moment(statsData.last_update * 1000).utc().format('YYYY-MM-DD HH:mm:ss UTC'),
            sessionDurationFormatted: this.formatDuration(statsData.session_duration)
          },
          timestamp: Date.now()
        };
      } else {
        return {
          success: false,
          message: 'No statistics found for this sensor',
          data: null
        };
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        success: false,
        message: 'Failed to fetch statistics',
        error: error.message
      };
    }
  }

  // Get data for a specific date range
  async getDataByDateRange(sensorId, startDate, endDate) {
    try {
      const startTimestamp = Math.floor(moment(startDate).valueOf() / 1000);
      const endTimestamp = Math.floor(moment(endDate).valueOf() / 1000);
      
      return await this.getHistoricalData(sensorId, startTimestamp, endTimestamp, 1000);
    } catch (error) {
      console.error('Error fetching data by date range:', error);
      return {
        success: false,
        message: 'Failed to fetch data by date range',
        error: error.message
      };
    }
  }

  // Get latest readings for all sensors
  async getAllSensorsCurrent() {
    try {
      // Since basePath is empty, we need to get the root and look for sensor data
      const rootRef = ref(database, '/');
      const snapshot = await get(rootRef);
      
      if (snapshot.exists()) {
        const sensors = snapshot.val();
        const currentReadings = {};
        
        for (const sensorId in sensors) {
          if (sensors[sensorId].current) {
            const currentData = sensors[sensorId].current;
            if (currentData.timestamp) {
              console.log('DEBUG: Raw current timestamp from DB:', currentData.timestamp, 'Length:', currentData.timestamp?.toString().length);
            }
            currentReadings[sensorId] = {
              ...currentData,
              formattedTime: moment(currentData.timestamp * 1000).utc().format('YYYY-MM-DD HH:mm:ss UTC')
            };
          }
        }
        
        return {
          success: true,
          data: currentReadings,
          count: Object.keys(currentReadings).length,
          timestamp: Date.now()
        };
      } else {
        return {
          success: false,
          message: 'No sensors found',
          data: {}
        };
      }
    } catch (error) {
      console.error('Error fetching all sensors current readings:', error);
      return {
        success: false,
        message: 'Failed to fetch all sensors current readings',
        error: error.message
      };
    }
  }

  // Get aggregated data for dashboard
  async getDashboardData(sensorId = null) {
    try {
      let result = {};
      
      if (sensorId) {
        // Get data for specific sensor
        const [current, stats, recentHistory] = await Promise.all([
          this.getCurrentReadings(sensorId),
          this.getStatistics(sensorId),
          this.getHistoricalData(sensorId, null, null, 24) // Last 24 readings
        ]);
        
        result = {
          current: current.data,
          statistics: stats.data,
          recentHistory: recentHistory.data,
          sensorId
        };
      } else {
        // Get data for all sensors
        const allSensors = await this.getAllSensorsCurrent();
        result = {
          sensors: allSensors.data,
          totalSensors: allSensors.count
        };
      }
      
      return {
        success: true,
        data: result,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        success: false,
        message: 'Failed to fetch dashboard data',
        error: error.message
      };
    }
  }

  // Helper method to format duration
  formatDuration(milliseconds) {
    const duration = moment.duration(milliseconds);
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

export default new SensorService(); 