---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.fuzzing",
  "status": "current"
}
---
# Go Fuzzing

Use Go fuzzing for broad input spaces with meaningful properties, small seed
corpora, and reproducible failures.

## Practice

Apply fuzzing where generated input can explore a meaningful property beyond a
short list of examples.

Fuzzing is useful when it explores a meaningful invariant over a broad input
space. A target that only asserts “no panic” often proves less than it appears.

## Applicability

Use this record for parsers, codecs, formats, persistence, and untrusted input.
Skip fuzzing when the subject has no useful property or cannot be made stable
enough to interpret failures.

Use this practice when:

- Changing parsers, decoders, serializers, protocols, persistence formats, or
  untrusted-input handling
- A broad input space makes example-only testing weak
- A prior defect suggests a reusable randomized property

The practice has limited use when:

- No meaningful property can be stated beyond no panic
- The subject is inherently external or nondeterministic without a controllable
  boundary

## Guidance

Define the property, keep targets deterministic, seed representative shapes,
and promote important discoveries into ordinary regression tests.

- State the property before choosing the fuzz target
- Keep the target deterministic and isolate mutable global state
- Use a small representative seed corpus
- Turn important discovered failures into stable regression cases

## Verification

Run a bounded campaign, inspect diagnostics and reproducibility, and ensure
temporary fuzz artifacts do not become unexplained durable repository state.

- Run a bounded smoke campaign suitable for local feedback
- Inspect the property and failure diagnostics rather than only campaign
  duration
- Reproduce retained failing inputs
- Check that generated corpus or crash output is not accidentally treated as
  durable source
