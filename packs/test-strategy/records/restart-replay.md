---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.restart-replay",
  "title": "Restart And Replay Testing",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Test durable workflows across interruption, restart, replay, duplicate input, and recovery boundaries.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["durability", "recovery", "replay", "testing"],
  "spec": {
    "practice": "Exercise durable behavior from retained state at meaningful interruption points instead of inferring recovery from uninterrupted success.",
    "appliesWhen": ["Changing persistence, journals, queues, transactions, checkpoints, resumable work, or idempotency", "A process can stop between intent and observation", "Duplicate delivery, replay, or retry can repeat an effect"],
    "doesNotApplyWhen": ["Work has no durable state, resumable operation, or repeated-effect risk"],
    "guidance": ["Choose interruption points around durable boundaries", "Restart from retained state rather than reusing in-memory objects", "Distinguish safe retry, recognition of prior success, and indeterminate outcome", "Inspect duplicate and out-of-order input when the protocol can encounter them"],
    "verification": ["Exercise representative interruption and restart points", "Compare retained state before and after recovery", "Check duplicate-effect prevention or truthful indeterminate handling", "Run replay from a clean process when replay semantics matter"]
  }
}
---
# Restart And Replay Testing

## Practice

Durable recovery is a property of retained state and effect boundaries, not of a
single uninterrupted process run.

## Applicability

Use this record for persistence, queues, transactions, checkpoints, replay,
idempotency, and resumable operations. Stateless work usually does not need it.

## Guidance

Test around meaningful durable boundaries, restart from actual retained state,
and distinguish retry from recognition or indeterminate effects.

## Verification

Interrupt and restart representative paths, inspect retained state, and check
duplicate, replay, and effect-treatment behavior from a clean process.
