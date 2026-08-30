---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.public-api-contracts",
  "title": "Go Public API Contracts",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Treat exported Go identifiers, package paths, errors, and behavioral guarantees as intentional caller contracts.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["api", "contracts", "exports", "go"],
  "spec": {
    "practice": "Keep exported Go surfaces narrow, documented, and aligned with behavior the target is prepared to support.",
    "appliesWhen": ["Adding or changing exported types, functions, methods, variables, or constants", "Changing import paths, constructors, interfaces, errors, zero-value behavior, or concurrency guarantees", "Moving implementation detail across a public boundary"],
    "doesNotApplyWhen": ["Changes are private implementation details with no caller-observable contract effect"],
    "guidance": ["Export only what a real caller needs", "Document non-obvious behavior, ownership, concurrency, error, and zero-value expectations", "Avoid exposing implementation types merely to simplify local wiring", "Consider compatibility consequences before renaming or reshaping a public surface"],
    "verification": ["Review the exported diff from a caller's perspective", "Compile or test representative external-style usage", "Check documentation for non-obvious guarantees and limitations", "Inspect whether concrete dependencies leaked into a previously abstract surface"]
  }
}
---
# Go Public API Contracts

## Practice

An exported name is more than visibility: it can become a durable expectation
for callers. A small explicit surface is usually easier to evolve honestly.

## Applicability

Use this record for exported identifiers, import paths, constructors,
interfaces, errors, zero values, or caller-visible concurrency behavior. Skip it
when the change is entirely private and preserves caller behavior.

## Guidance

Start from real caller needs. Explain ownership and surprising behavior, and
avoid exporting implementation detail for local convenience. Compatibility and
exact API promises remain target decisions.

## Verification

Read the public diff as a caller, exercise representative usage, and check that
documentation and types communicate the contract without hidden local context.
