import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import fixtures from './fixtures/v2-saves.json';
import contract from './fixtures/v2-contract.json';
import review from '../docs/LEGACY-REVIEW.json';
import {documents} from '../src/content';
import {newGame,decide,currentDocument} from '../src/game/engine';
import {newGame as newV2,decide as decideV2} from '../src/legacy/v2/game/engine';
import {restore,loadGame,saveGame,SAVE_KEY} from '../src/game/persistence';
import {documents as frozenDocuments} from '../src/legacy/v2/content';
import type {Action,Decision} from '../src/game/types';
const actions:Action[]=['approve','reject','defer','written_reply'];

test('frozen v2 source matches first-batch SHA-256 contract',()=>{
 for(const [file,hash] of Object.entries(contract.hashes))
  assert.equal(createHash('sha256').update(readFileSync(`src/legacy/v2/${file}`)).digest('hex'),hash,file);
});
for(const fixture of fixtures)test(`v2 to current: ${fixture.name}`,()=>{
 const old=fixture.state;
 const raw=JSON.stringify(old);
 const data=new Map([[SAVE_KEY,raw]]);
 const storage={getItem:(k:string)=>data.get(k)??null,setItem:(k:string,v:string)=>{data.set(k,v);},removeItem:()=>{}};
 const loaded=loadGame(storage);
 assert.equal(loaded.warning,'');
 let s=loaded.state;
 assert.equal(s.contentVersion,4);
 assert.equal(s.v2Length,old.history.length);
 assert.equal(s.legacyLength,old.legacyLength);
 for(const k of ['history','current','day','inDay','pending','facts','readDaily','started','seasonal','seed'] as const)
  assert.deepEqual(s[k],old[k],k);
 assert.equal(data.get(SAVE_KEY),raw);
 s=decide(s,s.current,'written_reply',2);
 assert.equal(s.history.length,old.history.length+1);
 assert.ok(saveGame(storage,s));
 assert.equal(data.get(SAVE_KEY+':v2-backup'),raw);
 assert.deepEqual(restore(data.get(SAVE_KEY)!),s);
 for(let i=0;i<350;i++)s=decide(s,s.current,actions[i%4],i%3);
 assert.deepEqual(restore(JSON.stringify(s)),s);
 assert.deepEqual(s.history.slice(0,old.history.length),old.history);
 assert.equal(new Set(s.history.map(h=>h.id)).size,s.history.length);
 // The completed v2 pool must not replay just because a later pool was added.
 for(const h of old.history)assert.equal(s.history.filter(next=>next.id===h.id).length,1,h.id);
});

test('v2 tampering, invalid prefix boundaries, and backup write failures preserve source',()=>{
 const fixture=fixtures.find(f=>f.state.history.length===20)!;
 const broken=structuredClone(fixture.state);broken.history[0].result='篡改';
 assert.throws(()=>restore(JSON.stringify(broken)));
 const raw=JSON.stringify(fixture.state);
 const storage={getItem:(k:string)=>k===SAVE_KEY?raw:null,setItem:()=>{throw new Error('quota');},removeItem:()=>{}};
 assert.equal(saveGame(storage,restore(raw)),false);
 assert.equal(storage.getItem(SAVE_KEY),raw);
 const s=decide(newGame(),newGame().current,'approve');
 for(const fields of [{v2Length:-1},{v2Length:s.history.length+1},{legacyLength:1,v2Length:0},{contentVersion:99}])
  assert.throws(()=>restore(JSON.stringify({...s,...fields})));
});

test('old outcomes are verified against frozen v2 prose after current copy changes',()=>{
 const old=fixtures.find(f=>f.state.history.length===20)!;
 const state=restore(JSON.stringify(old.state));
 for(const h of old.state.history as Decision[]) {
  if(!frozenDocuments[h.id])continue;
  const d=frozenDocuments[h.id];
  const result=h.action==='written_reply'?d.replies[h.reply!].result:d.results[h.action as 'approve'|'reject'|'defer'];
  assert.equal(h.result,result);
 }
 assert.ok(currentDocument(state));
});

test('remaining 83 legacy reviews match real source; ordinary follow-ups do not paste outcomes',()=>{
 assert.equal(review.review.length,83);
 const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
 for(const item of review.review) {
  assert.equal(hash(frozenDocuments[item.id].body.join('\n')),item.before,item.id);
  assert.equal(hash(documents[item.id].body.join('\n')),item.after,item.id);
  assert.notEqual(item.before,item.after,item.id);
 }
 assert.doesNotMatch(documents['warmth/finale'].body.join(''),/天气转暖|明春|去年/);
 assert.match(documents['warmth/reply'].body.join(''),/门闩/);
 assert.doesNotMatch(documents['goat/start'].replies.map(r=>r.text).join(''),/苦味浆糊/);
 let s=newGame();
 for(let i=0;i<Object.keys(documents).length&&!s.current.startsWith('season/');i++) {
  const d=currentDocument(s);
  if(d.stage&&d.stage>=3&&!['clock/finale','cellarmusic/finale'].includes(d.id)) assert.deepEqual(d.body,documents[d.id].body,d.id);
  s=decide(s,s.current,actions[i%4],i%3);
 }
});

test('changed goat reply result preserves the exact old consequence only in v2 history',()=>{
 let old=newV2(6271);
 while(old.current!=='goat/start')old=decideV2(old,old.current,'approve');
 old=decideV2(old,old.current,'written_reply',2);
 assert.match(old.history.at(-1)!.result,/苦浆糊/);
 const migrated=restore(JSON.stringify(old));
 assert.equal(migrated.current,old.current);
 assert.deepEqual(migrated.history,old.history);
 assert.deepEqual(restore(JSON.stringify(migrated)),migrated);
 let fresh=newGame(6271);
 while(fresh.current!=='goat/start')fresh=decide(fresh,fresh.current,'approve');
 fresh=decide(fresh,fresh.current,'written_reply',2);
 assert.match(fresh.history.at(-1)!.result,/刻字牌/);
 assert.notEqual(fresh.history.at(-1)!.result,old.history.at(-1)!.result);
});
