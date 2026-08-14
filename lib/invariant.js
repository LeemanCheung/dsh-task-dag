/** Package-owned invariant companion for dsh-task-dag. */
export const name = 'task-dag-invariant'
export const inject = ['invariants']

/** Reserve package ownership; runtime behavior is covered by slot lifecycle. */
export const apply = ctx => Promise.resolve(ctx.invariants.register('dsh-task-dag', () => {}))
