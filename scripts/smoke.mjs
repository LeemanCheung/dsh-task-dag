import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
if (manifest.version !== '1.5.1') throw new Error('package version drifted')
if (manifest.dsh?.compatibility?.dshReleases?.['0.1.2-rc.1'] !== 'unknown') {
  throw new Error('DSH 0.1.2-rc.1 must remain unknown until isolated Web Profile validation')
}
if (manifest.dsh?.client?.inject?.includes('@deepseek-ai/dsh-client-runtime')) {
  throw new Error('removed dsh-client-runtime package is still injected')
}
for (const required of ['@deepseek-ai/dsh-api-session-controller', '@deepseek-ai/dsh-client-ui-renderer']) {
  if (!manifest.dsh?.client?.inject?.includes(required)) throw new Error(`missing DSH 0.1.2 client package: ${required}`)
}
const localRequire = createRequire(import.meta.url)
const { JSDOM } = localRequire('jsdom')
const React = localRequire('react')
const ReactDOM = localRequire('react-dom')
const { createRoot } = localRequire('react-dom/client')
const { renderToStaticMarkup } = localRequire('react-dom/server')
const Icon = () => React.createElement('svg', { 'aria-hidden': true })
const CodeBlock = ({ code, lang, copyLabel }) => React.createElement('div', { className: 'mock-code-block', 'data-lang': lang },
  React.createElement('button', { type: 'button', 'aria-label': copyLabel }, copyLabel),
  React.createElement('pre', null, React.createElement('code', null, code)))
const primitives = {
  CodeBlock,
  IconCloseOutline16: Icon,
  IconFullscreenOutline16: Icon,
  IconRefreshOutline16: Icon,
}

let loaded
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'http://127.0.0.1:3080/' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.Node = dom.window.Node
globalThis.Element = dom.window.Element
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.SVGElement = dom.window.SVGElement
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
window.__ModuleLoader__ = { load(module) { loaded = module } }

const bundle = await readFile(resolve(root, 'lib/client.js'), 'utf8')
;(0, eval)(bundle)
if (loaded?.id !== 'dsh-task-dag') throw new Error('client bundle did not register its package id')
const plugin = loaded.factory((id) => {
  if (id === 'react') return React
  if (id === 'react-dom') return ReactDOM
  if (id === '@deepseek-ai/dsh-client-ui-primitives') return primitives
  throw new Error(`unexpected client require: ${id}`)
})
if (plugin.inject.join(',') !== 'sessions,slots,locale,conversationEvents') {
  throw new Error('client inject list drifted')
}

let registration
let teamDefinition
let openedSession
const ctx = {
  effect(install) { install() },
  locale: { register() { return () => {} } },
  conversationEvents: { register(definition) { teamDefinition = definition; return () => {} } },
  sessions: {
    open(id) { openedSession = id },
    refreshSubagents() { return Promise.resolve() },
    setSubagentCatalogOpen() {},
  },
  slots: {
    inject(_name, install) { install() },
    register(options, component) {
      registration = { options, component }
      return () => {}
    },
  },
}
plugin.apply(ctx)
const style = document.head.querySelector('style[data-plugin="dsh-task-dag"]')
if (style === null || !style.textContent.includes('.dsh-task-dag-inspector')) {
  throw new Error('client stylesheet was not installed')
}
if (!style.textContent.includes('max-height: calc(100vh - 24px)')) {
  throw new Error('Agent metrics tooltip is missing viewport height constraints')
}
if (registration?.options.id !== 'task-dag') throw new Error('header registration missing')
if (teamDefinition?.kind !== 'task-dag-team-snapshot') throw new Error('Team snapshot definition missing')

function projectTeam(event) {
  const matched = teamDefinition.match(event)
  if (matched === null) return null
  const match = { ...matched, event }
  const state = teamDefinition.start({}, match)
  return teamDefinition.buildViewNode({
    key: `${teamDefinition.kind}:${matched.id}`,
    id: matched.id,
    state,
    start: { event, location: { kind: 'turn' } },
  })
}

