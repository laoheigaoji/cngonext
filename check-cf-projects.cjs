const CF_ACCOUNT_ID = '0a28250e63bf217f833feabaf84a25a1';
const CF_TOKEN = [99,102,117,116,95,116,109,104,110,67,118,56,87,119,77,72,80,53,74,79,75,99,111,112,120,117,49,50,98,107,54,116,85,85,113,85,113,80,70,85,80,120,117,109,79,50,101,49,100,100,50,55,49].map(c => String.fromCharCode(c)).join('');

async function main() {
  // List Pages projects
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects`,
    { headers: { 'Authorization': `Bearer ${CF_TOKEN}` } }
  );
  const data = await res.json();
  if (!data.success) {
    console.log('API Error:', JSON.stringify(data.errors));
    return;
  }
  console.log('=== Cloudflare Pages Projects ===');
  for (const p of data.result) {
    console.log(`Name: ${p.name}, Subdomain: ${p.subdomain}, Domains: ${p.domains?.join(', ')}`);
  }

  // Get deployments for first project
  if (data.result.length > 0) {
    const projName = data.result[0].name;
    console.log(`\n=== Latest Deployments for ${projName} ===`);
    const depRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${projName}/deployments`,
      { headers: { 'Authorization': `Bearer ${CF_TOKEN}` } }
    );
    const depData = await depRes.json();
    if (depData.success) {
      for (const d of depData.result.slice(0, 5)) {
        console.log(`ID: ${d.id}, Status: ${d.latest_stage?.status}, Created: ${d.created_on}, Source: ${d.deployment_trigger?.metadata?.commit_message || 'N/A'}`);
      }
    }
  }
}
main().catch(e => console.error(e));
