import {test,expect} from '@playwright/test';
import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {createHash} from 'node:crypto';
import fixture from './fixtures/catalog-21-audit-saves.json' with {type:'json'};
const root=resolve('dist'),sw=readFileSync(resolve(root,'sw.js'),'utf8');
const files=JSON.parse(sw.match(/const FILES = (.*);/)![1]) as {url:string;integrity:string}[];
const mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
async function server(prefix:string,upgrade=false){
 const requests:string[]=[],counts=new Map<string,number>();let current=!upgrade;
 const heldNotes=new Set<()=>void>();let hold=false;
 const v6=`const CACHE='dear-mayor-v6-protocol-fixture';const FILES=${JSON.stringify(files.map(f=>f.url))};
 self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
 self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
 self.addEventListener('fetch',e=>{if(e.request.method==='GET'&&new URL(e.request.url).origin===self.location.origin)e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request,{ignoreSearch:e.request.mode==='navigate',ignoreVary:true}))||fetch(e.request)));});`;
 const app=createServer(async(req,res)=>{
  const pathname=new URL(req.url!,'http://localhost').pathname;
  requests.push(pathname);counts.set(pathname,(counts.get(pathname)??0)+1);
  const relative=pathname.replace(/^\/Dear-Mayor(?=\/)/,'').replace(/^\//,'')||'index.html';
  const file=resolve(root,relative);
  if(!pathname.startsWith(prefix)||!file.startsWith(root+sep)){res.writeHead(404).end();return;}
  if(hold&&relative==='art/note.webp')await new Promise<void>(r=>{heldNotes.add(r);});
  if(!upgrade&&relative==='art/note.webp'&&counts.get(pathname)===1){res.writeHead(200,{'Content-Type':'image/webp','Cache-Control':'max-age=86400'}).end('stale response');return;}
  if(!upgrade&&relative==='art/paper-mobile.webp'&&counts.get(pathname)===1){res.writeHead(503).end('temporary');return;}
  try{
   let data:Buffer|string=readFileSync(file);
   if(relative==='sw.js')data=current?sw:v6;
   if(relative==='build-info.json'&&!current)data=JSON.stringify({version:'v6-protocol-fixture',commit:'fixture'});
   res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream','Cache-Control':'no-cache'}).end(data);
  }catch{res.writeHead(404).end();}
 });
 await new Promise<void>(r=>app.listen(0,'127.0.0.1',511,r));
 const port=(app.address() as {port:number}).port;
 return {url:`http://127.0.0.1:${port}${prefix}`,requests,counts,upgrade:()=>{current=true;},hold:()=>{hold=true;},release:()=>{hold=false;for(const resume of heldNotes)resume();heldNotes.clear();},close:()=>new Promise<void>(r=>{app.close(()=>r());app.closeAllConnections();})};
}
test('post-V6 complete offline cache verifies every byte, retries stale/failed resources and survives viewport/reply changes',async({page,context},info)=>{
 const prefix=new URL(info.project.use.baseURL!).pathname;
 const host=await server(prefix);
 try{
  await page.goto(host.url);await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
  const entries=await page.evaluate(async files=>{
   const cache=await caches.open((await caches.keys()).find(n=>n.endsWith('-'+encodeURIComponent(new URL(location.href).pathname)))!);
   const rows=[];
   for(const file of files){const response=await cache.match(new URL(file.url,location.href).href,{ignoreVary:true});if(!response)throw Error('Missing '+file.url);const digest=await crypto.subtle.digest('SHA-256',await response.arrayBuffer());rows.push({url:file.url,integrity:'sha256-'+btoa(String.fromCharCode(...new Uint8Array(digest)))});}
   return rows;
  },files);
  expect(entries).toEqual(files);expect(host.counts.get(prefix+'art/note.webp')).toBeGreaterThanOrEqual(2);expect(host.counts.get(prefix+'art/paper-mobile.webp')).toBeGreaterThanOrEqual(2);
  await context.setOffline(true);await page.reload();await page.setViewportSize({width:768,height:1024});
  await expect(page.locator('.paper-art')).toBeVisible();expect(await page.locator('.paper-art').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();await expect(page.locator('[data-choice]')).toHaveCount(3);await page.locator('[data-choice="1"]').click();
  await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('dear-mayor:save:v1')!).history.length)).toBe(1);
 }finally{await context.setOffline(false);await page.goto('about:blank');await host.close();}
});
test('post-V6 root and Pages workers keep independent complete caches on the same origin',async({page,context})=>{
 const host=await server('/');
 try{
  await page.goto(host.url);await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
  const child=await context.newPage();await child.goto(host.url+'Dear-Mayor/');
  await expect.poll(()=>child.evaluate(async()=> (await navigator.serviceWorker.getRegistrations()).some(r=>new URL(r.scope).pathname==='/Dear-Mayor/'&&r.active?.state==='activated'))).toBe(true);
  await child.reload();
  const names=await page.evaluate(()=>caches.keys());
  expect(names.some(n=>n.endsWith('-%2F'))).toBe(true);expect(names.some(n=>n.endsWith('-%2FDear-Mayor%2F'))).toBe(true);
  for(const [tab,prefix] of [[page,'/'],[child,'/Dear-Mayor/']] as const){
   const count=await tab.evaluate(async prefix=>(await (await caches.open((await caches.keys()).find(n=>n.endsWith('-'+encodeURIComponent(prefix)))!)).keys()).length,prefix);
   expect(count).toBe(files.length);
  }
  await context.setOffline(true);
  for(const tab of [page,child]){await tab.reload();await expect(tab.locator('article')).toHaveAttribute('data-letter-id','bridge/start');await tab.setViewportSize({width:390,height:844});await tab.getByRole('button',{name:'批示回复',exact:true}).click();await tab.keyboard.press('Escape');expect(await tab.locator('.paper-art').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);}
  await child.close();
 }finally{await context.setOffline(false);for(const tab of context.pages())await tab.goto('about:blank');await host.close();}
});
test('post-V6 incomplete install stays inactive until every offline resource is ready',async({page},info)=>{
 const prefix=new URL(info.project.use.baseURL!).pathname,host=await server(prefix);host.hold();
 let stage='navigation';
 try{
  await page.goto(host.url);await expect.poll(()=>host.counts.get(prefix+'art/note.webp')??0).toBe(1);
  expect(await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();return !!r?.active;})).toBe(false);
  expect(await page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(false);
  // A simultaneous consumer must not replace the worker's held response. The
  // old single resolver lost the first request and could hang install/teardown.
  stage='concurrent held resource';
  const consumer=fetch(new URL('art/note.webp',host.url)).then(async response=>{expect(response.ok).toBe(true);await response.arrayBuffer();});
  await expect.poll(()=>host.counts.get(prefix+'art/note.webp')??0).toBe(2);
  expect(await page.evaluate(async()=>!!(await navigator.serviceWorker.getRegistration())?.active)).toBe(false);
  expect(await page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(false);
  stage='release and activation';
  host.release();await consumer;
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});stage='reload';await page.reload();
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 }catch(error){console.error('Incomplete install diagnostics',JSON.stringify({stage,requests:host.requests,counts:[...host.counts]}));throw error;
 }finally{host.release();await page.goto('about:blank');await host.close();}
});
test('post-V6 conservative worker update keeps two old tabs offline, preserves catalog21 pending, then activates after they close',async({context,page},info)=>{
 const prefix=new URL(info.project.use.baseURL!).pathname,host=await server(prefix,true),key='dear-mayor:save:v1';
 try{
  await page.goto(host.url);await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
  const pending=fixture.find(f=>f.name==='quietchoir/continuation-0')!;
  await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(pending.state)});await page.reload();
  const second=await context.newPage();await second.goto(host.url);
  expect(await second.evaluate(async()=> (await (await fetch('./build-info.json')).json()).version)).toBe('v6-protocol-fixture');
  host.upgrade();await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration())!.update();});
  await expect.poll(()=>page.evaluate(async()=>!!(await navigator.serviceWorker.getRegistration())?.waiting)).toBe(true);
  await context.setOffline(true);await page.reload();await second.reload();
  for(const tab of [page,second]){
   for(const body of pending.document.body)await expect(tab.locator('.letter-reading')).toContainText(body);
   expect(await tab.evaluate(async()=> (await (await fetch('./build-info.json')).json()).version)).toBe('v6-protocol-fixture');
   await tab.getByRole('button',{name:'批示回复',exact:true}).click();await tab.keyboard.press('Escape');
   expect(await tab.evaluate(key=>localStorage.getItem(key),key)).toBe(JSON.stringify(pending.state));
  }
  await page.close();await second.close();await context.setOffline(false);
  const fresh=await context.newPage();await fresh.goto(host.url);
  await expect.poll(()=>fresh.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();return !!r?.active&&!r.waiting;})).toBe(true);
  const metadata=JSON.parse(readFileSync('dist/build-info.json','utf8'));
  await expect.poll(()=>fresh.evaluate(async()=> (await (await fetch('./build-info.json')).json()).version)).toBe(metadata.version);
  expect(await fresh.evaluate(()=>caches.has('dear-mayor-v6-protocol-fixture'))).toBe(true);
  await context.setOffline(true);await fresh.reload();await fresh.setViewportSize({width:390,height:844});
  await expect(fresh.locator('h1')).toHaveText(pending.document.title);
  await fresh.getByRole('button',{name:'批示回复',exact:true}).click();await fresh.locator('[data-choice="2"]').click();
  await expect.poll(()=>fresh.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe(pending.document.replies[2].result);
  await fresh.reload();await expect(fresh.locator('.save-warning')).toHaveCount(0);await fresh.close();
 }finally{await context.setOffline(false);for(const tab of context.pages())await tab.goto('about:blank');await host.close();}
});
