const fs = require('fs');
const CF_ACCOUNT_ID = '0a28250e63bf217f833feabaf84a25a1';
const OAUTH_TOKEN = 'lVnuLNXqUiCVKy4DdZ7ryMMsR9yrpZks0Tf1f4JN2Rs.CbN7SLvH7LjbuuZxc0G5Loqm2PMht3iUlgax8moWe8Y';

async function main() {
  let output = '';
  
  const projRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects`,
    { headers: { 'Authorization': `Bearer ${OAUTH_TOKEN}` } }
  );
  const projData = await projRes.json();
  if (!projData.success) {
    output += 'Error: ' + JSON.stringify(projData.errors) + '\n';
    fs.writeFileSync('cf-result.txt', output, 'utf8');
    return;
  }
  
  output += `Found ${projData.result.length} projects\n\n`;
  for (const p of projData.result) {
    output += `Project: ${p.name}, Subdomain: ${p.subdomain}, Domains: ${(p.domains||[]).join(', ')}\n`;
  }

  for (const p of projData.result) {
    output += `\n=== Deployments for ${p.name} ===\n`;
    const depRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${p.name}/deployments`,
      { headers: { 'Authorization': `Bearer ${OAUTH_TOKEN}` } }
    );
    const depData = await depRes.json();
    if (depData.success && depData.result) {
      for (const d of depData.result.slice(0, 5)) {
        output += `  ID: ${d.id}\n`;
        output += `  Status: ${d.latest_stage?.name} - ${d.latest_stage?.status}\n`;
        output += `  Created: ${d.created_on}\n`;
        output += `  Commit: ${d.deployment_trigger?.metadata?.commit_message || 'N/A'} (${d.deployment_trigger?.metadata?.commit_hash?.slice(0,7) || 'N/A'})\n`;
        output += `  Source: ${d.source}\n`;
        output += `  Env: ${d.env}\n`;
        output += '  ---\n';
      }
    } else {
      output += '  Error: ' + JSON.stringify(depData.errors) + '\n';
    }
  }

  // Also try to get real-time logs (last 10 minutes)
  for (const p of projData.result) {
    output += `\n=== Recent Logs for ${p.name} ===\n`;
    try {
      const logRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${p.name}/deployments?per_page=1`,
        { headers: { 'Authorization': `Bearer ${OAUTH_TOKEN}` } }
      );
      const logData = await logRes.json();
      if (logData.success && logData.result?.[0]) {
        const depId = logData.result[0].id;
        output += `Latest deployment ID: ${depId}\n`;
        output += `Status: ${logData.result[0].latest_stage?.status}\n`;
        
        // Try to get build logs
        const buildLogRes = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${p.name}/deployments/${depId}/history/logs`,
          { headers: { 'Authorization': `Bearer ${OAUTH_TOKEN}` } }
        );
        const buildLogData = await buildLogRes.json();
        if (buildLogData.success) {
          output += `Build log available: ${JSON.stringify(buildLogData.data?.slice(0, 2000))}\n`;
        } else {
          output += `Build log error: ${JSON.stringify(buildLogData.errors)}\n`;
        }
      }
    } catch(e) {
      output += `Error: ${e.message}\n`;
    }
  }

  fs.writeFileSync('cf-result.txt', output, 'utf8');
  console.log('Results written to cf-result.txt');
}
main().catch(e => console.error(e));
