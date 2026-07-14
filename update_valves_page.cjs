const fs = require('fs');

let content = fs.readFileSync('src/components/ValvesPage.jsx', 'utf8');

// Add imports
if (!content.includes('import OtherValvesPage')) {
  content = content.replace("import './ValvesPage.css';", "import './ValvesPage.css';\nimport OtherValvesPage from './OtherValvesPage';\nimport OtherProductsPage from './OtherProductsPage';");
}

// Add components at the bottom before closing div
content = content.replace(/<\/section>\s*<\/div>\s*$/m, "</section>\n\n      <OtherValvesPage />\n      <OtherProductsPage />\n    </div>");

fs.writeFileSync('src/components/ValvesPage.jsx', content, 'utf8');
console.log('ValvesPage.jsx updated');
