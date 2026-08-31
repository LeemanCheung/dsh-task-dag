import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const normalizeText = text => text.replace(/\r\n?/g, '\n')
const [host, source, css, reasoningDefaults, graphModel, teamProjection, workflowDefinition] = (await Promise.all([
  readFile(resolve(root, 'src/index.js'), 'utf8'),
  readFile(resolve(root, 'src/client.js'), 'utf8'),
  readFile(resolve(root, 'src/style.css'), 'utf8'),
  readFile(resolve(root, 'src/reasoning-defaults.js'), 'utf8'),
  readFile(resolve(root, 'src/graph-model.js'), 'utf8'),
  readFile(resolve(root, 'src/team-projection.js'), 'utf8'),
  readFile(resolve(root, 'src/workflow-definition.js'), 'utf8'),
])).map(normalizeText)
const id = 'dsh-task-dag'
const indent = text => text.split('\n').map(line => (line === '' ? '' : `    ${line}`)).join('\n')
const embeddedReasoningDefaults = reasoningDefaults.replace(/^export /gm, '')
const embeddedModel = graphModel
  .replace(/^import .*reasoning-defaults\.js';\r?\n/m, '')
  .replace(/^export /gm, '')
const embeddedTeamProjection = teamProjection.replace(/^export /gm, '')
const embeddedWorkflowDefinition = workflowDefinition.replace(/^export /gm, '')
const bundle = `window.__ModuleLoader__.load({\n  id: ${JSON.stringify(id)},\n  factory: (require) => {\n    var module = { exports: {} };\n    var exports = module.exports;\n    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n    const STYLE_TEXT = ${JSON.stringify(css)};\n    const REASONING_DEFAULTS = (() => {\n${indent(embeddedReasoningDefaults)}\n      return { publicReasoningReference };\n    })();\n    const GRAPH_MODEL = (() => {\n      const { publicReasoningReference } = REASONING_DEFAULTS;\n${indent(embeddedModel)}\n      return { NODE_WIDTH, NODE_HEIGHT, buildGraph, graphLayout, normalizeStatus };\n    })();\n    const TEAM_PROJECTION = (() => {\n${indent(embeddedTeamProjection)}\n      return { TEAM_SNAPSHOT_KIND, createTeamSnapshotDefinition };\n    })();\n    const WORKFLOW_DEFINITION = (() => {\n${indent(embeddedWorkflowDefinition)}\n      return { attachWorkflowDefinitions };\n    })();\n${indent(source)}\n    return module.exports;\n  },\n});\n`
if (bundle.includes('\r')) throw new Error('Generated client bundle contains non-canonical CR line endings')
await mkdir(resolve(root, 'lib'), { recursive: true })
await Promise.all([
  writeFile(resolve(root, 'lib/index.js'), host, 'utf8'),
  writeFile(resolve(root, 'lib/reasoning-defaults.js'), reasoningDefaults, 'utf8'),
  writeFile(resolve(root, 'lib/client.js'), bundle, 'utf8'),
])
console.log(`built ${id}: ${bundle.length} client bytes`)
