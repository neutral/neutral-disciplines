---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.context-cancellation",
  "title": "Go Context And Cancellation",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Carry request lifetime, deadlines, and cancellation through blocking work without using context as an ordinary parameter bag.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["cancellation", "context", "go", "io"],
  "spec": {
    "practice": "Propagate the active context through blocking or request-scoped work and make cancellation behavior deliberate at each boundary.",
    "appliesWhen": ["Adding I/O, remote calls, command execution, waits, retries, workers, or request handling", "Changing deadlines, shutdown, cancellation, or retry lifetime", "Introducing an API that accepts or derives context"],
    "doesNotApplyWhen": ["Work is a small pure computation with no cancellation or lifetime boundary"],
    "guidance": ["Pass context explicitly through request-scoped call chains", "Avoid storing context in long-lived structs or using context values for ordinary parameters", "Check cancellation around potentially blocking operations", "Decide which boundary owns timeout and retry policy instead of layering them accidentally"],
    "verification": ["Exercise cancellation and deadline expiration on representative blocking paths", "Inspect that downstream calls receive the active context", "Check for background contexts that sever caller lifetime unexpectedly", "Review cleanup after cancellation"]
  }
}
---
# Go Context And Cancellation

## Practice

Context is most useful as a visible carrier of request lifetime. Propagating it
consistently prevents work from quietly outliving its caller.

## Applicability

Use this record for I/O, waits, remote calls, retries, workers, request handling,
or shutdown. A pure computation with no lifetime boundary rarely needs it.

## Guidance

Pass the active context through the call chain, keep ordinary parameters out of
context values, and make timeout ownership explicit. The target decides its
actual deadlines and retry policy.

## Verification

Exercise cancellation and deadline paths, inspect downstream propagation, and
look for work or resources left behind after cancellation.
