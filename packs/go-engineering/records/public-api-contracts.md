---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.public-api-contracts",
  "status": "current"
}
---
# Go Public API Contracts

Treat exported Go identifiers, package paths, errors, and behavioral guarantees
as intentional caller contracts.

## Practice

Keep exported Go surfaces narrow, documented, and aligned with behavior the
target is prepared to support.

An exported name is more than visibility: it can become a durable expectation
for callers. A small explicit surface is usually easier to evolve honestly.

## Applicability

Use this record for exported identifiers, import paths, constructors,
interfaces, errors, zero values, or caller-visible concurrency behavior. Skip it
when the change is entirely private and preserves caller behavior.

Use this practice when:

- Adding or changing exported types, functions, methods, variables, or constants
- Changing import paths, constructors, interfaces, errors, zero-value behavior,
  or concurrency guarantees
- Moving implementation detail across a public boundary

The practice has limited use when:

- Changes are private implementation details with no caller-observable contract
  effect

## Guidance

Start from real caller needs. Explain ownership and surprising behavior, and
avoid exporting implementation detail for local convenience. Compatibility and
exact API promises remain target decisions.

- Export only what a real caller needs
- Document non-obvious behavior, ownership, concurrency, error, and zero-value
  expectations
- Avoid exposing implementation types merely to simplify local wiring
- Consider compatibility consequences before renaming or reshaping a public
  surface

## Verification

Read the public diff as a caller, exercise representative usage, and check that
documentation and types communicate the contract without hidden local context.

- Review the exported diff from a caller's perspective
- Compile or test representative external-style usage
- Check documentation for non-obvious guarantees and limitations
- Inspect whether concrete dependencies leaked into a previously abstract
  surface
