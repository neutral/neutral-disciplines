---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.agent-authored-changes",
  "title": "Agent-Authored Go Changes",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Keep agent-authored Go changes local, idiomatic, reviewable, and proportionate to the requested result.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["agents", "go", "maintainability", "review"],
  "spec": {
    "practice": "Favor small explainable changes that fit existing Go conventions and expose uncertainty instead of manufacturing architecture.",
    "appliesWhen": ["An agent writes, restructures, or reviews Go implementation", "The request is underspecified enough that plausible code could invent product or architecture choices", "A large mechanical-looking change may conceal API, concurrency, error, or package consequences"],
    "doesNotApplyWhen": ["No Go source or Go-facing generated artifact changes"],
    "guidance": ["Read adjacent code and tests before introducing a new local pattern", "Prefer the smallest complete change over speculative helpers or abstractions", "Use standard Go formatting and focused tests as routine feedback", "Return unresolved product, authority, or scope decisions instead of filling them with convention"],
    "verification": ["Inspect the final diff for unrelated scaffolding and invented abstractions", "Run formatting, focused tests, and applicable static checks", "Review exported API, errors, concurrency, and package changes explicitly", "Confirm comments explain non-obvious intent rather than narrate syntax"]
  }
}
---
# Agent-Authored Go Changes

## Practice

Fast code generation is most useful when the result remains small, idiomatic,
and easy for another engineer to explain. Uncertainty should stay visible.

## Applicability

Use this record whenever an agent authors or substantially restructures Go,
especially when the request leaves room to invent packages, APIs, or runtime
behavior.

## Guidance

Follow the local codebase, prefer the smallest complete change, and avoid
speculative scaffolding. Route product and scope choices back to their owner.

## Verification

Inspect the whole diff, run routine Go feedback, and review package, API, error,
and concurrency consequences rather than trusting surface plausibility.
