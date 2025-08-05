import { database, ref, get, onValue } from './config/firebase.js';
import moment from 'moment';

/**
 * ESP8266 Time Synchronization Debug Tool
 * Real-time monitoring of timestamps from ESP8266
 */

console.log('🕐 ESP8266 Time Sync Monitor Starting...\n');

// Function to analyze timestamp
function analyzeTimestamp(timestamp, label) {
  console.log(`\n📊 ${label}:`);
  console.log(`  Raw timestamp: ${timestamp}`);
  console.log(`  Type: ${typeof timestamp}`);
  
  if (typeof timestamp === 'number') {
    const timestampStr = timestamp.toString();
    console.log(`  Length: ${timestampStr.length} digits`);
    
    if (timestampStr.length >= 13) {
      // Milliseconds
      const date = new Date(timestamp);
      console.log(`  Interpreted as: ${date.toISOString()}`);
      console.log(`  UTC: ${moment(timestamp).utc().format('YYYY-MM-DD HH:mm:ss UTC')}`);
      
      // Check if timestamp is reasonable (after 2020, before 2030)
      const year = date.getFullYear();
      if (year >= 2020 && year <= 2030) {
        console.log(`  ✅ Timestamp appears valid (year: ${year})`);
      } else {
        console.log(`  ❌ Timestamp appears invalid (year: ${year})`);
      }
      
      // Check how recent it is
      const now = Date.now();
      const diffMs = Math.abs(now - timestamp);
      const diffMinutes = diffMs / (1000 * 60);
      
      if (diffMinutes < 5) {
        console.log(`  ✅ Very recent (${diffMinutes.toFixed(1)} minutes ago)`);
      } else if (diffMinutes < 60) {
        console.log(`  ⚠️  Recent (${diffMinutes.toFixed(1)} minutes ago)`);
      } else {
        console.log(`  ❌ Old (${diffMinutes.toFixed(1)} minutes ago)`);
      }
    } else if (timestampStr.length >= 10) {
      // Seconds - convert to milliseconds for display
      const msTimestamp = timestamp * 1000;
      const date = new Date(msTimestamp);
      console.log(`  Interpreted as seconds: ${date.toISOString()}`);
      console.log(`  ❌ Should be in milliseconds, not seconds!`);
    } else {
      console.log(`  ❌ Too short - appears to be device uptime (millis())`);
    }
  } else {
    console.log(`  ❌ Not a number! Type: ${typeof timestamp}`);
  }
}

// Monitor current readings
const currentRef = ref(database, 'sensor1/current');
console.log('👁️  Monitoring sensor1/current for real-time updates...');

onValue(currentRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log('\n🔄 NEW READING DETECTED!');
    console.log('='.repeat(50));
    
    analyzeTimestamp(data.timestamp, 'Current Reading Timestamp');
    
    console.log(`\n📈 Reading Data:`);
    console.log(`  Temperature: ${data.temperature}°C`);
    console.log(`  Humidity: ${data.humidity}%`);
    console.log(`  Reading #: ${data.reading_number}`);
    
    console.log('\n' + '='.repeat(50));
  }
}, (error) => {
  console.error('❌ Error monitoring current readings:', error);
});

// Also check statistics periodically
setInterval(async () => {
  try {
    const statsRef = ref(database, 'sensor1/statistics');
    const snapshot = await get(statsRef);
    
    if (snapshot.exists()) {
      const stats = snapshot.val();
      console.log('\n📊 STATISTICS CHECK:');
      
      if (stats.last_update) {
        analyzeTimestamp(stats.last_update, 'Statistics Last Update');
      }
      
      if (stats.session_duration) {
        console.log(`\n⏱️  Session Duration: ${stats.session_duration} ms`);
        const duration = moment.duration(stats.session_duration);
        console.log(`  Formatted: ${Math.floor(duration.asDays())}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`);
      }
    }
  } catch (error) {
    console.error('❌ Error checking statistics:', error);
  }
}, 30000); // Check every 30 seconds

// Print current system time for comparison
setInterval(() => {
  const now = Date.now();
  console.log(`\n🕐 System Time Check: ${moment().utc().format('YYYY-MM-DD HH:mm:ss UTC')} (${now})`);
}, 60000); // Every minute

console.log('\n✨ Monitor is running... Press Ctrl+C to stop');
console.log('💡 Flash your ESP8266 with the updated code to see real-time fixes'); 