const http = require('http');

const endpoints = [
  { path: '/api/dashboard/overview', method: 'GET' },
  { path: '/api/dashboard/run-diagnostic', method: 'POST', body: '{}' },
  { path: '/api/crops', method: 'GET' },
  { path: '/api/farm/parcels', method: 'GET' },
  { path: '/api/soil/metrics', method: 'GET' },
  { path: '/api/soil/tests', method: 'GET' },
  { path: '/api/weather/current', method: 'GET' },
  { path: '/api/irrigation/zones', method: 'GET' },
  { path: '/api/irrigation/zones/1/toggle', method: 'POST', body: JSON.stringify({ active: true }) },
  { path: '/api/pest/diagnostics', method: 'GET' },
  { path: '/api/pest/simulate-scan', method: 'POST', body: JSON.stringify({ cropName: 'Tomato', zone: 'Zone C' }) },
  { path: '/api/ai/messages', method: 'GET' },
  { path: '/api/ai/chat', method: 'POST', body: JSON.stringify({ prompt: 'What fertilizer for Zone B flowering stage?' }) },
  { path: '/api/sensors', method: 'GET' },
  { path: '/api/sensors/1/calibrate', method: 'POST', body: '{}' },
  { path: '/api/alerts', method: 'GET' },
  { path: '/api/recommendations', method: 'GET' },
  { path: '/api/settings', method: 'GET' },
  { path: '/api/farmer-profile', method: 'GET' },
  { path: '/api/farmer-profile/id-card', method: 'GET' },
  { path: '/api/farmer-profile/summary', method: 'GET' },
  { path: '/api/farmer-profile', method: 'PUT', body: JSON.stringify({ fullName: 'Ravi Kumar', farmName: 'Green Valley Farm' }) },
];

async function testAll() {
  console.log('Testing all AgriPulse REST Endpoints:');
  let passCount = 0;
  for (const ep of endpoints) {
    await new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 8080,
        path: ep.path,
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[PASS] ${res.statusCode} ${ep.method} ${ep.path} (Length: ${data.length})`);
            passCount++;
          } else {
            console.log(`[FAIL] ${res.statusCode} ${ep.method} ${ep.path} => Response: ${data}`);
          }
          resolve();
        });
      });
      req.on('error', (err) => {
        console.error(`[ERROR] ${ep.method} ${ep.path}: ${err.message}`);
        resolve();
      });
      if (ep.body) req.write(ep.body);
      req.end();
    });
  }
  console.log(`\nResults: ${passCount} / ${endpoints.length} Endpoints Passed!`);
}

testAll();
