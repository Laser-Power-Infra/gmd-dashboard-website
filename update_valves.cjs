const fs = require('fs');

let content = fs.readFileSync('src/components/valvesData.js', 'utf8');

// Replace moc array with the new one
content = content.replace(/moc:\s*\[([^\]]+)\],/g, "moc: ['Cast Iron', 'Ductile Iron', 'SG Iron', 'Cast Steel', 'Stainless Steel', 'Copper Alloy', 'Duplex'],");

// Replace pressure array with the new one
content = content.replace(/pressure:\s*\[([^\]]+)\],/g, "pressure: ['1.0', '1.6', '2.0', '2.5', 'Class 150#', '300#', '800#'],");

fs.writeFileSync('src/components/valvesData.js', content, 'utf8');
console.log('valvesData.js updated');
