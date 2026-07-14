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
  const searchStr = `Manual Of ${valve}`;
  const idx = sql.search(new RegExp(searchStr, 'i'));
  if (idx !== -1) {
    let chunk = sql.substring(idx, idx + 15000);
    
    // Strip pagelayer comments
    chunk = chunk.replace(/<!--[\s\S]*?-->/g, '');
    
    // Strip JSON inside HTML attributes and JSON blobs
    // We can just strip all tags
    chunk = chunk.replace(/<[^>]+>/g, '\n');
    
    // Clean up unicode
    chunk = chunk.replace(/\\n/g, '\n').replace(/\\u003c/g, '<').replace(/\\u003e/g, '>').replace(/\\"/g, '"').replace(/\\'/g, "'");
    
    // Strip tags again
    chunk = chunk.replace(/<[^>]+>/g, '\n');
    
    // Strip anything that looks like JSON or CSS
    chunk = chunk.replace(/\{[^\}]+\}/g, '');
    
    // Split by newlines and trim, keeping only lines with actual text
    const lines = chunk.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('","') && !l.startsWith('\",\"'));
    
    output += `\n\n=== ${valve} Valve ===\n\n`;
    output += lines.slice(0, 100).join('\n');
  } else {
    output += `\n\n=== ${valve} Valve ===\n\n NOT FOUND`;
  }
});

fs.writeFileSync('C:/Users/Alok Das/Desktop/gmdalui/scratch/manuals_extracted2.txt', output);
