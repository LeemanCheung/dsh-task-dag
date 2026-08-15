import assert from 'node:assert/strict'
import test from 'node:test'
import { buildGraph, graphLayout, lineageDepths } from '../src/graph-model.js'

const labels = {
  'node.current': 'Current Session',
  'node.fallback': 'Untitled Session',
  'node.oneShot': 'One-shot subagent',
  'node.continuable': 'Continuable subagent',
  'node.subagent': 'Subagent',
  'node.workflow': 'Workflow',
  'node.tasks': '{count} tasks',
  'node.phases': '{count} phases',
  'node.phase': 'Phase · {name}',
}
const t = (key, values = {}) => Object.entries(values).reduce(
  (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
  labels[key] ?? key,
)
const root = { id: 'root', displayTitle: 'Root' }

test('lineage resolution accepts descendants and rejects cycles and orphans', () => {
  const summaries = {
    root,
    direct: { id: 'direct', origin: 'subagent', parentId: 'root' },
    nested: { id: 'nested', origin: 'subagent', parentId: 'direct' },
    orphan: { id: 'orphan', origin: 'subagent', parentId: 'missing' },
    cycleA: { id: 'cycleA', origin: 'subagent', parentId: 'cycleB' },
    cycleB: { id: 'cycleB', origin: 'subagent', parentId: 'cycleA' },
  }
  const depths = lineageDepths('root', summaries)
  assert.equal(depths.get('direct'), 1)
  assert.equal(depths.get('nested'), 2)
  assert.equal(depths.has('orphan'), false)
  assert.equal(depths.has('cycleA'), false)
  assert.equal(depths.has('cycleB'), false)
})

test('buildGraph groups workflow members and derives navigability and status', () => {
  const summaries = {
    root,
    child: {
      id: 'child', displayTitle: 'Listed child', origin: 'subagent', parentId: 'root', completed: true, updatedAt: 2,
    },
  }
  const graph = buildGraph('root', false, summaries, {
    root: { entries: [{ kind: 'child', id: 'child', activity: 'running', mode: 'one-shot', label: 'Catalog child' }] },
  }, ['root', 'child'], [{
    id: 'review', anchorSeq: 5, data: {
      name: 'Review', status: 'completed',
      phases: [{ phase: 'verify', members: [{ childId: 'child', seq: 1, label: 'Verified', status: 'failed' }] }],
    },
  }], t)
  const child = graph.nodes.find(node => node.id === 'child')
  assert.deepEqual(child, {
    id: 'child', label: 'Verified', meta: 'Phase · verify', type: 'one-shot',
    status: 'failed', parentId: 'workflow:review', navigable: true, order: 1,
  })
  assert.deepEqual(graph.edges.map(edge => edge.id).sort(), ['root>workflow:review', 'workflow:review>child'])
  assert.equal(graph.activeCount, 0)
})

test('graphLayout is deterministic and handles a deep lineage without recursion', () => {
  const summaries = { root }
  let parentId = 'root'
  for (let index = 0; index < 3000; index += 1) {
    const id = `node-${index}`
    summaries[id] = { id, displayTitle: id, origin: 'subagent', parentId, updatedAt: index }
    parentId = id
  }
  const graph = buildGraph('root', true, summaries, {}, Object.keys(summaries), [], t)
  const first = graphLayout(graph)
  const second = graphLayout(graph)
  assert.equal(first.positions.get('node-2999').y > first.positions.get('node-0').y, true)
  assert.deepEqual([...first.positions.entries()], [...second.positions.entries()])
})
