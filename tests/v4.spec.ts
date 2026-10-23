import {test,expect} from '@playwright/test';
import path from 'node:path';
import fixtures from './fixtures/catalog-18-review-saves.json' with {type:'json'};
import {newGame,decide} from '../src/game/engine';
import {documents} from '../src/content';
const key='dear-mayor:save:v1';

for(const fixture of fixtures)test(`v4 catalog18 pending retains original sender prose and A B C after cancel and reload: ${fixture.name}`,async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
  const raw=JSON.stringify(fixture.state);
  await page.evaluate(({key,raw})=>{localStorage.clear();localStorage.setItem(key,raw)},{key,raw});await page.reload();
  await expect(page.locator('article')).toHaveAttribute('data-letter-id',fixture.name);
  await expect(page.locator('h1')).toHaveText(fixture.document.title);
  for(const text of fixture.document.body)await expect(page.locator('.letter-reading')).toContainText(text);
  await expect(page.locator('article')).toContainText(fixture.document.sender);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();
  for(let i=0;i<3;i++)await expect(page.locator('[data-choice]').nth(i)).toContainText(fixture.document.replies[i].text);
  await page.getByRole('button',{name:'暂且收笔'}).click();await page.reload();
  expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();await page.locator('[data-choice]').nth(2).click();
  await expect.poll(()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.length,key)).toBe(fixture.state.history.length+1);
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).history.at(-1).result,key)).toBe(fixture.document.replies[2].result);
});

for(const viewport of [{width:1672,height:941},{width:1366,height:768},{width:390,height:844}])test(`v4 new prose and lossless paper readable ${viewport.width}`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.setViewportSize(viewport);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 for(const id of ['nightbloom/defer','teanewcomer/continuation','eleventh/inn-key-tag']){
  let s=newGame(10531);while(s.current!==id){if(s.current.startsWith('season/'))throw new Error(`unreachable ${id}`);s=decide(s,s.current,'defer');}
  await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(s)});await page.reload();
  await expect(page.locator('h1')).toHaveText(documents[id].title);await page.evaluate(()=>document.fonts.ready);
  for(const text of documents[id].body)await expect(page.locator('.letter-reading')).toContainText(text);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.locator('.letter-reading').evaluate(e=>e.scrollHeight<=e.clientHeight+2)).toBe(true);
  await page.locator('.paper-art').evaluate((image:HTMLImageElement)=>image.decode());
  expect(await page.locator('.paper-art').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0&&e.currentSrc.endsWith('.webp'))).toBe(true);
  if(process.env.QA_SCREENSHOTS)await page.screenshot({path:path.join(process.env.QA_SCREENSHOTS,`v4-${id.replaceAll('/','-')}-${viewport.width}.png`),fullPage:true});
  await page.getByRole('button',{name:'批示回复',exact:true}).click();await expect(page.locator('[data-choice]')).toHaveCount(3);await page.keyboard.press('Escape');
 }
 expect(errors).toEqual([]);
});

test('v4 offline cache contains runtime WebP and font without duplicate reference PNGs',async({page,context})=>{
 await page.goto('./');await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.reload();
 await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
 const urls=await page.evaluate(async()=>{const keys=await caches.keys();return (await Promise.all(keys.filter(k=>k.startsWith('dear-mayor-')).map(async k=>(await(await caches.open(k)).keys()).map(r=>r.url)))).flat()});
 for(const name of ['background','note','paper','paper-mobile','approve','reject','defer','written_reply']){
  expect(urls.some(u=>u.endsWith(`/art/${name}.webp`))).toBe(true);expect(urls.some(u=>u.endsWith(`/art/${name}.png`))).toBe(false);
 }
 expect(urls.some(u=>u.endsWith('/fonts/wenkai-game.woff2'))).toBe(true);
 expect(urls.some(u=>u.endsWith('/fonts/wenkai.woff2'))).toBe(false);
 await context.setOffline(true);await page.reload();await page.getByRole('button',{name:'批示回复',exact:true}).click();await expect(page.locator('[data-choice="0"]')).toBeVisible();
});
