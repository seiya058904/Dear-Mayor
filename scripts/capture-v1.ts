import { writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { newGame, decide } from '../src/legacy/v1/game/engine';
import type { Action } from '../src/game/types';
const actions: Action[] = ['approve','reject','defer','written_reply'];
const cases = [
  [6271,0,0], [6271,1,0], [6271,1,1], [6271,1,2],
  [6271,1,3], [6271,1,4], [6271,1,5], [1,10,6],
  [935,20,6], [42,79,6], [6271,80,6], [5,80,0],
  [935,84,1], [4096,110,6], [16,20,3], [65535,79,5],
];
const fixtures = cases.map(([seed,count,plan]) => {
 let s=newGame(seed);
 for(let i=0;i<count;i++) {
  const action = plan===6 ? actions[(i*7+seed)%4] : plan>=3 ? 'written_reply' : actions[plan];
  s=decide(s,s.current,action,plan===6 ? i%3 : Math.max(0,plan-3));
 }
 return { name:`seed-${seed}-after-${count}-plan-${plan}`, state:s };
});
writeFileSync('tests/fixtures/v1-saves.json', JSON.stringify(fixtures,null,2)+'\n');
const files=['game/engine.ts','game/types.ts','content/index.ts','content/author.ts','content/daily.ts','content/chains-a.ts','content/chains-b.ts','content/chains-c.ts'];
const hashes: Record<string,string>={};
for(const file of files) {
 const baseline=execFileSync('git',['show',`fa76a25:src/${file}`]);
 const frozen=readFileSync(`src/legacy/v1/${file}`);
 // Copy-Item preserves source bytes. Compare bytes, not normalized strings.
 if(!baseline.equals(frozen)) throw new Error(`Snapshot differs: ${file}`);
 hashes[file]=createHash('sha256').update(frozen).digest('hex');
}
writeFileSync('tests/fixtures/v1-contract.json',JSON.stringify({commit:'fa76a25c3b31b3c1f4dd69c9d0531cc7ddaef61c',hashes},null,2)+'\n');
console.log(`${fixtures.length} fixed v1-format fixtures; ${files.length} frozen files match baseline bytes`);
