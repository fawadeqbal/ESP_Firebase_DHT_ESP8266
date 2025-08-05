import { database, ref, get } from './config/firebase.js';
import moment from 'moment';

/**
 * Comprehensive Timestamp Validation Test
 * Tests timestamp consistency across ESP8266 → Firebase → Server → Frontend
 */

async function testTimestamps() {
  console.log('🕐 Starting Timestamp Validation Test...\n');

  try {
    // Test 1: Check current readings timestamp format
    console.log('📊 Test 1: Current Readings Timestamp Format');
    const currentRef = ref(database, 'sensor1/current');
    const currentSnapshot = await get(currentRef);
    
    if (currentSnapshot.exists()) {
      const currentData = currentSnapshot.val();
      console.log('✅ Current data found:', currentData);
      
      // Validate timestamp is a number
      if (typeof currentData.timestamp === 'number') {
        console.log('✅ Timestamp is number:', currentData.timestamp);
        
        // Check if timestamp is in milliseconds (should be ~13 digits)
        const timestampStr = currentData.timestamp.toString();
        if (timestampStr.length >= 13) {
          console.log('✅ Timestamp appears to be in milliseconds');
          
          // Convert to human readable
          const readable = moment(currentData.timestamp).utc().format('YYYY-MM-DD HH:mm:ss UTC');
          console.log('✅ Converted to UTC:', readable);
          
          // Check if timestamp is recent (within last 24 hours)
          const now = Date.now();
          const diff = Math.abs(now - currentData.timestamp);
          const hoursDiff = diff / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            console.log('✅ Timestamp is recent (within 24 hours)');
          } else {
            console.log('⚠️  Timestamp seems old:', hoursDiff.toFixed(2), 'hours ago');
          }
        } else {
          console.log('❌ Timestamp appears to be in seconds, should be milliseconds');
        }
      } else {
        console.log('❌ Timestamp is not a number:', typeof currentData.timestamp);
      }
    } else {
      console.log('❌ No current data found');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 2: Check statistics timestamp format
    console.log('📈 Test 2: Statistics Timestamp Format');
    const statsRef = ref(database, 'sensor1/statistics');
    const statsSnapshot = await get(statsRef);
    
    if (statsSnapshot.exists()) {
      const statsData = statsSnapshot.val();
      console.log('✅ Statistics data found');
      
      // Check last_update
      if (typeof statsData.last_update === 'number') {
        console.log('✅ last_update is number:', statsData.last_update);
        const readable = moment(statsData.last_update).utc().format('YYYY-MM-DD HH:mm:ss UTC');
        console.log('✅ last_update in UTC:', readable);
      } else {
        console.log('❌ last_update is not a number:', typeof statsData.last_update, '=', statsData.last_update);
      }
      
      // Check session_duration
      if (typeof statsData.session_duration === 'number') {
        console.log('✅ session_duration is number:', statsData.session_duration);
        const duration = moment.duration(statsData.session_duration);
        const formatted = Math.floor(duration.asDays()) + 'd ' + 
                         duration.hours() + 'h ' + 
                         duration.minutes() + 'm ' + 
                         duration.seconds() + 's';
        console.log('✅ session_duration formatted:', formatted);
      } else {
        console.log('❌ session_duration is not a number:', typeof statsData.session_duration, '=', statsData.session_duration);
      }
    } else {
      console.log('❌ No statistics data found');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 3: Check historical data timestamp format
    console.log('🏛️  Test 3: Historical Data Timestamp Format');
    const historyRef = ref(database, 'sensor1/history');
    const historySnapshot = await get(historyRef);
    
    if (historySnapshot.exists()) {
      const historyData = historySnapshot.val();
      const timestamps = Object.keys(historyData);
      console.log('✅ Found', timestamps.length, 'historical records');
      
      // Check latest record
      const latestTimestamp = Math.max(...timestamps.map(Number));
      const latestRecord = historyData[latestTimestamp];
      
      console.log('Latest record timestamp key:', latestTimestamp);
      console.log('Latest record data:', latestRecord);
      
      if (typeof latestRecord.timestamp === 'number') {
        console.log('✅ Record timestamp is number:', latestRecord.timestamp);
        
        // Check if key matches the timestamp value
        if (latestTimestamp === latestRecord.timestamp) {
          console.log('✅ Key matches timestamp value');
        } else {
          console.log('⚠️  Key does not match timestamp value');
        }
        
        const readable = moment(latestRecord.timestamp).utc().format('YYYY-MM-DD HH:mm:ss UTC');
        console.log('✅ Record timestamp in UTC:', readable);
      } else {
        console.log('❌ Record timestamp is not a number:', typeof latestRecord.timestamp);
      }
    } else {
      console.log('❌ No historical data found');
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 4: Server API Response Format
    console.log('🖥️  Test 4: Server API Response Format Simulation');
    
    // Simulate server processing
    if (currentSnapshot.exists()) {
      const rawData = currentSnapshot.val();
      const serverResponse = {
        success: true,
        data: {
          ...rawData,
          formattedTime: moment(rawData.timestamp).utc().format('YYYY-MM-DD HH:mm:ss UTC')
        },
        timestamp: Date.now()
      };
      
      console.log('✅ Server response simulation:');
      console.log('  - Raw timestamp:', serverResponse.data.timestamp);
      console.log('  - Formatted time:', serverResponse.data.formattedTime);
      console.log('  - Response timestamp:', serverResponse.timestamp);
    }

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 5: Frontend Processing Simulation
    console.log('⚛️  Test 5: Frontend Processing Simulation');
    
    if (currentSnapshot.exists()) {
      const serverData = currentSnapshot.val();
      
      // Simulate frontend Date conversion (should NOT multiply by 1000)
      const jsDate = new Date(serverData.timestamp);
      const frontendTime = jsDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      
      console.log('✅ Frontend time conversion:');
      console.log('  - JavaScript Date:', jsDate.toISOString());
      console.log('  - Locale time string:', frontendTime);
      console.log('  - Full locale string:', jsDate.toLocaleString());
    }

    console.log('\n' + '🎉 Timestamp validation test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Utility function to check current system time vs NTP
async function checkSystemTime() {
  console.log('\n🕐 System Time Check:');
  const now = Date.now();
  const utc = moment().utc().format('YYYY-MM-DD HH:mm:ss UTC');
  console.log('Current system timestamp:', now);
  console.log('Current UTC time:', utc);
  console.log('Timestamp length:', now.toString().length, '(should be 13 digits)');
}

// Run tests
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 ESP8266 Firebase DHT Sensor - Timestamp Validation\n');
  await checkSystemTime();
  await testTimestamps();
}

export { testTimestamps, checkSystemTime }; 