import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [source, css, graphModel, teamProjection, workflowDefinition] = await Promise.all([
  readFile(resolve(root, 'src/client.js'), 'utf8'),
  readFile(resolve(root, 'src/style.css'), 'utf8'),
  readFile(resolve(root, 'src/graph-model.js'), 'utf8'),
  readFile(resolve(root, 'src/team-projection.js'), 'utf8'),
  readFile(resolve(root, 'src/workflow-definition.js'), 'utf8'),
])
const id = 'dsh-task-dag'
const indent = text => text.split('\n').map(line => (line === '' ? '' : `    ${line}`)).join('\n')
const embeddedModel = graphModel.replace(/^export /gm, '')
const embeddedTeamProjection = teamProjection.replace(/^export /gm, '')
const embeddedWorkflowDefinition = workflowDefinition.replace(/^export /gm, '')
const bundle = `window.__ModuleLoader__.load({\n  id: ${JSON.stringify(id)},\n  factory: (require) => {\n    var module = { exports: {} };\n    var exports = module.exports;\n    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n    const STYLE_TEXT = ${JSON.stringify(css)};\n    const GRAPH_MODEL = (() => {\n${indent(embeddedModel)}\n      return { NODE_WIDTH, NODE_HEIGHT, buildGraph, graphLayout, normalizeStatus };\n    })();\n    const TEAM_PROJECTION = (() => {\n${indent(embeddedTeamProjection)}\n      return { TEAM_SNAPSHOT_KIND, createTeamSnapshotDefinition };\n    })();\n    const WORKFLOW_DEFINITION = (() => {\n${indent(embeddedWorkflowDefinition)}\n      return { attachWorkflowDefinitions };\n    })();\n${indent(source)}\n    return module.exports;\n  },\n});\n`
await mkdir(resolve(root, 'lib'), { recursive: true })
await writeFile(resolve(root, 'lib/client.js'), bundle, 'utf8')
console.log(`built ${id}: ${bundle.length} bytes`)
