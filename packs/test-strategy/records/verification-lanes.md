---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.verification-lanes",
  "status": "current"
}
---
# Verification Lanes

Separate fast feedback from deeper verification without letting the short lane
masquerade as complete confidence.

## Practice

Offer feedback at useful speeds while keeping each verification lane's scope and
limitations explicit.

Fast and deep verification can coexist when their purposes are explicit. Speed
is useful feedback, not evidence that omitted expensive checks passed.

## Applicability

Use this record when checks vary materially in duration, environment, or cost.
One complete fast suite does not need artificial lanes.

Use this practice when:

- Some useful checks are too slow or environment-heavy for every local iteration
- Local, continuous-integration, and release verification have different costs
- Developers need a stable fast route plus deeper confidence before a larger
  decision

The practice has limited use when:

- The complete relevant proof is already fast and reliable enough to run as one
  lane

## Guidance

Give recurring lanes stable meanings, keep deeper checks discoverable, and state
the confidence each lane does and does not provide.

- Keep a fast lane focused on common regressions
- Place expensive fuzz, integration, container, or endurance work in a clearly
  named deeper lane
- Document what each lane does and does not establish
- Avoid allowing a green fast lane to be reported as a green release gate

## Verification

Exercise lane entrypoints, inspect cleanup and assumptions, and confirm decision
reporting distinguishes partial feedback from the complete selected proof.

- Run each documented lane from its stable entrypoint
- Check that deep-only failures are visible in decision reporting
- Review timeouts, cleanup, and environment assumptions
- Inspect whether changed proof belongs in more than one lane
