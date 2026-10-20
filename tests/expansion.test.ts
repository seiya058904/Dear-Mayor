import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import fixtures from './fixtures/v1-saves.json';
import contract from './fixtures/v1-contract.json';
import scheduling from './fixtures/scheduling-revision11.json';
import { chains, documents, standaloneIds } from '../src/content';
import { auditCatalog } from '../src/content/audit';
import { currentDocument, decide, newGame, eligibleDay, rank } from '../src/game/engine';
import { loadGame, restore, saveGame, SAVE_KEY } from '../src/game/persistence';
import type { Action, GameState } from '../src/game/types';
import type { GameState as LegacyState } from '../src/legacy/v1/game/types';
const actions: Action[]=['approve','reject','defer','written_reply'];

test('twenty revision-11 schedules retain pre-optimization full-state hashes',()=>{
  for(const {seed,sha256} of scheduling.rows){
    let state=newGame(seed,11);
    for(let i=0;i<1000;i++)state=decide(state,state.current,actions[(i*7+seed)%4],(i+seed)%3,11);
    assert.equal(createHash('sha256').update(JSON.stringify(state)).digest('hex'),sha256,`seed ${seed}`);
  }
});

test('v1 frozen contract matches committed baseline hashes',()=>{
  for(const [file,hash] of Object.entries(contract.hashes))
    assert.equal(createHash('sha256').update(readFileSync(`src/legacy/v1/${file}`)).digest('hex'),hash,file);
});
for(const fixture of fixtures) test(`v1 migration: ${fixture.name}`,()=>{
  const old=fixture.state as LegacyState;
  const raw=JSON.stringify(old);
  const map=new Map([[SAVE_KEY,raw]]);
  const storage={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);},removeItem:(k:string)=>{map.delete(k);}};
  const loaded=loadGame(storage);
  assert.equal(loaded.warning,'');
  let s=loaded.state;
  assert.equal(s.version,2);
  assert.equal(s.legacyLength,old.history.length);
  for(const key of ['history','current','pending','facts','day','inDay','started','readDaily','seed','seasonal'] as const)
    assert.deepEqual(s[key],old[key],key);
  assert.equal(map.get(SAVE_KEY),raw,'load must leave source bytes intact');
  s=decide(s,s.current,'written_reply',2);
  assert.equal(s.history.length,old.history.length+1);
  assert.ok(saveGame(storage,s));
  assert.equal(map.get(SAVE_KEY+':v1-backup'),raw);
  assert.deepEqual(restore(map.get(SAVE_KEY)!),s);
  // New content must be encountered without restarting an old run, including loops.
  for(let i=0;i<180;i++) s=decide(s,s.current,actions[i%4],i%3);
  assert.ok(s.history.some(h=>h.id.startsWith('town/')||h.id.startsWith('goose/')));
  assert.equal(new Set(s.history.map(h=>h.id)).size,s.history.length);
  assert.deepEqual(restore(JSON.stringify(s)),s);
});

test('invalid v1 histories retain raw recovery, valid v1 backup failure prevents overwrite',()=>{
  const fixture=structuredClone(fixtures.find(f=>f.state.history.length===20)!.state);
  fixture.history[0].result='伪造历史';
  const raw=JSON.stringify(fixture);
  const map=new Map([[SAVE_KEY,raw]]);
  const storage={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);},removeItem:()=>{}};
  assert.ok(loadGame(storage).warning);
  assert.equal(map.get(SAVE_KEY+':recovery'),raw);
  assert.equal(map.get(SAVE_KEY),raw);
  const valid=JSON.stringify(fixtures[3].state);
  map.set(SAVE_KEY,valid);
  const quota={...storage,setItem:(k:string)=>{if(k.endsWith('v1-backup'))throw new Error('quota');}};
  assert.equal(saveGame(quota,restore(valid)),false);
  assert.equal(map.get(SAVE_KEY),valid);
});

test('catalog integrity rejects duplicate text and outcomes; real catalog has no exact duplicate prose',()=>{
  const audit=auditCatalog(documents);
  assert.deepEqual(audit.errors,[]);
  assert.equal(audit.exactDuplicateBodies,0);
  assert.deepEqual(audit.suspicious,[]);
  const clone=structuredClone(documents);
  clone['daily/0'].body=clone['daily/1'].body;
  clone['daily/2'].results.reject=clone['daily/2'].results.approve;
  assert.ok(auditCatalog(clone).errors.length>=2);
});