const teamEvents = [
  {
    type: 'team/member', seq: 9, time: 1720000000009,
    data: { version: 1, teamId: 'root', member: { id: 'ghost', name: 'Archived Agent', description: 'No longer in the Session list', phase: 'inactive' } },
  },
  {
    type: 'team/member', seq: 10, time: 1720000000010,
    data: { version: 1, teamId: 'root', member: { id: 'child', name: 'Audit Agent', description: 'Review the change', phase: 'active' } },
  },
  {
    type: 'team/task', seq: 11, time: 1720000000011,
    data: { version: 1, teamId: 'root', task: { id: 'task-1', revision: 1, subject: 'Review implementation', description: 'Check the visual flow', status: 'in_progress', ownerId: 'child', blockedBy: [] } },
  },
  ...Array.from({ length: 100 }, (_, index) => ({
    type: 'team/message/queued', seq: 12 + index, time: 1720000000012 + index,
    data: { version: 1, teamId: 'root', message: { id: `message-${index}`, senderId: 'root', senderName: 'Lead', targetId: 'child', delivery: 'quiet', content: [{ type: 'text', text: `Earlier update ${index}` }] } },
  })),
  {
    type: 'team/message/queued', seq: 112, time: 1720000000112,
    data: { version: 1, teamId: 'root', message: { id: 'message-latest', senderId: 'root', senderName: 'Lead', targetId: 'child', delivery: 'wakeup', content: [{ type: 'text', text: 'Please review the dependency edge.' }] } },
  },
]
const chatNodes = [
  ...teamEvents.map(projectTeam),
  {
    id: 'workflow-call-1', kind: 'tool-call', anchorSeq: 2,
    data: {
      root: {
        kind: 'tool-result', callId: 'workflow-call-1',
        call: {
          name: 'workflow',
          argsRaw: JSON.stringify({
            script: "phase('review')\nconst result = await agent('Review the implementation', { label: 'audit' })\nreturn { result }",
            meta: {
              name: 'quality',
              description: 'Review the implementation before release.',
              whenToUse: 'Use before shipping a graph change.',
              phases: [{ title: 'review', detail: 'Inspect the graph behavior.', provider: 'spawn', model: 'fast' }],
            },
          }),
        },
      },
    },
  },
  {
    id: 'run-1', kind: 'workflow-run', anchorSeq: 3,
    data: {
      name: 'quality', status: 'completed',
      phases: [{ key: 'phase', phase: 'review', members: [{ seq: 1, label: 'audit', childId: 'child', status: 'completed' }] }],
    },
  },
]
if (teamDefinition.match({ type: 'message/user', seq: 99, time: 0, data: {} }) !== null) {
  throw new Error('Team definition matched an unrelated event')
}

