import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(f => {
    const fp = path.join(dir, f);
    const stat = fs.statSync(fp);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fp));
    } else if (f.endsWith('.tsx') && !f.includes('Client')) {
      results.push(fp);
    }
  });
  return results;
}

const files = walk('src/app-views');
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  if (!c.startsWith('"use client"')) {
    console.log('NEEDS use client:', f);
  }
});
