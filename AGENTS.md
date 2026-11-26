# Dear Mayor Agent Guide

Chinese letter-only fairytale game. Preserve the illustrated desk, single readable letter, four decisions, and quiet paper motion. Never add visible resources, scores, queues, dashboards, instant consequence summaries, or live AI calls.

## Source of Truth & Content Rules
- `docs/DECISIONS.md` (visual/brief contracts), `src/content/` (authored Chinese letters/consequences — never inflate via templates/name swaps), `src/game/` (deterministic transitions, scheduling, versioned saves), `public/art/` (never overlay live text on letters with baked text).
- Content additions (`docs/CONTENT.md`): 1 actionable request + 3 distinct authored replies + in-world consequence per letter; check IDs, references, reachability, scheduling, and fact consistency.

## Verification & CI Policy
- Run `npm run check`, `npm run build`, `npm run test:e2e`. After UI changes, inspect desktop (`1672×941`), laptop, and phone layouts and verify approve/reject/silence, reply cancel/select, refresh, rapid clicks, restart, and offline reload. Engine tests must distinguish refusal from silence and preserve causal branches across saves (automated checks ≠ human playtesting).
- Playwright locked at `1.64.1` (exact in `package.json`, Chromium build `1248` in `%LOCALAPPDATA%\ms-playwright`) — never upgrade, downgrade, or reinstall without dependency authorization.
- **CI minimal-test policy (owner decision 2026-10-27)**: never switch push/PR CI to the full suite. Push/PR runs typecheck + unit + 151 core browser tests + 40-test migration sample + 11 subpath smoke tests (`verify` gates deploy; `README`/`AGENTS`/`CLAUDE` changes skip CI); full 8-shard root+subpath matrix runs weekly/manual only.
