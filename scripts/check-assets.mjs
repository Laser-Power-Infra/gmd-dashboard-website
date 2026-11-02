/**
 * Checks every static asset reference in the source against what is really in
 * public/. Run it after any image rename/conversion:  node scripts/check-assets.mjs
 *
 * Two classes of failure are reported:
 *   missing   - the referenced file is not in public/ at all
 *   unservable - the file is there but Next's static handler cannot serve it
 *                (a basename starting with "." makes /path/. name.webp 500)
 *
 * Template literals (`/valve img/${file}`) are built at runtime and cannot be
 * checked here; they are listed as "dynamic" for a human to eyeball.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const EXT = 'png|jpe?g|webp|gif|svg|avif|ico|bmp|pdf|mp4|webm';

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.next', '.git', 'generated'].includes(e.name)) continue;
      walk(p, out);
    } else out.push(p);
  }
  return out;
};

const pub = new Set(walk(PUB).map((f) => '/' + path.relative(PUB, f).split(path.sep).join('/')));

// quotes are the only delimiter, so filenames with spaces/parens/commas survive
const QUOTED = new RegExp(`(['"\`])((?:[^'"\`\\n]|\\\\.)*?\\.(?:${EXT}))\\1`, 'gi');
const CSSURL = /url\(\s*['"]?([^)'"]+?)['"]?\s*\)/gi;

const missing = [];
const dynamic = [];

for (const dir of ['app', 'components', 'data', 'lib', 'styles', 'types']) {
  const base = path.join(ROOT, dir);
  if (!fs.existsSync(base)) continue;
  for (const file of walk(base).filter((f) => /\.(tsx?|css|mjs)$/.test(f))) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
      const refs = [];
      for (const m of line.matchAll(QUOTED)) {
        if (m[1] === '`' && m[2].includes('${')) dynamic.push(`${rel}:${i + 1}  ${m[2]}`);
        else refs.push(m[2]);
      }
      for (const m of line.matchAll(CSSURL)) refs.push(m[1]);
      for (const raw of refs) {
        const p = raw.split('?')[0].split('#')[0];
        if (!p.startsWith('/') || /^(https?:|data:|\/\/)/i.test(p)) continue;
        if (pub.has(p) || pub.has(decodeURIComponent(p))) continue;
        missing.push(`${rel}:${i + 1}  ${p}`);
      }
    });
  }
}

// Next cannot serve these whatever the reference looks like, so flag the files
// themselves rather than waiting for a reference to break.
const unservable = [...pub].filter((f) => path.posix.basename(f).startsWith('.'));

for (const m of missing) console.error(`missing     ${m}`);
for (const u of unservable) console.error(`unservable  public${u}  (basename starts with ".")`);
if (dynamic.length) {
  console.log(`\n${dynamic.length} dynamic reference(s) — check by hand:`);
  for (const d of dynamic) console.log(`  ${d}`);
}

const bad = missing.length + unservable.length;
console.log(`\n${bad ? `FAIL: ${bad} problem(s)` : 'OK: every static asset reference resolves'}`);
process.exit(bad ? 1 : 0);
