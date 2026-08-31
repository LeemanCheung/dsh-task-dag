# Security Policy

## Supported versions

Security fixes are applied to the latest release on the `main` branch.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's **Security** tab to submit a private vulnerability report for this repository. Include the affected version, reproduction steps, impact, and any suggested mitigation.

## Trust boundaries

`dsh-task-dag` is a read-only Host and browser visualization plugin. Its Host half registers one small Session projection that copies only Provider, model, optional reasoning-effort, and its source marker from the latest durable `request/header`; a missing effort remains missing. System prompts, tool schemas, stop sequences, and other request fields are excluded. Its Client half reads that projection alongside DSH's existing cumulative token and Session statistics, plus the Session and Conversation projections for Agent Teams members, tasks, messages, deliveries, Workflow runs, and root tool-call snapshots, then renders an SVG graph. `src/reasoning-defaults.js` may add a visibly separate public-reference row, but never rewrites missing request evidence. Message details extract text blocks only after the user selects a communication channel; non-text blocks are counted by type and are not recursively displayed. Workflow definition preview parses the matching tool call's already-visible JSON and copies only the JavaScript body plus definition metadata into an owned projection; runtime `args`, outputs, and unrelated tool inputs are excluded.

The plugin does not:

- register model tools or add prompt content;
- read or write workspace files;
- execute shell commands;
- make network requests;
- append Session events or persist credentials;
- add a Host RPC endpoint or polling loop.

The packaged Host entries are copied from `src/index.js` and `src/reasoning-defaults.js`; the browser bundle embeds the same resolver with `src/team-projection.js`, `src/workflow-definition.js`, `src/graph-model.js`, `src/client.js`, and `src/style.css`. CI rebuilds all generated entries and rejects differences from committed `lib/` artifacts.
