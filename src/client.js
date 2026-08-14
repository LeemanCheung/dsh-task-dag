'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const UI = require('@deepseek-ai/dsh-client-ui-primitives');
const {
  Fragment, createElement: h, useEffect, useLayoutEffect, useMemo, useRef, useState,
} = React;
const {
  IconCloseOutline16, IconFullscreenOutline16, IconRefreshOutline16,
} = UI;

const PACKAGE_ID = 'dsh-task-dag';
const NS = 'taskDag';
const NODE_WIDTH = 212;
const NODE_HEIGHT = 70;
const X_GAP = 24;
const Y_GAP = 58;
const CANVAS_PAD = 32;
const MIN_CANVAS_WIDTH = 720;

const zh = {
  'title': '任务 DAG',
  'trigger.aria': '打开任务 DAG，共 {count} 个任务节点',
  'panel.summary': '{nodes} 个节点 · {edges} 条依赖',
  'panel.live': '基于会话投影实时更新',
  'graph.aria': '当前会话的任务有向无环图',
  'button.close': '关闭任务 DAG',
  'button.fit': '适应视口',
  'button.original': '原始尺寸',
  'button.refresh': '刷新子代理目录',
  'node.current': '当前会话',
  'node.fallback': '未命名会话',
  'node.oneShot': '一次性子代理',
  'node.continuable': '可续接子代理',
  'node.subagent': '子代理',
  'node.workflow': '工作流',
  'node.tasks': '{count} 个任务',
  'node.phases': '{count} 个阶段',
  'node.phase': '阶段 · {name}',
  'node.open': '打开子代理会话 {name}',
  'status.running': '运行中',
  'status.completed': '已完成',
  'status.failed': '失败',
  'status.cancelled': '已取消',
  'status.interrupted': '已中断',
  'status.idle': '历史',
  'legend.running': '运行中',
  'legend.completed': '已完成',
  'legend.failed': '失败',
  'legend.interrupted': '中断 / 取消',
  'hint': '点击子代理节点可打开会话',
};

const en = {
  'title': 'Task DAG',
  'trigger.aria': 'Open Task DAG with {count} task nodes',
  'panel.summary': '{nodes} nodes · {edges} dependencies',
  'panel.live': 'Updates from live Session projections',
  'graph.aria': 'Directed acyclic task graph for the current Session',
  'button.close': 'Close Task DAG',
  'button.fit': 'Fit to viewport',
  'button.original': 'Original size',
  'button.refresh': 'Refresh subagent catalogs',
  'node.current': 'Current Session',
  'node.fallback': 'Untitled Session',
  'node.oneShot': 'One-shot subagent',
  'node.continuable': 'Continuable subagent',
  'node.subagent': 'Subagent',
  'node.workflow': 'Workflow',
  'node.tasks': '{count} tasks',
  'node.phases': '{count} phases',
  'node.phase': 'Phase · {name}',
  'node.open': 'Open subagent Session {name}',
  'status.running': 'Running',
  'status.completed': 'Completed',
  'status.failed': 'Failed',
  'status.cancelled': 'Cancelled',
  'status.interrupted': 'Interrupted',
  'status.idle': 'History',
  'legend.running': 'Running',
  'legend.completed': 'Completed',
  'legend.failed': 'Failed',
  'legend.interrupted': 'Interrupted / cancelled',
  'hint': 'Select a subagent node to open its Session',
};

