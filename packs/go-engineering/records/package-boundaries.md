---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.package-boundaries",
  "status": "current"
}
---
# Go Package Boundaries

Keep Go packages cohesive, intentionally visible, and easy to explain through
their import direction.

## Practice

Shape each Go package around one coherent responsibility and make its visibility
and import direction deliberate.

A package is easiest to maintain when its responsibility, visibility, and
dependency direction can be explained without reconstructing the whole module.

## Applicability

Use this record for package creation, movement, merging, splitting, or import
changes. It adds little to formatting-only work that leaves those boundaries
unchanged.

Use this practice when:

- Creating, moving, merging, or splitting Go packages
- Changing module layout or import relationships
- Choosing between public, internal, command, generated, and test-support
  locations

The practice has limited use when:

- A change is limited to formatting and preserves package and import boundaries

## Guidance

Look for cohesive responsibilities and the smallest useful public surface.
`internal` is often a good default for implementation support; `cmd` and public
package locations should reflect real roles rather than serve as generic bins.
The target still owns its exact package map and naming.

- Prefer a package name that communicates a concrete responsibility rather than
  a generic bucket
- Use internal visibility when external modules do not need a stable import
  surface
- Treat a new public package as a caller-facing commitment worth deliberate
  review
- Avoid placeholder packages that imply architecture before the target has
  chosen it

## Verification

Review the import graph, changed visibility, and package responsibilities. Run
tests at the scopes that can reveal both local and module-level breakage.

- Inspect the changed import graph and visibility boundaries
- Run tests from the repository root and the affected package scope when both
  views are useful
- Review whether each new or moved package has a concise explainable
  responsibility
