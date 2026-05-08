// Fix _root conflicts in generated messages JSON files
import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('messages').filter(f => f.endsWith('.json'));

for (const file of files) {
  const filePath = path.join('messages', file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let modified = false;
  
  function fixConflicts(obj, parentKey = '') {
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && value._root !== undefined) {
        // This is a conflict: key was both a leaf and a namespace
        // Move _root to key + "Name" or similar, and remove _root
        const rootValue = value._root;
        delete value._root;
        
        // For nav.lang: move "English" to nav.langName
        // For visa.stat.countries: similar pattern
        const newKey = key + 'Name';
        if (!(newKey in obj)) {
          obj[newKey] = rootValue;
          modified = true;
          console.log(`  Fixed: ${parentKey ? parentKey + '.' : ''}${key} -> ${parentKey ? parentKey + '.' : ''}${newKey}`);
        } else {
          // Fallback: keep _root
          value._root = rootValue;
        }
      }
      if (value && typeof value === 'object') {
        fixConflicts(value, parentKey ? `${parentKey}.${key}` : key);
      }
    }
  }
  
  fixConflicts(content);
  
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
    console.log(`Fixed conflicts in ${file}`);
  } else {
    console.log(`No conflicts in ${file}`);
  }
}
