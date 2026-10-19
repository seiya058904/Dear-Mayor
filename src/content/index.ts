import { chainsA } from "./chains-a";
import { chainsB } from "./chains-b";
import { chainsC } from "./chains-c";
import { daily } from "./daily";
import type { Document, Branch } from "../game/types";
export const chains = [...chainsA, ...chainsB, ...chainsC];
export { daily };
export const documents: Record<string, Document> = {};
for (const chain of chains) {
  for (const [suffix, letter, stage] of [
    ["start", chain.start, 1],
    ...Object.entries(chain.branches).map(([key, value]) => [key, value, 2]),
    ["continuation", chain.continuation, 3],
    ["finale", chain.finale, 4],
  ] as [string, typeof chain.start, number][]) {
    const id = `${chain.id}/${suffix}`;
    documents[id] = {
      ...letter,
      id,
      sender: letter.sender ?? chain.sender,
      chain: chain.id,
      stage,
    };
  }
}
daily.forEach((letter, i) => {
  const id = `daily/${i}`;
  documents[id] = { ...letter, id, sender: letter.sender! };
});
export const branches: Branch[] = ["approve", "reject", "defer", "reply"];
