---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.concurrency-determinism",
  "status": "current"
}
---
# Go Concurrency And Determinism

Make shared-state synchronization and required ordering explicit, then test the
concurrency properties that matter.

## Practice

Identify shared state and ordering assumptions explicitly so concurrency choices
can be reviewed and exercised.

Concurrency is easier to trust when shared state, synchronization ownership, and
required ordering are visible rather than inferred from timing.

## Applicability

Use this record for shared mutable state, parallelism, coordination, retries,
publication, or order-sensitive behavior. It adds little to isolated sequential
code.

Use this practice when:

- Changing shared maps, slices, pointers, caches, counters, status, channels,
  locks, or atomics
- Adding parallelism or behavior that depends on ordering
- Changing retry, publication, snapshot, or coordination paths

The practice has limited use when:

- The changed code is single-threaded and has no shared-state or ordering
  consequence

## Guidance

Name the synchronization owner, distinguish required order from scheduler
accident, and question concurrency that adds complexity without a clear benefit.

- Name the synchronization owner for mutable shared state
- Separate required determinism from incidental scheduling order
- Prefer simpler coordination when parallelism does not provide a material
  benefit
- Avoid tests whose success depends on arbitrary sleeps

## Verification

Use race detection and controlled interleavings where useful. Prefer explicit
coordination in tests over sleeps, and inspect the synchronization model itself.

- Run race detection over affected packages when feasible
- Exercise relevant interleavings through barriers, hooks, or controlled
  schedules
- Repeat order-sensitive tests
- Review synchronization and ownership rather than relying only on passing
  output
