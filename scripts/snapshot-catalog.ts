import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {chains,documents} from '../src/content';
import {catalogDeltas,catalogAt,letterContract,chainContract} from '../src/game/catalog';
const digest=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const manifestPath='tests/fixtures/catalog-contracts.json';
const hashes:string[]=JSON.parse(readFileSync(manifestPath,'utf8'));
for(let i=0;i<hashes.length;i++)if(!catalogDeltas[i]||digest(catalogDeltas[i])!==hashes[i])throw new Error(`Catalog ${i+1} contract changed in place`);
let revisions=catalogDeltas;
const old=catalogDeltas.length?catalogAt(catalogDeltas.length):null;
const changed=Object.fromEntries(Object.values(documents).map(d=>[d.id,letterContract(d)] as const).filter(([id,c])=>JSON.stringify(c)!==JSON.stringify(old?.letters[id])));
const chainChanges=chains.map(chainContract).filter(c=>JSON.stringify(c)!==JSON.stringify(old?.chains.find(x=>x.id===c.id)));
if(old&&Object.keys(old.letters).some(id=>!documents[id]))throw new Error('Cannot remove an existing authored ID');
if(!Object.keys(changed).length&&!chainChanges.length){console.log('Catalog already matches authored source');}
else{
 const next={revision:catalogDeltas.length+1,chains:chainChanges,letters:changed};
 revisions=[...catalogDeltas,next];
 writeFileSync('src/game/catalog-contracts.json',JSON.stringify(revisions,null,2)+'\n');
 console.log(`Catalog revision ${next.revision}: ${Object.keys(changed).length} new/changed document contracts; ${chainChanges.length} chains`);
}
writeFileSync(manifestPath,JSON.stringify(revisions.map(digest),null,2)+'\n');
