'use strict';

export const TEAM_SNAPSHOT_KIND = 'task-dag-team-snapshot';

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function strings(values) {
  return Array.isArray(values) ? values.filter(value => typeof value === 'string') : [];
}

function messageContent(content) {
  if (!Array.isArray(content)) return { text: '', nonText: [] };
  const text = [];
  const nonText = [];
  for (const block of content) {
    if (!isRecord(block) || typeof block.type !== 'string') continue;
    if (block.type === 'text' && typeof block.text === 'string') text.push(block.text);
    else nonText.push(block.type);
  }
  return { text: text.join('\n'), nonText };
}

export function projectTeamEvent(event) {
  if (!isRecord(event) || !isRecord(event.data) || event.data.version !== 1
    || typeof event.data.teamId !== 'string') return null;
  const base = {
    teamId: event.data.teamId,
    seq: Number.isSafeInteger(event.seq) ? event.seq : 0,
    time: Number.isFinite(event.time) ? event.time : 0,
  };
  if (event.type === 'team/member' && isRecord(event.data.member)) {
    const member = event.data.member;
    if (typeof member.id !== 'string' || typeof member.name !== 'string'
      || typeof member.phase !== 'string') return null;
    return {
      ...base,
      type: 'member',
      member: {
        id: member.id,
        name: member.name,
        description: typeof member.description === 'string' ? member.description : '',
        phase: member.phase,
        error: typeof member.error === 'string' ? member.error : undefined,
      },
    };
  }
  if (event.type === 'team/task' && isRecord(event.data.task)) {
    const task = event.data.task;
    if (typeof task.id !== 'string' || !Number.isSafeInteger(task.revision)
      || typeof task.subject !== 'string' || typeof task.status !== 'string') return null;
    return {
      ...base,
      type: 'task',
      task: {
        id: task.id,
        revision: task.revision,
        subject: task.subject,
        description: typeof task.description === 'string' ? task.description : '',
        status: task.status,
        ownerId: typeof task.ownerId === 'string' ? task.ownerId : undefined,
        blockedBy: strings(task.blockedBy),
      },
    };
  }
  if (event.type === 'team/message/queued' && isRecord(event.data.message)) {
    const message = event.data.message;
    if (typeof message.id !== 'string' || typeof message.senderId !== 'string'
      || typeof message.targetId !== 'string' || typeof message.senderName !== 'string') return null;
    return {
      ...base,
      type: 'message',
      message: {
        id: message.id,
        senderId: message.senderId,
        senderName: message.senderName,
        targetId: message.targetId,
        delivery: message.delivery === 'wakeup' ? 'wakeup' : 'quiet',
        ...messageContent(message.content),
      },
    };
  }
  if (event.type === 'team/message/delivered' && typeof event.data.messageId === 'string'
    && typeof event.data.targetId === 'string') {
    return {
      ...base,
      type: 'delivery',
      messageId: event.data.messageId,
      targetId: event.data.targetId,
    };
  }
  return null;
}

export function createTeamSnapshotDefinition() {
  return {
    kind: TEAM_SNAPSHOT_KIND,
    target: 'chat',
    match(event) {
      const snapshot = projectTeamEvent(event);
      return snapshot === null ? null : { id: String(snapshot.seq), role: 'start' };
    },
    start(_context, match) {
      return projectTeamEvent(match.event);
    },
    update(context) {
      return context.state;
    },
    buildViewNode(context) {
      if (context.start === undefined || context.state === null || context.state === undefined) return null;
      return {
        key: context.key,
        kind: TEAM_SNAPSHOT_KIND,
        id: context.id,
        target: 'chat',
        anchorSeq: context.start.event.seq,
        location: context.start.location,
        visibility: 'hidden',
        data: context.state,
      };
    },
  };
}
