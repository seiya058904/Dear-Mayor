import { writeFileSync } from 'node:fs';
import { chains, documents, standaloneIds } from '../src/content';
import { auditCatalog } from '../src/content/audit';
import { newCast, castRevisionNotes } from '../src/content/cast';
import { newGame, decide } from '../src/game/engine';
import type { Action } from '../src/game/types';
import fixtures from '../tests/fixtures/v1-saves.json';
import v2Fixtures from '../tests/fixtures/v2-saves.json';
import v3Fixtures from '../tests/fixtures/v3-saves.json';
import catalogFixtures from '../tests/fixtures/catalog-1-saves.json';
import catalogTwoFixtures from '../tests/fixtures/catalog-2-saves.json';
import catalogThreeFixtures from '../tests/fixtures/catalog-3-saves.json';
import catalogFourFixtures from '../tests/fixtures/catalog-4-review-saves.json';
import catalogSixFixtures from '../tests/fixtures/catalog-6-saves.json';
import catalogSevenFixtures from '../tests/fixtures/catalog-7-review-saves.json';
import catalogEightFixtures from '../tests/fixtures/catalog-8-saves.json';
import catalogNineFixtures from '../tests/fixtures/catalog-9-saves.json';
import catalogTenFixtures from '../tests/fixtures/catalog-10-saves.json';
import catalogElevenFixtures from '../tests/fixtures/catalog-11-saves.json';
import catalogTwelveFixtures from '../tests/fixtures/catalog-12-saves.json';
import catalogThirteenFixtures from '../tests/fixtures/catalog-13-saves.json';
import catalogFourteenFixtures from '../tests/fixtures/catalog-14-saves.json';
import catalogFifteenFixtures from '../tests/fixtures/catalog-15-saves.json';
import catalogSixteenFixtures from '../tests/fixtures/catalog-16-saves.json';
import catalogSeventeenFixtures from '../tests/fixtures/catalog-17-saves.json';
import catalogEighteenFixtures from '../tests/fixtures/catalog-18-review-saves.json';
import catalogTwentyFixtures from '../tests/fixtures/catalog-20-saves.json';
import catalogTwentyOneFixtures from '../tests/fixtures/catalog-21-audit-saves.json';
import {catalogAt,latestCatalogRevision,letterContract} from '../src/game/catalog';
import { documents as legacyDocuments } from '../src/legacy/v1/content';
const actions:Action[]=['approve','reject','defer','written_reply'];
const audit=auditCatalog(documents);
const docs=Object.values(documents);
const previousDocuments=catalogAt(Math.max(1,latestCatalogRevision-1)).letters;
const simulations=[];
for(let seed=0;seed<20;seed++) {
 let s=newGame(seed);
 for(let i=0;i<1000;i++) s=decide(s,s.current,actions[(seed+i*7)%4],(i+seed)%3);
 simulations.push({seed,decisions:s.history.length,authored:s.history.filter(h=>documents[h.id]).length,days:s.day,pending:s.pending.length,unique:new Set(s.history.map(h=>h.id)).size});
}
const visited=new Set<string>();
for(const action of actions) for(const reply of [0,1,2]) {
 let s=newGame(37+reply);
 while(!s.current.startsWith('season/')) {visited.add(s.current);s=decide(s,s.current,action,reply);}
}
const plain=docs.filter(d=>!d.chain&&!d.requires).length;
const gated=docs.filter(d=>!d.chain&&d.requires).length;
const sourceGroups=new Set(docs.filter(d=>!d.chain).map(d=>d.requires?.id).filter(Boolean)).size;
const count=chains.length*4+plain+sourceGroups;
const before=Object.keys(legacyDocuments).length;
const prose=(d:typeof docs[number])=>JSON.stringify([d.body,d.replies,d.results]);
const rewritten=docs.filter(d=>legacyDocuments[d.id]&&prose(d)!==prose(legacyDocuments[d.id])).length;
const report={status:docs.length>=before*10?'TARGET_REACHED':'PARTIAL',target:before*10,before,uniqueAuthoredNodes:docs.length,newAuthoredNodes:docs.filter(d=>!legacyDocuments[d.id]).length,rewrittenLegacyNodes:rewritten,remainingToTarget:before*10-docs.length,reachableInOneRun:count,distinctStorylines:chains.length,newCharacters:newCast.length,minBodyCharacters:Math.min(...docs.map(d=>d.body.join('').length)),maxBodyCharacters:Math.max(...docs.map(d=>d.body.join('').length)),previousBatchNodes:Object.keys(previousDocuments).length,newNodesThisBatch:docs.filter(d=>!previousDocuments[d.id]).length,changedPreviousMachineContractsThisBatch:docs.filter(d=>previousDocuments[d.id]&&JSON.stringify(letterContract(d))!==JSON.stringify(letterContract(previousDocuments[d.id] as typeof docs[number]))).length,standaloneItems:standaloneIds.length,unconditionalStandaloneItems:plain,conditionalEchoItems:gated,gatedChainOpenings:docs.filter(d=>d.chain&&d.requires).length,echoesPerRun:sourceGroups,specialOrUpperLevelItems:docs.filter(d=>d.kind==='official'||d.kind==='archive').length,postExhaustionRepeatingVariants:4,unionReachable:visited.size,missingReachable:docs.filter(d=>!visited.has(d.id)).map(d=>d.id),catalogRevision:latestCatalogRevision,catalogCompatibilityFixtureCases:catalogFixtures.length+catalogTwoFixtures.length+catalogThreeFixtures.length+catalogFourFixtures.length+catalogSixFixtures.length+catalogSevenFixtures.length+catalogEightFixtures.length+catalogNineFixtures.length+catalogTenFixtures.length+catalogElevenFixtures.length+catalogTwelveFixtures.length+catalogThirteenFixtures.length+catalogFourteenFixtures.length+catalogFifteenFixtures.length+catalogSixteenFixtures.length+catalogSeventeenFixtures.length+catalogEighteenFixtures.length+catalogTwentyFixtures.length+catalogTwentyOneFixtures.length,migrationFixtureCases:fixtures.length+v2Fixtures.length+v3Fixtures.length,v1FixtureCases:fixtures.length,v2FixtureCases:v2Fixtures.length,v3FixtureCases:v3Fixtures.length,migrationFixtureKind:'Synthetic saves produced with exact baseline engine; not collected player browser data',audit,simulations};
writeFileSync('docs/CONTENT-COVERAGE.json',JSON.stringify(report,null,2)+'\n');
const md=[
 '# 内容库存与覆盖（自动生成）','',
 `\`npm run content:report\` 从当前源码重新计算。状态 ${report.status}；相似度筛查不能代替文学审校。`,'',
 '| 项目 | 计数 |','|---|---:|',
 ...Object.entries(report).filter(([,v])=>typeof v==='number').map(([k,v])=>`| ${k} | ${v} |`),'',
 `静态 ${docs.length} 节点中，互斥故事分支与回声不能在同一局全见。单局 ${count} = ${chains.length}×4 + ${plain} + ${sourceGroups}。4 种耗尽后循环不计原创节点。`,
 '', '完整性错误：'+audit.errors.length+'；完全重复正文：'+audit.exactDuplicateBodies+'；四字片段 Jaccard ≥0.45 的可疑对：'+audit.suspicious.length+'。',
 `达到至少四节点的长重复句：${audit.repeatedSentences.length}。均在 JSON 报告列出；未通过替换字符规避检测。`,
 '', '1000+ 静态原创节点完整性门槛：'+(docs.length>=1000&&!audit.errors.length&&visited.size===docs.length?'PASS':'NOT_MET')+'（当前 '+docs.length+'；全池结构与调度覆盖，不等于文学验收）。1000 次决定模拟包含循环，不能充作 1000 封原创。',
 '', `${fixtures.length} 个 v1、${v2Fixtures.length} 个 v2、${v3Fixtures.length} 个 v3 固定样本及 ${report.catalogCompatibilityFixtureCases} 个旧内容目录样本是冻结引擎生成的合法格式回归夹具，包含 v1→v2 前缀及耗尽/循环。不是收集的玩家个人数据。实际测试结果见 QA。`,
 '', '## 二十种子长期模拟', '', '| seed | decisions | authored | unique IDs | days | pending |','|---:|---:|---:|---:|---:|---:|',
 ...simulations.map(s=>`| ${s.seed} | ${s.decisions} | ${s.authored} | ${s.unique} | ${s.days} | ${s.pending} |`),
 '', '## 全量库存', '', '| ID | 标题 | 署名 | 形式 | 阶段 | 前史条件及最早间隔 |','|---|---|---|---|---|---|',
 ...docs.map(d=>`| ${d.id} | ${d.title} | ${d.sender} | ${d.kind??'letter'} | ${d.stage??'独立'} | ${d.requires?`${d.requires.id}: ${d.requires.actions.join('/')} +${d.requires.days}天`:'—'} |`),
 '', '## 可疑重复句（需作者判断）','',...audit.repeatedSentences.map(p=>`- ${p.text}：${p.ids.join(', ')}`), '',
];
writeFileSync('docs/CONTENT-COVERAGE.md',md.join('\n').trimEnd()+'\n');
console.log(JSON.stringify(report,null,2));
if(audit.errors.length||report.missingReachable.length||simulations.some(s=>s.authored!==count||s.unique!==s.decisions||s.pending!==0)) process.exitCode=1;

