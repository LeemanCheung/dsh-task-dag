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
const MODES = ['overview', 'team', 'workflow'];
const MESSAGE_DETAIL_LIMIT = 100;
const { NODE_WIDTH, NODE_HEIGHT, buildGraph, graphLayout, normalizeStatus } = GRAPH_MODEL;
const { TEAM_SNAPSHOT_KIND, createTeamSnapshotDefinition } = TEAM_PROJECTION;

const zh = {
  'title': '任务 DAG',
  'trigger.aria': '打开任务 DAG，共 {count} 个拓扑节点',
  'panel.summary': '{nodes} 个节点 · {edges} 条结构边 · {channels} 条通信链路',
  'panel.live': '基于持久会话投影实时更新',
  'graph.aria': '当前会话的 Agent Teams 与 Workflow 拓扑图',
  'canvas.aria': '可拖拽平移的任务 DAG 画布',
  'button.close': '关闭任务 DAG',
  'button.fit': '适应视口',
  'button.original': '原始尺寸',
  'button.refresh': '刷新子代理目录',
  'button.communications.show': '显示 Agent 通信层',
  'button.communications.hide': '隐藏 Agent 通信层',
  'button.inspector.close': '关闭通信详情',
  'mode.overview': '总览',
  'mode.team': 'Agent Teams',
  'mode.workflow': 'Workflow',
  'mode.aria': '选择任务 DAG 视图',
  'node.current': '当前会话',
  'node.fallback': '未命名会话',
  'node.oneShot': '一次性子代理',
  'node.continuable': '可续接子代理',
  'node.subagent': '子代理',
  'node.teammate': 'Teammate',
  'node.workflowMember': 'Workflow Worker',
  'node.workflow': 'Workflow Run',
  'node.phaseGroup': '阶段分组',
  'node.teamTask': '共享任务',
  'node.unphased': '未分阶段',
  'node.unassigned': '未分配',
  'node.unknownOwner': '未知负责人',
  'node.taskMeta': '{id} · {owner}',
  'node.tasks': '{count} 个成员',
  'node.phases': '{count} 个阶段',
  'node.phaseTasks': '{count} 个成员',
  'node.open': '打开子代理会话 {name}',
  'node.drag': '拖动节点 {name}',
  'status.running': '运行中',
  'status.completed': '已完成',
  'status.failed': '失败',
  'status.cancelled': '已取消',
  'status.interrupted': '已中断',
  'status.ready': '可开始',
  'status.blocked': '被阻塞',
  'status.pending': '待处理',
  'status.provisioning': '创建中',
  'status.idle': '空闲 / 历史',
  'legend.running': '运行中',
  'legend.completed': '已完成',
  'legend.failed': '失败',
  'legend.blocked': '阻塞 / 中断',
  'edge.dependency': '任务依赖',
  'edge.assignment': '任务分配',
  'edge.team': 'Team 成员',
  'edge.workflow': 'Workflow 分组',
  'edge.communication': 'Agent 通信',
  'communication.aria': '{sender} 向 {target} 的通信，共 {count} 条，{pending} 条待投递',
  'communication.title': 'Agent 通信',
  'communication.summary': '{sender} → {target}',
  'communication.count': '{count} 条消息',
  'communication.pending': '{count} 条待投递',
  'communication.delivered': '已投递',
  'communication.queued': '待投递',
  'communication.quiet': 'quiet',
  'communication.wakeup': 'wakeup',
  'communication.noText': '无文本内容',
  'communication.nonText': '另含 {count} 个非文本块：{types}',
  'communication.more': '仅显示最近 {shown} 条，另有 {hidden} 条未展开',
  'empty.team.title': '当前会话没有 Team 任务或通信',
  'empty.team.body': 'Agent Teams 的共享任务和通信记录只存放在 Team Lead Session。',
  'empty.team.openLead': '打开上级 Session',
  'empty.workflow.title': '当前会话没有 Workflow 运行记录',
  'empty.workflow.body': '运行 workflow 后，阶段分组和已启动成员会从持久会话投影中出现。',
  'hint': '拖动画布平移；拖动节点调整布局；点击 Agent 打开 Session；点击通信边查看时间线',
};

