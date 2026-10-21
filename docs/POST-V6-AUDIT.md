# V6 后续审计与修复（2026-10-21）

开工基线 `804d09a45601db416843f5994ec5580ee5a0271c`；main 与 origin/main 相同，左右 0/0，原工作区无未提交修改。目标 remote 为 `https://github.com/seiya058904/Dear-Mayor.git`。未使用子代理，未访问真实浏览器个人存档或 Knowledge 收藏。过程日志在忽略目录 `.local/post-v6-20261021/`。

## 事实、复现与选择

| ID | 严重性 / 状态 | 证据与最小复现 | 修复选择 |
|---|---|---|---|
| SAVE-01 | P1 / REPRODUCED | `persistence.ts`：仅令 `:recovery` setItem 抛错，主键可写；旧 loadGame 后 saveGame 返回 true，`{broken` 被新局覆盖。原始复现 JSON 已留本地 | 未保全的原始字符串禁止普通保存替换；仅坏档触发导出/取消/明确舍弃；舍弃须逐字核当前主键，已有不同恢复副本不覆盖 |
| SAVE-02 | P1 / REPRODUCED | `App.tsx` restart 先 persist 再无条件 setGame；注入主键写失败，页面显示新季而旧季仍在永久存储 | 只有重启保存成功才换季；失败在确认框明确说明并保留当前文书 |
| READ-01 | P1 / REPRODUCED | 生产构建实际字号：721=10.35、768=11.02、820=11.77、1024=14.70、1100=15.79px；不是仅推算 CSS | ≤1199px 或高度≤679px 使用自然流式纸面，CSS/JS/picture 同一媒体条件，保留1672参考布局 |
| READ-02 | P2 / REPRODUCED | 390截图正文紧贴金边，部分字穿过中段金饰；原52px内边距 | 流式纸面18%侧距、标题不外扩，新增按纸面13%装饰边界再留8px的几何门槛 |
| A11Y-01 | P2 / CONFIRMED | save-warning z-index8，高于 reply shade3，且不属于 inert game-table | 警告在弹层期间 inert，层级低于便笺；确认框增加读屏标题，保留原焦点圈/Escape/Tab循环 |
| NARR-01 | 产品局限 / CONFIRMED | 基线514无条件独立信多数结果只进入history；无结算UI是既定设计 | 两个默认seed首日事件新增延迟六路可见后信；使用现有ID、版本、精确来源协议，不加资源或即时结算 |
| NARR-02 | 产品局限 / CONFIRMED | 基线82链仅4组中段→结局精确六路文字 | 为millerleave、ferrydaughter加入生活细节回声，既有四组逐字保留 |
| PROSE-01 | P2 / CONFIRMED | teacup、quietchoir、post-near-letter用她/她们，而cellarmusic与dishwasher-one-song明确用他指同一阿满 | 修正指代；当前稿与旧pending通过目录22和完整旧文书样本隔离 |
| PROSE-02 | P2 / CONFIRMED | ferrydaughter/reject先说纸已取回，再申请取回；拒绝取回结果与起始事实冲突 | 改为已撤下、暂存驿站柜中；题名相应改为撤下，不改六结果 |
| PROSE-03 | P2 / CONFIRMED | quill正文的“核实际笔具/能代问一次”偏公函；teacup“写谁奇怪”像作者解释 | 两处短句精修，保留清晰请求、人物玩笑和全部六路语义 |
| REPORT-01 | P2 / CONFIRMED | 原自动报告记revision19；实际目录21 | 重新生成当前报告；新增可重跑的因果读点/真实引擎覆盖报告 |
| PERF-01 | P2 / REPRODUCED | 三次冷样本的同URL请求日志记录首屏后预缓存重复下载；基线23缓存条目，包含图标提交新增的favicon-32 | 候选用逐文件SRI校验复用HTTP响应，失败reload重试；完整资源就绪才激活；是否保留以同条件测量为准 |
| PERF-02 | P2 / CONFIRMED，候选自审 | 仅用运行资源hash作缓存名，会让相同资源的不同提交共享build-info；候选“已有条目即跳过”会留下旧提交元数据 | 提交SHA和预缓存脚本共同进入版本hash；独立临时目录以相同资源、不同提交运行真实构建脚本，断言缓存身份不同及build-info完整性 |

NOT_REPRODUCED：批示原有自定义焦点圈、Escape回焦和首尾Tab循环未见失败；不重做UI。损坏派生缓存由合法历史重建属于设计，不能据此把缓存修复误报为丢失历史。`defer`继续表示未回复，不建立待办。

## 基线门槛

Windows；Node v24.15.0、npm11.12.1、TypeScript7.0.2、Playwright1.64.1。复用与锁文件一致的现有合法安装（`npm ls --depth=0`核对），未更新依赖。开工10个测试源码文件，5个Node / 5个浏览器文件。

