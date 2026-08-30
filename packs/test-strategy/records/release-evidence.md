---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.release-evidence",
  "title": "Release Evidence Quality",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Keep release-facing evidence exact about subject, mechanism, result, freshness, provenance, and limitations.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["evidence", "release", "testing"],
  "spec": {
    "practice": "Judge release evidence by the exact claim and subject it supports, not by the prestige or volume of passing output.",
    "appliesWhen": ["Evidence informs a release, publication, deployment, migration, or other consequential decision", "Several test or review results must be reconciled", "A report could obscure stale, partial, skipped, or mismatched proof"],
    "doesNotApplyWhen": ["No release-facing or consequential decision relies on the result"],
    "guidance": ["Identify the exact tested revision, artifact, environment, and mechanism", "Separate pass, fail, not run, unsupported, and operational failure", "Carry limitations and unresolved gaps with the evidence", "Prefer a small complete mapping over a large unstructured transcript"],
    "verification": ["Reproduce subject and result identity", "Check freshness after the final relevant change", "Trace each material claim to supporting evidence", "Review skipped, unsupported, or failed items before reporting readiness"]
  }
}
---
# Release Evidence Quality

## Practice

Release evidence is useful when its exact subject, mechanism, result, freshness,
and limits remain visible to the decision maker.

## Applicability

Use this record when tests and reviews support release, deployment, publication,
migration, or another consequential decision.

## Guidance

Bind evidence to the real subject, preserve non-pass dispositions and gaps, and
favor an exact mapping over an impressive but ambiguous transcript.

## Verification

Reproduce identity and freshness, trace claims to evidence, and inspect every
skipped, unsupported, failed, or limited part before summarizing readiness.
