---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.model-based-testing",
  "status": "current"
}
---
# Model-Based Testing

Compare stateful implementation behavior with a smaller explicit model across
generated operation sequences.

## Practice

Use a small independent model to explore state transitions, sequencing, and
recovery when example workflows leave too many paths implicit.

A small independent model can expose sequence and state defects that remain
hidden in a handful of scripted workflows.

## Applicability

Use this record for state machines, protocols, transactions, repositories,
leases, and recovery. Avoid a model that merely duplicates implementation code.

Use this practice when:

- Changing state machines, protocols, repositories, workflows, transactions,
  leases, or recovery
- Operation order and retained state create a large path space
- A simpler reference model can express legal results independently

The practice has limited use when:

- The model would duplicate the implementation closely enough to share its
  defects
- The subject has no meaningful state or operation sequence

## Guidance

Keep the model declarative, generate useful valid and invalid sequences, compare
meaningful state, and retain minimized failures.

- Keep the model smaller and more declarative than the implementation
- Generate operations that include invalid, repeated, and recovery-relevant
  sequences
- Compare externally meaningful state after each useful step
- Retain minimized failing sequences as regressions

## Verification

Review independence, run and replay sequences from clean state, and inspect
recovery, invalid-transition, and shrinking behavior.

- Review model independence and state equivalence
- Run generated sequences from clean initial state
- Inspect failure shrinking and replay
- Check representative recovery and invalid-transition paths
