---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.differential-testing",
  "title": "Differential Testing",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Compare independent implementations, versions, or execution paths when their common behavior can reveal divergence.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["compatibility", "differential", "testing"],
  "spec": {
    "practice": "Use differential comparison when two sufficiently independent subjects should agree on a clearly normalized observable result.",
    "appliesWhen": ["Replacing or optimizing an implementation", "Maintaining two codecs, evaluators, engines, platforms, or versions with intended common behavior", "A trusted reference can expose divergence over broad generated cases"],
    "doesNotApplyWhen": ["There is no independent comparison subject", "Differences are expected but cannot be normalized without hiding meaningful behavior"],
    "guidance": ["Define the comparable observation and allowed differences first", "Avoid treating one implementation as infallible without review", "Generate cases that exercise distinct implementation paths", "Triage divergence into defect, expected difference, or unclear contract"],
    "verification": ["Run both subjects over the same exact cases", "Inspect normalization for lost meaningful differences", "Retain representative divergences", "Check that the comparison versions or revisions are identified"]
  }
}
---
# Differential Testing

## Practice

Independent implementations or versions can serve as strong oracles for one
another when their common observable behavior is defined carefully.

## Applicability

Use this record for replacements, optimizations, compatibility work, and
multiple engines or codecs. It does not help when there is no independent
comparison or no honest common observation.

## Guidance

Define normalization and allowed differences, compare broad useful cases, and
treat divergence as a fact to classify rather than automatic proof of one side.

## Verification

Identify both subjects, run exact common cases, inspect normalization, and keep
representative divergences available for review.
