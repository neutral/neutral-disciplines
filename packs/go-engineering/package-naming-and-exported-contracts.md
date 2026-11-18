---
{"id":"discipline:go-engineering.package-naming-and-exported-contracts"}
---
# Go package and exported names read naturally at the call site, and exported contracts are documented and hard to misuse

Names shape how a Go package is understood at every call site. Package
qualifiers, exported identifiers, receivers, documentation, error text and
result shapes work together as one caller-facing surface: keep it idiomatic,
documented and resistant to misuse.

## Practice

Choose package and exported names that read well together with their
qualifier, as in `user.Store` rather than `user.UserStore`. Case initialisms
consistently, keep receiver names short and the same across a type's methods,
document what a caller needs beyond the signature, write error text that
composes when callers add context, and return failure through an `error` or
`ok` result rather than an in-band value.

Without it, call sites stutter, names carry another language's conventions
into Go, documentation repeats identifiers while units and special cases go
unsaid, wrapped error messages read badly, and callers use a `-1` or an empty
string as if it were a real result.

## Applicability

Use this practice when:

- naming or renaming Go packages, exported types, functions, methods,
  constants, variables, receivers or errors;
- adding a public Go contract or changing how callers use an exported
  identifier;
- generated or agent-authored Go introduces identifiers that may carry
  conventions from another language.

It has limited use when no package name, exported identifier, receiver,
caller-visible error text or result contract changes.

## Guidance

- Use short, lower-case package names that read naturally as import
  qualifiers, with no underscores or mixed caps.
- Avoid exported-name stutter when the package qualifier already supplies
  the noun.
- Keep initialisms such as ID, URL, HTTP, JSON and API in one case.
- Use short receiver names that reflect the receiver's type and stay the
  same across its methods.
- Write doc comments around caller meaning and special cases rather than
  repeating the identifier.
- Keep error text lower-case and without trailing punctuation, so that it
  composes when callers add context.
- Prefer an additional `error` or `ok` result to an in-band value that makes
  invalid use easy.
- Let a linter decide the mechanical rules: staticcheck's ST1003, ST1005,
  ST1006 and ST1016, or the matching revive rules, report package and
  initialism casing, error-string form, `this` or `self` receivers and
  receiver names that differ across a type's methods; revive's `exported`
  rule also reports a name that begins with its package's name. Some of these
  are off in staticcheck's default configuration, so enable them where the
  project runs it.

## Checks

### Check no-in-band-failure

**Claim.** In a change that adds a function that can fail, or that can find
nothing where an empty or zero result is also a valid found value, the
function reports that through a separate `error` or `ok` result.

**Holds when.** The function keeps a convention its callers already rely on,
such as `-1` for a position not found, as `strings.Index` returns, or a nil
pointer for not found where nil is never a valid result, as `flag.Lookup`
returns.

**Fails when.** A function returns `-1` for a record it could not find, `""`
for a missing setting whose value may be empty, a nil map for a failed load,
or a zero `time.Time` to mean unset where the zero time is also valid; or it
returns a struct with an `Err` field that callers must remember to check.

**Evidence.** The signature of each function the change adds, and each value
it returns on failure or on finding nothing.

**Limits.** Says nothing of whether callers check the result.

**Applied by.** judgment
