---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.table-driven-testing",
  "title": "Go Table-Driven Testing",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Use focused Go tests and tables where they clarify behavior, boundaries, and representative cases without hiding intent.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["go", "table-tests", "testing"],
  "spec": {
    "practice": "Choose test structure that makes the behavior under review and the differences between cases easy to see.",
    "appliesWhen": ["Adding or changing Go behavior, package boundaries, public APIs, commands, errors, or state transitions", "Several inputs share the same observable assertion shape", "A regression needs a small durable example"],
    "doesNotApplyWhen": ["A table would obscure materially different setup, behavior, or failure interpretation"],
    "guidance": ["Use tables for genuinely comparable cases rather than as a default ceremony", "Name cases by meaningful behavior or boundary", "Keep assertions close enough to failures that diagnostics remain useful", "Prefer public-style tests when the public contract is the subject and internal tests when internals genuinely matter"],
    "verification": ["Run focused package tests and the broader affected suite", "Review whether failures identify the case and violated behavior", "Check negative and boundary cases relevant to the change", "Confirm a regression test fails for the defect it is meant to preserve"]
  }
}
---
# Go Table-Driven Testing

## Practice

Test structure should make behavior and case differences obvious. Tables help
when cases share a shape; they hinder when they conceal distinct stories.

## Applicability

Use this record for behavior, API, command, error, package, and regression tests.
Choose another shape when cases need substantially different setup or meaning.

## Guidance

Name cases by behavior, keep diagnostics useful, and test from the boundary that
owns the claim. The target decides its coverage depth and suite organization.

## Verification

Run focused and affected suites, inspect failure clarity, and verify that a
regression test is sensitive to the defect it claims to catch.
