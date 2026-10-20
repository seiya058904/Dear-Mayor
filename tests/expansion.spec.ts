import { currentDocument as currentV1 } from '../src/legacy/v1/game/engine';
import { currentDocument as currentV2 } from '../src/legacy/v2/game/engine';
import { currentDocument as currentV3 } from '../src/legacy/v3/game/engine';
import { test, expect } from '@playwright/test';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { currentDocument, newGame, decide } from '../src/game/engine';
import { documents } from '../src/content';
import type { Action, GameState } from '../src/game/types';
import fixtures from './fixtures/v1-saves.json' with { type: 'json' };
import v2Fixtures from './fixtures/v2-saves.json' with { type: 'json' };
import v3Fixtures from './fixtures/v3-saves.json' with { type: 'json' };
import catalogOne from './fixtures/catalog-1-saves.json' with { type: 'json' };
import catalogTwo from './fixtures/catalog-2-saves.json' with { type: 'json' };
import catalogThree from './fixtures/catalog-3-saves.json' with { type: 'json' };
import catalogFour from './fixtures/catalog-4-review-saves.json' with { type: 'json' };
import catalogSix from './fixtures/catalog-6-saves.json' with { type: 'json' };
import catalogSeven from './fixtures/catalog-7-review-saves.json' with { type: 'json' };
import catalogEight from './fixtures/catalog-8-saves.json' with { type: 'json' };
import catalogNine from './fixtures/catalog-9-saves.json' with { type: 'json' };
import catalogTen from './fixtures/catalog-10-saves.json' with { type: 'json' };
import catalogEleven from './fixtures/catalog-11-saves.json' with { type: 'json' };
import catalogTwelve from './fixtures/catalog-12-saves.json' with { type: 'json' };
import catalogThirteen from './fixtures/catalog-13-saves.json' with { type: 'json' };
import catalogFourteen from './fixtures/catalog-14-saves.json' with { type: 'json' };
import catalogFifteen from './fixtures/catalog-15-saves.json' with { type: 'json' };
import catalogSixteen from './fixtures/catalog-16-saves.json' with { type: 'json' };
import catalogSeventeen from './fixtures/catalog-17-saves.json' with { type: 'json' };
import {catalogAt,latestCatalogRevision} from '../src/game/catalog';
const key='dear-mayor:save:v1';
const evidence=process.env.QA_SCREENSHOTS;
async function capture(page: import('@playwright/test').Page,name:string) {
 if(evidence){mkdirSync(evidence,{recursive:true});await page.screenshot({path:path.join(evidence,name+'.png'),fullPage:true});}
}
const actions:Action[]=['approve','reject','defer','written_reply'];
test('old pending prose stays paired with old choices after a request or sender is rewritten',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const [revision,id] of [[16,'eleventh/smith-lantern-hook'],[16,'eleventh/weaver-dye-pot'],[17,'eleventh/laundry-rope-shadow'],[17,'eleventh/ledger-duplicate-mark']] as const){
  let old=newGame(10531,revision);
  while(old.current!==id){
   expect(old.current.startsWith('season/')).toBe(false);
   old=decide(old,old.current,'approve',undefined,revision);
  }
  const doc=currentDocument(old);const raw=JSON.stringify(old);
  await page.goto('./');
  await page.evaluate(({key,raw})=>{localStorage.clear();localStorage.setItem(key,raw);},{key,raw});
  await page.reload();
  await expect(page.locator('article')).toHaveAttribute('data-letter-id',id);
  await expect(page.locator('h1')).toHaveText(doc.title);
  await expect(page.locator('.signature')).toContainText(doc.sender);
  for(const text of doc.body)await expect(page.locator('.letter-reading')).toContainText(text);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();
  await expect(page.locator('[data-choice]').nth(2)).toContainText(doc.replies[2].text);
  await page.keyboard.press('Escape');await page.reload();
  for(const text of doc.body)await expect(page.locator('.letter-reading')).toContainText(text);
  expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();
  await page.locator('[data-choice]').nth(2).click();
  await expect(page.locator('article')).not.toHaveAttribute('data-letter-id',id);
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),key);
  expect(saved.catalogRevision).toBe(latestCatalogRevision);
  expect(saved.history.slice(0,old.history.length)).toEqual(old.history);
  expect(saved.history.at(-1).result).toBe(doc.replies[2].result);
  await page.reload();await expect(page.locator('article')).toHaveAttribute('data-letter-id',saved.current);
 }
});
const cursors:GameState[]=[];
for(const action of actions) for(const reply of action==='written_reply'?[0,1,2]:[0]) {
 let s=newGame(6271);
 while(!s.current.startsWith('season/')) {cursors.push(s);s=decide(s,s.current,action,reply);}
}
const length=(s:GameState)=>currentDocument(s).body.join('').length;
const shortest=cursors.reduce((a,b)=>length(a)<length(b)?a:b);
const longest=cursors.reduce((a,b)=>length(a)>length(b)?a:b);
const newBatchLongest=cursors.filter(s=>!catalogAt(12).letters[s.current]).reduce((a,b)=>length(a)>length(b)?a:b);
const newTownLetter=cursors.find(s=>s.current==='town/merchant-unloading-corner')!;

