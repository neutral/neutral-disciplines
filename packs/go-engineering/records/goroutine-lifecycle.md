---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.goroutine-lifecycle",
  "title": "Go Goroutine Lifecycle",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Give every goroutine, worker, timer, and channel a visible owner, stopping condition, and failure path.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["channels", "concurrency", "go", "goroutines", "shutdown"],
  "spec": {
    "practice": "Treat started goroutines as owned resources whose lifetime, errors, and shutdown can be explained and observed.",
    "appliesWhen": ["Starting goroutines, workers, timers, tickers, background loops, or pipelines", "Changing channel ownership, shutdown order, or worker failure handling", "Adding asynchronous caches, refreshers, watchers, or fan-out"],
    "doesNotApplyWhen": ["No asynchronous lifetime or coordination behavior changes"],
    "guidance": ["Name the component responsible for starting and stopping each long-lived goroutine", "Make channel close ownership unambiguous", "Avoid detached work whose errors and termination are invisible", "Prefer simple lifetime structures when concurrency adds little value"],
    "verification": ["Exercise normal completion, cancellation, and early failure", "Use leak-sensitive or bounded shutdown checks where lingering work is plausible", "Inspect channel ownership and close paths", "Run race detection when shared state or coordination changed"]
  }
}
---
# Go Goroutine Lifecycle

## Practice

Starting a goroutine creates a lifetime obligation. The code is easier to trust
when its owner, stopping condition, errors, and cleanup are visible.

## Applicability

Use this record for workers, timers, pipelines, watchers, refreshers, and other
asynchronous behavior. It adds little when no concurrent lifetime changes.

## Guidance

Make start and stop ownership explicit, keep channel closing unambiguous, and
avoid detached work that can fail or linger invisibly. Simpler synchronous
designs remain worth considering.

## Verification

Exercise completion, cancellation, and failure; inspect close paths; and use
race or leak-sensitive checks when the changed risks justify them.
