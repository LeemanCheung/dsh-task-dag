export const NODE_WIDTH = 224;
export const NODE_HEIGHT = 76;
const X_GAP = 30;
const Y_GAP = 70;
const CANVAS_PAD = 38;
const MIN_CANVAS_WIDTH = 760;

export function normalizeStatus(status) {
  switch (status) {
    case 'running':
    case 'completed':
    case 'failed':
    case 'cancelled':
    case 'interrupted':
    case 'ready':
    case 'blocked':
    case 'pending':
    case 'provisioning':
      return status;
    default:
      return 'idle';
  }
}

function summaryStatus(summary, detail) {
  if (detail?.activity === 'running' || summary?.running) return 'running';
  return summary?.completed ? 'completed' : 'idle';
}

function typeLabel(type, t) {
  switch (type) {
    case 'one-shot': return t('node.oneShot');
    case 'continuable': return t('node.continuable');
    case 'teammate': return t('node.teammate');
    case 'workflow-member': return t('node.workflowMember');
    case 'workflow': return t('node.workflow');
    case 'phase': return t('node.phaseGroup');
    case 'task': return t('node.teamTask');
    case 'root': return t('node.current');
    default: return t('node.subagent');
  }
}

function catalogIndex(catalogs) {
  const indexed = new Map();
  for (const [parentId, catalog] of Object.entries(catalogs)) {
    for (const entry of catalog.entries || []) {
      if (entry.kind !== 'child') continue;
      indexed.set(entry.id, {
        parentId,
        activity: entry.activity,
        mode: entry.mode,
        label: entry.label,
      });
    }
  }
  return indexed;
}

export function lineageDepths(rootId, summaries) {
  const depths = new Map([[rootId, 0]]);
  const invalid = new Set();
  for (const start of Object.values(summaries)) {
    if (start.id === rootId || depths.has(start.id) || invalid.has(start.id)) continue;
    const trail = [];
    const seen = new Set();
    let current = start;
    let baseDepth;
    while (true) {
      if (depths.has(current.id)) {
        baseDepth = depths.get(current.id);
        break;
      }
      if (invalid.has(current.id) || seen.has(current.id)
        || current.origin !== 'subagent' || current.parentId === undefined) {
        baseDepth = undefined;
        break;
      }
      seen.add(current.id);
      trail.push(current);
      if (current.parentId === rootId) {
        baseDepth = 0;
        break;
      }
      current = summaries[current.parentId];
      if (current === undefined) {
        baseDepth = undefined;
        break;
      }
    }
    if (baseDepth === undefined) {
      for (const node of trail) invalid.add(node.id);
      continue;
    }
    let depth = baseDepth;
    for (let index = trail.length - 1; index >= 0; index -= 1) {
      depth += 1;
      depths.set(trail[index].id, depth);
    }
  }
  return depths;
}

function foldTeam(rootId, teamNodes) {
  const members = new Map();
  const tasks = new Map();
  const messages = new Map();
  const delivered = new Set();
  const snapshots = [...teamNodes].sort((left, right) => left.anchorSeq - right.anchorSeq);
  for (const node of snapshots) {
    const data = node.data;
    if (data?.teamId !== rootId) continue;
    if (data.type === 'member') {
      const previous = members.get(data.member.id);
      if (previous === undefined || data.seq >= previous.seq) members.set(data.member.id, data);
    } else if (data.type === 'task') {
      const previous = tasks.get(data.task.id);
      if (previous === undefined || data.task.revision > previous.task.revision
        || (data.task.revision === previous.task.revision && data.seq >= previous.seq)) {
        tasks.set(data.task.id, data);
      }
    } else if (data.type === 'message') {
      messages.set(data.message.id, data);
    } else if (data.type === 'delivery') {
      delivered.add(data.messageId);
    }
  }
  return { members, tasks, messages, delivered };
}

function taskOrder(id, fallback) {
  const match = /^task-(\d+)$/u.exec(id);
  if (match === null) return fallback;
  const value = Number(match[1]);
  return Number.isSafeInteger(value) ? value : fallback;
}

function phaseName(phase, t) {
  return phase === null || phase === undefined || phase === '' ? t('node.unphased') : String(phase);
}