for(const viewport of [{width:1672,height:941},{width:1366,height:768},{width:390,height:844}]) {
 test(`actual shortest and longest letters remain inside paper, ${viewport.width}`,async({page})=>{
  await page.setViewportSize(viewport);
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [label,state] of [['shortest',shortest],['longest',longest],['batch11-longest',newBatchLongest],['existing-town',newTownLetter]] as const) {
   await page.goto('./');
   await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(state)});
   await page.reload();await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('article')).toHaveAttribute('data-letter-id',state.current);
   const doc=currentDocument(state);
   await expect(page.locator('h1')).toHaveText(doc.title);
   for(const text of doc.body) await expect(page.locator('.letter-reading')).toContainText(text);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   const reading=await page.locator('.letter-reading').boundingBox();
   const signature=await page.locator('.signature').boundingBox();
   expect(reading!.y+reading!.height).toBeLessThanOrEqual(signature!.y);
   if(label==='longest'){await page.locator('.letter-reading').evaluate(e=>{e.scrollTop=0;});await capture(page,`${viewport.width}-${label}-start`);}
   // Desktop long documents can scroll in the paper; the final paragraph must be reachable.
   await page.locator('.letter-reading').evaluate(e=>{e.scrollTop=e.scrollHeight;});
   const last=page.locator('.letter-reading p').last();
   const lastBox=await last.boundingBox();
   expect(lastBox!.y+lastBox!.height).toBeLessThanOrEqual(reading!.y+reading!.height+2);
   await capture(page,`${viewport.width}-${label}`);
   await page.getByRole('button',{name:'批示回复',exact:true}).click();
   await expect(page.getByRole('dialog',{name:'提笔批示'})).toBeVisible();
   await capture(page,`${viewport.width}-${label}-reply`);
   await page.keyboard.press('Escape');
  }
  const yearly=cursors.find(s=>s.current.startsWith('echo/clocklesson-year-'))!;
  await page.goto('./');
  await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(yearly)});
  await page.reload();await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.letter-date')).toContainText('第二年');
  const date=await page.locator('.letter-date').boundingBox();
  const heading=await page.locator('h1').boundingBox();
  expect(date!.y+date!.height).toBeLessThan(heading!.y);
  expect(date!.x).toBeGreaterThanOrEqual(0);
  expect(date!.x+date!.width).toBeLessThanOrEqual(viewport.width);
  await capture(page,`${viewport.width}-second-year`);
 });
}

