/** Host half for the Task DAG session metrics projection. */
export const name = 'task-dag'

const METRICS_KEY = 'taskDagAgentMetrics'

const metricsSchema = {
  parse(value) {
    if (value === null) return value
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error(`${METRICS_KEY} must be null or an object`)
    }
    if (typeof value.provider !== 'string' || value.provider.trim() === ''
      || typeof value.model !== 'string' || value.model.trim() === '') {
      throw new Error(`${METRICS_KEY} requires non-empty string provider and model fields`)
    }
    if (value.reasoningSource !== 'request-config'
      && value.reasoningSource !== 'adapter-default'
      && value.reasoningSource !== 'not-recorded') {
      throw new Error(`${METRICS_KEY}.reasoningSource is invalid`)
    }
    const hasEffort = typeof value.reasoningEffort === 'string' && value.reasoningEffort.trim() !== ''
    if (value.reasoningSource === 'not-recorded' && value.reasoningEffort !== undefined) {
      throw new Error(`${METRICS_KEY}.reasoningEffort must be absent when its source is not-recorded`)
    }
    if (value.reasoningSource !== 'not-recorded' && !hasEffort) {
      throw new Error(`${METRICS_KEY}.reasoningEffort must be a non-empty string for a recorded source`)
    }
    return {
      provider: value.provider,
      model: value.model,
      ...(hasEffort ? { reasoningEffort: value.reasoningEffort } : {}),
      reasoningSource: value.reasoningSource,
    }
  },
}

const metricsProjection = {
  key: METRICS_KEY,
  stateSchema: metricsSchema,
  schema: metricsSchema,
  init: () => null,
  apply(state, event) {
    if (event.type !== 'request/header') return state
    const config = event.data.header.config
    const reasoningEffort = config.reasoningEffort
    const next = {
      provider: config.provider,
      model: config.model,
      ...(reasoningEffort === undefined ? {} : { reasoningEffort }),
      reasoningSource: reasoningEffort === undefined
        ? 'not-recorded'
        : event.data.header.adapterDefaults?.reasoningEffort === true
          ? 'adapter-default'
          : 'request-config',
    }
    return state?.provider === next.provider
      && state.model === next.model
      && state.reasoningEffort === next.reasoningEffort
      && state.reasoningSource === next.reasoningSource ? state : next
  },
  wire: { viewSchema: metricsSchema, view: state => state },
  view: state => state,
  stateVersion: 2,
}

/** Register the latest model route as a whole-log Session projection when available. */
export function apply(ctx) {
  ctx.inject(['sessionProjections'], scope => scope.sessionProjections.register(metricsProjection))
}
