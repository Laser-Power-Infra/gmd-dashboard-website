const fs = require('fs');

const content = fs.readFileSync('src/components/manualsData.js', 'utf8');

const jsCode = content.replace('export const manualsData = ', 'return ');
let parsedObject;
try {
  parsedObject = new Function(jsCode)();
} catch (e) {
  console.log("Error parsing:", e);
  process.exit(1);
}

// Remove "Contact Information" from both manuals
if (parsedObject['butterfly-valve'] && parsedObject['butterfly-valve'].sections) {
    parsedObject['butterfly-valve'].sections = parsedObject['butterfly-valve'].sections.filter(s => s.title !== "Contact Information");
}

if (parsedObject['sluice-valve'] && parsedObject['sluice-valve'].sections) {
    parsedObject['sluice-valve'].sections = parsedObject['sluice-valve'].sections.filter(s => s.title !== "Contact Information");
}

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully removed contact info");