const en = {
  'title': 'Task DAG',
  'trigger.aria': 'Open Task DAG with {count} topology nodes',
  'panel.summary': '{nodes} nodes · {edges} structural edges · {channels} communication channels',
  'panel.live': 'Live from durable Session projections',
  'graph.aria': 'Agent Teams and Workflow topology for the current Session',
  'canvas.aria': 'Pannable task DAG canvas',
  'button.close': 'Close Task DAG',
  'button.fit': 'Fit to viewport',
  'button.original': 'Original size',
  'button.refresh': 'Refresh subagent catalogs',
  'button.communications.show': 'Show Agent communication layer',
  'button.communications.hide': 'Hide Agent communication layer',
  'button.inspector.close': 'Close communication details',
  'mode.overview': 'Overview',
  'mode.team': 'Agent Teams',
  'mode.workflow': 'Workflow',
  'mode.aria': 'Select Task DAG view',
  'node.current': 'Current Session',
  'node.fallback': 'Untitled Session',
  'node.oneShot': 'One-shot subagent',
  'node.continuable': 'Continuable subagent',
  'node.subagent': 'Subagent',
  'node.teammate': 'Teammate',
  'node.workflowMember': 'Workflow worker',
  'node.workflow': 'Workflow run',
  'node.phaseGroup': 'Phase group',
  'node.teamTask': 'Shared task',
  'node.unphased': 'Unphased',
  'node.unassigned': 'Unassigned',
  'node.unknownOwner': 'Unknown owner',
  'node.taskMeta': '{id} · {owner}',
  'node.tasks': '{count} members',
  'node.phases': '{count} phases',
  'node.phaseTasks': '{count} members',
  'node.open': 'Open subagent Session {name}',
  'node.drag': 'Drag node {name}',
  'status.running': 'Running',
  'status.completed': 'Completed',
  'status.failed': 'Failed',
  'status.cancelled': 'Cancelled',
  'status.interrupted': 'Interrupted',
  'status.ready': 'Ready',
  'status.blocked': 'Blocked',
  'status.pending': 'Pending',
  'status.provisioning': 'Provisioning',
  'status.idle': 'Idle / history',
  'legend.running': 'Running',
  'legend.completed': 'Completed',
  'legend.failed': 'Failed',
  'legend.blocked': 'Blocked / interrupted',
  'edge.dependency': 'Task dependency',
  'edge.assignment': 'Task assignment',
  'edge.team': 'Team member',
  'edge.workflow': 'Workflow grouping',
  'edge.communication': 'Agent communication',
  'communication.aria': '{sender} to {target}, {count} messages, {pending} awaiting delivery',
  'communication.title': 'Agent communication',
  'communication.summary': '{sender} → {target}',
  'communication.count': '{count} messages',
  'communication.pending': '{count} awaiting delivery',
  'communication.delivered': 'Delivered',
  'communication.queued': 'Queued',
  'communication.quiet': 'quiet',
  'communication.wakeup': 'wakeup',
  'communication.noText': 'No text content',
  'communication.nonText': '{count} non-text blocks: {types}',
  'communication.more': 'Showing the latest {shown}; {hidden} older messages are collapsed',
  'empty.team.title': 'No Team tasks or communication in this Session',
  'empty.team.body': 'Agent Teams stores the shared task board and communication journal in the Team Lead Session.',
  'empty.team.openLead': 'Open parent Session',
  'empty.workflow.title': 'No Workflow runs in this Session',
  'empty.workflow.body': 'Run a workflow to project its phase groups and started members here.',
  'hint': 'Drag the canvas to pan; drag nodes to arrange; select an Agent to open its Session; select a communication edge for its timeline',
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
  return h('svg', { className, viewBox: '0 0 18 18', fill: 'none', 'aria-hidden': true },
    h('path', { d: 'M9 5.2v2.1M4.2 10.2V8.3H13.8v1.9', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }),
    h('rect', { x: 6.7, y: 1.7, width: 4.6, height: 3.5, rx: 1.1, stroke: 'currentColor', strokeWidth: 1.4 }),
    h('rect', { x: 1.9, y: 10.2, width: 4.6, height: 3.5, rx: 1.1, stroke: 'currentColor', strokeWidth: 1.4 }),
    h('rect', { x: 11.5, y: 10.2, width: 4.6, height: 3.5, rx: 1.1, stroke: 'currentColor', strokeWidth: 1.4 }));
}

