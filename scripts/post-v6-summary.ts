/** Summarize complete, measured samples; never replace missing runs with estimates. */
import {readFileSync,writeFileSync} from 'node:fs';
const before=JSON.parse(readFileSync('docs/post-v6-evidence/performance-before.json','utf8'));
const after=JSON.parse(readFileSync('docs/post-v6-evidence/performance-after.json','utf8'));
const median=(values:number[])=>[...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
const keys=['document','fcp','interactiveMs','fonts','offline','bodyTransferBytes','headerTransferBytes','cacheDecodedBytes'] as const;
function duplicates(row:any){const seen=new Set<string>();return row.requests.reduce((sum:number,r:any)=>{if(seen.has(r.url))return sum+r.bodyBytes;seen.add(r.url);return sum;},0);}
const rows=[];
for(const slow of [false,true])for(const mobile of [false,true]){
 const a=before.rows.filter((r:any)=>r.slow===slow&&r.mobile===mobile),b=after.rows.filter((r:any)=>r.slow===slow&&r.mobile===mobile);
 if(a.length!==3||b.length!==3)throw Error('Need three complete cold samples for every profile');
 if([...a,...b].some(r=>!r.offlineResizeReply||r.cache.length!==23))throw Error('Incomplete offline acceptance');
 const first=Object.fromEntries(keys.map(k=>[k,median(a.map((r:any)=>r[k]))]));
 const last=Object.fromEntries(keys.map(k=>[k,median(b.map((r:any)=>r[k]))]));
 rows.push({mobile,slow,before:{...first,duplicateNetworkBodyBytes:median(a.map(duplicates))},after:{...last,duplicateNetworkBodyBytes:median(b.map(duplicates))},offlineReductionPercent:100*(first.offline-last.offline)/first.offline,bodyReductionPercent:100*(first.bodyTransferBytes-last.bodyTransferBytes)/first.bodyTransferBytes});
}
const report={environment:after.environment,samplesPerProfile:3,profiles:4,rows};
function bundle(run:any){
 const entry=run.rows[0].cache.find((r:any)=>/\/assets\/[^/]+\.js$/.test(r.url));
 const request=run.rows[0].requests.find((r:any)=>r.url===entry.url&&r.encoding==='gzip');
 if(!entry||!request)throw Error('Missing measured JS resource');
 return {decodedKB:(entry.decodedBytes/1000).toFixed(2),serverGzipKB:(request.bodyBytes/1000).toFixed(2)};
}
const oldBundle=bundle(before),newBundle=bundle(after);
const normalExtra=rows.filter(r=>!r.slow).map(r=>r.after.offline-r.before.offline);
writeFileSync('docs/post-v6-evidence/performance-summary.json',JSON.stringify(report,null,2)+'\n');
const ms=(n:number)=>Math.round(n).toLocaleString('en-US'),mb=(n:number)=>(n/1e6).toFixed(3);
const line=(r:any,k:string,format=(v:number)=>ms(v))=>`${format(r.before[k])} → ${format(r.after[k])}`;
const md=['# V6后续首装性能：同条件前后对照','',
 '基线：开工804d09a的生产dist；候选：本轮最终生产dist。Windows、同依赖安装、同一gzip静态服务器代码；每个版本各桌面/移动仿真×正常/慢网×3个独立冷context，共24样本。测量时停止功能浏览器和Node回归；表中为3样本中位数。','',
 `环境：${after.environment.os}；${after.environment.cpu.trim()}；${after.environment.node}；Chromium ${after.environment.browser}。`,
 '桌面1672×941；移动390×844、isMobile/触摸、DPR2.75，默认Chromium UA；不是实体安卓。正常为未节流localhost；慢网沿用V6名义200000 bytes/s、首响应150ms、50ms FIFO共享预算，同时覆盖页面和worker请求，4×CPU。Windows定时器使实际吞吐低于名义值，不等同生产网络或标准网络整形器。','',
 'DOM=首封article和决策DOM出现；FCP=Paint Timing；可选择=FCP后两帧执行批准按钮DOM click且history确实为1；不包含真实手指/系统输入延迟，指针交互另由E2E验证。fonts.ready在文书DOM后监听；离线完成=完整安装完成并接管。服务器逐请求记录编码body和HTTP header，含SW流量，不含TCP/TLS；缓存大小按decoded响应计。','',
 '| profile | DOM ms | FCP ms | 可选择 ms | fonts.ready ms | 完整离线 ms | 传输body MB |','|---|---:|---:|---:|---:|---:|---:|',
 ...rows.map(r=>`| ${r.mobile?'移动仿真':'桌面'} / ${r.slow?'4× 慢网':'1× localhost'} | ${line(r,'document')} | ${line(r,'fcp')} | ${line(r,'interactiveMs')} | ${line(r,'fonts')} | ${line(r,'offline')} | ${line(r,'bodyTransferBytes',mb)} |`),'',
 '## 收益与边界','',
 ...rows.filter(r=>r.slow).map(r=>`- ${r.mobile?'移动仿真':'桌面'}慢网：完整离线中位数减少${r.offlineReductionPercent.toFixed(1)}%；首次网络body减少${r.bodyReductionPercent.toFixed(1)}%。同URL额外网络body ${mb(r.before.duplicateNetworkBodyBytes)} → ${mb(r.after.duplicateNetworkBodyBytes)} MB，依据逐请求日志，不是以磁盘体积代替传输。`),
 '- 收益来自首屏已下载响应经本构建SRI校验后复用。缺失/过期/错误响应会重载重试；最终仍缓存全部23项。字体与所有必要图片完整保留，不能据此声称字体或离线占用变小。',
 '- 首屏DOM/FCP/可选择没有足够证据支持加速宣称；慢网首屏仍受完整中文字体及主包影响。小毫秒差异不作统计显著性判断。源版本顺序固定为先基线后候选，未作交错随机实验。',
 `- 普通localhost完整离线中位数多约${Math.round(Math.min(...normalExtra))}～${Math.round(Math.max(...normalExtra))}ms，完整性校验有开销。保留该方案的依据是约40%的传输/慢网离线收益，不能称为所有指标全面加速；同版本比较同时包含本轮文稿与存档保护逻辑。`,
 `- 主JS ${oldBundle.decodedKB} → ${newBundle.decodedKB} kB；测量服务器gzip ${oldBundle.serverGzipKB} → ${newBundle.serverGzipKB} kB（从实际请求读取，不与Vite显示的gzip口径混用）。增长主要来自新增文稿/旧稿与保护逻辑。原大包警告保留，没有提高阈值或拆坏同步restore。`,
 '- 每样本在缓存完整后断网刷新、换另一宽度、打开批示并选择C，验证history推进到2。根/子路径、旧worker/多标签/失败重试与真实图片/字体另有完整E2E与实际V6升级证据。',
 '- 同资源不同提交使用独立版本缓存，防止build-info串版；不skipWaiting。已控制的旧标签关闭前保持旧worker；新格式仅清理同scope的过期缓存，旧V6无scope缓存保守保留一次，升级时会额外占用一份旧缓存。',
 '', '| profile | cache decoded MB before → after | header bytes before → after |','|---|---:|---:|',
 ...rows.map(r=>`| ${r.mobile?'移动':'桌面'} / ${r.slow?'慢网':'正常'} | ${line(r,'cacheDecodedBytes',mb)} | ${line(r,'headerTransferBytes')} |`),'',
 '原始每轮请求、缓存清单和时钟见 [before](post-v6-evidence/performance-before.json)、[after](post-v6-evidence/performance-after.json) 与 [summary](post-v6-evidence/performance-summary.json)。复现：保留开工dist到`.local/post-v6-20261021/baseline-dist`，当前构建写dist；分别设置`PERF_PHASE=before/after`运行`npx tsx scripts/post-v6-performance.ts`，再运行`npx tsx scripts/post-v6-summary.ts`。端口53532须空闲，测量期间停止其他测试。','',
 '实体安卓、Safari/Firefox、生产慢网和CDN边缘冷缓存、完整进程内存/长期泄漏为NOT_RUN。此报告不把localhost模型当作线上等待时间。',''];
writeFileSync('docs/POST-V6-PERFORMANCE.md',md.join('\n'));
console.log(JSON.stringify(rows,null,2));
