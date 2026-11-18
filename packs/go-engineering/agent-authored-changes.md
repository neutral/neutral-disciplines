---
{"id":"discipline:go-engineering.agent-authored-changes"}
---
# An agent's Go change is the smallest complete change that fits the code around it

Agents produce plausible Go quickly, and plausible code can invent packages,
abstractions and product decisions nobody asked for. Keep an agent-authored Go
change local, idiomatic, reviewable and proportionate to the request, and keep
what it could not decide visible.

## Practice

Make the smallest complete change that delivers the request, in the patterns
the surrounding code already uses. Leave out scaffolding the request does not
need, and hand the product, scope and authority choices the request leaves
open back to whoever owns them instead of settling them by convention.

Without it, a change grows by helpers, interfaces and options that look like
foresight, the review has to separate what was asked from what was invented,
and choices nobody made reach the product looking deliberate.

## Applicability

Use this practice when:

- an agent writes, restructures or reviews Go code;
- the request is open enough that plausible code could invent product or
  architecture choices;
- a large, mechanical-looking change may hide API, concurrency, error or
  package consequences.

It has limited use when no Go source or Go-facing generated file changes.

## Guidance

- Read the adjacent code and its tests before writing, and reuse the patterns
  they show for errors, logging, configuration, construction and tests.
- Prefer the smallest complete change to speculative helpers, interfaces or
  options; add an abstraction when its second real use arrives.
- Run gofmt, go vet and the focused tests as routine feedback. Formatting is
  the tool's job, not the reviewer's.
- Read the whole diff before handing it on, as a reviewer would, with its
  exported API, error, concurrency and package consequences.
- Write comments for intent a reader cannot see in the code, not to narrate
  the code.
- Return an unresolved product, authority or scope decision to its owner, or
  name the default you chose and why.

## Checks

### Check no-stubs-left

**Claim.** In a change that adds or alters Go code, the code the change calls
holds no placeholder where behavior should be.

**Holds when.** A deliberate no-op or null implementation, such as a no-op
logger, says so in its name or doc comment.

**Fails when.** A function the change calls returns a not-implemented error,
panics with `unimplemented`, holds only a `// TODO`, returns a fixed zero or
fake value unrelated to its inputs, or has an empty body where its name
promises work.

**Evidence.** Each function the change adds, and each it newly calls, read to
its body.

**Limits.** Says nothing of whether the behavior that is there is the right
one.

**Applied by.** judgment

### Check no-unrelated-edits

**Claim.** In any change, every hunk of the diff is part of what the change
adds or alters, or is needed because of it, such as an update to the callers
of a changed signature.

**Holds when.** gofmt or goimports reformats a file the change edits, or `go
mod tidy` or `go get` updates `go.mod` and `go.sum` as an import the change
adds requires.

**Fails when.** The diff also renames or restyles code it did not otherwise
need to touch, upgrades a dependency its code does not need, or rewrites
working code in another style, mixed in with the change.

**Evidence.** The diff, hunk by hunk, each held against what the change is
for.

**Limits.** Says nothing of whether the change is as small as it could be.

**Applied by.** judgment
