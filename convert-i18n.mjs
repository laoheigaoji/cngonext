// Convert flat key-value translations (src/i18n/*.ts) to nested JSON (messages/*.json)
// Handles key conflicts like nav.lang vs nav.lang.code by converting leaf values to {_root: value}
import fs from 'fs';
import path from 'path';

// output filename -> source ts filename
const langMap = {
  cn: 'zh', en: 'en', ja: 'ja', ko: 'ko', ru: 'ru',
  fr: 'fr', es: 'es', de: 'de', tw: 'tw', it: 'it'
};
const outputPathMap = {
  zh: 'cn', en: 'en', ja: 'ja', ko: 'ko', ru: 'ru',
  fr: 'fr', es: 'es', de: 'de', tw: 'tw', it: 'it'
};

function flatToNested(flat) {
  const result = {};
  // Sort keys so shorter keys come first
  const sortedKeys = Object.keys(flat).sort((a, b) => a.length - b.length);
  
  for (const key of sortedKeys) {
    const value = flat[key];
    const parts = key.split('.');
    let current = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      } else if (typeof current[part] === 'string') {
        // Conflict: this was a leaf value, convert to object with _root
        current[part] = { _root: current[part] };
      }
      current = current[part];
    }
    
    const lastPart = parts[parts.length - 1];
    if (typeof current[lastPart] === 'object' && current[lastPart] !== null) {
      // Already an object from a previous longer key, add _root
      current[lastPart]._root = value;
    } else {
      current[lastPart] = value;
    }
  }
  
  // Clean up: remove _root keys where not needed, rename to parent key
  function clean(obj) {
    for (const [k, v] of Object.entries(obj)) {
      if (v && typeof v === 'object') {
        if (v._root !== undefined) {
          // Keep _root as a special key - in next-intl we'll use it
          // Actually, better approach: don't use nested keys for these
          // Just delete _root and handle in a different way
        }
        clean(v);
      }
    }
  }
  clean(result);
  
  return result;
}

// Better approach: don't nest at all for keys with conflicts
// Instead, use a delimiter approach: nav_lang for nav.lang, nav_lang_code for nav.lang.code
// OR: simply keep flat keys and use next-intl's flat key support

// Actually, next-intl supports both flat and nested. Let's keep flat keys with dot notation
// by NOT nesting at all - just output as-is.

const outputDir = 'messages';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

for (const [outputName, srcName] of Object.entries(langMap)) {
  const tsPath = `src/i18n/${srcName}.ts`;
  if (!fs.existsSync(tsPath)) {
    console.log(`Skipping ${outputName}: file ${tsPath} not found`);
    continue;
  }

  const content = fs.readFileSync(tsPath, 'utf8');
  const match = content.match(/const\s+translations\s*:\s*Record<string,\s*string>\s*=\s*\{([\s\S]*)\};/);
  if (!match) {
    console.log(`Skipping ${lang}: no translations object found`);
    continue;
  }

  const flat = {};
  const entries = match[1].trim();
  const lines = entries.split('\n');
  for (const line of lines) {
    const kvMatch = line.match(/^\s*"([^"]+)"\s*:\s*"(.*)"\s*,?\s*$/);
    if (kvMatch) {
      flat[kvMatch[1]] = kvMatch[2].replace(/\\'/g, "'").replace(/\\n/g, '\n');
    }
  }

  // Convert to nested JSON, handling conflicts
  const nested = flatToNested(flat);
  
  const outputPath = path.join(outputDir, `${outputName}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(nested, null, 2), 'utf8');
  console.log(`Generated ${outputPath} with ${Object.keys(flat).length} keys`);
}

console.log('\nDone!');
