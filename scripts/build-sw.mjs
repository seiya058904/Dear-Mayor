import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const files = (
  await readdir("dist", { recursive: true, withFileTypes: true })
).filter((f) => f.isFile() && !f.name.endsWith("sw.js"));
const paths = files.map(
  (f) => `${f.parentPath.replaceAll("\\", "/")}/${f.name}`,
);
const hash = createHash("sha256");
for (const file of paths.sort()) hash.update(await readFile(file));
const version = hash.digest("hex").slice(0, 12);
// Original PNG artwork stays available for reference, but the UI uses the
// pixel-identical WebP copies. Do not download both sets on first install.
const originalArt = new Set(['background','note','paper','paper-mobile','approve','reject','defer','written_reply'].map(name => `dist/art/${name}.png`));
for (const png of originalArt) {
  if (!paths.includes(png.replace(/\.png$/, '.webp'))) throw new Error(`Missing lossless alternative for ${png}`);
}
const urls = paths.filter(p => !originalArt.has(p)).map((p) => "./" + p.replace(/^dist\//, ""));
await writeFile(
  "dist/build-info.json",
  JSON.stringify({ version, commit: process.env.GITHUB_SHA ?? "local" }),
);
urls.push("./", "./build-info.json");
await writeFile(
  "dist/sw.js",
  `
const CACHE = 'dear-mayor-${version}';
const FILES = ${JSON.stringify(urls)};
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))));
self.addEventListener('activate', event => event.waitUntil(Promise.all([
  caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('dear-mayor-') && key !== CACHE).map(key => caches.delete(key)))),
  self.clients.claim()
])));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    // Public same-origin files are identical across Origin request headers (module fetches
    // and pre-cache fetches differ). Vite's Vary: Origin must not prevent offline hits.
    const hit = await cache.match(event.request, { ignoreSearch: event.request.mode === 'navigate', ignoreVary: true });
    if (hit) return hit;
    try { return await fetch(event.request); }
    catch(error) { if(event.request.mode === 'navigate') return await cache.match('./'); throw error; }
  }));
});
`,
);
console.log("Offline cache:", version, urls.length, "files");
