/** Actual captured V6 dist -> current dist, two tabs, both deployment paths. */
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {chromium,expect} from '@playwright/test';
import fixtures from '../tests/fixtures/catalog-21-audit-saves.json' with {type:'json'};
const roots=['.local/post-v6-20261021/baseline-dist','dist'].map(p=>resolve(p));
const types:Record<string,string>={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.webp':'image/webp','.png':'image/png','.ico':'image/x-icon','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
let phase=0;
const server=createServer((req,res)=>{
 const pathname=new URL(req.url!,'http://localhost').pathname;
 const file=resolve(roots[phase],'.'+pathname.replace(/^\/Dear-Mayor(?=\/)/,'').replace(/\/$/,'/index.html'));
 if(!file.startsWith(roots[phase]+sep)){res.writeHead(403).end();return;}
 try{const data=readFileSync(file);res.writeHead(200,{'Content-Type':types[extname(file)]??'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-cache'}).end(data);}catch{res.writeHead(404).end();}
});
await new Promise<void>(r=>server.listen(53533,'127.0.0.1',511,r));
const browser=await chromium.launch(),rows=[];
try{
 for(const prefix of ['/','/Dear-Mayor/']){
  phase=0;const context=await browser.newContext({reducedMotion:'reduce'});
  try{
   const url='http://127.0.0.1:53533'+prefix,page=await context.newPage();
   const fixture=fixtures.find(f=>f.name==='quietchoir/continuation-0')!,raw=JSON.stringify(fixture.state),key='dear-mayor:save:v1';
   await page.goto(url);await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
   await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw});await page.reload();
   for(const body of fixture.document.body)await expect(page.locator('.letter-reading')).toContainText(body);
   const second=await context.newPage();await second.goto(url);
   const oldVersion=await second.evaluate(async()=> (await (await fetch('./build-info.json')).json()).version);
   const oldCacheNames=await page.evaluate(()=>caches.keys());
   phase=1;await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration())!.update();});
   await expect.poll(()=>page.evaluate(async()=>!!(await navigator.serviceWorker.getRegistration())?.waiting)).toBe(true);
   await context.setOffline(true);
   for(const tab of [page,second]){
    await tab.reload();await tab.setViewportSize({width:390,height:844});await expect(tab.locator('.paper-art')).toBeVisible();
    expect(await tab.locator('.paper-art').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
    expect(await tab.evaluate(async()=> (await (await fetch('./build-info.json')).json()).version)).toBe(oldVersion);
    await tab.getByRole('button',{name:'批示回复',exact:true}).click();
    for(let i=0;i<3;i++)await expect(tab.locator('[data-choice]').nth(i).locator('span').last()).toHaveText(fixture.document.replies[i].text);
    await tab.keyboard.press('Escape');expect(await tab.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
   }
   await page.close();await second.close();await context.setOffline(false);
   const fresh=await context.newPage();await fresh.goto(url);
   const nextVersion=JSON.parse(readFileSync('dist/build-info.json','utf8')).version;
   await expect.poll(()=>fresh.evaluate(async()=> (await (await fetch('./build-info.json')).json()).version)).toBe(nextVersion);
   expect(await fresh.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
   for(const body of fixture.document.body)await expect(fresh.locator('.letter-reading')).toContainText(body);
   const cacheNames=await fresh.evaluate(()=>caches.keys());for(const name of oldCacheNames)expect(cacheNames).toContain(name);
   await context.setOffline(true);await fresh.reload();await fresh.getByRole('button',{name:'批示回复',exact:true}).click();await fresh.locator('[data-choice="2"]').click();
   await expect.poll(()=>fresh.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe(fixture.document.replies[2].result);
   await fresh.reload();await expect(fresh.locator('.save-warning')).toHaveCount(0);
   rows.push({prefix,oldVersion,nextVersion,oldCacheNames,cacheNames,oldTabsWaitingOffline:true,oldPendingExact:true,newWorkerOfflineDecision:true});console.log(prefix,'PASS',oldVersion,'->',nextVersion);
  }finally{await context.close();}
 }
}finally{await browser.close();server.close();mkdirSync('docs/post-v6-evidence',{recursive:true});writeFileSync('docs/post-v6-evidence/actual-v6-upgrade.json',JSON.stringify({method:'Unmodified captured baseline production dist 804d09a -> current production dist on the same localhost origin. Two controlled tabs, waiting update, offline viewport/paper/reply, close tabs, new worker activation, exact catalog21 pending and offline real decision. Isolated contexts; no personal browser data.',rows},null,2)+'\n');}