function CommunicationMark({ className }) {
  return h('svg', { className, viewBox: '0 0 18 18', fill: 'none', 'aria-hidden': true },
    h('path', { d: 'M3 4.5h7.5v5H7l-2.5 2v-2H3zM8 8.5h7v5h-2v2l-2.5-2H8', stroke: 'currentColor', strokeWidth: 1.35, strokeLinejoin: 'round' }));
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
  } else if (type === 'phase') {
    glyph = h(Fragment, null,
      h('path', { d: 'M3 4h12M3 9h12M3 14h8' }),
      h('circle', { cx: 4, cy: 4, r: 1 }), h('circle', { cx: 9, cy: 9, r: 1 }));
  } else if (type === 'task') {
    glyph = h(Fragment, null,
      h('rect', { x: 2, y: 2, width: 14, height: 14, rx: 2.5 }),
      h('path', { d: 'm5 9 2.2 2.2L13 5.8' }));
  } else if (type === 'teammate') {
    glyph = h(Fragment, null,
      h('circle', { cx: 7, cy: 6, r: 3 }), h('path', { d: 'M2.5 15c.4-3 2-4.5 4.5-4.5S11.2 12 11.5 15M12 5.5h4M14 3.5v4' }));
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
  return h('g', { transform: `translate(${x + 15} ${y + 16})` },
    h('rect', { className: 'dsh-task-dag-node-icon-bg', width: 30, height: 30, rx: 8 }),
    h('g', { className: 'dsh-task-dag-node-icon', transform: 'translate(6 6)' }, glyph));
}

function GraphNode({ node, position, onDragEnd, onDragMove, onDragStart, onOpen, t }) {
  const clickable = node.navigable && node.navigationId;
  const dragRef = useRef(null);
  const activate = (event) => {
    if (dragRef.current?.moved) {
      event.preventDefault();
      event.stopPropagation();
      dragRef.current = null;
      return;
    }
    if (clickable) onOpen(node.navigationId);
  };
  const onKeyDown = (event) => {
    if (!clickable || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onOpen(node.navigationId);
  };
  const onPointerDown = (event) => {
    if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
    event.stopPropagation();
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
    onDragStart(node.id, event);
    if (typeof event.currentTarget.setPointerCapture === 'function') event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 3) drag.moved = true;
    if (!drag.moved) return;
    event.preventDefault();
    onDragMove(event);
  };
  const onPointerEnd = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (typeof event.currentTarget.hasPointerCapture === 'function'
      && event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    onDragEnd(event);
    if (!drag.moved || event.type === 'pointercancel') dragRef.current = null;
  };
  const title = [node.label, node.meta, statusLabel(node.status, t), node.description].filter(Boolean).join('\n');
  return h('g', {
    className: 'dsh-task-dag-node',
    transform: `translate(${position.x} ${position.y})`,
    'data-type': node.type,
    'data-status': node.status,
    'data-clickable': clickable ? 'true' : undefined,
    role: clickable ? 'button' : undefined,
    tabIndex: clickable ? 0 : undefined,
    'aria-label': clickable ? `${t('node.open', { name: node.label })}. ${t('node.drag', { name: node.label })}` : undefined,
    onClick: activate,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp: onPointerEnd,
    onPointerCancel: onPointerEnd,
  },
  h('title', null, title),
  h('rect', { className: 'dsh-task-dag-node-card', width: NODE_WIDTH, height: NODE_HEIGHT, rx: 11 }),
  h('rect', { className: 'dsh-task-dag-node-accent', width: 4, height: NODE_HEIGHT - 20, x: 0, y: 10, rx: 2 }),
  h(NodeGlyph, { type: node.type, x: 0, y: 0 }),
  h('text', { className: 'dsh-task-dag-node-label', x: 56, y: 30 }, truncate(node.label, 19)),
  h('text', { className: 'dsh-task-dag-node-meta', x: 56, y: 52 }, truncate(node.meta, 28)),
  h('circle', { className: 'dsh-task-dag-status-dot', cx: NODE_WIDTH - 17, cy: 19, r: 3.5 }));
}

function structuralPath(from, to) {
  const x1 = from.x + NODE_WIDTH / 2;
  const y1 = from.y + NODE_HEIGHT;
  const x2 = to.x + NODE_WIDTH / 2;
  const y2 = to.y;
  const middle = (y1 + y2) / 2;
  return `M${x1} ${y1}C${x1} ${middle} ${x2} ${middle} ${x2} ${y2 - 5}`;
}

