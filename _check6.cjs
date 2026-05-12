const https = require('https');

function fetchCities(limit, offset) {
  return new Promise((resolve, reject) => {
    const url = `https://cxegaqhwexiidezycbyg.supabase.co/rest/v1/cities?select=id,name,enName,listCover,stats&order=name.asc&limit=${limit}&offset=${offset}`;
    const options = {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWdhcWh3ZXhpaWRlenljYnlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk0MjIyNSwiZXhwIjoyMDkzNTE4MjI1fQ.e-OEm6Gtyp8Dp0_dOorW1FSXYjEpvEdDTt6NjPQQ1W8'
      }
    };
    const start = Date.now();
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const arr = JSON.parse(data);
        resolve({ count: arr.length, time: Date.now() - start });
      });
    }).on('error', reject);
  });
}

async function test() {
  // Test first page (9 items)
  const r1 = await fetchCities(9, 0);
  console.log('9 items:', r1.time + 'ms');
  
  // Test 50 items
  const r2 = await fetchCities(50, 0);
  console.log('50 items:', r2.time + 'ms');
  
  // Test 100 items
  const r3 = await fetchCities(100, 0);
  console.log('100 items:', r3.time + 'ms');
  
  // Test all (no limit)
  const r4 = await fetchCities(1000, 0);
  console.log('All items:', r4.count, r4.time + 'ms');
}

test();
