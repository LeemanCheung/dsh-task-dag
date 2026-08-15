export const NODE_WIDTH = 212;
export const NODE_HEIGHT = 70;
const X_GAP = 24;
const Y_GAP = 58;
const CANVAS_PAD = 32;
const MIN_CANVAS_WIDTH = 720;

export function normalizeStatus(status) {
  switch (status) {
    case 'running':
    case 'completed':
    case 'failed':
    case 'cancelled':
    case 'interrupted':
      return status;
    default:
      return 'idle';
  }
}

function summaryStatus(summary, detail) {
  if (detail && detail.activity === 'running') return 'running';
  if (summary.running) return 'running';
  return summary.completed ? 'completed' : 'idle';
}

function typeLabel(type, t) {
  switch (type) {
    case 'one-shot': return t('node.oneShot');
    case 'continuable': return t('node.continuable');
    case 'workflow': return t('node.workflow');
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

function phaseMeta(base, phase, t) {
  if (phase === null || phase === undefined || phase === '') return base;
  return t('node.phase', { name: phase });
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

export function buildGraph(rootId, rootRunning, summaries, catalogs, ordinaryIds, workflowNodes, t) {
  const details = catalogIndex(catalogs);
  const ordinary = new Set(ordinaryIds);
  const nodesById = new Map();
  const rootSummary = summaries[rootId];
  nodesById.set(rootId, {
    id: rootId,
    label: rootSummary?.displayTitle || t('node.fallback'),
    meta: t('node.current'),
    type: 'root',
    status: rootRunning ? 'running' : rootSummary?.completed ? 'completed' : 'idle',
    parentId: null,
    navigable: false,
    order: -1,
  });
  const depths = lineageDepths(rootId, summaries);
  const parentIds = new Set([rootId]);
  for (const summary of Object.values(summaries)) {
    const depth = depths.get(summary.id);
    if (summary.id === rootId || depth === undefined) continue;
    if (summary.parentId !== undefined) parentIds.add(summary.parentId);
    const detail = details.get(summary.id);
    const type = detail?.mode || 'subagent';
    nodesById.set(summary.id, {
      id: summary.id,
      label: detail?.label || summary.displayTitle || t('node.subagent'),
      meta: typeLabel(type, t),
      type,
      status: summaryStatus(summary, detail),
      parentId: summary.parentId || rootId,
      navigable: ordinary.has(summary.id),
      order: summary.updatedAt || 0,
    });
  }
  const workflows = [...workflowNodes].sort((left, right) => left.anchorSeq - right.anchorSeq);
  for (const viewNode of workflows) {
    const data = viewNode.data;
    const phases = data.phases || [];
    const workflowId = `workflow:${viewNode.id}`;
    let memberCount = 0;
    for (const phase of phases) memberCount += phase.members.length;
    const metaParts = [t('node.tasks', { count: memberCount })];
    if (phases.length > 1) metaParts.push(t('node.phases', { count: phases.length }));
    nodesById.set(workflowId, {
      id: workflowId,
      label: data.name || t('node.workflow'),
      meta: metaParts.join(' · '),
      type: 'workflow',
      status: normalizeStatus(data.status),
      parentId: rootId,
      navigable: false,
      order: viewNode.anchorSeq,
    });
    for (const phase of phases) {
      for (const member of phase.members) {
        let child = nodesById.get(member.childId);
        if (child === undefined) {
          child = {
            id: member.childId,
            label: member.label || t('node.subagent'),
            meta: phaseMeta(t('node.subagent'), phase.phase, t),
            type: 'subagent',
            status: normalizeStatus(member.status),
            parentId: workflowId,
            navigable: false,
            order: member.seq,
          };
          nodesById.set(member.childId, child);
        } else {
          child.parentId = workflowId;
          child.status = normalizeStatus(member.status);
          child.order = member.seq;
          if (member.label) child.label = member.label;
          child.meta = phaseMeta(child.meta, phase.phase, t);
        }
      }
    }
  }
  const nodes = [...nodesById.values()];
  const edges = [];
  for (const node of nodes) {
    if (node.parentId === null || !nodesById.has(node.parentId)) continue;
    const from = nodesById.get(node.parentId);
    edges.push({
      id: `${node.parentId}>${node.id}`,
      from: node.parentId,
      to: node.id,
      workflow: from.type === 'workflow' || node.type === 'workflow',
    });
  }
  return {
    rootId,
    nodes,
    edges,
    parentIds: [...parentIds],
    activeCount: nodes.filter(node => node.id !== rootId && node.status === 'running').length,
  };
}

function nodeDepths(nodesById, rootId) {
  const depths = new Map([[rootId, 0]]);
  for (const node of nodesById.values()) {
    if (depths.has(node.id)) continue;
    const trail = [];
    const seen = new Set();
    let current = node;
    let baseDepth = 0;
    while (current !== undefined && !depths.has(current.id) && !seen.has(current.id)) {
      seen.add(current.id);
      trail.push(current);
      current = current.parentId === null ? undefined : nodesById.get(current.parentId);
    }
    if (current !== undefined && depths.has(current.id)) baseDepth = depths.get(current.id);
    for (let index = trail.length - 1; index >= 0; index -= 1) {
      baseDepth += 1;
      depths.set(trail[index].id, baseDepth);
    }
  }
  return depths;
}

export function graphLayout(graph) {
  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  const depths = nodeDepths(nodesById, graph.rootId);
  const maxDepth = Math.max(0, ...depths.values());
  const layers = Array.from({ length: maxDepth + 1 }, () => []);
  for (const node of graph.nodes) layers[depths.get(node.id) || 0].push(node);
  for (let depth = 0; depth < layers.length; depth += 1) {
    const parentOrder = depth === 0
      ? new Map()
      : new Map(layers[depth - 1].map((node, index) => [node.id, index]));
    layers[depth].sort((left, right) => {
      const parentDelta = (parentOrder.get(left.parentId) ?? 0) - (parentOrder.get(right.parentId) ?? 0);
      if (parentDelta !== 0) return parentDelta;
      const orderDelta = left.order - right.order;
      if (orderDelta !== 0) return orderDelta;
      return left.label.localeCompare(right.label);
    });
  }
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
    signature: graph.nodes.map(node => `${node.id}:${node.parentId}`).join('|'),
  };
}
