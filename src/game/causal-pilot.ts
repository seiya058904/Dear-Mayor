import pilot from './causal-pilot.json' with { type: 'json' };
import type { Document, GameState } from './types';
import { latestCatalogRevision } from './catalog';

function trustedRevision(value: number | undefined, introduced: number): boolean {
  return Number.isInteger(value) && value! >= introduced && value! <= latestCatalogRevision;
}

/** A small, versioned prose echo. Every uncertain history boundary keeps the original letter. */
export function withCausalPilot(state: GameState, doc: Document): Document {
  const caseFile = pilot.find(entry => entry.target === doc.id);
  if (!caseFile || state.current !== doc.id) return doc;
  const revision = caseFile.introducedRevision;
  if (state.migrationVersion !== undefined ||
      !trustedRevision(state.initialCatalogRevision, revision) ||
      !trustedRevision(state.catalogRevision, revision) ||
      state.initialCatalogRevision > state.catalogRevision) return doc;
  const sources = state.history.filter(entry => entry.id === caseFile.source);
  if (sources.length !== 1) return doc;
  const source = sources[0];
  if ('minimumDays' in caseFile && typeof caseFile.minimumDays === 'number' &&
      (!Number.isInteger(source.day) || !Number.isInteger(state.day) || source.day + caseFile.minimumDays > state.day)) return doc;
  if (!trustedRevision(source.nextCatalogRevision, revision) ||
      source.nextCatalogRevision! > state.catalogRevision ||
      source.nextCatalogRevision! < state.initialCatalogRevision) return doc;
  const variant = caseFile.variants.find(entry => entry.action === source.action &&
    (entry.reply === null ? source.reply === undefined : entry.reply === source.reply) &&
    entry.sourceResult === source.result);
  if (!variant) return doc;
  const anchor = caseFile.anchor;
  const body = doc.body[0];
  if (!anchor || !body || body.split(anchor).length !== 2) return doc;
  return { ...doc, body: [body.replace(anchor, `${anchor}${variant.draft}`), ...doc.body.slice(1)] };
}
