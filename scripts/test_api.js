const { spawn } = require('child_process');

// Start Next.js dev server
const proc = spawn('npx.cmd', ['next', 'dev', '-p', '3000'], {
  cwd: 'c:\\迅雷下载\\2222',
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';

proc.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);
});

proc.stderr.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stderr.write(text);
});

// Wait for server to start, then test
setTimeout(async () => {
  console.log('\n\n===== TESTING API =====\n');
  try {
    const resp = await fetch('http://localhost:3000/api/menu-translate/?dishes=' + encodeURIComponent('宫保鸡丁'), {
      signal: AbortSignal.timeout(30000)
    });
    const data = await resp.json();
    console.log('Status:', resp.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch(e) {
    console.error('Test error:', e.message);
  }
  console.log('\n===== Server output so far =====');
  console.log(output);
  console.log('\n===== DONE =====');
  proc.kill();
  process.exit(0);
}, 15000);

// Auto-kill after 60s
setTimeout(() => {
  console.log('\nTimeout!');
  proc.kill();
  process.exit(1);
}, 60000);