const list = {
  ids: ['root', 'child'],
  byId: {
    root: { id: 'root', displayTitle: 'Root Session', running: true, blank: false, updatedAt: 1 },
    child: {
      id: 'child', displayTitle: 'Worker', origin: 'subagent', parentId: 'root', running: false, completed: true, blank: false, updatedAt: 2,
      projectionValues: {
        taskDagAgentMetrics: {
          provider: 'openai-codex', model: 'gpt-5.6-terra', reasoningSource: 'not-recorded',
        },
        tokenUsage: { uncachedInputTokens: 1_200, outputTokens: 345, cacheReadTokens: 4_000, cacheWriteTokens: 55 },
        sessionStats: { turns: 3, steps: 5 },
      },
    },
    ghost: {
      id: 'ghost', displayTitle: 'Archived Agent', origin: 'subagent', parentId: 'root', running: false, completed: true, blank: false, updatedAt: 1,
      projectionValues: {
        taskDagAgentMetrics: {
          provider: 'openai', model: 'gpt-5.6-terra', reasoningSource: 'not-recorded',
        },
      },
    },
  },
  current: 'root',
  phase: 'ready',
  subagentsByParent: {
    root: {
      state: 'ready', error: null, parentAvailable: true,
      entries: [{ kind: 'child', id: 'child', activity: 'inactive', hasChildren: false, mode: 'teammate', label: 'audit' }],
    },
  },
  jobsBySession: {},
  currentAddress: undefined,
}
const conversation = {
  running: true,
  chat: { nodes: { values: () => chatNodes } },
}
const dictionary = {
  title: '任务 DAG',
  'trigger.aria': '打开任务 DAG，共 {count} 个拓扑节点',
  'panel.summary': '{nodes} 个节点 · {edges} 条结构边 · {channels} 条通信链路',
  'panel.live': '实时更新',
  'graph.aria': '拓扑图',
  'canvas.aria': 'DAG 画布',
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
  'mode.aria': '选择视图',
  'node.current': '当前会话',
  'node.fallback': '未命名会话',
  'node.oneShot': '一次性子代理',
  'node.continuable': '可续接子代理',
  'node.subagent': '子代理',
  'node.teammate': 'Teammate',
  'node.workflowMember': 'Workflow Worker',
  'node.workflow': 'Workflow',
  'node.phaseGroup': '阶段',
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
  'metrics.unavailable': '暂未收到指标',
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
  'workflowDefinition.unavailable.body': '定义不在窗口中。',
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
  'status.idle': '历史',
  'legend.running': '运行中',
  'legend.completed': '已完成',
  'legend.failed': '失败',
  'legend.blocked': '阻塞',
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
  'communication.more': '仅显示 {shown} 条，另有 {hidden} 条',
  'empty.team.title': '没有 Team 数据',
  'empty.team.body': 'Team 数据位于 Lead Session。',
  'empty.workflow.title': '没有 Workflow 数据',
  'empty.workflow.body': '运行后显示。',
  hint: '操作提示',
}
const t = (key, values = {}) => Object.entries(values).reduce(
  (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
  dictionary[key] ?? key,
)
const props = {
  sessionId: 'root',
  useSessions: select => select(list),
  useSession: select => select(conversation),
  t,
  ...registration.options.inject(),
}
const html = renderToStaticMarkup(React.createElement(registration.component, props))
if (!html.includes('任务 DAG') || !html.includes('>5<')) {
  throw new Error(`header render did not count the metrics-only Agent while excluding the synthetic workflow grouping node: ${html}`)
}

const mount = document.createElement('div')
document.body.appendChild(mount)
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const reactRoot = createRoot(mount)
await React.act(async () => { reactRoot.render(React.createElement(registration.component, props)) })
const trigger = document.querySelector('.dsh-task-dag-trigger')
if (trigger === null) throw new Error('interactive trigger did not render')
await React.act(async () => { trigger.click() })
if (document.querySelectorAll('[role="tab"]').length !== 3) throw new Error('three view tabs did not render')
if (document.querySelector('.dsh-task-dag-svg')?.getAttribute('role') !== 'group') {
  throw new Error('interactive graph was hidden behind an image accessibility role')
}

const pointer = (type, x, y, pointerId = 7) => {
  const event = new window.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 })
  Object.defineProperty(event, 'pointerId', { value: pointerId })
  return event
}
const measuredAgent = document.querySelector('.dsh-task-dag-node[data-node-id="agent:child"]')
if (measuredAgent === null) throw new Error('measured Agent node did not render')
if (measuredAgent.querySelector('title') !== null) throw new Error('Agent node retained the browser-native SVG tooltip')
await React.act(async () => { measuredAgent.dispatchEvent(pointer('pointerover', 100, 100)) })
const metricsTooltip = document.querySelector('.dsh-task-dag-metrics-tooltip')
if (metricsTooltip === null
  || !metricsTooltip.textContent.includes('gpt-5.6-terra')
  || !metricsTooltip.textContent.includes('未记录')
  || !metricsTooltip.textContent.includes('medium')
  || !metricsTooltip.textContent.includes('OpenAI API 模型页默认参考')
  || !metricsTooltip.textContent.includes('非本次请求记录')
  || !metricsTooltip.textContent.includes('核验 2026-08-31')
  || !metricsTooltip.textContent.includes('Review the change')
  || !metricsTooltip.textContent.includes('5,600')) {
  throw new Error('Agent hover did not expose its description and separate missing request evidence from its public model-default reference')
}
await React.act(async () => { measuredAgent.dispatchEvent(pointer('pointerout', 100, 100)) })
if (document.querySelector('.dsh-task-dag-metrics-tooltip') !== null) throw new Error('Agent metrics tooltip did not close on leave')

