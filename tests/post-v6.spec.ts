import {test,expect} from '@playwright/test';
import {mkdirSync,readFileSync} from 'node:fs';
import path from 'node:path';
import {newGame,decide,currentDocument} from '../src/game/engine';
import {documents} from '../src/content';
import pilot from '../src/game/causal-pilot.json' with {type:'json'};
import fixtures from './fixtures/catalog-21-audit-saves.json' with {type:'json'};
const key='dear-mayor:save:v1',rules=pilot.filter(r=>r.introducedRevision===22);
const choices=[['approve',undefined],['reject',undefined],['defer',undefined],['written_reply',0],['written_reply',1],['written_reply',2]] as const;
test('post-V6 choir silence branch keeps Aman identity through refresh and a real decision',async({page})=>{
 let state=newGame();
 while(state.current!=='quietchoir/defer')state=decide(state,state.current,state.current==='quietchoir/start'?'defer':'approve');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(state)});await page.reload();
 await expect(page.locator('.letter-reading')).toContainText('我不想替他选');
 await page.getByRole('button',{name:'不批准',exact:true}).click();
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe('留夹没获准，阿满自己保存纸，安瑟不改他的记忆。');
 await page.reload();await expect(page.locator('.save-warning')).toHaveCount(0);
});
async function screenshot(page:import('@playwright/test').Page,name:string){
 if(process.env.POST_V6_SCREENSHOTS){mkdirSync(process.env.POST_V6_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.POST_V6_SCREENSHOTS,name+'.png'),fullPage:true});}
}
for(const rule of rules)for(let v=0;v<6;v++)test(`post-V6 exact six-way offline return ${rule.target}/${v}`,async({page,context})=>{
 let state=newGame();
 for(let n=0;n<1200&&state.current!==rule.target;n++){
  const [action,reply]=choices[state.current===rule.source?v:0];state=decide(state,state.current,action,reply);
 }
 expect(state.current).toBe(rule.target);const doc=currentDocument(state),raw=JSON.stringify(state);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw});await page.reload();
 for(let i=0;i<doc.body.length;i++)await expect(page.locator('.letter-reading p').nth(i+1)).toHaveText(doc.body[i]);
 await page.getByRole('button',{name:'批示回复',exact:true}).click();await page.keyboard.press('Escape');
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 await context.setOffline(true);await page.reload();
 await expect(page.locator('.letter-reading')).toContainText(rule.variants[v].draft);
 await page.setViewportSize({width:v%2?768:390,height:1024});
 await page.evaluate(()=>document.fonts.ready);
 expect(await page.locator('.paper-art').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
 await screenshot(page,`return-${rule.target.replace('/','-')}-${v}`);
 await page.getByRole('button',{name:'批示回复',exact:true}).click();await page.locator('[data-choice="2"]').click();
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe(doc.replies[2].result);
 await page.reload();await expect(page.locator('.save-warning')).toHaveCount(0);expect(errors).toEqual([]);
});
for(const fixture of fixtures)test(`post-V6 old full pending ${fixture.name}`,async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');const raw=JSON.stringify(fixture.state);
 await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw});await page.reload();
 await expect(page.locator('h1')).toHaveText(fixture.document.title);await expect(page.locator('.signature')).toHaveText(fixture.document.sender);
 for(let i=0;i<fixture.document.body.length;i++)await expect(page.locator('.letter-reading p').nth(i+1)).toHaveText(fixture.document.body[i]);
 await page.getByRole('button',{name:'批示回复',exact:true}).click();
 for(let i=0;i<3;i++)await expect(page.locator('[data-choice]').nth(i).locator('span').last()).toHaveText(fixture.document.replies[i].text);
 await page.keyboard.press('Escape');await page.reload();expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
 await page.getByRole('button',{name:'不批准',exact:true}).click();
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe(fixture.document.results.reject);
 await page.reload();await expect(page.locator('.save-warning')).toHaveCount(0);
});
const cursors=[];let cursor=newGame();
while(!cursor.current.startsWith('season/')){cursors.push(cursor);cursor=decide(cursor,cursor.current,'approve');}
const size=(s:typeof cursor)=>currentDocument(s).body.join('').length;
const short=cursors.reduce((a,b)=>size(a)<size(b)?a:b),long=cursors.reduce((a,b)=>size(a)>size(b)?a:b);
const yearly=cursors.find(s=>s.day>=181)!;
for(const viewport of [
 {width:320,height:740},{width:360,height:740},{width:390,height:844},{width:430,height:932},
 {width:720,height:1024},{width:721,height:1024},{width:768,height:1024},{width:820,height:1180},
 {width:1024,height:768},{width:1100,height:900},{width:1199,height:941},{width:1200,height:941},
 {width:1366,height:768},{width:1672,height:941},{width:1920,height:1080},{width:2560,height:1080},{width:1440,height:600},
])test(`post-V6 safe readable paper ${viewport.width}x${viewport.height}`,async({page})=>{
 await page.setViewportSize(viewport);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 for(const [name,state] of [['short',short],['long',long],['year',yearly]] as const){
  await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(state)});await page.reload();await page.evaluate(()=>document.fonts.ready);
  const g=await page.evaluate(()=>{
   const rect=(s:string)=>document.querySelector(s)!.getBoundingClientRect().toJSON();
   const r=document.querySelector('.letter-reading')!;const reading=rect('.letter-reading');
   const scene=document.querySelector('.scene')!;
   const scale=scene.getBoundingClientRect().width/parseFloat(getComputedStyle(scene).width);
   return {paper:rect('.paper-art'),date:rect('.letter-date'),title:rect('h1'),source:rect('.letter-source'),reading,signature:rect('.signature'),decisions:rect('.decisions'),font:parseFloat(getComputedStyle(r).fontSize)*scale,width:document.documentElement.scrollWidth,flow:matchMedia('(max-width: 1199px), (max-height: 679px)').matches};
  });
  expect(g.width).toBeLessThanOrEqual(viewport.width);expect(g.font).toBeGreaterThanOrEqual(17);
  expect(g.date.bottom).toBeLessThan(g.title.top);expect(g.title.bottom).toBeLessThanOrEqual(g.source.top);
  expect(g.source.bottom).toBeLessThan(g.reading.top);expect(g.reading.bottom).toBeLessThanOrEqual(g.signature.top+1);
  expect(g.signature.bottom).toBeLessThan(g.decisions.top);
  if(g.flow){
   // The decorated portrait paper's side ornaments extend 13% inward.
   for(const r of [g.date,g.title,g.source,g.reading,g.signature]){
    expect(r.left-g.paper.left).toBeGreaterThanOrEqual(g.paper.width*.13+8);
    expect(g.paper.right-r.right).toBeGreaterThanOrEqual(g.paper.width*.13+8);
   }
  }
  const reading=page.locator('.letter-reading');await reading.evaluate(e=>{e.scrollTop=e.scrollHeight;});
  const last=await page.locator('.letter-reading p').last().boundingBox();expect(last!.y+last!.height).toBeLessThanOrEqual(g.reading.bottom+2);
  for(const control of await page.locator('.decision').all()){const box=await control.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);expect(box!.width).toBeGreaterThanOrEqual(44);}
  await screenshot(page,`${viewport.width}x${viewport.height}-${name}`);
 }
 await page.getByRole('button',{name:'批示回复',exact:true}).click();await expect(page.locator('[data-choice="0"]')).toBeFocused();
 await page.keyboard.press('Shift+Tab');await expect(page.getByRole('button',{name:'暂且收笔'})).toBeFocused();
 await page.keyboard.press('Tab');await expect(page.locator('[data-choice="0"]')).toBeFocused();
 expect(await page.locator('[data-choice="0"]').evaluate(e=>getComputedStyle(e).outlineStyle)).not.toBe('none');
 await screenshot(page,`${viewport.width}x${viewport.height}-reply`);await page.keyboard.press('Escape');
 await expect(page.getByRole('button',{name:'批示回复',exact:true})).toBeFocused();
});
const invalid=['{broken','',JSON.stringify({...newGame(),version:999}),JSON.stringify({...newGame(),history:[{}]}),...[
 {action:'invalid'}, {action:'approve',reply:0}, {action:'written_reply',reply:3},
].map(p=>{const s=decide(newGame(),newGame().current,'approve');return JSON.stringify({...s,history:[{...s.history[0],...p}]});})];
for(const [index,raw] of invalid.entries())test(`post-V6 damaged save ${index}: denied recovery cancel/export/confirm`,async({page})=>{
 await page.addInitScript(({key,raw})=>{
  const setter=Storage.prototype.setItem;
  if(localStorage.getItem(key)===null)setter.call(localStorage,key,raw);
  Storage.prototype.setItem=function(k,v){if(k===key+':recovery')throw new DOMException('quota','QuotaExceededError');setter.call(this,k,v);};
 },{key,raw});
 await page.goto('./');const dialog=page.getByRole('dialog',{name:'先保留这份旧存档'});await expect(dialog).toBeVisible();
 if(index===0)await screenshot(page,'damaged-save-dialog');
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
 await page.getByRole('button',{name:'暂不开始'}).click();
 await page.getByRole('button',{name:'批准',exact:true}).click();await expect(dialog).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'导出原始存档'}).click();
 const download=await downloadPromise;expect(readFileSync((await download.path())!,'utf8')).toBe(raw);
 await page.keyboard.press('Escape');await page.reload();await expect(dialog).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
 await page.getByRole('button',{name:'舍弃旧档并重开'}).click();await expect(dialog).not.toBeVisible();
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.length,key)).toBe(0);
 await page.getByRole('button',{name:'不批准',exact:true}).click();await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.length,key)).toBe(1);
 await page.reload();await expect(page.locator('.save-warning')).toHaveCount(0);
});
test('post-V6 recovery success warning is accurate and cannot escape into reply focus loop',async({page})=>{
 await page.addInitScript(key=>localStorage.setItem(key,'{broken'),key);await page.goto('./');
 await expect(page.locator('.save-warning')).toContainText('原文已留在恢复副本');
 expect(await page.evaluate(key=>localStorage.getItem(key+':recovery'),key)).toBe('{broken');
 await page.getByRole('button',{name:'批示回复',exact:true}).click();
 expect(await page.locator('.save-warning').evaluate(e=>e.hasAttribute('inert'))).toBe(true);
 await screenshot(page,'warning-behind-reply');
 for(let i=0;i<8;i++){await page.keyboard.press('Tab');expect(await page.locator('.reply-note').evaluate(e=>e.contains(document.activeElement))).toBe(true);}
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'批准',exact:true}).click();
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.length,key)).toBe(1);
 expect(await page.evaluate(key=>localStorage.getItem(key+':recovery'),key)).toBe('{broken');
});
test('post-V6 restart write failure preserves the current season and primary bytes',async({page})=>{
 await page.goto('./');await page.getByRole('button',{name:'批准',exact:true}).click();
 await expect(page.locator('article')).not.toHaveAttribute('data-letter-id','bridge/start');
 const before=await page.evaluate(key=>localStorage.getItem(key),key),id=await page.locator('article').getAttribute('data-letter-id');
 await page.evaluate(key=>{const setter=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===key)throw Error('quota');setter.call(this,k,v);};},key);
 await page.getByRole('button',{name:'重启一季'}).click();await page.getByRole('button',{name:'确认重启'}).click();
 await expect(page.getByRole('dialog',{name:'另启一季？'})).toContainText('重启未能保存');
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(before);
 await page.getByRole('button',{name:'继续批阅'}).click();await expect(page.locator('article')).toHaveAttribute('data-letter-id',id!);
 await page.reload();await expect(page.locator('article')).toHaveAttribute('data-letter-id',id!);
});
test('post-V6 storage fully forbidden still reads and warns without falsely claiming a backup',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('denied','SecurityError');}}));
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('./');
 await expect(page.locator('article')).toHaveAttribute('data-letter-id','bridge/start');await expect(page.locator('.save-warning')).toContainText('不能保存');
 await page.getByRole('button',{name:'批准',exact:true}).click();await expect(page.locator('article')).not.toHaveAttribute('data-letter-id','bridge/start');
 await expect(page.locator('.save-warning')).toContainText('未能保存');expect(errors).toEqual([]);
});
test('post-V6 corrupt save under full quota refuses even explicit restart and keeps the dialog honest',async({page})=>{
 await page.addInitScript(key=>{
  Storage.prototype.setItem.call(localStorage,key,'{quota');
  Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError');};
 },key);
 await page.goto('./');await page.getByRole('button',{name:'舍弃旧档并重开'}).click();
 await expect(page.getByRole('dialog',{name:'先保留这份旧存档'})).toContainText('未能重开');
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe('{quota');
 await page.keyboard.press('Escape');await page.getByRole('button',{name:'搁置',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'先保留这份旧存档'})).toBeVisible();
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe('{quota');
});
test('post-V6 recovery discard cannot overwrite a primary save that changed while the dialog was open',async({page})=>{
 await page.addInitScript(key=>{
  const setter=Storage.prototype.setItem;setter.call(localStorage,key,'{old');
  Storage.prototype.setItem=function(k,v){if(k.endsWith(':recovery'))throw Error('denied');setter.call(this,k,v);};
 },key);
 await page.goto('./');await expect(page.getByRole('dialog',{name:'先保留这份旧存档'})).toBeVisible();
 const changed=JSON.stringify(newGame(37));await page.evaluate(({key,changed})=>localStorage.setItem(key,changed),{key,changed});
 await page.getByRole('button',{name:'舍弃旧档并重开'}).click();
 await expect(page.getByRole('dialog',{name:'先保留这份旧存档'})).toContainText('原存档已变化');
 expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(changed);
});
