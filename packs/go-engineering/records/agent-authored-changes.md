---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.agent-authored-changes",
  "status": "current"
}
---
# Agent-Authored Go Changes

Keep agent-authored Go changes local, idiomatic, reviewable, and proportionate
to the requested result.

## Practice

Favor small explainable changes that fit existing Go conventions and expose
uncertainty instead of manufacturing architecture.

Fast code generation is most useful when the result remains small, idiomatic,
and easy for another engineer to explain. Uncertainty should stay visible.

## Applicability

Use this record whenever an agent authors or substantially restructures Go,
especially when the request leaves room to invent packages, APIs, or runtime
behavior.

Use this practice when:

- An agent writes, restructures, or reviews Go implementation
- The request is underspecified enough that plausible code could invent product
  or architecture choices
- A large mechanical-looking change may conceal API, concurrency, error, or
  package consequences

The practice has limited use when:

- No Go source or Go-facing generated artifact changes

## Guidance

Follow the local codebase, prefer the smallest complete change, and avoid
speculative scaffolding. Route product and scope choices back to their owner.

- Read adjacent code and tests before introducing a new local pattern
- Prefer the smallest complete change over speculative helpers or abstractions
- Use standard Go formatting and focused tests as routine feedback
- Return unresolved product, authority, or scope decisions instead of filling
  them with convention

## Verification

Inspect the whole diff, run routine Go feedback, and review package, API, error,
and concurrency consequences rather than trusting surface plausibility.

- Inspect the final diff for unrelated scaffolding and invented abstractions
- Run formatting, focused tests, and applicable static checks
- Review exported API, errors, concurrency, and package changes explicitly
- Confirm comments explain non-obvious intent rather than narrate syntax
