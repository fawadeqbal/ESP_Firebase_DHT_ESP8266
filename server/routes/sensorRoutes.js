import express from 'express';
import sensorService from '../services/sensorService.js';
import moment from 'moment';

const router = express.Router();

// Middleware to validate sensor ID
const validateSensorId = (req, res, next) => {
  const { sensorId } = req.params;
  if (!sensorId || sensorId.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Sensor ID is required'
    });
  }
  next();
};

// GET /api/sensors - Get all sensors current readings
router.get('/', async (req, res) => {
  try {
    const result = await sensorService.getAllSensorsCurrent();
    res.json(result);
  } catch (error) {
    console.error('Error in GET /api/sensors:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/sensors/:sensorId/current - Get current readings for a specific sensor
router.get('/:sensorId/current', validateSensorId, async (req, res) => {
  try {
    const { sensorId } = req.params;
    const result = await sensorService.getCurrentReadings(sensorId);
    res.json(result);
  } catch (error) {
    console.error('Error in GET /api/sensors/:sensorId/current:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/sensors/:sensorId/history - Get historical data for a specific sensor
router.get('/:sensorId/history', validateSensorId, async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { 
      startTime, 
      endTime, 
      limit = 100,
      startDate,
      endDate 
    } = req.query;

    let result;

    // If date range is provided, use date-based filtering
    if (startDate && endDate) {
      result = await sensorService.getDataByDateRange(sensorId, startDate, endDate);
    } else {
      // Use timestamp-based filtering
      result = await sensorService.getHistoricalData(
        sensorId, 
        startTime, 
        endTime, 
        parseInt(limit)
      );
    }

    res.json(result);
  } catch (error) {
    console.error('Error in GET /api/sensors/:sensorId/history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/sensors/:sensorId/statistics - Get statistics for a specific sensor
router.get('/:sensorId/statistics', validateSensorId, async (req, res) => {
  try {
    const { sensorId } = req.params;
    const result = await sensorService.getStatistics(sensorId);
    res.json(result);
  } catch (error) {
    console.error('Error in GET /api/sensors/:sensorId/statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/sensors/:sensorId/dashboard - Get dashboard data for a specific sensor
router.get('/:sensorId/dashboard', validateSensorId, async (req, res) => {
  try {
    const { sensorId } = req.params;
    const result = await sensorService.getDashboardData(sensorId);
    res.json(result);
  } catch (error) {
    console.error('Error in GET /api/sensors/:sensorId/dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/dashboard - Get dashboard data for all sensors
router.get('/dashboard/overview', async (req, res) => {
  try {
    const result = await sensorService.getDashboardData();
    res.json(result);
  } catch (error) {
    console.error('Error in GET /api/dashboard/overview:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// GET /api/sensors/:sensorId/export - Export data for a specific sensor
router.get('/:sensorId/export', validateSensorId, async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { format = 'json', startDate, endDate } = req.query;

    let result;
    if (startDate && endDate) {
      result = await sensorService.getDataByDateRange(sensorId, startDate, endDate);
    } else {
      result = await sensorService.getHistoricalData(sensorId, null, null, 1000);
    }

    if (!result.success) {
      return res.status(404).json(result);
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(result.data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=sensor_${sensorId}_${moment().format('YYYY-MM-DD')}.csv`);
      res.send(csvData);
    } else {
      // Return JSON format
      res.json({
        ...result,
        exportInfo: {
          sensorId,
          format,
          exportedAt: new Date().toISOString(),
          recordCount: result.data.length
        }
      });
    }
  } catch (error) {
    console.error('Error in GET /api/sensors/:sensorId/export:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (!data || data.length === 0) {
    return 'No data available';
  }

  const headers = ['ID', 'Temperature (°C)', 'Humidity (%)', 'Timestamp', 'Reading Number', 'Formatted Time'];
  const csvRows = [headers.join(',')];

  data.forEach(item => {
    const row = [
      item.id || '',
      item.temperature || '',
      item.humidity || '',
      item.timestamp || '',
      item.reading_number || '',
      `"${item.formattedTime || ''}"`
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sensor API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router; 