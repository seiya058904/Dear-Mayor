import { chainsA } from "./chains-a";
import { chainsB } from "./chains-b";
import { chainsC } from "./chains-c";
import { daily } from "./daily";
import { townChainsA } from "./town-chains-a";
import { townChainsB } from "./town-chains-b";
import { townChainsC } from "./town-chains-c";
import { townChainsD } from "./town-chains-d";
import { townLetters } from "./town-letters";
import { echoes } from "./echoes";
import { secondChainsA } from "./second-chains-a";
import { secondChainsB } from "./second-chains-b";
import { secondChainsC } from "./second-chains-c";
import { secondChainsD } from "./second-chains-d";
import { secondLetters } from "./second-letters";
import { secondEchoes } from "./second-echoes";
import type { Document, Branch } from "../game/types";
export const chains = [...chainsA, ...chainsB, ...chainsC,
  ...townChainsA, ...townChainsB, ...townChainsC, ...townChainsD,
  ...secondChainsA, ...secondChainsB, ...secondChainsC, ...secondChainsD];
export { daily };
export const documents: Record<string, Document> = {};
function register(doc: Document) {
  if (documents[doc.id]) throw new Error(`Duplicate document: ${doc.id}`);
  documents[doc.id] = doc;
}
for (const chain of chains) {
  for (const [suffix, letter, stage] of [
    ["start", chain.start, 1],
    ...Object.entries(chain.branches).map(([key, value]) => [key, value, 2]),
    ["continuation", chain.continuation, 3],
    ["finale", chain.finale, 4],
  ] as [string, typeof chain.start, number][]) {
    const id = `${chain.id}/${suffix}`;
    register({
      ...letter,
      id,
      sender: letter.sender ?? chain.sender,
      chain: chain.id,
      stage,
      kind: letter.kind ?? (chain.id === "inspection" ? "official" : chain.id === "halfnotice" ? "archive" : "letter"),
    });
  }
}
daily.forEach((letter, i) => {
  const id = `daily/${i}`;
  register({ ...letter, id, sender: letter.sender!, kind: "letter" });
});
for (const doc of [...townLetters, ...echoes, ...secondLetters, ...secondEchoes]) register(doc);
export const standaloneIds = Object.values(documents).filter(d => !d.chain).map(d => d.id);
export const branches: Branch[] = ["approve", "reject", "defer", "reply"];
