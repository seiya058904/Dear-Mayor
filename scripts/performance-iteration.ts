/** Cold production comparison. before uses the captured opening production dist;
 * after uses dist. Five alternating fresh contexts per device/network, including worker traffic.
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
  function setRoot(next:string){root=resolve(next);files.clear();walk(root);}
  const transfers:any[]=[];
  let throttled=false;
  const pending:{res:ServerResponse;data:Buffer;offset:number;ready:number;record:any}[]=[];
  // Nominal shared 1.6 Mbps cap also applies to service-worker requests.
  // Timer scheduling can reduce attained throughput; report actual bytes/time.
  // CDP page throttling alone can miss worker-originated precache traffic.
  const timer=setInterval(()=>{
    let budget=10000;
    for(const item of [...pending]){
      if(item.ready>Date.now())continue;
      if(item.res.destroyed){pending.splice(pending.indexOf(item),1);continue;}
      const size=Math.min(budget,item.data.length-item.offset);
      if(size){item.res.write(item.data.subarray(item.offset,item.offset+size));item.offset+=size;budget-=size;item.record.sentBytes+=size;}
      if(item.offset===item.data.length){item.res.end();item.record.end=performance.now();pending.splice(pending.indexOf(item),1);}
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
    const record={url,bodyBytes:data.length,sentBytes:0,start:performance.now(),end:0,headerBytes:Buffer.byteLength((res as any)._header??''),encoding:compressed?'gzip':'identity'};transfers.push(record);
    if(throttled)pending.push({res,data,offset:0,ready:Date.now()+150,record});else {res.end(data);record.sentBytes=data.length;record.end=performance.now();}
  });
  return {server,timer,transfers,setRoot,setThrottle:(on:boolean)=>{throttled=on;},port};
}

const out='.local/performance-20261023';
const server=serve(out+'/baseline-dist',53532);
await new Promise<void>(r=>server.server.listen(server.port,'127.0.0.1',r));
const browser=await chromium.launch();const rows:any[]=[];
mkdirSync(out,{recursive:true});
try{
 for(let sample=0;sample<5;sample++)for(const slow of [false,true])for(const mobile of [false,true])for(const phase of (sample%2?['after','before']:['before','after'])){
  server.setRoot(phase==='before'?out+'/baseline-dist':'dist');
  server.setThrottle(slow);server.transfers.length=0;
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1672,height:941},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2.75:1,reducedMotion:'reduce'});
  try{
   const page=await context.newPage(),cdp=await context.newCDPSession(page);
   const errors:string[]=[],network:any[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   await cdp.send('Network.enable');cdp.on('Network.requestWillBeSent',e=>network.push({url:e.request.url,priority:e.request.initialPriority,type:e.type,timestamp:e.timestamp}));
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:slow?4:1});
   await page.addInitScript(()=>{
    (window as any).__timing={};(window as any).__longTasks=[];
    new PerformanceObserver(list=>{(window as any).__longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})));}).observe({type:'longtask',buffered:true});
    const observer=new MutationObserver(()=>{
     if(!document.querySelector('article')||document.querySelectorAll('.decision:not(:disabled)').length!==4)return;
     (window as any).__timing.document=performance.now();
     document.fonts.ready.then(()=>{(window as any).__timing.fonts=performance.now();});observer.disconnect();
    });observer.observe(document,{childList:true,subtree:true});
    navigator.serviceWorker.ready.then(()=>{(window as any).__timing.offline=performance.now();});
   });
   const prefix=sample%2?'/Dear-Mayor/':'/';const started=performance.now();
   await page.goto(`http://127.0.0.1:${server.port}${prefix}`,{waitUntil:'domcontentloaded',timeout:240000});
   await page.waitForSelector('article',{timeout:240000});
   await page.waitForFunction(()=>performance.getEntriesByName('first-contentful-paint').length>0);
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const domChoiceReadyMs=await page.evaluate(()=>performance.now());
   // Text paint is not the full illustrated screen. Wait for the actual paper
   // and all four image buttons to decode, then let two frames paint them.
   await page.evaluate(async()=>{
    await document.fonts.ready;
    await Promise.all([...document.images].map(image=>image.decode()));
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   });
   const illustratedReadyMs=await page.evaluate(()=>performance.now());
   await page.getByRole('button',{name:'批准',exact:true}).click();
   const interactive=await page.evaluate(()=>{
    if(JSON.parse(localStorage.getItem('dear-mayor:save:v1')!).history.length!==1)throw Error('Decision did not persist');return performance.now();
   });
   const firstInteractiveBytes=server.transfers.reduce((s,r)=>s+r.sentBytes,0);
   await page.waitForFunction(()=>Number.isFinite((window as any).__timing.offline)&&Number.isFinite((window as any).__timing.fonts),{},{timeout:240000});
   await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
   const timing=await page.evaluate(()=>({...((window as any).__timing),fcp:performance.getEntriesByName('first-contentful-paint')[0].startTime,longTasks:(window as any).__longTasks,resources:performance.getEntriesByType('resource').map(e=>e.toJSON())}));
   const requests=structuredClone(server.transfers).map(r=>({...r,start:r.start-started,end:r.end-started}));
   const cache=await page.evaluate(async()=>{
    const result=[];
    for(const name of await caches.keys()){const c=await caches.open(name);for(const r of await c.keys()){const response=await c.match(r);result.push({cache:name,url:new URL(r.url).pathname,decodedBytes:(await response!.arrayBuffer()).byteLength});}}
    return result;
   });
   server.setThrottle(false);
   const revisitStart=performance.now();await page.reload();await page.waitForSelector('article');await page.evaluate(()=>document.fonts.ready);const revisitMs=performance.now()-revisitStart;
   await context.setOffline(true);const offlineStart=performance.now();await page.reload();await page.waitForSelector('article');
   const offlineReloadMs=performance.now()-offlineStart;
   await page.setViewportSize(mobile?{width:1672,height:941}:{width:390,height:844});
   await page.getByRole('button',{name:'批示回复',exact:true}).click();await page.locator('[data-choice="2"]').click();
   await page.waitForFunction(()=>JSON.parse(localStorage.getItem('dear-mayor:save:v1')!).history.length===2);
   if(errors.length)throw Error(errors.join('\n'));
   rows.push({phase,sample,mobile,slow,prefix,domChoiceReadyMs,illustratedReadyMs,firstInteractiveBytes,revisitMs,offlineReloadMs,network,errors,cpu:slow?4:1,...timing,interactiveMs:interactive,bodyTransferBytes:requests.reduce((s,r)=>s+r.bodyBytes,0),headerTransferBytes:requests.reduce((s,r)=>s+r.headerBytes,0),cacheDecodedBytes:cache.reduce((s,r)=>s+r.decodedBytes,0),cache,requests,offlineResizeReply:true});
   console.log(phase,mobile?'mobile':'desktop',slow?'slow':'normal',sample,JSON.stringify({dom:timing.document,fcp:timing.fcp,interactive,fonts:timing.fonts,offline:timing.offline,body:rows.at(-1).bodyTransferBytes}));
   writeFileSync(`${out}/performance-ab.json`,JSON.stringify({environment:{node:process.version,os:`${platform()} ${release()}`,cpu:cpus()[0].model,browser:browser.version()},method:'Five independent cold contexts per version/device/profile. Alternating AB/BA per round; both paths sampled (root 3/subpath 2). Gzip server; shared nominal 200000 bytes/s +150ms response latency, 50ms FIFO budget, worker requests included. Windows timers may reduce attained rate. Times are local controlled simulation, not production or hardware Android. Interactive is a real pointer click and saved decision after FCP, font readiness, every DOM image decoded and two animation frames. Complete offline time waits for SW ready and controller, then tests offline reload, other paper viewport and reply C.',rows},null,2)+'\n');
  }finally{await context.close();}
 }
}finally{await browser.close();clearInterval(server.timer);server.server.close();}
