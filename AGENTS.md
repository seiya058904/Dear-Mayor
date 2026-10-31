# Dear Mayor

A Chinese, letter-only fairytale game. Preserve the illustrated desk, a single readable letter, four decisions and quiet paper movement. Never introduce visible resources, scores, queues, dashboards, instant consequence summaries or live AI calls.

## Source of truth
- `docs/DECISIONS.md`: resolved brief conflicts and visual contract.
- `src/content/`: authored Chinese letters and consequences. Do not inflate counts with templates or name swaps.
- `src/game/`: deterministic transitions, scheduling and versioned saves.
- `public/art/`: supplied illustrations and the edited blank decorated paper. Never overlay live text on a letter containing baked text.

## Working rules
Use the smallest safe change; preserve user work. No subagents unless the user asks. External publication, dependency updates and destructive operations require authorization. Do not commit credentials, local reference archives, browser profiles, test output or node_modules.

## Required verification
Run `npm run check`, `npm run build`, `npm run test:e2e`. Check actual desktop (1672×941), laptop and phone rendering after UI changes. Test approval, rejection, non-response, opening/cancelling/selecting replies, refresh, rapid clicks, restart and offline reload. Engine tests must distinguish refusal from silence and preserve causal branches across saves. Report limitations honestly; automated browser checks are not human playtesting.

## Content additions
Every letter has one actionable request and three distinct authored replies. Each decision supplies an in-world consequence; later letters may quote it. Check IDs, references, reachability, scheduling and contradictory facts. See `docs/CONTENT.md`.

## 浏览器测试依赖（固定版本）

- Playwright 固定 1.64.1：@playwright/test 已在 package.json 里精确锁定（不要写 ^、~ 或 latest），配套 chromium build 1248 位于 %LOCALAPPDATA%\ms-playwright。
- 不要升级、降级或另装第二个 Playwright 版本，也不要把浏览器下载到别的目录或自行构建 Chromium。
- 确需换版本时，先取得依赖更新授权，核对本仓库兼容性与浏览器配置，并运行相应浏览器回归；其他仓库各自按其范围和授权处理。

## CI policy (minimal-test principle)

The owner decided on 2026-10-27 that CI should run the smallest set of checks relevant to a change and keep heavy suites for schedules and manual runs. Do not undo this by running the full suite on every push.

- Pushes and pull requests run the type check and unit tests, the 151 core browser tests, a 40-test sample of the three version-migration matrices (278 tests that repeat the same behavior), and an 11-test smoke run under the Pages subpath.
- The complete suite, with every test at the root and the subpath in eight shards, runs weekly and on manual dispatch.
- The `verify` job is the single gate for deploy. README, AGENTS and CLAUDE changes do not start the workflow.

## Browser tool selection

- Prefer Ego Browser for exploratory navigation, visual review and interactive checks when available. Use Playwright for repeatable regression, CI, isolation, request interception or other automation requiring its APIs; combine tools when useful. If Ego is unavailable, use a suitable existing browser tool.
- Keep this repository's required browser commands, versions, profiles and safety boundaries; an exploratory check does not replace required automated tests. Do not alter real user data or production state for testing. Report the tools, coverage and any untested paths.
