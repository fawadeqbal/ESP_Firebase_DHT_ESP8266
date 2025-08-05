import { database, ref, onValue } from './config/firebase.js';
import moment from 'moment';

/**
 * Real-time Timestamp Validator
 * Monitors Firebase for incoming timestamps and validates they are current (2025)
 */

console.log('🕐 Real-time Timestamp Validator Starting...\n');

// Function to validate if timestamp is reasonable for 2025
function validateTimestamp(timestamp, source) {
  console.log(`\n📊 Validating ${source}:`);
  console.log(`  Raw timestamp: ${timestamp}`);
  console.log(`  Type: ${typeof timestamp}`);
  
  if (typeof timestamp !== 'number') {
    console.log(`  ❌ ERROR: Timestamp is not a number!`);
    return false;
  }
  
  // Convert to date
  const date = new Date(timestamp);
  const year = date.getFullYear();
  
  console.log(`  Converted to: ${date.toISOString()}`);
  console.log(`  UTC: ${moment(timestamp).utc().format('YYYY-MM-DD HH:mm:ss UTC')}`);
  console.log(`  Year: ${year}`);
  
  // Validate year is reasonable (2025)
  if (year >= 2025 && year <= 2026) {
    console.log(`  ✅ VALID: Timestamp is from ${year} (correct)`);
    return true;
  } else if (year === 1970) {
    console.log(`  ❌ INVALID: Unix epoch (1970) - ESP8266 time not synchronized`);
    return false;
  } else if (year >= 2010 && year <= 2020) {
    console.log(`  ❌ INVALID: Year ${year} - ESP8266 time conversion issue`);
    return false;
  } else {
    console.log(`  ❌ INVALID: Unexpected year ${year}`);
    return false;
  }
}

// Monitor current readings
const currentRef = ref(database, 'sensor1/current');
console.log('👁️  Monitoring sensor1/current for timestamp validation...');

onValue(currentRef, (snapshot) => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log('\n🔄 NEW READING RECEIVED!');
    console.log('='.repeat(60));
    
    const isValid = validateTimestamp(data.timestamp, 'Current Reading');
    
    console.log(`\n📈 Reading Data:`);
    console.log(`  Temperature: ${data.temperature}°C`);
    console.log(`  Humidity: ${data.humidity}%`);
    console.log(`  Reading #: ${data.reading_number}`);
    
    if (isValid) {
      console.log(`\n✅ TIMESTAMP VALIDATION: PASSED`);
    } else {
      console.log(`\n❌ TIMESTAMP VALIDATION: FAILED`);
      console.log(`   📱 Action Required: Check ESP8266 NTP synchronization`);
    }
    
    console.log('\n' + '='.repeat(60));
  }
}, (error) => {
  console.error('❌ Error monitoring current readings:', error);
});

// Monitor statistics updates
const statsRef = ref(database, 'sensor1/statistics');
console.log('📊 Monitoring sensor1/statistics for timestamp validation...');

onValue(statsRef, (snapshot) => {
  if (snapshot.exists()) {
    const stats = snapshot.val();
    
    if (stats.last_update) {
      console.log('\n📈 STATISTICS UPDATE!');
      console.log('='.repeat(40));
      
      const isValid = validateTimestamp(stats.last_update, 'Statistics Last Update');
      
      if (stats.session_duration) {
        console.log(`\n⏱️  Session Duration: ${stats.session_duration} ms`);
        const duration = moment.duration(stats.session_duration);
        console.log(`  Formatted: ${Math.floor(duration.asDays())}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`);
      }
      
      if (isValid) {
        console.log(`\n✅ STATISTICS VALIDATION: PASSED`);
      } else {
        console.log(`\n❌ STATISTICS VALIDATION: FAILED`);
      }
      
      console.log('\n' + '='.repeat(40));
    }
  }
}, (error) => {
  console.error('❌ Error monitoring statistics:', error);
});

// Show expected timestamp range for 2025
const now = Date.now();
const start2025 = new Date('2025-01-01T00:00:00Z').getTime();
const end2025 = new Date('2025-12-31T23:59:59Z').getTime();

console.log('\n📅 Expected Timestamp Ranges for 2025:');
console.log(`  Start of 2025: ${start2025} (${moment(start2025).utc().format('YYYY-MM-DD HH:mm:ss UTC')})`);
console.log(`  End of 2025: ${end2025} (${moment(end2025).utc().format('YYYY-MM-DD HH:mm:ss UTC')})`);
console.log(`  Current time: ${now} (${moment(now).utc().format('YYYY-MM-DD HH:mm:ss UTC')})`);

console.log('\n✨ Validator is running... Press Ctrl+C to stop');
console.log('💡 Flash your ESP8266 to see real-time timestamp validation');
console.log('🔍 Any 1970 or 2010 timestamps will be flagged as invalid'); 