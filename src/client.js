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
const { NODE_WIDTH, NODE_HEIGHT, buildGraph, graphLayout, normalizeStatus } = GRAPH_MODEL;

const zh = {
  'title': '任务 DAG',
  'trigger.aria': '打开任务 DAG，共 {count} 个任务节点',
  'panel.summary': '{nodes} 个节点 · {edges} 条依赖',
  'panel.live': '基于会话投影实时更新',
  'graph.aria': '当前会话的任务有向无环图',
  'canvas.aria': '可拖拽平移的任务 DAG 画布',
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
  'node.drag': '拖动节点 {name}',
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
  'hint': '拖动空白画布可平移视图；拖动节点可调整布局；点击子代理节点可打开会话',
};

const en = {
  'title': 'Task DAG',
  'trigger.aria': 'Open Task DAG with {count} task nodes',
  'panel.summary': '{nodes} nodes · {edges} dependencies',
  'panel.live': 'Updates from live Session projections',
  'graph.aria': 'Directed acyclic task graph for the current Session',
  'canvas.aria': 'Pannable task DAG canvas',
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
  'node.drag': 'Drag node {name}',
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
  'hint': 'Drag the empty canvas to pan; drag nodes to arrange the graph; select a subagent node to open its Session',
};

function sameArray(left, right) {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return false;
  }
  return true;
}

function statusLabel(status, t) {
  return t(`status.${normalizeStatus(status)}`);
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

function GraphNode({ node, position, onDragEnd, onDragMove, onDragStart, onOpen, t }) {
  const clickable = node.navigable;
  const dragRef = useRef(null);
  const activate = (event) => {
    if (dragRef.current?.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current = null;
      return;
    }
    if (clickable) onOpen(node.id);
  };
  const onKeyDown = (event) => {
    if (!clickable || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onOpen(node.id);
  };
  const onPointerDown = (event) => {
    if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
    event.stopPropagation();
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
    onDragStart(node.id, event);
    if (typeof event.currentTarget.setPointerCapture === 'function') {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };
  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 3) {
      drag.moved = true;
    }
    if (!drag.moved) return;
    event.preventDefault();
    onDragMove(event);
  };
  const onPointerEnd = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (typeof event.currentTarget.hasPointerCapture === 'function'
      && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onDragEnd(event);
    if (!drag.moved || event.type === 'pointercancel') dragRef.current = null;
  };
  const ariaLabel = clickable
    ? `${t('node.open', { name: node.label })}. ${t('node.drag', { name: node.label })}`
    : undefined;
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
    onPointerDown,
    onPointerMove,
    onPointerUp: onPointerEnd,
    onPointerCancel: onPointerEnd,
  },
  h('title', null, `${node.label}\n${node.meta}\n${statusLabel(node.status, t)}\n${t('node.drag', { name: node.label })}`),
  h('rect', { className: 'dsh-task-dag-node-card', width: NODE_WIDTH, height: NODE_HEIGHT, rx: 10 }),
  h(NodeGlyph, { type: node.type, x: 0, y: 0 }),
  h('text', { className: 'dsh-task-dag-node-label', x: 52, y: 28 }, truncate(node.label, 18)),
  h('text', { className: 'dsh-task-dag-node-meta', x: 52, y: 49 }, truncate(node.meta, 24)),
  h('circle', { className: 'dsh-task-dag-status-dot', cx: NODE_WIDTH - 16, cy: 18, r: 3.25 }));
}

