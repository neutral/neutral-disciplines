---
{"id":"discipline:go-engineering.dependency-direction"}
---
# Go dependency direction is visible: interfaces sit with their consumers and dependencies are passed in

Higher-level Go behavior stays separable from storage, transport and
framework mechanics when dependency direction is visible: interfaces sit with
the code that consumes them, each answers a real consumer need, and
dependencies are constructed at an explicit composition point instead of
being looked up from globals.

## Practice

Make dependency direction visible. Declare an interface in or beside the
package that consumes it, when a real consumer needs to substitute an
implementation or must not import it. Construct dependencies at a composition
point and pass them in, rather than reaching for package-level state,
registries or `init` side effects.

Without it, product rules become inseparable from the database driver or the
HTTP framework they happen to use, interfaces multiply that nothing
substitutes, and the real dependency graph is hidden in globals that tests
and readers cannot see.

## Applicability

Use this practice when:

- adding a dependency, interface, adapter, client, repository, transport or
  storage implementation;
- changing package imports across the project's architectural boundaries;
- introducing dependency injection, globals, registries or service locators.

It has limited use when a dependency update changes no import direction,
abstraction boundary or observable behavior. The project's libraries and
architecture are its own choice.

## Guidance

- Point dependencies from volatile mechanisms toward stable contracts when
  the project's design separates them.
- Define an interface for a consumer need that exists now, not for
  implementations that might come.
- Keep construction at an explicit composition point, and pass what a
  component needs through its constructor or parameters.
- Notice global state or hidden lookup that bypasses the visible dependency
  graph.

## Checks

### Check dependencies-passed-in

**Claim.** In a change that adds a dependency to code, such as a store, a
client or a clock, the dependency reaches the code that uses it through a
constructor, a parameter or a field set at the composition point.

**Holds when.** A registry the standard library requires, such as a
`database/sql` driver blank-imported at the composition point; or the
process's default logger, where the project uses it.

**Fails when.** The code reads a package-level `var db *sql.DB`, a global
client configured elsewhere, a service-locator lookup such as
`registry.Get("store")`, or a value another package's `init` registered; or a
constructor builds its own client from environment variables or a fixed
address instead of receiving it.

**Evidence.** Where each new dependency is created, and the path by which it
reaches its user.

**Limits.** Says nothing of whether an interface between the two is needed, or
where it should be declared.

**Applied by.** judgment
