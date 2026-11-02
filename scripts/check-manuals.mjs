/**
 * Self-check for the valve manuals and their downloadable PDFs.
 *
 * For every entry in data/manuals.ts it reports:
 *   - route   the /manuals/<slug> page is generated for this slug
 *   - linked  something on the site actually links to that page
 *   - pdf     public/manuals/<slug>.pdf is on disk, so the page offers a download
 *
 * Exits non-zero while any PDF is missing, so the 18 client PDFs cannot be
 * forgotten before go-live. Today that is the expected output: the Drive set
 * has not been delivered, so all 18 (plus the unlinked y-strainer) are missing.
 *
 *   node scripts/check-manuals.mjs
 *
 * No test runner in this repo, so this is a plain assert script.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { manualsData } from '../data/manuals.ts';
import { valvesData } from '../data/valves.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const slugs = Object.keys(manualsData);

/* ── The naming contract the README hands to the client ──── */
const route = read('app/manuals/[valveId]/page.tsx');
assert.match(
  route,
  /generateStaticParams[\s\S]*Object\.keys\(manualsData\)/,
  'every manuals.ts key must still be a generated /manuals/<slug> route'
);
assert.match(
  route,
  /'public', 'manuals', `\$\{valveId\}\.pdf`/,
  'the download must still resolve to public/manuals/<slug>.pdf — README rename table depends on it'
);
assert.match(
  route,
  /existsSync/,
  'PDF presence must be decided on the server: a missing PDF is served as HTML by this same route, so an HTTP probe sees 200 text/html'
);

/* A slug is also a URL segment and a filename: keep it boring. */
for (const slug of slugs)
  assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `slug "${slug}" must be lowercase kebab-case`);

/* ── Who links to a manual page ──────────────────────────── */
/* The catalogue grid is the only generated link, and it iterates valvesData. */
const catalog = read('components/pages/ManualsCatalogPage.tsx');
assert.match(
  catalog,
  /valvesData\.map[\s\S]*\/manuals\/\$\{valve\.id\}/,
  'the /manuals grid must still link one card per valvesData entry'
);
const linked = new Set(valvesData.map((v) => v.id));

/* Plus any hand-written /manuals/<slug> href elsewhere in the source. */
const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
};
const source = [...walk(path.join(root, 'app')), ...walk(path.join(root, 'components'))]
  .map((f) => fs.readFileSync(f, 'utf8'))
  .join('\n');
for (const slug of slugs) if (source.includes(`/manuals/${slug}`)) linked.add(slug);

/* Every catalogue card must land on a real manual, or it opens "coming soon". */
const cardsWithoutManual = valvesData.filter((v) => !manualsData[v.id]).map((v) => v.id);
assert.deepEqual(cardsWithoutManual, [], 'every /manuals card must have a manual in data/manuals.ts');

/* ── Report ──────────────────────────────────────────────── */
const rows = slugs.map((slug) => ({
  slug,
  linked: linked.has(slug),
  pdf: fs.existsSync(path.join(root, 'public', 'manuals', `${slug}.pdf`)),
}));

// "route ok" for every row is guaranteed by the generateStaticParams assert above.
console.log('slug                       route  linked  pdf');
for (const r of rows)
  console.log(
    `${r.slug.padEnd(26)} ok     ${r.linked ? 'yes   ' : 'NO    '}  ${r.pdf ? 'yes' : 'MISSING'}`
  );

const missing = rows.filter((r) => !r.pdf);
const orphans = rows.filter((r) => !r.linked);
console.log('');
console.log(`manuals        ${rows.length}`);
console.log(`catalogue cards ${valvesData.length}`);
console.log(`PDFs present   ${rows.length - missing.length}/${rows.length}`);
if (orphans.length)
  console.log(`unlinked       ${orphans.map((r) => r.slug).join(', ')}  (reachable only by direct URL)`);
console.log('');

if (missing.length) {
  console.error(
    `FAIL: ${missing.length} manual PDF(s) missing from public/manuals/ — see public/manuals/README.md`
  );
  for (const r of missing) console.error(`  ${r.slug}.pdf`);
  process.exit(1);
}
console.log('OK - every manual has a PDF');