function TaskGraph({ fit, graph, layout, onDragEnd, onDragMove, onDragStart, onOpen, positions, t }) {
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
    const from = positions.get(edge.from);
    const to = positions.get(edge.to);
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
    position: positions.get(node.id),
    onDragEnd,
    onDragMove,
    onDragStart,
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

function TaskDagDialog({
  close, fit, graph, layout, nodePositions, onOpen, refresh, setFit, setNodePositions, t,
}) {
  const panelRef = useRef(null);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const nodeDragRef = useRef(null);
  const canvasDragRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [canvasDragging, setCanvasDragging] = useState(false);
  const positions = useMemo(() => {
    const next = new Map(layout.positions);
    for (const node of graph.nodes) {
      if (nodePositions[node.id] !== undefined) next.set(node.id, nodePositions[node.id]);
    }
    return next;
  }, [graph.nodes, layout.positions, nodePositions]);

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const nodeIds = new Set(graph.nodes.map(node => node.id));
    setNodePositions(current => {
      let changed = false;
      const next = {};
      for (const [id, nodePosition] of Object.entries(current)) {
        if (nodeIds.has(id)) next[id] = nodePosition;
        else changed = true;
      }
      return changed ? next : current;
    });
  }, [layout.signature]);
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

  const graphPoint = (svg, event) => {
    const rect = svg.getBoundingClientRect();
    const scale = Math.min(rect.width / layout.width, rect.height / layout.height);
    const renderedWidth = layout.width * scale;
    return {
      x: (event.clientX - rect.left - (rect.width - renderedWidth) / 2) / scale,
      y: (event.clientY - rect.top) / scale,
    };
  };
  const beginNodeDrag = (id, event) => {
    const svg = event.currentTarget.ownerSVGElement;
    const origin = positions.get(id);
    if (!svg || !origin) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    nodeDragRef.current = {
      pointerId: event.pointerId,
      id,
      origin,
      start: graphPoint(svg, event),
      svg,
    };
  };
  const moveNodeDrag = (event) => {
    const drag = nodeDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = graphPoint(drag.svg, event);
    const x = Math.round(Math.min(layout.width - NODE_WIDTH, Math.max(0, drag.origin.x + point.x - drag.start.x)));
    const y = Math.round(Math.min(layout.height - NODE_HEIGHT, Math.max(0, drag.origin.y + point.y - drag.start.y)));
    setNodePositions(current => {
      const previous = current[drag.id];
      if (previous?.x === x && previous?.y === y) return current;
      return { ...current, [drag.id]: { x, y } };
    });
  };
  const endNodeDrag = (event) => {
    const drag = nodeDragRef.current;
    if (drag && drag.pointerId === event.pointerId) nodeDragRef.current = null;
  };
  const beginCanvasDrag = (event) => {
    if (fit || event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    canvasDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
    };
    setCanvasDragging(true);
    if (typeof event.currentTarget.setPointerCapture === 'function') {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };
  const moveCanvasDrag = (event) => {
    const drag = canvasDragRef.current;
    const viewport = viewportRef.current;
    if (!drag || !viewport || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    viewport.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX);
    viewport.scrollTop = drag.scrollTop - (event.clientY - drag.startY);
  };
  const endCanvasDrag = (event) => {
    const drag = canvasDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (typeof event.currentTarget.hasPointerCapture === 'function'
      && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    canvasDragRef.current = null;
    setCanvasDragging(false);
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
    'data-panning': canvasDragging ? 'true' : undefined,
    role: 'region',
    'aria-label': t('canvas.aria'),
    tabIndex: 0,
    onPointerDown: beginCanvasDrag,
    onPointerMove: moveCanvasDrag,
    onPointerUp: endCanvasDrag,
    onPointerCancel: endCanvasDrag,
  }, h(TaskGraph, {
    fit,
    graph,
    layout,
    onDragEnd: endNodeDrag,
    onDragMove: moveNodeDrag,
    onDragStart: beginNodeDrag,
    onOpen,
    positions,
    t,
  })),
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
  const [nodePositions, setNodePositions] = useState({});
  const triggerRef = useRef(null);
  const catalogActionsRef = useRef({ refreshCatalogs, setCatalogsOpen });
  catalogActionsRef.current = { refreshCatalogs, setCatalogsOpen };
  const graph = useMemo(
    () => buildGraph(sessionId, rootRunning, summaries, catalogs, ordinaryIds, workflowNodes, t),
    [sessionId, rootRunning, summaries, catalogs, ordinaryIds, workflowNodes, t],
  );
  const layout = useMemo(() => graphLayout(graph), [graph]);
  const parentKey = graph.parentIds.join('\u001f');

  useEffect(() => { setNodePositions({}); }, [sessionId]);
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
      nodePositions,
      onOpen: openNode,
      refresh: () => catalogActionsRef.current.refreshCatalogs(graph.parentIds),
      setFit,
      setNodePositions,
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
