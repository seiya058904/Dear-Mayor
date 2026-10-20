import pilot from './causal-pilot.json' with { type: 'json' };
import type { Document, GameState } from './types';

const firstCatalog = 20;
const anchors: Record<string, string> = {
  'clock/finale': '彼得添一句别一边修钟一边烤三炉，我让他写在角上了。',
  'cellarmusic/finale': '琴归阿满，酒窖归酒桶。',
};

/** A small, versioned prose echo. Every uncertain history boundary keeps the original letter. */
export function withCausalPilot(state: GameState, doc: Document): Document {
  if (state.migrationVersion !== undefined || state.initialCatalogRevision < firstCatalog || state.catalogRevision < firstCatalog) return doc;
  const caseFile = pilot.find(entry => entry.target === doc.id);
  if (!caseFile || !state.current.endsWith('/finale')) return doc;
  const source = state.history.find(entry => entry.id === caseFile.source);
  if (!source || source.nextCatalogRevision === undefined || source.nextCatalogRevision < firstCatalog) return doc;
  const variant = caseFile.variants.find(entry => entry.action === source.action &&
    (entry.reply === null ? source.reply === undefined : entry.reply === source.reply) &&
    entry.sourceResult === source.result);
  if (!variant) return doc;
  const anchor = anchors[doc.id];
  const body = doc.body[0];
  if (!anchor || !body || body.split(anchor).length !== 2) return doc;
  return { ...doc, body: [body.replace(anchor, `${anchor}${variant.draft}`), ...doc.body.slice(1)] };
}
