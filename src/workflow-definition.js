'use strict';

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function optionalString(value) {
  return typeof value === 'string' ? value : undefined;
}

function projectPhases(value) {
  if (!Array.isArray(value)) return [];
  const phases = [];
  for (const candidate of value) {
    if (!isRecord(candidate) || typeof candidate.title !== 'string' || candidate.title === '') continue;
    phases.push({
      title: candidate.title,
      ...(optionalString(candidate.detail) === undefined ? {} : { detail: candidate.detail }),
      ...(optionalString(candidate.provider) === undefined ? {} : { provider: candidate.provider }),
      ...(optionalString(candidate.model) === undefined ? {} : { model: candidate.model }),
    });
  }
  return phases;
}

function toolCallMaterial(viewNode) {
  if (!viewNode || viewNode.kind !== 'tool-call' || !isRecord(viewNode.data)) return null;
  const root = viewNode.data.root;
  if (!isRecord(root)) return null;
  const settled = root.kind === 'tool-result';
  const call = settled ? root.call : root;
  if (!isRecord(call) || call.name !== 'workflow' || typeof call.argsRaw !== 'string') return null;
  return {
    callId: typeof root.callId === 'string' ? root.callId : String(viewNode.id || ''),
    toolName: call.name,
    argsRaw: call.argsRaw,
    anchorSeq: Number.isFinite(viewNode.anchorSeq) ? viewNode.anchorSeq : 0,
  };
}

export function extractWorkflowDefinition(viewNode) {
  const material = toolCallMaterial(viewNode);
  if (material === null) return null;
  let args;
  try {
    args = JSON.parse(material.argsRaw);
  } catch {
    return null;
  }
  if (!isRecord(args) || typeof args.script !== 'string' || !isRecord(args.meta)
    || typeof args.meta.name !== 'string' || args.meta.name === '') return null;
  return {
    callId: material.callId,
    anchorSeq: material.anchorSeq,
    toolName: material.toolName,
    script: args.script,
    meta: {
      name: args.meta.name,
      description: optionalString(args.meta.description) || '',
      ...(optionalString(args.meta.whenToUse) === undefined ? {} : { whenToUse: args.meta.whenToUse }),
      phases: projectPhases(args.meta.phases),
    },
  };
}

export function attachWorkflowDefinitions(workflowNodes, chatNodes) {
  const definitions = chatNodes
    .map(extractWorkflowDefinition)
    .filter(Boolean)
    .sort((left, right) => left.anchorSeq - right.anchorSeq);
  const used = new Set();
  const byRunId = new Map();
  // Newest-first matching prevents same-name call/run pairs from crossing when calls arrive in a batch.
  const runs = [...workflowNodes].sort((left, right) => right.anchorSeq - left.anchorSeq);
  for (const run of runs) {
    const runName = run?.data?.name;
    if (typeof runName !== 'string') continue;
    let match = null;
    for (const definition of definitions) {
      const identity = `${definition.callId}\u001f${definition.anchorSeq}`;
      if (used.has(identity) || definition.anchorSeq > run.anchorSeq || definition.meta.name !== runName) continue;
      if (match === null || definition.anchorSeq > match.anchorSeq) match = definition;
    }
    if (match === null) continue;
    used.add(`${match.callId}\u001f${match.anchorSeq}`);
    byRunId.set(run.id, match);
  }
  return workflowNodes.map((run) => {
    const definition = byRunId.get(run.id);
    if (definition === undefined) return run;
    return { ...run, data: { ...(run.data || {}), definition } };
  });
}
