---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.restart-replay",
  "status": "current"
}
---
# Restart And Replay Testing

Test durable workflows across interruption, restart, replay, duplicate input,
and recovery boundaries.

## Practice

Exercise durable behavior from retained state at meaningful interruption points
instead of inferring recovery from uninterrupted success.

Durable recovery is a property of retained state and effect boundaries, not of a
single uninterrupted process run.

## Applicability

Use this record for persistence, queues, transactions, checkpoints, replay,
idempotency, and resumable operations. Stateless work usually does not need it.

Use this practice when:

- Changing persistence, journals, queues, transactions, checkpoints, resumable
  work, or idempotency
- A process can stop between intent and observation
- Duplicate delivery, replay, or retry can repeat an effect

The practice has limited use when:

- Work has no durable state, resumable operation, or repeated-effect risk

## Guidance

Test around meaningful durable boundaries, restart from actual retained state,
and distinguish retry from recognition or indeterminate effects.

- Choose interruption points around durable boundaries
- Restart from retained state rather than reusing in-memory objects
- Distinguish safe retry, recognition of prior success, and indeterminate
  outcome
- Inspect duplicate and out-of-order input when the protocol can encounter them

## Verification

Interrupt and restart representative paths, inspect retained state, and check
duplicate, replay, and effect-treatment behavior from a clean process.

- Exercise representative interruption and restart points
- Compare retained state before and after recovery
- Check duplicate-effect prevention or truthful indeterminate handling
- Run replay from a clean process when replay semantics matter
