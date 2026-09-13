---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.proof-obligation-design",
  "status": "current"
}
---
# Proof Obligation Design

Frame proof around concrete claims, defect classes, freshness, and acknowledged
limits before choosing convenient commands.

## Practice

Start from the claims and failures that matter, then choose evidence capable of
distinguishing them.

Proof is clearer when it starts with an assessable claim and a relevant way for
that claim to be wrong, rather than with whatever command is easiest to run.

## Applicability

Use this record when work changes meaningful behavior, structure, state, or
boundaries and the target's existing Checks do not already settle the proof
approach.

Use this practice when:

- Work changes behavior, invariants, structure, interfaces, retained state, or
  important non-change claims
- Evidence adequacy is not obvious from an existing target-owned Check
- A costly, risky, or externally visible result needs a deliberate proof story

The practice has limited use when:

- The target already owns complete current proof obligations and the work only
  executes them without changing their meaning

## Guidance

Name material claims, likely defect classes, useful evidence, freshness, and
limits. A proof plan can stay proportionate without leaving its gaps implicit.

- State each important claim so a relevant defect could falsify it
- Connect evidence to the claim it supports rather than listing commands alone
- Notice excluded behavior and non-change claims that deserve inspection
- Record meaningful limitations or gaps instead of allowing a passing signal to
  imply more

## Verification

Review claim-to-evidence coverage, final-subject freshness, plausible missed
defects, and whether unresolved limitations remain visible.

- Review whether each material claim has evidence of a suitable kind
- Check that proof is fresh for the final subject
- Try to name a plausible defect that the proposed evidence would miss
- Confirm unresolved gaps remain visible to the decision owner
