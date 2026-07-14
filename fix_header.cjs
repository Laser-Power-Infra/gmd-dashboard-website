import fs from 'fs';
let text = fs.readFileSync('src/components/Header.jsx', 'utf8');
text = text.replace(/Types\s*<\/a>\s*<\/li>\s*<\/a>\s*<\/li>/g, 'Types</a></li>');
fs.writeFileSync('src/components/Header.jsx', text);
