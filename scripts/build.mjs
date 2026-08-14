import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [source, css] = await Promise.all([
  readFile(resolve(root, 'src/client.js'), 'utf8'),
  readFile(resolve(root, 'src/style.css'), 'utf8'),
])
const id = 'dsh-task-dag'
const bundle = `window.__ModuleLoader__.load({\n  id: ${JSON.stringify(id)},\n  factory: (require) => {\n    var module = { exports: {} };\n    var exports = module.exports;\n    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n    const STYLE_TEXT = ${JSON.stringify(css)};\n${source.split('\n').map(line => `    ${line}`).join('\n')}\n    return module.exports;\n  },\n});\n`
await mkdir(resolve(root, 'lib'), { recursive: true })
await writeFile(resolve(root, 'lib/client.js'), bundle, 'utf8')
console.log(`built ${id}: ${bundle.length} bytes`)