const originalViewportSize = { width: window.innerWidth, height: window.innerHeight }
Object.defineProperty(window, 'innerWidth', { configurable: true, value: 300 })
Object.defineProperty(window, 'innerHeight', { configurable: true, value: 300 })
measuredAgent.getBoundingClientRect = () => ({ left: 30, top: 90, right: 254, bottom: 166, width: 224, height: 76 })
await React.act(async () => { measuredAgent.focus() })
let focusedTooltip = document.querySelector('.dsh-task-dag-metrics-tooltip')
if (focusedTooltip === null
  || measuredAgent.getAttribute('aria-describedby') !== focusedTooltip.id
  || focusedTooltip.hasAttribute('aria-label')
  || !focusedTooltip.textContent.includes('gpt-5.6-terra')
  || !focusedTooltip.textContent.includes('medium')
  || !focusedTooltip.textContent.includes('Review the change')
  || !focusedTooltip.textContent.includes('5,600')
  || focusedTooltip.style.width !== '276px'
  || Number.parseFloat(focusedTooltip.style.left) < 12
  || Number.parseFloat(focusedTooltip.style.top) < 12) {
  throw new Error('keyboard-focused Agent tooltip did not expose its full description or fit a 300px viewport')
}
const metricsViewport = document.querySelector('.dsh-task-dag-viewport')
await React.act(async () => { metricsViewport.dispatchEvent(new window.Event('scroll')) })
focusedTooltip = document.querySelector('.dsh-task-dag-metrics-tooltip')
if (focusedTooltip === null || measuredAgent.getAttribute('aria-describedby') !== focusedTooltip.id) {
  throw new Error('focused Agent tooltip was lost or left a dangling description after scrolling')
}
await React.act(async () => { measuredAgent.blur() })
if (document.querySelector('.dsh-task-dag-metrics-tooltip') !== null
  || measuredAgent.hasAttribute('aria-describedby')) {
  throw new Error('Agent metrics tooltip or description remained after blur')
}
Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalViewportSize.width })
Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalViewportSize.height })

const archivedAgent = document.querySelector('.dsh-task-dag-node[data-node-id="agent:ghost"]')
if (archivedAgent?.getAttribute('role') !== 'group' || archivedAgent.tabIndex !== 0
  || archivedAgent.hasAttribute('data-clickable')) {
  throw new Error('non-navigable Agent metrics node was not keyboard-focusable without pretending to be clickable')
}
await React.act(async () => { archivedAgent.focus() })
const archivedTooltip = document.querySelector('.dsh-task-dag-metrics-tooltip')
if (!archivedTooltip?.textContent.includes('medium')
  || !archivedTooltip.textContent.includes('OpenAI API 模型页默认参考')
  || !archivedTooltip.textContent.includes('非本次请求记录')) {
  throw new Error('non-navigable OpenAI API Agent focus did not expose a separate public reference')
}
await React.act(async () => { archivedAgent.blur() })

const close = document.querySelector('[aria-label="关闭任务 DAG"]')
await React.act(async () => {
  const down = pointer('pointerdown', 10, 10, 1)
  close.dispatchEvent(down)
  close.click()
})
if (document.querySelector('.dsh-task-dag-panel') !== null) throw new Error('close was swallowed by title-bar drag')

