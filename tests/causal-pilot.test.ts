import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../docs/V4-CAUSAL-PILOT.json' with { type: 'json' };
import allRuntime from '../src/game/causal-pilot.json' with { type: 'json' };
import { currentDocument, decide, newGame } from '../src/game/engine';
import { restore } from '../src/game/persistence';
import { documents } from '../src/content';
import type { Action, GameState } from '../src/game/types';
import { latestCatalogRevision } from '../src/game/catalog';
import { withCausalPilot } from '../src/game/causal-pilot';
import v5Fixtures from './fixtures/catalog-20-saves.json';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import historicalRenders from './fixtures/v5-historical-render-hashes.json';

const cases = design.cases.filter(entry => ['clock', 'cellarmusic', 'bluewash', 'readaloud'].includes(entry.chain));
// Keep the exact published V5/V6 table contract; later rules have their own tests.
const runtime=allRuntime.filter(entry=>entry.introducedRevision<=21);
function reach(target: string, source: string, action: Action, reply?: number, revision = 21) {
  let state = newGame(6271, revision);
  for (let n = 0; n < 1200 && state.current !== target; n++) {
    const selected = state.current === source ? action : 'approve';
    state = decide(state, state.current, selected, selected === 'written_reply' ? reply : undefined, revision);
  }
  assert.equal(state.current, target);
  return state;
}

test('V6 runtime table copies exactly four approved V4 design cases with pinned rule revisions and unique anchors', () => {
  assert.equal(runtime.length, 4);
  assert.equal(runtime.flatMap(c => c.variants).length, 24);
  for (const item of cases) {
    const entry = runtime.find(candidate => candidate.target === item.target);
    assert.ok(entry);
    assert.deepEqual({source:entry.source,target:entry.target,variants:entry.variants}, { source: item.source, target: item.target, variants: item.variants });
    assert.equal(entry.introducedRevision, ['clock','cellarmusic'].includes(item.chain) ? 20 : 21);
    assert.equal(documents[item.target].body[0].split(entry.anchor).length, 2, `${item.target}: missing or duplicate author anchor`);
    const source = documents[item.source];
    for (const variant of item.variants) {
      const result = variant.action === 'written_reply' ? source.replies[variant.reply!].result : source.results[variant.action as 'approve' | 'reject' | 'defer'];
      assert.equal(result, variant.sourceResult);
    }
  }
});

for (const item of cases) for (const variant of item.variants) test(`${item.chain}: ${variant.action}/${variant.reply ?? '-'} is reachable and survives restore`, () => {
  const state = reach(item.target, item.source, variant.action as Action, variant.reply ?? undefined);
  const body = currentDocument(state).body.join('');
  assert.ok(body.includes(variant.draft));
  assert.deepEqual(currentDocument(restore(JSON.stringify(state))), currentDocument(state));
  assert.equal(decide(state, item.target, 'approve').history.at(-1)?.result, documents[item.target].results.approve);
});

for (const item of cases) test(`${item.chain}: uncertain source and old pending keep original prose`, () => {
  const state = reach(item.target, item.source, 'approve');
  const original = documents[item.target].body;
  const sourceIndex = state.history.findIndex(entry => entry.id === item.source);
  const missing = { ...state, history: state.history.filter((_, index) => index !== sourceIndex) };
  assert.deepEqual(currentDocument(missing).body, original);
  for (const change of [
    { action: 'reject' as Action },
    { reply: 0 },
    { result: 'unknown' },
    { nextCatalogRevision: undefined },
    { nextCatalogRevision: 19 },
  ]) {
    const history = [...state.history];
    history[sourceIndex] = { ...history[sourceIndex], ...change };
    assert.deepEqual(currentDocument({ ...state, history }).body, original);
  }
  const old = reach(item.target, item.source, 'approve', undefined, 19);
  assert.deepEqual(currentDocument(old).body, original);
  assert.deepEqual(currentDocument(restore(JSON.stringify(old))).body, original);
  const advanced = decide(old, item.target, 'approve');
  assert.equal(advanced.catalogRevision, latestCatalogRevision);
  assert.deepEqual(restore(JSON.stringify(advanced)), advanced);
});

test('V5 captured bytes, pending documents, six outcomes and history survive V6 replay', () => {
  const bytes=readFileSync('tests/fixtures/catalog-20-saves.json');
  assert.equal(createHash('sha256').update(bytes).digest('hex'),readFileSync('tests/fixtures/catalog-20-saves.sha256','utf8').trim());
  assert.equal(v5Fixtures.length,24);
  for(const fixture of v5Fixtures){
    const state=restore(JSON.stringify(fixture.state));
    assert.deepEqual(currentDocument(state),fixture.document,fixture.name);
    assert.deepEqual(currentDocument(restore(JSON.stringify(state))),fixture.document);
    for(const [action,reply] of [['approve',undefined],['reject',undefined],['defer',undefined],['written_reply',0],['written_reply',1],['written_reply',2]] as const){
      const next=decide(state,state.current,action,reply);
      assert.equal(next.catalogRevision,latestCatalogRevision);
      assert.equal(next.history.at(-1)!.result,action==='written_reply'?fixture.document.replies[reply!].result:fixture.document.results[action]);
      assert.deepEqual(next.history.slice(0,state.history.length),state.history);
      assert.deepEqual(restore(JSON.stringify(next)),next);
    }
  }
});

