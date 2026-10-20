import { currentDocument as currentV1 } from '../src/legacy/v1/game/engine';
import { currentDocument as currentV2 } from '../src/legacy/v2/game/engine';
import { currentDocument as currentV3 } from '../src/legacy/v3/game/engine';
import v1Pending from './fixtures/v1-saves.json';
import v2Pending from './fixtures/v2-saves.json';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import fixtures from './fixtures/v3-saves.json';
import contract from './fixtures/v3-contract.json';
import catalogOne from './fixtures/catalog-1-saves.json';
import catalogTwo from './fixtures/catalog-2-saves.json';
import catalogThree from './fixtures/catalog-3-saves.json';
import catalogFour from './fixtures/catalog-4-review-saves.json';
import catalogSix from './fixtures/catalog-6-saves.json';
import catalogSeven from './fixtures/catalog-7-review-saves.json';
import catalogEight from './fixtures/catalog-8-saves.json';
import catalogNine from './fixtures/catalog-9-saves.json';
import catalogTen from './fixtures/catalog-10-saves.json';
import catalogEleven from './fixtures/catalog-11-saves.json';
import catalogTwelve from './fixtures/catalog-12-saves.json';
import catalogThirteen from './fixtures/catalog-13-saves.json';
import catalogFourteen from './fixtures/catalog-14-saves.json';
import catalogFifteen from './fixtures/catalog-15-saves.json';
import catalogSixteen from './fixtures/catalog-16-saves.json';
import catalogSeventeen from './fixtures/catalog-17-saves.json';
import catalogHashes from './fixtures/catalog-contracts.json';
import proseSnapshots from '../src/game/catalog-prose.json';
import proseHashes from './fixtures/catalog-prose-contracts.json';
import {newGame,decide,currentDocument} from '../src/game/engine';
import {restore,loadGame,saveGame,SAVE_KEY} from '../src/game/persistence';
import {catalogAt,catalogDeltas,latestCatalogRevision,letterContract,chainContract} from '../src/game/catalog';
import {chains,documents} from '../src/content';
import type {Action} from '../src/game/types';
const actions:Action[]=['approve','reject','defer','written_reply'];
const earlier=[...catalogOne,...catalogTwo,...catalogThree,...catalogFour,...catalogSix,...catalogSeven,...catalogEight,...catalogNine,...catalogTen,...catalogEleven,...catalogTwelve,...catalogThirteen,...catalogFourteen,...catalogFifteen,...catalogSixteen,...catalogSeventeen];

test('historical prose snapshots retain their pinned bytes and only overlay old catalogs',()=>{
 assert.deepEqual(proseSnapshots.map(s=>createHash('sha256').update(JSON.stringify(s)).digest('hex')),proseHashes);
 let previous=0;
 for(const snapshot of proseSnapshots){
  assert.ok(snapshot.throughRevision>previous&&snapshot.throughRevision<latestCatalogRevision);
  previous=snapshot.throughRevision;
  for(const [id,text] of Object.entries(snapshot.documents)){
   const old=catalogAt(snapshot.throughRevision).letters[id];
   assert.deepEqual(old.body,text.body);
   assert.equal(old.title,text.title);
   assert.equal(catalogAt(latestCatalogRevision).letters[id].body,undefined);
  }
 }
});

