# V6 本地候选验收

> 发布阶段补记（2026-10-21）：用户提供独立审计摘要，结论为 PASS / GO，并授权按正常流程准备 V6 提交与发布。独立执行环境与原 Windows 验收不同；本轮原环境复跑、发布前保护和审计来源见 [V6-RELEASE.md](V6-RELEASE.md)。以下保留本地候选阶段的原时间、原数据与当时未提交/未发布的状态。

日期：2026-10-20（北京时间）。**本地候选；未 commit、push、发布或改远端配置；未使用子代理。**

## 范围与开工保护

开工 `git status --porcelain=v1` 为空。`git fetch --no-tags origin` 成功；HEAD 与 origin/main 都是指定 V5 `39fda12e86b52084db36654e9311105a8ae4b367`，左右计数 0/0。GitHub 只读查询确认 [Actions 39440810562](https://github.com/seiya058904/Dear-Mayor/actions/runs/39440810562) completed / success，headSha 同基线。V5 两份历史日志只在顶部补发布事实，原日志的时间、候选数据和视角没有改写。

仅新增 bluewash 与 readaloud 两组，共 12 个运行时片段；连同 V5 为 4 组 / 24 变体。静态 1160 节点、82 链、单局 860 封保持。运行时只改 `causal-pilot.ts/json` 与追加空目录 21，没有改原信、结果、请求、调度、种子、样式或美术。协议见 [V6-CAUSAL-PILOT.md](V6-CAUSAL-PILOT.md)，新两组完整真值表见 [V6-TRUTH-TABLE.md](V6-TRUTH-TABLE.md)。

## 实际检查结果

| 项目 | 结果 | 证据与范围 |
|---|---|---|
| `npm run check` | PASS，345/345 | TypeScript + 全量五个测试文件；无跳过；最终日志 `.local/v6-evidence/check-final.log` |
| `npm run build` | PASS | Vite 139 modules，22 个离线文件；主 JS 2814.13 kB / Vite gzip 1096.38 kB；原大包警告保留，没有调阈值；日志 `.local/v6-evidence/build.log` |
| 根路径 `npm run test:e2e` | PASS，120/120 | 原 73 项全部保留；新增 47 项（现有表驱动多出 2、新 V6 45）；日志 `.local/v6-evidence/e2e-root-r3.log` |
| `/Dear-Mayor/` `npm run test:e2e` | PASS，120/120 | 同一个 dist，独立 Node 静态服务 `http://127.0.0.1:52744/Dear-Mayor/`；日志 `.local/v6-evidence/e2e-subpath-r2.log` |
| 新两组 12 路离线全文 | PASS | 各来源真实决定到达目标，完整正文比较、开/取消批示、不写存档、刷新、离线重载、选批示 C、再刷新，无 console/pageerror |
| 旧 V5 目录 20 | PASS | 修改前 V5 实际生成 24 份完整文书/状态；正文、署名、三选项、取消与刷新，原存档字节保留；真实决定按旧结果并首次迁移 21，随后再恢复 |
| 旧 V4 完整文书 | PASS | 未修改 V5 源码生成的 207 个目录 1～18 Document 哈希，V6 恢复及再次恢复完整对照；旧状态哈希同时固定 |
| V1/V2/V3 | PASS | 原冻结字节与 55 份合成档，全 Document、六结果、迁入 pending、取消/刷新、备份、首次真实决定与历史回放；沿用原测试 |
| 三重目录与损坏来源 | PASS | 逐规则门槛；20→21 混合、20 开局/21 来源、缺版本/非整数/未来边界、动作/reply/result 不符、重复/缺失历史、迁移标记、失效锚点回退 |
| V5 逐字一致 | PASS | 旧两组 6 路 × 3 seeds × 860 决定，用原插入规则计算完整正文；另有修改前捕获的固定完整文书 |
| 稳定性 | PASS | 原 20 seeds × 1000 混合决定、原创耗尽门槛、无重复/堵塞、pending 清空、多检查点恢复；未改断言或算法 |
| 原有 6× CPU 长档门槛 | PASS | 根路径 1000 次决定恢复 913 ms；子路径 1186 ms；原限制 5000 ms 不变。独立 4×/节流对照见性能报告 |
| 九张定向截图 | PASS / 限定 | 1672×941、1366×768、390×844；批准、拒绝、批示三路径；全文/几何自动断言与逐张图像查看；无溢出、署名挤压或蜡封遮挡 |
| `git diff --check` | PASS | 无空白错误；Git 提示少数工作区行尾将规范化，不是验证失败 |
| V5/V6 性能对照 | 完成测量 | 8 个有效 profile；1920×1080 / 390×844，1×/4× CPU、共享慢网、首屏/FCP/选择/字体/SW 与实际字节、0/100/860 的三次恢复和 GC 后 JS heap；8/8 离线下一步通过。名义网络上限 1.6 Mbps，实测约 1.28 Mbps；没有宣称加速 |

测试浏览器为本地 Playwright Chromium；Browser plugin not available，按 frontend-testing-debugging 技能使用仓库 Playwright。实际流程：主页 → 注入由引擎合法生成的 pending → 完整来信 → 批示开/取消 → 刷新 → SW 激活 → 断网刷新 → 真实下一次决定 → 恢复。控件与原测试继续覆盖批准、不批准、搁置、批示选择、快速双击、重启、键盘焦点和错误存档保护。

## 失败记录与修复

1. 首次根路径收集阶段失败：新 `v6.spec.ts` 的 JSON import 缺 `with {type:'json'}`。补上测试导入属性；未改产品代码以绕过。
2. 第二次根路径 95 PASS、24 FAIL、1 NOT_RUN：新旧档按钮全文断言错误地漏计装饰字母 A/B/C。实际按钮由装饰 span 和正文 span 组成；改为精确匹配正文 span，保留完整文本相等。最终全量 120 PASS，未放宽断言、删测试或加超时。
3. 子路径服务首次尝试 4180 端口已被既有进程占用；没有终止该进程，换独立端口。
4. Python 静态服务的首轮子路径 89 PASS、30 FAIL、1 NOT_RUN，错误包括连接拒绝、相应资源错误和等待离线 ready 超时。服务仍在监听，属于并发请求时的连接接收不稳定；具体系统根因未单独证明。换用不记录每请求、backlog=511 的 Node 静态服务后，同一构建、相同 120 项、原超时全通过。原失败日志 `.local/v6-evidence/e2e-subpath.log` 保留。

没有把失败首轮算作成功，也没有改 Service Worker 或界面来消除测试基础设施问题。

性能测量另做过纠正：首轮未限速四次点击早于 FCP，改成等待绘制后重新测量，原四项丢弃；保留的慢网四项已逐项确认 FCP 早于真实点击。发现定时预算未达到名义持续吞吐后，如实报告约 159～160 kB/s 的实际值，没有冒称标准 1.6 Mbps。详情与原始样本见性能报告。

## 受保护文件与交付清单

[protection.json](v6-evidence/protection.json) 列出 151 个保护文件的 V5 Git blob SHA-256 与本地文件 SHA-256。148 个字节完全相等；另外三个 `src/content/cast-senders.json`、`cast.ts`、`eighth-chains-d.ts` 是原有 CRLF/LF 差别，换行规范化后内容相等，开工 Git 干净且本轮未写入这些路径。README、原 PNG/WebP、字体、图标、`src/legacy/v1～v3`、所有 `src/content`、UI、主引擎、持久化与旧正文快照未编辑。目录 1～20 的 JSON 值和旧 20 个哈希全部相同，只追加 revision 21 空增量及其新哈希。未暂存任何文件。

修改文件：

- `src/game/causal-pilot.ts`：逐规则门槛、版本可信性和唯一来源；`causal-pilot.json`：两个原组元数据与两组新原设计。
- `src/game/catalog-contracts.json`、`tests/fixtures/catalog-contracts.json`：只追加 21。
- `tests/causal-pilot.test.ts`：四组 24 路、旧正文哈希、目录 20、混合/损坏边界与锚点；`tests/v2-compatibility.test.ts`：允许已注册的四个 finale 动态正文，其他后续继续严格静态相等。动态组另逐条验证完整正文与来源，不以排除代替覆盖。
- `docs/V5-ACCEPTANCE.md`、`docs/V5-PROGRESS.md`：只加顶部发布事实。

新增文件：

- `tests/v6.spec.ts`；`tests/fixtures/catalog-20-saves.json` 及 `.sha256`；`tests/fixtures/v5-historical-render-hashes.json`。
- `scripts/v6-performance.ts`：无新增依赖的 V5/V6 同环境测量，带真实共享网络限速与浏览器 CPU 模拟。
- 本文、`V6-CAUSAL-PILOT.md`、`V6-TRUTH-TABLE.md`、`V6-PERFORMANCE.md`；`docs/v6-evidence/protection.json`、`performance.json`、`builds.json`（两版构建文件的大小与 SHA-256）；`docs/screenshots/v6/` 九张截图。

构建在忽略的 `dist/`；V5 基线副本、复核脚本、服务与各轮日志在忽略的 `.local/`，不会作为普通源文件交付或自动提交。完整性能对照与方法限制见 [V6-PERFORMANCE.md](V6-PERFORMANCE.md)。

## 未运行与不确定性

实体安卓、Safari、Firefox、系统书签/桌面图标选择、人工屏幕阅读器、独立文学编辑和长期真人试玩均为 **NOT_RUN**。390×844 的移动和 4× CPU/慢网为 **模拟**，不宣称真机通过。没有测试 V6 生产部署或线上可用性，因为本轮明确不发布。自动化与开发代理抽读不能证明长期人物记忆的真人感受。

## 截图索引

| 抽读路径 | 1672×941 | 1366×768 | 390×844 |
|---|---|---|---|
| 贝拉，批准 | [桌面](screenshots/v6/bluewash-0-1672.png) | [笔记本](screenshots/v6/bluewash-0-1366.png) | [手机](screenshots/v6/bluewash-0-390.png) |
| 奥黛，拒绝 | [桌面](screenshots/v6/readaloud-1-1672.png) | [笔记本](screenshots/v6/readaloud-1-1366.png) | [手机](screenshots/v6/readaloud-1-390.png) |
| 贝拉，批示 C | [桌面](screenshots/v6/bluewash-5-1672.png) | [笔记本](screenshots/v6/bluewash-5-1366.png) | [手机](screenshots/v6/bluewash-5-390.png) |
