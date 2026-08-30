---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.fuzzing",
  "title": "Go Fuzzing",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Use Go fuzzing for broad input spaces with meaningful properties, small seed corpora, and reproducible failures.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["fuzzing", "go", "parsers", "testing"],
  "spec": {
    "practice": "Apply fuzzing where generated input can explore a meaningful property beyond a short list of examples.",
    "appliesWhen": ["Changing parsers, decoders, serializers, protocols, persistence formats, or untrusted-input handling", "A broad input space makes example-only testing weak", "A prior defect suggests a reusable randomized property"],
    "doesNotApplyWhen": ["No meaningful property can be stated beyond no panic", "The subject is inherently external or nondeterministic without a controllable boundary"],
    "guidance": ["State the property before choosing the fuzz target", "Keep the target deterministic and isolate mutable global state", "Use a small representative seed corpus", "Turn important discovered failures into stable regression cases"],
    "verification": ["Run a bounded smoke campaign suitable for local feedback", "Inspect the property and failure diagnostics rather than only campaign duration", "Reproduce retained failing inputs", "Check that generated corpus or crash output is not accidentally treated as durable source"]
  }
}
---
# Go Fuzzing

## Practice

Fuzzing is useful when it explores a meaningful invariant over a broad input
space. A target that only asserts “no panic” often proves less than it appears.

## Applicability

Use this record for parsers, codecs, formats, persistence, and untrusted input.
Skip fuzzing when the subject has no useful property or cannot be made stable
enough to interpret failures.

## Guidance

Define the property, keep targets deterministic, seed representative shapes,
and promote important discoveries into ordinary regression tests.

## Verification

Run a bounded campaign, inspect diagnostics and reproducibility, and ensure
temporary fuzz artifacts do not become unexplained durable repository state.
