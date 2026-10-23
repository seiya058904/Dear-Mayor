import { readFileSync, writeFileSync } from 'node:fs';
const evidence = '.local/performance-20261023';
const raw = JSON.parse(readFileSync(`${evidence}/performance-ab.json`, 'utf8'));
if (raw.rows.length !== 40) throw Error(`Incomplete A/B: ${raw.rows.length}/40`);
const metrics = ['document', 'fcp', 'domChoiceReadyMs', 'illustratedReadyMs', 'interactiveMs', 'fonts', 'offline', 'firstInteractiveBytes', 'bodyTransferBytes', 'cacheDecodedBytes', 'revisitMs', 'offlineReloadMs', 'maxLongTaskMs', 'duplicateBodyBytes'];
for (const row of raw.rows) {
  row.maxLongTaskMs = Math.max(0, ...row.longTasks.map(t => t.duration));
  const seen = new Set();
  row.duplicateBodyBytes = row.requests.reduce((sum, r) => {
    const duplicate = seen.has(r.url); seen.add(r.url);
    return sum + (duplicate ? r.bodyBytes : 0);
  }, 0);
}
const stats = values => {
  const sorted = [...values].sort((a, b) => a - b);
  return { n: values.length, median: sorted[Math.floor(sorted.length / 2)], min: sorted[0], max: sorted.at(-1), samples: values };
};
const rows = [];
for (const mobile of [false, true]) for (const slow of [false, true]) {
  const row = { mobile, slow, metrics: {} };
  for (const metric of metrics) {
    const before = stats(raw.rows.filter(r => r.mobile === mobile && r.slow === slow && r.phase === 'before').map(r => r[metric]));
    const after = stats(raw.rows.filter(r => r.mobile === mobile && r.slow === slow && r.phase === 'after').map(r => r[metric]));
    if (before.n !== 5 || after.n !== 5) throw Error('Missing profile');
    row.metrics[metric] = { before, after, changePercent: before.median ? (after.median / before.median - 1) * 100 : null };
  }
  rows.push(row);
}
const summary = { baseline: 'e5fdeff444d21ae8f7698e23944daf5995c6f390', environment: raw.environment, method: raw.method, rows };
writeFileSync('docs/PERFORMANCE-2026-10-23.json', JSON.stringify(summary, null, 2) + '\n');
for (const row of rows) console.log(JSON.stringify({ mobile: row.mobile, slow: row.slow, metrics: Object.fromEntries(Object.entries(row.metrics).map(([k, v]) => [k, [v.before.median, v.after.median, v.changePercent]])) }));
