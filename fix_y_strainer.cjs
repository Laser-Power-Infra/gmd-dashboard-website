const fs = require('fs');

let valvesDataStr = fs.readFileSync('src/components/valvesData.js', 'utf8');

// The Y Strainer object starts at line 244 (or around there). We can find it and delete it.
const yStrainerMatch = valvesDataStr.match(/\{\s*id:\s*'y-strainer'[\s\S]*?\}(?=[,\n\]])/);
if (yStrainerMatch) {
  valvesDataStr = valvesDataStr.replace(yStrainerMatch[0] + ',', '');
  fs.writeFileSync('src/components/valvesData.js', valvesDataStr);
}

let productsDataStr = fs.readFileSync('src/components/OtherProductsPage.jsx', 'utf8');
const newProduct = `    },
    {
      id: 'y-strainer',
      name: 'Y Strainer',
      image: '/valve img/ChatGPT Image Jun 9, 2026, 03_31_28 PM.png',
      varieties: [
        'A. Cast Iron, Ductile Iron, SG Iron',
        'B. Cast Steel, Stainless Steel, Copper Alloy, Duplex'
      ],
      usage: [
        'A. Used in pipelines to protect equipment from debris.',
        'B. Compact design, easy to clean without interrupting flow.'
      ]
    }
  ];`;

productsDataStr = productsDataStr.replace(/    \}\n  \];/, newProduct);
fs.writeFileSync('src/components/OtherProductsPage.jsx', productsDataStr);

console.log('Moved Y Strainer successfully');
