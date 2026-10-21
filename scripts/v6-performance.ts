/** Local comparison only. Build/copy V5 to .local/v5-dist before editing V5.
 * Run: npx tsx scripts/v6-performance.ts
 * No dependencies, service worker, or application code are changed by this measurement.
 */
import {createServer, type ServerResponse} from 'node:http';
import {readFileSync,readdirSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,relative,extname} from 'node:path';
import {gzipSync} from 'node:zlib';
import {cpus,platform,release} from 'node:os';
import {chromium} from '@playwright/test';
import {newGame,decide} from '../src/game/engine';

const mime:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon'};
function serve(root:string,port:number){
  const files=new Map<string,{raw:Buffer;gzip:Buffer}>();
  function walk(dir:string){for(const name of readdirSync(dir)){const file=resolve(dir,name);if(statSync(file).isDirectory())walk(file);else {const raw=readFileSync(file);files.set('/'+relative(root,file).replaceAll('\\','/'),{raw,gzip:gzipSync(raw)});}}}
  root=resolve(root);walk(root);
  const transfers:{url:string;bodyBytes:number;headerBytes:number;encoding:string}[]=[];
  let throttled=false;
  const pending:{res:ServerResponse;data:Buffer;offset:number;ready:number}[]=[];
  // Nominal shared 1.6 Mbps cap also applies to service-worker requests.
  // Timer scheduling can reduce attained throughput; report actual bytes/time.
  // CDP page throttling alone can miss worker-originated precache traffic.
  const timer=setInterval(()=>{
    let budget=10000;
    for(const item of [...pending]){
      if(item.ready>Date.now())continue;
      if(item.res.destroyed){pending.splice(pending.indexOf(item),1);continue;}
      const size=Math.min(budget,item.data.length-item.offset);
      if(size){item.res.write(item.data.subarray(item.offset,item.offset+size));item.offset+=size;budget-=size;}
      if(item.offset===item.data.length){item.res.end();pending.splice(pending.indexOf(item),1);}
      if(!budget)break;
    }
  },50);
  const server=createServer((req,res)=>{
    const url=new URL(req.url!,'http://localhost').pathname;
    const key=url.replace(/^\/Dear-Mayor(?=\/)/,'').replace(/\/$/,'/index.html');
    const file=files.get(key);if(!file){res.writeHead(404);res.end();return;}
    const compressed=/gzip/.test(req.headers['accept-encoding']??'');
    const data=compressed?file.gzip:file.raw;
    res.writeHead(200,{'Content-Type':mime[extname(key)]??'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-cache',...(compressed?{'Content-Encoding':'gzip'}:{})});
    transfers.push({url,bodyBytes:data.length,headerBytes:Buffer.byteLength((res as any)._header??''),encoding:compressed?'gzip':'identity'});
    if(throttled)pending.push({res,data,offset:0,ready:Date.now()+150});else res.end(data);
  });
  return {server,timer,transfers,setThrottle:(on:boolean)=>{throttled=on;},port};
}

