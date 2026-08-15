window.__ModuleLoader__.load({
  id: "dsh-task-dag",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    const STYLE_TEXT = ".dsh-task-dag-root {\n  position: relative;\n  display: inline-flex;\n}\n\n.dsh-task-dag-trigger {\n  height: 28px;\n  padding: 0 8px;\n  border: 0;\n  border-radius: 7px;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--dsw-alias-label-secondary);\n  background: transparent;\n  font: inherit;\n  font-size: 12px;\n  line-height: 18px;\n  cursor: pointer;\n  transition: color .15s ease, background .15s ease;\n}\n\n.dsh-task-dag-trigger:hover,\n.dsh-task-dag-trigger[aria-expanded=\"true\"] {\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dsh-task-dag-trigger:focus-visible,\n.dsh-task-dag-icon-button:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: 2px;\n}\n\n.dsh-task-dag-trigger-logo {\n  width: 15px;\n  height: 15px;\n  flex: none;\n  color: currentColor;\n}\n\n.dsh-task-dag-trigger-count {\n  min-width: 16px;\n  height: 16px;\n  padding: 0 5px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  display: inline-grid;\n  place-items: center;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 14px;\n}\n\n.dsh-task-dag-live-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  flex: none;\n  background: var(--dsw-alias-state-business-primary);\n  box-shadow: 0 0 0 3px var(--dsw-alias-state-business-tertiary);\n}\n\n.dsh-task-dag-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 2147482000;\n  display: grid;\n  place-items: center;\n  background: rgb(0 0 0 / 16%);\n}\n\n.dsh-task-dag-panel {\n  position: fixed;\n  z-index: 2147482001;\n  width: min(1120px, calc(100vw - 32px));\n  height: min(760px, calc(100vh - 40px));\n  min-width: min(640px, calc(100vw - 20px));\n  min-height: 440px;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 12px;\n  box-shadow: var(--dsw-shadow-lv3);\n}\n\n.dsh-task-dag-panel-header {\n  height: 60px;\n  flex: none;\n  padding: 0 14px 0 18px;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n  cursor: grab;\n  user-select: none;\n}\n\n.dsh-task-dag-panel-header:active {\n  cursor: grabbing;\n}\n\n.dsh-task-dag-brand {\n  width: 32px;\n  height: 32px;\n  border-radius: 9px;\n  display: grid;\n  place-items: center;\n  flex: none;\n  color: var(--dsw-alias-label-primary-inverted);\n  background: var(--dsw-alias-brand-primary);\n}\n\n.dsh-task-dag-brand svg {\n  width: 17px;\n  height: 17px;\n}\n\n.dsh-task-dag-heading {\n  min-width: 0;\n  flex: 1;\n}\n\n.dsh-task-dag-title {\n  margin: 0;\n  font-size: 15px;\n  line-height: 20px;\n  font-weight: 600;\n  letter-spacing: .01em;\n}\n\n.dsh-task-dag-subtitle {\n  margin-top: 2px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dsh-task-dag-actions {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n}\n\n.dsh-task-dag-icon-button {\n  width: 30px;\n  height: 30px;\n  padding: 0;\n  border: 0;\n  border-radius: 7px;\n  display: grid;\n  place-items: center;\n  color: var(--dsw-alias-label-tertiary);\n  background: transparent;\n  cursor: pointer;\n  transition: color .15s ease, background .15s ease;\n}\n\n.dsh-task-dag-icon-button:hover {\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dsh-task-dag-icon-button[data-active=\"true\"] {\n  color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-tertiary);\n}\n\n.dsh-task-dag-viewport {\n  min-height: 0;\n  flex: 1;\n  overflow: auto;\n  overscroll-behavior: contain;\n  background-color: var(--dsw-alias-bg-layer-2);\n  background-image: radial-gradient(circle, var(--dsw-alias-border-l1) .8px, transparent .8px);\n  background-position: 0 0;\n  background-size: 20px 20px;\n  scrollbar-color: var(--dsw-alias-scrollbar-bg-l1) transparent;\n  cursor: grab;\n  touch-action: none;\n}\n\n.dsh-task-dag-viewport[data-panning=\"true\"] {\n  cursor: grabbing;\n}\n\n.dsh-task-dag-viewport:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: -2px;\n}\n\n.dsh-task-dag-viewport::-webkit-scrollbar {\n  width: 10px;\n  height: 10px;\n}\n\n.dsh-task-dag-viewport::-webkit-scrollbar-thumb {\n  border: 3px solid transparent;\n  border-radius: 8px;\n  background: var(--dsw-alias-scrollbar-bg-l1);\n  background-clip: content-box;\n}\n\n.dsh-task-dag-viewport::-webkit-scrollbar-thumb:hover {\n  background: var(--dsw-alias-scrollbar-hover-l1);\n  background-clip: content-box;\n}\n\n.dsh-task-dag-viewport[data-fit=\"true\"] {\n  overflow: hidden;\n  padding: 24px;\n  cursor: default;\n  touch-action: auto;\n}\n\n.dsh-task-dag-svg {\n  display: block;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.dsh-task-dag-svg[data-fit=\"true\"] {\n  width: 100%;\n  height: 100%;\n}\n\n.dsh-task-dag-edge {\n  fill: none;\n  stroke: var(--dsw-alias-border-l4);\n  stroke-width: 1.2;\n  opacity: .86;\n  vector-effect: non-scaling-stroke;\n}\n\n.dsh-task-dag-edge[data-workflow=\"true\"] {\n  stroke: var(--dsw-alias-label-caption);\n  stroke-dasharray: 4 4;\n}\n\n.dsh-task-dag-arrow {\n  fill: var(--dsw-alias-label-caption);\n}\n\n.dsh-task-dag-node {\n  color: var(--dsw-alias-label-tertiary);\n  outline: none;\n  cursor: grab;\n  touch-action: none;\n}\n\n.dsh-task-dag-node:active {\n  cursor: grabbing;\n}\n\n.dsh-task-dag-node-card {\n  fill: var(--dsw-alias-bg-layer-1);\n  stroke: var(--dsw-alias-border-l2);\n  stroke-width: 1;\n  vector-effect: non-scaling-stroke;\n  transition: stroke .15s ease, filter .15s ease;\n}\n\n.dsh-task-dag-node[data-clickable=\"true\"]:hover .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-border-l4);\n  filter: drop-shadow(var(--dsw-shadow-lv1));\n}\n\n.dsh-task-dag-node[data-clickable=\"true\"]:focus-visible .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-state-business-primary);\n  stroke-width: 2;\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-card {\n  fill: var(--dsw-alias-brand-primary);\n  stroke: var(--dsw-alias-brand-primary);\n}\n\n.dsh-task-dag-node[data-status=\"running\"]:not([data-type=\"root\"]) .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-state-business-primary);\n}\n\n.dsh-task-dag-node[data-status=\"failed\"] .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-state-error-primary);\n}\n\n.dsh-task-dag-node-icon-bg {\n  fill: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-icon-bg {\n  fill: rgb(255 255 255 / 14%);\n}\n\n.dsh-task-dag-node-icon {\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 1.45;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n\n.dsh-task-dag-node[data-type=\"root\"] {\n  color: var(--dsw-alias-label-primary-inverted);\n}\n\n.dsh-task-dag-node-label {\n  fill: var(--dsw-alias-label-primary);\n  font-family: var(--dsw-font-family);\n  font-size: 12px;\n  font-weight: 500;\n}\n\n.dsh-task-dag-node-meta {\n  fill: var(--dsw-alias-label-tertiary);\n  font-family: var(--dsw-font-family);\n  font-size: 10px;\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-label {\n  fill: var(--dsw-alias-label-primary-inverted);\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-meta {\n  fill: var(--dsw-alias-label-primary-inverted);\n  opacity: .68;\n}\n\n.dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-label-caption);\n  stroke: var(--dsw-alias-bg-layer-1);\n  stroke-width: 1.5;\n  vector-effect: non-scaling-stroke;\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-status-dot {\n  stroke: var(--dsw-alias-brand-primary);\n}\n\n.dsh-task-dag-node[data-status=\"running\"] .dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-state-business-primary);\n}\n\n.dsh-task-dag-node[data-status=\"completed\"] .dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-state-success-primary);\n}\n\n.dsh-task-dag-node[data-status=\"failed\"] .dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-state-error-primary);\n}\n\n.dsh-task-dag-node[data-status=\"cancelled\"] .dsh-task-dag-status-dot,\n.dsh-task-dag-node[data-status=\"interrupted\"] .dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-state-warn-primary);\n}\n\n.dsh-task-dag-footer {\n  min-height: 40px;\n  flex: none;\n  padding: 0 18px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.dsh-task-dag-legend {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  flex-wrap: wrap;\n}\n\n.dsh-task-dag-legend-item {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  white-space: nowrap;\n}\n\n.dsh-task-dag-legend-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--dsw-alias-label-caption);\n}\n\n.dsh-task-dag-legend-dot[data-status=\"running\"] {\n  background: var(--dsw-alias-state-business-primary);\n}\n\n.dsh-task-dag-legend-dot[data-status=\"completed\"] {\n  background: var(--dsw-alias-state-success-primary);\n}\n\n.dsh-task-dag-legend-dot[data-status=\"failed\"] {\n  background: var(--dsw-alias-state-error-primary);\n}\n\n.dsh-task-dag-legend-dot[data-status=\"interrupted\"] {\n  background: var(--dsw-alias-state-warn-primary);\n}\n\n.dsh-task-dag-hint {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n@media (max-width: 900px) {\n  .dsh-task-dag-panel {\n    width: calc(100vw - 24px);\n    height: calc(100vh - 32px);\n    min-width: 0;\n    min-height: 0;\n  }\n\n  .dsh-task-dag-viewport[data-fit=\"true\"] {\n    padding: 16px;\n  }\n}\n\n@media (max-width: 680px) {\n  .dsh-task-dag-trigger span:not(.dsh-task-dag-trigger-count) {\n    display: none;\n  }\n\n  .dsh-task-dag-panel-header {\n    padding-left: 12px;\n  }\n\n  .dsh-task-dag-footer {\n    align-items: flex-start;\n    flex-direction: column;\n    justify-content: center;\n    gap: 2px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dsh-task-dag-trigger,\n  .dsh-task-dag-icon-button,\n  .dsh-task-dag-node-card {\n    transition: none;\n  }\n}\n";
    const GRAPH_MODEL = (() => {
    const NODE_WIDTH = 212;
    const NODE_HEIGHT = 70;
    const X_GAP = 24;
    const Y_GAP = 58;
    const CANVAS_PAD = 32;
    const MIN_CANVAS_WIDTH = 720;

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

    function lineageDepths(rootId, summaries) {
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

    function graphLayout(graph) {
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

      return { NODE_WIDTH, NODE_HEIGHT, buildGraph, graphLayout, normalizeStatus };
    })();
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

    return module.exports;
  },
});
