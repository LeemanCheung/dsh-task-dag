import assert from 'node:assert/strict'
import test from 'node:test'
import {
  PUBLIC_REASONING_REFERENCES,
  publicReasoningReference,
} from '../src/reasoning-defaults.js'

test('Public reasoning references stay exact, source-attributed, non-historical, and fail closed', () => {
  assert.deepEqual(PUBLIC_REASONING_REFERENCES.map(entry => ({
    provider: entry.provider,
    model: entry.model,
    effort: entry.effort,
  })), [
    { provider: 'openai', model: 'gpt-5.6-terra', effort: 'medium' },
    { provider: 'openai-codex', model: 'gpt-5.6-terra', effort: 'medium' },
  ])
  for (const entry of PUBLIC_REASONING_REFERENCES) {
    assert.equal(entry.verifiedOn, '2026-08-31')
    assert.equal(entry.sourceUrl, 'https://developers.openai.com/api/docs/models/gpt-5.6-terra')
    assert.equal(entry.historicalClaim, false)
    assert.equal(publicReasoningReference(entry.provider, entry.model), entry)
  }
  assert.equal(PUBLIC_REASONING_REFERENCES[0].evidenceScope, 'openai-api-model-page')
  assert.equal(PUBLIC_REASONING_REFERENCES[1].evidenceScope, 'openai-api-model-page-reference-for-codex-route')
  assert.equal(publicReasoningReference('openai-codex', 'gpt-5.6-sol'), undefined)
  assert.equal(publicReasoningReference('unknown', 'gpt-5.6-terra'), undefined)
  assert.equal(publicReasoningReference('OPENAI-CODEX', 'gpt-5.6-terra'), undefined)
  assert.equal(publicReasoningReference(undefined, 'gpt-5.6-terra'), undefined)
})