function nodeComparator(left, right) {
  const orderDelta = (left.order || 0) - (right.order || 0);
  if (orderDelta !== 0) return orderDelta;
  const labelDelta = String(left.label).localeCompare(String(right.label));
  return labelDelta !== 0 ? labelDelta : left.id.localeCompare(right.id);
}

function createBuilder(rootId, rootRunning, summaries, ordinaryIds, t) {
  const nodesById = new Map();
  const edgesById = new Map();
  const ordinary = new Set(ordinaryIds);
  const rootSummary = summaries[rootId];
  const rootLabel = rootSummary?.displayTitle || t('node.fallback');
  nodesById.set(rootId, {
    id: rootId,
    label: rootLabel,
    meta: t('node.current'),
    type: 'root',
    status: rootRunning ? 'running' : rootSummary?.completed ? 'completed' : 'idle',
    navigable: false,
    navigationId: null,
    order: -1,
  });
  const addNode = (node) => {
    nodesById.set(node.id, node);
    return node;
  };
  const addEdge = (edge) => {
    if (!nodesById.has(edge.from) || !nodesById.has(edge.to)) return;
    const id = edge.id || `${edge.kind}:${edge.from}>${edge.to}`;
    edgesById.set(id, { ...edge, id });
  };
  return {
    nodesById,
    edgesById,
    ordinary,
    rootLabel,
    addNode,
    addEdge,
  };
}

