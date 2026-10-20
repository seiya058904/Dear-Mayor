import revisions from './catalog-contracts.json' with {type:'json'};
import proseSnapshots from './catalog-prose.json' with {type:'json'};
import type {Chain,Document} from './types';
export type LetterContract=Pick<Document,'id'|'sender'|'kind'|'chain'|'stage'|'requires'|'results'|'replies'>;
export type ChainContract=Pick<Chain,'id'|'delays'|'quotePrevious'>;
export type CatalogDelta={revision:number;chains:ChainContract[];letters:Record<string,LetterContract>};
export type Catalog={revision:number;chains:ChainContract[];letters:Record<string,LetterContract & Partial<Pick<Document,'title'|'body'>>>;standaloneIds:string[]};
export const catalogDeltas=revisions as unknown as CatalogDelta[];
export const latestCatalogRevision=catalogDeltas.length;
const cache=new Map<number,Catalog>();
export function catalogAt(revision:number):Catalog{
 if(!Number.isInteger(revision)||revision<1||revision>latestCatalogRevision)throw new Error('Unknown catalog revision');
 const saved=cache.get(revision);if(saved)return saved;
 const letters:Catalog['letters']={};
 const chains:ChainContract[]=[];
 for(const delta of catalogDeltas.slice(0,revision)){
  if(delta.revision!==catalogDeltas.indexOf(delta)+1)throw new Error('Invalid catalog sequence');
  Object.assign(letters,delta.letters);
  for(const chain of delta.chains){const i=chains.findIndex(c=>c.id===chain.id);if(i<0)chains.push(chain);else chains[i]=chain;}
 }
 // Keep a pending old request paired with its original prose and choices.
 // The earliest applicable snapshot wins when the same letter is edited again.
 const frozenProse=new Set<string>();
 for(const snapshot of proseSnapshots)if(revision<=snapshot.throughRevision){
  for(const [id,text] of Object.entries(snapshot.documents))if(letters[id]&&!frozenProse.has(id)){
   letters[id]={...letters[id],...text};frozenProse.add(id);
  }
 }
 const result={revision,chains,letters,standaloneIds:Object.values(letters).filter(d=>!d.chain).map(d=>d.id)};
 cache.set(revision,result);return result;
}
/** Only machine-relevant fields; authored bodies remain in the content library. */
export function letterContract(d:Document):LetterContract{
 return JSON.parse(JSON.stringify({id:d.id,sender:d.sender,kind:d.kind,chain:d.chain,stage:d.stage,requires:d.requires,results:d.results,replies:d.replies}));
}
export function chainContract(c:Chain):ChainContract{
 return JSON.parse(JSON.stringify({id:c.id,delays:c.delays,quotePrevious:c.quotePrevious}));
}