function communicationGeometry(from, to, curve) {
  const x1 = from.x + NODE_WIDTH / 2;
  const y1 = from.y + NODE_HEIGHT / 2;
  const x2 = to.x + NODE_WIDTH / 2;
  const y2 = to.y + NODE_HEIGHT / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const offset = curve === 0 ? 34 : 54 * curve;
  const cx = (x1 + x2) / 2 - (dy / distance) * offset;
  const cy = (y1 + y2) / 2 + (dx / distance) * offset;
  return {
    d: `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`,
    labelX: (x1 + 2 * cx + x2) / 4,
    labelY: (y1 + 2 * cy + y2) / 4,
  };
}

function GraphEdge({ edge, positions, selected, onSelectCommunication, t }) {
  const from = positions.get(edge.from);
  const to = positions.get(edge.to);
  if (!from || !to) return null;
  if (edge.kind !== 'communication') {
    return h('path', {
      className: 'dsh-task-dag-edge',
      'data-kind': edge.kind,
      d: structuralPath(from, to),
      markerEnd: 'url(#dsh-task-dag-arrow)',
    });
  }
  const geometry = communicationGeometry(from, to, edge.curve || 0);
  const activate = (event) => {
    event.stopPropagation();
    onSelectCommunication(edge.id);
  };
  const onKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    activate(event);
  };
  return h('g', {
    className: 'dsh-task-dag-communication',
    'data-communication': 'true',
    'data-edge-id': edge.id,
    'data-selected': selected ? 'true' : undefined,
    role: 'button',
    tabIndex: 0,
    'aria-label': t('communication.aria', {
      sender: edge.senderName,
      target: edge.targetName,
      count: edge.count,
      pending: edge.pending,
    }),
    onClick: activate,
    onKeyDown,
  },
  h('path', { className: 'dsh-task-dag-communication-hit', d: geometry.d }),
  h('path', {
    className: 'dsh-task-dag-edge',
    'data-kind': 'communication',
    'data-pending': edge.pending > 0 ? 'true' : undefined,
    d: geometry.d,
    markerEnd: 'url(#dsh-task-dag-communication-arrow)',
  }),
  h('g', { className: 'dsh-task-dag-edge-count', transform: `translate(${geometry.labelX} ${geometry.labelY})` },
    h('circle', { r: edge.pending > 0 ? 11 : 9 }),
    h('text', { y: 3 }, edge.count)));
}

