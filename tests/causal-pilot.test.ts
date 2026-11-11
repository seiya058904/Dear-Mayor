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
import bridge28 from './fixtures/catalog-28-bridge-saves.json';
import { impactReport } from '../scripts/content-impact';

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

const bridgeRules=allRuntime.filter(rule=>rule.introducedRevision===29);
const bridgeChoices=[['approve',undefined],['reject',undefined],['defer',undefined],['written_reply',0],['written_reply',1],['written_reply',2]] as const;

test('catalog29 adds twelve exact bridge echoes without changing earlier rules or requests',()=>{
  const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
  assert.equal(hash(allRuntime.filter(rule=>rule.introducedRevision<29)),bridge28.previousRulesSHA256);
  assert.deepEqual(bridgeRules.map(rule=>[rule.source,rule.target]),[
    ['bridge/approve','bridge/continuation'],['bridge/continuation','bridge/finale'],
  ]);
  for(const rule of bridgeRules){
    assert.equal(rule.variants.length,6);
    assert.equal(documents[rule.target].body[0].split(rule.anchor).length,2);
    const rendered=new Set<string>();
    for(const [index,[action,reply]] of bridgeChoices.entries()){
      const variant=rule.variants[index],source=documents[rule.source];
      assert.equal(variant.action,action);assert.equal(variant.reply,reply??null);
      assert.equal(variant.sourceResult,action==='written_reply'?source.replies[reply!].result:source.results[action]);
      for(const seed of [37,6271]){
        let state=newGame(seed,29);
        while(state.current!==rule.target){
          assert.ok(!state.current.startsWith('season/'));
          const atSource=state.current===rule.source;
          state=decide(state,state.current,atSource?action:'approve',atSource?reply:undefined,29);
        }
        const doc=currentDocument(state),body=doc.body.join('');rendered.add(body);
        assert.ok(body.includes(variant.draft));
        for(const other of rule.variants.filter(v=>v!==variant))assert.ok(!body.includes(other.draft));
        assert.deepEqual({...doc,body:documents[rule.target].body},documents[rule.target],'only the target prose changes');
        assert.deepEqual(currentDocument(restore(JSON.stringify(state))),doc);
        // Stored result, not the overwritten facts cache, identifies the choice.
        assert.deepEqual(currentDocument({...state,facts:{}}),doc);
        const missing={...state,history:state.history.filter(h=>h.id!==rule.source)};
        assert.deepEqual(currentDocument(missing).body,documents[rule.target].body);
      }
    }
    assert.equal(rendered.size,6,'all six choices leave distinct visible memories');
  }
});

test('bridge flower memories work after every opening branch; plaque memories never leak into siblings',()=>{
  const plaque=bridgeRules[0],flowers=bridgeRules[1];
  for(const [opening,openingReply] of bridgeChoices)for(const [index,[action,reply]] of bridgeChoices.entries()){
    let state=decide(newGame(6271,29),'bridge/start',opening,openingReply,29);
    while(state.current!=='bridge/continuation'){
      assert.ok(!state.current.startsWith('season/'));
      state=decide(state,state.current,'approve',undefined,29);
    }
    const middle=currentDocument(state).body.join('');
    if(opening==='approve')assert.ok(middle.includes(plaque.variants[0].draft));
    else assert.deepEqual(currentDocument(state).body,documents['bridge/continuation'].body);
    state=decide(state,state.current,action,reply,29);
    while(state.current!=='bridge/finale')state=decide(state,state.current,'approve',undefined,29);
    const doc=currentDocument(state);
    assert.ok(doc.body.join('').includes(flowers.variants[index].draft));
    assert.deepEqual(currentDocument(restore(JSON.stringify(state))),doc);
  }
});

test('catalog28 bridge pending, six complete streams and mixed-version continuations retain their original words',()=>{
  const bytes=readFileSync('tests/fixtures/catalog-28-bridge-saves.json');
  assert.equal(createHash('sha256').update(bytes).digest('hex'),readFileSync('tests/fixtures/catalog-28-bridge-saves.sha256','utf8').trim());
  for(const row of bridge28.streams){
    let state=newGame(6271,28),hash=createHash('sha256'),count=0;
    const [action,reply]=bridgeChoices[row.variant];
    while(!state.current.startsWith('season/')){
      assert.ok(count++<1160);hash.update(JSON.stringify(currentDocument(state))+'\n');
      state=decide(state,state.current,action,reply,28);
    }
    assert.equal(count,row.count);assert.equal(hash.digest('hex'),row.documentsSHA256);
    assert.equal(createHash('sha256').update(JSON.stringify(state)).digest('hex'),row.stateSHA256);
  }
  for(const fixture of bridge28.pending){
    const state=restore(JSON.stringify(fixture.state));
    assert.deepEqual(currentDocument(state),fixture.document);
    for(const [action,reply] of bridgeChoices){
      let next=decide(state,state.current,action,reply);
      assert.equal(next.catalogRevision,latestCatalogRevision);
      assert.equal(next.history.at(-1)!.result,action==='written_reply'?fixture.document.replies[reply!].result:fixture.document.results[action]);
      assert.deepEqual(restore(JSON.stringify(next)),next);
      if(state.current==='bridge/finale')continue;
      while(next.current!=='bridge/finale'){
        assert.ok(!next.current.startsWith('season/'));
        if(next.current==='bridge/continuation')assert.deepEqual(currentDocument(next).body,documents[next.current].body);
        next=decide(next,next.current,'approve');
      }
      assert.deepEqual(currentDocument(next).body,documents[next.current].body);
      assert.deepEqual(currentDocument(restore(JSON.stringify(next))),currentDocument(next));
    }
  }
});

test('causal coverage exercises all bridge plaque choices after reaching the approve-only source',()=>{
  const report=impactReport(29);
  assert.equal(report.summary.nodes,1160);
  assert.equal(report.summary.runtimeReachableNodes,1160);
  assert.equal(report.summary.visibleSourceNodes,93);
  assert.equal(report.summary.sixWayDistinguishableSources,23);
  for(const rule of bridgeRules){
    const evidence=report.runtimeEvidence.filter(row=>row.source===rule.source);
    assert.equal(evidence.length,6);
    assert.deepEqual(new Set(evidence.map(row=>row.visibleText)),new Set(rule.variants.map(v=>v.draft)));
  }
});