test('v3 snapshot has the exact batch-02 bytes',()=>{
 for(const [file,hash] of Object.entries(contract.hashes))assert.equal(createHash('sha256').update(readFileSync(`src/legacy/v3/${file}`)).digest('hex'),hash,file);
});
for(const fixture of fixtures)test(`v3 migration: ${fixture.name}`,()=>{
 const raw=JSON.stringify(fixture.state);const map=new Map([[SAVE_KEY,raw]]);
 const storage={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);},removeItem:()=>{}};
 const loaded=loadGame(storage);assert.equal(loaded.warning,'');let s=loaded.state;
 assert.equal(s.contentVersion,4);assert.equal(s.v3Length,fixture.state.history.length);
 for(const key of ['history','current','day','inDay','pending','facts','started','readDaily','legacyLength','v2Length','seed','seasonal'] as const)assert.deepEqual(s[key],fixture.state[key],key);
 assert.equal(map.get(SAVE_KEY),raw);
 s=decide(s,s.current,'written_reply',2);assert.ok(saveGame(storage,s));
 assert.equal(map.get(SAVE_KEY+':v3-backup'),raw);
 assert.deepEqual(restore(map.get(SAVE_KEY)!),s);
 for(let i=0;i<Object.keys(documents).length+20;i++)s=decide(s,s.current,actions[i%4],i%3);
 assert.deepEqual(s.history.slice(0,fixture.state.history.length),fixture.state.history);
 assert.equal(new Set(s.history.map(h=>h.id)).size,s.history.length);
 assert.deepEqual(restore(JSON.stringify(s)),s);
});
for(const fixture of earlier)test(`catalog revision compatibility: ${fixture.name}`,()=>{
 const old=fixture.state;let s=restore(JSON.stringify(old));
 assert.deepEqual(s,old);
 assert.equal(s.catalogRevision,old.catalogRevision);
 const before=s.history;
 s=decide(s,s.current,'approve');
 assert.equal(s.catalogRevision,latestCatalogRevision);
 assert.equal(s.history.at(-1)?.nextCatalogRevision,latestCatalogRevision);
 assert.deepEqual(s.history.slice(0,before.length),before);
 for(let i=0;i<Object.keys(documents).length+30;i++)s=decide(s,s.current,actions[i%4],i%3);
 assert.deepEqual(restore(JSON.stringify(s)),s);
 assert.equal(new Set(s.history.map(h=>h.id)).size,s.history.length);
 if(Object.keys(documents).some(id=>!catalogAt(old.catalogRevision).letters[id]))assert.ok(s.history.some(h=>!catalogAt(old.catalogRevision).letters[h.id]&&documents[h.id]));
});

test('latest machine contracts match source, earlier pool and consequences stay pinned',()=>{
 assert.deepEqual(catalogDeltas.map(d=>createHash('sha256').update(JSON.stringify(d)).digest('hex')),catalogHashes);
 const latest=catalogAt(latestCatalogRevision);
 assert.equal(Object.keys(latest.letters).length,Object.keys(documents).length);
 for(const d of Object.values(documents))assert.deepEqual(latest.letters[d.id],letterContract(d),d.id);
 assert.deepEqual(latest.chains,chains.map(chainContract));
 assert.equal(Object.keys(catalogAt(1).letters).length,316);
 assert.equal(catalogAt(1).chains.length,28);
 assert.equal(Object.keys(catalogAt(2).letters).length,416);
 assert.equal(catalogAt(2).chains.length,36);
 assert.equal(Object.keys(catalogAt(3).letters).length,516);
 assert.equal(catalogAt(3).chains.length,46);
 assert.equal(Object.keys(catalogAt(4).letters).length,616);
 assert.equal(Object.keys(catalogAt(6).letters).length,616);
 assert.equal(catalogAt(6).chains.length,54);
 assert.equal(Object.keys(catalogAt(7).letters).length,716);
 assert.equal(Object.keys(catalogAt(8).letters).length,716);
 assert.equal(Object.keys(catalogAt(9).letters).length,780);
 assert.equal(Object.keys(catalogAt(10).letters).length,880);
 assert.equal(Object.keys(catalogAt(11).letters).length,980);
 assert.equal(Object.keys(catalogAt(12).letters).length,1080);
 assert.equal(Object.keys(catalogAt(13).letters).length,1160);
 assert.equal(Object.keys(catalogAt(14).letters).length,1160);
 assert.equal(Object.keys(catalogAt(15).letters).length,1160);
 assert.notEqual(catalogAt(4).letters['dancefloor/finale'].results.approve,latest.letters['dancefloor/finale'].results.approve);
});

test('invalid catalog revision, regressing history, v3 damage and backup failure preserve source',()=>{
 const s=decide(newGame(),newGame().current,'approve');
 for(const change of [{initialCatalogRevision:0},{catalogRevision:999},{v3Length:s.history.length+1},{v2Length:1,v3Length:0}])assert.throws(()=>restore(JSON.stringify({...s,...change})));
 const bad=structuredClone(s);bad.history[0].nextCatalogRevision=0;assert.throws(()=>restore(JSON.stringify(bad)));
 if(latestCatalogRevision>1){
  let upgraded=decide(newGame(6271,1),'bridge/start','approve');
  upgraded=decide(upgraded,upgraded.current,'defer');
  upgraded.history[1].nextCatalogRevision=1;
  assert.throws(()=>restore(JSON.stringify(upgraded)));
 }
 assert.equal(decide(s,s.current,'approve',undefined,0),s);
 const raw=JSON.stringify(fixtures[2].state);
 const storage={getItem:(k:string)=>k===SAVE_KEY?raw:null,setItem:()=>{throw new Error('quota');},removeItem:()=>{}};
 assert.equal(saveGame(storage,restore(raw)),false);assert.equal(storage.getItem(SAVE_KEY),raw);
 const broken=structuredClone(fixtures[2].state);broken.history[0].result='改坏了';assert.throws(()=>restore(JSON.stringify(broken)));
});

