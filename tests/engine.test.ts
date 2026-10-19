import test from "node:test";
import assert from "node:assert/strict";
import { chains, documents, daily } from "../src/content";
import {
  currentDocument,
  dateLabel,
  decide,
  newGame,
} from "../src/game/engine";
import { loadGame, restore, saveGame, SAVE_KEY } from "../src/game/persistence";
import type { Action, GameState } from "../src/game/types";

const actions: Action[] = ["approve", "reject", "defer", "written_reply"];
function run(action: Action, reply = 0, limit = 80) {
  let s = newGame();
  for (let i = 0; i < limit; i++) s = decide(s, s.current, action, reply);
  return s;
}
test("catalog has 116 distinct documents, 12 four-stage chains and 32 daily letters", () => {
  assert.equal(Object.keys(documents).length, 116);
  assert.equal(chains.length, 12);
  assert.equal(daily.length, 32);
  assert.equal(
    new Set(Object.values(documents).map((d) => d.body.join(""))).size,
    116,
  );
  for (const doc of Object.values(documents)) {
    assert.equal(doc.replies.length, 3, doc.id);
    assert.equal(new Set(doc.replies.map((r) => r.text)).size, 3, doc.id);
    assert.ok(doc.body.join("").length >= 70, doc.id);
    assert.ok(
      doc.sender && doc.title && Object.values(doc.results).every(Boolean),
    );
  }
  assert.ok(new Set(Object.values(documents).map((d) => d.sender)).size >= 15);
});
test("first document preserves provided copy and date", () => {
  assert.equal(dateLabel(1), "秋月第六日");
  assert.equal(currentDocument(newGame()).title, "桥梁修缮请愿");
  assert.equal(currentDocument(newGame()).salutation, "尊敬的镇政厅：");
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
  test(`${action}: 80 unique letters, all 12 chains complete, at least 20 days`, () => {
    const s = run(action);
    assert.equal(s.history.length, 80);
    assert.equal(new Set(s.history.map((h) => h.id)).size, 80);
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
      assert.ok(history[1].day >= history[0].day + 2);
      assert.ok(history[2].day >= history[1].day + 2);
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
test("continuations quote the actual immediately preceding choice, not another branch", () => {
  let s = newGame();
  for (let i = 0; i < 80; i++) {
    const doc = currentDocument(s);
    if (doc.chain && (doc.stage! >= 3 || doc.id.endsWith("/reply")))
      assert.equal(doc.body[0], s.facts[doc.chain].lastResult);
    s = decide(s, s.current, actions[i % 4], i % 3);
  }
});
test("saves replay exactly at every cursor, including pending events and seasonal mode", () => {
  let s = newGame(935);
  for (let i = 0; i < 110; i++) {
    assert.deepEqual(restore(JSON.stringify(s)), s);
    s = decide(s, s.current, actions[i % 4], i % 3);
  }
  assert.equal(new Set(s.history.map((h) => h.id)).size, 110);
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
    for (let i = 0; i < 120; i++) {
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
