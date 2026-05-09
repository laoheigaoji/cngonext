const fs = require('fs');
const path = require('path');
const os = require('os');

// Find wrangler OAuth token
const configPaths = [
  path.join(os.homedir(), 'AppData', 'Roaming', 'xdg.config', '.wrangler'),
  path.join(os.homedir(), '.config', '.wrangler'),
];

for (const cp of configPaths) {
  if (fs.existsSync(cp)) {
    console.log('Found wrangler config dir:', cp);
    const files = [];
    function walk(dir) {
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const fp = path.join(dir, f.name);
        if (f.isDirectory()) walk(fp);
        else files.push(fp);
      }
    }
    walk(cp);
    for (const f of files) {
      const ext = path.extname(f);
      if (['.toml', '.json', '.txt', '.yaml', '.yml', ''].includes(ext) || f.includes('config') || f.includes('token') || f.includes('auth') || f.includes('oauth')) {
        const content = fs.readFileSync(f, 'utf8');
        console.log(`\n--- ${f} ---`);
        console.log(content.slice(0, 800));
      }
    }
  }
}

// Also try the xdg config home
const xdgHome = process.env.XDG_CONFIG_HOME;
if (xdgHome) {
  const wp = path.join(xdgHome, '.wrangler');
  if (fs.existsSync(wp)) {
    console.log('Found XDG wrangler config:', wp);
  }
}
