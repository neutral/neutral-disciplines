---
{"id":"discipline:go-engineering.fuzzing"}
---
# A Go fuzz target asserts a property, stays deterministic, and keeps what it finds as regression cases

Go's native fuzzing explores a broad input space only as well as the property
it checks. Fuzz where a meaningful property holds over many inputs, keep the
target deterministic and its seed corpus small, and turn every failure it
finds into a case the ordinary test run replays.

## Practice

State the property before writing the fuzz target, and assert it on every
input: a round trip, agreement with a reference, an invariant of the output,
or a defined error for invalid input. Make the target's outcome depend on
its input alone. Seed it with a few representative shapes, and keep each
failure it finds under `testdata/fuzz` or as a focused test.

Without it, a fuzz target that only asserts "no panic" runs for hours and
proves little, a failure found once cannot be reproduced because the target
read the clock or shared state, and a fixed defect returns because the
failing input `go test -fuzz` wrote under `testdata/fuzz` was never
committed.

## Applicability

Use this practice when:

- changing parsers, decoders, serializers, protocols, persistence formats or
  the handling of untrusted input;
- a broad input space makes example-only tests weak;
- an earlier defect suggests a property worth exploring with generated
  input.

It has limited use when no property can be stated beyond not panicking, or
when the subject is external or nondeterministic and has no boundary the test
can control.

## Guidance

- State the property before choosing the fuzz target.
- Keep the target deterministic, and isolate mutable package state from it.
- Use a small seed corpus of representative shapes, with `f.Add` or files
  under `testdata/fuzz/<FuzzName>`.
- Turn each important failure into a stable regression case that runs under
  plain `go test`: commit the input `go test -fuzz` writes under
  `testdata/fuzz/<FuzzName>`, or a focused test.
- Run campaigns with a bound such as `-fuzztime`, and leave the generated
  corpus in the fuzz cache rather than in the repository.

## Checks

### Check asserts-a-property

**Claim.** In a change that adds or alters a fuzz target, the target checks a
property of its subject's result that a wrong result would break, beyond the
absence of a panic.

**Fails when.** The target calls the subject and discards the result, as in
`_, _ = Parse(data)`; it checks only that some inputs return no error; it
checks something every wrong output also satisfies, such as a non-nil result
or a non-negative length; or it returns early on every error and no seed shows
valid input accepted, so a subject that rejects everything passes.

**Evidence.** The body of the target: what it does with the subject's result,
and its seeds.

**Limits.** Says nothing of whether the target is deterministic or its
findings are kept.

**Applied by.** judgment
