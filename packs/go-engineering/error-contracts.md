---
{"id":"discipline:go-engineering.error-contracts"}
---
# Go errors carry the identity callers branch on and the context readers need, and each is handled once

An error is part of a Go boundary when callers use it to retry, report,
recover or choose another path. Keep its identity, wrapping, classification
and handling intentional: expose identity only where callers need it,
preserve context without leaking secrets, and either return an error or handle
it, not both.

## Practice

Design errors around the decisions callers make with them. Make an error's
identity testable with `errors.Is` or `errors.As` where callers branch on it,
and keep identities callers should not depend on out of the contract. Wrap
with context that locates the failure, without secrets. Deal with each error
once: return it, or log, report or recover from it.

Without it, callers branch on message text that changes, a wrapped sentinel
stops matching, one failure is logged five times or not at all, and an error
message hands a password or token to whoever reads the logs.

## Applicability

Use this practice when:

- adding or changing returned errors, sentinels, typed errors, wrapping or
  classification;
- changing command or API failure behavior;
- adding retry, fallback, not-found, validation or conflict handling.

It has limited use when error behavior and how callers read it are unchanged.
The project owns its exact error taxonomy.

## Guidance

- Expose a stable error identity only when callers have a reason to branch
  on it.
- Wrap errors with `%w` to keep identity a caller may test, and with `%v`
  when the underlying error is an implementation detail callers must not
  depend on.
- Use `errors.Is` or `errors.As` when identity is part of the contract.
- Keep logging and returning separate, so that one failure is neither
  duplicated nor lost.
- Map error classes to distinct caller-visible statuses where callers see
  them.
- Linters such as errorlint and errcheck report many comparisons and dropped
  errors mechanically; run them where the project has them.

## Checks

### Check no-dropped-error

**Claim.** In a change that adds or alters code that receives an error, each
error it receives, including one an iterator reports through its `Err` method,
is returned, logged, reported or recovered from, or is knowingly discarded in
best-effort cleanup while another error is returned.

**Holds when.** The discarded call is a cleanup, such as `_ = tx.Rollback()`,
on a path that already returns another error, with a comment; or the call is
documented never to fail, such as `bytes.Buffer.Write` or `hash.Hash.Write`;
or it is `Close` on a file opened only for reading.

**Fails when.** `_ =` or an empty `if err != nil {}` drops an error while no
other error is being returned; a `return nil` in an error branch is no
deliberate recovery; `rows.Err()` or `scanner.Err()` is left unchecked after
the loop; `err` is shadowed with `:=` so the outer one stays nil; or `Close`
on a file the code wrote is unchecked.

**Evidence.** Every call in the changed code that returns an error, and what
is done with each.

**Limits.** Says nothing of whether the error that is returned carries the
identity and the context its callers need.

**Applied by.** judgment

### Check identity-tested-with-is-as

**Claim.** In a change that adds or alters code branching on which error it
received, a branch on the identity of an error that may be wrapped uses
`errors.Is`, `errors.As` or `errors.AsType`.

**Holds when.** It compares `err == io.EOF` on the result of a `Read`, whose
contract returns `io.EOF` itself.

**Fails when.** It compares `err == ErrNotFound` where the error may be
wrapped; uses a type assertion such as `err.(*fs.PathError)` or a type switch
on an error returned by another function; calls `os.IsNotExist`, `os.IsExist`
or `os.IsPermission`, which do not see through `fmt.Errorf` wrapping; or
matches `strings.Contains(err.Error(), ...)` or `err.Error() == ...`.

**Evidence.** Each comparison, type assertion or string match on an error in
the changed code, and where that error comes from.

**Limits.** Says nothing of whether the code that returns the error keeps the
identity it promises through its wrapping.

**Applied by.** judgment