function TaskGraph({
  graph, layout, positions, showCommunications, selectedCommunication,
  onSelectCommunication, onDragEnd, onDragMove, onDragStart, onOpen, t, fit,
}) {
  const edges = graph.edges.filter(edge => edge.kind !== 'communication' || showCommunications);
  return h('svg', {
    className: 'dsh-task-dag-svg',
    'data-fit': fit ? 'true' : undefined,
    width: fit ? '100%' : layout.width,
    height: fit ? '100%' : layout.height,
    style: fit ? { maxWidth: `${layout.width}px`, maxHeight: `${layout.height}px`, margin: '0 auto' } : undefined,
    viewBox: `0 0 ${layout.width} ${layout.height}`,
    preserveAspectRatio: 'xMidYMin meet',
    role: 'group',
    'aria-label': t('graph.aria'),
  },
  h('defs', null,
    h('marker', { id: 'dsh-task-dag-arrow', markerWidth: 7, markerHeight: 7, refX: 5.5, refY: 3.5, orient: 'auto', markerUnits: 'userSpaceOnUse' },
      h('path', { className: 'dsh-task-dag-arrow', d: 'M0 0 6 3.5 0 7Z' })),
    h('marker', { id: 'dsh-task-dag-communication-arrow', markerWidth: 8, markerHeight: 8, refX: 6.4, refY: 4, orient: 'auto', markerUnits: 'userSpaceOnUse' },
      h('path', { className: 'dsh-task-dag-communication-arrow', d: 'M0 0 7 4 0 8Z' }))),
  ...edges.filter(edge => edge.kind !== 'communication').map(edge => h(GraphEdge, { key: edge.id, edge, positions, t })),
  ...edges.filter(edge => edge.kind === 'communication').map(edge => h(GraphEdge, {
    key: edge.id,
    edge,
    positions,
    selected: selectedCommunication === edge.id,
    onSelectCommunication,
    t,
  })),
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

function ViewTabs({ graphs, mode, setMode, t }) {
  const onKeyDown = (event) => {
    const tabs = [...(event.currentTarget.parentElement?.querySelectorAll('[role="tab"]') || [])];
    const current = tabs.indexOf(event.currentTarget);
    if (current < 0) return;
    let next;
    if (event.key === 'ArrowLeft') next = (current + MODES.length - 1) % MODES.length;
    else if (event.key === 'ArrowRight') next = (current + 1) % MODES.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = MODES.length - 1;
    else return;
    event.preventDefault();
    setMode(MODES[next]);
    tabs[next]?.focus();
  };
  return h('nav', { className: 'dsh-task-dag-tabs', role: 'tablist', 'aria-label': t('mode.aria') },
    ...MODES.map(view => h('button', {
      key: view,
      id: `dsh-task-dag-tab-${view}`,
      type: 'button',
      role: 'tab',
      className: 'dsh-task-dag-tab',
      tabIndex: mode === view ? 0 : -1,
      'aria-selected': mode === view,
      'aria-controls': 'dsh-task-dag-tabpanel',
      'data-active': mode === view ? 'true' : undefined,
      onClick: () => setMode(view),
      onKeyDown,
    },
    h('span', null, t(`mode.${view}`)),
    h('span', { className: 'dsh-task-dag-tab-count', 'aria-hidden': true }, Math.max(0, graphs[view].nodes.length - 1)))));
}

function StatusLegend({ t }) {
  return h('div', { className: 'dsh-task-dag-legend' },
    ...['running', 'completed', 'failed', 'blocked'].map(status => h('span', {
      className: 'dsh-task-dag-legend-item', key: status,
    },
    h('span', { className: 'dsh-task-dag-legend-dot', 'data-status': status }),
    h('span', null, t(`legend.${status}`)))));
}

function EdgeLegend({ mode, showCommunications, t }) {
  const kinds = mode === 'workflow'
    ? ['workflow']
    : mode === 'team'
      ? ['team', 'assignment', 'dependency', ...(showCommunications ? ['communication'] : [])]
      : ['dependency', 'workflow', ...(showCommunications ? ['communication'] : [])];
  return h('div', { className: 'dsh-task-dag-edge-legend' },
    ...kinds.map(kind => h('span', { className: 'dsh-task-dag-legend-item', key: kind },
      h('span', { className: 'dsh-task-dag-edge-sample', 'data-kind': kind }),
      h('span', null, t(`edge.${kind}`)))));
}

function nonTextSummary(types, t) {
  if (types.length === 0) return null;
  const counts = new Map();
  for (const type of types) counts.set(type, (counts.get(type) || 0) + 1);
  const label = [...counts].map(([type, count]) => `${type} ×${count}`).join(', ');
  return t('communication.nonText', { count: types.length, types: label });
}

function CommunicationInspector({ edge, onClose, t }) {
  if (!edge) return null;
  const messages = edge.messages.slice(0, MESSAGE_DETAIL_LIMIT);
  return h('aside', { className: 'dsh-task-dag-inspector', 'aria-labelledby': 'dsh-task-dag-communication-title' },
    h('header', { className: 'dsh-task-dag-inspector-header' },
      h('div', null,
        h('h3', { id: 'dsh-task-dag-communication-title' }, t('communication.title')),
        h('p', null, t('communication.summary', { sender: edge.senderName, target: edge.targetName }))),
      h('button', { type: 'button', className: 'dsh-task-dag-icon-button', title: t('button.inspector.close'), 'aria-label': t('button.inspector.close'), onClick: onClose }, h(IconCloseOutline16))),
    h('div', { className: 'dsh-task-dag-inspector-stats' },
      h('span', null, t('communication.count', { count: edge.count })),
      edge.pending > 0 ? h('span', { 'data-pending': 'true' }, t('communication.pending', { count: edge.pending })) : null),
    h('ol', { className: 'dsh-task-dag-message-list' },
      ...messages.map(message => h('li', { key: message.id, className: 'dsh-task-dag-message' },
        h('div', { className: 'dsh-task-dag-message-meta' },
          h('time', { dateTime: new Date(message.time).toISOString() }, new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })),
          h('span', { 'data-delivery': message.delivery }, t(`communication.${message.delivery}`)),
          h('span', { 'data-status': message.delivered ? 'delivered' : 'queued' }, t(message.delivered ? 'communication.delivered' : 'communication.queued'))),
        h('p', { className: 'dsh-task-dag-message-text' }, message.text ? truncate(message.text, 260) : t('communication.noText')),
        message.nonText.length > 0 ? h('p', { className: 'dsh-task-dag-message-nontext' }, nonTextSummary(message.nonText, t)) : null))),
    edge.messages.length > messages.length ? h('p', { className: 'dsh-task-dag-message-more' }, t('communication.more', {
      shown: messages.length,
      hidden: edge.messages.length - messages.length,
    })) : null);
}

