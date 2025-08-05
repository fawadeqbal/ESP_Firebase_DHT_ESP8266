import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import sensorRoutes from './routes/sensorRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// API routes
app.use('/api/sensors', sensorRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ESP8266 Firebase DHT Sensor API',
    version: '1.0.0',
    endpoints: {
      sensors: '/api/sensors',
      health: '/api/sensors/health',
      documentation: '/api/docs'
    },
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'ESP8266 Firebase DHT Sensor API Documentation',
    version: '1.0.0',
    endpoints: {
      'GET /api/sensors': {
        description: 'Get all sensors current readings',
        parameters: 'None',
        response: 'Array of sensor data'
      },
      'GET /api/sensors/:sensorId/current': {
        description: 'Get current readings for a specific sensor',
        parameters: 'sensorId (path)',
        response: 'Current sensor readings'
      },
      'GET /api/sensors/:sensorId/history': {
        description: 'Get historical data for a specific sensor',
        parameters: {
          sensorId: 'path parameter',
          startTime: 'query parameter (timestamp)',
          endTime: 'query parameter (timestamp)',
          startDate: 'query parameter (YYYY-MM-DD)',
          endDate: 'query parameter (YYYY-MM-DD)',
          limit: 'query parameter (default: 100)'
        },
        response: 'Historical sensor data'
      },
      'GET /api/sensors/:sensorId/statistics': {
        description: 'Get statistics for a specific sensor',
        parameters: 'sensorId (path)',
        response: 'Sensor statistics'
      },
      'GET /api/sensors/:sensorId/dashboard': {
        description: 'Get dashboard data for a specific sensor',
        parameters: 'sensorId (path)',
        response: 'Dashboard data including current, statistics, and recent history'
      },
      'GET /api/sensors/dashboard/overview': {
        description: 'Get dashboard data for all sensors',
        parameters: 'None',
        response: 'Overview of all sensors'
      },
      'GET /api/sensors/:sensorId/export': {
        description: 'Export data for a specific sensor',
        parameters: {
          sensorId: 'path parameter',
          format: 'query parameter (json/csv, default: json)',
          startDate: 'query parameter (YYYY-MM-DD)',
          endDate: 'query parameter (YYYY-MM-DD)'
        },
        response: 'Exported data in specified format'
      },
      'GET /api/sensors/health': {
        description: 'Health check endpoint',
        parameters: 'None',
        response: 'Server health status'
      }
    },
    examples: {
      'Get current readings': 'GET /api/sensors/sensor001/current',
      'Get historical data with date range': 'GET /api/sensors/sensor001/history?startDate=2024-01-01&endDate=2024-01-31',
      'Get last 50 readings': 'GET /api/sensors/sensor001/history?limit=50',
      'Export data as CSV': 'GET /api/sensors/sensor001/export?format=csv&startDate=2024-01-01&endDate=2024-01-31'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /',
      'GET /api/docs',
      'GET /api/sensors',
      'GET /api/sensors/:sensorId/current',
      'GET /api/sensors/:sensorId/history',
      'GET /api/sensors/:sensorId/statistics',
      'GET /api/sensors/:sensorId/dashboard',
      'GET /api/sensors/dashboard/overview',
      'GET /api/sensors/:sensorId/export',
      'GET /api/sensors/health'
    ]
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ESP8266 Firebase DHT Sensor API server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/sensors/health`);
  console.log(`📊 All Sensors: http://localhost:${PORT}/api/sensors`);
});

export default app; 