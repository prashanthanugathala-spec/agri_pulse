const http = require('http');

const routes = [
  '/',
  '/auth',
  '/onboarding',
  '/dashboard',
  '/my-farm',
  '/crops',
  '/soil',
  '/weather',
  '/irrigation',
  '/market-prices',
  '/farming-techniques',
  '/pesticides',
  '/gov-schemes',
  '/pest-and-disease',
  '/agripulse-ai',
  '/analytics',
  '/alerts',
  '/sensors',
  '/recommendations-and-settings',
  '/profile',
  '/farmer-profile',
];

const port = process.env.PORT || 5173;

async function testRoutes() {
  console.log(`Testing Frontend Single Page Application Routes on http://localhost:${port}:`);
  let passCount = 0;
  for (const r of routes) {
    await new Promise((resolve) => {
      http.get(`http://localhost:${port}` + r, (res) => {
        if (res.statusCode === 200) {
          console.log(`[PASS] 200 GET ${r}`);
          passCount++;
        } else {
          console.log(`[FAIL] ${res.statusCode} GET ${r}`);
        }
        resolve();
      }).on('error', (err) => {
        console.error(`[ERROR] GET ${r}: ${err.message}`);
        resolve();
      });
    });
  }
  console.log(`\nResults: ${passCount} / ${routes.length} Frontend Routes Passed!`);
}

testRoutes();
