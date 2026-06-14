# Lifecycle Disciplines

A small, public collection of **discipline packages** — reusable engineering
judgment expressed as constraints, failure modes, and proof expectations that a
methodology can retrieve and apply to real work.

This repository exists to demonstrate the *concept* of a discipline package. It
ships two production-oriented packages you can read end to end:

- **Test Strategy** (`neutral.test-strategy`) — proof strategy, evidence
  adequacy, test selection, fuzzing, integration proof, release checks, and
  proof-gap handling.
- **Go Engineering** (`neutral.go-engineering`) — module and package
  boundaries, command shells, dependency direction, context and cancellation,
  goroutine lifecycle, error contracts, testing, fuzzing, and guardrails for
  agent-authored Go.

## What is a discipline package?

A discipline package captures the durable, reusable judgment of an engineering
discipline *without* deciding any single product's specifics. It tells a run
what good looks like, what tends to go wrong, and what evidence is required to
believe the work is done — then leaves the product-specific decisions to that
target's own authority records.

Each package is a single Markdown file with a consistent anatomy:

- **Frontmatter** — `package_id`, `discipline`, `version`, `scope`,
  `provenance`, the retrieval `slices`, and the `binding` ids.
- **Purpose / Applies To / Does Not Apply To** — when to reach for the package
  and, just as importantly, when not to.
- **Discipline Concepts** — the package body, split into retrievable *slices*.
  Each slice states what to preserve, its effect on product judgment, the
  **adequate proof** that demonstrates the constraint is satisfied, and the
  **common failure modes** it guards against.
- **Binding** — how the package plugs into the methodology: selection triggers,
  non-selection rules, the lifecycle **state effects** (Discovery, Work
  Boundary, Build, Proof, Closure), the record fields it writes, and how
  conflicts are resolved.

The recurring idea is **proof**: a discipline doesn't just assert a rule, it
names the evidence that would convince a reviewer the rule was honored, and the
failure modes that evidence must rule out.

## Layout

```
package-manifest.md                     registry of the packages in this source
packages/general/                       the discipline packages
  test-strategy.md
  go-engineering.md
install-profiles/
  engineering-discipline-core.md        bundles the packages for installation
```

## How the pieces fit together

1. **`package-manifest.md`** registers each package — its id, source file, and
   version — so a compiler can resolve them as package source.
2. An **install profile** under `install-profiles/` selects a substrate
   (the core methodology) plus a set of packages, and declares where installed
   methodology, disciplines, and records should live.
3. The methodology retrieves the relevant **slices** during a run and requires
   the **proof** each selected slice demands before a unit of work can close.

## Status

Both packages are at `0.1.0` — initial production-oriented seeds. They
intentionally stay broad and reusable, leaving target-specific promises,
schemas, names, and gates to each target's semantic authority.
