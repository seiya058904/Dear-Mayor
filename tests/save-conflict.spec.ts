import {test,expect} from '@playwright/test';
const key='dear-mayor:save:v1';
test('two pages preserve the committed branch and allow explicit reload',async({context,page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 const other=await context.newPage();await other.goto('./');
 for(let i=0;i<20;i++){
  await page.getByRole('button',{name:'批准',exact:true}).click();
  await expect.poll(()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).history.length,key)).toBe(i+1);
  await expect(page.locator('.decisions')).toHaveAttribute('aria-busy','false');
 }
 const before=await page.evaluate(k=>localStorage.getItem(k),key);
 await other.getByRole('button',{name:'不批准',exact:true}).click();
 await expect(other.getByRole('button',{name:'载入最新进度'})).toBeVisible();
 await expect(other.getByRole('button',{name:'批准',exact:true})).toBeDisabled();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(before);
 await other.getByRole('button',{name:'载入最新进度'}).click();
 await other.getByRole('button',{name:'批准',exact:true}).click();
 await expect.poll(()=>other.evaluate(k=>JSON.parse(localStorage.getItem(k)!).history.length,key)).toBe(21);
});
test('simultaneous pages serialize saves and reject one stale writer',async({context,page})=>{
 await page.goto('./');const other=await context.newPage();await other.goto('./');
 await Promise.all([page.getByRole('button',{name:'批准',exact:true}).click(),other.getByRole('button',{name:'不批准',exact:true}).click()]);
 await expect.poll(async()=>await page.getByText('另一页面已更新进度。',{exact:false}).count()+await other.getByText('另一页面已更新进度。',{exact:false}).count()).toBe(1);
 expect(await page.evaluate(k=>JSON.parse(localStorage.getItem(k)!).history.length,key)).toBe(1);
});
