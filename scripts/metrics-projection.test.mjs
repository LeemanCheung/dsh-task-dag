import assert from 'node:assert/strict'
import test from 'node:test'
import { apply } from '../src/index.js'

function header(provider, model, reasoningEffort, adapterDefaults) {
  return {
    type: 'request/header',
    data: {
      header: {
        config: {
          provider,
          model,
          ...(reasoningEffort === undefined ? {} : { reasoningEffort }),
        },
        ...(adapterDefaults === undefined ? {} : { adapterDefaults }),
      },
    },
  }
}

test('host projection publishes the latest request route without header contents', () => {
  let definition
  const dispose = () => {}
  const ctx = {
    inject(names, install) {
      assert.deepEqual(names, ['sessionProjections'])
      return install({
        sessionProjections: {
          register(candidate) {
            definition = candidate
            return dispose
          },
        },
      })
    },
  }

  apply(ctx)
  assert.equal(definition.key, 'taskDagAgentMetrics')
  assert.equal(definition.stateVersion, 2)
  assert.equal(definition.wire.view(definition.init()), null)

  const first = definition.apply(definition.init(), header('openai', 'gpt-5.6', 'high'))
  assert.deepEqual(definition.wire.view(first), {
    provider: 'openai', model: 'gpt-5.6', reasoningEffort: 'high', reasoningSource: 'request-config',
  })
  assert.equal(definition.apply(first, header('openai', 'gpt-5.6', 'high')), first)
  assert.equal(definition.apply(first, { type: 'assistant/message', data: {} }), first)

  const unrelatedDefault = definition.apply(first, header('openai', 'gpt-5.6', 'high', { maxTokens: true }))
  assert.equal(unrelatedDefault, first)

  const adapterDefault = definition.apply(first, header('openai', 'gpt-5.6', 'high', { reasoningEffort: true }))
  assert.deepEqual(definition.wire.view(adapterDefault), {
    provider: 'openai', model: 'gpt-5.6', reasoningEffort: 'high', reasoningSource: 'adapter-default',
  })
  assert.notEqual(adapterDefault, first)

  const changed = definition.apply(adapterDefault, header('deepseek', 'deepseek-v4', undefined))
  assert.deepEqual(definition.wire.view(changed), {
    provider: 'deepseek', model: 'deepseek-v4', reasoningSource: 'not-recorded',
  })
  assert.deepEqual(definition.stateSchema.parse(changed), changed)
  assert.deepEqual(definition.wire.viewSchema.parse(definition.wire.view(changed)), changed)
  assert.throws(() => definition.stateSchema.parse({ provider: 'openai' }), /requires non-empty string provider and model/)
  assert.throws(() => definition.stateSchema.parse({ provider: '', model: 'gpt-5.6', reasoningSource: 'not-recorded' }), /requires non-empty/)
  assert.throws(() => definition.stateSchema.parse({
    provider: 'openai', model: 'gpt-5.6', reasoningSource: 'request-config',
  }), /must be a non-empty string/)
  assert.throws(() => definition.stateSchema.parse({
    provider: 'openai', model: 'gpt-5.6', reasoningEffort: 'high', reasoningSource: 'not-recorded',
  }), /must be absent/)
  assert.deepEqual(definition.stateSchema.parse({ ...adapterDefault, ignored: 'secret' }), adapterDefault)
})
