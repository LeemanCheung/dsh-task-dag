# dsh-task-dag

[中文](README.zh.md)

A persistent live DAG view for DeepSeek Harness Web. It visualizes the current Session, delegated subagents, and durable workflow runs in one top-to-bottom dependency graph.

## Features

- Builds the graph from DSH Session snapshots and durable `workflow-run` Conversation Nodes.
- Restores workflow history after a DSH restart without a process-local cache.
- Groups workflow members under workflow nodes instead of drawing duplicate direct edges.
- Updates reactively without Host polling.
- Opens navigable subagent Sessions directly from graph nodes.
- Provides fit/original-size modes, root auto-centering, drag, keyboard close, and manual catalog refresh.
- Uses DSH semantic theme tokens and native SVG icons in both light and dark themes.

## Install

```powershell
dsh plugin --profile web add github:LeemanCheung/dsh-task-dag
```

Restart the current DSH Web process once after the first installation, then refresh the page. The **Task DAG** action appears in the Session header.

To remove it:

```powershell
dsh plugin --profile web remove dsh-task-dag
```

## Architecture

The plugin is client-driven. It reads:

- `SessionListState.byId` and `parentId` for subagent lineage.
- `SessionListState.subagentsByParent` for labels, modes, and activity.
- durable `workflow-run` Conversation Nodes for workflow phases, members, and outcomes.

It does not add model tools, prompts, schemas, RPC polling, or process-local workflow storage.

## Development

```bash
npm install
npm run check
```

`npm run check` rebuilds the browser module and runs syntax plus jsdom interaction smoke tests for workflow grouping, fit mode, close controls, and node navigation.

## License

[MIT](LICENSE)
