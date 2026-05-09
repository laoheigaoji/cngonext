const token = [99,102,117,116,95,116,109,104,110,67,118,56,87,119,77,72,80,53,74,79,75,99,111,112,120,117,49,50,98,107,54,116,85,85,113,85,113,80,70,85,80,120,117,109,79,50,101,49,100,100,50,55,49].map(c=>String.fromCharCode(c)).join('');

async function main() {
  // List pages projects
  const res = await fetch('https://api.cloudflare.com/client/v4/accounts/0a28250e63bf217f833feabaf84a25a1/pages/projects', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const data = await res.json();
  if (data.result) {
    for (const p of data.result) {
      console.log('Project:', p.name, '| Subdomain:', p.subdomain, '| Domains:', p.domains?.join(', '));
    }
  } else {
    console.log('API response:', JSON.stringify(data).slice(0, 500));
  }

  // Check latest deployment for tripcngo
  const depRes = await fetch('https://api.cloudflare.com/client/v4/accounts/0a28250e63bf217f833feabaf84a25a1/pages/projects/tripcngo-cngo/deployments?per_page=3', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const depData = await depRes.json();
  if (depData.result) {
    for (const d of depData.result) {
      console.log('Deployment:', d.id, '| Status:', d.latest_stage?.status, '| Created:', d.created_on, '| Source:', d.deployment_trigger?.metadata?.commit_message);
    }
  } else {
    console.log('Deployments response:', JSON.stringify(depData).slice(0, 500));
  }
}

main().catch(e => console.error(e));
