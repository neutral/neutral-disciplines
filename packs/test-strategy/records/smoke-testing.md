---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.smoke-testing",
  "title": "Smoke Testing",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Use a short realistic path to detect gross integration or packaging failure without overstating its coverage.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["deployment", "smoke", "testing"],
  "spec": {
    "practice": "Keep smoke tests short, realistic, and explicit about the narrow confidence they provide.",
    "appliesWhen": ["A packaged, installed, deployed, or composed result needs a fast end-to-end sanity check", "Configuration, startup, routing, or dependency wiring can fail outside component tests", "Operators need an inexpensive post-change signal"],
    "doesNotApplyWhen": ["The proposed smoke path is the only proof for complex behavior, failure handling, or durability"],
    "guidance": ["Choose one or a few representative high-value paths", "Exercise the produced artifact or deployed shape rather than a development shortcut", "Keep setup and cleanup reliable", "State what the smoke path does not cover"],
    "verification": ["Run against the intended packaged or deployed subject", "Confirm the path observes meaningful output", "Exercise startup and cleanup", "Check that reporting does not present smoke success as comprehensive proof"]
  }
}
---
# Smoke Testing

## Practice

A smoke test quickly answers whether a realistic path basically works. Its
strength is speed and integration reach, not comprehensive coverage.

## Applicability

Use this record for packaged, installed, deployed, or composed results. Do not
let a smoke path stand alone for complex behavior, durability, or failure proof.

## Guidance

Choose representative paths, exercise the real delivered shape, keep setup
repeatable, and say what remains outside the smoke signal.

## Verification

Run against the intended subject, inspect meaningful output and cleanup, and
review how the result is described to decision makers.
