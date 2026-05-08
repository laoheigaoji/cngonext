const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'context', 'LanguageContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Fix line 1002 (index 1001) - visa.mega.desc has duplicate content
lines[1001] = "    'visa.mega.desc': 'Voyagez en Chine sans visa ! Découvrez la politique d\\'exemption de visa de transit de 240 heures, les pays avec exemption unilatérale et les pays avec accord de dispense mutuelle.',";

// Also check for lines with .' pattern (duplicate content)
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Look for pattern where there's a period followed by quote and then more content
  // like .'text.'text
  if (line.match(/\.'[^']+\.'[^']+\./)) {
    console.log(`Line ${i+1} has duplicate content`);
    // Extract the key and the correct value
    const match = line.match(/^(\s*'[^']+':\s*')([^']+)(\.'[^']+)',/);
    if (match) {
      const indent = match[1].substring(0, match[1].lastIndexOf("'"));
      let value = match[2];
      // Escape any apostrophes in value
      value = value.replace(/'/g, "\\'");
      lines[i] = indent + "'" + value + "',";
      console.log(`Fixed line ${i+1}`);
    }
  }
}

content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Done');
