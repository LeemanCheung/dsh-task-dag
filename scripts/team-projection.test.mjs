import assert from 'node:assert/strict'
import test from 'node:test'
import {
  TEAM_SNAPSHOT_KIND, createTeamSnapshotDefinition, projectTeamEvent,
} from '../src/team-projection.js'

function event(type, data, seq = 7) {
  return { type, data, seq, time: 1720000000000 + seq }
}

test('projects member and task snapshots into small owned records', () => {
  assert.deepEqual(projectTeamEvent(event('team/member', {
    version: 1,
    teamId: 'lead',
    member: { id: 'agent', name: 'Alpha', description: 'Build', phase: 'active', extra: 'ignored' },
  })), {
    teamId: 'lead', seq: 7, time: 1720000000007, type: 'member',
    member: { id: 'agent', name: 'Alpha', description: 'Build', phase: 'active', error: undefined },
  })
  assert.deepEqual(projectTeamEvent(event('team/task', {
    version: 1,
    teamId: 'lead',
    task: {
      id: 'task-1', revision: 2, subject: 'Build', description: 'Do it', status: 'pending',
      ownerId: 'agent', blockedBy: ['task-0', 3], writeScopes: ['src/**'],
    },
  })), {
    teamId: 'lead', seq: 7, time: 1720000000007, type: 'task',
    task: {
      id: 'task-1', revision: 2, subject: 'Build', description: 'Do it', status: 'pending',
      ownerId: 'agent', blockedBy: ['task-0'],
    },
  })
})

test('projects message text, non-text types, and delivery acknowledgements', () => {
  const queued = projectTeamEvent(event('team/message/queued', {
    version: 1,
    teamId: 'lead',
    message: {
      id: 'message-1', senderId: 'lead', senderName: 'Lead', targetId: 'agent', delivery: 'wakeup',
      content: [
        { type: 'text', text: 'Start now' },
        { type: 'image', source: { data: 'not-copied' } },
        { type: 'tool_use', id: 'tool-1' },
      ],
    },
  }))
  assert.equal(queued.message.text, 'Start now')
  assert.deepEqual(queued.message.nonText, ['image', 'tool_use'])
  assert.equal('content' in queued.message, false)

  assert.deepEqual(projectTeamEvent(event('team/message/delivered', {
    version: 1, teamId: 'lead', messageId: 'message-1', targetId: 'agent',
  }, 8)), {
    teamId: 'lead', seq: 8, time: 1720000000008,
    type: 'delivery', messageId: 'message-1', targetId: 'agent',
  })
})

test('ignores unknown versions, event families, and malformed records', () => {
  assert.equal(projectTeamEvent(event('team/task', { version: 2, teamId: 'lead', task: {} })), null)
  assert.equal(projectTeamEvent(event('team/unknown', { version: 1, teamId: 'lead' })), null)
  assert.equal(projectTeamEvent(event('team/task', { version: 1, teamId: 'lead', task: { id: 'task' } })), null)
  assert.equal(projectTeamEvent(null), null)
})

test('Conversation Node definition emits one hidden snapshot node per event seq', () => {
  const definition = createTeamSnapshotDefinition()
  const source = event('team/task', {
    version: 1,
    teamId: 'lead',
    task: { id: 'task-1', revision: 1, subject: 'Build', description: '', status: 'pending', blockedBy: [] },
  }, 13)
  const matched = definition.match(source)
  assert.deepEqual(matched, { id: '13', role: 'start' })
  const match = { ...matched, event: source }
  const state = definition.start({}, match)
  const location = { kind: 'turn' }
  const view = definition.buildViewNode({
    key: `${TEAM_SNAPSHOT_KIND}:13`, id: '13', state,
    start: { event: source, location },
  })
  assert.equal(view.kind, TEAM_SNAPSHOT_KIND)
  assert.equal(view.visibility, 'hidden')
  assert.equal(view.anchorSeq, 13)
  assert.equal(view.data.task.id, 'task-1')
  assert.equal(definition.match(event('message/user', {}, 14)), null)
})
