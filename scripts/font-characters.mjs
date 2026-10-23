// Deliberately over-inclusive: current prose, frozen engines/catalogs, UI,
// generated dates, warnings and CSS content all participate in font coverage.
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function fontCharacters() {
  const files = ['index.html', 'public/site.webmanifest'];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(path);
      else if (/\.(tsx?|json|css)$/.test(path)) files.push(path);
    }
  }
  walk('src');
  const points = new Set(Array.from({ length: 95 }, (_, i) => i + 32));
  for (const file of files.sort()) {
    const source = readFileSync(file, 'utf8');
    const decoded = source.replace(/\\u\{([0-9a-f]+)\}|\\u([0-9a-f]{4})|\\x([0-9a-f]{2})/gi,
      (_, wide, narrow, byte) => String.fromCodePoint(parseInt(wide ?? narrow ?? byte, 16)));
    for (const char of decoded) {
      const cp = char.codePointAt(0);
      if (cp >= 32 && !(cp >= 0x7f && cp <= 0x9f)) points.add(cp);
    }
  }
  return { files, codepoints: [...points].sort((a, b) => a - b) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  console.log(JSON.stringify(fontCharacters()));