await React.act(async () => { trigger.click() })
const tabs = [...document.querySelectorAll('[role="tab"]')]
tabs[0].focus()
await React.act(async () => { tabs[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })) })
if (tabs[1].getAttribute('aria-selected') !== 'true' || document.activeElement !== tabs[1]) {
  throw new Error('view tabs did not support roving keyboard navigation')
}
if (document.querySelector('[role="tabpanel"]')?.getAttribute('aria-labelledby') !== tabs[1].id) {
  throw new Error('view tabs were not associated with their active panel')
}
if (document.querySelectorAll('.dsh-task-dag-node').length !== 4) throw new Error('Team view did not show lead, two members, and task')
const describedTask = document.querySelector('.dsh-task-dag-node[data-node-id="team-task:task-1"]')
const taskDescription = describedTask?.querySelector('desc')
if (describedTask?.getAttribute('role') !== 'group'
  || taskDescription === null
  || describedTask.getAttribute('aria-describedby') !== taskDescription.id
  || taskDescription.textContent !== 'Check the visual flow'
  || describedTask.querySelector('title') !== null) {
  throw new Error('non-Agent task did not retain an owned accessible description without a native SVG tooltip')
}
let communication = document.querySelector('.dsh-task-dag-communication')
if (communication === null) throw new Error('communication edge did not render')
await React.act(async () => { communication.dispatchEvent(new window.MouseEvent('click', { bubbles: true })) })
if (!document.querySelector('.dsh-task-dag-inspector')?.textContent.includes('Please review the dependency edge.')) {
  throw new Error('communication timeline did not open with projected text')
}
if (document.querySelectorAll('.dsh-task-dag-message').length !== 100
  || !document.querySelector('.dsh-task-dag-message-more')?.textContent.includes('1')) {
  throw new Error('communication timeline did not enforce its 100-message display bound')
}
const inspectorClose = document.querySelector('[aria-label="关闭通信详情"]')
await React.act(async () => { inspectorClose.click() })
if (document.querySelector('.dsh-task-dag-inspector') !== null) throw new Error('communication timeline did not close')

await React.act(async () => { communication.dispatchEvent(new window.MouseEvent('click', { bubbles: true })) })
const communicationToggle = document.querySelector('[aria-label="隐藏 Agent 通信层"]')
await React.act(async () => { communicationToggle.click() })
if (document.querySelector('.dsh-task-dag-communication') !== null
  || document.querySelector('.dsh-task-dag-inspector') !== null) {
  throw new Error('hiding communication did not also close its inspector')
}
await React.act(async () => { document.querySelector('[aria-label="显示 Agent 通信层"]').click() })
communication = document.querySelector('.dsh-task-dag-communication')
communication.focus()
await React.act(async () => { communication.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })) })
if (document.querySelector('.dsh-task-dag-inspector') === null) throw new Error('communication edge was not keyboard accessible')
await React.act(async () => { document.querySelector('[aria-label="关闭通信详情"]').click() })

await React.act(async () => { tabs.find(tab => tab.textContent.includes('Workflow')).click() })
if (document.querySelectorAll('.dsh-task-dag-node[data-type="workflow"]').length !== 1
  || document.querySelectorAll('.dsh-task-dag-node[data-type="phase"]').length !== 1) {
  throw new Error('Workflow view did not render run and phase topology')
}
const workflowRun = document.querySelector('.dsh-task-dag-node[data-type="workflow"]')
if (workflowRun.getAttribute('role') !== 'button'
  || workflowRun.getAttribute('aria-controls') !== 'dsh-task-dag-workflow-definition'
  || workflowRun.getAttribute('aria-expanded') !== 'false'
  || !workflowRun.getAttribute('aria-label')?.includes('预览 Workflow 定义')) {
  throw new Error('Workflow run was not exposed as an accessible definition-preview action')
}
workflowRun.focus()
await React.act(async () => { workflowRun.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true })) })
const definitionInspector = document.querySelector('.dsh-task-dag-definition-inspector')
if (!definitionInspector?.textContent.includes("phase('review')")
  || !definitionInspector.textContent.includes('Review the implementation before release.')
  || !definitionInspector.textContent.includes('Inspect the graph behavior.')
  || !definitionInspector.textContent.includes('Provider · spawn')) {
  throw new Error('Workflow definition inspector did not render code and projected metadata')
}
if (workflowRun.getAttribute('data-selected') !== 'true' || workflowRun.getAttribute('aria-expanded') !== 'true') {
  throw new Error('selected Workflow run was not visibly and accessibly marked')
}
await React.act(async () => { document.querySelector('[aria-label="关闭 Workflow 定义"]').click() })
if (document.querySelector('.dsh-task-dag-definition-inspector') !== null
  || workflowRun.getAttribute('aria-expanded') !== 'false' || document.activeElement !== workflowRun) {
  throw new Error('Workflow definition inspector did not close and restore focus')
}
const viewport = document.querySelector('.dsh-task-dag-viewport')
const original = document.querySelector('[aria-label="原始尺寸"]')
await React.act(async () => { original.click() })
if (viewport.getAttribute('data-fit') === 'true') throw new Error('original-size control did not enable scrolling')
viewport.scrollLeft = 80
viewport.scrollTop = 40
await React.act(async () => {
  viewport.dispatchEvent(pointer('pointerdown', 240, 180, 5))
  viewport.dispatchEvent(pointer('pointermove', 190, 150, 5))
  viewport.dispatchEvent(pointer('pointerup', 190, 150, 5))
})
if (viewport.scrollLeft !== 130 || viewport.scrollTop !== 70) throw new Error('canvas pan did not update scroll position')
await React.act(async () => { document.querySelector('[aria-label="适应视口"]').click() })

