---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.fuzz-testing",
  "status": "current"
}
---
# Fuzz Testing

Use generated inputs to explore broad spaces through meaningful properties and
reproducible failures.

## Practice

Choose fuzzing when a broad input space and a useful invariant make generation
more revealing than a finite example list.

Fuzzing helps when generation explores combinations that examples cannot and a
meaningful property tells the test what failure means.

## Applicability

Use this record for broad input and transition spaces. Avoid it when the only
signal is “did not crash” or the subject cannot be isolated safely.

Use this practice when:

- Input combinations, encodings, sizes, or shapes are too broad for
  representative examples alone
- Parsers, codecs, protocols, formats, or state transitions accept generated
  subjects
- A discovered failure can be reproduced from a retained input

The practice has limited use when:

- The only available assertion is process survival
- The target cannot be isolated from uncontrolled external effects

## Guidance

Define properties first, seed useful shapes, make failures reproducible, and
turn important discoveries into focused regressions.

- State an invariant or relationship beyond no crash
- Seed important structural shapes without turning the corpus into another
  fixture suite
- Make failures reproducible and diagnostics actionable
- Convert important discoveries into stable regressions

## Verification

Review the property and generator, run a bounded campaign, reproduce failures,
and keep corpus retention deliberate.

- Inspect target properties and generator coverage
- Run a bounded campaign appropriate to the decision
- Reproduce retained failures independently
- Check that corpus and crash artifacts have an intentional retention policy
