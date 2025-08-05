import { database, ref, get } from './config/firebase.js';

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase connection...\n');

  try {
    // Test 1: Check root data
    console.log('1. Checking root database structure...');
    const rootRef = ref(database, '/');
    const rootSnapshot = await get(rootRef);
    
    if (rootSnapshot.exists()) {
      const rootData = rootSnapshot.val();
      console.log('✅ Root data keys:', Object.keys(rootData));
      console.log('   Root data structure:', JSON.stringify(rootData, null, 2).substring(0, 500) + '...');
    } else {
      console.log('❌ No data found at root level');
    }
    console.log('');

    // Test 2: Check if sensor1 exists directly
    console.log('2. Checking sensor1 directly...');
    const sensor1Ref = ref(database, 'sensor1');
    const sensor1Snapshot = await get(sensor1Ref);
    
    if (sensor1Snapshot.exists()) {
      const sensor1Data = sensor1Snapshot.val();
      console.log('✅ sensor1 data found!');
      console.log('   sensor1 keys:', Object.keys(sensor1Data));
      console.log('   sensor1 data:', JSON.stringify(sensor1Data, null, 2));
    } else {
      console.log('❌ sensor1 not found at direct path');
    }
    console.log('');

    // Test 3: Check sensor1/current specifically
    console.log('3. Checking sensor1/current...');
    const currentRef = ref(database, 'sensor1/current');
    const currentSnapshot = await get(currentRef);
    
    if (currentSnapshot.exists()) {
      const currentData = currentSnapshot.val();
      console.log('✅ sensor1/current data found!');
      console.log('   Current data:', JSON.stringify(currentData, null, 2));
    } else {
      console.log('❌ sensor1/current not found');
    }
    console.log('');

    // Test 4: Check under sensors/ prefix
    console.log('4. Checking sensors/sensor1...');
    const sensorsRef = ref(database, 'sensors/sensor1');
    const sensorsSnapshot = await get(sensorsRef);
    
    if (sensorsSnapshot.exists()) {
      const sensorsData = sensorsSnapshot.val();
      console.log('✅ sensors/sensor1 data found!');
      console.log('   Data:', JSON.stringify(sensorsData, null, 2));
    } else {
      console.log('❌ sensors/sensor1 not found');
    }

  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    console.error('   Full error:', error);
  }
}

testFirebaseConnection(); 