/* Copy only the public assets referenced by source code from the Vite repo into next-app/public */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OLD_ROOT = path.resolve(ROOT, '..');
const SRC_DIRS = [
  path.join(OLD_ROOT, 'src'),
  path.join(ROOT, 'app'),
  path.join(ROOT, 'components'),
  path.join(ROOT, 'data'),
];
const OLD_PUBLIC = path.join(OLD_ROOT, 'public');
const DEST_PUBLIC = path.join(ROOT, 'public');

const FILE_EXTS = ['.jsx', '.js', '.tsx', '.ts', '.cjs', '.html', '.css'];
const ROOT_PREFIXES = ['/uploads/', '/valve img/', '/usages_img/', '/other accessories/', '/purchase img/', '/purchaseItems.json', '/Quality_Manual.pdf', '/favicon.svg', '/icons.svg'];

function collectFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
    } else if (FILE_EXTS.includes(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

const referenced = new Set();
for (const dir of SRC_DIRS) {
  for (const file of collectFiles(dir)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const m of content.matchAll(/["'`](\/(?:uploads|valve img|usages_img|other accessories|purchase img)\/[^"'`?#]+)["'`]/g)) {
      referenced.add(m[1]);
    }
    for (const root of ['/purchaseItems.json', '/Quality_Manual.pdf', '/favicon.svg', '/icons.svg']) {
      if (content.includes(`"${root}"`) || content.includes(`'${root}'`) || content.includes(`\`${root}\``)) {
        referenced.add(root);
      }
    }
  }
}

const missing = [];
let copied = 0;
for (const rel of referenced) {
  const src = path.join(OLD_PUBLIC, rel);
  const dest = path.join(DEST_PUBLIC, rel);
  if (!fs.existsSync(src)) {
    missing.push(rel);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  copied++;
}

console.log(`Copied ${copied} referenced assets into next-app/public`);
if (missing.length) {
  console.log(`MISSING (${missing.length}):`);
  missing.forEach((m) => console.log('  ' + m));
}
