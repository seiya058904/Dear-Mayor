/** Cold production comparison. PERF_PHASE=before uses the captured V6 dist;
 * after uses dist. Three fresh contexts per device/network, including worker traffic.
 * Keep other browser/test workloads stopped during measurement. No personal saves.
 */
import {createServer, type ServerResponse} from 'node:http';
import {readFileSync,readdirSync,statSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,relative,extname} from 'node:path';
import {gzipSync} from 'node:zlib';
import {cpus,platform,release} from 'node:os';
import {chromium} from '@playwright/test';


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

const phase=process.env.PERF_PHASE??'after';
const server=serve(phase==='before'?'.local/post-v6-20261021/baseline-dist':'dist',53532);
await new Promise<void>(r=>server.server.listen(server.port,'127.0.0.1',r));
const browser=await chromium.launch();const rows:any[]=[];
const out='docs/post-v6-evidence';mkdirSync(out,{recursive:true});
try{
 for(const slow of [false,true])for(const mobile of [false,true])for(let sample=0;sample<3;sample++){
  server.setThrottle(slow);server.transfers.length=0;
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1672,height:941},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2.75:1,reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),cdp=await context.newCDPSession(page);
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:slow?4:1});
   await page.addInitScript(()=>{
    (window as any).__timing={};
    const observer=new MutationObserver(()=>{
     if(!document.querySelector('article')||!document.querySelector('.decision'))return;
     (window as any).__timing.document=performance.now();
     document.fonts.ready.then(()=>{(window as any).__timing.fonts=performance.now();});observer.disconnect();
    });observer.observe(document,{childList:true,subtree:true});
    navigator.serviceWorker.ready.then(()=>{(window as any).__timing.offline=performance.now();});
   });
   await page.goto(`http://127.0.0.1:${server.port}/`,{waitUntil:'domcontentloaded',timeout:240000});
   await page.waitForSelector('article',{timeout:240000});
   await page.waitForFunction(()=>performance.getEntriesByName('first-contentful-paint').length>0);
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const interactive=await page.evaluate(()=>{
    const t=performance.now();(document.querySelector('.decision') as HTMLButtonElement).click();
    if(JSON.parse(localStorage.getItem('dear-mayor:save:v1')!).history.length!==1)throw Error('Decision did not persist');return t;
   });
   await page.waitForFunction(()=>Number.isFinite((window as any).__timing.offline)&&Number.isFinite((window as any).__timing.fonts),{},{timeout:240000});
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
   const timing=await page.evaluate(()=>({...((window as any).__timing),fcp:performance.getEntriesByName('first-contentful-paint')[0].startTime}));
   const requests=structuredClone(server.transfers);
   const cache=await page.evaluate(async()=>{
    const result=[];
    for(const name of await caches.keys()){const c=await caches.open(name);for(const r of await c.keys()){const response=await c.match(r);result.push({cache:name,url:new URL(r.url).pathname,decodedBytes:(await response!.arrayBuffer()).byteLength});}}
    return result;
   });
   await context.setOffline(true);await page.reload();await page.waitForSelector('article');
   await page.setViewportSize(mobile?{width:1672,height:941}:{width:390,height:844});
   await page.getByRole('button',{name:'批示回复',exact:true}).click();await page.locator('[data-choice="2"]').click();
   await page.waitForFunction(()=>JSON.parse(localStorage.getItem('dear-mayor:save:v1')!).history.length===2);
   rows.push({phase,sample,mobile,slow,cpu:slow?4:1,...timing,interactiveMs:interactive,bodyTransferBytes:requests.reduce((s,r)=>s+r.bodyBytes,0),headerTransferBytes:requests.reduce((s,r)=>s+r.headerBytes,0),cacheDecodedBytes:cache.reduce((s,r)=>s+r.decodedBytes,0),cache,requests,offlineResizeReply:true});
   console.log(phase,mobile?'mobile':'desktop',slow?'slow':'normal',sample,JSON.stringify({dom:timing.document,fcp:timing.fcp,interactive,fonts:timing.fonts,offline:timing.offline,body:rows.at(-1).bodyTransferBytes}));
   writeFileSync(`${out}/performance-${phase}.json`,JSON.stringify({environment:{node:process.version,os:`${platform()} ${release()}`,cpu:cpus()[0].model,browser:browser.version()},method:'Three independent cold contexts per device/profile. Gzip server; shared nominal 200000 bytes/s +150ms response latency, 50ms FIFO budget, worker requests included. Windows timers may reduce attained rate. Times are local controlled simulation, not production or hardware Android. Interactive is an actual saved decision after FCP and two animation frames. Complete offline time waits for SW ready and controller, then tests offline reload, other paper viewport and reply C.',rows},null,2)+'\n');
  }finally{await context.close();}
 }
}finally{await browser.close();clearInterval(server.timer);server.server.close();}