test('sixteen real-format v1 fixtures migrate in the rendered app without recovery warnings',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./');
 for(const fixture of fixtures) {
  const raw=JSON.stringify(fixture.state);
  await page.evaluate(({key,raw})=>{localStorage.clear();localStorage.setItem(key,raw);},{key,raw});
  await page.reload();
  await expect(page.locator('article')).toHaveAttribute('data-letter-id',fixture.state.current);
  await expect(page.locator('.save-warning')).toHaveCount(0);
  const before=fixture.state.current;
  await page.getByRole('button',{name:'批准',exact:true}).click();
  await expect(page.locator('article')).not.toHaveAttribute('data-letter-id',before);
  const stored=await page.evaluate(key=>({state:JSON.parse(localStorage.getItem(key)!),backup:localStorage.getItem(key+':v1-backup')}),key);
  expect(stored.state.version).toBe(2);
  expect(stored.state.history.length).toBe(fixture.state.history.length+1);
  expect(stored.backup).toBe(raw);
 }
});

test('only the current letter narrates: no visible management values or instant outcome panel',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./');
 for(let i=0;i<24;i++) {
  await expect(page.locator('article')).toHaveCount(1);
  await expect(page.getByRole('progressbar')).toHaveCount(0);
  expect(await page.locator('body').innerText()).not.toMatch(/(?:民心|财政|资源|得分|经验|声望|完成进度)\s*[:：]?\s*\d/);
  await expect(page.locator('input,textarea,[contenteditable="true"]')).toHaveCount(0);
  await expect(page.locator('.save-warning,[role="status"]')).toHaveCount(0);
  const id=await page.locator('article').getAttribute('data-letter-id');
  await page.getByRole('button',{name:['批准','不批准','搁置'][i%3],exact:true}).click();
  await expect(page.locator('article')).not.toHaveAttribute('data-letter-id',id!);
 }
});

test('long save reacts under sixfold CPU throttling and remains offline-capable',async({page,context})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 let state=newGame(42);
 for(let i=0;i<1000;i++)state=decide(state,state.current,actions[i%4],i%3);
 await page.goto('./');
 await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(state)});
 const cdp=await context.newCDPSession(page);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:6});
 const start=Date.now();await page.reload();
 await expect(page.locator('article')).toHaveAttribute('data-letter-id',state.current);
 const reloadMs=Date.now()-start;
 console.log(`1000-decision reload, 6x CPU: ${reloadMs}ms (limit 5000ms)`);
 expect(reloadMs).toBeLessThan(5000);
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
 await page.reload();
 await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller))).toBe(true);
 await context.setOffline(true);
 await page.reload();
 await expect(page.locator('article')).toHaveAttribute('data-letter-id',state.current);
 await page.getByRole('button',{name:'搁置',exact:true}).click();
 await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.length,key)).toBe(1001);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
});


test('twenty v2 fixtures preserve active cursor and original bytes through the current UI',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./');
 for(const fixture of v2Fixtures) {
  const raw=JSON.stringify(fixture.state);
  await page.evaluate(({key,raw})=>{localStorage.clear();localStorage.setItem(key,raw);},{key,raw});
  await page.reload();
  await expect(page.locator('article')).toHaveAttribute('data-letter-id',fixture.state.current);
  await expect(page.locator('.save-warning')).toHaveCount(0);
  await page.getByRole('button',{name:'不批准',exact:true}).click();
  await expect(page.locator('article')).not.toHaveAttribute('data-letter-id',fixture.state.current);
  const stored=await page.evaluate(key=>({state:JSON.parse(localStorage.getItem(key)!),backup:localStorage.getItem(key+':v2-backup')}),key);
  expect(stored.state.contentVersion).toBe(4);
  expect(stored.state.v2Length).toBe(fixture.state.history.length);
  expect(stored.state.history.slice(0,fixture.state.history.length)).toEqual(fixture.state.history);
  expect(stored.backup).toBe(raw);
 }
});

