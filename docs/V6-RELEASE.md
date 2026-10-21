# V6 发布前复核与独立审计来源

日期：2026-10-21（北京时间）。本记录固定此次提交前的门槛，不单凭本文件宣称 Pages 已发布成功；最终应核对该提交的 Actions、正式站 `build-info.json.commit` 与线上交互。

## 独立审计（用户提供的摘要）

用户在当前对话提供独立审计结果 **PASS / GO**，并同意按正常提交、推送、Actions、Pages SHA 和线上冒烟流程推进。以下为对该摘要的准确记录；完整审计 Markdown 未随消息附入仓库，不能将本文件冒称为独立报告原件。

- 实际 V6 ZIP 已解压；清单 306 个文件的 SHA-256 和大小均通过核对。
- 因果专项 38/38 通过，覆盖四组 24 路、旧目录、混合目录、损坏来源、锚点回退和 V5 文本一致性。
- 全部 345 个 Node 测试均有独立通过证据：342 项在隔离回归直接通过，另外 3 项因隔离目录缺冻结 `.ts` 文件出现 ENOENT，补入包中未经修改的冻结源码后通过 SHA-256 契约检查。没有报告产品逻辑失败。
- 独立环境为 Node 22、TypeScript 5.8，不等同本项目 Node 24、TypeScript 7 环境下完整 `npm run check`；独立方没有执行 Playwright。此前 345/345 和根/子路径 120/120 日志已由其核对，但不作为独立浏览器执行结果。
- 手机文字接近纸张装饰、首装预缓存较重被认定为非阻断问题，留待后续版本。本次不扩规则、不调字体或界面、不改 Service Worker。

## 原 Windows 环境重新执行

开工 `git fetch --no-tags origin` 后，HEAD/main/origin/main 均为 V5 `39fda12e86b52084db36654e9311105a8ae4b367`，左右计数 0/0。提交前将 289 个候选源码文件与审计交接清单逐一比较，完全相同；之后只补充本发布记录与候选验收文档顶部的阶段说明。

运行环境：Windows、Node v24.15.0、npm 11.12.1、TypeScript 7.0.2，使用现有锁文件与依赖，没有更新依赖或工作流。

| 门槛 | 本次实际结果 |
|---|---|
| `npm run check` | PASS，345/345，0 fail / skip |
| `npm run build` | PASS，139 modules；主 JS 2814.13 kB，Vite gzip 1096.38 kB；22 个离线条目，原大包警告保留 |
| `npm run test:e2e` 根路径 | PASS，120/120 |
| `npm run test:e2e` `/Dear-Mayor/` | PASS，120/120 |
| 原 6× CPU / 1000 决定恢复 | 根路径 1373 ms；子路径 1513 ms；原限制 5000 ms 不变 |
| `git diff --check` | PASS |
| 保护范围 | README、src/content、src/legacy、原美术/字体/图标、样式、主引擎、持久化、package/lock 与工作流均未修改 |

两套浏览器测试使用同一 `dist/` 的独立本地静态服务 `127.0.0.1:52661`，根和子路径分别执行，没有降低断言、删测试或提高原时限。原始日志保留在忽略目录 `.local/v6-release-20261021/`，不提交 node_modules、浏览器档案、临时测试输出或 ZIP。

## 发布验证路径

发布前已在正式 V5 的隔离持久浏览器中保存目录 20 的 `bluewash/finale` pending。正式站当时为 commit `39fda12…`、SW cache `dear-mayor-7460dadc04d0`。该合成存档未因加载改变，正文匹配 V5 原文；使用独立临时档案，没有接触个人浏览器存档。

正常推送该提交后，必须依次确认：

1. `Verify and publish` 的 verify/deploy 均通过，headSha 与推送提交一致。
2. 从该运行下载 Pages artifact，核对正式站文件字节及 `build-info.json.commit`，不把上传 artifact 当成生产成功。
3. 正式站执行原游戏流程冒烟；再检查新目录 21 的批准、拒绝、批示路径全文、取消、刷新、离线重载和下一次决定。
4. 重开上面保留的 V5 旧缓存档案，等待新 SW，确认目录 20 pending 仍是原文，离线真实决定后再迁至 21；另外复核 V5 clock 旧回声未消失。

上述发布后证据应按最终 SHA 单独记录，不能提前写成通过。GitHub 仓库入口与现有 [Pages 工作流](../.github/workflows/pages.yml) 可用于定位实际运行。

真实安卓硬件、Safari、Firefox、系统图标选择、人工屏幕阅读器和长期真人试玩仍为 NOT_RUN。性能结论沿用 [V6-PERFORMANCE.md](V6-PERFORMANCE.md) 的受控模拟范围，不宣称首屏加速。
