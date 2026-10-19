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
