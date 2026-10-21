import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import path from 'node:path';
import {currentDocument,decide,newGame} from '../src/game/engine';
import pilot from '../src/game/causal-pilot.json' with {type:'json'};
import v5 from './fixtures/catalog-20-saves.json' with {type:'json'};

const key='dear-mayor:save:v1';
const rules=pilot.filter(r=>r.introducedRevision===21);
function reach(rule:typeof pilot[number],index:number){
  let state=newGame(6271,21);const variant=rule.variants[index];
  while(state.current!==rule.target){
    const action=state.current===rule.source?variant.action:'approve';
    state=decide(state,state.current,action as 'approve'|'reject'|'defer'|'written_reply',action==='written_reply'?variant.reply!:undefined,21);
  }
  return state;
}
for(const rule of rules)for(let index=0;index<6;index++)test(`V6 offline exact prose ${rule.target} variant ${index}`,async({page,context})=>{
  const state=reach(rule,index),doc=currentDocument(state),errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./');
  await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(state)});
  await page.reload();
  await expect(page.locator('.letter-reading p').nth(1)).toHaveText(doc.body[0]);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();
  await page.keyboard.press('Escape');
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(JSON.stringify(state));
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  await page.reload();
  await expect.poll(()=>page.evaluate(()=>!!navigator.serviceWorker.controller)).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.letter-reading p').nth(1)).toHaveText(doc.body[0]);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();
  await page.locator('[data-choice="2"]').click();
  await expect.poll(()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).history.at(-1).result,key)).toBe(doc.replies[2].result);
  await page.reload();
  await expect(page.locator('.save-warning')).toHaveCount(0);
  expect(errors).toEqual([]);
});

for(const fixture of v5)test(`V6 preserves V5 pending bytes ${fixture.name}`,async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./');
  const raw=JSON.stringify(fixture.state);
  await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw});
  await page.reload();
  await expect(page.locator('.letter-reading p').nth(1)).toHaveText(fixture.document.body[0]);
  await expect(page.locator('.signature')).toHaveText(fixture.document.sender);
  await page.getByRole('button',{name:'批示回复',exact:true}).click();
  for(let i=0;i<3;i++)await expect(page.locator('[data-choice]').nth(i).locator('span').last()).toHaveText(fixture.document.replies[i].text);
  await page.keyboard.press('Escape');await page.reload();
  await expect(page.locator('.letter-reading p').nth(1)).toHaveText(fixture.document.body[0]);
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(raw);
  await page.getByRole('button',{name:'不批准',exact:true}).click();
  await expect.poll(()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).history.at(-1).result,key)).toBe(fixture.document.results.reject);
  await page.reload();await expect(page.locator('.save-warning')).toHaveCount(0);
});

for(const viewport of [{width:1672,height:941},{width:1366,height:768},{width:390,height:844}])
for(const [chain,index] of [['bluewash',0],['readaloud',1],['bluewash',5]] as const)
test(`V6 reading ${chain}/${index} ${viewport.width}x${viewport.height}`,async({page})=>{
  const rule=rules.find(r=>r.target===chain+'/finale')!,state=reach(rule,index);
  await page.setViewportSize(viewport);await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./');await page.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw:JSON.stringify(state)});await page.reload();
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.letter-reading p').nth(1)).toHaveText(currentDocument(state).body[0]);
  const geometry=await page.evaluate(()=>{
    const reading=document.querySelector('.letter-reading')!,sign=document.querySelector('.signature')!,buttons=document.querySelector('.decisions')!;
    return {scroll:reading.scrollHeight,height:reading.clientHeight,reading:reading.getBoundingClientRect().toJSON(),sign:sign.getBoundingClientRect().toJSON(),buttons:buttons.getBoundingClientRect().toJSON(),width:document.documentElement.scrollWidth};
  });
  expect(geometry.width).toBeLessThanOrEqual(viewport.width);
  expect(geometry.scroll).toBeLessThanOrEqual(geometry.height+1);
  expect(geometry.reading.bottom).toBeLessThanOrEqual(geometry.sign.top+2);
  expect(geometry.sign.bottom).toBeLessThan(geometry.buttons.top);
  if(process.env.V6_SCREENSHOTS){mkdirSync(process.env.V6_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.V6_SCREENSHOTS,`${chain}-${index}-${viewport.width}.png`),fullPage:true});}
});
