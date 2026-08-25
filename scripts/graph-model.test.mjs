import assert from 'node:assert/strict'
import test from 'node:test'
import { buildGraph, graphLayout, lineageDepths } from '../src/graph-model.js'

const labels = {
  'node.current': 'Current Session',
  'node.fallback': 'Untitled Session',
  'node.oneShot': 'One-shot subagent',
  'node.continuable': 'Continuable subagent',
  'node.subagent': 'Subagent',
  'node.teammate': 'Teammate',
  'node.workflowMember': 'Workflow worker',
  'node.workflow': 'Workflow',
  'node.phaseGroup': 'Phase group',
  'node.teamTask': 'Team task',
  'node.unphased': 'Unphased',
  'node.unassigned': 'Unassigned',
  'node.unknownOwner': 'Unknown owner',
  'node.taskMeta': '{id} · {owner}',
  'node.tasks': '{count} members',
  'node.phases': '{count} phases',
  'node.phaseTasks': '{count} members',
}
const t = (key, values = {}) => Object.entries(values).reduce(
  (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
  labels[key] ?? key,
)
const root = { id: 'root', displayTitle: 'Root' }

function snapshot(anchorSeq, data) {
  return { anchorSeq, data: { teamId: 'root', seq: anchorSeq, time: anchorSeq * 1000, ...data } }
}

function graphInput(overrides = {}) {
  return {
    rootId: 'root',
    rootRunning: false,
    summaries: { root },
    catalogs: {},
    ordinaryIds: ['root'],
    teamNodes: [],
    workflowNodes: [],
    mode: 'overview',
    t,
    ...overrides,
  }
}

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

test('Agent Teams graph folds current tasks, owners, dependencies, and bidirectional communication', () => {
  const summaries = {
    root,
    alpha: { id: 'alpha', displayTitle: 'Alpha Session', origin: 'subagent', parentId: 'root', updatedAt: 2 },
    beta: { id: 'beta', displayTitle: 'Beta Session', origin: 'subagent', parentId: 'root', updatedAt: 3 },
  }
  const teamNodes = [
    snapshot(1, { type: 'member', member: { id: 'alpha', name: 'Alpha', description: 'Build', phase: 'active' } }),
    snapshot(2, { type: 'member', member: { id: 'beta', name: 'Beta', description: 'Review', phase: 'active' } }),
    snapshot(3, { type: 'task', task: { id: 'task-1', revision: 1, subject: 'Foundation', description: '', status: 'pending', ownerId: 'alpha', blockedBy: [] } }),
    snapshot(4, { type: 'task', task: { id: 'task-2', revision: 1, subject: 'Integration', description: '', status: 'pending', ownerId: 'beta', blockedBy: ['task-1'] } }),
    snapshot(5, { type: 'task', task: { id: 'task-3', revision: 1, subject: 'Release', description: '', status: 'pending', blockedBy: ['task-2'] } }),
    snapshot(6, { type: 'task', task: { id: 'task-deleted', revision: 2, subject: 'Removed', description: '', status: 'deleted', blockedBy: [] } }),
    snapshot(7, { type: 'task', task: { id: 'task-1', revision: 2, subject: 'Foundation', description: '', status: 'completed', ownerId: 'alpha', blockedBy: [] } }),
    snapshot(8, { type: 'message', message: { id: 'm1', senderId: 'alpha', senderName: 'Alpha', targetId: 'beta', delivery: 'quiet', text: 'Ready for review', nonText: [] } }),
    snapshot(9, { type: 'delivery', messageId: 'm1', targetId: 'beta' }),
    snapshot(10, { type: 'message', message: { id: 'm2', senderId: 'beta', senderName: 'Beta', targetId: 'alpha', delivery: 'wakeup', text: 'One blocker', nonText: ['image'] } }),
  ]
  const graph = buildGraph(graphInput({
    summaries,
    catalogs: {
      root: { entries: [
        { kind: 'child', id: 'alpha', activity: 'running', mode: 'teammate', label: 'Alpha' },
        { kind: 'child', id: 'beta', activity: 'idle', mode: 'teammate', label: 'Beta' },
      ] },
    },
    ordinaryIds: ['root', 'alpha', 'beta'],
    teamNodes,
    mode: 'team',
  }))

  assert.equal(graph.nodes.find(node => node.id === 'team-task:task-1').status, 'completed')
  assert.equal(graph.nodes.find(node => node.id === 'team-task:task-2').status, 'ready')
  assert.equal(graph.nodes.find(node => node.id === 'team-task:task-3').status, 'blocked')
  assert.equal(graph.nodes.some(node => node.id === 'team-task:task-deleted'), false)
  assert.equal(graph.nodes.find(node => node.id === 'agent:alpha').navigable, true)
  assert.equal(graph.edges.some(edge => edge.kind === 'dependency' && edge.from === 'team-task:task-1' && edge.to === 'team-task:task-2'), true)
  assert.equal(graph.edges.some(edge => edge.kind === 'assignment' && edge.from === 'agent:beta' && edge.to === 'team-task:task-2'), true)

  const channels = graph.edges.filter(edge => edge.kind === 'communication')
  assert.equal(channels.length, 2)
  assert.equal(channels.every(edge => edge.layout === false && edge.reverse && edge.curve !== 0), true)
  assert.equal(channels.find(edge => edge.id === 'communication:alpha>beta').pending, 0)
  assert.equal(channels.find(edge => edge.id === 'communication:beta>alpha').pending, 1)
  assert.deepEqual(channels.find(edge => edge.id === 'communication:beta>alpha').messages[0].nonText, ['image'])
})

test('Workflow view creates explicit phase groups and preserves Session navigation ids', () => {
  const summaries = {
    root,
    child: { id: 'child', displayTitle: 'Listed child', origin: 'subagent', parentId: 'root', completed: true, updatedAt: 2 },
    second: { id: 'second', displayTitle: 'Second child', origin: 'subagent', parentId: 'root', updatedAt: 3 },
  }
  const graph = buildGraph(graphInput({
    summaries,
    catalogs: {
      root: { entries: [{ kind: 'child', id: 'child', activity: 'running', mode: 'one-shot', label: 'Catalog child' }] },
    },
    ordinaryIds: ['root', 'child'],
    workflowNodes: [{
      id: 'review', anchorSeq: 5, data: {
        name: 'Review', status: 'completed', phases: [
          { key: 'verify', phase: 'verify', members: [{ childId: 'child', seq: 1, label: 'Verified', status: 'failed' }] },
          { key: 'ship', phase: 'ship', members: [{ childId: 'second', seq: 2, label: 'Ship', status: 'completed' }] },
        ],
      },
    }],
    mode: 'workflow',
  }))
  const child = graph.nodes.find(node => node.id === 'workflow-member:review:1')
  assert.equal(child.label, 'Verified')
  assert.equal(child.status, 'failed')
  assert.equal(child.navigationId, 'child')
  assert.equal(child.navigable, true)
  assert.equal(graph.nodes.filter(node => node.type === 'phase').length, 2)
  assert.equal(graph.edges.some(edge => edge.kind === 'phase' && edge.from === 'workflow:review'), true)
  assert.equal(graph.nodes.some(node => node.id === 'agent:child'), false)
})

test('Overview keeps ungrouped descendants while avoiding duplicate Team and Workflow members', () => {
  const summaries = {
    root,
    team: { id: 'team', origin: 'subagent', parentId: 'root', displayTitle: 'Team' },
    flow: { id: 'flow', origin: 'subagent', parentId: 'root', displayTitle: 'Flow' },
    plain: { id: 'plain', origin: 'subagent', parentId: 'root', displayTitle: 'Plain' },
  }
  const graph = buildGraph(graphInput({
    summaries,
    ordinaryIds: Object.keys(summaries),
    teamNodes: [snapshot(1, { type: 'member', member: { id: 'team', name: 'Team member', description: '', phase: 'active' } })],
    workflowNodes: [{ id: 'run', anchorSeq: 2, data: { name: 'Run', status: 'running', phases: [{ key: 'p', phase: null, members: [{ childId: 'flow', seq: 3, label: 'Flow member', status: 'running' }] }] } }],
  }))
  assert.equal(graph.nodes.filter(node => node.navigationId === 'team').length, 1)
  assert.equal(graph.nodes.filter(node => node.navigationId === 'flow').length, 1)
  assert.equal(graph.nodes.filter(node => node.navigationId === 'plain').length, 1)
})

test('graphLayout is deterministic for deep lineages and cyclic dependency input', () => {
  const summaries = { root }
  let parentId = 'root'
  for (let index = 0; index < 3000; index += 1) {
    const id = `node-${index}`
    summaries[id] = { id, displayTitle: id, origin: 'subagent', parentId, updatedAt: index }
    parentId = id
  }
  const graph = buildGraph(graphInput({ summaries, ordinaryIds: Object.keys(summaries), rootRunning: true }))
  const first = graphLayout(graph)
  const second = graphLayout(graph)
  assert.equal(first.positions.get('agent:node-2999').y > first.positions.get('agent:node-0').y, true)
  assert.deepEqual([...first.positions.entries()], [...second.positions.entries()])

  const cyclic = {
    rootId: 'root', mode: 'team',
    nodes: [
      { id: 'root', label: 'Root', order: 0 },
      { id: 'a', label: 'A', order: 1 },
      { id: 'b', label: 'B', order: 2 },
      { id: 'c', label: 'C', order: 3 },
    ],
    edges: [
      { from: 'root', to: 'a', kind: 'assignment', layout: true },
      { from: 'a', to: 'b', kind: 'dependency', layout: true },
      { from: 'b', to: 'a', kind: 'dependency', layout: true },
      { from: 'b', to: 'c', kind: 'dependency', layout: true },
    ],
  }
  const cyclicLayout = graphLayout(cyclic)
  assert.equal(cyclicLayout.positions.size, 4)
  assert.equal(cyclicLayout.positions.get('a').y, cyclicLayout.positions.get('b').y)
  assert.equal(cyclicLayout.positions.get('c').y > cyclicLayout.positions.get('b').y, true)
  assert.deepEqual([...cyclicLayout.positions.entries()], [...graphLayout(cyclic).positions.entries()])
})
