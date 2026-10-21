import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const files = (
  await readdir("dist", { recursive: true, withFileTypes: true })
).filter((f) => f.isFile() && !f.name.endsWith("sw.js"));
const paths = files.map(
  (f) => `${f.parentPath.replaceAll("\\", "/")}/${f.name}`,
);
const hash = createHash("sha256");
// Metadata and worker semantics belong to the build identity as well. Two
// commits with identical app assets must never share a stale build-info entry.
hash.update(process.env.GITHUB_SHA ?? "local");
hash.update(await readFile(new URL(import.meta.url)));
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
const manifest = await Promise.all(urls.map(async url => ({
  url,
  // SRI permits HTTP response reuse only when its decoded bytes match this build.
  integrity: 'sha256-' + createHash('sha256').update(await readFile(
    url === './' ? 'dist/index.html' : 'dist/' + url.slice(2),
  )).digest('base64'),
})));
await writeFile(
  "dist/sw.js",
  `
const SCOPE = encodeURIComponent(new URL(self.registration.scope).pathname);
const CACHE = 'dear-mayor-${version}-' + SCOPE;
const FILES = ${JSON.stringify(manifest)};
async function precache() {
  const cache = await caches.open(CACHE);
  // Registration follows window.load. Reuse the just-loaded HTTP responses,
  // including the full font, only after checking this build's byte integrity.
  await Promise.all(FILES.map(async file => {
    const url = new URL(file.url, self.registration.scope).href;
    if (await cache.match(url, {ignoreVary:true})) return;
    let lastError;
    for (let attempt=0; attempt<3; attempt++) {
      try {
        const response = await fetch(url, {cache:attempt===0?'force-cache':'reload',integrity:file.integrity});
        if (!response.ok) throw new Error('Precache HTTP ' + response.status);
        await cache.put(url,response);
        lastError = undefined;
        break;
      } catch(error) { lastError=error; }
    }
    if(lastError) throw lastError;
  }));
}
self.addEventListener('install', event => event.waitUntil(precache()));
// No skipWaiting: older controlled tabs keep their worker and resources until
// they close. Scope-specific retirement cannot evict another path's cache.
self.addEventListener('activate', event => event.waitUntil(Promise.all([
  caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('dear-mayor-') && key.endsWith('-'+SCOPE) && key !== CACHE).map(key => caches.delete(key)))),
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
