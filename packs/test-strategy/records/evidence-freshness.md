---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.evidence-freshness",
  "status": "current"
}
---
# Evidence Freshness And Gaps

Recheck evidence after relevant subject changes and keep partial, stale,
unsupported, or infeasible proof visible.

## Practice

Treat evidence as support for one exact subject and reassess it when that
subject or a material dependency changes.

Evidence supports the subject it actually examined. Later changes and unresolved
proof gaps can make a previously useful result insufficient without changing
its historical truth.

## Applicability

Use this record when prior results may be reused, the final subject changed, or
some selected proof is incomplete, unavailable, or infeasible.

Use this practice when:

- Code, generated output, fixtures, configuration, schemas, dependencies, or
  environment change after evidence was produced
- A selected proof cannot run, is incomplete, or establishes only part of a
  claim
- Prior evidence may be reusable but equivalence needs review

The practice has limited use when:

- No prior evidence is being relied on and all selected proof is freshly
  produced for the final subject

## Guidance

Track invalidating changes, rerun when equivalence is unclear, distinguish
mechanism problems from product failures, and keep gaps explicit.

- Identify which changes can invalidate each result
- Rerun proof when subject equivalence is unclear
- Distinguish unavailable mechanisms from product failure
- Carry important gaps and their decision consequence explicitly

## Verification

Compare exact subjects, inspect post-result changes and reuse rationale, and
confirm gaps remain visible in the final decision context.

- Compare evidence subject and final subject identities
- Inspect changes after each result was produced
- Review any reuse rationale and its limitations
- Confirm gaps are visible rather than converted into implied passes
