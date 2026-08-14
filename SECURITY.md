# Security Policy

## Supported versions

Security fixes are applied to the latest release on the `main` branch.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's **Security** tab to submit a private vulnerability report for this repository. Include the affected version, reproduction steps, impact, and any suggested mitigation.

## Trust boundaries

`dsh-task-dag` is a browser-only visualization plugin. It reads the Session and Conversation projections already exposed by the DSH Client runtime and renders an SVG graph.

The plugin does not:

- register model tools or add prompt content;
- read or write workspace files;
- execute shell commands;
- make network requests;
- persist Session content or credentials;
- add a Host RPC endpoint or polling loop.

The packaged browser bundle is generated from `src/client.js` and `src/style.css`. CI rebuilds it and rejects any difference from the committed `lib/client.js` artifact.
