const https = require('https');
const url = 'https://cxegaqhwexiidezycbyg.supabase.co/rest/v1/cities?select=id,name,enName,listCover,heroImage,img,stats&order=name.asc';
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
    const elapsed = Date.now() - start;
    try {
      const arr = JSON.parse(data);
      console.log('Status:', res.statusCode);
      console.log('Cities count:', arr.length);
      console.log('Time:', elapsed, 'ms');
      console.log('Sample:', JSON.stringify(arr[0]));
      const withListCover = arr.filter(c => c.listCover).length;
      const withImg = arr.filter(c => c.img).length;
      console.log('Has listCover:', withListCover, '/', arr.length);
      console.log('Has img:', withImg, '/', arr.length);
    } catch(e) {
      console.log('Parse error:', e.message);
      console.log('Raw (first 500):', data.substring(0, 500));
    }
  });
}).on('error', e => console.log('Error:', e.message));