`npm run check` 345/345；build通过；同一dist根路径和 `/Dear-Mayor/` 各120/120；content:report通过、1160静态、860单局、revision21。主JS2814.13kB / Vite gzip1096.38kB，原大包警告保留。基线Actions [39553199065](https://github.com/seiya058904/Dear-Mayor/actions/runs/39553199065)成功仅代表基线。

## 内容边界

当前静态1160、82链、单局860不变。两个原独立后信改为全行动事件门槛（12/18日），无条件独立信514→512，条件节点72→74，18组四选一回声仍为72节点，另有2封共同行为回访。单局公式：82×4+512+18+2=860。不新增模板、不删原剧情。

新八组共48条运行时片段（原四组24条完整保留；新增四组24条）。新四组要求初始目录、当前目录和唯一来源决定版本均≥22，动作/reply/完整sourceResult精确相等，唯一锚点存在；独立回访还校验间隔。任何不确定情况回退原信。21或更早开局不因升级得到新动态正文，旧pending只在真实决定后升级。

目录1～21delta、旧正文快照、冻结v1/v2/v3、既有fixture及其哈希不得修改；本轮仅追加22和throughRevision21正文。54份修改前真实引擎生成的合成pending保存完整标题、正文、署名、三选项及全部六结果；不是玩家数据。

另从Git基线804d09a导出未修改源码，在目录1～21分别跑完整六种选择策略，共126局/81,168份完整pending文书，记录逐份Document的SHA-256流和耗尽后的完整状态哈希。当前引擎逐流精确匹配并恢复终态，覆盖所有旧目录，而不是只抽一个最新pending。新证据为追加的catalog-1-21-render-streams.json/sha256，不重写任何既有fixture。

审读范围与问题见 [内容审读记录](POST-V6-CONTENT-REVIEW.md)；覆盖见 [因果报告](CONTENT-IMPACT.md)。当前全库尚未经过独立文学编辑或千日真人试玩。

## 最终本机验收

本表固定原Windows、最终候选生产dist的提交前门槛；没有把本地通过等同线上发布。最终交付再核新提交的Actions head_sha、verify/deploy、避缓存HTTP build-info及正式站交互，不能引用开工804d09a的成功代替。

| 门槛 | 实际结果 |
|---|---|
| `npm run check` | 390/390 PASS，0 fail/skip；TypeScript通过 |
| `npm run build` | PASS，139 modules；JS 2832.32kB / Vite gzip1102.93kB，CSS8.74kB；23离线条目；原大包提示保留 |
| 同dist根路径E2E | 拆分旧档用例后396/396 PASS；6×CPU /1000决定恢复1349ms，原5000ms限制 |
| 同dist `/Dear-Mayor/` E2E | 拆分后396/396 PASS；同门槛恢复1324ms |
| 新六路来源 | 四组×六结果×五seeds实际引擎路径；每个目标再提交全部六结果并恢复；24条浏览器离线全文逐项通过 |
| 长程 | 20seeds×1000混合决定、无重复/互斥兄弟/堵塞、860原创、pending清空；原调度11历史哈希仍通过 |
| 旧存档 | 55份v1/v2/v3、285份旧目录合成样本；另126条完整旧目录策略流、81,168份pending及完整耗尽状态与804d09a精确匹配 |
| 异常存储 | 损坏/空串/未来版本/部分历史/非法action/reply；恢复成功/失败、已有不同恢复副本、配额全满、完全禁止storage、导出/取消/确认/主键变化保护；重启失败不换季 |
| 响应式 | 320、360、390、430、720、721、768、820、1024、1100、1199、1200、1366、1672、1920、2560及1440×600；正文≥17px，触摸≥44px，长短/跨年/签名与金饰分离 |
| 原桌面基线 | 1672×941首屏PNG SHA-256与开工截图完全相同（04288967…）；不是宣称与原参考图逐像素相同 |
| 弹层补核 | 320/390/721/1672的重启和坏档原生dialog共8条附加几何、按钮、Tab/Escape和取消保留检查通过 |
| SW/离线 | 所有23条缓存逐字节SRI核对，暂时失败/旧HTTP响应重试、未完成不激活、根子scope隔离、双旧标签等待更新；实际未修改V6 dist→最终dist两路径升级及旧pending离线决定通过 |
| 性能 | 前后各12冷样本；同条件三轮中位数：慢网完整离线约151/151秒→90/90秒；body约24.09/24.07→14.31MB，下降约40.6%；普通localhost离线就绪多约23～28ms。首屏无加速证据 |
| 仓库维护 | `npm audit --json`当时0漏洞；依赖/lock、冻结历史、公共字体/艺术/图标均保留；main保护端点404，未调整设置 |

完整数字和口径见 [性能对照](POST-V6-PERFORMANCE.md)、[原始样本](post-v6-evidence/performance-summary.json)、[保护清单](post-v6-evidence/protection.json)、[真实旧构建升级](post-v6-evidence/actual-v6-upgrade.json)。content:report、content:impact、content:audit-sample重跑均退出0，六个报告输出SHA-256未变；git diff --check通过。

九张定向实际截图和几何记录见 [ui-final.json](post-v6-evidence/ui-final.json)。[1672桌面](screenshots/post-v6/desktop-1672.png)、[1366笔记本](screenshots/post-v6/laptop-1366.png)、[721平板长信](screenshots/post-v6/tablet-721-long.png)、[320长信](screenshots/post-v6/mobile-320-long.png)、[390长信](screenshots/post-v6/mobile-390-long.png)、[批示](screenshots/post-v6/reply-390.png)、[坏档](screenshots/post-v6/recovery-dialog.png)、[手机坏档](screenshots/post-v6/recovery-390.png)、[羽毛笔批示B回访](screenshots/post-v6/quill-reply-B-390.png)均已直接查看。README原三张V1文字/背景截图过时，换为本次真实构建画面，正文仍全英文。

Browser plugin not available，使用仓库Playwright/隔离Chromium。实体安卓、Safari、Firefox、人工屏幕阅读器、千日真人文学试玩、生产慢网/CDN边缘冷缓存与长期完整进程内存为NOT_RUN。现有多数独立信仍仅保存结果，本轮没有冒称全库文学完成或全选择都有专属后续。游戏仍为单信、四决定和纸面动作，没有即时结算、资源数字、日志UI或实时AI。

## 失败与纠正（保留归因）

- 首次类型检查：可选contentVersion传给includes触发TS2345，已明确处理undefined；未改检查级别。
- 新增Node回归首轮385/386通过，完整旧pending比对发现当前source.requires泄入旧目录文书，修复currentDocument缺省门槛合并，随后全量387/387通过。再追加缓存身份回归后，以最终全量数为准。
- 首轮定向浏览器106通过、2失败：430和低高度1440的字号测量用整数offsetWidth作分母，17px被误算为16.99px；改用scene实际变换比例，17px门槛未变。原失败截图/trace保留本地。
- 第一轮完整根/子路径各230通过、3失败、1未运行：新增按钮aspect-ratio与min-height引发320/360网格自动最小宽度362px。以minmax(0,1fr)和min-width:0修复产品；保留原溢出断言。之后4项定向回归通过；最终完整结果另表列出，不把失败轮计作PASS。
- 早期候选全量根路径235/235通过后，缓存身份自审追加了PERF-02修复；两套完整验收会针对最终dist重新运行。
- 全人物指代额外核查补到quietchoir/defer两处“她”。仅向本轮未发布的22候选新增对应契约、向新throughRevision21快照增加旧稿；没有替换历史1～21delta或既有四份快照。最终材料为五份正文旧稿、八项22契约。
- 已废弃的串行预缓存候选只采了6个正常网样本：消除了约9.8MB重复body，但普通localhost离线就绪约366ms，高于基线约278ms。为减小串行开销改用并行安装；该候选样本与中止日志保留在.local，不混入最终12个候选样本。

## 2026-10-22 云端验收补核

首次推送1496682的 [Actions 39628703547](https://github.com/seiya058904/Dear-Mayor/actions/runs/39628703547) 中，Node检查和构建通过；根路径浏览器234项通过、1项失败、依赖其成功的性能项未运行，子路径与部署未执行。失败是目录2的16份旧档共用一项测试，累计超过原30秒时限；未报告内容或存档断言不相等。该轮不能视为发布成功，线上仍为804d09a。

将目录1～17现有分组中的每份样本分别注册为测试，保留每份正文ID、未写回原档、真实决定、历史前缀、目录升级、刷新恢复的全部原断言。没有增加timeout、降低阈值或跳过样本；同一批样本令完整浏览器测试数236→396。产品代码、目录、既有fixture字节及生产资源均不因此改变。后续验收以补丁提交的两个完整路径结果及其Actions为准。

补丁提交前，同一生产dist在根路径396/396、子路径396/396通过，均0失败/跳过；原6×CPU性能项分别1349/1324ms。本机使用8个功能worker，性能项仍在功能套件完成后独占执行；云端保持原有默认worker数，不以本机结果替代云端验收。原提交前236/236两路径的成功记录仍有效，但不是本次最终测试数。正式发布的最终SHA、Actions与线上检查记录由交付报告另核，避免自引用提交哈希。
