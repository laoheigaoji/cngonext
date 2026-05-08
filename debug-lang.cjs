const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'context', 'LanguageContext.tsx');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const line = lines[1000];

console.log('Line 1001:', line);
console.log('JSON:', JSON.stringify(line));
console.log('Starts with quote:', line.trim().startsWith('"'));
console.log('Contains ": ', line.includes('": '));
console.log('Contains colon-space-quote:', line.includes("': "));

const regex = /^\s*"([^']+)':\s*'([^']+)'(,?)$/;
const match = line.match(regex);
console.log('Match:', match);
