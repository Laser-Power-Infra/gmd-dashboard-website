const fs = require('fs');

const sql = fs.readFileSync('C:/Users/Alok Das/Downloads/gmdalui_backup/sqldump.sql', 'utf8');

const valves = [
  'Butterfly',
  'Check',
  'Air',
  'Non-Return',
  'Manual',
  'Tamper Proof',
  'Control'
];

let output = '';

valves.forEach(valve => {
  const regex = new RegExp(`Manual [oO]f ${valve} Valve.*?('Manual [oO]f|\\n\\n|INSERT INTO)`, 'is');
  // Wait, let's just find the index of "Manual Of {valve} Valve" and take the next 10000 characters.
  const idx = sql.search(new RegExp(`Manual [oO]f ${valve} Valve`, 'i'));
  if (idx !== -1) {
    let chunk = sql.substring(idx, idx + 8000);
    // Strip JSON blobs: {"..."}
    chunk = chunk.replace(/\{[^}]+\}/g, '');
    // Strip HTML tags: <...>
    chunk = chunk.replace(/<[^>]+>/g, '\n');
    // Strip wp tags: <!-- ... -->
    chunk = chunk.replace(/<!--[\s\S]*?-->/g, '');
    // Strip empty lines
    chunk = chunk.replace(/\n\s*\n/g, '\n');
    // Clean up escaped unicode and newlines
    chunk = chunk.replace(/\\n/g, '\n').replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\"/g, '"').replace(/\\'/g, "'");
    
    // Once again clean HTML in case it was escaped
    chunk = chunk.replace(/<[^>]+>/g, '\n');
    chunk = chunk.replace(/\n\s*\n/g, '\n');
    
    output += `\n\n=== ${valve} Valve ===\n\n`;
    output += chunk.substring(0, 3000); // just taking 3000 chars should cover it
  } else {
    output += `\n\n=== ${valve} Valve ===\n\n NOT FOUND`;
  }
});

fs.writeFileSync('C:/Users/Alok Das/Desktop/gmdalui/scratch/manuals_extracted.txt', output);
console.log('Extraction complete. Check scratch/manuals_extracted.txt');
