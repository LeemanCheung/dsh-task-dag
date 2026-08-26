import assert from 'node:assert/strict'
import test from 'node:test'
import { attachWorkflowDefinitions, extractWorkflowDefinition } from '../src/workflow-definition.js'

function args(name, script, extra = {}) {
  return JSON.stringify({
    script,
    meta: {
      name,
      description: `Run ${name}`,
      whenToUse: 'When the work fans out',
      phases: [
        { title: 'scan', detail: 'Collect evidence', provider: 'spawn', model: 'fast', ignored: true },
        { title: '', detail: 'invalid' },
      ],
    },
    args: { secretRuntimeInput: 'not projected' },
    ...extra,
  })
}

function toolNode(id, anchorSeq, argsRaw, settled = true, toolName = 'workflow') {
  const call = { name: toolName, argsRaw }
  return {
    id,
    kind: 'tool-call',
    anchorSeq,
    data: {
      root: settled
        ? { kind: 'tool-result', callId: id, call }
        : { callId: id, ...call },
    },
  }
}

function runNode(id, anchorSeq, name) {
  return { id, kind: 'workflow-run', anchorSeq, data: { name, status: 'running', phases: [] } }
}

test('extracts the plain Workflow script and a bounded metadata projection', () => {
  const definition = extractWorkflowDefinition(toolNode('call-1', 10, args('audit-flow', "phase('scan')\nreturn []")))
  assert.equal(definition.script, "phase('scan')\nreturn []")
  assert.equal(definition.meta.name, 'audit-flow')
  assert.equal(definition.meta.description, 'Run audit-flow')
  assert.equal(definition.meta.whenToUse, 'When the work fans out')
  assert.deepEqual(definition.meta.phases, [{
    title: 'scan', detail: 'Collect evidence', provider: 'spawn', model: 'fast',
  }])
  assert.equal('args' in definition, false)
})

test('extracts an in-flight Workflow tool call once its JSON arguments are complete', () => {
  const definition = extractWorkflowDefinition(toolNode('call-live', 4, args('live-flow', 'return null'), false))
  assert.equal(definition.callId, 'call-live')
  assert.equal(definition.meta.name, 'live-flow')
  assert.equal(definition.script, 'return null')
})

test('pairs each run with the nearest preceding same-name Workflow definition without mutating nodes', () => {
  const old = toolNode('call-old', 1, args('repeat-flow', 'return "old"'))
  const current = toolNode('call-current', 8, args('repeat-flow', 'return "current"'))
  const second = toolNode('call-second', 12, args('repeat-flow', 'return "second"'))
  const firstRun = runNode('run-1', 9, 'repeat-flow')
  const secondRun = runNode('run-2', 13, 'repeat-flow')
  const attached = attachWorkflowDefinitions([firstRun, secondRun], [old, current, firstRun, second, secondRun])

  assert.equal(attached[0].data.definition.script, 'return "current"')
  assert.equal(attached[1].data.definition.script, 'return "second"')
  assert.equal(firstRun.data.definition, undefined)
  assert.equal(secondRun.data.definition, undefined)
})

test('keeps same-name definitions in chronological order when calls precede their runs', () => {
  const firstCall = toolNode('call-1', 1, args('repeat-flow', 'return "first"'))
  const secondCall = toolNode('call-2', 2, args('repeat-flow', 'return "second"'))
  const firstRun = runNode('run-1', 3, 'repeat-flow')
  const secondRun = runNode('run-2', 4, 'repeat-flow')
  const attached = attachWorkflowDefinitions(
    [firstRun, secondRun],
    [firstCall, secondCall, firstRun, secondRun],
  )

  assert.equal(attached[0].data.definition.script, 'return "first"')
  assert.equal(attached[1].data.definition.script, 'return "second"')
})

test('leaves runs unchanged when the call is absent, truncated, malformed, or mismatched', () => {
  const run = runNode('run', 20, 'target-flow')
  const malformed = toolNode('bad', 17, '{"script":')
  const otherTool = toolNode('other-tool', 18, args('target-flow', 'return 0'), true, 'cordis_define')
  const wrongName = toolNode('wrong-name', 19, args('other-flow', 'return 1'))
  const attached = attachWorkflowDefinitions([run], [malformed, otherTool, wrongName, run])

  assert.equal(extractWorkflowDefinition(malformed), null)
  assert.equal(extractWorkflowDefinition(otherTool), null)
  assert.equal(attached[0], run)
})
