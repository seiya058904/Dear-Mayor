import test from 'node:test';
import assert from 'node:assert/strict';
import design from '../docs/V4-CAUSAL-PILOT.json' with { type: 'json' };
import runtime from '../src/game/causal-pilot.json' with { type: 'json' };
import { currentDocument, decide, newGame } from '../src/game/engine';
import { restore } from '../src/game/persistence';
import { documents } from '../src/content';
import type { Action, GameState } from '../src/game/types';

const cases = design.cases.filter(entry => ['clock', 'cellarmusic'].includes(entry.chain));
function reach(target: string, source: string, action: Action, reply?: number, revision = 20) {
  let state = newGame(6271, revision);
  for (let n = 0; n < 1200 && state.current !== target; n++) {
    const selected = state.current === source ? action : 'approve';
    state = decide(state, state.current, selected, selected === 'written_reply' ? reply : undefined, revision);
  }
  assert.equal(state.current, target);
  return state;
}

test('V5 runtime table copies exactly the two approved V4 design cases', () => {
  assert.equal(runtime.length, 2);
  for (const item of cases) {
    const entry = runtime.find(candidate => candidate.target === item.target);
    assert.deepEqual(entry, { source: item.source, target: item.target, variants: item.variants });
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
  assert.equal(advanced.catalogRevision, 20);
  assert.deepEqual(restore(JSON.stringify(advanced)), advanced);
});
