/** Deterministic stratified reading material; exporting it is not a literary review. */
import {writeFileSync} from 'node:fs';
import {documents} from '../src/content';
import {catalogDeltas} from '../src/game/catalog';
import {rank} from '../src/game/engine';
const introduced=new Map<string,number>();
for(const delta of catalogDeltas)for(const id of Object.keys(delta.letters))if(!introduced.has(id))introduced.set(id,delta.revision);
const chosen=new Set<string>();
for(const chain of ['millerleave','ferrydaughter'])for(const suffix of ['start','approve','reject','defer','reply','continuation','finale'])chosen.add(`${chain}/${suffix}`);
for(const id of ['town/goose-feather-quill','town/teacup-left-handle','town/missing-page-two','town/brush-at-door'])chosen.add(id);
for(const chain of ['clock','cellarmusic','bluewash','readaloud'])for(const suffix of ['continuation','finale'])chosen.add(`${chain}/${suffix}`);
const buckets=new Map<string,string[]>();
for(const d of Object.values(documents)){
 const revision=introduced.get(d.id)!;
 const batch=revision===1?'early':revision<=9?'middle':'late';
 const key=[batch,d.stage??'standalone',d.kind??'letter'].join('/');
 buckets.set(key,[...(buckets.get(key)??[]),d.id]);
}
for(const ids of buckets.values())ids.sort((a,b)=>rank(a,20261021)-rank(b,20261021)||a.localeCompare(b));
while(chosen.size<120){
 for(const key of [...buckets.keys()].sort()){
  const next=buckets.get(key)!.find(id=>!chosen.has(id));
  if(next&&chosen.size<120)chosen.add(next);
 }
}
const rows=[...chosen].map(id=>({id,introducedRevision:introduced.get(id),document:documents[id]}));
writeFileSync('docs/POST-V6-READING-SAMPLE.json',JSON.stringify({method:'26 mandatory causal neighbours, then round-robin early/middle/late × stage × form, ranked by stable ID hash with seed 20261021. Current authored static text, not runtime variants. Export is not proof of review.',count:rows.length,rows},null,2)+'\n');
console.log(rows.map((r,i)=>`${i+1} ${r.id} [r${r.introducedRevision}/${r.document.stage??'standalone'}/${r.document.kind}]`).join('\n'));
