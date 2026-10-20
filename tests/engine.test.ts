import test from "node:test";
import assert from "node:assert/strict";
import { chains, documents, daily, standaloneIds } from "../src/content";
import {
  currentDocument,
  dateLabel,
  decide,
  newGame,
} from "../src/game/engine";
import { loadGame, restore, saveGame, SAVE_KEY } from "../src/game/persistence";
import type { Action, GameState } from "../src/game/types";

const actions: Action[] = ["approve", "reject", "defer", "written_reply"];
const singleRun = chains.length*4 + standaloneIds.filter(id=>!documents[id].requires).length + new Set(standaloneIds.map(id=>documents[id].requires?.id).filter(Boolean)).size;
function run(action: Action, reply = 0, limit = singleRun) {
  let s = newGame();
  for (let i = 0; i < limit; i++) s = decide(s, s.current, action, reply);
  return s;
}
test("catalog has 1160 authored nodes, 82 four-stage chains and stable 32 legacy daily IDs", () => {
  assert.equal(Object.keys(documents).length, 1160);
  assert.equal(chains.length, 82);
  assert.equal(daily.length, 32);
  assert.equal(
    new Set(Object.values(documents).map((d) => d.body.join(""))).size,
    1160,
  );
  for (const doc of Object.values(documents)) {
    assert.equal(doc.replies.length, 3, doc.id);
    assert.equal(new Set(doc.replies.map((r) => r.text)).size, 3, doc.id);
    assert.ok(doc.body.join("").length >= (doc.kind === "note" ? 20 : 45), doc.id);
    assert.ok(
      doc.sender && doc.title && Object.values(doc.results).every(Boolean),
    );
  }
  assert.ok(new Set(Object.values(documents).map((d) => d.sender)).size >= 15);
});
test("first document uses natural content-library copy and preserves date and identity", () => {
  assert.equal(dateLabel(1), "秋月第六日");
  assert.equal(dateLabel(175), "暖月第三十日");
  assert.equal(dateLabel(176), "第二年·秋月第一日");
  assert.equal(dateLabel(181), "第二年·秋月第六日");
  assert.equal(dateLabel(17996), "第101年·秋月第一日");
  assert.equal(currentDocument(newGame()).title, "桥梁修缮请愿");
  assert.equal(currentDocument(newGame()).salutation, "镇长：");
  assert.match(currentDocument(newGame()).body[0], /面粉/);
});
test("duplicate and invalid choices are no-ops", () => {
  const s = newGame();
  const n = decide(s, s.current, "approve");
  assert.equal(decide(n, s.current, "reject"), n);
  assert.equal(decide(s, s.current, "written_reply", -1), s);
  assert.equal(decide(s, s.current, "written_reply", 3), s);
  assert.equal(decide(s, s.current, "written_reply"), s);
  assert.equal(decide(s, s.current, "fake" as Action), s);
  assert.equal(s.history.length, 0);
});
for (const action of actions) {
  test(`${action}: all eligible authored letters and all chains complete without duplicates`, () => {
    const s = run(action);
    const ungated = standaloneIds.filter(id => !documents[id].requires).length;
    const echoGroups = new Set(standaloneIds.map(id => documents[id].requires?.id).filter(Boolean)).size;
    assert.equal(s.history.length, chains.length * 4 + ungated + echoGroups);
    assert.equal(new Set(s.history.map((h) => h.id)).size, s.history.length);
    assert.ok(s.day >= 20, String(s.day));
    assert.equal(s.pending.length, 0);
    assert.ok(s.current.startsWith("season/"));
    for (const chain of chains) {
      const history = s.history.filter((h) => h.id.startsWith(chain.id + "/"));
      assert.equal(history.length, 4, chain.id);
      assert.equal(
        history[1].id,
        `${chain.id}/${action === "written_reply" ? "reply" : action}`,
      );
      assert.ok(history[1].day >= history[0].day + (chain.delays?.[0] ?? 2));
      assert.ok(history[2].day >= history[1].day + (chain.delays?.[1] ?? 2));
      assert.equal(history[3].id, `${chain.id}/finale`);
    }
  });
}
test("all reply variants are reachable and change remembered outcomes", () => {
  for (const index of [0, 1, 2]) {
    const s = run("written_reply", index);
    for (const chain of chains)
      assert.equal(
        s.facts[chain.id].lastResult,
        chain.finale.replies[index].result,
      );
  }
  const a = decide(newGame(), "bridge/start", "written_reply", 0);
  const b = decide(newGame(), "bridge/start", "written_reply", 1);
  assert.notEqual(a.facts.bridge.lastResult, b.facts.bridge.lastResult);
});
test("clock approval, refusal, silence and hearing are causally distinct", () => {
  for (const action of actions) {
    const s = run(action);
    const start = s.history.find((h) => h.id === "clock/start")!;
    assert.ok(
      s.history.some(
        (h) =>
          h.id === `clock/${action === "written_reply" ? "reply" : action}`,
      ),
    );
    if (action === "approve") assert.match(start.result, /恢复十二响/);
    if (action === "reject") assert.match(start.result, /正式拒绝/);
    if (action === "defer") {
      assert.match(start.result, /没有收到/);
      assert.doesNotMatch(start.result, /禁止|拒绝/);
    }
    if (action === "written_reply")
      assert.match(start.result, /三人.*听钟.*乌鸦/);
  }
});
test("legacy reply letters recall the actual choice; continuations avoid pasted outcomes", () => {
  let s = newGame();
  for (let i = 0; i < singleRun; i++) {
    const doc = currentDocument(s);
    if (doc.chain && chains.find(c => c.id === doc.chain)?.quotePrevious !== false && doc.id.endsWith("/reply"))
      assert.equal(doc.body[0], s.facts[doc.chain].lastResult);
    s = decide(s, s.current, actions[i % 4], i % 3);
  }
});
test("saves replay exactly at every cursor, including pending events and seasonal mode", () => {
  let s = newGame(935);
  for (let i = 0; i < singleRun + 13; i++) {
    assert.deepEqual(restore(JSON.stringify(s)), s);
    s = decide(s, s.current, actions[i % 4], i % 3);
  }
  assert.equal(new Set(s.history.map((h) => h.id)).size, singleRun + 13);
});
test("corrupt and future saves preserve recovery copy; denied storage does not throw", () => {
  const data = new Map<string, string>([[SAVE_KEY, "{broken"]]);
  const storage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      data.set(k, v);
    },
    removeItem: (k: string) => {
      data.delete(k);
    },
  };
  const loaded = loadGame(storage);
  assert.ok(loaded.warning);
  assert.equal(data.get(SAVE_KEY + ":recovery"), "{broken");
  assert.equal(data.get(SAVE_KEY), "{broken");
  assert.throws(() => restore(JSON.stringify({ ...newGame(), version: 999 })));
  const blocked = {
    ...storage,
    setItem() {
      throw new Error("quota");
    },
  };
  assert.equal(saveGame(blocked, newGame()), false);
});
test("tampered history rejected; mutable caches are reconstructed from legal history", () => {
  const s = run("approve", 0, 9);
  const broken: GameState = structuredClone(s);
  broken.history[0].action = "reject";
  assert.throws(() => restore(JSON.stringify(broken)));
  const caches = structuredClone(s);
  caches.pending = [];
  caches.facts = {};
  assert.deepEqual(restore(JSON.stringify(caches)), s);
});
test("many seeds and mixed decisions never show contradictory sibling branches or stall", () => {
  for (let seed = 0; seed < 40; seed++) {
    let s = newGame(seed);
    for (let i = 0; i < singleRun + 20; i++) {
      const next = decide(
        s,
        s.current,
        actions[(seed + i * 7) % 4],
        (seed + i) % 3,
      );
      assert.notEqual(next.current, s.current);
      s = next;
    }
    for (const chain of chains)
      assert.equal(
        s.history.filter((h) => h.id.startsWith(chain.id + "/")).length,
        4,
      );
  }
});
