import {decide,newGame} from './engine';
import {decide as decideV1,newGame as newGameV1} from '../legacy/v1/game/engine';
import {decide as decideV2,newGame as newGameV2} from '../legacy/v2/game/engine';
import {decide as decideV3,newGame as newGameV3} from '../legacy/v3/game/engine';
import type {GameState as V1State} from '../legacy/v1/game/types';
import type {GameState as V2State} from '../legacy/v2/game/types';
import type {GameState as V3State} from '../legacy/v3/game/types';
import type {Action,Decision,GameState} from './types';
import {catalogAt,latestCatalogRevision} from './catalog';
export const SAVE_KEY='dear-mayor:save:v1';
export type StorageLike=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
type Cursor={current:string;day:number;history:Decision[]};
function replay<T extends Cursor>(state:T,history:Decision[],step:(s:T,id:string,action:Action,reply?:number)=>T):T{
 for(const h of history){
  if(!h||h.id!==state.current||h.day!==state.day)throw new Error('Invalid history');
  const next=step(state,h.id,h.action,h.reply);
  if(next===state||next.history.at(-1)?.result!==h.result)throw new Error('Invalid decision');
  state=next;
 }
 return state;
}
function validBoundary(n:number,length:number){return Number.isInteger(n)&&n>=0&&n<=length;}
function v1ToV2(s:V1State):V2State{return {...s,version:2,contentVersion:2,legacyLength:s.history.length};}
function v2ToV3(s:V2State):V3State{return {...s,contentVersion:3,v2Length:s.history.length};}
function replayV2(seed:number,history:Decision[],v1Length:number):V2State{
 if(!validBoundary(v1Length,history.length))throw new Error('Invalid v1 boundary');
 const s=v1Length?v1ToV2(replay(newGameV1(seed),history.slice(0,v1Length),decideV1)):newGameV2(seed);
 return replay(s,history.slice(v1Length),decideV2);
}
function replayV3(seed:number,history:Decision[],v1Length:number,v2Length:number):V3State{
 if(!validBoundary(v2Length,history.length)||!validBoundary(v1Length,v2Length))throw new Error('Invalid v2 boundary');
 const s=v2Length?v2ToV3(replayV2(seed,history.slice(0,v2Length),v1Length)):newGameV3(seed);
 return replay(s,history.slice(v2Length),decideV3);
}
function migrateV3(s:V3State,revision=latestCatalogRevision,migrationVersion?:1|2|3):GameState{
 catalogAt(revision);
 return {...s,contentVersion:4,v3Length:s.history.length,initialCatalogRevision:revision,catalogRevision:revision,...(migrationVersion?{migrationVersion}:{})};
}
export function migrateV1(s:V1State):GameState{return migrateV3(v2ToV3(v1ToV2(s)),latestCatalogRevision,1);}
export function restore(raw:string):GameState{
 const p=JSON.parse(raw);
 if(!p||![1,2].includes(p.version)||!Number.isSafeInteger(p.seed)||!Array.isArray(p.history)||p.history.length>50000)throw new Error('Invalid save');
 let s:GameState;
 if(p.version===1)s=migrateV1(replay(newGameV1(p.seed),p.history,decideV1));
 else if(p.contentVersion===2)s=migrateV3(v2ToV3(replayV2(p.seed,p.history,p.legacyLength)),latestCatalogRevision,2);
 else if(p.contentVersion===3)s=migrateV3(replayV3(p.seed,p.history,p.legacyLength,p.v2Length),latestCatalogRevision,3);
 else if(p.contentVersion===4){
  if(!validBoundary(p.v3Length,p.history.length)||!validBoundary(p.v2Length,p.v3Length)||!validBoundary(p.legacyLength,p.v2Length))throw new Error('Invalid version boundary');
  catalogAt(p.initialCatalogRevision);
  if(p.migrationVersion!==undefined&&(![1,2,3].includes(p.migrationVersion)||
   (p.migrationVersion===1&&p.legacyLength!==p.v3Length)||
   (p.migrationVersion<=2&&p.v2Length!==p.v3Length)))throw new Error('Invalid pending migration version');
  s=p.v3Length||p.migrationVersion?migrateV3(replayV3(p.seed,p.history.slice(0,p.v3Length),p.legacyLength,p.v2Length),p.initialCatalogRevision,p.migrationVersion):newGame(p.seed,p.initialCatalogRevision);
  for(const h of p.history.slice(p.v3Length)){
   if(!h||h.id!==s.current||h.day!==s.day||!Number.isInteger(h.nextCatalogRevision)||h.nextCatalogRevision<s.catalogRevision)throw new Error('Invalid catalog history');
   catalogAt(h.nextCatalogRevision);
   const next=decide(s,h.id,h.action,h.reply,h.nextCatalogRevision);
   if(next===s||next.history.at(-1)?.result!==h.result)throw new Error('Invalid decision');
   s=next;
  }
  if(s.catalogRevision!==p.catalogRevision)throw new Error('Invalid catalog cursor');
 }else throw new Error('Invalid content version');
 if(s.current!==p.current||s.day!==p.day)throw new Error('Invalid cursor');
 return s;
}
export function loadGame(storage:StorageLike):{state:GameState;warning:string}{
 let raw:string|null=null;
 try{raw=storage.getItem(SAVE_KEY);return {state:raw?restore(raw):newGame(),warning:''};}
 catch{
  try{if(raw)storage.setItem(`${SAVE_KEY}:recovery`,raw);}catch{/* Keep original if backup fails. */}
  return {state:newGame(),warning:raw?'旧存档暂时无法读取，已尝试留存备份。继续批阅将开始新的一局。':'此浏览器暂不能保存进度；关闭页面后可能无法继续。'};
 }
}
export function saveGame(storage:StorageLike,state:GameState):boolean{
 try{
  const original=storage.getItem(SAVE_KEY);
  if(original){
   try{
    const old=JSON.parse(original);
    const version=old?.version===1?1:old?.version===2&&[2,3].includes(old.contentVersion)?old.contentVersion:null;
    if(version){const key=`${SAVE_KEY}:v${version}-backup`;if(!storage.getItem(key))storage.setItem(key,original);}
   }catch(error){if(!(error instanceof SyntaxError))throw error;}
  }
  storage.setItem(SAVE_KEY,JSON.stringify(state));return true;
 }catch{return false;}
}
