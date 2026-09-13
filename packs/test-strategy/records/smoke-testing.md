---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.smoke-testing",
  "status": "current"
}
---
# Smoke Testing

Use a short realistic path to detect gross integration or packaging failure
without overstating its coverage.

## Practice

Keep smoke tests short, realistic, and explicit about the narrow confidence they
provide.

A smoke test quickly answers whether a realistic path basically works. Its
strength is speed and integration reach, not comprehensive coverage.

## Applicability

Use this record for packaged, installed, deployed, or composed results. Do not
let a smoke path stand alone for complex behavior, durability, or failure proof.

Use this practice when:

- A packaged, installed, deployed, or composed result needs a fast end-to-end
  sanity check
- Configuration, startup, routing, or dependency wiring can fail outside
  component tests
- Operators need an inexpensive post-change signal

The practice has limited use when:

- The proposed smoke path is the only proof for complex behavior, failure
  handling, or durability

## Guidance

Choose representative paths, exercise the real delivered shape, keep setup
repeatable, and say what remains outside the smoke signal.

- Choose one or a few representative high-value paths
- Exercise the produced artifact or deployed shape rather than a development
  shortcut
- Keep setup and cleanup reliable
- State what the smoke path does not cover

## Verification

Run against the intended subject, inspect meaningful output and cleanup, and
review how the result is described to decision makers.

- Run against the intended packaged or deployed subject
- Confirm the path observes meaningful output
- Exercise startup and cleanup
- Check that reporting does not present smoke success as comprehensive proof
