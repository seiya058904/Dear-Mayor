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
import { thirdChainsA } from "./third-chains-a";
import { thirdChainsB } from "./third-chains-b";
import { thirdChainsC } from "./third-chains-c";
import { thirdChainsD } from "./third-chains-d";
import { thirdLetters } from "./third-letters";
import { thirdEchoes } from "./third-echoes";
import { fourthChainsA } from "./fourth-chains-a";
import { fourthChainsB } from "./fourth-chains-b";
import { fourthChainsC } from "./fourth-chains-c";
import { fourthChainsD } from "./fourth-chains-d";
import { fourthChainsE } from "./fourth-chains-e";
import { fourthLetters } from "./fourth-letters";
import { fifthChainsA } from "./fifth-chains-a";
import { fifthChainsB } from "./fifth-chains-b";
import { fifthChainsC } from "./fifth-chains-c";
import { fifthChainsD } from "./fifth-chains-d";
import { fifthLettersA } from "./fifth-letters-a";
import { fifthLettersB } from "./fifth-letters-b";
import { sixthChainsA } from "./sixth-chains-a";
import { sixthChainsB } from "./sixth-chains-b";
import { sixthChainsC } from "./sixth-chains-c";
import { sixthChainsD } from "./sixth-chains-d";
import { sixthLettersA } from "./sixth-letters-a";
import { sixthLettersB } from "./sixth-letters-b";
import { sixthEchoes } from "./sixth-echoes";
import { seventhLettersA } from "./seventh-letters-a";
import { seventhLettersB } from "./seventh-letters-b";
import { seventhLettersC } from "./seventh-letters-c";
import { seventhLettersD } from "./seventh-letters-d";
import { eighthChainsA } from "./eighth-chains-a";
import { eighthChainsB } from "./eighth-chains-b";
import { eighthChainsC } from "./eighth-chains-c";
import { eighthChainsD } from "./eighth-chains-d";
import { eighthLettersA } from "./eighth-letters-a";
import { eighthLettersB } from "./eighth-letters-b";
import { eighthLettersC } from "./eighth-letters-c";
import { ninthChainsA } from "./ninth-chains-a";
import { ninthChainsB } from "./ninth-chains-b";
import { ninthChainsC } from "./ninth-chains-c";
import { ninthChainsD } from "./ninth-chains-d";
import { ninthLettersA } from "./ninth-letters-a";
import { ninthLettersB } from "./ninth-letters-b";
import { ninthEchoes } from "./ninth-echoes";
import { tenthChainsA } from "./tenth-chains-a";
import { tenthChainsB } from "./tenth-chains-b";
import { tenthLettersA } from "./tenth-letters-a";
import { tenthLettersB } from "./tenth-letters-b";
import { tenthLettersC } from "./tenth-letters-c";
import { tenthLettersD } from "./tenth-letters-d";
import { tenthLettersE } from "./tenth-letters-e";
import { tenthEchoes } from "./tenth-echoes";
import { eleventhLettersA } from "./eleventh-letters-a";
import { eleventhLettersB } from "./eleventh-letters-b";
import { eleventhLettersC } from "./eleventh-letters-c";
import { eleventhLettersD } from "./eleventh-letters-d";
import { eleventhLettersE } from "./eleventh-letters-e";
import type { Document, Branch } from "../game/types";
export const chains = [...chainsA, ...chainsB, ...chainsC,
  ...townChainsA, ...townChainsB, ...townChainsC, ...townChainsD,
  ...secondChainsA, ...secondChainsB, ...secondChainsC, ...secondChainsD,
  ...thirdChainsA, ...thirdChainsB, ...thirdChainsC, ...thirdChainsD,
  ...fourthChainsA, ...fourthChainsB, ...fourthChainsC, ...fourthChainsD, ...fourthChainsE,
  ...fifthChainsA, ...fifthChainsB, ...fifthChainsC, ...fifthChainsD,
  ...sixthChainsA, ...sixthChainsB, ...sixthChainsC, ...sixthChainsD,
  ...eighthChainsA, ...eighthChainsB, ...eighthChainsC, ...eighthChainsD,
  ...ninthChainsA, ...ninthChainsB, ...ninthChainsC, ...ninthChainsD,
  ...tenthChainsA, ...tenthChainsB];
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
      kind: letter.kind ?? (["inspection","mapname","wagonroute","countesswalk","royalbook"].includes(chain.id) ? "official" : chain.id === "halfnotice" ? "archive" : "letter"),
    });
  }
}
daily.forEach((letter, i) => {
  const id = `daily/${i}`;
  register({ ...letter, id, sender: letter.sender!, kind: "letter" });
});
for (const doc of [...townLetters, ...echoes, ...secondLetters, ...secondEchoes, ...thirdLetters, ...thirdEchoes, ...fourthLetters, ...fifthLettersA, ...fifthLettersB, ...sixthLettersA, ...sixthLettersB, ...sixthEchoes, ...seventhLettersA, ...seventhLettersB, ...seventhLettersC, ...seventhLettersD, ...eighthLettersA, ...eighthLettersB, ...eighthLettersC, ...ninthLettersA, ...ninthLettersB, ...ninthEchoes, ...tenthLettersA, ...tenthLettersB, ...tenthLettersC, ...tenthLettersD, ...tenthLettersE, ...tenthEchoes, ...eleventhLettersA, ...eleventhLettersB, ...eleventhLettersC, ...eleventhLettersD, ...eleventhLettersE]) register(doc);
export const standaloneIds = Object.values(documents).filter(d => !d.chain).map(d => d.id);
export const branches: Branch[] = ["approve", "reject", "defer", "reply"];
