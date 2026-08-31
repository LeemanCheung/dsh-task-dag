/**
 * Current public model-default references. They are display-only context: no
 * entry is evidence of an individual historical request or service response.
 * Keep each route association explicit and retain its evidence scope.
 */
export const PUBLIC_REASONING_REFERENCES = Object.freeze([
  Object.freeze({
    provider: 'openai',
    model: 'gpt-5.6-terra',
    effort: 'medium',
    evidenceScope: 'openai-api-model-page',
    historicalClaim: false,
    verifiedOn: '2026-08-31',
    sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5.6-terra',
  }),
  Object.freeze({
    provider: 'openai-codex',
    model: 'gpt-5.6-terra',
    effort: 'medium',
    evidenceScope: 'openai-api-model-page-reference-for-codex-route',
    historicalClaim: false,
    verifiedOn: '2026-08-31',
    sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5.6-terra',
  }),
])

const references = new Map(PUBLIC_REASONING_REFERENCES.map(entry => [
  `${entry.provider}\u0000${entry.model}`,
  entry,
]))

/** Return display-only public context for one exact route association. */
export function publicReasoningReference(provider, model) {
  if (typeof provider !== 'string' || typeof model !== 'string') return undefined
  return references.get(`${provider}\u0000${model}`)
}