let worker = document.querySelector('.dsh-task-dag-node[data-type="workflow-member"]')
const svg = document.querySelector('.dsh-task-dag-svg')
svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 760, height: 460 })
const initialTransform = worker.getAttribute('transform')
await React.act(async () => {
  worker.dispatchEvent(pointer('pointerdown', 150, 180))
  worker.dispatchEvent(pointer('pointermove', 194, 206))
  worker.dispatchEvent(pointer('pointerup', 194, 206))
})
if (worker.getAttribute('transform') === initialTransform) throw new Error('node drag did not update its position')
await React.act(async () => { worker.dispatchEvent(new window.MouseEvent('click', { bubbles: true })) })
if (openedSession !== undefined || document.querySelector('.dsh-task-dag-panel') === null) {
  throw new Error('node drag was mistaken for Session navigation')
}
const draggedTransform = worker.getAttribute('transform')
await React.act(async () => { tabs.find(tab => tab.textContent.includes('总览')).click() })
await React.act(async () => { tabs.find(tab => tab.textContent.includes('Workflow')).click() })
worker = document.querySelector('.dsh-task-dag-node[data-type="workflow-member"]')
if (worker.getAttribute('transform') !== draggedTransform) throw new Error('per-view node position was not retained')

await React.act(async () => { document.querySelector('[aria-label="关闭任务 DAG"]').click() })
await React.act(async () => { trigger.click() })
await React.act(async () => { [...document.querySelectorAll('[role="tab"]')].find(tab => tab.textContent.includes('Workflow')).click() })
worker = document.querySelector('.dsh-task-dag-node[data-type="workflow-member"]')
if (worker.getAttribute('transform') !== draggedTransform) throw new Error('node position did not survive closing and reopening')
await React.act(async () => { worker.dispatchEvent(new window.MouseEvent('click', { bubbles: true })) })
if (openedSession !== 'child' || document.querySelector('.dsh-task-dag-panel') !== null) {
  throw new Error('worker node did not open its real Session and close the dialog')
}

await React.act(async () => { trigger.click() })
await React.act(async () => { document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })) })
if (document.querySelector('.dsh-task-dag-panel') !== null || document.activeElement !== trigger) {
  throw new Error('Escape did not close the dialog and restore trigger focus')
}
await React.act(async () => { reactRoot.unmount() })

const emptyList = {
  ...list,
  ids: ['solo'],
  byId: { solo: { id: 'solo', displayTitle: 'Solo Session', running: false, completed: true, blank: false, updatedAt: 1 } },
  current: 'solo',
  subagentsByParent: {},
}
const emptyConversation = { running: false, chat: { nodes: { values: () => [] } } }
const emptyMount = document.createElement('div')
document.body.appendChild(emptyMount)
const emptyRoot = createRoot(emptyMount)
await React.act(async () => {
  emptyRoot.render(React.createElement(registration.component, {
    ...props,
    sessionId: 'solo',
    useSessions: select => select(emptyList),
    useSession: select => select(emptyConversation),
  }))
})
await React.act(async () => { emptyMount.querySelector('.dsh-task-dag-trigger').click() })
if (document.querySelectorAll('.dsh-task-dag-node[data-type="root"]').length !== 1) {
  throw new Error('root-only Overview did not render the current Session node')
}
await React.act(async () => { emptyRoot.unmount() })
console.log('smoke ok: concrete reasoning sources, pointer and keyboard metrics, narrow/scroll accessibility, three views, inspectors, canvas controls, and Session navigation')
