<h1 align="center">dsh-task-dag</h1>

<p align="center">
  A persistent, live task topology for DeepSeek Harness Web.<br>
  See Sessions, delegated subagents, and durable workflows as one navigable DAG.
</p>

<p align="center">
  <a href="https://awesome.re"><img alt="Awesome" src="https://awesome.re/badge.svg"></a>
  <a href="https://awesome-dsh-plugin.com"><img alt="Awesome DSH Plugin" src="https://awesome-dsh-plugin.com/badge.svg"></a>
  <a href="https://github.com/LeemanCheung/dsh-task-dag/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/LeemanCheung/dsh-task-dag/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/LeemanCheung/dsh-task-dag/releases/latest"><img alt="Release" src="https://img.shields.io/github/v/release/LeemanCheung/dsh-task-dag"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/github/license/LeemanCheung/dsh-task-dag"></a>
</p>

<p align="center">
  English · <a href="README.zh.md">中文</a>
</p>

![dsh-task-dag visual overview](docs/task-dag-preview.svg)

## At a glance

`dsh-task-dag` turns DSH's existing Client projections into a top-to-bottom dependency graph. It keeps no parallel workflow database and sends no polling requests: when Session state changes, the graph changes with it.

| Capability | Behavior |
| --- | --- |
| Live topology | Reacts to Session and subagent catalog snapshots without Host polling. |
| Durable workflows | Reconstructs workflow phases and members from `workflow-run` Conversation Nodes after restart. |
| Clear ownership | Groups workflow members under workflow nodes instead of drawing duplicate root-to-child edges. |
| Direct navigation | Opens healthy, list-visible subagent Sessions from their graph nodes. |
| Canvas control | Fits the whole graph or pans the original-size canvas; nodes can be dragged and keep their rearranged positions while the current Session panel is reopened. |
| Robust projection | Rejects broken or cyclic lineage while retaining deterministic layers for valid deep dependency chains. |
| Native presentation | Uses DSH theme semantics, restrained status colors, and custom SVG icons in light and dark modes. |
| Lifecycle safe | Registers UI and styles through Cordis lifecycle ownership and removes them on unload. |

## Live screenshot

Captured from a running DSH Web Session with task labels anonymized. The panel, layout, edges, controls, and status presentation are the actual plugin UI.

![dsh-task-dag running in DSH Web](docs/screenshot.png)

## Install

```powershell
dsh plugin --profile web add github:LeemanCheung/dsh-task-dag
```

Restart the current DSH Web process once after the first installation, then refresh the page. The **Task DAG** action appears in the Session header.

For a version-pinned installation:

```powershell
dsh plugin --profile web add github:LeemanCheung/dsh-task-dag#v1.2.0
```

## Using the graph

| Action | Result |
| --- | --- |
| Select **Task DAG** | Opens the Session-scoped graph panel. |
| Drag empty canvas | Pans the scrollable original-size canvas. |
| Drag a node | Rearranges it while its edges stay in sync; the layout survives close and reopen for the current Session. |
| Select a subagent node | Opens that Session when it is available in the Session list. |
| Toggle fit mode | Switches between a whole-graph overview and the original scrollable canvas. |
| Refresh | Refreshes observed subagent catalogs; workflow nodes remain projection-driven. |
| Drag the title bar | Repositions the panel without capturing toolbar controls. |
| Press `Escape` or select close | Closes the panel and restores focus to the trigger. |

Status colors are deliberately limited to business blue, success green, error red, and warning amber. All other hierarchy is expressed through spacing, typography, borders, and line styles.

## Architecture

![dsh-task-dag projection architecture](docs/architecture.svg)

The browser plugin combines three durable Client-facing sources:

- `SessionListState.byId` and `parentId` provide subagent lineage.
- `SessionListState.subagentsByParent` provides labels, modes, activity, and catalog health.
- `workflow-run` Conversation Nodes provide workflow phases, members, and outcomes.

The package-owned graph-model Module normalizes lineage, inserts workflow grouping nodes, derives navigation capability, and lays out stable vertical layers. The UI Module renders that projection into `conversation.session.header.actions`.

There is no process-local workflow cache, model prompt contribution, model tool, Host RPC endpoint, or polling loop.

## Security and permissions

This is a browser-only, read-only visualization plugin. It does not read workspace files, execute commands, open network connections, register model tools, or persist Session content and credentials.

See [SECURITY.md](SECURITY.md) for the reporting policy and complete trust boundaries. Private vulnerability reporting is enabled for the repository.

## Development

Requirements: Node.js 20 or newer.

```bash
npm install
npm run check
```

The check pipeline:

1. validates source syntax and the pure graph-model Module;
2. runs graph-model unit tests for lineage, workflow grouping, deterministic layout, and deep chains;
3. rebuilds and validates the precompiled browser module;
4. runs jsdom interaction smoke tests for controls, canvas panning, persistent node dragging, and node navigation;
5. verifies in CI that committed `lib/client.js` is reproducible from source.

## Remove

```powershell
dsh plugin --profile web remove dsh-task-dag
```

## License

[MIT](LICENSE) © LeemanCheung
