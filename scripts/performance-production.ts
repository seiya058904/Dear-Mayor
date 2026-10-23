/** Isolated production acceptance. prepare captures the actual old Pages worker;
 * verify reopens that profile after deployment, then uses a fresh context for smoke.
 */
import {chromium,expect,type Page} from '@playwright/test';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import fixtures from '../tests/fixtures/catalog-21-audit-saves.json' with {type:'json'};
import v1 from '../tests/fixtures/v1-saves.json' with {type:'json'};
import v2 from '../tests/fixtures/v2-saves.json' with {type:'json'};
import v3 from '../tests/fixtures/v3-saves.json' with {type:'json'};
import {newGame,decide,currentDocument} from '../src/game/engine';
import {restore} from '../src/game/persistence';
import pilot from '../src/game/causal-pilot.json' with {type:'json'};
const out='.local/performance-20261023',profile=resolve(out,'production-upgrade-profile');
const url='https://seiya058904.github.io/Dear-Mayor/',key='dear-mayor:save:v1';
const phase=process.env.PRODUCTION_PHASE??'verify',expected=process.env.RELEASE_SHA;
const pending=fixtures.find(f=>f.name==='quietchoir/continuation-0')!,raw=JSON.stringify(pending.state);
mkdirSync(out,{recursive:true});
async function ready(page:Page){await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller),{timeout:120000}).toBe(true);await page.evaluate(()=>document.fonts.ready);}
if(phase==='prepare'){
 if(existsSync(profile))throw Error('Refusing to replace an existing isolated profile');
 const context=await chromium.launchPersistentContext(profile,{headless:true,reducedMotion:'reduce'});
 try{
  const page=context.pages()[0];await page.goto(url);await ready(page);
  await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw});await page.reload();
  for(const body of pending.document.body)await expect(page.locator('.letter-reading')).toContainText(body);
  const metadata=await page.evaluate(async()=> (await (await fetch('./build-info.json')).json()));
  const caches=await page.evaluate(()=>globalThis.caches.keys());
  writeFileSync(out+'/production-before.json',JSON.stringify({metadata,caches,syntheticPending:pending.name,raw},null,2)+'\n');
  console.log('Captured actual old production worker',metadata,'in isolated profile');
 }finally{await context.close();}
}else{
 if(!expected)throw Error('RELEASE_SHA is required');
 const old=JSON.parse(readFileSync(out+'/production-before.json','utf8'));
 const evidence:any={expected,oldMetadata:old.metadata,upgrade:{},smoke:[],errors:[]};
 const context=await chromium.launchPersistentContext(profile,{headless:true,reducedMotion:'reduce'});
 try{
  const page=context.pages()[0];await page.goto(url);await ready(page);
  for(const body of pending.document.body)await expect(page.locator('.letter-reading')).toContainText(body);
  expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
  const second=await context.newPage();await second.goto(url);
  await page.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration())!.update();});
  await expect.poll(()=>page.evaluate(async()=>!!(await navigator.serviceWorker.getRegistration())?.waiting),{timeout:120000}).toBe(true);
  await context.setOffline(true);
  for(const tab of [page,second]){
   await tab.reload();await tab.setViewportSize({width:390,height:844});
   expect(await tab.evaluate(async()=> (await (await fetch('./build-info.json')).json()).commit)).toBe(old.metadata.commit);
   await expect(tab.locator('h1')).toHaveText(pending.document.title);
   await tab.getByRole('button',{name:'批示回复',exact:true}).click();
   for(let i=0;i<3;i++)await expect(tab.locator('[data-choice]').nth(i).locator('span').last()).toHaveText(pending.document.replies[i].text);
   await tab.keyboard.press('Escape');expect(await tab.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
  }
  await page.close();await second.close();await context.setOffline(false);
  const fresh=await context.newPage();await fresh.goto(url);
  await expect.poll(()=>fresh.evaluate(async()=> (await (await fetch('./build-info.json')).json()).commit)).toBe(expected);
  expect(await fresh.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
  for(const body of pending.document.body)await expect(fresh.locator('.letter-reading')).toContainText(body);
  const cacheNames=await fresh.evaluate(()=>caches.keys());for(const name of old.caches)expect(cacheNames).not.toContain(name);
  await context.setOffline(true);await fresh.reload();await fresh.getByRole('button',{name:'批示回复',exact:true}).click();await fresh.locator('[data-choice="2"]').click();
  await expect.poll(()=>fresh.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe(pending.document.replies[2].result);
  await fresh.reload();await expect(fresh.locator('.save-warning')).toHaveCount(0);
  evidence.upgrade={waitingWithTwoOldTabs:true,oldTabsOffline:true,oldPendingExact:true,newCommit:expected,newWorkerOfflineDecision:true,cacheNames};
  console.log('Actual production old-worker -> new-worker PASS');
 }finally{await context.close();}
 const browser=await chromium.launch(),clean=await browser.newContext({reducedMotion:'reduce'});
 try{
  const page=await clean.newPage();page.on('pageerror',e=>evidence.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')evidence.errors.push(m.text());});
  page.on('response',r=>{if(r.status()>=400)evidence.errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(url);await ready(page);await expect(page).toHaveTitle('Dear Mayor · 小镇，请批示');
  expect(await page.evaluate(async()=> (await (await fetch('./build-info.json')).json()).commit)).toBe(expected);
  expect(await page.locator('img').evaluateAll(images=>images.every(e=>(e as HTMLImageElement).complete&&(e as HTMLImageElement).naturalWidth>0))).toBe(true);
  expect(await page.evaluate(()=>[...document.fonts].some(f=>f.family==='WenKai'&&f.status==='loaded'))).toBe(true);
  const choices=[['approve',undefined],['reject',undefined],['defer',undefined],['written_reply',0],['written_reply',1],['written_reply',2]] as const;
  // All four new rules, every exact source result, using real engine histories.
  for(const rule of pilot.filter(r=>r.introducedRevision===22))for(let v=0;v<6;v++){
   let state=newGame();
   for(let n=0;n<1200&&state.current!==rule.target;n++){const [a,r]=choices[state.current===rule.source?v:0];state=decide(state,state.current,a,r);}
   expect(state.current).toBe(rule.target);const doc=currentDocument(state),saved=JSON.stringify(state);
   await clean.setOffline(false);await page.evaluate(({key,saved})=>localStorage.setItem(key,saved),{key,saved});await page.reload();
   await expect(page.locator('.letter-reading')).toContainText(rule.variants[v].draft);
   await page.getByRole('button',{name:'批示回复',exact:true}).click();await page.keyboard.press('Escape');expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(saved);
   await clean.setOffline(true);await page.reload();await page.setViewportSize({width:v%2?768:390,height:1024});
   for(const body of doc.body)await expect(page.locator('.letter-reading')).toContainText(body);
   const [action,reply]=choices[v];
   if(action==='written_reply'){await page.getByRole('button',{name:'批示回复',exact:true}).click();await page.locator('[data-choice]').nth(reply!).click();}
   else await page.getByRole('button',{name:{approve:'批准',reject:'不批准',defer:'搁置'}[action],exact:true}).click();
   await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe(action==='written_reply'?doc.replies[reply!].result:doc.results[action]);
   await page.reload();await expect(page.locator('.save-warning')).toHaveCount(0);
   evidence.smoke.push({target:rule.target,sourceAction:rule.variants[v].action,sourceReply:rule.variants[v].reply,renderedExact:true,offlineTargetAction:action,reply:reply??null});
  }
  await clean.setOffline(false);
  let choir=newGame();
  while(choir.current!=='quietchoir/defer')choir=decide(choir,choir.current,choir.current==='quietchoir/start'?'defer':'approve');
  await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(choir)});await page.reload();
  await expect(page.locator('.letter-reading')).toContainText('我不想替他选');
  await page.getByRole('button',{name:'不批准',exact:true}).click();
  await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe('留夹没获准，阿满自己保存纸，安瑟不改他的记忆。');
  evidence.smoke.push({currentChoirIdentity:true,rejectResult:true});
  for(const [label,state] of [
   ['v1',v1.find(f=>f.state.history.length>0)!.state],['v2',v2.find(f=>f.state.history.length>0)!.state],['v3',v3.find(f=>f.state.history.length>0)!.state],
   ...fixtures.filter(f=>f.name.endsWith('-0')).map(f=>[f.name,f.state] as const),
  ] as const){
   const saved=JSON.stringify(state),doc=currentDocument(restore(saved));
   await page.evaluate(({key,saved})=>{localStorage.removeItem(key+':recovery');localStorage.setItem(key,saved);},{key,saved});await page.reload();
   await expect(page.locator('h1')).toHaveText(doc.title);await expect(page.locator('.signature')).toHaveText(doc.sender);
   for(const body of doc.body)await expect(page.locator('.letter-reading')).toContainText(body);
   await page.getByRole('button',{name:'批示回复',exact:true}).click();for(let i=0;i<3;i++)await expect(page.locator('[data-choice]').nth(i).locator('span').last()).toHaveText(doc.replies[i].text);
   await page.keyboard.press('Escape');expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(saved);
   await page.getByRole('button',{name:'不批准',exact:true}).click();await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe(doc.results.reject);
   await page.reload();await expect(page.locator('.save-warning')).toHaveCount(0);evidence.smoke.push({legacy:label,exactDocument:true,oldResult:true});
  }
  await page.getByRole('button',{name:'重启一季'}).click();await page.getByRole('button',{name:'继续批阅'}).click();
  await page.getByRole('button',{name:'重启一季'}).click();await page.getByRole('button',{name:'确认重启'}).click();
  await expect(page.locator('article')).toHaveAttribute('data-letter-id','bridge/start');
  await page.getByRole('button',{name:'批准',exact:true}).dblclick({delay:30});
  await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.length,key)).toBe(1);
  await page.reload();await expect(page.locator('.save-warning')).toHaveCount(0);
  await page.screenshot({path:out+'/production-final.png',fullPage:true});
  evidence.cacheIntegrity=await page.evaluate(async()=>{
   const worker=await(await fetch('./sw.js',{cache:'reload'})).text();
   const files=JSON.parse(worker.match(/const FILES = (.*);/)![1]) as {url:string;integrity:string}[];
   const cache=await caches.open((await caches.keys()).find(n=>n.endsWith('-'+encodeURIComponent(location.pathname)))!);
   const rows=[];
   for(const file of files){
    const response=await cache.match(new URL(file.url,location.href).href,{ignoreVary:true});
    if(!response)throw Error('Missing live cache '+file.url);
    const data=await response.arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',data);
    const integrity='sha256-'+btoa(String.fromCharCode(...new Uint8Array(digest)));
    if(integrity!==file.integrity)throw Error('Live integrity mismatch '+file.url);
    rows.push({url:file.url,bytes:data.byteLength,integrity});
   }
   return rows;
  });
  evidence.metadataAndAssets=true;evidence.restartCancelConfirmRapidClick=true;expect(evidence.errors).toEqual([]);
  console.log('Fresh production smoke PASS',evidence.smoke.length,'causal/legacy routes; all six decisions, cancel, restart, fast click, fonts/art, offline');
 }finally{await clean.close();await browser.close();writeFileSync(out+'/production-final.json',JSON.stringify(evidence,null,2)+'\n');}
}
