// Test the menu-translate API GET endpoint (dish image search)
const fetch = (...args) => import('node-fetch').then(m => m.default(...args));

async function main() {
  try {
    const resp = await fetch('http://localhost:3000/api/menu-translate/?dishes=宫保鸡丁', {
      signal: AbortSignal.timeout(30000)
    });
    console.log('Status:', resp.status);
    const data = await resp.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch(e) {
    console.error('Error:', e.message);
  }
}
main();
