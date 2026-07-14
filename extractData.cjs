const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const workbookPath = path.join(__dirname, 'src/components/Laser_Item Master.xlsx');
const outputPath = path.join(__dirname, 'public/purchaseItems.json');

console.log('Reading Excel file...');
const workbook = xlsx.readFile(workbookPath);
const sheet = workbook.Sheets['stock-phys'];

// Extract rows as an array of arrays
const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

console.log(`Extracted ${rows.length} rows.`);

// Row 1 (index 1) contains the actual column keys
const headers = rows[1];

// Find indices for relevant columns
const idxErpCode = headers.indexOf('ERP CODE');
const idxL2 = headers.indexOf('L2-VALVE TYPE');
const idxL3 = headers.indexOf('L3-DIA');
const idxL7 = headers.indexOf('L7-DIMENSION');
const idxL4 = headers.indexOf('L4-COMPONENT');
const idxL5 = headers.indexOf('L5- MATERIAL');
const idxL6 = headers.indexOf('L6-STD');
const idxCategory = headers.indexOf('L8 -ITEM CATEGORY');

const items = [];

// Skip the first two header rows
for (let i = 2; i < rows.length; i++) {
  const row = rows[i];
  if (!row) continue;

  const erpCode = row[idxErpCode];
  if (!erpCode) continue; // Skip empty rows

  const type = row[idxL2] || '';
  const dia = row[idxL3] || '';
  const dimension = row[idxL7] || '';
  const component = row[idxL4] || '';
  const material = row[idxL5] || '';
  const std = row[idxL6] || '';
  const category = row[idxCategory] || 'GENERAL';

  // Build the description from the parts
  const descParts = [type, dia, dimension, component, material, std].filter(p => p && p.toString().trim() !== '');
  const description = descParts.join(' ');

  items.push({
    itemCode: erpCode,
    itemName: description,
    category: category,
    unit: 'NO', // Defaulting unit since it's not explicitly in the headers we picked
  });
}

console.log(`Processed ${items.length} valid items.`);

fs.writeFileSync(outputPath, JSON.stringify(items));
console.log(`Successfully wrote items to ${outputPath}`);
