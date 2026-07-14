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

// Rename keys to match valvesData.js ids
const renameKey = (oldKey, newKey) => {
  if (parsedObject[oldKey]) {
    parsedObject[newKey] = parsedObject[oldKey];
    delete parsedObject[oldKey];
  }
};

renameKey('butterfly-valve', 'butterfly');
renameKey('sluice-valve', 'sluice-gate');
renameKey('check-valve', 'dual-check');
// 'air-valve' is already 'air-valve'
// 'non-return' is already 'non-return'
renameKey('manual-valve', 'globe-valve');
// 'tamper-proof' is already 'tamper-proof'
renameKey('control-valve', 'plug-valve');
renameKey('regulating-valve', 'y-strainer');
renameKey('automated-valve', 'zero-velocity-valve');
renameKey('pressure-relief', 'prv');
renameKey('speciality-valve', 'ball-valve');

const newContent = 'export const manualsData = ' + JSON.stringify(parsedObject, null, 2) + ';\n';
fs.writeFileSync('src/components/manualsData.js', newContent, 'utf8');
console.log("Successfully renamed keys");
