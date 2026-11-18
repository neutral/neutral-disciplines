---
{"id":"discipline:go-engineering.package-boundaries"}
---
# A Go package holds one responsibility, and only what other modules need is importable

A Go package is easiest to maintain when its responsibility, its visibility
and its import direction can be explained without reconstructing the whole
module. Shape each package around one coherent responsibility, keep
implementation support internal, and make each import direction deliberate.

## Practice

Give each package one responsibility a reader can state in a sentence, and
name it for that responsibility. Put code that other modules do not need to
import under `internal/`, and treat each new importable package as a
commitment to its callers. Resolve import cycles by moving a responsibility to
where it belongs, not by inventing a shared bucket.

Without it, `util` and `common` packages collect unrelated code that
everything imports, implementation details become public import paths other
modules depend on, placeholder packages imply an architecture nobody chose,
and cycles are papered over until no package can change alone.

## Applicability

Use this practice when:

- creating, moving, merging or splitting Go packages;
- changing module layout or import relationships;
- choosing between public, `internal`, `cmd`, generated and test-support
  locations.

It has limited use when a change is limited to formatting and keeps package
and import boundaries as they were. The project owns its exact package map
and naming.

## Guidance

- Prefer a package name that says what the package provides over a generic
  bucket.
- Use `internal` visibility when external modules do not need a stable
  import path; it is often the right default for implementation support.
- Let `cmd` and public package locations reflect real roles, not serve as
  generic bins.
- Avoid placeholder packages that imply an architecture before the project
  has chosen it.
- After moving or splitting packages, build and test from the module root as
  well as in the package, so importers elsewhere are checked too.

## Checks

### Check internal-unless-public

**Claim.** In a change that adds a Go package, or moves one, the package is
under an `internal/` directory unless its package doc comment says that other
modules may import it.

**Holds when.** The package is a `main` package, such as a command under
`cmd/`, which no other package can import; or the module is never imported by
other modules, such as a repository that only builds commands, and the project
chose not to use `internal/` there.

**Fails when.** A new implementation-support package sits at the module root
or under `pkg/` with no package doc saying it is public; test helpers that
only this module's tests use sit in an importable package; or a move makes a
package importable and its doc does not say so.

**Evidence.** The path of each package the change adds or moves, and its
package doc comment.

**Limits.** Says nothing of whether the package has one responsibility.

**Applied by.** judgment
