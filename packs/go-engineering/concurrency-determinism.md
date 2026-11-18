---
{"id":"discipline:go-engineering.concurrency-determinism"}
---
# Shared state in Go has a named synchronization owner, and required order is enforced, not assumed

Go concurrency is easier to trust when every piece of shared mutable state
has one visible synchronization mechanism and every order the code depends on
is enforced by synchronization rather than by timing. Make both explicit, and
test the concurrency properties that matter without sleeps.

## Practice

For each value more than one goroutine touches, name what guards it: a mutex,
an atomic, a channel handoff, or confinement to one goroutine. Separate the
orders correctness needs from the orders the scheduler happens to produce,
and enforce the first with synchronization. Add concurrency only where it buys
something sequential code would not.

Without it, data races and order-dependent results pass on the author's
machine and fail under load, on another CPU count or in CI, and the code
cannot be reviewed because its synchronization model exists only in the
author's head.

## Applicability

Use this practice when:

- changing shared maps, slices, pointers, caches, counters, status fields,
  channels, locks or atomics;
- adding parallelism, or behavior that depends on ordering;
- changing retry, publication, snapshot or coordination paths;
- producing output whose order callers or tests compare.

It has limited use when the changed code runs in one goroutine and has no
shared-state or ordering consequence.

## Guidance

- Name the synchronization owner of mutable shared state, in a comment on
  the field or the type when it is not obvious.
- Separate required determinism from incidental scheduling order, including
  the order of map iteration.
- Prefer simpler coordination when parallelism gives no material benefit.
- Run the affected packages' tests with `-race`, which needs cgo on most
  platforms, and drive the interleavings that matter with channels, barriers
  or hooks instead of sleeps.
- Run go vet: its copylocks and waitgroup analyzers report a copied mutex and
  a misplaced `WaitGroup.Add`.

## Checks

### Check shared-state-guarded

**Claim.** In a change that adds or alters a variable two or more goroutines
access, at least one of them writing, the variable is guarded by one
mechanism, and every access to it happens under that mechanism.

**Holds when.** The value is written only before its readers start, or before
a channel send, `WaitGroup.Wait` or `sync.Once` that publishes it, and never
written after.

**Fails when.** A map or slice is written by one goroutine and read by a
handler without a lock; a field is read under a mutex in one method and bare
in another; a value read under the lock is written back under a second hold of
it, so an update between them is lost; a write happens under `RLock`; a getter
returns the guarded map or slice itself; or a counter is incremented with `++`
from several goroutines.

**Evidence.** Every read and write of the variable in the code as the change
leaves it, with the lock or channel each happens under.

**Limits.** Reads the accesses a judge can find. It is no substitute for the
race detector, and it says nothing of an order between goroutines that the
code assumes.

**Applied by.** judgment

### Check tests-coordinate-without-sleep

**Claim.** In a change that adds a test of concurrent behavior, the test waits
on events, such as channels, barriers, hooks, a controllable clock or
`synctest.Wait`, and not on real elapsed time.

**Holds when.** The test runs inside a `testing/synctest` bubble, where
`time.Sleep` advances the bubble's fake clock.

**Fails when.** A test calls `time.Sleep` to let a goroutine run or to wait
for a result; it polls with a fixed sleep and no condition; or it passes only
when the machine is fast enough and fails under `-count=100` or `-race`.

**Evidence.** How each new test waits for the thing it then asserts.

**Limits.** Says nothing of whether the test forces the interleaving its
outcome depends on.

**Applied by.** judgment
