import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const localRequire = createRequire(import.meta.url)
const { JSDOM } = localRequire('jsdom')
const React = localRequire('react')
const ReactDOM = localRequire('react-dom')
const { createRoot } = localRequire('react-dom/client')
const { renderToStaticMarkup } = localRequire('react-dom/server')
const Icon = () => React.createElement('svg', { 'aria-hidden': true })
const primitives = {
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
    child: { id: 'child', displayTitle: 'Worker', origin: 'subagent', parentId: 'root', running: false, completed: true, blank: false, updatedAt: 2 },
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
  throw new Error(`header render did not include the merged topology count: ${html}`)
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
if (document.querySelectorAll('.dsh-task-dag-node').length !== 3) throw new Error('Team view did not show lead, member, and task')
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
console.log('smoke ok: Team projection, three views, communication inspector, canvas controls, per-view layout, root-only Overview, and Session navigation')
