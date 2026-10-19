import { decide, newGame } from "./engine";
import type { GameState } from "./types";
export const SAVE_KEY = "dear-mayor:save:v1";
export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export function restore(raw: string): GameState {
  const parsed = JSON.parse(raw);
  if (
    parsed.version !== 1 ||
    !Number.isSafeInteger(parsed.seed) ||
    !Array.isArray(parsed.history) ||
    parsed.history.length > 50000
  )
    throw new Error("Invalid save");
  let state = newGame(parsed.seed);
  for (const h of parsed.history) {
    if (!h || h.id !== state.current || h.day !== state.day)
      throw new Error("Invalid history");
    const next = decide(state, h.id, h.action, h.reply);
    if (next === state || next.history.at(-1)?.result !== h.result)
      throw new Error("Invalid decision");
    state = next;
  }
  // Replay canonical history instead of trusting mutable pending queues or hidden flags.
  if (state.current !== parsed.current || state.day !== parsed.day)
    throw new Error("Invalid cursor");
  return state;
}
export function loadGame(storage: StorageLike): {
  state: GameState;
  warning: string;
} {
  let raw: string | null = null;
  try {
    raw = storage.getItem(SAVE_KEY);
    return { state: raw ? restore(raw) : newGame(), warning: "" };
  } catch {
    try {
      if (raw) storage.setItem(`${SAVE_KEY}:recovery`, raw);
    } catch {
      /* Keep the original key intact. */
    }
    return {
      state: newGame(),
      warning: raw
        ? "旧存档暂时无法读取，已尝试留存备份。继续批阅将开始新的一局。"
        : "此浏览器暂不能保存进度；关闭页面后可能无法继续。",
    };
  }
}
export function saveGame(storage: StorageLike, state: GameState): boolean {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