test('every authored node and all reply options can be reached with real scheduling',()=>{
  const seen=new Set<string>();
  const cursors=new Map<string,GameState>();
  for(const action of actions) for(const reply of [0,1,2]) {
    let s=newGame(37+reply);
    for(let i=0;i<Object.keys(documents).length+1&&!s.current.startsWith('season/');i++) {
      seen.add(s.current); cursors.set(s.current,s); const doc=currentDocument(s);
      if(action==='written_reply') assert.ok(doc.replies[reply]);
      s=decide(s,s.current,action,reply);
    }
    assert.ok(s.current.startsWith('season/'));
  }
  assert.deepEqual(Object.keys(documents).filter(id=>!seen.has(id)),[]);
  for(const [id,cursor] of cursors) {
    const doc=currentDocument(cursor);
    for(let reply=0;reply<doc.replies.length;reply++) {
      const next=decide(cursor,id,'written_reply',reply);
      assert.equal(next.history.at(-1)?.result,doc.replies[reply].result,id);
      assert.deepEqual(restore(JSON.stringify(next)),next,id);
      if(doc.chain) assert.equal(next.facts[doc.chain].branch,cursor.facts[doc.chain]?.branch??'reply');
    }
  }
});

test('cross-character echoes require the actual source action and delay; sibling claims never coexist',()=>{
  for(const action of actions) {
    let s=newGame(15);
    while(!s.current.startsWith('season/')) {
      const d=currentDocument(s);
      if(d.requires) {
        const source=s.history.find(h=>h.id===d.requires!.id)!;
        assert.ok(source);
        assert.ok(d.requires.actions.includes(source.action));
        assert.ok(s.day>=source.day+d.requires.days);
        assert.equal(eligibleDay(d.id,{...s,history:s.history.filter(h=>h.id!==source.id)}),Infinity);
      }
      s=decide(s,s.current,action,1);
    }
    for(const source of ['bridge/start','clock/start','goose/start','bread/start','warmth/start','post/start','clocklesson/start','paperkite/start','millerleave/start','granaryrain/start','lastloom/start','flouroath/start','lampwindow/start','teanewcomer/start','candlemarks/start','honeycontest/start','oldchess/start','breadapprentice/start'])
      assert.equal(s.history.filter(h=>!documents[h.id]?.chain&&documents[h.id]?.requires?.id===source).length,1,source);
    const abroad=s.history.find(h=>h.id==='foreignstones/start')!;
    const departure=s.history.find(h=>h.id==='millerleave/start')!;
    assert.ok(abroad.day>=departure.day+25);
    const yearly=s.history.find(h=>h.id.startsWith('echo/clocklesson-year-'))!;
    assert.ok(yearly.day>=s.history.find(h=>h.id==='clocklesson/start')!.day+190);
    assert.ok(s.history.some(h=>h.id.startsWith('lanename/')));
    assert.ok(s.history.some(h=>h.id.startsWith('soupbell/')));
  }
});

test('twenty seeds: 1000 mixed decisions preserve all eligible content and canonical restoration',()=>{
  const openings=new Set<string>();
  for(let seed=0;seed<20;seed++) {
    let s=newGame(seed);
    for(let i=0;i<1000;i++) {
      const before=s;
      s=decide(s,s.current,actions[(i*7+seed)%4],(i+seed)%3);
      assert.equal(before.history.length,i,'decide cannot mutate old snapshots');
      assert.equal(s.history.length,i+1);
      assert.notEqual(s.current,before.current);
      if(i===20) openings.add(s.history.map(h=>h.id).join(','));
      if([199,499,999].includes(i)) assert.deepEqual(restore(JSON.stringify(s)),s);
    }
    const authored=s.history.filter(h=>documents[h.id]);
    assert.equal(authored.length,chains.length*4+standaloneIds.filter(id=>!documents[id].requires).length+new Set(standaloneIds.map(id=>documents[id].requires?.id).filter(Boolean)).size);
    assert.equal(new Set(s.history.map(h=>h.id)).size,1000);
    for(const c of chains) assert.equal(authored.filter(h=>h.id.startsWith(c.id+'/')).length,4);
    assert.equal(s.pending.length,0);
    for(const id of standaloneIds) {
      const day=eligibleDay(id,s);
      if(Number.isFinite(day)) assert.ok(authored.some(h=>h.id===id),id);
    }
  }
  assert.ok(openings.size>=15,'seeds should vary everyday encounters');
});

test('rank is independent of pool length and sibling insertion; new fields cannot bypass restoration',()=>{
  const ids=standaloneIds.slice(0,10);
  const order=ids.slice().sort((a,b)=>rank(a,6271)-rank(b,6271));
  assert.deepEqual([...ids,'town/future-item'].sort((a,b)=>rank(a,6271)-rank(b,6271)).filter(id=>ids.includes(id)),order);
  const s:GameState=decide(newGame(),'bridge/start','approve');
  assert.throws(()=>restore(JSON.stringify({...s,contentVersion:99})));
  assert.throws(()=>restore(JSON.stringify({...s,legacyLength:s.history.length+1})));
});
