---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.dependency-direction",
  "status": "current"
}
---
# Go Dependency Direction

Place dependencies and interfaces so higher-level behavior does not quietly
become coupled to lower-level mechanisms.

## Practice

Make dependency direction visible and place interfaces near the behavior that
consumes them when that keeps policy independent of mechanism.

Visible dependency direction helps keep product behavior from becoming
accidentally inseparable from storage, transport, or framework mechanics.

## Applicability

Use this record for new dependencies, interfaces, adapters, construction, and
cross-boundary import changes. Routine version motion with no boundary effect
usually needs only the target's normal dependency review.

Use this practice when:

- Adding a dependency, interface, adapter, client, repository, transport, or
  storage implementation
- Changing package imports across architectural boundaries
- Introducing dependency injection, globals, registries, or service locators

The practice has limited use when:

- A dependency update changes no import direction, abstraction boundary, or
  observable behavior

## Guidance

Start with a real consumer need, keep construction visible, and avoid interfaces
created only for hypothetical flexibility. This record does not choose the
target's libraries or architecture.

- Prefer dependencies that point from volatile mechanisms toward stable
  contracts only when the target's design supports that separation
- Define an interface for a real consumer need rather than in anticipation of
  possible implementations
- Keep construction at an explicit composition boundary
- Notice global state or hidden lookup that bypasses the visible dependency
  graph

## Verification

Inspect imports and construction paths, confirm each abstraction has a useful
consumer, and look for globals or registries that conceal the actual graph.

- Inspect new imports and draw the changed dependency direction
- Check that interfaces have a concrete consumer and useful boundary
- Exercise alternate or failing implementations when abstraction behavior
  matters
- Review for hidden global dependency access