function sameArray(left, right) {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

function normalizeStatus(status) {
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

function statusLabel(status, t) {
  return t(`status.${normalizeStatus(status)}`);
}

function lineageDepth(summary, rootId, summaries) {
  let current = summary;
  let depth = 0;
  const seen = new Set();
  while (current && current.origin === 'subagent' && current.parentId !== undefined) {
    if (seen.has(current.id)) return null;
    seen.add(current.id);
    depth += 1;
    if (current.parentId === rootId) return depth;
    current = summaries[current.parentId];
  }
  return null;
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

function buildGraph(rootId, rootRunning, summaries, catalogs, ordinaryIds, workflowNodes, t) {
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

  const parentIds = new Set([rootId]);
  for (const summary of Object.values(summaries)) {
    const depth = lineageDepth(summary, rootId, summaries);
    if (depth === null) continue;
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

function graphLayout(graph) {
  const nodesById = new Map(graph.nodes.map(node => [node.id, node]));
  const depths = new Map([[graph.rootId, 0]]);
  function depthOf(id, visiting = new Set()) {
    if (depths.has(id)) return depths.get(id);
    if (visiting.has(id)) return 1;
    visiting.add(id);
    const node = nodesById.get(id);
    const parentDepth = node?.parentId && nodesById.has(node.parentId)
      ? depthOf(node.parentId, visiting)
      : 0;
    visiting.delete(id);
    const depth = parentDepth + 1;
    depths.set(id, depth);
    return depth;
  }
  for (const node of graph.nodes) depthOf(node.id);

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

function truncate(value, length) {
  const chars = Array.from(String(value));
  return chars.length <= length ? chars.join('') : `${chars.slice(0, length - 1).join('')}…`;
}

function DagMark({ className }) {
  return h('svg', {
    className,
    viewBox: '0 0 18 18',
    fill: 'none',
    'aria-hidden': true,
  },
  h('path', { d: 'M9 5.2v2.1M4.2 10.2V8.3H13.8v1.9', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }),
  h('rect', { x: 6.7, y: 1.7, width: 4.6, height: 3.5, rx: 1.1, stroke: 'currentColor', strokeWidth: 1.4 }),
  h('rect', { x: 1.9, y: 10.2, width: 4.6, height: 3.5, rx: 1.1, stroke: 'currentColor', strokeWidth: 1.4 }),
  h('rect', { x: 11.5, y: 10.2, width: 4.6, height: 3.5, rx: 1.1, stroke: 'currentColor', strokeWidth: 1.4 }));
}

function NodeGlyph({ type, x, y }) {
  let glyph;
  if (type === 'root') {
    glyph = h(Fragment, null,
      h('rect', { x: 1.5, y: 2.5, width: 15, height: 13, rx: 2.4 }),
      h('path', { d: 'M1.8 6h14.4M5 4.3h.1M7.2 4.3h.1' }));
  } else if (type === 'workflow') {
    glyph = h(Fragment, null,
      h('path', { d: 'M9 4.5v3M4.5 11V8h9v3' }),
      h('circle', { cx: 9, cy: 3, r: 1.7 }),
      h('circle', { cx: 4.5, cy: 13, r: 1.7 }),
      h('circle', { cx: 13.5, cy: 13, r: 1.7 }));
  } else if (type === 'one-shot') {
    glyph = h('path', { d: 'M10.3 1.8 4.7 9h4l-1 7.2 5.6-8h-4l1-6.4Z' });
  } else if (type === 'continuable') {
    glyph = h(Fragment, null,
      h('path', { d: 'M14.8 7A6 6 0 0 0 4.6 4.2L3.2 5.7M3.2 5.7l.1-3M3.2 5.7l3-.2' }),
      h('path', { d: 'M3.2 11A6 6 0 0 0 13.4 13.8l1.4-1.5M14.8 12.3l-.1 3M14.8 12.3l-3 .2' }));
  } else {
    glyph = h(Fragment, null,
      h('path', { d: 'M4 3.5h3.2c1 0 1.8.8 1.8 1.8v7.2M9 8.4h3.2' }),
      h('circle', { cx: 3, cy: 3.5, r: 1.5 }),
      h('circle', { cx: 13.5, cy: 8.4, r: 1.5 }),
      h('circle', { cx: 9, cy: 14, r: 1.5 }));
  }
  return h('g', { transform: `translate(${x + 14} ${y + 14})` },
    h('rect', { className: 'dsh-task-dag-node-icon-bg', width: 28, height: 28, rx: 8 }),
    h('g', { className: 'dsh-task-dag-node-icon', transform: 'translate(5 5)' }, glyph));
}

function GraphNode({ node, position, onOpen, t }) {
  const clickable = node.navigable;
  const activate = () => { if (clickable) onOpen(node.id); };
  const onKeyDown = (event) => {
    if (!clickable || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    activate();
  };
  const ariaLabel = clickable ? t('node.open', { name: node.label }) : undefined;
  return h('g', {
    className: 'dsh-task-dag-node',
    transform: `translate(${position.x} ${position.y})`,
    'data-type': node.type,
    'data-status': node.status,
    'data-clickable': clickable ? 'true' : undefined,
    role: clickable ? 'button' : undefined,
    tabIndex: clickable ? 0 : undefined,
    'aria-label': ariaLabel,
    onClick: activate,
    onKeyDown,
  },
  h('title', null, `${node.label}\n${node.meta}\n${statusLabel(node.status, t)}`),
  h('rect', { className: 'dsh-task-dag-node-card', width: NODE_WIDTH, height: NODE_HEIGHT, rx: 10 }),
  h(NodeGlyph, { type: node.type, x: 0, y: 0 }),
  h('text', { className: 'dsh-task-dag-node-label', x: 52, y: 28 }, truncate(node.label, 18)),
  h('text', { className: 'dsh-task-dag-node-meta', x: 52, y: 49 }, truncate(node.meta, 24)),
  h('circle', { className: 'dsh-task-dag-status-dot', cx: NODE_WIDTH - 16, cy: 18, r: 3.25 }));
}

function TaskGraph({ fit, graph, layout, onOpen, t }) {
  return h('svg', {
    className: 'dsh-task-dag-svg',
    'data-fit': fit ? 'true' : undefined,
    width: fit ? '100%' : layout.width,
    height: fit ? '100%' : layout.height,
    style: fit ? {
      maxWidth: `${layout.width}px`,
      maxHeight: `${layout.height}px`,
      margin: '0 auto',
    } : undefined,
    viewBox: `0 0 ${layout.width} ${layout.height}`,
    preserveAspectRatio: 'xMidYMin meet',
    role: 'img',
    'aria-label': t('graph.aria'),
  },
  h('defs', null,
    h('marker', {
      id: 'dsh-task-dag-arrow',
      markerWidth: 7,
      markerHeight: 7,
      refX: 5.5,
      refY: 3.5,
      orient: 'auto',
      markerUnits: 'userSpaceOnUse',
    }, h('path', { className: 'dsh-task-dag-arrow', d: 'M0 0 6 3.5 0 7Z' }))),
  ...graph.edges.map((edge) => {
    const from = layout.positions.get(edge.from);
    const to = layout.positions.get(edge.to);
    if (!from || !to) return null;
    const x1 = from.x + NODE_WIDTH / 2;
    const y1 = from.y + NODE_HEIGHT;
    const x2 = to.x + NODE_WIDTH / 2;
    const y2 = to.y;
    const middle = (y1 + y2) / 2;
    return h('path', {
      key: edge.id,
      className: 'dsh-task-dag-edge',
      'data-workflow': edge.workflow ? 'true' : undefined,
      d: `M${x1} ${y1}C${x1} ${middle} ${x2} ${middle} ${x2} ${y2 - 4}`,
      markerEnd: 'url(#dsh-task-dag-arrow)',
    });
  }),
  ...graph.nodes.map(node => h(GraphNode, {
    key: node.id,
    node,
    position: layout.positions.get(node.id),
    onOpen,
    t,
  })));
}

function Legend({ t }) {
  return h('div', { className: 'dsh-task-dag-legend' },
    ...['running', 'completed', 'failed', 'interrupted'].map(status => h('span', {
      className: 'dsh-task-dag-legend-item',
      key: status,
    },
    h('span', { className: 'dsh-task-dag-legend-dot', 'data-status': status }),
    h('span', null, t(`legend.${status}`)))));
}

function TaskDagDialog({ close, fit, graph, layout, onOpen, refresh, setFit, t }) {
  const panelRef = useRef(null);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    if (fit) return;
    const viewport = viewportRef.current;
    const root = layout.positions.get(graph.rootId);
    if (!viewport || !root) return;
    viewport.scrollLeft = Math.max(0, root.x + NODE_WIDTH / 2 - viewport.clientWidth / 2);
    viewport.scrollTop = 0;
  }, [fit, layout.signature]);

  const beginDrag = (event) => {
    const target = event.target;
    if (target && typeof target.closest === 'function' && target.closest('button')) return;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    const panel = panelRef.current;
    if (!drag || !panel || drag.pointerId !== event.pointerId) return;
    const maxX = Math.max(12, window.innerWidth - drag.width - 12);
    const maxY = Math.max(12, window.innerHeight - drag.height - 12);
    drag.x = Math.min(maxX, Math.max(12, drag.left + event.clientX - drag.startX));
    drag.y = Math.min(maxY, Math.max(12, drag.top + event.clientY - drag.startY));
    panel.style.left = `${drag.x}px`;
    panel.style.top = `${drag.y}px`;
    panel.style.transform = 'none';
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setPosition({ x: drag.x, y: drag.y });
  };

  const panelStyle = position === null
    ? { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
    : { left: position.x, top: position.y, transform: 'none' };

  return h('div', {
    className: 'dsh-task-dag-backdrop',
    onPointerDown: (event) => { if (event.currentTarget === event.target) close(true); },
  },
  h('section', {
    ref: panelRef,
    className: 'dsh-task-dag-panel',
    style: panelStyle,
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': 'dsh-task-dag-title',
    tabIndex: -1,
  },
  h('header', {
    className: 'dsh-task-dag-panel-header',
    onPointerDown: beginDrag,
    onPointerMove: moveDrag,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  },
  h('span', { className: 'dsh-task-dag-brand' }, h(DagMark, {})),
  h('div', { className: 'dsh-task-dag-heading' },
    h('h2', { className: 'dsh-task-dag-title', id: 'dsh-task-dag-title' }, t('title')),
    h('div', { className: 'dsh-task-dag-subtitle' },
      `${t('panel.summary', { nodes: graph.nodes.length, edges: graph.edges.length })} · ${t('panel.live')}`)),
  h('div', { className: 'dsh-task-dag-actions' },
    h('button', {
      type: 'button',
      className: 'dsh-task-dag-icon-button',
      title: t('button.refresh'),
      'aria-label': t('button.refresh'),
      onClick: refresh,
    }, h(IconRefreshOutline16)),
    h('button', {
      type: 'button',
      className: 'dsh-task-dag-icon-button',
      'data-active': fit ? 'true' : undefined,
      title: fit ? t('button.original') : t('button.fit'),
      'aria-label': fit ? t('button.original') : t('button.fit'),
      onClick: () => setFit(value => !value),
    }, h(IconFullscreenOutline16)),
    h('button', {
      type: 'button',
      className: 'dsh-task-dag-icon-button',
      title: t('button.close'),
      'aria-label': t('button.close'),
      onClick: () => close(true),
    }, h(IconCloseOutline16)))),
  h('div', {
    ref: viewportRef,
    className: 'dsh-task-dag-viewport',
    'data-fit': fit ? 'true' : undefined,
  }, h(TaskGraph, { fit, graph, layout, onOpen, t })),
  h('footer', { className: 'dsh-task-dag-footer' },
    h(Legend, { t }),
    h('span', { className: 'dsh-task-dag-hint' }, t('hint')))));
}

function TaskDagAction({
  sessionId, useSession, useSessions, openSession, refreshCatalogs, setCatalogsOpen, t,
}) {
  const summaries = useSessions(state => state.byId);
  const catalogs = useSessions(state => state.subagentsByParent);
  const ordinaryIds = useSessions(state => state.ids);
  const rootRunning = useSession(state => state.running);
  const workflowNodes = useSession(
    state => state.chat.nodes.values().filter(node => node.kind === 'workflow-run'),
    sameArray,
  );
  const [open, setOpen] = useState(false);
  const [fit, setFit] = useState(true);
  const triggerRef = useRef(null);
  const catalogActionsRef = useRef({ refreshCatalogs, setCatalogsOpen });
  catalogActionsRef.current = { refreshCatalogs, setCatalogsOpen };
  const graph = useMemo(
    () => buildGraph(sessionId, rootRunning, summaries, catalogs, ordinaryIds, workflowNodes, t),
    [sessionId, rootRunning, summaries, catalogs, ordinaryIds, workflowNodes, t],
  );
  const layout = useMemo(() => graphLayout(graph), [graph]);
  const parentKey = graph.parentIds.join('\u001f');

  useEffect(() => {
    if (!open) return undefined;
    const parentIds = graph.parentIds;
    catalogActionsRef.current.setCatalogsOpen(parentIds, true);
    catalogActionsRef.current.refreshCatalogs(parentIds);
    return () => { catalogActionsRef.current.setCatalogsOpen(parentIds, false); };
  }, [open, parentKey]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      queueMicrotask(() => triggerRef.current?.focus());
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); };
  }, [open]);

  const close = (restoreFocus) => {
    setOpen(false);
    if (restoreFocus) queueMicrotask(() => triggerRef.current?.focus());
  };
  const openNode = (id) => {
    close(false);
    openSession(id);
  };
  const count = graph.nodes.length - 1;

  return h('div', { className: 'dsh-task-dag-root' },
    h('button', {
      ref: triggerRef,
      type: 'button',
      className: 'dsh-task-dag-trigger',
      'aria-expanded': open,
      'aria-label': t('trigger.aria', { count }),
      onClick: () => setOpen(value => !value),
    },
    h(DagMark, { className: 'dsh-task-dag-trigger-logo' }),
    h('span', null, t('title')),
    graph.activeCount > 0 ? h('span', { className: 'dsh-task-dag-live-dot', 'aria-hidden': true }) : null,
    h('span', { className: 'dsh-task-dag-trigger-count', 'aria-hidden': true }, count)),
    open ? ReactDOM.createPortal(h(TaskDagDialog, {
      close,
      fit,
      graph,
      layout,
      onOpen: openNode,
      refresh: () => catalogActionsRef.current.refreshCatalogs(graph.parentIds),
      setFit,
      t,
    }), document.body) : null);
}

const inject = ['sessions', 'slots', 'locale'];

function apply(ctx) {
  ctx.effect(() => {
    const tag = document.createElement('style');
    tag.dataset.plugin = PACKAGE_ID;
    tag.dataset.pluginCss = `${PACKAGE_ID}/main`;
    tag.textContent = STYLE_TEXT;
    document.head.appendChild(tag);
    return () => { tag.remove(); };
  }, 'task-dag: styles');
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'task-dag: dictionaries');
  ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'task-dag',
    order: 15,
    locale: NS,
    inject: () => ({
      openSession(id) {
        ctx.sessions.open(id);
      },
      refreshCatalogs(parentIds) {
        for (const parentId of parentIds) void ctx.sessions.refreshSubagents(parentId);
      },
      setCatalogsOpen(parentIds, open) {
        for (const parentId of parentIds) ctx.sessions.setSubagentCatalogOpen(parentId, open);
      },
    }),
  }, TaskDagAction));
}

exports.inject = inject;
exports.apply = apply;
