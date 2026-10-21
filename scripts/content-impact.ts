/** Causal read sites, not prose similarity: catalog scheduling + actual renderer + replay. */
import {writeFileSync} from 'node:fs';
import {documents} from '../src/content';
import {catalogAt,latestCatalogRevision} from '../src/game/catalog';
import {newGame,decide,currentDocument,eligibleDay} from '../src/game/engine';
import pilot from '../src/game/causal-pilot.json' with {type:'json'};
import type {Action,GameState} from '../src/game/types';
export const outcomes:[Action,number?][]=[['approve'],['reject'],['defer'],['written_reply',0],['written_reply',1],['written_reply',2]];
export function impactReport(revision=latestCatalogRevision){
 const catalog=catalogAt(revision),rules=pilot.filter(r=>r.introducedRevision<=revision);
 const gates=Object.values(catalog.letters).filter(d=>d.requires);
 const rows=Object.values(catalog.letters).map(d=>{
  const chain=catalog.chains.find(c=>c.id===d.chain);
  const targets=gates.filter(t=>t.requires!.id===d.id);
  const rule=rules.find(r=>r.source===d.id);
  const choices=outcomes.map(([action,reply])=>{
   const ids:string[]=[],text:string[]=[],schedule:string[]=[];
   if(d.stage===1){
    const suffix=action==='written_reply'?'reply':action;
    ids.push(`${d.chain}/${suffix}`);
    schedule.push(`${d.chain}/${suffix} +${chain?.delays?.[0]??2}d`);
    if(action==='written_reply'&&chain?.quotePrevious!==false)text.push(`${d.chain}/reply: ${d.replies[reply!].result}`);
   }
   // An all-actions gate remembers that the event happened, but by itself cannot
   // distinguish which choice was made. Keep that separate from choice coverage.
   for(const target of targets)if(target.requires!.actions.includes(action)&&target.requires!.actions.length<4){
    ids.push(target.id);schedule.push(`${target.id} >=${target.requires!.days}d`);
   }
   const variant=rule?.variants.find(v=>v.action===action&&v.reply===(reply??null));
   if(variant)text.push(`${rule!.target}: ${variant.draft}`);
   const visible=ids.length>0||text.length>0;
   return {action,reply:reply??null,classification:visible?'VISIBLE':d.chain?'HIDDEN_STATE_ONLY':'SAVE_ONLY',replyIndexAffectsFuture:action==='written_reply'?(Boolean(variant)||(d.stage===1&&chain?.quotePrevious!==false)):null,sourceResultReadByRenderer:Boolean(variant)||(action==='written_reply'&&d.stage===1&&chain?.quotePrevious!==false),futureIds:ids,schedule,text};
  });
  return {id:d.id,stage:d.stage??null,kind:d.kind??'letter',category:d.chain?'chain':d.requires?'conditional':'standalone',distinctFutureChoiceSignatures:new Set(choices.map(c=>JSON.stringify([c.futureIds,c.schedule,c.text]))).size,sharedEventFollowups:targets.filter(t=>t.requires!.actions.length===4).map(t=>({id:t.id,days:t.requires!.days})),choices};
 });
 // Reach every static node through six uniform policies. Observe actual documents,
 // decisions, gate dates and rule insertion, then restore is separately tested.
 const seen=new Set<string>(),evidence:unknown[]=[];
 for(let v=0;v<6;v++){
  let s=newGame(6271,revision);
  for(let n=0;n<1200&&!s.current.startsWith('season/');n++){
   const doc=currentDocument(s);seen.add(doc.id);
   const rule=rules.find(r=>r.target===doc.id);
   if(rule){
    const source=s.history.find(h=>h.id===rule.source)!;
    const variant=rule.variants.find(x=>x.action===source.action&&x.reply===(source.reply??null)&&x.sourceResult===source.result)!;
    if(!variant||!doc.body.join('').includes(variant.draft))throw Error(`Missing runtime echo ${rule.target}/${v}`);
    evidence.push({source:source.id,target:doc.id,action:source.action,reply:source.reply??null,sourceDay:source.day,targetDay:s.day,sourceResult:source.result,visibleText:variant.draft});
   }
   if(catalog.letters[doc.id]?.requires&&eligibleDay(doc.id,s)>s.day)throw Error(`Premature ${doc.id}`);
   const [action,reply]=outcomes[v];s=decide(s,s.current,action,reply,revision);
  }
 }
 if(seen.size!==Object.keys(catalog.letters).length)throw Error('Missing reachable nodes');
 const summary={nodes:rows.length,visibleSourceNodes:rows.filter(r=>r.choices.some(c=>c.classification==='VISIBLE')).length,exactDelayedEchoSources:rules.length,sixWayDistinguishableSources:rows.filter(r=>r.distinctFutureChoiceSignatures===6).length,replyIndexVisibleSources:rows.filter(r=>r.choices.some(c=>c.replyIndexAffectsFuture===true)).length,visibleOutcomeCases:rows.flatMap(r=>r.choices).filter(c=>c.classification==='VISIBLE').length,hiddenOutcomeCases:rows.flatMap(r=>r.choices).filter(c=>c.classification==='HIDDEN_STATE_ONLY').length,saveOnlyOutcomeCases:rows.flatMap(r=>r.choices).filter(c=>c.classification==='SAVE_ONLY').length,unconditionalStandaloneNodes:rows.filter(r=>r.category==='standalone').length,conditionalNodes:rows.filter(r=>r.category==='conditional').length,runtimeReachableNodes:seen.size};
 const breakdown=Object.fromEntries(['category','stage','kind'].map(key=>[key,Object.fromEntries([...new Set(rows.map(r=>String(r[key as keyof typeof r])))].sort().map(value=>{const group=rows.filter(r=>String(r[key as keyof typeof r])===value);return [value,{nodes:group.length,visibleSources:group.filter(r=>r.choices.some(c=>c.classification==='VISIBLE')).length,visibleOutcomes:group.flatMap(r=>r.choices).filter(c=>c.classification==='VISIBLE').length}];}))]));
 return {revision,summary,breakdown,runtimeEvidence:evidence,rows};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/content-impact.ts')){
 const before=impactReport(21),after=impactReport();
 const report={method:'Choice-specific forward dataflow at catalog/eligibleDay/decide/currentDocument/withCausalPilot read sites; six actual engine policies at seed 6271 verify reachability and every runtime fragment. VISIBLE may be an action-level branch shared by A/B/C; replyIndexAffectsFuture and distinctFutureChoiceSignatures explicitly distinguish exact instructions. exactDelayedEchoSources excludes the older stage1-to-reply result quotation. Shared all-action event gates are separate. HIDDEN_STATE_ONLY = chain facts differ with no later registered visible read; SAVE_ONLY = standalone outcome only stored. No claim of exhaustive natural-language causality or independent literary review.',baselineCommit:'804d09a45601db416843f5994ec5580ee5a0271c',before,after};
 writeFileSync('docs/CONTENT-IMPACT.json',JSON.stringify(report,null,2)+'\n');
 writeFileSync('docs/CONTENT-IMPACT.md',['# 玩家可见因果覆盖（自动生成）','',report.method,'','基线目录 21；当前目录 '+after.revision+'。不是文字相似度统计，也不将普通重复署名算作后果。','', '| 指标 | 基线 | 当前 |','|---|---:|---:|',...Object.keys(after.summary).map(k=>`| ${k} | ${before.summary[k as keyof typeof before.summary]} | ${after.summary[k as keyof typeof after.summary]} |`),'','每封信的六结果、未来 ID/日程/文字与分类，以及类别/阶段/体裁分组见 JSON。共同行为引发的到信不冒充六路选择差异。正式拒绝与未回复各自计算。','', '## 实际引擎可见文字落点','','| source | target | action/reply | source day → target day | visible text |','|---|---|---|---|---|',...after.runtimeEvidence.map((e:any)=>`| ${e.source} | ${e.target} | ${e.action}/${e.reply??'-'} | ${e.sourceDay} → ${e.targetDay} | ${e.visibleText} |`),'','运行 `npm run content:impact` 重建。其他 seed、恢复、隔离、旧目录和混合版本由回归测试覆盖；此报告不代替真人长期试玩。',''].join('\n'));
 console.log(JSON.stringify({before:before.summary,after:after.summary},null,2));
}
