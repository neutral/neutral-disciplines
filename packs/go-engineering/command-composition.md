---
{"id":"discipline:go-engineering.command-composition"}
---
# A Go command's main parses and hands off, and one composition point owns wiring and lifecycle

A Go executable is easiest to reason about when its entrypoint only parses
input and starts an explicit composition point that builds dependencies,
reports readiness and owns shutdown. Keep startup failure, readiness,
background work and exit behavior visible there.

## Practice

Let `main` parse flags, environment and configuration, then hand off to one
composition function that constructs dependencies, checks them, starts the
work and stops it. Keep domain workflow in importable packages behind that
boundary, and let only `main` decide how the process exits.

Without it, executable wiring turns into application architecture: startup
failures surface at the first request instead of at start, background work
outlives shutdown, deferred cleanup is skipped by an early exit, and scripts
that read the command's output break when its wiring changes.

## Applicability

Use this practice when:

- changing a `main` function, command dispatch, startup or dependency wiring;
- adding a long-running process, worker, daemon or service command;
- changing readiness, shutdown or startup failure behavior.

It has limited use when the work is library-only and changes no executable or
its process lifecycle. The command framework and the process topology are the
project's choice.

## Guidance

- Keep domain workflow out of `main` and command packages when it can live
  behind a reusable boundary.
- Validate configuration and start required dependencies before accepting
  work, and fail with a message that names what is wrong.
- Give each piece of background work an owner that stops it, and give
  shutdown a deadline.
- Return errors to `main` and exit there; call `os.Exit` or `log.Fatal` only
  in `main`, after deferred cleanup has run.
- Keep command output and exit statuses stable when automation relies on
  them, and keep logs on stderr when stdout is read by scripts.

## Checks

### Check exit-only-in-main

**Claim.** In a change that adds or alters code of a command, no function
other than `main`, or `TestMain` in a test package, ends the process.

**Holds when.** A second interrupt signal, received after graceful shutdown
has begun, ends the process at once.

**Fails when.** Code outside `main` calls `os.Exit`, `log.Fatal`,
`log.Fatalf`, `log.Fatalln`, a logger's `Fatal` method or a helper that exits,
such as `cobra.CheckErr`.

**Evidence.** Every call in the changed code that can end the process, with
the function it is in.

**Limits.** Says nothing of whether `main` itself exits with every deferred
call run.

**Applied by.** judgment

### Check shutdown-waits-for-work

**Claim.** In a change that adds a long-running command, or alters how one
shuts down, SIGINT, SIGTERM or cancellation of the command's root context
stops new work, and the command exits only after the work it started has
finished or its shutdown deadline has passed.

**Holds when.** A second signal during shutdown ends the process at once.

**Fails when.** `main` returns while goroutines it started are still writing;
background work started during composition has no stop path; or the signal is
not handled, so the process dies in the middle of a write.

**Evidence.** The path from the signal to the process's exit, read with every
goroutine the command starts.

**Limits.** Says nothing of whether the shutdown has a deadline, or of the
exit status when the deadline cuts it off.

**Applied by.** judgment
