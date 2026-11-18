---
{"id":"discipline:go-engineering.goroutine-lifecycle"}
---
# Every goroutine a Go change starts has an owner that stops it, waits for it and hears its errors

Starting a goroutine creates a lifetime obligation. Give every goroutine,
worker, timer and channel a visible owner, a stopping condition and a failure
path, so that its lifetime, errors and shutdown can be explained and
observed.

## Practice

Treat each started goroutine as a resource owned by the component that
started it. The owner can stop it, waits for it to finish before its own
shutdown returns, and receives its errors. Each channel is closed by the one
party that knows no more values will be sent. Prefer a synchronous design
when concurrency adds little.

Without it, goroutines leak, blocked forever on a channel nobody reads after
an early return; workers keep writing after shutdown has closed what they
write to; errors from background work vanish into a log line nobody acts on;
and a second close panics the process.

## Applicability

Use this practice when:

- starting goroutines, workers, timers, tickers, background loops or
  pipelines;
- changing channel ownership, shutdown order or worker failure handling;
- adding asynchronous caches, refreshers, watchers or fan-out.

It has limited use when no asynchronous lifetime or coordination changes.

## Guidance

- Name the component responsible for starting and stopping each long-lived
  goroutine.
- Make channel close ownership unambiguous: the sender closes, receivers
  never do.
- Avoid detached work whose errors and termination are invisible; an
  `errgroup.Group` or a `sync.WaitGroup` with an error channel gives the
  owner both.
- Stop tickers and timers the change creates when their owner stops, and do
  not expect `Stop` to end a `for range ticker.C` loop: it does not close the
  channel.
- Prefer a simple lifetime structure when concurrency adds little value.

## Checks

### Check every-goroutine-stops

**Claim.** In a change that starts a goroutine, every goroutine it starts ends
when its owner stops it, through context cancellation, a closed channel or the
end of finite work, on every path including early returns.

**Holds when.** A goroutine that `main` starts lives as long as the process,
such as one waiting for a signal.

**Fails when.** A `for { ... }` loop has no `ctx.Done()` case; a `for range
ticker.C` loop is expected to end on `ticker.Stop()`, which does not close the
channel; a loop checks `ctx.Done()` but blocks in `Accept`, `Read` or `Wait`
that nothing interrupts on stop; a worker blocks forever sending on an
unbuffered channel after its receiver returned on the first error; or a
goroutine waits on a channel that no path closes.

**Evidence.** Each `go` statement the change adds, followed to every place its
function can block and to what unblocks it on stop.

**Limits.** Says nothing of whether the owner waits for the goroutine to exit.

**Applied by.** judgment

### Check errors-reach-owner

**Claim.** In a change that starts a goroutine whose work can fail, an error
in it reaches the code that owns it, through a returned error from a group, an
error channel the owner reads, or a supervisor that acts on it.

**Holds when.** A loop that retries on its next run logs each failure, and a
comment says no other action is wanted.

**Fails when.** `go func() { if err := work(); err != nil { log.Println(err) }
}()` reports a failure no code acts on; `g.Wait()` is called and its error
discarded; errors are sent to a channel nobody reads, blocking the sender; or
a failed worker is treated as finished successfully.

**Evidence.** Each error the new goroutine's function can produce, followed to
the code that acts on it.

**Limits.** Says nothing of what the owner then does with the error.

**Applied by.** judgment
