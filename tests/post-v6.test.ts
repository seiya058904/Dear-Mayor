import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,unlinkSync,rmdirSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {documents,chains} from '../src/content';
import {newGame,decide,currentDocument,eligibleDay} from '../src/game/engine';
import {restore,loadGame,saveGame,SAVE_KEY,type StorageLike} from '../src/game/persistence';
import {catalogAt,latestCatalogRevision} from '../src/game/catalog';
import {withCausalPilot} from '../src/game/causal-pilot';
import pilot from '../src/game/causal-pilot.json' with {type:'json'};
import fixtures from './fixtures/catalog-21-audit-saves.json' with {type:'json'};
import oldStreams from './fixtures/catalog-1-21-render-streams.json' with {type:'json'};
import editorial22 from './fixtures/catalog-22-editorial-saves.json' with {type:'json'};
import type {Action,GameState} from '../src/game/types';
import {impactReport} from '../scripts/content-impact';

const choices=[['approve',undefined],['reject',undefined],['defer',undefined],['written_reply',0],['written_reply',1],['written_reply',2]] as const;
test('catalog23 editorial keeps every catalog22 stream and the 18 pre-edit pending documents',()=>{
 assert.equal(createHash('sha256').update(readFileSync('tests/fixtures/catalog-22-editorial-saves.json')).digest('hex'),readFileSync('tests/fixtures/catalog-22-editorial-saves.sha256','utf8').trim());
 assert.equal(editorial22.pending.length,18);
 for(const row of editorial22.streams){
  let state=newGame(6271,22),hash=createHash('sha256'),count=0;
  while(!state.current.startsWith('season/')){
   assert.ok(count++<1160);hash.update(JSON.stringify(currentDocument(state))+'\n');
   const [action,reply]=choices[row.variant];state=decide(state,state.current,action,reply,22);
  }
  assert.equal(count,row.count);assert.equal(hash.digest('hex'),row.documentsSHA256);
  assert.equal(createHash('sha256').update(JSON.stringify(state)).digest('hex'),row.stateSHA256);
 }
 for(const fixture of editorial22.pending){
  const state=restore(JSON.stringify(fixture.state));assert.deepEqual(currentDocument(state),fixture.document,fixture.name);
  for(const [action,reply] of choices){
   const next=decide(state,state.current,action,reply);
   assert.equal(next.catalogRevision,latestCatalogRevision);
   assert.equal(next.history.at(-1)!.result,action==='written_reply'?fixture.document.replies[reply!].result:fixture.document.results[action]);
   assert.deepEqual(restore(JSON.stringify(next)),next);
  }
 }
});
test('catalog23 duet remembers six real choices; old starts and ambiguous histories keep the static letter',()=>{
 const rule=pilot.find(r=>r.introducedRevision===23)!;
 assert.equal(rule.source,'duettempo/continuation');assert.equal(rule.variants.length,6);
 for(let v=0;v<6;v++)for(const seed of [0,37,6271,10531]){
  const state=reach(rule.target,rule.source,v,seed,23),doc=currentDocument(state),variant=rule.variants[v];
  const source=state.history.find(h=>h.id===rule.source)!;
  assert.equal(source.result,variant.sourceResult);assert.equal(source.action,variant.action);assert.equal(source.reply??null,variant.reply);
  assert.ok(doc.body[0].includes(variant.draft));
  for(const other of rule.variants.filter(x=>x!==variant))assert.ok(!doc.body[0].includes(other.draft));
  assert.deepEqual(currentDocument(restore(JSON.stringify(state))),doc);
  const base=documents[rule.target];
  for(const patch of [{initialCatalogRevision:22},{catalogRevision:22},{history:state.history.filter(h=>h.id!==rule.source)},{history:[...state.history,source]},{history:state.history.map(h=>h.id===rule.source?{...h,result:'untrusted'}:h)}])assert.deepEqual(withCausalPilot({...state,...patch},base),base);
  for(const [action,reply] of choices){const next=decide(state,state.current,action,reply);assert.deepEqual(restore(JSON.stringify(next)),next);}
 }
 const mixed=reach(rule.source,rule.source,0,6271,22);
 let next=decide(mixed,mixed.current,'approve');
 while(next.current!==rule.target)next=decide(next,next.current,'approve');
 assert.deepEqual(currentDocument(next).body,documents[rule.target].body);
 assert.deepEqual(currentDocument(restore(JSON.stringify(next))),currentDocument(next));
 assert.equal(documents['eleventh/school-quiet-bell'].replies[0].text,'请埃芙在钟前等候，另记真实时辰。');
 assert.equal(catalogAt(22).letters['eleventh/school-quiet-bell'].replies[0].text,'由我在钟前等候，另记真实时辰。');
});
test('every catalog1-21 full six-policy run preserves 81,168 baseline pending documents and exhausted states',()=>{
 assert.equal(createHash('sha256').update(readFileSync('tests/fixtures/catalog-1-21-render-streams.json')).digest('hex'),readFileSync('tests/fixtures/catalog-1-21-render-streams.sha256','utf8').trim());
 assert.equal(oldStreams.rows.length,126);
 for(const row of oldStreams.rows){
  let state=newGame(row.seed,row.revision),render=createHash('sha256'),count=0;
  while(!state.current.startsWith('season/')){
   assert.ok(count++<1160);render.update(JSON.stringify(currentDocument(state))+'\n');
   const [action,reply]=choices[row.variant];state=decide(state,state.current,action,reply,row.revision);
  }
  assert.equal(count,row.authored);
  assert.equal(render.digest('hex'),row.documentStreamSHA256,`catalog${row.revision}/policy${row.variant}: full pending stream`);
  assert.equal(createHash('sha256').update(JSON.stringify(state)).digest('hex'),row.finalStateSHA256);
  assert.deepEqual(restore(JSON.stringify(state)),state);
 }
});
test('identical app resources from different commits have distinct offline/build-info identities',()=>{
 const buildScript=resolve('scripts/build-sw.mjs'),roots:string[]=[],versions:string[]=[];
 const names=['background','note','paper','paper-mobile','approve','reject','defer','written_reply'];
 try{
  for(const commit of ['a'.repeat(40),'b'.repeat(40)]){
   const root=mkdtempSync(join(tmpdir(),'dear-mayor-sw-contract-'));roots.push(root);mkdirSync(join(root,'dist','art'),{recursive:true});
   mkdirSync(join(root,'dist','fonts'));
   for(const name of ['wenkai.woff2','wenkai-game.woff2'])writeFileSync(join(root,'dist','fonts',name),'same synthetic font');
   writeFileSync(join(root,'dist','index.html'),'<!doctype html><title>Same assets</title>');
   for(const name of names)writeFileSync(join(root,'dist','art',name+'.webp'),'same synthetic resource');
   execFileSync(process.execPath,[buildScript],{cwd:root,env:{...process.env,GITHUB_SHA:commit}});
   const info=JSON.parse(readFileSync(join(root,'dist','build-info.json'),'utf8'));versions.push(info.version);assert.equal(info.commit,commit);
   const worker=readFileSync(join(root,'dist','sw.js'),'utf8');assert.ok(worker.includes('dear-mayor-'+info.version));
   const manifest=JSON.parse(worker.match(/const FILES = (.*);/)![1]);
   assert.ok(manifest.some((f:{url:string})=>f.url==='./fonts/wenkai-game.woff2'));
   assert.ok(!manifest.some((f:{url:string})=>f.url==='./fonts/wenkai.woff2'));
   assert.equal(manifest.find((f:{url:string})=>f.url==='./build-info.json').integrity,'sha256-'+createHash('sha256').update(readFileSync(join(root,'dist','build-info.json'))).digest('base64'));
  }
  assert.notEqual(versions[0],versions[1]);
 }finally{
  // Remove only this test's exact named files, then its now-empty directories.
  for(const root of roots){
   for(const name of [...names.map(n=>'art/'+n+'.webp'),'fonts/wenkai.woff2','fonts/wenkai-game.woff2','index.html','sw.js','build-info.json']){
    const file=join(root,'dist',name);if(existsSync(file))unlinkSync(file);
   }
   for(const dir of ['art','fonts',''])rmdirSync(join(root,'dist',dir));rmdirSync(root);
  }
 }
});
const rules=pilot.filter(r=>r.introducedRevision===22);
test('Aman pronouns are consistent in the choir silence branch without changing Oda references',()=>{
 assert.match(documents['quietchoir/defer'].body.join(''),/不想替他选/);
 assert.match(documents['quietchoir/defer'].results.reject,/不改他的记忆/);
 assert.match(documents['town/borrow-name-for-song'].body.join(''),/欧妲，听着顺口；她说/);
 assert.match(catalogAt(21).letters['quietchoir/defer'].body!.join(''),/不想替她选/);
 assert.match(catalogAt(21).letters['quietchoir/defer'].results.reject,/不改她的记忆/);
});
function reach(target:string,source:string,variant:number,seed=6271,revision=22){
 let state=newGame(seed,revision);
 for(let i=0;i<1200&&state.current!==target;i++){
  const [action,reply]=state.current===source?choices[variant]:choices[0];
  state=decide(state,state.current,action,reply,revision);
 }
 assert.equal(state.current,target);return state;
}
test('catalog22 adds four exact six-way echoes without changing any V5/V6 rule or count',()=>{
 assert.equal(rules.length,4);assert.equal(rules.flatMap(r=>r.variants).length,24);
 assert.equal(Object.keys(documents).length,1160);assert.equal(chains.length,82);
 for(const rule of rules){
  assert.equal(rule.introducedRevision,22);
  assert.equal(documents[rule.target].body[0].split(rule.anchor).length,2);
  assert.equal(new Set(rule.variants.map(v=>v.draft)).size,6);
  for(let v=0;v<6;v++){
   const [action,reply]=choices[v];assert.equal(rule.variants[v].action,action);assert.equal(rule.variants[v].reply,reply??null);
   const source=documents[rule.source];assert.equal(rule.variants[v].sourceResult,action==='written_reply'?source.replies[reply!].result:source.results[action]);
  }
 }
});
test('impact analysis separates a shared reply branch from exact reply-index visibility and verifies real rendered echoes',()=>{
 const before=impactReport(21),after=impactReport(22);
 assert.equal(before.runtimeEvidence.length,24);assert.equal(after.runtimeEvidence.length,48);
 assert.equal(after.summary.visibleSourceNodes-before.summary.visibleSourceNodes,4);
 assert.equal(after.summary.replyIndexVisibleSources-before.summary.replyIndexVisibleSources,4);
 const source=after.rows.find(r=>r.id==='lastloom/start')!;
 assert.equal(source.distinctFutureChoiceSignatures,4);
 for(const choice of source.choices.filter(c=>c.action==='written_reply')){assert.equal(choice.classification,'VISIBLE');assert.equal(choice.replyIndexAffectsFuture,false);}
 const standalone=after.rows.find(r=>r.id==='town/goose-feather-quill')!;
 assert.equal(standalone.distinctFutureChoiceSignatures,6);
 assert.ok(standalone.choices.every(c=>c.text.length===1&&c.sourceResultReadByRenderer));
});
for(const rule of rules)for(let v=0;v<6;v++)test(`catalog22 ${rule.source} ${v}: real route, delay, isolated text, restore, next result`,()=>{
 for(const seed of [0,1,37,6271,10531]){
  const state=reach(rule.target,rule.source,v,seed),variant=rule.variants[v];
  const source=state.history.find(h=>h.id===rule.source)!;
  assert.equal(source.action,variant.action);assert.equal(source.reply??null,variant.reply);assert.equal(source.result,variant.sourceResult);
  const gate=documents[rule.target].requires;
  if(gate){assert.ok(state.day>=source.day+gate.days);assert.equal(eligibleDay(rule.target,{...state,history:state.history.filter(h=>h.id!==rule.source)}),Infinity);}
  const doc=currentDocument(state),expected=documents[rule.target];
  assert.deepEqual(doc.body,[expected.body[0].replace(rule.anchor,rule.anchor+variant.draft),...expected.body.slice(1)]);
  for(const other of rule.variants.filter((_,i)=>i!==v))assert.ok(!doc.body.join('').includes(other.draft));
  assert.deepEqual(currentDocument(restore(JSON.stringify(state))),doc);
  for(const [action,reply] of choices){
   const next=decide(state,state.current,action,reply);
   assert.equal(next.history.at(-1)!.result,action==='written_reply'?doc.replies[reply!].result:doc.results[action]);
   assert.deepEqual(restore(JSON.stringify(next)),next);
  }
 }
});
for(const rule of rules)test(`catalog22 ${rule.target}: mixed/old/missing/duplicate/corrupt sources and anchors safely keep original`,()=>{
 const state=reach(rule.target,rule.source,0),doc=documents[rule.target],index=state.history.findIndex(h=>h.id===rule.source);
 for(const patch of [{initialCatalogRevision:21},{catalogRevision:21},{initialCatalogRevision:999},{initialCatalogRevision:22.1},{migrationVersion:3 as const}])
  assert.deepEqual(withCausalPilot({...state,...patch},doc),doc);
 for(const patch of [{nextCatalogRevision:21},{nextCatalogRevision:undefined},{nextCatalogRevision:999},{nextCatalogRevision:22.1},{action:'reject' as Action},{reply:0},{result:'bad'}]){
  const history=state.history.map((h,i)=>i===index?{...h,...patch}:h);assert.deepEqual(withCausalPilot({...state,history},doc),doc);
 }
 for(const history of [state.history.filter((_,i)=>i!==index),[...state.history,state.history[index]]])assert.deepEqual(withCausalPilot({...state,history},doc),doc);
 for(const body of [[],[doc.body[0].replace(rule.anchor,'')],[doc.body[0]+rule.anchor]]){const broken={...doc,body};assert.deepEqual(withCausalPilot(state,broken),broken);}
 if(doc.requires){const h=state.history[index];assert.deepEqual(withCausalPilot({...state,day:h.day+doc.requires.days-1},doc),doc);}
 // Start/source=21, then a real choice upgrades to22: future new prose stays off.
 let old=newGame(6271,21);
 while(old.current!==rule.source)old=decide(old,old.current,'approve',undefined,21);
 old=decide(old,old.current,'approve',undefined,21);
 while(old.current!==rule.target&&!old.current.startsWith('season/'))old=decide(old,old.current,'approve');
 if(old.current===rule.target){assert.deepEqual(currentDocument(old).body,catalogAt(21).letters[rule.target].body??doc.body);assert.deepEqual(currentDocument(restore(JSON.stringify(old))),currentDocument(old));}
});
test('catalog21 full fixtures were captured before edits and retain every visible field and all six outcomes',()=>{
 assert.equal(createHash('sha256').update(readFileSync('tests/fixtures/catalog-21-audit-saves.json')).digest('hex'),readFileSync('tests/fixtures/catalog-21-audit-saves.sha256','utf8').trim());
 assert.equal(fixtures.length,54);
 for(const fixture of fixtures){
  const state=restore(JSON.stringify(fixture.state));assert.deepEqual(currentDocument(state),fixture.document,fixture.name);
  assert.deepEqual(currentDocument(restore(JSON.stringify(state))),fixture.document);
  for(const [action,reply] of choices){const next=decide(state,state.current,action,reply);assert.equal(next.catalogRevision,latestCatalogRevision);assert.equal(next.history.at(-1)!.result,action==='written_reply'?fixture.document.replies[reply!].result:fixture.document.results[action]);assert.deepEqual(restore(JSON.stringify(next)),next);}
 }
});
test('20 seeds ×1000 mixed decisions: 860 authored, six choices, no sibling/repeat/stall, pending drained and checkpoints replay',()=>{
 for(let seed=0;seed<20;seed++){
  let state=newGame(seed);const seen=new Set<string>();
  for(let n=0;n<1000;n++){
   assert.ok(!seen.has(state.current));seen.add(state.current);
   if(documents[state.current]?.requires)assert.ok(eligibleDay(state.current,state)<=state.day);
   const [action,reply]=choices[(seed+n*7)%6];state=decide(state,state.current,action,reply);
   if(n%250===249)assert.deepEqual(restore(JSON.stringify(state)),state);
  }
  assert.equal(state.history.filter(h=>documents[h.id]).length,860);assert.equal(state.pending.length,0);
  for(const chain of chains)assert.equal(state.history.filter(h=>h.id.startsWith(chain.id+'/')).length,4);
 }
});
function memory(raw:string|null,fail:(key:string)=>boolean=()=>false){
 const data=new Map<string,string>(raw===null?[]:[[SAVE_KEY,raw]]),writes:string[]=[];
 const storage:StorageLike={getItem:k=>data.get(k)??null,setItem:(k,v)=>{writes.push(k);if(fail(k))throw Error('quota/denied');data.set(k,v);},removeItem:k=>{data.delete(k);}};
 return {data,storage,writes};
}
const badSaves=['{broken','',JSON.stringify({...newGame(),version:999}),JSON.stringify({...newGame(),history:[{}]}),...[
 {action:'invalid'}, {action:'approve',reply:0}, {action:'written_reply',reply:3}, {action:'written_reply',reply:1.5},
].map(p=>{let s=decide(newGame(),newGame().current,'approve');return JSON.stringify({...s,history:[{...s.history[0],...p}]});})];
for(const [i,raw] of badSaves.entries())test(`damaged save ${i}: recovery denial cannot replace primary; explicit discard is byte-guarded`,()=>{
 const {data,storage,writes}=memory(raw,k=>k.endsWith(':recovery'));
 const loaded=loadGame(storage);assert.equal(loaded.recovery?.backedUp,false);assert.match(loaded.warning,/未能写入/);assert.equal(data.get(SAVE_KEY),raw);
 assert.equal(saveGame(storage,newGame()),false);assert.equal(data.get(SAVE_KEY),raw);assert.ok(!writes.includes(SAVE_KEY));
 assert.equal(saveGame(storage,newGame(),raw+'different'),false);assert.equal(data.get(SAVE_KEY),raw);
 assert.equal(saveGame(storage,newGame(),raw),true);assert.deepEqual(restore(data.get(SAVE_KEY)!),newGame());
});
test('recovery succeeds before replacing invalid primary, and an existing different recovery is never overwritten',()=>{
 const m=memory('{broken');assert.equal(loadGame(m.storage).recovery?.backedUp,true);assert.equal(m.data.get(SAVE_KEY),'{broken');
 assert.equal(saveGame(m.storage,newGame()),true);assert.equal(m.data.get(SAVE_KEY+':recovery'),'{broken');
 const n=memory('{another');n.data.set(SAVE_KEY+':recovery','older recovery');assert.equal(loadGame(n.storage).recovery?.backedUp,false);assert.equal(saveGame(n.storage,newGame()),false);assert.equal(n.data.get(SAVE_KEY+':recovery'),'older recovery');
});
test('all storage writes denied or read access forbidden: no throw and no primary write from load; normal saves still work',()=>{
 const m=memory('{broken',()=>true);assert.equal(loadGame(m.storage).recovery?.backedUp,false);assert.equal(saveGame(m.storage,newGame()),false);assert.equal(m.data.get(SAVE_KEY),'{broken');
 const denied:StorageLike={getItem(){throw Error('denied');},setItem(){throw Error('denied');},removeItem(){throw Error('denied');}};
 assert.ok(loadGame(denied).warning);assert.equal(saveGame(denied,newGame()),false);
 const normal=memory(JSON.stringify(newGame()));assert.equal(loadGame(normal.storage).warning,'');assert.deepEqual(normal.writes,[]);
 const next=decide(newGame(),newGame().current,'written_reply',2);assert.equal(saveGame(normal.storage,next),true);assert.deepEqual(restore(normal.data.get(SAVE_KEY)!),next);
});
