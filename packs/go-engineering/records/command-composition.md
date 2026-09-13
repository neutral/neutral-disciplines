---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.command-composition",
  "status": "current"
}
---
# Go Command Composition

Keep command entrypoints thin and make startup, dependency composition,
readiness, and shutdown visible.

## Practice

Let command entrypoints parse and bootstrap while an explicit composition
boundary owns dependency construction and process lifecycle.

Thin command entrypoints make composition, startup failure, and shutdown easier
to reason about without turning executable wiring into application architecture.

## Applicability

Use this record when work touches `main`, command dispatch, dependency wiring,
readiness, or process lifecycle. It does not apply to library-only work with no
executable consequence.

Use this practice when:

- Changing main functions, command dispatch, startup, or dependency wiring
- Adding a long-running Go process, worker, daemon, or service command
- Changing readiness, shutdown, or startup failure behavior

The practice has limited use when:

- Work does not affect a Go executable or its process lifecycle

## Guidance

Let the command parse inputs and hand off to an explicit composition boundary.
Make dependency checks, readiness, background-work ownership, and shutdown
behavior visible. The target decides its command framework and exact topology.

- Keep domain workflow out of command packages when it can live behind a
  reusable boundary
- Make configuration validation and dependency startup failure visible before
  accepting work
- Give shutdown and background work an explicit owner
- Keep command output and exit behavior stable when automation relies on them

## Verification

Try representative startup, failure, and shutdown paths. Inspect delegation and
check caller-visible output or exit behavior where scripts depend on it.

- Exercise startup success and representative startup failure
- Inspect that the command delegates rather than owning substantial domain
  workflow
- Exercise cancellation or shutdown when the command starts background work
- Check observable output and exit status when they are caller-facing
