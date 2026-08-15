<h1 align="center">dsh-task-dag</h1>

<p align="center">
  A live task topology for DeepSeek Harness Web.<br>
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
| Bounded layout persistence | Manual node positions live only in the current page's current-Session React state; switching Sessions, refreshing the page, or restarting DSH restores deterministic automatic layout. Workflow topology itself is rebuilt from durable Conversation Nodes. |
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
| Select **Task DAG** | Opens the Session-scoped graph panel, enables the related parent catalogs, and refreshes them. |
| Drag empty canvas | Pans the scrollable original-size canvas. |
| Drag a node | Rearranges it while its edges stay in sync; the layout survives close and reopen for the current Session. |
| Select a subagent node, or press `Enter` / `Space` on it | Opens that Session when it is available in the Session list. |
| Toggle fit mode | Switches between a whole-graph overview and the original scrollable canvas. |
| Refresh | Refreshes observed subagent catalogs; workflow nodes remain projection-driven. |
| Drag the title bar | Repositions the panel without capturing toolbar controls. |
| Press `Escape` or select close | Closes the panel and restores focus to the trigger. The dialog has no focus trap and does not offer keyboard dragging for the panel, canvas, or nodes. |

Status colors are deliberately limited to business blue, success green, error red, and warning amber. All other hierarchy is expressed through spacing, typography, borders, and line styles.

## Architecture

![dsh-task-dag projection architecture](docs/architecture.svg)

The browser plugin combines three durable Client-facing sources:

- `SessionListState.byId` and `parentId` provide subagent lineage.
- `SessionListState.subagentsByParent` provides labels, modes, activity, and catalog health.
- `workflow-run` Conversation Nodes provide workflow phases, members, and outcomes.

The package-owned graph-model Module normalizes lineage, inserts workflow grouping nodes, derives navigation capability, and lays out stable vertical layers. The UI Module renders that projection into `conversation.session.header.actions`.

There is no process-local workflow cache, model prompt contribution, model tool, Host RPC endpoint, or polling loop.

### Projection boundaries

Only descendants that can be traced to the current Session through `origin: "subagent"` lineage are shown. Orphans, missing-parent chains, and cycles are ignored. A catalog's `running` activity takes precedence over a completed Session summary; workflow members use their `workflow-run` status; unknown statuses render as historical/idle. If the same member appears in more than one workflow, the last parsed workflow membership owns its displayed grouping and status.

## Security and permissions

This is a browser-only, read-only visualization plugin. It does not read workspace files, execute commands, open network connections, register model tools, or persist Session content and credentials.

See [SECURITY.md](SECURITY.md) for the reporting policy and complete trust boundaries. Private vulnerability reporting is enabled for the repository.

## Development

The runtime package declares Node.js 20+. For development and the pinned jsdom test stack, use Node.js 20.19+, 22.13+, or 24+; CI currently runs Node.js 22.

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

These are pure-model and jsdom smoke checks, not a full DSH Web end-to-end suite. Theme fidelity, responsive layout, complete focus behavior, and unload behavior in a real profile still need manual or browser-E2E verification.

`scripts/build.mjs` embeds `src/graph-model.js`, `src/client.js`, and `src/style.css` into the committed `lib/client.js`. Do not edit that generated file directly: change `src/`, then run `npm run build` or `npm run check` before committing.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| **Task DAG** is missing | Confirm this is the Web profile, restart `dsh web`, and refresh the page. |
| A node cannot open | Only Sessions that remain visible in DSH's Session list are navigable. |
| Child status/labels look stale | Select **Refresh** to refresh observed subagent catalogs. |

## Remove

```powershell
dsh plugin --profile web remove dsh-task-dag
```

## License

[MIT](LICENSE) © LeemanCheung
