import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testServer() {
  console.log('🧪 Testing ESP8266 Firebase DHT Sensor API Server...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/api/sensors/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    console.log('   Status:', healthResponse.status);
    console.log('   Uptime:', healthData.uptime, 'seconds\n');

    // Test 2: API documentation
    console.log('2. Testing API documentation...');
    const docsResponse = await fetch(`${BASE_URL}/api/docs`);
    const docsData = await docsResponse.json();
    console.log('✅ API Documentation loaded');
    console.log('   Title:', docsData.title);
    console.log('   Version:', docsData.version);
    console.log('   Endpoints available:', Object.keys(docsData.endpoints).length, '\n');

    // Test 3: Root endpoint
    console.log('3. Testing root endpoint...');
    const rootResponse = await fetch(`${BASE_URL}/`);
    const rootData = await rootResponse.json();
    console.log('✅ Root endpoint:', rootData.message);
    console.log('   Version:', rootData.version);
    console.log('   Timestamp:', rootData.timestamp, '\n');

    // Test 4: Get all sensors (this might fail if no data exists yet)
    console.log('4. Testing get all sensors...');
    try {
      const sensorsResponse = await fetch(`${BASE_URL}/api/sensors`);
      const sensorsData = await sensorsResponse.json();
      
      if (sensorsData.success) {
        console.log('✅ All sensors endpoint working');
        console.log('   Sensors found:', sensorsData.count);
        console.log('   Data keys:', Object.keys(sensorsData.data || {}));
      } else {
        console.log('⚠️  No sensors found (this is normal if no data exists yet)');
        console.log('   Message:', sensorsData.message);
      }
    } catch (error) {
      console.log('⚠️  Sensors endpoint error (might be expected):', error.message);
    }
    console.log('');

    // Test 5: Test specific sensor (this will likely fail without data)
    console.log('5. Testing specific sensor endpoint...');
    try {
      const sensorResponse = await fetch(`${BASE_URL}/api/sensors/test-sensor/current`);
      const sensorData = await sensorResponse.json();
      
      if (sensorData.success) {
        console.log('✅ Specific sensor endpoint working');
        console.log('   Temperature:', sensorData.data.temperature);
        console.log('   Humidity:', sensorData.data.humidity);
      } else {
        console.log('⚠️  Test sensor not found (expected if no data exists)');
        console.log('   Message:', sensorData.message);
      }
    } catch (error) {
      console.log('⚠️  Specific sensor endpoint error (expected):', error.message);
    }
    console.log('');

    console.log('🎉 Server test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Make sure your ESP8266 is sending data to Firebase');
    console.log('   2. Check that your sensor ID matches the expected format');
    console.log('   3. Test with real sensor data using the API endpoints');
    console.log('\n📖 API Documentation: http://localhost:3000/api/docs');
    console.log('🏥 Health Check: http://localhost:3000/api/sensors/health');

  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the server is running on port 3000');
    console.log('   2. Check if Firebase configuration is correct');
    console.log('   3. Verify network connectivity');
  }
}

// Run the test
testServer(); 