function addTeamGraph(builder, rootId, summaries, details, team, t) {
  const sessionNodes = new Map([[rootId, rootId]]);
  const memberNames = new Map([[rootId, builder.rootLabel]]);
  const memberSnapshots = [...team.members.values()].sort((left, right) => left.seq - right.seq);
  for (const snapshot of memberSnapshots) {
    const member = snapshot.member;
    const id = `agent:${member.id}`;
    const summary = summaries[member.id];
    const detail = details.get(member.id);
    const status = member.phase === 'failed'
      ? 'failed'
      : member.phase === 'provisioning'
        ? 'provisioning'
        : summaryStatus(summary, detail);
    builder.addNode({
      id,
      label: member.name,
      meta: member.phase === 'failed' && member.error ? member.error : t('node.teammate'),
      type: 'teammate',
      status,
      navigable: builder.ordinary.has(member.id),
      navigationId: member.id,
      order: snapshot.seq,
      description: member.description,
    });
    builder.addEdge({ from: rootId, to: id, kind: 'team', layout: true });
    sessionNodes.set(member.id, id);
    memberNames.set(member.id, member.name);
  }

  const ensureAgent = (sessionId, fallbackName) => {
    if (sessionNodes.has(sessionId)) return sessionNodes.get(sessionId);
    if (sessionId === rootId) return rootId;
    const id = `agent:${sessionId}`;
    const summary = summaries[sessionId];
    const detail = details.get(sessionId);
    builder.addNode({
      id,
      label: fallbackName || detail?.label || summary?.displayTitle || t('node.teammate'),
      meta: typeLabel(detail?.mode || 'teammate', t),
      type: 'teammate',
      status: summaryStatus(summary, detail),
      navigable: builder.ordinary.has(sessionId),
      navigationId: sessionId,
      order: summary?.updatedAt || 0,
    });
    builder.addEdge({ from: rootId, to: id, kind: 'team', layout: true });
    sessionNodes.set(sessionId, id);
    memberNames.set(sessionId, fallbackName || detail?.label || summary?.displayTitle || t('node.teammate'));
    return id;
  };

  const taskSnapshots = [...team.tasks.values()]
    .filter(snapshot => snapshot.task.status !== 'deleted')
    .sort((left, right) => taskOrder(left.task.id, left.seq) - taskOrder(right.task.id, right.seq));
  const activeTasks = new Map(taskSnapshots.map(snapshot => [snapshot.task.id, snapshot.task]));
  for (const snapshot of taskSnapshots) {
    const task = snapshot.task;
    const blockersComplete = task.blockedBy.length === 0 || task.blockedBy.every((id) => {
      const blocker = activeTasks.get(id);
      return blocker !== undefined && blocker.status === 'completed';
    });
    const status = task.status === 'completed'
      ? 'completed'
      : task.status === 'in_progress'
        ? 'running'
        : blockersComplete ? 'ready' : 'blocked';
    const owner = task.ownerId === undefined
      ? t('node.unassigned')
      : memberNames.get(task.ownerId) || summaries[task.ownerId]?.displayTitle || t('node.unknownOwner');
    const id = `team-task:${task.id}`;
    builder.addNode({
      id,
      label: task.subject || task.id,
      meta: t('node.taskMeta', { id: task.id, owner }),
      type: 'task',
      status,
      navigable: false,
      navigationId: null,
      order: taskOrder(task.id, snapshot.seq),
      description: task.description,
      taskId: task.id,
      owner,
    });
    const ownerNode = task.ownerId === undefined ? rootId : ensureAgent(task.ownerId, owner);
    builder.addEdge({ from: ownerNode, to: id, kind: 'assignment', layout: true });
  }
  for (const snapshot of taskSnapshots) {
    for (const blockerId of snapshot.task.blockedBy) {
      if (!activeTasks.has(blockerId)) continue;
      builder.addEdge({
        from: `team-task:${blockerId}`,
        to: `team-task:${snapshot.task.id}`,
        kind: 'dependency',
        layout: true,
      });
    }
  }

  const channels = new Map();
  for (const snapshot of team.messages.values()) {
    const message = snapshot.message;
    const from = ensureAgent(message.senderId, message.senderName);
    const to = ensureAgent(message.targetId, memberNames.get(message.targetId));
    const key = `${message.senderId}>${message.targetId}`;
    let channel = channels.get(key);
    if (channel === undefined) {
      channel = {
        from,
        to,
        senderId: message.senderId,
        targetId: message.targetId,
        senderName: memberNames.get(message.senderId) || message.senderName,
        targetName: memberNames.get(message.targetId) || summaries[message.targetId]?.displayTitle || message.targetId,
        messages: [],
      };
      channels.set(key, channel);
    }
    channel.messages.push({
      ...message,
      seq: snapshot.seq,
      time: snapshot.time,
      delivered: team.delivered.has(message.id),
    });
  }
  for (const channel of channels.values()) {
    channel.messages.sort((left, right) => right.seq - left.seq);
    const pending = channel.messages.filter(message => !message.delivered).length;
    const reverse = channels.has(`${channel.targetId}>${channel.senderId}`);
    builder.addEdge({
      id: `communication:${channel.senderId}>${channel.targetId}`,
      from: channel.from,
      to: channel.to,
      kind: 'communication',
      layout: false,
      count: channel.messages.length,
      pending,
      reverse,
      curve: reverse ? (channel.senderId.localeCompare(channel.targetId) < 0 ? -1 : 1) : 0,
      senderName: channel.senderName,
      targetName: channel.targetName,
      messages: channel.messages,
    });
  }
  return { sessionNodes, memberNames };
}

