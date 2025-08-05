import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api/sensors/sensor1';

function printTimestamp(label, ts) {
  const len = ts?.toString().length;
  const date = new Date(ts);
  console.log(`\n${label}:`);
  console.log('  Raw:', ts);
  console.log('  Length:', len);
  console.log('  Formatted:', date.toISOString());
}

async function testBackendTimestamps() {
  // 1. Current
  const currentRes = await fetch(`${BASE_URL}/current`);
  const current = await currentRes.json();
  if (current.data && current.data.timestamp) {
    printTimestamp('Current', current.data.timestamp);
  } else {
    console.log('No current data');
  }

  // 2. Statistics
  const statsRes = await fetch(`${BASE_URL}/statistics`);
  const stats = await statsRes.json();
  if (stats.data && stats.data.last_update) {
    printTimestamp('Statistics last_update', stats.data.last_update);
  } else {
    console.log('No statistics data');
  }

  // 3. History
  const historyRes = await fetch(`${BASE_URL}/history?limit=5`);
  const history = await historyRes.json();
  if (history.data && Array.isArray(history.data)) {
    for (const item of history.data) {
      if (item.timestamp) {
        printTimestamp(`History id=${item.id}`, item.timestamp);
      }
    }
  } else {
    console.log('No history data');
  }
}

// Run the test
testBackendTimestamps(); 