function EmptyState({ mode, leadSessionId, onOpen, t }) {
  if (mode === 'overview') return null;
  return h('div', { className: 'dsh-task-dag-empty' },
    mode === 'team' ? h(CommunicationMark, {}) : h(DagMark, {}),
    h('h3', null, t(`empty.${mode}.title`)),
    h('p', null, t(`empty.${mode}.body`)),
    mode === 'team' && leadSessionId ? h('button', { type: 'button', onClick: () => onOpen(leadSessionId) }, t('empty.team.openLead')) : null);
}

function TaskDagDialog({
  close, fit, graphs, mode, nodePositions, onOpen, refresh, setFit, setMode, setNodePositions,
  showCommunications, setShowCommunications, leadSessionId, t,
}) {
  const panelRef = useRef(null);
  const viewportRef = useRef(null);
  const dragRef = useRef(null);
  const nodeDragRef = useRef(null);
  const canvasDragRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [canvasDragging, setCanvasDragging] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const graph = graphs[mode];
  const layout = useMemo(() => graphLayout(graph), [graph]);
  const selectedEdge = graph.edges.find(edge => edge.id === selectedCommunication && edge.kind === 'communication');
  const positions = useMemo(() => {
    const next = new Map(layout.positions);
    for (const node of graph.nodes) if (nodePositions[node.id] !== undefined) next.set(node.id, nodePositions[node.id]);
    return next;
  }, [graph.nodes, layout.positions, nodePositions]);

  useEffect(() => { panelRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => { setSelectedCommunication(null); }, [mode]);
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
      pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      left: rect.left, top: rect.top, width: rect.width, height: rect.height, x: rect.left, y: rect.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event) => {
    const drag = dragRef.current;
    const panel = panelRef.current;
    if (!drag || !panel || drag.pointerId !== event.pointerId) return;
    drag.x = Math.min(Math.max(12, window.innerWidth - drag.width - 12), Math.max(12, drag.left + event.clientX - drag.startX));
    drag.y = Math.min(Math.max(12, window.innerHeight - drag.height - 12), Math.max(12, drag.top + event.clientY - drag.startY));
    panel.style.left = `${drag.x}px`;
    panel.style.top = `${drag.y}px`;
    panel.style.transform = 'none';
  };
  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
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
    nodeDragRef.current = { pointerId: event.pointerId, id, origin, start: graphPoint(svg, event), svg };
  };
  const moveNodeDrag = (event) => {
    const drag = nodeDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = graphPoint(drag.svg, event);
    const x = Math.round(Math.min(layout.width - NODE_WIDTH, Math.max(0, drag.origin.x + point.x - drag.start.x)));
    const y = Math.round(Math.min(layout.height - NODE_HEIGHT, Math.max(0, drag.origin.y + point.y - drag.start.y)));
    setNodePositions(current => {
      const previous = current[drag.id];
      return previous?.x === x && previous?.y === y ? current : { ...current, [drag.id]: { x, y } };
    });
  };
  const endNodeDrag = (event) => {
    const drag = nodeDragRef.current;
    if (drag && drag.pointerId === event.pointerId) nodeDragRef.current = null;
  };
  const beginCanvasDrag = (event) => {
    if (fit || event.isPrimary === false || (event.button !== undefined && event.button !== 0)
      || event.target?.closest?.('.dsh-task-dag-communication')) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    canvasDragRef.current = {
      pointerId: event.pointerId, startX: event.clientX, startY: event.clientY,
      scrollLeft: viewport.scrollLeft, scrollTop: viewport.scrollTop,
    };
    setCanvasDragging(true);
    if (typeof event.currentTarget.setPointerCapture === 'function') event.currentTarget.setPointerCapture(event.pointerId);
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
      && event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    canvasDragRef.current = null;
    setCanvasDragging(false);
  };
  const closeInspector = () => {
    const id = selectedCommunication;
    setSelectedCommunication(null);
    queueMicrotask(() => {
      const elements = viewportRef.current?.querySelectorAll('[data-communication="true"]') || [];
      for (const element of elements) if (element.getAttribute('data-edge-id') === id) element.focus();
    });
  };
  const structuralEdges = graph.edges.filter(edge => edge.kind !== 'communication').length;
  const panelStyle = position === null
    ? { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
    : { left: position.x, top: position.y, transform: 'none' };

  return h('div', { className: 'dsh-task-dag-backdrop', onPointerDown: event => { if (event.currentTarget === event.target) close(true); } },
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
      onPointerDown: beginDrag, onPointerMove: moveDrag, onPointerUp: endDrag, onPointerCancel: endDrag,
    },
    h('span', { className: 'dsh-task-dag-brand' }, h(DagMark, {})),
    h('div', { className: 'dsh-task-dag-heading' },
      h('h2', { className: 'dsh-task-dag-title', id: 'dsh-task-dag-title' }, t('title')),
      h('div', { className: 'dsh-task-dag-subtitle' },
        `${t('panel.summary', { nodes: graph.nodes.length, edges: structuralEdges, channels: graph.communicationCount })} · ${t('panel.live')}`)),
    h('div', { className: 'dsh-task-dag-actions' },
      graph.communicationCount > 0 ? h('button', {
        type: 'button', className: 'dsh-task-dag-icon-button',
        'data-active': showCommunications ? 'true' : undefined,
        title: t(showCommunications ? 'button.communications.hide' : 'button.communications.show'),
        'aria-label': t(showCommunications ? 'button.communications.hide' : 'button.communications.show'),
        'aria-pressed': showCommunications,
        onClick: () => {
          if (showCommunications) setSelectedCommunication(null);
          setShowCommunications(value => !value);
        },
      }, h(CommunicationMark, {})) : null,
      h('button', { type: 'button', className: 'dsh-task-dag-icon-button', title: t('button.refresh'), 'aria-label': t('button.refresh'), onClick: refresh }, h(IconRefreshOutline16)),
      h('button', {
        type: 'button', className: 'dsh-task-dag-icon-button', 'data-active': fit ? 'true' : undefined,
        title: t(fit ? 'button.original' : 'button.fit'), 'aria-label': t(fit ? 'button.original' : 'button.fit'),
        onClick: () => setFit(value => !value),
      }, h(IconFullscreenOutline16)),
      h('button', { type: 'button', className: 'dsh-task-dag-icon-button', title: t('button.close'), 'aria-label': t('button.close'), onClick: () => close(true) }, h(IconCloseOutline16)))),
    h(ViewTabs, { graphs, mode, setMode, t }),
    h('div', {
      id: 'dsh-task-dag-tabpanel',
      className: 'dsh-task-dag-workspace',
      role: 'tabpanel',
      'aria-labelledby': `dsh-task-dag-tab-${mode}`,
      'data-inspector': selectedEdge ? 'true' : undefined,
    },
      h('div', {
        ref: viewportRef,
        className: 'dsh-task-dag-viewport',
        'data-fit': fit ? 'true' : undefined,
        'data-panning': canvasDragging ? 'true' : undefined,
        role: 'region', 'aria-label': t('canvas.aria'), tabIndex: 0,
        onPointerDown: beginCanvasDrag, onPointerMove: moveCanvasDrag,
        onPointerUp: endCanvasDrag, onPointerCancel: endCanvasDrag,
      },
      graph.nodes.length === 1 && mode !== 'overview' ? h(EmptyState, { mode, leadSessionId, onOpen, t }) : h(TaskGraph, {
        graph, layout, positions, fit, showCommunications,
        selectedCommunication, onSelectCommunication: setSelectedCommunication,
        onDragEnd: endNodeDrag, onDragMove: moveNodeDrag, onDragStart: beginNodeDrag,
        onOpen, t,
      })),
      h(CommunicationInspector, { edge: selectedEdge, onClose: closeInspector, t })),
    h('footer', { className: 'dsh-task-dag-footer' },
      h('div', { className: 'dsh-task-dag-footer-legends' },
        h(StatusLegend, { t }), h(EdgeLegend, { mode, showCommunications, t })),
      h('span', { className: 'dsh-task-dag-hint' }, t('hint')))));
}

