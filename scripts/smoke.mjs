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
window.__ModuleLoader__ = {
  load(module) { loaded = module },
}

const bundle = await readFile(resolve(root, 'lib/client.js'), 'utf8')
;(0, eval)(bundle)
if (loaded?.id !== 'dsh-task-dag') throw new Error('client bundle did not register its package id')
const plugin = loaded.factory((id) => {
  if (id === 'react') return React
  if (id === 'react-dom') return ReactDOM
  if (id === '@deepseek-ai/dsh-client-ui-primitives') return primitives
  throw new Error(`unexpected client require: ${id}`)
})
if (plugin.inject.join(',') !== 'sessions,slots,locale') throw new Error('client inject list drifted')

let registration
let openedSession
const ctx = {
  effect(install) { install() },
  locale: { register() { return () => {} } },
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
if (style === null || !style.textContent.includes('.dsh-task-dag-panel')) {
  throw new Error('client stylesheet was not installed')
}
if (registration?.options.id !== 'task-dag') throw new Error('header registration missing')

const list = {
  ids: ['root', 'child'],
  byId: {
    root: { id: 'root', displayTitle: 'Root Session', running: true, blank: false, updatedAt: 1 },
    child: {
      id: 'child', displayTitle: 'Worker', origin: 'subagent', parentId: 'root',
      running: false, completed: true, blank: false, updatedAt: 2,
    },
  },
  current: 'root',
  phase: 'ready',
  subagentsByParent: {
    root: {
      state: 'ready', error: null, parentAvailable: true,
      entries: [{ kind: 'child', id: 'child', activity: 'inactive', hasChildren: false, mode: 'one-shot', label: 'audit' }],
    },
  },
  jobsBySession: {},
  currentAddress: undefined,
}
const conversation = {
  running: true,
  chat: {
    nodes: {
      values: () => [{
        id: 'run-1', kind: 'workflow-run', anchorSeq: 3,
        data: {
          name: 'quality', status: 'completed',
          phases: [{ key: 'phase', phase: 'review', members: [{ seq: 1, label: 'audit', childId: 'child', status: 'completed' }] }],
        },
      }],
    },
  },
}
const dictionary = {
  title: '任务 DAG',
  'trigger.aria': '打开任务 DAG，共 {count} 个任务节点',
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
  'panel.summary': '{nodes} 个节点 · {edges} 条依赖',
  'panel.live': '基于会话投影实时更新',
  'graph.aria': '当前会话的任务有向无环图',
  'canvas.aria': '可拖拽平移的任务 DAG 画布',
  'button.close': '关闭任务 DAG',
  'button.fit': '适应视口',
  'button.original': '原始尺寸',
  'button.refresh': '刷新子代理目录',
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
}
const t = (key, values = {}) => Object.entries(values).reduce(
  (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
  dictionary[key] ?? key,
)
const injected = registration.options.inject()
const props = {
  sessionId: 'root',
  useSessions: select => select(list),
  useSession: select => select(conversation),
  t,
  ...injected,
}
const html = renderToStaticMarkup(React.createElement(registration.component, props))
if (!html.includes('任务 DAG') || !html.includes('>2<')) {
  throw new Error(`header render did not include the durable workflow graph count: ${html}`)
}

const mount = document.createElement('div')
document.body.appendChild(mount)
globalThis.IS_REACT_ACT_ENVIRONMENT = true
const reactRoot = createRoot(mount)
await React.act(async () => { reactRoot.render(React.createElement(registration.component, props)) })
const trigger = document.querySelector('.dsh-task-dag-trigger')
if (trigger === null) throw new Error('interactive trigger did not render')
await React.act(async () => { trigger.click() })
const close = document.querySelector('[aria-label="关闭任务 DAG"]')
if (close === null || document.querySelector('.dsh-task-dag-panel') === null) {
  throw new Error('dialog did not open')
}
await React.act(async () => {
  const pointerDown = new window.MouseEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10 })
  Object.defineProperty(pointerDown, 'pointerId', { value: 1 })
  close.dispatchEvent(pointerDown)
  close.click()
})
if (document.querySelector('.dsh-task-dag-panel') !== null) {
  throw new Error('close control was swallowed by the draggable title bar')
}

