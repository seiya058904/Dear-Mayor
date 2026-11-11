import {test,expect,type Page} from '@playwright/test';
const key='dear-mayor:save:v1';
async function savedDecisions(page:Page){
 const raw=await page.evaluate(k=>localStorage.getItem(k),key);
 // The first locked save may still be pending. Malformed saves must still fail.
 return raw===null?0:JSON.parse(raw).history.length;
}
test('two pages preserve the committed branch and allow explicit reload',async({context,page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 const other=await context.newPage();await other.goto('./');
 // Hold the real origin lock so the first click deterministically precedes its save.
 await other.evaluate(k=>new Promise<void>(ready=>{
  void navigator.locks.request(k,()=>new Promise<void>(release=>{
   (window as typeof window & {releaseSaveLock:()=>void}).releaseSaveLock=release;
   ready();
  }));
 }),key);
 for(let i=0;i<20;i++){
  await page.getByRole('button',{name:'批准',exact:true}).click();
  if(i===0){
   try{expect(await savedDecisions(page)).toBe(0);}
   finally{await other.evaluate(()=>(window as typeof window & {releaseSaveLock:()=>void}).releaseSaveLock());}
  }
  await expect.poll(()=>savedDecisions(page)).toBe(i+1);
  await expect(page.locator('.decisions')).toHaveAttribute('aria-busy','false');
 }
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await other.getByRole('button',{name:'不批准',exact:true}).click();
 await expect(other.getByRole('button',{name:'载入最新进度'})).toBeVisible();
 await expect(other.getByRole('button',{name:'批准',exact:true})).toBeDisabled();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await other.getByRole('button',{name:'载入最新进度'}).click();
 await other.getByRole('button',{name:'批准',exact:true}).click();
 await expect.poll(()=>savedDecisions(other)).toBe(21);
});
test('simultaneous pages serialize saves and reject one stale writer',async({context,page})=>{
 await page.goto('./');const other=await context.newPage();await other.goto('./');
 await Promise.all([page.getByRole('button',{name:'批准',exact:true}).click(),other.getByRole('button',{name:'不批准',exact:true}).click()]);
 await expect.poll(async()=>await page.getByText('另一页面已更新进度。',{exact:false}).count()+await other.getByText('另一页面已更新进度。',{exact:false}).count()).toBe(1);
 expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).history.length,key)).toBe(1);
});
