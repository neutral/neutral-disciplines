---
{"id":"discipline:go-engineering.local-harnesses"}
---
# A Go repository's recurring local tasks run from one stable entrypoint that checks its prerequisites and reports honestly

A local harness, such as a script, task runner, development command or proof
helper, makes recurring work easier only when it is scriptable, explicit about
what it needs, and honest about what a successful run establishes. Keep its
entrypoint stable, its prerequisites checked, its exit status truthful and
its development support apart from the product.

## Practice

Give each recurring local operation a stable, repository-native entrypoint.
Have it check its prerequisites and configuration before doing work, state
the working directory and environment it assumes, exit non-zero whenever a
step failed, say what it skipped, and clean up what it started so it can be
run again. Keep development-only support out of the product's runtime.

Without it, recurring work depends on commands copied from chat, a harness
fails halfway with a stack trace or writes to the wrong place when a variable
is unset, a pipeline hides a failed test behind a green exit, a second run
fails on what the first left behind, and debug helpers ship in the product.

## Applicability

Use this practice when:

- adding or changing Go-oriented scripts, task runners, development
  commands, local services or proof helpers;
- a recurring command depends on the working directory, environment, tools,
  containers or generated inputs;
- automation reads a harness's output or exit status.

It has limited use when a one-time investigation creates or changes no
durable repository command.

## Guidance

- Use a stable repository entrypoint, such as a `make` target, a task file
  or a `go run ./cmd/...` tool, for each recurring action.
- Check prerequisites and configuration first, and fail with a message that
  says what is missing and how to get it.
- Make working-directory and environment assumptions explicit; resolve
  paths from the repository root rather than the caller's directory.
- In shell scripts, stop on the first failure and keep a pipeline's failure
  visible, as `set -euo pipefail` does.
- Separate the product's operator behavior from development support.

## Checks

### Check exit-status-truthful

**Claim.** In a change that adds or alters a harness, such as a script, a
Makefile target or a task file, the harness exits 0 only when every step it
ran succeeded.

**Fails when.** `go test ./... | tee log` returns the status of `tee`; a loop
over packages exits with the status of its last iteration only; a step ends in
`|| true`; a failure is masked by `local x=$(cmd)` or by `set -e` not applying
inside a function called from an `if`; an error is caught and printed but the
exit status stays 0; or a step that timed out is counted as passed.

**Evidence.** Each step of the harness, and how its failure reaches the exit
status.

**Limits.** Says nothing of whether the harness reports what it skipped.

**Applied by.** judgment