function addWorkflowGraph(builder, rootId, workflowNodes, summaries, details, t) {
  const sessionNodes = new Map();
  const memberSessionIds = new Set();
  const workflows = [...workflowNodes].sort((left, right) => left.anchorSeq - right.anchorSeq);
  for (const viewNode of workflows) {
    const data = viewNode.data || {};
    const phases = Array.isArray(data.phases) ? data.phases : [];
    const workflowId = `workflow:${viewNode.id}`;
    let memberCount = 0;
    for (const phase of phases) memberCount += Array.isArray(phase.members) ? phase.members.length : 0;
    const metaParts = [t('node.tasks', { count: memberCount })];
    if (phases.length > 1) metaParts.push(t('node.phases', { count: phases.length }));
    if (data.definition?.script !== undefined) metaParts.push(t('node.code'));
    builder.addNode({
      id: workflowId,
      label: data.name || t('node.workflow'),
      meta: metaParts.join(' · '),
      type: 'workflow',
      status: normalizeStatus(data.status),
      navigable: false,
      navigationId: null,
      inspectable: true,
      definition: data.definition || null,
      order: viewNode.anchorSeq,
    });
    builder.addEdge({ from: rootId, to: workflowId, kind: 'workflow', layout: true });
    const usePhaseNodes = phases.length > 1 || phases.some(phase => phase.phase !== null && phase.phase !== undefined && phase.phase !== '');
    phases.forEach((phase, phaseIndex) => {
      const members = Array.isArray(phase.members) ? phase.members : [];
      let parentId = workflowId;
      if (usePhaseNodes) {
        parentId = `workflow-phase:${viewNode.id}:${phase.key || phaseIndex}`;
        const phaseStatus = members.some(member => normalizeStatus(member.status) === 'running')
          ? 'running'
          : members.some(member => normalizeStatus(member.status) === 'failed')
            ? 'failed'
            : members.length > 0 && members.every(member => normalizeStatus(member.status) === 'completed')
              ? 'completed' : normalizeStatus(data.status);
        builder.addNode({
          id: parentId,
          label: phaseName(phase.phase, t),
          meta: t('node.phaseTasks', { count: members.length }),
          type: 'phase',
          status: phaseStatus,
          navigable: false,
          navigationId: null,
          order: viewNode.anchorSeq + phaseIndex / 100,
        });
        builder.addEdge({ from: workflowId, to: parentId, kind: 'phase', layout: true });
      }
      members.forEach((member, memberIndex) => {
        const detail = details.get(member.childId);
        const id = `workflow-member:${viewNode.id}:${member.seq}`;
        builder.addNode({
          id,
          label: member.label || detail?.label || summaries[member.childId]?.displayTitle || t('node.subagent'),
          meta: usePhaseNodes ? t('node.workflowMember') : phaseName(phase.phase, t),
          type: 'workflow-member',
          status: normalizeStatus(member.status),
          navigable: builder.ordinary.has(member.childId),
          navigationId: member.childId,
          order: Number.isFinite(member.seq) ? member.seq : memberIndex,
        });
        builder.addEdge({ from: parentId, to: id, kind: 'workflow', layout: true });
        memberSessionIds.add(member.childId);
        sessionNodes.set(member.childId, id);
      });
    });
  }
  return { sessionNodes, memberSessionIds };
}

function addGenericSubagents(builder, rootId, summaries, details, groupedSessionNodes, groupedIds, t) {
  const depths = lineageDepths(rootId, summaries);
  const descendants = Object.values(summaries)
    .filter(summary => summary.id !== rootId && depths.has(summary.id) && !groupedIds.has(summary.id))
    .sort((left, right) => (depths.get(left.id) - depths.get(right.id)) || (left.updatedAt || 0) - (right.updatedAt || 0));
  for (const summary of descendants) {
    const detail = details.get(summary.id);
    const type = detail?.mode || 'subagent';
    const id = `agent:${summary.id}`;
    builder.addNode({
      id,
      label: detail?.label || summary.displayTitle || t('node.subagent'),
      meta: typeLabel(type, t),
      type,
      status: summaryStatus(summary, detail),
      navigable: builder.ordinary.has(summary.id),
      navigationId: summary.id,
      order: summary.updatedAt || 0,
    });
    const parentId = summary.parentId === rootId
      ? rootId
      : groupedSessionNodes.get(summary.parentId) || `agent:${summary.parentId}`;
    builder.addEdge({ from: parentId, to: id, kind: 'delegation', layout: true });
    groupedSessionNodes.set(summary.id, id);
  }
  return depths;
}