test('revision 16 copy edit preserves an open revision 15 reply and its saved history',()=>{
 const id='eleventh/painter-window-dry';
 const before=catalogAt(15).letters[id];
 const after=catalogAt(16).letters[id];
 assert.equal(before.replies[1].text,'先拍下当前画面再轻轻修复。');
 assert.equal(after.replies[1].text,'先描下当前画面再轻轻修复。');
 assert.deepEqual({...after,replies:before.replies},before);
 assert.deepEqual(after.replies.map(r=>r.result),before.replies.map(r=>r.result));
 let s=newGame(10531,15);
 while(s.current!==id){
  assert.ok(!s.current.startsWith('season/'),'target is reachable in the old catalog');
  s=decide(s,s.current,'approve',undefined,15);
 }
 assert.deepEqual(restore(JSON.stringify(s)),s);
 assert.equal(currentDocument(s).replies[1].text,before.replies[1].text);
 s=decide(s,s.current,'written_reply',1);
 assert.equal(s.catalogRevision,latestCatalogRevision);
 assert.equal(s.history.at(-1)?.result,before.replies[1].result);
 assert.deepEqual(restore(JSON.stringify(s)),s);
});

for(const [revision,id] of [[16,'eleventh/weaver-dye-pot'],[16,'eleventh/smith-lantern-hook'],[16,'lampwindow/reject'],[16,'echo/lamp-after-curtain'],[17,'eleventh/river-child-boat'],[17,'eleventh/laundry-rope-shadow'],[17,'eleventh/ledger-duplicate-mark']] as const)
test(`catalog ${revision} preserves a rewritten pending request: ${id}`,()=>{
 let s=newGame(10531,revision);
 while(s.current!==id){
  assert.ok(!s.current.startsWith('season/'),'target must remain reachable');
  s=decide(s,s.current,s.current==='lampwindow/start'?'reject':'approve',undefined,revision);
 }
 const old=catalogAt(revision).letters[id];
 assert.deepEqual(restore(JSON.stringify(s)),s);
 assert.deepEqual(currentDocument(s).replies,old.replies);
 assert.equal(currentDocument(s).sender,old.sender);
 const snapshots:{throughRevision:number;documents:Partial<Record<string,{title:string;body:string[]}>>}[]=proseSnapshots;
 const original=snapshots.find(s=>revision<=s.throughRevision&&s.documents[id])!.documents[id]!;
 assert.deepEqual(currentDocument(s).body,original.body);
 assert.equal(currentDocument(s).title,original.title);
 assert.notDeepEqual(currentDocument(s).body,documents[id].body);
 for(const action of actions){
  const advanced=decide(s,id,action,2);
  assert.deepEqual(advanced.history.slice(0,s.history.length),s.history);
  assert.equal(advanced.history.at(-1)?.result,action==='written_reply'?old.replies[2].result:old.results[action]);
  assert.equal(advanced.catalogRevision,latestCatalogRevision);
  assert.deepEqual(restore(JSON.stringify(advanced)),advanced);
 }
});

