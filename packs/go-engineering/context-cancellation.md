---
{"id":"discipline:go-engineering.context-cancellation"}
---
# Go code that blocks takes its caller's context and stops when it is cancelled

A `context.Context` carries a request's lifetime: its deadline and its
cancellation. Pass the active context through every blocking or
request-scoped call, make each boundary's cancellation behavior deliberate,
and do not use the context as a bag for ordinary parameters.

## Practice

Accept a context as the first parameter of any function that blocks or does
request-scoped work, and pass that same context to the blocking calls it
makes. Return promptly with the context's error when it is cancelled. Detach
work from a caller's lifetime only on purpose, and decide at one boundary
which code owns each timeout and retry policy.

Without it, work quietly outlives its caller: a cancelled request keeps
querying the database, a shutdown waits on a call that never ends, and
nested timeouts and retries multiply into a total nobody chose.

## Applicability

Use this practice when:

- adding I/O, remote calls, command execution, waits, retries, workers or
  request handling;
- changing deadlines, shutdown, cancellation or retry lifetime;
- introducing an API that accepts or derives a context.

It has limited use when the work is a small pure computation with no
cancellation or lifetime boundary. The actual deadlines and retry policy are
the project's choice.

## Guidance

- Pass the context explicitly through request-scoped call chains, and use
  the context-taking form of each library call, such as `QueryContext`,
  `NewRequestWithContext` or `exec.CommandContext`.
- Do not store a context in a long-lived struct, and do not carry ordinary
  parameters in context values.
- Check cancellation around operations that may block, with a
  `case <-ctx.Done()` in every `select` that can wait.
- Decide which boundary owns timeout and retry policy instead of layering
  them by accident.
- Run go vet: it reports a cancel function from `context.WithCancel` or
  `context.WithTimeout` that is never called.

## Checks

### Check context-reaches-blocking-calls

**Claim.** In a change that adds or alters a call on a path that has a
context, each such call to a function that has a context-taking form uses that
form, with that context or one derived from it.

**Holds when.** The work is deliberately detached from the caller's
cancellation, with a comment saying why.

**Fails when.** A function that receives `ctx` calls `http.Get`,
`http.NewRequest` then `Do`, `db.Query`, `db.Exec` or `db.Begin` instead of
their context forms, `exec.Command` instead of `exec.CommandContext`,
`net.Dial` instead of a dialer's `DialContext`, `time.Sleep`, or a client
method without `ctx`; or it starts a goroutine for request work without
passing it the context.

**Evidence.** Each call the change adds or alters inside a function that
receives a context, and the form of the callee it uses.

**Limits.** Says nothing of whether the callee stops promptly when the context
is cancelled.

**Applied by.** judgment
