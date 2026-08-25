<h1 align="center">dsh-task-dag</h1>

<p align="center">
  A live orchestration topology for DeepSeek Harness Web.<br>
  Inspect delegated Sessions, Agent Teams task dependencies and communication, and durable Workflow runs.
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

`dsh-task-dag` turns DSH's existing Client projections into three focused graph views. It keeps no parallel orchestration database and sends no polling requests: Session, Team, and Workflow state is rebuilt from the projections DSH already owns.

| View | What it shows |
| --- | --- |
| **Overview** | Current Session, ordinary delegated subagents, Team members and tasks, Agent communication, and Workflow runs. |
| **Agent Teams** | Team Lead and teammates, task assignment, the real shared-task `blockedBy` DAG, and an optional communication overlay. |
| **Workflow** | Durable Workflow run, phase grouping, and started member Sessions. Phase edges are presentation grouping, not script dependency edges. |

Additional behavior:

- **Agent communication:** directed channels aggregate message count and queued delivery state. Select a channel to inspect the latest 100 message records with quiet/wakeup and delivery metadata; only text blocks are previewed, while other block types are counted.
- **Direct navigation:** selectable teammate, subagent, and Workflow member nodes open the real Session when it remains visible in the Session list.
- **Canvas control:** fit the whole topology, pan the original-size canvas, or drag nodes while connected edges update.
- **Per-view layout:** manual positions survive view switches and reopening the panel for the current Session. Switching Sessions, refreshing the page, or restarting DSH restores deterministic automatic layout.
- **Native presentation:** the panel uses DSH semantic theme tokens, accessible status labels, edge line styles, responsive communication details, and reduced-motion behavior.
- **Lifecycle safety:** Team projection, locale, styles, and Slot UI are all owned by the Cordis plugin lifecycle.

## Live screenshot

Captured from a running DSH Web Session with labels anonymized. The panel, controls, layout, and graph presentation are the actual linked plugin UI.

![dsh-task-dag running in DSH Web](docs/screenshot.png)

## Install

```powershell
dsh plugin --profile web add github:LeemanCheung/dsh-task-dag
```

Restart the current DSH Web process once after the first installation, then refresh the page. The **Task DAG** action appears in the Session header.

For a version-pinned installation:

```powershell
dsh plugin --profile web add github:LeemanCheung/dsh-task-dag#v1.3.0
```

## Using the graph

| Action | Result |
| --- | --- |
| Select **Task DAG** | Opens the current Session's graph and refreshes observed subagent catalogs. |
| Choose **Overview**, **Agent Teams**, or **Workflow** | Changes topology without losing the current page's manual layout for the other views. |
| Toggle the message icon | Shows or hides Agent communication without changing task layout. |
| Select a communication edge | Opens its directed message timeline. `Enter` and `Space` work from the focused edge. |
| Select an Agent node | Opens its Session when it is available in the Session list. `Enter` and `Space` are supported. |
| Drag empty canvas / drag a node | Pans the original-size canvas or rearranges one node while edges stay synchronized. |
| Toggle fit mode | Switches between the whole-graph overview and the original scrollable canvas. |
| Refresh | Refreshes subagent catalogs; Team and Workflow nodes remain projection-driven. |
| Press `Escape` or select close | Closes the panel and restores focus to the trigger. |

The dialog does not trap focus and does not provide keyboard dragging for the panel, canvas, or nodes.

## Architecture

![dsh-task-dag projection architecture](docs/architecture.svg)

The browser plugin combines four Client-facing sources:

- `SessionListState.byId` and `parentId` provide ordinary subagent lineage.
- `SessionListState.subagentsByParent` provides labels, modes, activity, and catalog health.
- Durable Agent Teams events provide members, shared tasks, queued messages, and delivery acknowledgements.
- `workflow-run` Conversation Nodes provide Workflow runs, phase groups, members, and outcomes.

A package-owned hidden Conversation Node Definition projects each supported Team v1 event into a small snapshot node. The graph model folds the latest task/member state, matches message delivery acknowledgements, aggregates directed communication channels, constructs explicit multi-parent edges, and applies a deterministic non-recursive topological layout. The UI renders the result in `conversation.session.header.actions`.

There is no model prompt contribution, model tool, Host RPC endpoint, network request, polling loop, or second persistence layer.

### Projection boundaries

- Agent Teams writes the task board and message journal into the **Team Lead Session**. A teammate Session cannot read that log through this client-only plugin, so its Team view links back to the visible parent Session instead of adding a cross-Session Host RPC.
- `blockedBy` is the only edge presented as a real Team task dependency. Communication can be bidirectional and cyclic, so it is an overlay and never participates in DAG layering.
- Persisted Workflow phases are progress groups. They do not reveal the complete internal `parallel()` or `pipeline()` control flow and are not labeled as execution dependencies.
- Ordinary lineage must trace to the current Session through `origin: "subagent"`. Orphans, missing-parent chains, and lineage cycles are ignored. Malformed dependency cycles receive a deterministic fallback layer rather than blocking rendering.
- The same Session may appear in Team and Workflow contexts because those nodes communicate different ownership semantics; all appearances navigate to the same Session ID.

## Security and permissions

This is a browser-only, read-only visualization plugin. It does not read workspace files, execute commands, open network connections, register model tools, or persist Session content and credentials. Message previews are derived from text blocks already present in the Team Lead Session and are shown only after a communication channel is selected.

See [SECURITY.md](SECURITY.md) for the reporting policy and complete trust boundaries. Private vulnerability reporting is enabled for the repository.

## Development

The runtime package declares Node.js 20+. For development and the pinned jsdom test stack, use Node.js 20.19+, 22.13+, or 24+; CI currently runs Node.js 22.

```bash
npm install
npm run check
```

The check pipeline validates all source syntax; tests Team event projection, task and communication folding, Workflow grouping, arbitrary DAG layout, deep lineages, and cyclic fallback; rebuilds the browser bundle; then runs jsdom interaction coverage for three views, the communication layer and bounded inspector, canvas controls, per-view node positions, focus, and Session navigation. CI also rejects drift in committed `lib/client.js`.

These are pure-model and jsdom checks rather than a complete DSH Web E2E environment. Before release, the linked package is additionally verified against the running Web profile in a real browser.

`scripts/build.mjs` embeds `src/team-projection.js`, `src/graph-model.js`, `src/client.js`, and `src/style.css` into committed `lib/client.js`. Do not edit the generated file directly.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| **Task DAG** is missing | Confirm this is the Web profile, restart `dsh web`, and refresh the page. |
| Team view is empty in a teammate Session | Open the Team Lead/parent Session; the shared task and message journal lives there. |
| A node cannot open | Only Sessions that remain visible in DSH's Session list are navigable. |
| Child status or labels look stale | Select **Refresh** to refresh observed subagent catalogs. |

## Remove

```powershell
dsh plugin --profile web remove dsh-task-dag
```

## License

[MIT](LICENSE) © LeemanCheung
