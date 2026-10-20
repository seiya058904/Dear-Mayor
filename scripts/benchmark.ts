import { performance } from 'node:perf_hooks';
import { writeFileSync } from 'node:fs';
import { decide,newGame } from '../src/game/engine';
import { saveGame,restore } from '../src/game/persistence';
import { decide as oldDecide,newGame as oldNew } from '../src/legacy/v1/game/engine';
const rows=[];
for(const count of [200,500,1000]) {
 let state=newGame();
 let old=oldNew();
 let t=performance.now();
 for(let i=0;i<count;i++)old=oldDecide(old,old.current,'approve');
 const legacyDecisions=performance.now()-t;
 t=performance.now();
 for(let i=0;i<count;i++)state=decide(state,state.current,'approve');
 const decisions=performance.now()-t;
 let stored='';
 const storage={getItem:()=>null,setItem:(_k:string,v:string)=>{stored=v;},removeItem:()=>{}};
 t=performance.now();
 for(let i=0;i<20;i++)saveGame(storage,state);
 const save=(performance.now()-t)/20;
 t=performance.now();
 for(let i=0;i<10;i++)restore(stored);
 const restoreMs=(performance.now()-t)/10;
 rows.push({count,legacyDecisionsMs:legacyDecisions,decisionsMs:decisions,averageDecisionMs:decisions/count,saveMs:save,restoreMs,bytes:Buffer.byteLength(stored)});
}
const report={environment:`Node ${process.version}, ${process.platform} ${process.arch}`,method:'Local Node timings; in-memory StorageLike, 20 saves, 10 restores, not a slow phone benchmark',rows};
writeFileSync('docs/PERFORMANCE.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
