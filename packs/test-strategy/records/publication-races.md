---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.publication-races",
  "title": "Publication Race Testing",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Exercise concurrent publication, compare-and-swap, lease, rename, and visibility boundaries with controlled ordering.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["concurrency", "publication", "race", "testing"],
  "spec": {
    "practice": "Test publication and ownership races by controlling order around the decisive boundary rather than hoping timing exposes them.",
    "appliesWhen": ["Changing compare-and-swap, leases, locks, atomic rename, current-pointer updates, deduplication, or canonical publication", "Two actors can contend for one visible result", "Readers can observe a transition between private and published state"],
    "doesNotApplyWhen": ["No concurrent ownership, publication, or visibility boundary changes"],
    "guidance": ["Identify the exact decision or visibility boundary", "Use barriers or hooks to create meaningful interleavings", "Check loser behavior and cleanup as well as winner success", "Distinguish atomic visibility from eventual background cleanup"],
    "verification": ["Run controlled competing operations", "Inspect that at most the intended result becomes current", "Check stale-owner, loser, retry, and cleanup behavior", "Repeat the scenario without relying on arbitrary sleeps"]
  }
}
---
# Publication Race Testing

## Practice

Publication races become reviewable when tests control the decisive ordering
instead of depending on scheduler luck.

## Applicability

Use this record for leases, compare-and-swap, locks, atomic rename, current
pointers, deduplication, and competing publishers.

## Guidance

Identify the exact ownership or visibility boundary, arrange useful
interleavings, and inspect both winner and loser behavior. The target owns the
actual consistency model.

## Verification

Run controlled contention, check the visible result and stale-owner response,
and verify cleanup without sleep-driven timing assumptions.
