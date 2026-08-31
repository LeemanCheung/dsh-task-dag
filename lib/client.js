window.__ModuleLoader__.load({
  id: "dsh-task-dag",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    const STYLE_TEXT = ".dsh-task-dag-root {\n  position: relative;\n  display: inline-flex;\n}\n\n.dsh-task-dag-trigger {\n  height: 28px;\n  padding: 0 8px;\n  border: 0;\n  border-radius: 7px;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--dsw-alias-label-secondary);\n  background: transparent;\n  font: inherit;\n  font-size: 12px;\n  line-height: 18px;\n  cursor: pointer;\n  transition: color .15s ease, background .15s ease;\n}\n\n.dsh-task-dag-trigger:hover,\n.dsh-task-dag-trigger[aria-expanded=\"true\"] {\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dsh-task-dag-trigger:focus-visible,\n.dsh-task-dag-icon-button:focus-visible,\n.dsh-task-dag-tab:focus-visible,\n.dsh-task-dag-empty button:focus-visible,\n.dsh-task-dag-communication:focus-visible {\n  outline: 2px solid var(--dsw-alias-state-business-primary);\n  outline-offset: 2px;\n}\n\n.dsh-task-dag-trigger-logo {\n  width: 15px;\n  height: 15px;\n  flex: none;\n}\n\n.dsh-task-dag-trigger-count {\n  min-width: 16px;\n  height: 16px;\n  padding: 0 5px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  display: inline-grid;\n  place-items: center;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 14px;\n}\n\n.dsh-task-dag-live-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  flex: none;\n  background: var(--dsw-alias-state-business-primary);\n  box-shadow: 0 0 0 3px var(--dsw-alias-state-business-tertiary);\n}\n\n.dsh-task-dag-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 2147482000;\n  display: grid;\n  place-items: center;\n  background: var(--dsw-alias-bg-mask-2, rgb(0 0 0 / 18%));\n}\n\n.dsh-task-dag-panel {\n  --dsh-task-dag-team: var(--dsw-alias-state-business-primary);\n  --dsh-task-dag-task: var(--dsw-alias-state-warn-primary);\n  --dsh-task-dag-workflow: var(--dsw-alias-brand-primary);\n  --dsh-task-dag-communication-color: var(--dsw-alias-state-success-primary);\n  position: fixed;\n  z-index: 2147482001;\n  width: min(1180px, calc(100vw - 32px));\n  height: min(800px, calc(100vh - 40px));\n  min-width: min(680px, calc(100vw - 20px));\n  min-height: 480px;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 14px;\n  box-shadow: var(--dsw-shadow-lv3);\n}\n\n.dsh-task-dag-panel-header {\n  height: 60px;\n  flex: none;\n  padding: 0 14px 0 18px;\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n  cursor: grab;\n  user-select: none;\n}\n\n.dsh-task-dag-panel-header:active {\n  cursor: grabbing;\n}\n\n.dsh-task-dag-brand {\n  width: 34px;\n  height: 34px;\n  border-radius: 9px;\n  display: grid;\n  place-items: center;\n  flex: none;\n  color: var(--dsw-alias-label-primary-inverted);\n  background: var(--dsw-alias-brand-primary);\n}\n\n.dsh-task-dag-brand svg {\n  width: 18px;\n  height: 18px;\n}\n\n.dsh-task-dag-heading {\n  min-width: 0;\n  flex: 1;\n}\n\n.dsh-task-dag-title {\n  margin: 0;\n  font-size: 15px;\n  line-height: 20px;\n  font-weight: 650;\n  letter-spacing: .01em;\n}\n\n.dsh-task-dag-subtitle {\n  margin-top: 2px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dsh-task-dag-actions {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n}\n\n.dsh-task-dag-icon-button {\n  width: 30px;\n  height: 30px;\n  padding: 0;\n  border: 0;\n  border-radius: 7px;\n  display: grid;\n  place-items: center;\n  color: var(--dsw-alias-label-tertiary);\n  background: transparent;\n  cursor: pointer;\n  transition: color .15s ease, background .15s ease;\n}\n\n.dsh-task-dag-icon-button:hover,\n.dsh-task-dag-icon-button[data-active=\"true\"] {\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dsh-task-dag-icon-button svg {\n  width: 16px;\n  height: 16px;\n}\n\n.dsh-task-dag-tabs {\n  min-height: 48px;\n  padding: 8px 18px;\n  flex: none;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.dsh-task-dag-tab {\n  height: 32px;\n  padding: 0 11px;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  color: var(--dsw-alias-label-secondary);\n  background: transparent;\n  font: inherit;\n  font-size: 12px;\n  line-height: 18px;\n  cursor: pointer;\n}\n\n.dsh-task-dag-tab:hover {\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dsh-task-dag-tab[data-active=\"true\"] {\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  border-color: var(--dsw-alias-border-l2);\n  box-shadow: var(--dsw-shadow-lv1);\n}\n\n.dsh-task-dag-tab-count {\n  min-width: 17px;\n  height: 17px;\n  padding: 0 5px;\n  border-radius: 9px;\n  display: inline-grid;\n  place-items: center;\n  color: var(--dsw-alias-label-tertiary);\n  background: var(--dsw-alias-interactive-bg-hover);\n  font-size: 10px;\n}\n\n.dsh-task-dag-tab[data-active=\"true\"] .dsh-task-dag-tab-count {\n  color: var(--dsw-alias-label-primary-inverted);\n  background: var(--dsw-alias-brand-primary);\n}\n\n.dsh-task-dag-workspace {\n  min-height: 0;\n  flex: 1;\n  display: flex;\n  overflow: hidden;\n}\n\n.dsh-task-dag-viewport {\n  position: relative;\n  min-width: 0;\n  min-height: 0;\n  flex: 1;\n  overflow: auto;\n  overscroll-behavior: contain;\n  background-color: var(--dsw-alias-bg-base);\n  background-image: radial-gradient(circle, var(--dsw-alias-border-l2) .7px, transparent .8px);\n  background-size: 20px 20px;\n  cursor: grab;\n  touch-action: none;\n}\n\n.dsh-task-dag-viewport[data-panning=\"true\"] {\n  cursor: grabbing;\n  user-select: none;\n}\n\n.dsh-task-dag-viewport::-webkit-scrollbar {\n  width: 10px;\n  height: 10px;\n}\n\n.dsh-task-dag-viewport::-webkit-scrollbar-thumb {\n  border: 3px solid transparent;\n  border-radius: 8px;\n  background: var(--dsw-alias-scrollbar-bg-l1);\n  background-clip: content-box;\n}\n\n.dsh-task-dag-viewport::-webkit-scrollbar-thumb:hover {\n  background: var(--dsw-alias-scrollbar-hover-l1);\n  background-clip: content-box;\n}\n\n.dsh-task-dag-viewport[data-fit=\"true\"] {\n  overflow: hidden;\n  padding: 22px;\n  cursor: default;\n  touch-action: auto;\n}\n\n.dsh-task-dag-svg {\n  display: block;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.dsh-task-dag-svg[data-fit=\"true\"] {\n  width: 100%;\n  height: 100%;\n}\n\n.dsh-task-dag-edge {\n  fill: none;\n  stroke: var(--dsw-alias-border-l4);\n  stroke-width: 1.2;\n  opacity: .9;\n  vector-effect: non-scaling-stroke;\n}\n\n.dsh-task-dag-edge[data-kind=\"delegation\"] {\n  stroke: var(--dsw-alias-border-l4);\n}\n\n.dsh-task-dag-edge[data-kind=\"team\"] {\n  stroke: var(--dsh-task-dag-team);\n  stroke-width: 1.45;\n}\n\n.dsh-task-dag-edge[data-kind=\"assignment\"] {\n  stroke: var(--dsh-task-dag-task);\n  stroke-dasharray: 3 4;\n}\n\n.dsh-task-dag-edge[data-kind=\"dependency\"] {\n  stroke: var(--dsh-task-dag-task);\n  stroke-width: 1.9;\n}\n\n.dsh-task-dag-edge[data-kind=\"workflow\"],\n.dsh-task-dag-edge[data-kind=\"phase\"] {\n  stroke: var(--dsh-task-dag-workflow);\n  stroke-dasharray: 5 4;\n}\n\n.dsh-task-dag-edge[data-kind=\"communication\"] {\n  stroke: var(--dsh-task-dag-communication-color);\n  stroke-width: 2;\n  opacity: .8;\n}\n\n.dsh-task-dag-edge[data-kind=\"communication\"][data-pending=\"true\"] {\n  stroke-dasharray: 4 4;\n}\n\n.dsh-task-dag-arrow {\n  fill: var(--dsw-alias-label-caption);\n}\n\n.dsh-task-dag-communication-arrow {\n  fill: var(--dsh-task-dag-communication-color);\n}\n\n.dsh-task-dag-communication {\n  outline: none;\n  cursor: pointer;\n}\n\n.dsh-task-dag-communication-hit {\n  fill: none;\n  stroke: transparent;\n  stroke-width: 14;\n  vector-effect: non-scaling-stroke;\n}\n\n.dsh-task-dag-communication:hover .dsh-task-dag-edge,\n.dsh-task-dag-communication[data-selected=\"true\"] .dsh-task-dag-edge,\n.dsh-task-dag-communication:focus-visible .dsh-task-dag-edge {\n  stroke-width: 3;\n  opacity: 1;\n}\n\n.dsh-task-dag-edge-count circle {\n  fill: var(--dsw-alias-bg-layer-1);\n  stroke: var(--dsh-task-dag-communication-color);\n  stroke-width: 1.5;\n  vector-effect: non-scaling-stroke;\n}\n\n.dsh-task-dag-edge-count text {\n  fill: var(--dsw-alias-label-primary);\n  font-family: var(--dsw-font-family);\n  font-size: 9px;\n  font-weight: 650;\n  text-anchor: middle;\n  user-select: none;\n}\n\n.dsh-task-dag-node {\n  color: var(--dsw-alias-label-tertiary);\n  outline: none;\n  cursor: grab;\n  touch-action: none;\n}\n\n.dsh-task-dag-node:active {\n  cursor: grabbing;\n}\n\n.dsh-task-dag-node-card {\n  fill: var(--dsw-alias-bg-layer-1);\n  stroke: var(--dsw-alias-border-l2);\n  stroke-width: 1;\n  vector-effect: non-scaling-stroke;\n  transition: stroke .15s ease, filter .15s ease;\n}\n\n.dsh-task-dag-node-accent {\n  fill: var(--dsw-alias-border-l4);\n}\n\n.dsh-task-dag-node[data-clickable=\"true\"]:hover .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-border-l4);\n  filter: drop-shadow(var(--dsw-shadow-lv1));\n}\n\n.dsh-task-dag-node[data-clickable=\"true\"]:focus-visible .dsh-task-dag-node-card,\n.dsh-task-dag-node[data-selected=\"true\"] .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-state-business-primary);\n  stroke-width: 2;\n}\n\n.dsh-task-dag-node[data-selected=\"true\"] .dsh-task-dag-node-card {\n  filter: drop-shadow(var(--dsw-shadow-lv1));\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-card {\n  fill: var(--dsw-alias-brand-primary);\n  stroke: var(--dsw-alias-brand-primary);\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-accent {\n  fill: var(--dsw-alias-label-primary-inverted);\n  opacity: .62;\n}\n\n.dsh-task-dag-node[data-type=\"teammate\"] .dsh-task-dag-node-accent {\n  fill: var(--dsh-task-dag-team);\n}\n\n.dsh-task-dag-node[data-type=\"task\"] .dsh-task-dag-node-accent {\n  fill: var(--dsh-task-dag-task);\n}\n\n.dsh-task-dag-node[data-type=\"workflow\"] .dsh-task-dag-node-accent,\n.dsh-task-dag-node[data-type=\"phase\"] .dsh-task-dag-node-accent,\n.dsh-task-dag-node[data-type=\"workflow-member\"] .dsh-task-dag-node-accent {\n  fill: var(--dsh-task-dag-workflow);\n}\n\n.dsh-task-dag-node[data-status=\"running\"]:not([data-type=\"root\"]) .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-state-business-primary);\n}\n\n.dsh-task-dag-node[data-status=\"ready\"] .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-state-success-primary);\n}\n\n.dsh-task-dag-node[data-status=\"blocked\"] .dsh-task-dag-node-card,\n.dsh-task-dag-node[data-status=\"interrupted\"] .dsh-task-dag-node-card,\n.dsh-task-dag-node[data-status=\"cancelled\"] .dsh-task-dag-node-card,\n.dsh-task-dag-node[data-status=\"provisioning\"] .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-state-warn-primary);\n}\n\n.dsh-task-dag-node[data-status=\"failed\"] .dsh-task-dag-node-card {\n  stroke: var(--dsw-alias-state-error-primary);\n}\n\n.dsh-task-dag-node-icon-bg {\n  fill: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-icon-bg {\n  fill: rgb(255 255 255 / 14%);\n}\n\n.dsh-task-dag-node-icon {\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 1.45;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n\n.dsh-task-dag-node[data-type=\"root\"] {\n  color: var(--dsw-alias-label-primary-inverted);\n}\n\n.dsh-task-dag-node-label {\n  fill: var(--dsw-alias-label-primary);\n  font-family: var(--dsw-font-family);\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.dsh-task-dag-node-meta {\n  fill: var(--dsw-alias-label-tertiary);\n  font-family: var(--dsw-font-family);\n  font-size: 10px;\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-label,\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-meta {\n  fill: var(--dsw-alias-label-primary-inverted);\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-node-meta {\n  opacity: .7;\n}\n\n.dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-label-caption);\n  stroke: var(--dsw-alias-bg-layer-1);\n  stroke-width: 1.5;\n  vector-effect: non-scaling-stroke;\n}\n\n.dsh-task-dag-node[data-type=\"root\"] .dsh-task-dag-status-dot {\n  stroke: var(--dsw-alias-brand-primary);\n}\n\n.dsh-task-dag-node[data-status=\"running\"] .dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-state-business-primary);\n}\n\n.dsh-task-dag-node[data-status=\"completed\"] .dsh-task-dag-status-dot,\n.dsh-task-dag-node[data-status=\"ready\"] .dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-state-success-primary);\n}\n\n.dsh-task-dag-node[data-status=\"failed\"] .dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-state-error-primary);\n}\n\n.dsh-task-dag-node[data-status=\"blocked\"] .dsh-task-dag-status-dot,\n.dsh-task-dag-node[data-status=\"cancelled\"] .dsh-task-dag-status-dot,\n.dsh-task-dag-node[data-status=\"interrupted\"] .dsh-task-dag-status-dot,\n.dsh-task-dag-node[data-status=\"provisioning\"] .dsh-task-dag-status-dot {\n  fill: var(--dsw-alias-state-warn-primary);\n}\n\n.dsh-task-dag-metrics-tooltip {\n  position: fixed;\n  z-index: 2147482003;\n  box-sizing: border-box;\n  max-width: calc(100vw - 24px);\n  max-height: calc(100vh - 24px);\n  overflow: auto;\n  padding: 14px;\n  border: 1px solid var(--dsw-alias-border-l3);\n  border-radius: 11px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  box-shadow: var(--dsw-shadow-lv3);\n  pointer-events: none;\n  animation: dsh-task-dag-tooltip-in .14s cubic-bezier(.22, 1, .36, 1) both;\n}\n\n.dsh-task-dag-metrics-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n}\n\n.dsh-task-dag-metrics-header > div {\n  min-width: 0;\n  display: grid;\n  gap: 2px;\n}\n\n.dsh-task-dag-metrics-eyebrow {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 9px;\n  line-height: 13px;\n  font-weight: 650;\n  letter-spacing: .06em;\n  text-transform: uppercase;\n}\n\n.dsh-task-dag-metrics-header strong {\n  overflow: hidden;\n  font-size: 13px;\n  line-height: 18px;\n  font-weight: 650;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dsh-task-dag-metrics-description {\n  margin: 9px 0 0;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n  line-height: 16px;\n  overflow-wrap: anywhere;\n}\n\n.dsh-task-dag-metrics-status {\n  flex: none;\n  padding: 2px 7px;\n  border-radius: 999px;\n  color: var(--dsw-alias-label-secondary);\n  background: var(--dsw-alias-interactive-bg-hover);\n  font-size: 9px;\n  line-height: 14px;\n}\n\n.dsh-task-dag-metrics-status[data-status=\"running\"] {\n  color: var(--dsw-alias-state-business-primary);\n}\n\n.dsh-task-dag-metrics-status[data-status=\"completed\"] {\n  color: var(--dsw-alias-state-success-primary);\n}\n\n.dsh-task-dag-metrics-status[data-status=\"failed\"] {\n  color: var(--dsw-alias-state-error-primary);\n}\n\n.dsh-task-dag-route-grid {\n  margin: 12px 0 0;\n  padding: 10px 0;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 9px 12px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n\n.dsh-task-dag-route-grid > .dsh-task-dag-route-wide {\n  grid-column: 1 / -1;\n}\n\n.dsh-task-dag-route-grid div,\n.dsh-task-dag-token-grid div {\n  min-width: 0;\n}\n\n.dsh-task-dag-route-grid dt,\n.dsh-task-dag-token-grid dt {\n  margin: 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 9px;\n  line-height: 13px;\n}\n\n.dsh-task-dag-route-grid dd,\n.dsh-task-dag-token-grid dd {\n  margin: 2px 0 0;\n  overflow: hidden;\n  color: var(--dsw-alias-label-primary);\n  font-size: 10px;\n  line-height: 15px;\n  font-weight: 600;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dsh-task-dag-token-section {\n  margin-top: 10px;\n}\n\n.dsh-task-dag-token-heading {\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n  gap: 12px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n  line-height: 15px;\n}\n\n.dsh-task-dag-token-heading strong {\n  color: var(--dsw-alias-label-primary);\n  font-size: 16px;\n  line-height: 20px;\n  font-weight: 650;\n  font-variant-numeric: tabular-nums;\n}\n\n.dsh-task-dag-token-grid {\n  margin: 7px 0 0;\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 7px 12px;\n}\n\n.dsh-task-dag-token-grid dd {\n  font-variant-numeric: tabular-nums;\n}\n\n.dsh-task-dag-metrics-empty {\n  margin: 12px 0 0;\n  padding: 10px;\n  border-radius: 7px;\n  color: var(--dsw-alias-label-tertiary);\n  background: var(--dsw-alias-bg-layer-2);\n  font-size: 10px;\n  line-height: 16px;\n}\n\n.dsh-task-dag-metrics-footer {\n  margin-top: 11px;\n  display: flex;\n  justify-content: space-between;\n  gap: 10px;\n  color: var(--dsw-alias-label-caption);\n  font-size: 8px;\n  line-height: 12px;\n}\n\n@keyframes dsh-task-dag-tooltip-in {\n  from { opacity: 0; transform: translateY(4px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.dsh-task-dag-inspector {\n  width: 326px;\n  min-width: 286px;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  border-left: 1px solid var(--dsw-alias-border-l1);\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.dsh-task-dag-definition-inspector {\n  width: 408px;\n  min-width: 340px;\n}\n\n.dsh-task-dag-definition-body {\n  min-height: 0;\n  padding: 14px;\n  overflow: auto;\n}\n\n.dsh-task-dag-definition-section + .dsh-task-dag-definition-section {\n  margin-top: 17px;\n}\n\n.dsh-task-dag-definition-section h4 {\n  margin: 0 0 7px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n  line-height: 15px;\n  font-weight: 650;\n  letter-spacing: .06em;\n  text-transform: uppercase;\n}\n\n.dsh-task-dag-definition-section > p {\n  margin: 0;\n  color: var(--dsw-alias-label-primary);\n  font-size: 11px;\n  line-height: 18px;\n  overflow-wrap: anywhere;\n}\n\n.dsh-task-dag-phase-definition-list {\n  margin: 0;\n  padding: 0;\n  display: grid;\n  gap: 7px;\n  list-style: none;\n}\n\n.dsh-task-dag-phase-definition-list li {\n  padding: 9px 10px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-left: 3px solid var(--dsh-task-dag-workflow);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.dsh-task-dag-phase-definition-heading {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n\n.dsh-task-dag-phase-definition-heading strong {\n  margin-right: auto;\n  color: var(--dsw-alias-label-primary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.dsh-task-dag-phase-definition-heading span {\n  padding: 1px 5px;\n  border-radius: 4px;\n  color: var(--dsw-alias-label-tertiary);\n  background: var(--dsw-alias-interactive-bg-hover);\n  font-size: 9px;\n  line-height: 14px;\n}\n\n.dsh-task-dag-phase-definition-list p {\n  margin: 4px 0 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 16px;\n}\n\n.dsh-task-dag-code-section {\n  min-width: 0;\n}\n\n.dsh-task-dag-code-section > div {\n  max-width: 100%;\n}\n\n.dsh-task-dag-definition-unavailable {\n  min-height: 0;\n  padding: 26px 22px;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n}\n\n.dsh-task-dag-definition-unavailable > svg {\n  width: 28px;\n  height: 28px;\n  color: var(--dsw-alias-label-tertiary);\n}\n\n.dsh-task-dag-definition-unavailable h4 {\n  margin: 12px 0 0;\n  font-size: 12px;\n  line-height: 18px;\n}\n\n.dsh-task-dag-definition-unavailable p {\n  max-width: 290px;\n  margin: 5px 0 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 16px;\n}\n\n.dsh-task-dag-inspector-header {\n  min-height: 62px;\n  padding: 12px 10px 10px 15px;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 8px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n\n.dsh-task-dag-inspector-header h3 {\n  margin: 0;\n  font-size: 13px;\n  line-height: 19px;\n  font-weight: 650;\n}\n\n.dsh-task-dag-inspector-header p {\n  margin: 2px 0 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n\n.dsh-task-dag-inspector-stats {\n  padding: 9px 15px;\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n}\n\n.dsh-task-dag-inspector-stats span {\n  padding: 3px 7px;\n  border-radius: 999px;\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dsh-task-dag-inspector-stats span[data-pending=\"true\"] {\n  color: var(--dsw-alias-state-warn-primary);\n}\n\n.dsh-task-dag-message-list {\n  min-height: 0;\n  margin: 0;\n  padding: 10px 12px 18px;\n  overflow: auto;\n  list-style: none;\n}\n\n.dsh-task-dag-message {\n  margin: 0 0 9px;\n  padding: 10px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 9px;\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.dsh-task-dag-message-meta {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 9px;\n  line-height: 14px;\n}\n\n.dsh-task-dag-message-meta span {\n  padding: 1px 5px;\n  border-radius: 4px;\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n\n.dsh-task-dag-message-meta span[data-status=\"delivered\"] {\n  color: var(--dsw-alias-state-success-primary);\n}\n\n.dsh-task-dag-message-meta span[data-status=\"queued\"] {\n  color: var(--dsw-alias-state-warn-primary);\n}\n\n.dsh-task-dag-message-text {\n  margin: 7px 0 0;\n  color: var(--dsw-alias-label-primary);\n  font-size: 11px;\n  line-height: 17px;\n  white-space: pre-wrap;\n  overflow-wrap: anywhere;\n}\n\n.dsh-task-dag-message-nontext,\n.dsh-task-dag-message-more {\n  margin: 5px 0 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 9px;\n  line-height: 14px;\n}\n\n.dsh-task-dag-message-more {\n  padding: 0 14px 12px;\n}\n\n.dsh-task-dag-empty {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  padding: 30px;\n  text-align: center;\n}\n\n.dsh-task-dag-empty > svg {\n  width: 34px;\n  height: 34px;\n  padding: 8px;\n  border-radius: 10px;\n  color: var(--dsw-alias-state-business-primary);\n  background: var(--dsw-alias-state-business-tertiary);\n}\n\n.dsh-task-dag-empty h3 {\n  margin: 13px 0 0;\n  font-size: 14px;\n  line-height: 20px;\n}\n\n.dsh-task-dag-empty p {\n  max-width: 430px;\n  margin: 5px 0 0;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 17px;\n}\n\n.dsh-task-dag-empty button {\n  margin-top: 14px;\n  height: 30px;\n  padding: 0 12px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 7px;\n  color: var(--dsw-alias-label-primary);\n  background: var(--dsw-alias-bg-layer-1);\n  font: inherit;\n  font-size: 11px;\n  cursor: pointer;\n}\n\n.dsh-task-dag-footer {\n  min-height: 54px;\n  flex: none;\n  padding: 7px 18px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 15px;\n}\n\n.dsh-task-dag-footer-legends {\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.dsh-task-dag-legend,\n.dsh-task-dag-edge-legend {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  flex-wrap: wrap;\n}\n\n.dsh-task-dag-legend-item {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  white-space: nowrap;\n}\n\n.dsh-task-dag-legend-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--dsw-alias-label-caption);\n}\n\n.dsh-task-dag-legend-dot[data-status=\"running\"] {\n  background: var(--dsw-alias-state-business-primary);\n}\n\n.dsh-task-dag-legend-dot[data-status=\"completed\"] {\n  background: var(--dsw-alias-state-success-primary);\n}\n\n.dsh-task-dag-legend-dot[data-status=\"failed\"] {\n  background: var(--dsw-alias-state-error-primary);\n}\n\n.dsh-task-dag-legend-dot[data-status=\"blocked\"] {\n  background: var(--dsw-alias-state-warn-primary);\n}\n\n.dsh-task-dag-edge-sample {\n  width: 18px;\n  height: 0;\n  border-top: 2px solid var(--dsw-alias-border-l4);\n}\n\n.dsh-task-dag-edge-sample[data-kind=\"team\"] {\n  border-color: var(--dsh-task-dag-team);\n}\n\n.dsh-task-dag-edge-sample[data-kind=\"assignment\"] {\n  border-color: var(--dsh-task-dag-task);\n  border-top-style: dashed;\n}\n\n.dsh-task-dag-edge-sample[data-kind=\"dependency\"] {\n  border-color: var(--dsh-task-dag-task);\n}\n\n.dsh-task-dag-edge-sample[data-kind=\"workflow\"] {\n  border-color: var(--dsh-task-dag-workflow);\n  border-top-style: dashed;\n}\n\n.dsh-task-dag-edge-sample[data-kind=\"communication\"] {\n  border-color: var(--dsh-task-dag-communication-color);\n}\n\n.dsh-task-dag-hint {\n  min-width: 0;\n  max-width: 390px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n@media (max-width: 960px) {\n  .dsh-task-dag-panel {\n    width: calc(100vw - 24px);\n    height: calc(100vh - 32px);\n    min-width: 0;\n    min-height: 0;\n  }\n\n  .dsh-task-dag-viewport[data-fit=\"true\"] {\n    padding: 15px;\n  }\n\n  .dsh-task-dag-hint {\n    display: none;\n  }\n}\n\n@media (max-width: 760px) {\n  .dsh-task-dag-workspace[data-inspector=\"true\"] {\n    flex-direction: column;\n  }\n\n  .dsh-task-dag-inspector {\n    width: auto;\n    min-width: 0;\n    height: min(42%, 320px);\n    border-top: 1px solid var(--dsw-alias-border-l1);\n    border-left: 0;\n  }\n\n  .dsh-task-dag-definition-inspector {\n    height: min(56%, 440px);\n  }\n\n  .dsh-task-dag-footer {\n    min-height: 46px;\n  }\n\n  .dsh-task-dag-edge-legend {\n    display: none;\n  }\n}\n\n@media (max-width: 620px) {\n  .dsh-task-dag-trigger span:not(.dsh-task-dag-trigger-count) {\n    display: none;\n  }\n\n  .dsh-task-dag-panel-header {\n    padding-left: 12px;\n  }\n\n  .dsh-task-dag-subtitle {\n    display: none;\n  }\n\n  .dsh-task-dag-tabs {\n    padding: 7px 10px;\n  }\n\n  .dsh-task-dag-tab {\n    flex: 1;\n    justify-content: center;\n    padding: 0 6px;\n  }\n\n  .dsh-task-dag-footer {\n    padding-inline: 12px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dsh-task-dag-trigger,\n  .dsh-task-dag-icon-button,\n  .dsh-task-dag-node-card {\n    transition: none;\n  }\n\n  .dsh-task-dag-metrics-tooltip {\n    animation: none;\n  }\n}\n";
    const REASONING_DEFAULTS = (() => {
    /**
     * Current public model-default references. They are display-only context: no
     * entry is evidence of an individual historical request or service response.
     * Keep each route association explicit and retain its evidence scope.
     */
    const PUBLIC_REASONING_REFERENCES = Object.freeze([
      Object.freeze({
        provider: 'openai',
        model: 'gpt-5.6-terra',
        effort: 'medium',
        evidenceScope: 'openai-api-model-page',
        historicalClaim: false,
        verifiedOn: '2026-08-31',
        sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5.6-terra',
      }),
      Object.freeze({
        provider: 'openai-codex',
        model: 'gpt-5.6-terra',
        effort: 'medium',
        evidenceScope: 'openai-api-model-page-reference-for-codex-route',
        historicalClaim: false,
        verifiedOn: '2026-08-31',
        sourceUrl: 'https://developers.openai.com/api/docs/models/gpt-5.6-terra',
      }),
    ])

    const references = new Map(PUBLIC_REASONING_REFERENCES.map(entry => [
      `${entry.provider}\u0000${entry.model}`,
      entry,
    ]))

    /** Return display-only public context for one exact route association. */
    function publicReasoningReference(provider, model) {
      if (typeof provider !== 'string' || typeof model !== 'string') return undefined
      return references.get(`${provider}\u0000${model}`)
    }

      return { publicReasoningReference };
    })();
    const GRAPH_MODEL = (() => {
      const { publicReasoningReference } = REASONING_DEFAULTS;

    const NODE_WIDTH = 224;
    const NODE_HEIGHT = 76;
    const X_GAP = 30;
    const Y_GAP = 70;
    const CANVAS_PAD = 38;
    const MIN_CANVAS_WIDTH = 760;

    function normalizeStatus(status) {
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

    function nonnegativeNumber(value) {
      return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0;
    }

    function agentMetrics(summary) {
      const projections = summary?.projectionValues;
      if (projections === undefined || projections === null || typeof projections !== 'object') return null;
      const route = projections.taskDagAgentMetrics;
      const usage = projections.tokenUsage;
      const stats = projections.sessionStats;
      const metrics = {};
      if (route && typeof route === 'object' && typeof route.provider === 'string' && typeof route.model === 'string') {
        metrics.provider = route.provider;
        metrics.model = route.model;
        const hasRecordedEffort = typeof route.reasoningEffort === 'string' && route.reasoningEffort.trim() !== '';
        const publicDefaultReference = hasRecordedEffort
          ? undefined : publicReasoningReference(route.provider, route.model);
        if (hasRecordedEffort) metrics.reasoningEffort = route.reasoningEffort;
        metrics.reasoningSource = hasRecordedEffort && (route.reasoningSource === 'request-config'
          || route.reasoningSource === 'adapter-default')
          ? route.reasoningSource : 'not-recorded';
        if (publicDefaultReference !== undefined) {
          metrics.reasoningReference = {
            effort: publicDefaultReference.effort,
            kind: 'public-api-model-reference',
            evidenceScope: publicDefaultReference.evidenceScope,
            verifiedOn: publicDefaultReference.verifiedOn,
            historicalClaim: false,
          };
        }
      }
      if (usage && typeof usage === 'object') {
        const uncachedInputTokens = nonnegativeNumber(usage.uncachedInputTokens);
        const outputTokens = nonnegativeNumber(usage.outputTokens);
        const cacheReadTokens = nonnegativeNumber(usage.cacheReadTokens);
        const cacheWriteTokens = nonnegativeNumber(usage.cacheWriteTokens);
        metrics.usage = {
          totalTokens: uncachedInputTokens + outputTokens + cacheReadTokens + cacheWriteTokens,
          inputTokens: uncachedInputTokens + cacheReadTokens + cacheWriteTokens,
          outputTokens,
          cacheReadTokens,
          cacheWriteTokens,
        };
      }
      if (stats && typeof stats === 'object') {
        metrics.turns = nonnegativeNumber(stats.turns);
        metrics.steps = nonnegativeNumber(stats.steps);
      }
      return Object.keys(metrics).length === 0 ? null : metrics;
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
          metrics: agentMetrics(summary),
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
          metrics: agentMetrics(summary),
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
              metrics: agentMetrics(summaries[member.childId]),
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
          metrics: agentMetrics(summary),
        });
        const parentId = summary.parentId === rootId
          ? rootId
          : groupedSessionNodes.get(summary.parentId) || `agent:${summary.parentId}`;
        builder.addEdge({ from: parentId, to: id, kind: 'delegation', layout: true });
        groupedSessionNodes.set(summary.id, id);
      }
      return depths;
    }

    function buildGraph({
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

    function graphLayout(graph) {
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

      return { NODE_WIDTH, NODE_HEIGHT, buildGraph, graphLayout, normalizeStatus };
    })();
    const TEAM_PROJECTION = (() => {
    'use strict';

    const TEAM_SNAPSHOT_KIND = 'task-dag-team-snapshot';

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

    function projectTeamEvent(event) {
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

    function createTeamSnapshotDefinition() {
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

      return { TEAM_SNAPSHOT_KIND, createTeamSnapshotDefinition };
    })();
    const WORKFLOW_DEFINITION = (() => {
    'use strict';

    function isRecord(value) {
      return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    function optionalString(value) {
      return typeof value === 'string' ? value : undefined;
    }

    function projectPhases(value) {
      if (!Array.isArray(value)) return [];
      const phases = [];
      for (const candidate of value) {
        if (!isRecord(candidate) || typeof candidate.title !== 'string' || candidate.title === '') continue;
        phases.push({
          title: candidate.title,
          ...(optionalString(candidate.detail) === undefined ? {} : { detail: candidate.detail }),
          ...(optionalString(candidate.provider) === undefined ? {} : { provider: candidate.provider }),
          ...(optionalString(candidate.model) === undefined ? {} : { model: candidate.model }),
        });
      }
      return phases;
    }

    function toolCallMaterial(viewNode) {
      if (!viewNode || viewNode.kind !== 'tool-call' || !isRecord(viewNode.data)) return null;
      const root = viewNode.data.root;
      if (!isRecord(root)) return null;
      const settled = root.kind === 'tool-result';
      const call = settled ? root.call : root;
      if (!isRecord(call) || call.name !== 'workflow' || typeof call.argsRaw !== 'string') return null;
      return {
        callId: typeof root.callId === 'string' ? root.callId : String(viewNode.id || ''),
        toolName: call.name,
        argsRaw: call.argsRaw,
        anchorSeq: Number.isFinite(viewNode.anchorSeq) ? viewNode.anchorSeq : 0,
      };
    }

    function extractWorkflowDefinition(viewNode) {
      const material = toolCallMaterial(viewNode);
      if (material === null) return null;
      let args;
      try {
        args = JSON.parse(material.argsRaw);
      } catch {
        return null;
      }
      if (!isRecord(args) || typeof args.script !== 'string' || !isRecord(args.meta)
        || typeof args.meta.name !== 'string' || args.meta.name === '') return null;
      return {
        callId: material.callId,
        anchorSeq: material.anchorSeq,
        toolName: material.toolName,
        script: args.script,
        meta: {
          name: args.meta.name,
          description: optionalString(args.meta.description) || '',
          ...(optionalString(args.meta.whenToUse) === undefined ? {} : { whenToUse: args.meta.whenToUse }),
          phases: projectPhases(args.meta.phases),
        },
      };
    }

    function attachWorkflowDefinitions(workflowNodes, chatNodes) {
      const definitions = chatNodes
        .map(extractWorkflowDefinition)
        .filter(Boolean)
        .sort((left, right) => left.anchorSeq - right.anchorSeq);
      const used = new Set();
      const byRunId = new Map();
      // Newest-first matching prevents same-name call/run pairs from crossing when calls arrive in a batch.
      const runs = [...workflowNodes].sort((left, right) => right.anchorSeq - left.anchorSeq);
      for (const run of runs) {
        const runName = run?.data?.name;
        if (typeof runName !== 'string') continue;
        let match = null;
        for (const definition of definitions) {
          const identity = `${definition.callId}\u001f${definition.anchorSeq}`;
          if (used.has(identity) || definition.anchorSeq > run.anchorSeq || definition.meta.name !== runName) continue;
          if (match === null || definition.anchorSeq > match.anchorSeq) match = definition;
        }
        if (match === null) continue;
        used.add(`${match.callId}\u001f${match.anchorSeq}`);
        byRunId.set(run.id, match);
      }
      return workflowNodes.map((run) => {
        const definition = byRunId.get(run.id);
        if (definition === undefined) return run;
        return { ...run, data: { ...(run.data || {}), definition } };
      });
    }

      return { attachWorkflowDefinitions };
    })();
    'use strict';

    const React = require('react');
    const ReactDOM = require('react-dom');
    const UI = require('@deepseek-ai/dsh-client-ui-primitives');
    const {
      Fragment, createElement: h, useEffect, useLayoutEffect, useMemo, useRef, useState,
    } = React;
    const {
      CodeBlock, IconCloseOutline16, IconFullscreenOutline16, IconRefreshOutline16,
    } = UI;

    const PACKAGE_ID = 'dsh-task-dag';
    const NS = 'taskDag';
    const MODES = ['overview', 'team', 'workflow'];
    const MESSAGE_DETAIL_LIMIT = 100;
    const { NODE_WIDTH, NODE_HEIGHT, buildGraph, graphLayout, normalizeStatus } = GRAPH_MODEL;
    const { TEAM_SNAPSHOT_KIND, createTeamSnapshotDefinition } = TEAM_PROJECTION;
    const { attachWorkflowDefinitions } = WORKFLOW_DEFINITION;

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
      'node.inspectWorkflow': '预览 Workflow 定义 {name}',
      'node.code': '可预览代码',
      'metrics.aria': '{name} 的运行信息',
      'metrics.title': 'Agent 运行信息',
      'metrics.live': '随持久会话投影更新',
      'metrics.provider': 'Provider',
      'metrics.model': '模型',
      'metrics.reasoning': '思考强度',
      'metrics.effortMissing': '未记录',
      'metrics.sourceSelected': '请求配置',
      'metrics.sourceAdapterDefault': 'Adapter 默认',
      'metrics.sourceUnknown': '来源未记录',
      'metrics.publicDefaultReference': 'OpenAI API 模型页默认参考',
      'metrics.requestNotRecorded': '非本次请求记录',
      'metrics.referenceVerified': '核验 {date}',
      'metrics.tokens': 'Token 使用',
      'metrics.total': '合计',
      'metrics.input': '输入',
      'metrics.output': '输出',
      'metrics.cacheRead': '缓存读取',
      'metrics.cacheWrite': '缓存写入',
      'metrics.turns': '{turns} 轮 · {steps} 步',
      'metrics.unavailable': '暂未收到该 Agent 的模型或 Token 指标',
      'workflowDefinition.title': 'Workflow 定义',
      'workflowDefinition.summary': '{name} 的编排代码',
      'workflowDefinition.description': '定义说明',
      'workflowDefinition.whenToUse': '适用场景',
      'workflowDefinition.phases': '阶段声明',
      'workflowDefinition.code': '编排代码',
      'workflowDefinition.lines': '{count} 行 JavaScript',
      'workflowDefinition.phaseCount': '{count} 个声明阶段',
      'workflowDefinition.provider': 'Provider · {name}',
      'workflowDefinition.model': 'Model · {name}',
      'workflowDefinition.copy': '复制代码',
      'workflowDefinition.copied': '已复制',
      'workflowDefinition.unavailable.title': '当前窗口没有可预览的定义',
      'workflowDefinition.unavailable.body': '对应 workflow 工具调用可能已被会话窗口裁剪；运行拓扑仍然可用。',
      'button.workflowDefinition.close': '关闭 Workflow 定义',
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
      'hint': '拖动画布平移；拖动节点调整布局；点击 Workflow 查看定义；点击 Agent 打开 Session；点击通信边查看时间线',
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
      'node.inspectWorkflow': 'Preview Workflow definition {name}',
      'node.code': 'Code available',
      'metrics.aria': 'Runtime details for {name}',
      'metrics.title': 'Agent runtime',
      'metrics.live': 'Updated from durable Session projections',
      'metrics.provider': 'Provider',
      'metrics.model': 'Model',
      'metrics.reasoning': 'Reasoning effort',
      'metrics.effortMissing': 'Not recorded',
      'metrics.sourceSelected': 'Request config',
      'metrics.sourceAdapterDefault': 'Adapter default',
      'metrics.sourceUnknown': 'Source not recorded',
      'metrics.publicDefaultReference': 'OpenAI API model-page default reference',
      'metrics.requestNotRecorded': 'not a record of this request',
      'metrics.referenceVerified': 'verified {date}',
      'metrics.tokens': 'Token usage',
      'metrics.total': 'Total',
      'metrics.input': 'Input',
      'metrics.output': 'Output',
      'metrics.cacheRead': 'Cache read',
      'metrics.cacheWrite': 'Cache write',
      'metrics.turns': '{turns} turns · {steps} steps',
      'metrics.unavailable': 'No model or token metrics have been reported for this Agent yet',
      'workflowDefinition.title': 'Workflow definition',
      'workflowDefinition.summary': 'Orchestration code for {name}',
      'workflowDefinition.description': 'Definition summary',
      'workflowDefinition.whenToUse': 'When to use',
      'workflowDefinition.phases': 'Declared phases',
      'workflowDefinition.code': 'Orchestration code',
      'workflowDefinition.lines': '{count} lines of JavaScript',
      'workflowDefinition.phaseCount': '{count} declared phases',
      'workflowDefinition.provider': 'Provider · {name}',
      'workflowDefinition.model': 'Model · {name}',
      'workflowDefinition.copy': 'Copy code',
      'workflowDefinition.copied': 'Copied',
      'workflowDefinition.unavailable.title': 'Definition unavailable in this window',
      'workflowDefinition.unavailable.body': 'The matching workflow tool call may have fallen outside the Session window; the run topology remains available.',
      'button.workflowDefinition.close': 'Close Workflow definition',
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
      'hint': 'Drag the canvas to pan; drag nodes to arrange; select a Workflow to inspect its definition; select an Agent to open its Session; select a communication edge for its timeline',
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

    function tokenCount(value) {
      return Number(value || 0).toLocaleString();
    }

    function isAgentNode(node) {
      return ['one-shot', 'continuable', 'subagent', 'teammate', 'workflow-member'].includes(node.type);
    }

    function reasoningLabel(metrics, t) {
      const effort = typeof metrics?.reasoningEffort === 'string' && metrics.reasoningEffort.trim() !== ''
        ? metrics.reasoningEffort : null;
      if (effort === null) return t('metrics.effortMissing');
      const source = metrics.reasoningSource === 'adapter-default'
        ? t('metrics.sourceAdapterDefault')
        : metrics.reasoningSource === 'request-config'
          ? t('metrics.sourceSelected')
          : t('metrics.sourceUnknown');
      return `${effort} · ${source}`;
    }

    function tooltipPosition(anchor, width, height) {
      const margin = 12;
      const gap = 10;
      const maxLeft = Math.max(margin, window.innerWidth - width - margin);
      const left = Math.max(margin, Math.min(maxLeft, anchor.left + anchor.width / 2 - width / 2));
      const below = anchor.bottom + gap;
      const maxTop = Math.max(margin, window.innerHeight - height - margin);
      const top = below + height <= window.innerHeight - margin
        ? below : Math.max(margin, Math.min(maxTop, anchor.top - height - gap));
      return { left, top };
    }

    function NodeMetricsTooltip({ anchor, node, t }) {
      const tooltipRef = useRef(null);
      const availableWidth = Math.max(0, window.innerWidth - 24);
      const width = Math.min(286, availableWidth);
      const valid = Boolean(anchor && node && isAgentNode(node));
      const [position, setTooltipPosition] = useState({ left: 12, top: 12 });
      useLayoutEffect(() => {
        if (!valid) return;
        const measuredHeight = tooltipRef.current?.getBoundingClientRect().height || 252;
        const height = Math.min(measuredHeight, Math.max(0, window.innerHeight - 24));
        const next = tooltipPosition(anchor, width, height);
        setTooltipPosition(current => current.left === next.left && current.top === next.top ? current : next);
      }, [valid, node?.id, anchor?.left, anchor?.top, anchor?.right, anchor?.bottom, anchor?.width, anchor?.height, width]);
      if (!valid) return null;
      const metrics = node.metrics;
      const usage = metrics?.usage;
      const hasRoute = metrics?.provider && metrics?.model;
      const hasStats = metrics && Number.isFinite(metrics.turns) && Number.isFinite(metrics.steps);
      return ReactDOM.createPortal(h('aside', {
        id: `dsh-task-dag-metrics-${node.id.replace(/[^a-zA-Z0-9_-]/gu, '-')}`,
        ref: tooltipRef,
        className: 'dsh-task-dag-metrics-tooltip',
        style: { left: position.left, top: position.top, width },
        role: 'tooltip',
      },
      h('header', { className: 'dsh-task-dag-metrics-header' },
        h('div', null,
          h('span', { className: 'dsh-task-dag-metrics-eyebrow' }, t('metrics.title')),
          h('strong', null, node.label)),
        h('span', { className: 'dsh-task-dag-metrics-status', 'data-status': node.status }, statusLabel(node.status, t))),
      typeof node.description === 'string' && node.description.trim() !== ''
        ? h('p', { className: 'dsh-task-dag-metrics-description' }, node.description)
        : null,
      hasRoute ? h('dl', { className: 'dsh-task-dag-route-grid' },
        h('div', null, h('dt', null, t('metrics.provider')), h('dd', null, metrics.provider)),
        h('div', null, h('dt', null, t('metrics.model')), h('dd', null, metrics.model)),
        h('div', { className: 'dsh-task-dag-route-wide' },
          h('dt', null, t('metrics.reasoning')), h('dd', null, reasoningLabel(metrics, t))),
        metrics.reasoningReference?.kind === 'public-api-model-reference'
          ? h('div', { className: 'dsh-task-dag-route-wide' },
            h('dt', null, t('metrics.publicDefaultReference')),
            h('dd', null, `${metrics.reasoningReference.effort} · ${t('metrics.requestNotRecorded')} · ${t('metrics.referenceVerified', { date: metrics.reasoningReference.verifiedOn })}`))
          : null) : null,
      usage ? h('section', { className: 'dsh-task-dag-token-section' },
        h('div', { className: 'dsh-task-dag-token-heading' },
          h('span', null, `${t('metrics.tokens')} · ${t('metrics.total')}`),
          h('strong', null, tokenCount(usage.totalTokens))),
        h('dl', { className: 'dsh-task-dag-token-grid' },
          h('div', null, h('dt', null, t('metrics.input')), h('dd', null, tokenCount(usage.inputTokens))),
          h('div', null, h('dt', null, t('metrics.output')), h('dd', null, tokenCount(usage.outputTokens))),
          h('div', null, h('dt', null, t('metrics.cacheRead')), h('dd', null, tokenCount(usage.cacheReadTokens))),
          h('div', null, h('dt', null, t('metrics.cacheWrite')), h('dd', null, tokenCount(usage.cacheWriteTokens))))) : null,
      !hasRoute && !usage ? h('p', { className: 'dsh-task-dag-metrics-empty' }, t('metrics.unavailable')) : null,
      h('footer', { className: 'dsh-task-dag-metrics-footer' },
        h('span', null, t('metrics.live')),
        hasStats ? h('span', null, t('metrics.turns', { turns: metrics.turns, steps: metrics.steps })) : null)), document.body);
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

    function GraphNode({
      node, position, onDragEnd, onDragMove, onDragStart, onHideMetrics, onInspectWorkflow,
      onOpen, onShowMetrics, metricsVisible, selectedWorkflow, t,
    }) {
      const navigable = node.navigable && node.navigationId;
      const inspectable = node.type === 'workflow' && node.inspectable;
      const actionable = navigable || inspectable;
      const metricsTarget = isAgentNode(node);
      const focusable = actionable || metricsTarget;
      const metricsId = `dsh-task-dag-metrics-${node.id.replace(/[^a-zA-Z0-9_-]/gu, '-')}`;
      const hasDescription = typeof node.description === 'string' && node.description.trim() !== '';
      const descriptionId = `dsh-task-dag-description-${node.id.replace(/[^a-zA-Z0-9_-]/gu, '-')}`;
      const dragRef = useRef(null);
      const activate = (event) => {
        if (dragRef.current?.moved) {
          event.preventDefault();
          event.stopPropagation();
          dragRef.current = null;
          return;
        }
        if (inspectable) onInspectWorkflow(node.id);
        else if (navigable) onOpen(node.navigationId);
      };
      const onKeyDown = (event) => {
        if (!actionable || (event.key !== 'Enter' && event.key !== ' ')) return;
        event.preventDefault();
        if (inspectable) onInspectWorkflow(node.id);
        else onOpen(node.navigationId);
      };
      const onPointerDown = (event) => {
        if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
        event.stopPropagation();
        onHideMetrics(node.id);
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
      const showMetrics = event => {
        if (!metricsTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        onShowMetrics(node.id, {
          left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom,
          width: rect.width, height: rect.height,
        });
      };
      return h('g', {
        className: 'dsh-task-dag-node',
        transform: `translate(${position.x} ${position.y})`,
        'data-node-id': node.id,
        'data-type': node.type,
        'data-status': node.status,
        'data-clickable': actionable ? 'true' : undefined,
        'data-selected': inspectable && selectedWorkflow === node.id ? 'true' : undefined,
        'data-workflow-id': inspectable ? node.id : undefined,
        role: actionable ? 'button' : metricsTarget || hasDescription ? 'group' : undefined,
        tabIndex: focusable ? 0 : undefined,
        'aria-controls': inspectable ? 'dsh-task-dag-workflow-definition' : undefined,
        'aria-describedby': metricsTarget
          ? metricsVisible ? metricsId : undefined
          : hasDescription ? descriptionId : undefined,
        'aria-expanded': inspectable ? selectedWorkflow === node.id : undefined,
        'aria-label': inspectable
          ? `${t('node.inspectWorkflow', { name: node.label })}. ${t('node.drag', { name: node.label })}`
          : navigable
            ? `${t('node.open', { name: node.label })}. ${t('node.drag', { name: node.label })}`
            : metricsTarget ? t('metrics.aria', { name: node.label }) : undefined,
        onClick: activate,
        onFocus: showMetrics,
        onBlur: () => onHideMetrics(node.id),
        onKeyDown,
        onPointerEnter: showMetrics,
        onPointerLeave: event => { if (document.activeElement !== event.currentTarget) onHideMetrics(node.id); },
        onPointerDown,
        onPointerMove,
        onPointerUp: onPointerEnd,
        onPointerCancel: onPointerEnd,
      },
      !metricsTarget && hasDescription ? h('desc', { id: descriptionId }, node.description) : null,
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
      graph, layout, positions, showCommunications, selectedCommunication, selectedWorkflow,
      onSelectCommunication, onHideMetrics, onInspectWorkflow, onDragEnd, onDragMove, onDragStart,
      onOpen, onShowMetrics, hoveredMetricsNodeId, t, fit,
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
        onHideMetrics,
        onInspectWorkflow,
        onOpen,
        onShowMetrics,
        metricsVisible: hoveredMetricsNodeId === node.id,
        selectedWorkflow,
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

    function WorkflowDefinitionInspector({ node, onClose, t }) {
      if (!node) return null;
      const definition = node.definition;
      const titleId = 'dsh-task-dag-workflow-definition-title';
      const phases = definition?.meta?.phases || [];
      const lineCount = definition ? definition.script.split(/\r\n?|\n/).length : 0;
      return h('aside', {
        id: 'dsh-task-dag-workflow-definition',
        className: 'dsh-task-dag-inspector dsh-task-dag-definition-inspector',
        'aria-labelledby': titleId,
      },
      h('header', { className: 'dsh-task-dag-inspector-header' },
        h('div', null,
          h('h3', { id: titleId }, t('workflowDefinition.title')),
          h('p', null, t('workflowDefinition.summary', { name: node.label }))),
        h('button', {
          type: 'button', className: 'dsh-task-dag-icon-button',
          title: t('button.workflowDefinition.close'), 'aria-label': t('button.workflowDefinition.close'), onClick: onClose,
        }, h(IconCloseOutline16))),
      definition === null ? h('div', { className: 'dsh-task-dag-definition-unavailable' },
        h(DagMark, {}),
        h('h4', null, t('workflowDefinition.unavailable.title')),
        h('p', null, t('workflowDefinition.unavailable.body'))) : h(Fragment, null,
        h('div', { className: 'dsh-task-dag-inspector-stats' },
          h('span', null, t('workflowDefinition.lines', { count: lineCount })),
          phases.length > 0 ? h('span', null, t('workflowDefinition.phaseCount', { count: phases.length })) : null),
        h('div', { className: 'dsh-task-dag-definition-body' },
          definition.meta.description ? h('section', { className: 'dsh-task-dag-definition-section' },
            h('h4', null, t('workflowDefinition.description')),
            h('p', null, definition.meta.description)) : null,
          definition.meta.whenToUse ? h('section', { className: 'dsh-task-dag-definition-section' },
            h('h4', null, t('workflowDefinition.whenToUse')),
            h('p', null, definition.meta.whenToUse)) : null,
          phases.length > 0 ? h('section', { className: 'dsh-task-dag-definition-section' },
            h('h4', null, t('workflowDefinition.phases')),
            h('ol', { className: 'dsh-task-dag-phase-definition-list' },
              ...phases.map((phase, index) => h('li', { key: `${phase.title}:${index}` },
                h('div', { className: 'dsh-task-dag-phase-definition-heading' },
                  h('strong', null, phase.title),
                  phase.provider ? h('span', null, t('workflowDefinition.provider', { name: phase.provider })) : null,
                  phase.model ? h('span', null, t('workflowDefinition.model', { name: phase.model })) : null),
                phase.detail ? h('p', null, phase.detail) : null)))) : null,
          h('section', { className: 'dsh-task-dag-definition-section dsh-task-dag-code-section' },
            h('h4', null, t('workflowDefinition.code')),
            h(CodeBlock, {
              code: definition.script,
              lang: 'javascript',
              copyLabel: t('workflowDefinition.copy'),
              copiedLabel: t('workflowDefinition.copied'),
            })))));
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
      const [selectedWorkflow, setSelectedWorkflow] = useState(null);
      const [hoveredMetrics, setHoveredMetrics] = useState(null);
      const graph = graphs[mode];
      const layout = useMemo(() => graphLayout(graph), [graph]);
      const selectedEdge = graph.edges.find(edge => edge.id === selectedCommunication && edge.kind === 'communication');
      const selectedWorkflowNode = graph.nodes.find(node => node.id === selectedWorkflow && node.type === 'workflow');
      const hoveredMetricsNode = graph.nodes.find(node => node.id === hoveredMetrics?.nodeId);
      const positions = useMemo(() => {
        const next = new Map(layout.positions);
        for (const node of graph.nodes) if (nodePositions[node.id] !== undefined) next.set(node.id, nodePositions[node.id]);
        return next;
      }, [graph.nodes, layout.positions, nodePositions]);

      const syncFocusedMetrics = () => {
        const active = document.activeElement;
        const nodeId = active?.matches?.('.dsh-task-dag-node[data-node-id]')
          ? active.getAttribute('data-node-id') : null;
        if (nodeId === null) {
          setHoveredMetrics(null);
          return;
        }
        const rect = active.getBoundingClientRect();
        setHoveredMetrics({
          nodeId,
          anchor: {
            left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom,
            width: rect.width, height: rect.height,
          },
        });
      };

      useEffect(() => { panelRef.current?.focus({ preventScroll: true }); }, []);
      useEffect(() => {
        setSelectedCommunication(null);
        setSelectedWorkflow(null);
        setHoveredMetrics(null);
      }, [mode]);
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
      useEffect(() => {
        const onResize = () => syncFocusedMetrics();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, [mode, layout.signature]);
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
        setHoveredMetrics(null);
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
      const showMetrics = (nodeId, anchor) => setHoveredMetrics({ nodeId, anchor });
      const hideMetrics = nodeId => setHoveredMetrics(current => current?.nodeId === nodeId ? null : current);
      const selectCommunication = (id) => {
        setSelectedWorkflow(null);
        setSelectedCommunication(id);
      };
      const selectWorkflow = (id) => {
        setSelectedCommunication(null);
        setSelectedWorkflow(id);
      };
      const closeInspector = () => {
        const id = selectedCommunication;
        setSelectedCommunication(null);
        queueMicrotask(() => {
          const elements = viewportRef.current?.querySelectorAll('[data-communication="true"]') || [];
          for (const element of elements) if (element.getAttribute('data-edge-id') === id) element.focus();
        });
      };
      const closeWorkflowInspector = () => {
        const id = selectedWorkflow;
        setSelectedWorkflow(null);
        queueMicrotask(() => {
          const elements = viewportRef.current?.querySelectorAll('[data-workflow-id]') || [];
          for (const element of elements) if (element.getAttribute('data-workflow-id') === id) element.focus();
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
          'data-inspector': selectedEdge || selectedWorkflowNode ? 'true' : undefined,
        },
          h('div', {
            ref: viewportRef,
            className: 'dsh-task-dag-viewport',
            'data-fit': fit ? 'true' : undefined,
            'data-panning': canvasDragging ? 'true' : undefined,
            role: 'region', 'aria-label': t('canvas.aria'), tabIndex: 0,
            onScroll: syncFocusedMetrics,
            onPointerDown: beginCanvasDrag, onPointerMove: moveCanvasDrag,
            onPointerUp: endCanvasDrag, onPointerCancel: endCanvasDrag,
          },
          graph.nodes.length === 1 && mode !== 'overview' ? h(EmptyState, { mode, leadSessionId, onOpen, t }) : h(TaskGraph, {
            graph, layout, positions, fit, showCommunications,
            selectedCommunication, selectedWorkflow,
            onSelectCommunication: selectCommunication, onInspectWorkflow: selectWorkflow,
            onDragEnd: endNodeDrag, onDragMove: moveNodeDrag, onDragStart: beginNodeDrag,
            onHideMetrics: hideMetrics, onShowMetrics: showMetrics,
            hoveredMetricsNodeId: hoveredMetrics?.nodeId,
            onOpen, t,
          })),
          h(CommunicationInspector, { edge: selectedEdge, onClose: closeInspector, t }),
          h(WorkflowDefinitionInspector, { node: selectedWorkflowNode, onClose: closeWorkflowInspector, t })),
        h(NodeMetricsTooltip, { anchor: hoveredMetrics?.anchor, node: hoveredMetricsNode, t }),
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
      const workflowNodes = useMemo(() => attachWorkflowDefinitions(
        chatNodes.filter(node => node.kind === 'workflow-run'),
        chatNodes,
      ), [chatNodes]);
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
      const count = graphs.overview.nodes.filter(
        node => node.id !== graphs.overview.rootId && node.type !== 'workflow',
      ).length;

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

    return module.exports;
  },
});
