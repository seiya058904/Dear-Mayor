import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {createServer,request} from 'node:http';
import {mkdtempSync,writeFileSync,unlinkSync,rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

test('production server rejects malformed URLs without interrupting root or Pages requests',async()=>{
 const root=mkdtempSync(join(tmpdir(),'dear-mayor-http-'));
 writeFileSync(join(root,'index.html'),'<!doctype html><title>isolated production fixture</title>');
 writeFileSync(join(root,'中文.txt'),'encoded asset');
 const lease=createServer();lease.listen(0,'127.0.0.1');await once(lease,'listening');
 const port=(lease.address() as {port:number}).port;await new Promise<void>(done=>lease.close(()=>done()));
 const child=spawn(process.execPath,[resolve('scripts/serve-production.mjs')],{
  env:{...process.env,DIST_DIR:root,PORT:String(port)},stdio:['ignore','pipe','pipe'],
 });
 let errors='';child.stderr.on('data',data=>{errors+=data;});
 const exited=once(child,'exit');
 const get=(path:string)=>new Promise<{status:number;body:string}>((done,reject)=>{
  const req=request({host:'127.0.0.1',port,path},res=>{
   let body='';res.setEncoding('utf8');res.on('data',data=>{body+=data;});
   res.on('end',()=>done({status:res.statusCode!,body}));res.on('error',reject);
  });
  req.setTimeout(3000,()=>req.destroy(new Error('HTTP response timed out')));
  req.on('error',reject);req.end();
 });
 try{
  await Promise.race([once(child.stdout,'data'),exited.then(()=>{throw new Error(errors||'Server exited before readiness');})]);
  for(const path of ['/%','/%E0%A4%A','//[']){
   assert.equal((await get(path)).status,400,path);
   for(const page of ['/','/Dear-Mayor/']){
    const response=await get(page);assert.equal(response.status,200);assert.match(response.body,/isolated production fixture/);
   }
  }
  for(const prefix of ['/','/Dear-Mayor/']){
   assert.equal((await get(prefix+encodeURIComponent('中文.txt'))).body,'encoded asset');
   assert.equal((await get(prefix+'missing.txt')).status,404);
   assert.equal((await get(prefix+'..%2Fprivate.txt')).status,403);
  }
  assert.equal(child.exitCode,null);assert.equal(errors,'');
 }finally{
  if(child.exitCode===null){child.kill();await exited;}
  for(const name of ['index.html','中文.txt'])unlinkSync(join(root,name));rmdirSync(root);
 }
});