export function buildGraph({
  rootId,
  rootRunning,
  summaries,
  catalogs,
  ordinaryIds,
  teamNodes,
  workflowNodes,
  mode = 'overview',
  t,
}) {
  const details = catalogIndex(catalogs);
  const team = foldTeam(rootId, teamNodes);
  const builder = createBuilder(rootId, rootRunning, summaries, ordinaryIds, t);
  const groupedSessionNodes = new Map([[rootId, rootId]]);
  const groupedIds = new Set();

  if (mode === 'overview' || mode === 'team') {
    const teamGraph = addTeamGraph(builder, rootId, summaries, details, team, t);
    for (const [sessionId, nodeId] of teamGraph.sessionNodes) {
      groupedSessionNodes.set(sessionId, nodeId);
      if (sessionId !== rootId) groupedIds.add(sessionId);
    }
  }
  if (mode === 'overview' || mode === 'workflow') {
    const workflowGraph = addWorkflowGraph(builder, rootId, workflowNodes, summaries, details, t);
    for (const [sessionId, nodeId] of workflowGraph.sessionNodes) groupedSessionNodes.set(sessionId, nodeId);
    for (const sessionId of workflowGraph.memberSessionIds) groupedIds.add(sessionId);
  }
  const depths = lineageDepths(rootId, summaries);
  if (mode === 'overview') {
    addGenericSubagents(builder, rootId, summaries, details, groupedSessionNodes, groupedIds, t);
  }

  const parentIds = new Set([rootId]);
  for (const summary of Object.values(summaries)) {
    if (summary.id !== rootId && depths.has(summary.id) && summary.parentId !== undefined) parentIds.add(summary.parentId);
  }
  const nodes = [...builder.nodesById.values()];
  const edges = [...builder.edgesById.values()];
  return {
    rootId,
    mode,
    nodes,
    edges,
    parentIds: [...parentIds],
    activeCount: nodes.filter(node => node.id !== rootId && node.status === 'running').length,
    communicationCount: edges.filter(edge => edge.kind === 'communication').length,
    hasTeamData: team.members.size > 0 || [...team.tasks.values()].some(snapshot => snapshot.task.status !== 'deleted')
      || team.messages.size > 0,
    hasWorkflowData: workflowNodes.length > 0,
  };
}

function insertSorted(queue, node, compare) {
  let low = 0;
  let high = queue.length;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (compare(queue[middle], node) <= 0) low = middle + 1;
    else high = middle;
  }
  queue.splice(low, 0, node);
}

function residualComponents(residualIds, outgoing, compareIds) {
  const residual = new Set(residualIds);
  const adjacent = new Map(residualIds.map(id => [id, []]));
  const reverse = new Map(residualIds.map(id => [id, []]));
  for (const id of residualIds) {
    for (const target of outgoing.get(id)) {
      if (!residual.has(target)) continue;
      adjacent.get(id).push(target);
      reverse.get(target).push(id);
    }
  }
  for (const targets of adjacent.values()) targets.sort(compareIds);
  for (const targets of reverse.values()) targets.sort(compareIds);

  const visited = new Set();
  const finished = [];
  for (const start of [...residualIds].sort(compareIds)) {
    if (visited.has(start)) continue;
    visited.add(start);
    const stack = [{ id: start, index: 0 }];
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const targets = adjacent.get(frame.id);
      if (frame.index < targets.length) {
        const target = targets[frame.index];
        frame.index += 1;
        if (!visited.has(target)) {
          visited.add(target);
          stack.push({ id: target, index: 0 });
        }
      } else {
        finished.push(frame.id);
        stack.pop();
      }
    }
  }

  const components = [];
  const componentById = new Map();
  for (let index = finished.length - 1; index >= 0; index -= 1) {
    const start = finished[index];
    if (componentById.has(start)) continue;
    const component = [];
    const stack = [start];
    componentById.set(start, components.length);
    while (stack.length > 0) {
      const id = stack.pop();
      component.push(id);
      for (const target of reverse.get(id)) {
        if (componentById.has(target)) continue;
        componentById.set(target, components.length);
        stack.push(target);
      }
    }
    component.sort(compareIds);
    components.push(component);
  }
  return { components, componentById };
}

