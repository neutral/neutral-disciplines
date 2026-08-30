---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.integration-testing",
  "title": "Integration Testing",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Exercise behavior that emerges only across process, storage, network, daemon, or service boundaries with explicit custody and cleanup.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["containers", "integration", "services", "testing"],
  "spec": {
    "practice": "Use integration tests for claims that depend on real boundary interaction rather than substituting mocks for the subject being proved.",
    "appliesWhen": ["Behavior depends on databases, object stores, queues, daemons, networks, filesystems, multiple processes, or service composition", "Startup, readiness, cleanup, or version compatibility matters", "A unit test cannot observe the material boundary"],
    "doesNotApplyWhen": ["The claim is completely owned by an isolated component and external mechanisms add no relevant behavior"],
    "guidance": ["Name the real boundary the test is intended to cover", "Keep environment construction and version selection explicit", "Exercise representative failure and not-ready behavior as well as success", "Own temporary resources and cleanup so runs are repeatable"],
    "verification": ["Run from a clean environment using the documented route", "Inspect actual dependency versions and configuration", "Exercise at least one material cross-boundary failure when relevant", "Check teardown, leftover state, and rerun behavior"]
  }
}
---
# Integration Testing

## Practice

Integration tests are valuable when the claim exists at a real boundary that an
isolated component or mock cannot establish.

## Applicability

Use this record for databases, object stores, queues, daemons, networks,
filesystems, multiple processes, and service composition. Skip it when the claim
is fully local and the external mechanism adds no relevant behavior.

## Guidance

Name the boundary, make environment and versions visible, include useful
failure behavior, and give resources an explicit cleanup owner.

## Verification

Run cleanly, inspect effective dependencies, exercise a meaningful boundary
failure where appropriate, and check teardown and rerun behavior.
