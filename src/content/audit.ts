import type { Document } from '../game/types';

function shingles(text: string) {
  const plain = text.replace(/[\s\p{P}]/gu, '');
  return new Set(Array.from({length: Math.max(0, plain.length-3)}, (_,i)=>plain.slice(i,i+4)));
}
export function auditCatalog(documents: Record<string, Document>) {
  const errors: string[] = [];
  const suspicious: { a:string; b:string; similarity:number }[] = [];
  const docs=Object.values(documents);
  const bodies = new Map<string,string>();
  const phrases=new Map<string,Set<string>>();
  for (const d of docs) {
    if (!/^[a-z][a-z0-9-]*\/[a-z0-9-]+$/.test(d.id)) errors.push(`${d.id}: unstable ID`);
    if (!d.title.trim() || !d.sender.trim()) errors.push(`${d.id}: missing identity`);
    const body=d.body.join('');
    if (body.length < (d.kind==='note' ? 20 : 45) || !/[。？！]/.test(body) || !/[\u3400-\u9fff]/.test(body)) errors.push(`${d.id}: unreadable or empty body`);
    if (bodies.has(body)) errors.push(`${d.id}: duplicate body with ${bodies.get(body)}`);
    bodies.set(body,d.id);
    if (d.replies.length<3 || d.replies.length>4 || d.replies.some(r=>!r.text.trim()) || new Set(d.replies.map(r=>r.text)).size!==d.replies.length) errors.push(`${d.id}: reply options`);
    const results=[...Object.values(d.results), ...d.replies.map(r=>r.result)];
    if (results.some(r=>!r.trim()) || new Set(results).size!==results.length) errors.push(`${d.id}: missing or identical outcomes`);
    if (d.requires && (!documents[d.requires.id] || d.requires.id===d.id || !Number.isInteger(d.requires.days) || d.requires.days<1 || !d.requires.actions.length || d.requires.actions.some(a=>!['approve','reject','defer','written_reply'].includes(a)))) errors.push(`${d.id}: invalid causal source`);
    for(const sentence of [...d.body,...results].join('').split(/[。！？]/).filter(s=>s.length>=12)) {
      const ids=phrases.get(sentence)??new Set<string>(); ids.add(d.id); phrases.set(sentence,ids);
    }
  }
  const grams=docs.map(d=>shingles(d.body.join('')));
  for(let i=0;i<docs.length;i++) for(let j=i+1;j<docs.length;j++) {
    let shared=0; for(const gram of grams[i]) if(grams[j].has(gram)) shared++;
    const similarity=shared/(grams[i].size+grams[j].size-shared);
    if(similarity>=0.45) suspicious.push({a:docs[i].id,b:docs[j].id,similarity:Number(similarity.toFixed(3))});
  }
  const repeatedSentences=[...phrases].filter(([,ids])=>ids.size>=4).map(([text,ids])=>({text,ids:[...ids]}));
  return { errors, suspicious, repeatedSentences, exactDuplicateBodies:docs.length-bodies.size };
}