const castLines=['# 作者用人物与误会备忘','', '这些设定不进入玩家 UI，不构成好感度或资源系统。关系是已写入正文的认识，不代表任意决定都已执行。','', '## 新登场的具名人物','', '| 名字 | 身份 | 口吻 | 熟人 | 小变化 | 误会或边界 |','|---|---|---|---|---|---|', ...newCast.map(c=>`| ${c.name} | ${c.role} | ${c.voice} | ${c.knows.join('、')} | ${c.change} | ${c.uncertainty} |`), '', '## 既有人物的固定口吻', '', '| 人物 | 既有署名 | 口吻 |','|---|---|---|', ...chains.filter(c=>!c.delays).map(c=>`| ${c.person} | ${c.sender} | ${c.voice} |`), '', '其他重复镇民：奥黛珍惜书也尊重读者；埃芙先听孩子怎么想；妮娜的关心常藏在盛汤中；伊莎不替当事人决定；欧妲不要求所有客人喜欢同一种枕头；赫敏想把公事说短、把礼物往返停下来。', '', '累计跨线：桥梁 → 埃芙/贝拉/伊沃/罗恩；钟楼 → 彼得/小蓟/露西安/维奥；菜摊鹅 → 赫伯/妮娜/布鲁诺/托比。面包 → 妮娜/达恩/露西安/塞缪尔；保暖 → 陶恩/玛塔/米拉/赫敏；投递 → 赛拉/艾琳/米拉/阿满。每组只有与真实首轮行动相符的一封回声。', '', '阿苔和老彭各自的旧称都不排斥树井共存；巡察名单、半截公文的误会均有后文解释。半截公文的补件由发件方自行查底稿后寄出，不暗示镇长拒绝后仍发了索件函。', '', '艾琳原为寡居居民，照顾花园是生活变化；新函中的“园丁”是对她花园经验的称呼，不改写原有家庭身份。', ''];
castLines.push('第三批跨线：钟匠教学 → 埃芙/小蓟/阿尔诺（至少190日跨年）；风筝私信 → 伊沃/栗米/小素/收到道歉的孩子；尤恩远行 → 格里特/伊沃/米拉。九组回声各按首轮真实行动择一；尤恩外镇故事开篇另须出发申请后25日。','');
castLines.push('第四批：罗恩与黛禾的家事不等于已接班；奥斯丁收错钱已查明不关洛洛；阿满练琴与客栈工时分开商量；玛蕾私访不附清街或赊账特权。梨根问询中的当次落果分配由双方另约，不强制沿用早前界沟线某一分支。织机、画稿与家人经历不因来信就默认归镇厅。','');
castLines.push('第五批：托文停用漏雨仓不等于已修好；斐拉借车、上门查看与停业退款分开；黛西原单退款不自动补订，新试样另问。希铎借原本、收抄页、到镇看书及拒借的交接各按实际；维奥未借成场地也可结束问询，不假记用过。莓可不凭沉默占草地，罗恩不凭急函接夜运。','');
castLines.push('第六批：缇玛的住宿与自用床帘分别约定；瑟禾是成年帮工，绮蔻的分段收款不改变原工钱；麦森婚礼后的来信不倒写婚礼日期。老彭先认清自家驴再结回事实。仓屋、织机、面粉三组回声只引用真实首轮决定，不默认后续申请也获批；累计十二组各择一。','');
castLines.push('第七批：彼得仍是面包师、贝拉仍是洗衣人；格里特仍经营磨坊，不兼职玻璃匠；菲恩只做这次拾物告知，不改清扫职业。斐尔、艾铎、维珀为不同手艺人。所有64封独立信有各自新情境；磨坊椅子不预言尤恩的出发、归期或此前借车结果。','');
castLines.push('第八批：斐尔的试布、维珀的彩片均为自有余料，不挪用客户订物；半日展框与半日茶摊后续均先结束旧约，再问新借，棋具已按约归还后才问抄页。柚宁的刻纹不充当准确报时；岚泽参加评比、私人尝味和自写奖签分别叙述。黛芬的私帘不等于公灯已改，艾琳的实见花与想象画分别标明。老彭可以真输，也仍会想下一局。','');
castLines.push('第十批：葵诺代领前先问瑞恩、未经署名须纠；砚舟只按回条认领，欧妲对开验差错说明；笙棠、泊禾均为成年人，取消宴不由镇厅判两人关系，演出意向另征双方本人。','');
castLines.push('第十一批：沿用已有镇民的熟悉口吻写出新日常，不新增具名角色；尤拉先停用松柄钳与黛芬分清灯芯，苔丝区分退回空封与未读信，托恩不把一声桥板响直接判作坏桥。','');
castLines.push('第九批：奥斯温未核名单可能伤到阿苔，只有批准张贴路径才写上墙后果；彼得改分工仍担原供货责任，琳朵为成年学徒。维奥与弦芽可不再合奏，玛塔自有旧直脚椅与新试样分开。檐朵的半日试位结束再询，延栖校自己的记尺而不改借量具。清扫比试不替代菲恩原工，玛蕾诗稿的身份与采用分开。新增灯、茶摊、刻纹烛三组四选一回声，只依真实首轮行动。','');
castLines.push(...castRevisionNotes,'');
writeFileSync('docs/CAST.md',castLines.join('\n'));