for (const version of [1,2,3] as const) test(`v${version} pending letters retain frozen prose, all choices and outcomes until a real decision`,()=>{
 const cases=version===1?v1Pending:version===2?v2Pending:fixtures;
 for(const fixture of cases){
  const raw=JSON.stringify(fixture.state);
  const expected=version===1?currentV1(fixture.state as unknown as Parameters<typeof currentV1>[0]):version===2?currentV2(fixture.state as unknown as Parameters<typeof currentV2>[0]):currentV3(fixture.state as unknown as Parameters<typeof currentV3>[0]);
  const s=restore(raw);
  assert.deepEqual(currentDocument(s),expected,fixture.name);
  assert.deepEqual(restore(JSON.stringify(s)),s,'migration boundary survives saving before deciding');
  for(const [action,reply] of [['approve',undefined],['reject',undefined],['defer',undefined],['written_reply',0],['written_reply',1],['written_reply',2]] as const){
   const next=decide(s,s.current,action,reply);
   assert.equal(next.history.at(-1)!.result,action==='written_reply'?expected.replies[reply!].result:expected.results[action]);
   assert.deepEqual(next.history.slice(0,s.history.length),s.history);
   assert.deepEqual(restore(JSON.stringify(next)),next);
  }
 }
});
test('pending migration engine identifiers reject invalid versions and incompatible replay boundaries',()=>{
 const s=restore(JSON.stringify(v1Pending.find(f=>f.state.history.length===20)!.state));
 for(const migrationVersion of [0,4,'1',null])assert.throws(()=>restore(JSON.stringify({...s,migrationVersion})));
 assert.throws(()=>restore(JSON.stringify({...s,legacyLength:0})));
});
import review18 from './fixtures/catalog-18-review-saves.json';
import {castIdentityIssues,castIdentityRules} from '../src/content/cast';
test('v4 identity guard covers all authored fields and rejects known role swaps',()=>{
 for(const d of Object.values(documents))assert.deepEqual(castIdentityIssues(d),[],d.id);
 const aliases=JSON.parse(readFileSync('src/content/cast-senders.json','utf8')) as Record<string,string[]>;
 for(const [name,allowed] of Object.entries(aliases)){
  const wrong=['药草师','卫兵队长'].map(role=>role+name).find(label=>!allowed.includes(label))!;
  for(const patch of [{sender:wrong},{title:wrong},{body:[wrong]},{replies:[{text:wrong,result:wrong}]},{results:{approve:wrong,reject:'拒绝',defer:'未回'}}])
   assert.ok(castIdentityIssues({...documents['bridge/start'],...patch}).length>0,wrong);
 }
 for(const rule of castIdentityRules){
  for(const id of rule.evidence)assert.ok(documents[id],id);
  for(const role of rule.forbidden){
   const bad=role+rule.name;
   for(const patch of [{sender:bad},{title:bad},{body:[bad]},{results:{approve:bad,reject:'拒绝',defer:'未回'}},{replies:[{text:bad,result:bad}]}])
    assert.ok(castIdentityIssues({...documents['bridge/start'],...patch}).includes(bad),bad);
  }
 }
});
for(const fixture of review18)test(`v4 catalog18 pending keeps all visible fields and six outcomes: ${fixture.name}`,()=>{
 const raw=JSON.stringify(fixture.state),s=restore(raw);
 assert.deepEqual(currentDocument(s),fixture.document);
 assert.deepEqual(restore(JSON.stringify(s)),s);
 for(const [action,reply] of [['approve',undefined],['reject',undefined],['defer',undefined],['written_reply',0],['written_reply',1],['written_reply',2]] as const){
  const n=decide(s,s.current,action,reply);
  assert.equal(n.history.at(-1)!.result,action==='written_reply'?fixture.document.replies[reply!].result:fixture.document.results[action]);
  assert.deepEqual(n.history.slice(0,s.history.length),s.history);
  assert.equal(n.catalogRevision,latestCatalogRevision);
  assert.deepEqual(restore(JSON.stringify(n)),n);
 }
});

test('v4 design-only causal pilot has 8 reachable stage-three sources and distinguishes all six outcomes',()=>{
 const pilot=JSON.parse(readFileSync('docs/V4-CAUSAL-PILOT.json','utf8')) as {runtimeEnabled:boolean;cases:{source:string;target:string;variants:{action:Action;reply:number|null;sourceResult:string;draft:string}[]}[]};
 assert.equal(pilot.runtimeEnabled,false);assert.equal(pilot.cases.length,8);
 for(const c of pilot.cases){assert.equal(documents[c.source].stage,3);assert.equal(documents[c.target].stage,4);assert.equal(c.variants.length,6);assert.equal(new Set(c.variants.map(v=>v.draft)).size,6);}
 for(let variant=0;variant<6;variant++){
  const action:Action=variant<3?actions[variant]:'written_reply';let s=newGame(10531);const seen=new Set();
  for(let i=0;i<860;i++){
   const c=pilot.cases.find(c=>c.target===s.current);
   if(c){const v=c.variants[variant],h=s.history.find(h=>h.id===c.source);assert.ok(h);assert.equal(h.action,v.action);assert.equal(h.reply??null,v.reply);assert.equal(h.result,v.sourceResult);assert.ok(s.day>=h.day);assert.deepEqual(restore(JSON.stringify(s)),s);seen.add(c.target);}
   s=decide(s,s.current,action,variant<3?undefined:variant-3);
  }
  assert.equal(seen.size,8);
 }
});