test('nineteen v3 fixtures preserve history and raw backup in the current UI',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 for(const fixture of v3Fixtures){
  const raw=JSON.stringify(fixture.state);
  await page.evaluate(({key,raw})=>{localStorage.clear();localStorage.setItem(key,raw);},{key,raw});
  await page.reload();
  await expect(page.locator('article')).toHaveAttribute('data-letter-id',fixture.state.current);
  await expect(page.locator('.save-warning')).toHaveCount(0);
  await page.getByRole('button',{name:'搁置',exact:true}).click();
  await expect(page.locator('article')).not.toHaveAttribute('data-letter-id',fixture.state.current);
  const stored=await page.evaluate(key=>({state:JSON.parse(localStorage.getItem(key)!),backup:localStorage.getItem(key+':v3-backup')}),key);
  expect(stored.state.history.slice(0,fixture.state.history.length)).toEqual(fixture.state.history);
  expect(stored.backup).toBe(raw);
 }
});

for(const [revision,catalogFixtures] of [[1,catalogOne],[2,catalogTwo],[3,catalogThree],[4,catalogFour],[6,catalogSix],[7,catalogSeven],[8,catalogEight],[9,catalogNine],[10,catalogTen],[11,catalogEleven],[12,catalogTwelve],[13,catalogThirteen],[14,catalogFourteen],[15,catalogFifteen],[16,catalogSixteen],[17,catalogSeventeen]] as const)
test(`catalog ${revision}: ${catalogFixtures.length} saves upgrade after a real decision, keeping the visible letter`,async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 for(const fixture of catalogFixtures){
  const raw=JSON.stringify(fixture.state);
  await page.evaluate(({key,raw})=>{localStorage.clear();localStorage.setItem(key,raw);},{key,raw});
  await page.reload();
  await expect(page.locator('article')).toHaveAttribute('data-letter-id',fixture.state.current);
  await expect(page.locator('.save-warning')).toHaveCount(0);
  expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
  await page.getByRole('button',{name:'批准',exact:true}).click();
  await expect(page.locator('article')).not.toHaveAttribute('data-letter-id',fixture.state.current);
  const stored=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),key);
  expect(stored.catalogRevision).toBe(latestCatalogRevision);
  expect(stored.history.slice(0,fixture.state.history.length)).toEqual(fixture.state.history);
  await page.reload();
  await expect(page.locator('article')).toHaveAttribute('data-letter-id',stored.current);
 }
});

test('v1 v2 v3 pending letters keep original prose and reply choices across cancel, reload and selection',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const version of [1,2,3] as const){
  const cases=version===1?fixtures:version===2?v2Fixtures:v3Fixtures;
  const fixture=cases.find(f=>f.state.history.length===0)??cases[0];
  const expected=version===1?currentV1(fixture.state as unknown as Parameters<typeof currentV1>[0]):version===2?currentV2(fixture.state as unknown as Parameters<typeof currentV2>[0]):currentV3(fixture.state as unknown as Parameters<typeof currentV3>[0]);
  const raw=JSON.stringify(fixture.state);
  await page.goto('./');await page.evaluate(({key,raw})=>{localStorage.clear();localStorage.setItem(key,raw);},{key,raw});
  await page.reload();
  for(const text of expected.body)await expect(page.locator('.letter-reading')).toContainText(text);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();
  for(let i=0;i<expected.replies.length;i++)await expect(page.locator('[data-choice]').nth(i)).toContainText(expected.replies[i].text);
  await page.keyboard.press('Escape');await page.reload();
  for(const text of expected.body)await expect(page.locator('.letter-reading')).toContainText(text);
  expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();await page.locator('[data-choice]').nth(2).click();
  await expect(page.locator('article')).not.toHaveAttribute('data-letter-id',fixture.state.current);
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),key);
  expect(saved.history.at(-1).result).toBe(expected.replies[2].result);
  expect(saved.history.slice(0,fixture.state.history.length)).toEqual(fixture.state.history);
  await page.reload();await expect(page.locator('article')).toHaveAttribute('data-letter-id',saved.current);
 }
});