function TaskDagAction({
  sessionId, useSession, useSessions, openSession, refreshCatalogs, setCatalogsOpen, t,
}) {
  const summaries = useSessions(state => state.byId);
  const catalogs = useSessions(state => state.subagentsByParent);
  const ordinaryIds = useSessions(state => state.ids);
  const rootRunning = useSession(state => state.running);
  const chatNodes = useSession(state => state.chat.nodes.values(), sameArray);
  const workflowNodes = useMemo(() => chatNodes.filter(node => node.kind === 'workflow-run'), [chatNodes]);
  const teamNodes = useMemo(() => chatNodes.filter(node => node.kind === TEAM_SNAPSHOT_KIND), [chatNodes]);
  const [open, setOpen] = useState(false);
  const [fit, setFit] = useState(true);
  const [mode, setMode] = useState('overview');
  const [showCommunications, setShowCommunications] = useState(true);
  const [positionsByMode, setPositionsByMode] = useState({ overview: {}, team: {}, workflow: {} });
  const triggerRef = useRef(null);
  const catalogActionsRef = useRef({ refreshCatalogs, setCatalogsOpen });
  catalogActionsRef.current = { refreshCatalogs, setCatalogsOpen };
  const graphs = useMemo(() => Object.fromEntries(MODES.map(view => [view, buildGraph({
    rootId: sessionId,
    rootRunning,
    summaries,
    catalogs,
    ordinaryIds,
    teamNodes,
    workflowNodes,
    mode: view,
    t,
  })])), [sessionId, rootRunning, summaries, catalogs, ordinaryIds, teamNodes, workflowNodes, t]);
  const graph = graphs[mode];
  const parentKey = graphs.overview.parentIds.join('\u001f');
  const rootSummary = summaries[sessionId];
  const leadSessionId = rootSummary?.origin === 'subagent' && rootSummary.parentId
    && ordinaryIds.includes(rootSummary.parentId) ? rootSummary.parentId : null;

  useEffect(() => {
    setPositionsByMode({ overview: {}, team: {}, workflow: {} });
    setMode('overview');
  }, [sessionId]);
  useEffect(() => {
    if (!open) return undefined;
    const parentIds = graphs.overview.parentIds;
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
  const setNodePositions = (update) => setPositionsByMode(current => ({
    ...current,
    [mode]: typeof update === 'function' ? update(current[mode]) : update,
  }));
  const count = Math.max(0, graphs.overview.nodes.length - 1);

  return h('div', { className: 'dsh-task-dag-root' },
    h('button', {
      ref: triggerRef, type: 'button', className: 'dsh-task-dag-trigger',
      'aria-expanded': open, 'aria-label': t('trigger.aria', { count }),
      onClick: () => setOpen(value => !value),
    },
    h(DagMark, { className: 'dsh-task-dag-trigger-logo' }),
    h('span', null, t('title')),
    graph.activeCount > 0 ? h('span', { className: 'dsh-task-dag-live-dot', 'aria-hidden': true }) : null,
    h('span', { className: 'dsh-task-dag-trigger-count', 'aria-hidden': true }, count)),
    open ? ReactDOM.createPortal(h(TaskDagDialog, {
      close, fit, graphs, mode, nodePositions: positionsByMode[mode], onOpen: openNode,
      refresh: () => catalogActionsRef.current.refreshCatalogs(graphs.overview.parentIds),
      setFit, setMode, setNodePositions, showCommunications, setShowCommunications,
      leadSessionId, t,
    }), document.body) : null);
}

const inject = ['sessions', 'slots', 'locale', 'conversationEvents'];

function apply(ctx) {
  ctx.effect(() => ctx.conversationEvents.register(createTeamSnapshotDefinition()), 'task-dag: Team snapshots');
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
      openSession(id) { ctx.sessions.open(id); },
      refreshCatalogs(parentIds) { for (const parentId of parentIds) void ctx.sessions.refreshSubagents(parentId); },
      setCatalogsOpen(parentIds, open) { for (const parentId of parentIds) ctx.sessions.setSubagentCatalogOpen(parentId, open); },
    }),
  }, TaskDagAction));
}

exports.inject = inject;
exports.apply = apply;