await React.act(async () => { trigger.click() })
const viewport = document.querySelector('.dsh-task-dag-viewport')
const original = document.querySelector('[aria-label="原始尺寸"]')
const pointer = (type, x, y, pointerId = 7) => {
  const event = new window.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 })
  Object.defineProperty(event, 'pointerId', { value: pointerId })
  return event
}
if (original === null || viewport?.getAttribute('data-fit') !== 'true') {
  throw new Error('dialog did not default to the compact fit view')
}
await React.act(async () => { original.click() })
const fit = document.querySelector('[aria-label="适应视口"]')
if (fit === null || viewport?.getAttribute('data-fit') === 'true') {
  throw new Error('original-size control did not restore the scrollable canvas')
}
viewport.scrollLeft = 80
viewport.scrollTop = 40
await React.act(async () => { viewport.dispatchEvent(pointer('pointerdown', 240, 180, 5)) })
if (viewport.getAttribute('data-panning') !== 'true') {
  throw new Error('canvas did not enter its panning state')
}
await React.act(async () => {
  viewport.dispatchEvent(pointer('pointermove', 190, 150, 5))
  viewport.dispatchEvent(pointer('pointerup', 190, 150, 5))
})
if (viewport.scrollLeft !== 130 || viewport.scrollTop !== 70 || viewport.getAttribute('data-panning') === 'true') {
  throw new Error('dragging the empty canvas did not pan and release the viewport')
}
await React.act(async () => { fit.click() })
if (viewport?.getAttribute('data-fit') !== 'true') {
  throw new Error('fit control did not update the viewport')
}
const workflowEdges = document.querySelectorAll('.dsh-task-dag-edge[data-workflow="true"]')
if (workflowEdges.length !== 2 || document.querySelectorAll('.dsh-task-dag-edge').length !== 2) {
  throw new Error('workflow grouping did not replace the duplicate direct child edge')
}
let childNode = document.querySelector('.dsh-task-dag-node[data-clickable="true"]')
const svg = document.querySelector('.dsh-task-dag-svg')
if (childNode === null || svg === null) throw new Error('navigable child node did not render')
svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 720, height: 390 })
const initialTransform = childNode.getAttribute('transform')
await React.act(async () => {
  childNode.dispatchEvent(pointer('pointerdown', 150, 180))
  childNode.dispatchEvent(pointer('pointermove', 194, 206))
  childNode.dispatchEvent(pointer('pointerup', 194, 206))
})
if (childNode.getAttribute('transform') === initialTransform) {
  throw new Error('dragging a DAG node did not update its position')
}
await React.act(async () => { childNode.dispatchEvent(new window.MouseEvent('click', { bubbles: true })) })
if (openedSession !== undefined || document.querySelector('.dsh-task-dag-panel') === null) {
  throw new Error('a drag gesture was mistaken for node navigation')
}
const draggedTransform = childNode.getAttribute('transform')
const closeAfterDrag = document.querySelector('[aria-label="关闭任务 DAG"]')
await React.act(async () => { closeAfterDrag.click() })
await React.act(async () => { trigger.click() })
childNode = document.querySelector('.dsh-task-dag-node[data-clickable="true"]')
if (childNode === null || childNode.getAttribute('transform') !== draggedTransform) {
  throw new Error('node layout did not survive closing and reopening the graph')
}
await React.act(async () => { childNode.dispatchEvent(new window.MouseEvent('click', { bubbles: true })) })
if (openedSession !== 'child' || document.querySelector('.dsh-task-dag-panel') !== null) {
  throw new Error('child node did not navigate and close the dialog')
}
await React.act(async () => { reactRoot.unmount() })
console.log('smoke ok: graph bundle, controls, canvas pan, persistent node dragging, and child navigation')
