---
{"id":"discipline:go-engineering.public-api-contracts"}
---
# A Go package exports only what callers need, and documents what they may rely on

An exported Go identifier is more than visibility: once callers use it, it
becomes a durable expectation. Keep exported surfaces narrow, documented and
aligned with the behavior the project is prepared to support, and make every
break of an existing surface a deliberate decision.

## Practice

Export an identifier only when a caller outside its package needs it. Keep
implementation types out of exported signatures, and document the guarantees a
caller cannot read from the types, such as concurrency safety, ownership of
passed and returned values, zero-value behavior and testable errors. Weigh
compatibility before renaming or reshaping an exported surface, and make a
break of existing callers a decision the project's compatibility policy
allows, not a side effect.

Without it, local convenience becomes a public promise, callers build on a
driver or SDK type the package meant to hide, a type is used concurrently or
retained by a caller because nothing said not to, and a rename or added
interface method breaks downstream code nobody warned.

## Applicability

Use this practice when:

- adding or changing exported types, functions, methods, variables or
  constants;
- changing import paths, constructors, interfaces, errors, zero-value
  behavior or concurrency guarantees;
- moving implementation detail across a public boundary.

It has limited use when the change is a private implementation detail with
no effect on what callers can observe. Compatibility policy and exact API
promises are the project's decisions.

## Guidance

- Export only what a real caller needs; within one module, `internal`
  packages share code without making it public.
- Document non-obvious behavior: ownership, concurrency, errors and the zero
  value.
- Avoid exposing implementation types merely to simplify local wiring.
- Consider compatibility before renaming or reshaping a public surface; a
  tool such as `apidiff` or `gorelease` lists incompatible changes.
- Exercise a new public contract from an external test package or an
  `Example` function, the way a caller would use it.

## Checks

### Check compatible-or-deprecated

**Claim.** In a change that renames, removes or reshapes an exported
identifier of a non-internal package in a way that breaks existing callers or
implementers, the identifier keeps its old form, marked `// Deprecated:` with
the replacement named, unless the change moves the module to a new major
version's path or a compatibility policy the project states allows the break.

**Holds when.** The module is before v1, or no other module imports it, such
as a module that only builds commands.

**Fails when.** The change renames or removes an exported function, adds a
parameter, adds a method to an exported interface, changes a field's type, or
changes an error identity callers test for, with no deprecated old form kept,
no new major version and no stated policy that allows it.

**Evidence.** The exported identifiers of each non-internal package before and
after the change.

**Limits.** Says nothing of a change in behavior behind an unchanged
signature.

**Applied by.** judgment