function graphDepths(graph, nodesById) {
  const indegree = new Map(graph.nodes.map(node => [node.id, 0]));
  const outgoing = new Map(graph.nodes.map(node => [node.id, []]));
  for (const edge of graph.edges) {
    if (edge.layout === false || edge.from === edge.to
      || !nodesById.has(edge.from) || !nodesById.has(edge.to)) continue;
    outgoing.get(edge.from).push(edge.to);
    indegree.set(edge.to, indegree.get(edge.to) + 1);
  }
  const compareIds = (leftId, rightId) => nodeComparator(nodesById.get(leftId), nodesById.get(rightId));
  for (const targets of outgoing.values()) targets.sort(compareIds);
  const queue = [];
  for (const node of graph.nodes) {
    if (indegree.get(node.id) === 0) insertSorted(queue, node.id, compareIds);
  }
  const depths = new Map([[graph.rootId, 0]]);
  const processed = new Set();
  while (queue.length > 0) {
    const id = queue.shift();
    processed.add(id);
    const baseDepth = depths.get(id) || 0;
    for (const target of outgoing.get(id)) {
      depths.set(target, Math.max(depths.get(target) || 0, baseDepth + 1));
      indegree.set(target, indegree.get(target) - 1);
      if (indegree.get(target) === 0) insertSorted(queue, target, compareIds);
    }
  }
  const residualIds = graph.nodes.filter(node => !processed.has(node.id)).map(node => node.id);
  if (residualIds.length > 0) {
    const { components, componentById } = residualComponents(residualIds, outgoing, compareIds);
    const componentOutgoing = components.map(() => new Set());
    const componentIndegree = components.map(() => 0);
    const componentDepth = new Map();
    for (let index = 0; index < components.length; index += 1) {
      for (const id of components[index]) {
        if (depths.has(id)) componentDepth.set(index, Math.max(componentDepth.get(index) || 0, depths.get(id)));
        for (const target of outgoing.get(id)) {
          const targetIndex = componentById.get(target);
          if (targetIndex === undefined || targetIndex === index || componentOutgoing[index].has(targetIndex)) continue;
          componentOutgoing[index].add(targetIndex);
          componentIndegree[targetIndex] += 1;
        }
      }
    }
    const fallbackDepth = Math.max(0, ...[...processed].map(id => depths.get(id) || 0)) + 1;
    const compareComponents = (left, right) => compareIds(components[left][0], components[right][0]);
    const componentQueue = [];
    for (let index = 0; index < components.length; index += 1) {
      if (componentIndegree[index] === 0) insertSorted(componentQueue, index, compareComponents);
    }
    while (componentQueue.length > 0) {
      const index = componentQueue.shift();
      const depth = componentDepth.get(index) ?? fallbackDepth;
      componentDepth.set(index, depth);
      const targets = [...componentOutgoing[index]].sort(compareComponents);
      for (const target of targets) {
        componentDepth.set(target, Math.max(componentDepth.get(target) || 0, depth + 1));
        componentIndegree[target] -= 1;
        if (componentIndegree[target] === 0) insertSorted(componentQueue, target, compareComponents);
      }
    }
    for (let index = 0; index < components.length; index += 1) {
      const depth = componentDepth.get(index) ?? fallbackDepth;
      for (const id of components[index]) depths.set(id, depth);
    }
  }
  for (const node of graph.nodes) if (!depths.has(node.id)) depths.set(node.id, node.id === graph.rootId ? 0 : 1);
  return depths;
}

export function graphLayout(graph) {
  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  const depths = graphDepths(graph, nodesById);
  const maxDepth = Math.max(0, ...depths.values());
  const layers = Array.from({ length: maxDepth + 1 }, () => []);
  for (const node of graph.nodes) layers[depths.get(node.id) || 0].push(node);
  for (const layer of layers) layer.sort(nodeComparator);
  const widest = Math.max(1, ...layers.map(layer => layer.length));
  const width = Math.max(
    MIN_CANVAS_WIDTH,
    CANVAS_PAD * 2 + widest * NODE_WIDTH + Math.max(0, widest - 1) * X_GAP,
  );
  const height = CANVAS_PAD * 2 + layers.length * NODE_HEIGHT + Math.max(0, layers.length - 1) * Y_GAP;
  const positions = new Map();
  for (let depth = 0; depth < layers.length; depth += 1) {
    const layer = layers[depth];
    const layerWidth = layer.length * NODE_WIDTH + Math.max(0, layer.length - 1) * X_GAP;
    const startX = (width - layerWidth) / 2;
    for (let index = 0; index < layer.length; index += 1) {
      positions.set(layer[index].id, {
        x: startX + index * (NODE_WIDTH + X_GAP),
        y: CANVAS_PAD + depth * (NODE_HEIGHT + Y_GAP),
      });
    }
  }
  return {
    width,
    height,
    positions,
    signature: `${graph.mode}|${graph.nodes.map(node => node.id).join('|')}|${graph.edges
      .filter(edge => edge.layout !== false).map(edge => `${edge.kind}:${edge.from}>${edge.to}`).join('|')}`,
  };
}
