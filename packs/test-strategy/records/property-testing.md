---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.property-testing",
  "title": "Property Testing",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Express invariants, round trips, monotonicity, and other general relationships across generated examples.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["invariants", "property", "testing"],
  "spec": {
    "practice": "Use property testing when a general relationship captures the expected behavior more faithfully than enumerated outputs.",
    "appliesWhen": ["The subject has round-trip, idempotence, monotonicity, conservation, ordering, or equivalence properties", "Many generated examples can share one meaningful assertion", "Shrinking can turn a broad failure into a useful minimal case"],
    "doesNotApplyWhen": ["Expected behavior is primarily a short set of distinct examples", "The property is so weak that incorrect implementations satisfy it easily"],
    "guidance": ["State the property in domain terms before writing generators", "Use generators that cover meaningful structure and boundaries", "Avoid tautologies that repeat the implementation", "Retain minimal counterexamples as regressions when they reveal durable defects"],
    "verification": ["Review whether a plausible wrong implementation could pass the property", "Inspect generator distribution and boundary coverage", "Exercise shrinking or counterexample reporting", "Pair broad properties with examples that communicate important named behavior"]
  }
}
---
# Property Testing

## Practice

Properties describe relationships that should hold across many cases, such as a
round trip or conservation rule, rather than a long table of expected outputs.

## Applicability

Use this record where a meaningful invariant spans many examples. Prefer direct
examples when the behavior is a small set of distinct stories.

## Guidance

Write the property in domain language, generate meaningful structure, avoid
restating the implementation, and retain useful minimal counterexamples.

## Verification

Challenge the property's strength, inspect generator coverage and shrinking,
and pair general properties with clear representative examples.