test('all existing catalog1-18 synthetic pending documents match full V5 render hashes',()=>{
  const digest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
  const files=new Map<string,{name:string;state:GameState}[]>();
  for(const row of historicalRenders){
    if(!files.has(row.file))files.set(row.file,JSON.parse(readFileSync('tests/fixtures/'+row.file,'utf8')));
    const fixture=files.get(row.file)!.find(f=>f.name===row.name)!;
    assert.equal(digest(fixture.state),row.stateSHA256,`${row.file}/${row.name}: immutable fixture`);
    const state=restore(JSON.stringify(fixture.state));
    assert.equal(digest(currentDocument(state)),row.documentSHA256,`${row.file}/${row.name}: full document`);
    assert.equal(digest(currentDocument(restore(JSON.stringify(state)))),row.documentSHA256);
  }
});

for(const rule of runtime) test(`${rule.target}: strict boundaries, corrupted history, anchors and facts`,()=>{
  const state=reach(rule.target,rule.source,'approve');
  const original=documents[rule.target];
  const index=state.history.findIndex(h=>h.id===rule.source);
  for(const patch of [
    {nextCatalogRevision:undefined},{nextCatalogRevision:rule.introducedRevision-1},
    {nextCatalogRevision:NaN},{nextCatalogRevision:21.5},{nextCatalogRevision:999},
    {action:'reject' as Action},{reply:0},{result:'篡改结果'},
  ]){
    const history=state.history.map((h,i)=>i===index?{...h,...patch}:h);
    assert.deepEqual(withCausalPilot({...state,history},original),original,JSON.stringify(patch));
  }
  for(const history of [state.history.filter((_,i)=>i!==index),[...state.history,state.history[index]]])
    assert.deepEqual(withCausalPilot({...state,history},original),original);
  for(const revision of [undefined,NaN,19,20.5,999]){
    assert.deepEqual(withCausalPilot({...state,initialCatalogRevision:revision as number},original),original);
    assert.deepEqual(withCausalPilot({...state,catalogRevision:revision as number},original),original);
  }
  assert.deepEqual(withCausalPilot({...state,migrationVersion:3},original),original);
  for(const body of [[original.body[0].replace(rule.anchor,'')],[original.body[0]+rule.anchor],[]]){
    const broken={...original,body};assert.deepEqual(withCausalPilot(state,broken),broken);
  }
  assert.deepEqual(currentDocument({...state,facts:{}}).body,currentDocument(state).body,'echo does not depend on facts.lastResult');
});

for(const rule of runtime.filter(r=>r.introducedRevision===21)) test(`${rule.target}: catalog20 source/pending stays static across upgrade`,()=>{
  let state=newGame(6271,20);
  while(state.current!==rule.source)state=decide(state,state.current,'approve',undefined,20);
  // Source happened in 20; only the following real decision upgrades to 21.
  state=decide(state,state.current,'approve',undefined,20);
  while(state.current!==rule.target)state=decide(state,state.current,'approve');
  assert.equal(state.catalogRevision,latestCatalogRevision);
  assert.deepEqual(currentDocument(state).body,documents[rule.target].body);
  assert.deepEqual(currentDocument(restore(JSON.stringify(state))),currentDocument(state));
  // Even a source decided at the upgrade point cannot enable a catalog20 start.
  let source21=newGame(6271,20);
  while(source21.current!==rule.source)source21=decide(source21,source21.current,'approve',undefined,20);
  source21=decide(source21,source21.current,'approve');
  while(source21.current!==rule.target)source21=decide(source21,source21.current,'approve');
  assert.equal(source21.history.find(h=>h.id===rule.source)!.nextCatalogRevision,latestCatalogRevision);
  assert.deepEqual(currentDocument(source21).body,documents[rule.target].body);
  assert.deepEqual(currentDocument({...state,initialCatalogRevision:21}).body,documents[rule.target].body,'source20 cannot satisfy rule21');
});

test('published V5 algorithm and V6 agree byte-for-byte across legal V5 paths',()=>{
  for(const seed of [1,6271,10531])for(let v=0;v<6;v++){
    let state=newGame(seed,20);const seen=new Set<string>();
    for(let n=0;n<860;n++){
      const rule=runtime.find(r=>r.introducedRevision===20&&r.target===state.current);
      if(rule){
        const source=state.history.find(h=>h.id===rule.source)!;
        const variant=rule.variants.find(x=>x.action===source.action&&(x.reply===null?source.reply===undefined:x.reply===source.reply)&&x.sourceResult===source.result)!;
        const original=documents[rule.target];
        const expected=[original.body[0].replace(rule.anchor,rule.anchor+variant.draft),...original.body.slice(1)];
        assert.deepEqual(currentDocument(state).body,expected);seen.add(rule.target);
      }
      state=decide(state,state.current,v<3?(['approve','reject','defer'] as const)[v]:'written_reply',v<3?undefined:v-3,20);
    }
    assert.equal(seen.size,2);
  }
});
