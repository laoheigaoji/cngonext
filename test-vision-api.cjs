// Test Cloudflare Workers AI vision models with a real menu image
const fs = require('fs');
const path = require('path');

const CF_ACCOUNT_ID = '0a28250e63bf217f833feabaf84a25a1';
// Read token from .dev.vars or environment
let CF_AI_API_TOKEN = process.env.CF_AI_API_TOKEN || '';

// Try .env.local first
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath) && !CF_AI_API_TOKEN) {
  const content = fs.readFileSync(envLocalPath, 'utf-8');
  const match = content.match(/CF_AI_API_TOKEN\s*=\s*["']?([^"'\n]+)/);
  if (match) CF_AI_API_TOKEN = match[1];
}

// Try .dev.vars
const devVarsPath = path.join(__dirname, '.dev.vars');
if (fs.existsSync(devVarsPath) && !CF_AI_API_TOKEN) {
  const content = fs.readFileSync(devVarsPath, 'utf-8');
  const match = content.match(/CF_AI_API_TOKEN\s*=\s*["']?([^"'\n]+)/);
  if (match) CF_AI_API_TOKEN = match[1];
}

if (!CF_AI_API_TOKEN) {
  console.error('ERROR: CF_AI_API_TOKEN not found in .env.local, .dev.vars, or environment variable.');
  process.exit(1);
}

console.log('Token found:', CF_AI_API_TOKEN.slice(0, 8) + '...');

// Read test image
const imgPath = path.join(__dirname, 'caidan.jpg');
const buf = fs.readFileSync(imgPath);
const base64 = buf.toString('base64');
console.log('Image size:', buf.length, 'bytes, base64 length:', base64.length);

const MODELS = [
  '@cf/meta/llama-4-scout-17b-16e-instruct',
  '@cf/mistralai/mistral-small-3.1-24b-instruct',
  '@cf/moonshotai/kimi-k2.6',
  '@cf/google/gemma-4-26b-a4b-it',
  '@cf/meta/llama-3.2-11b-vision-instruct',
  '@cf/meta/llama-4-scout-17b-16e-instruct-fp8',
];

const prompt = '你是中国美食专家。列出这张菜单图片中的菜名和价格。只输出JSON数组。示例：[{"name":"宫保鸡丁","price":38}]';

async function testModel(modelId) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${modelId}`;
  console.log(`\n--- Testing: ${modelId} ---`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_AI_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` } }
            ]
          }
        ],
        max_tokens: 1024,
      }),
    });

    const status = response.status;
    const data = await response.json();
    
    if (!response.ok) {
      console.log(`  FAILED: HTTP ${status}`);
      console.log(`  Error:`, JSON.stringify(data).slice(0, 500));
      return { model: modelId, status, error: data };
    }

    const text = data?.result?.response || data?.response || '';
    console.log(`  SUCCESS! Response length: ${text.length}`);
    console.log(`  Preview: ${text.slice(0, 300)}`);
    return { model: modelId, status, text };
  } catch (err) {
    console.log(`  ERROR: ${err.message}`);
    return { model: modelId, error: err.message };
  }
}

async function main() {
  const results = [];
  for (const model of MODELS) {
    const result = await testModel(model);
    results.push(result);
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('\n\n=== SUMMARY ===');
  for (const r of results) {
    if (r.text) {
      console.log(`✅ ${r.model} - OK (${r.text.length} chars)`);
    } else {
      console.log(`❌ ${r.model} - HTTP ${r.status || 'ERROR'}`);
    }
  }
}

main().catch(console.error);