const servers=[serve('.local/v5-dist',52742),serve('dist',52743)];
for(const s of servers)await new Promise<void>(r=>s.server.listen(s.port,'127.0.0.1',r));
const browser=await chromium.launch();const rows:unknown[]=[];
try{
for(const [version,server] of servers.entries())for(const mobile of [false,true])for(const slow of [false,true]){
  if(process.env.V6_PERF_PROFILE==='normal'&&slow)continue;
  server.setThrottle(slow);
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1920,height:1080},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2.75:1,reducedMotion:'reduce',...(mobile?{userAgent:'Mozilla/5.0 (Linux; Android 13; simulated) AppleWebKit/537.36 Chrome/145.0.0.0 Mobile Safari/537.36'}:{})});
  const page=await context.newPage(),cdp=await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:slow?4:1});await cdp.send('Performance.enable');
  await page.addInitScript(()=>{
    (window as any).__timing={};
    const observer=new MutationObserver(()=>{
      if(!document.querySelector('article')||!document.querySelector('.decision'))return;
      (window as any).__timing.document=performance.now();
      document.fonts.ready.then(()=>{(window as any).__timing.fonts=performance.now();});
      observer.disconnect();
    });observer.observe(document,{childList:true,subtree:true});
    navigator.serviceWorker.ready.then(()=>{(window as any).__timing.offline=performance.now();});
  });
  const url=`http://127.0.0.1:${server.port}/`;server.transfers.length=0;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:180000});
  await page.waitForSelector('article',{timeout:180000});
  await page.waitForFunction(()=>performance.getEntriesByName('first-contentful-paint').length>0);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(null)))));
  const interactive=await page.evaluate(()=>{
    const t=performance.now();(document.querySelector('.decision') as HTMLButtonElement).click();
    if(!JSON.parse(localStorage.getItem('dear-mayor:save:v1')!).history.length)throw Error('Choice failed');return t;
  });
  await page.waitForFunction(()=>Number.isFinite((window as any).__timing.offline)&&Number.isFinite((window as any).__timing.fonts),{},{timeout:180000});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  const timing=await page.evaluate(()=>({...((window as any).__timing),paints:performance.getEntriesByType('paint').map(p=>({name:p.name,startTime:p.startTime}))}));
  const traffic=structuredClone(server.transfers);
  const cache=await page.evaluate(async()=>{const result=[];for(const name of await caches.keys()){const c=await caches.open(name);for(const r of await c.keys()){const response=await c.match(r);result.push({url:new URL(r.url).pathname,decodedBytes:(await response!.arrayBuffer()).byteLength});}}return result;});
  const samples=[];
  for(const count of [0,100,860]){
    let state=newGame(6271,version===0?20:21);
    for(let n=0;n<count;n++)state=decide(state,state.current,'approve',undefined,version===0?20:21);
    const raw=JSON.stringify(state);
    await page.evaluate(raw=>localStorage.setItem('dear-mayor:save:v1',raw),raw);
    const times=[];
    for(let n=0;n<3;n++){
      const t=performance.now();await page.reload();await page.waitForSelector(`article[data-letter-id="${state.current}"]`);
      times.push(performance.now()-t);
    }
    await cdp.send('HeapProfiler.collectGarbage');
    const metrics=(await cdp.send('Performance.getMetrics')).metrics;
    samples.push({decisions:count,saveBytes:Buffer.byteLength(raw),warmReloadMs:times,heapUsedBytes:metrics.find(x=>x.name==='JSHeapUsedSize')!.value,heapTotalBytes:metrics.find(x=>x.name==='JSHeapTotalSize')!.value});
  }
  await context.setOffline(true);await page.reload();await page.waitForSelector('article');
  await page.getByRole('button',{name:'搁置',exact:true}).click();
  const offlineNext=await page.evaluate(()=>JSON.parse(localStorage.getItem('dear-mayor:save:v1')!).history.length===861);
  rows.push({version:version===0?'V5':'V6',viewport:mobile?'390x844 simulated Android':'1920x1080 desktop',cpuRate:slow?4:1,network:slow?'nominal shared cap 200000 bytes/s, 150ms response latency; timer scheduling can reduce attained throughput':'unthrottled localhost',cold:{...timing,interactiveMs:interactive,bodyTransferBytes:traffic.reduce((s,x)=>s+x.bodyBytes,0),headerTransferBytes:traffic.reduce((s,x)=>s+x.headerBytes,0),requests:traffic},cache,samples,offlineNext});
  console.log(`${version===0?'V5':'V6'} ${mobile?'mobile':'desktop'} ${slow?'4x/slow':'normal'} document=${timing.document.toFixed(0)}ms interactive=${interactive.toFixed(0)}ms fonts=${timing.fonts.toFixed(0)}ms offline=${timing.offline.toFixed(0)}ms`);
  await context.close();
}
}finally{
  await browser.close();for(const s of servers){clearInterval(s.timer);s.server.close();}
  mkdirSync('docs/v6-evidence',{recursive:true});
  writeFileSync('docs/v6-evidence/performance.json',JSON.stringify({environment:{node:process.version,os:`${platform()} ${release()}`,cpu:cpus()[0].model,browser:browser.version()},method:'One cold sample per version/device/profile, three warm reloads per save size. Gzip HTTP on localhost, aggregate server shaping includes worker traffic. Simulated Android, not hardware. Reload includes replay, cached assets and rendering. Heap after explicit GC is a snapshot, not a leak test. Body and header bytes counted by server; excludes TCP/TLS overhead.',rows},null,2)+'\n');
}
