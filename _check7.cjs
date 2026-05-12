const http = require('http');

const start = Date.now();
http.get('http://localhost:3000/cn/cities/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const elapsed = Date.now() - start;
    const cityLinks = data.match(/href="\/cn\/cities\/[^\/]+"/g);
    const skeletonCards = data.match(/animate-pulse/g);
    const h1 = data.match(/<h1[^>]*>([^<]+)<\/h1>/);
    const hasError = data.match(/Error|error/i);
    
    console.log('Status:', res.statusCode);
    console.log('Time:', elapsed, 'ms');
    console.log('H1:', h1 ? h1[1] : 'NOT FOUND');
    console.log('City links:', cityLinks ? cityLinks.length : 0);
    if (cityLinks && cityLinks.length > 0) {
      console.log('First 3 links:', cityLinks.slice(0, 3).join(', '));
    }
    console.log('Skeleton cards (animate-pulse):', skeletonCards ? skeletonCards.length : 0);
    console.log('Has error text:', hasError ? 'YES' : 'NO');
    
    // Check if actual city names appear
    const cityNames = data.match(/北京|上海|广州|深圳|杭州|成都/g);
    console.log('City names found:', cityNames ? [...new Set(cityNames)].join(', ') : 'NONE');
  });
}).on('error', e => console.log('Error:', e.message));
