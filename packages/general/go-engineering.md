# Go Engineering

```yaml
package_id: neutral.go-engineering
name: Go Engineering
version: 0.1.0
source_type: organization
discipline: go-engineering
scope: Go module and package boundaries, command shells, public and internal surfaces, dependency direction, context and cancellation, goroutine lifecycle, error contracts, testing, fuzzing, and agent-authored Go implementation guardrails
status: current
provenance: Neutral production seed derived from general Go backend needs, official Go guidance, and agent-authored implementation risk
surface_id: neutral.go-engineering
surface_install_path: surfaces/neutral/go-engineering.md
retrieval_slices:
  - go-module-and-package-boundaries
  - command-shell-and-composition-root
  - public-api-and-internal-surface
  - package-naming-and-exported-contracts
  - dependency-direction-and-interface-placement
  - context-and-cancellation
  - goroutine-lifecycle-and-shutdown
  - error-contracts-and-wrapping
  - testing-and-table-driven-proof
  - fuzzing-and-corpus-discipline
  - concurrency-race-and-determinism-proof
  - agent-authored-go-guardrails
  - local-harness-and-tooling
  - generated-code-and-artifact-boundaries
  - product-boundary
binding_ids:
  - neutral.go-engineering.binding
```

## Purpose

Use this package when work asks an agent to write, review, scaffold, or
restructure Go backend code.

The package supplies reusable judgment for Go implementation boundaries:
module layout, package ownership, `cmd` shells, `internal` visibility, public
surface restraint, dependency direction, context and cancellation, goroutine
lifetime, error contracts, testing, fuzzing, generated artifacts, and
agent-safe coding habits. It does not decide the target product's exact
package map, command names, service families, storage adapters, CLI library,
logging library, database library, or release gates.

This package is intentionally narrower than a general Go style guide. It
focuses on places where agents commonly produce plausible Go that is hard to
maintain, hard to prove, or subtly unsafe: generic package buckets,
implementation leakage through exported APIs, unowned goroutines, sloppy
context propagation, accidental error API commitments, thin tests, unbounded
fuzzing, data races, and hidden harness behavior.

## Source Basis

External source basis for this package is official Go material:

- [Organizing a Go module](https://go.dev/doc/modules/layout)
- [Go Fuzzing](https://go.dev/doc/security/fuzz/)
- [Go Concurrency Patterns: Context](https://go.dev/blog/context)
- [Go Concurrency Patterns: Pipelines and cancellation](https://go.dev/blog/pipelines)
- [Working with Errors in Go 1.13](https://go.dev/blog/go1.13-errors)
- [Package errors](https://go.dev/pkg/errors/)
- [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments)
- [Effective Go](https://go.dev/doc/effective_go)
- [Go Doc Comments](https://go.dev/doc/comment)

Local source basis for this package includes current and prior Go needs:

- thin executable shells and explicit runtime composition roots
- narrow public package surface for stable contracts
- implementation packages hidden behind `internal`
- role-named service families instead of generic utility buckets
- platform and storage namespaces with clear responsibilities
- correctness-critical core packages kept smaller than runtime shells
- one canonical writer, snapshot readers, and explicit versioned reads
- fuzz smoke and deep lanes with source-local targets and small seed corpora
- scriptable harnesses with explicit config, diagnostics, and proof lanes

The local examples are source basis only. They are not required package names,
product architecture, or durable target topology unless a target semantic
authority record admits them.

## Applies To

- Go modules, packages, imports, package splits, package moves, public exports,
  `cmd`, `internal`, `pkg`, test package, and generated-code placement
- command shells, service startup, composition roots, config loading,
  dependency wiring, shutdown, local harnesses, and task runners written in Go
  or wrapping Go commands
- Go API surfaces where exported names, errors, contexts, concurrency
  guarantees, zero values, examples, or doc comments become caller contract
- goroutines, channels, workers, timers, background loops, cancellation,
  deadlines, shutdown, and lifecycle ownership
- parser, codec, persistence, runtime, API, security, or untrusted-input Go
  code that requires stronger test, fuzz, race, or determinism proof
- agent-authored Go where the implementation is likely to be generated faster
  than a human would naturally notice boundary, concurrency, or API risks

## Does Not Apply To

- non-Go implementation work unless the work changes a Go wrapper, generated Go
  client, Go harness, or Go command surface
- product decisions about which services, commands, APIs, storage adapters, or
  proof features the target should expose
- exact release gates, CI cadence, fuzz durations, command names, package names,
  or dependency choices when those are target-specific
- API contracts, observability, or UX experience by themselves; select the
  owning discipline package for those details and use this package only for
  Go-specific implementation consequences
- superficial formatting that `gofmt` or `goimports` can repair and that has
  no package, export, test, runtime, or proof effect

## Discipline Concepts

### Go Module And Package Boundaries

Use this slice when work creates, moves, splits, exports, or imports Go
packages.

Go package boundaries should preserve:

- a package as a cohesive responsibility, not a layer label or dumping ground
- the smallest public import surface that serves a real external caller
- implementation support under `internal` by default when external modules
  should not depend on it
- `cmd` directories only for executable commands and thin shell concerns in
  mixed command-plus-library repositories
- `pkg` directories only when the target intentionally offers stable importable
  packages; `pkg` is not a privacy boundary and is not a general place to put
  "shared" code
- no placeholder packages for future features before a target authority or Work
  Boundary admits them
- import direction that can be drawn and explained before code lands
- package-level tests and examples close to the package they prove

Product judgment effects:

- Decide whether a new package is stable public contract, implementation
  support, executable shell, adapter, generated output, or test support.
- Decide whether package names and imports reflect product meaning or only
  implementation responsibility.
- Decide whether a proposed split reduces complexity or creates accidental
  architecture.

Adequate proof:

- import-boundary inspection for every new or moved package
- no external import dependency on implementation-only packages
- no generic package names unless a target semantic authority explicitly
  narrows their meaning
- package comments or examples for exported packages when they are public
- tests still run from repo root and from the changed package scope

Common failure modes:

- `cmd` owns workflow logic instead of delegating to an internal composition
  root
- `pkg` becomes a dumping ground for code that is not actually stable public
  contract
- `internal/platform` or similar support packages absorb product behavior
- packages named `common`, `shared`, `helpers`, `util`, `api`, `types`, or
  `interfaces` hide unclear ownership
- agents create empty packages for future plans and make the package map look
  more settled than it is

### Command Shell And Composition Root

Use this slice when work touches `main`, `cmd`, command dispatch, startup,
service assembly, dependency wiring, or process lifecycle.

Command shells should preserve:

- thin `main` functions that delegate after parsing and bootstrap
- a composition root that owns dependency construction, config wiring,
  lifecycle, and shutdown
- no product workflow, persistence behavior, retry policy, or service logic in
  command packages
- one configuration and observability foundation shared by one-shot and
  long-running commands
- startup that can fail before accepting work when dependencies or config are
  invalid
- shutdown that is explicit, bounded, and testable
- machine-friendly behavior for automation where command output is used by
  agents or CI

Product judgment effects:

- Decide whether a command is product behavior, local support, test harness,
  admin control, or packaging convenience.
- Decide where runtime dependency ownership lives.
- Decide which command outputs become stable caller or operator contract.

Adequate proof:

- command or startup test for wiring when composition changes
- config precedence and invalid-config tests when config changes
- cancellation or signal-driven shutdown test when long-running behavior
  changes
- stdout/stderr and structured-output checks when automation depends on output
- proof that command package delegates instead of owning domain workflow

Common failure modes:

- command dispatch grows into application architecture
- `go run ./cmd/...` works only because hidden working-directory assumptions
  happen to be true
- command output mixes logs with structured results
- startup launches workers before readiness and dependency checks are complete
- one-shot commands spawn detached background work

### Public API And Internal Surface

Use this slice when exported Go names, package paths, constructors, errors,
interfaces, examples, or doc comments become caller-facing API.

Public Go surfaces should preserve:

- exported names only when callers outside the package need them
- package comments for public packages and doc comments for exported names
- zero-value behavior documented when it matters
- concurrency safety documented only when a type promises more than ordinary
  single-goroutine instance use
- no storage, runtime, database, or implementation detail leaked through public
  constructors, errors, interfaces, or type names unless that detail is part of
  target contract
- examples or small client-like tests for non-trivial public packages
- stable semantic names rather than transport, adapter, or temporary project
  names

Product judgment effects:

- Decide which exported names are stable target API and which should remain
  unexported or internal.
- Decide whether a type's zero value, concurrency behavior, error values, or
  examples create durable product meaning.
- Decide when a public surface requires target semantic authority before code
  can land.

Adequate proof:

- public export review for every changed package
- compile and test from an external test package when public usage should be
  proven as a caller would use it
- doc-comment review for exported names
- example or smoke usage for important public contracts
- no public imports from `internal`

Common failure modes:

- exporting names because tests or other packages want access to internals
- returning implementation-specific concrete errors through public APIs
- documenting behavior in tests only, leaving callers with no package contract
- public type names repeat the package name and produce stuttering APIs
- advanced agents add public interfaces before a real consumer exists

### Package Naming And Exported Contracts

Use this slice when naming packages, exported types, functions, methods,
constants, or errors.

Go naming and exported contracts should preserve:

- lower-case package names that read naturally as import qualifiers
- no stuttering exported names where the package qualifier already supplies the
  noun
- initialisms such as ID, URL, HTTP, JSON, and API with consistent casing
- short receiver names that reflect the receiver identity
- exported names with doc comments that tell callers what the symbol provides
  and any special cases that affect use
- error strings that compose cleanly with caller-provided context
- no in-band error values when an additional `error` or `ok` result would make
  invalid use impossible
- names that reveal responsibility instead of implementation fashion

Product judgment effects:

- Decide whether a name is merely local implementation language or visible
  target contract.
- Decide whether a vague package name indicates missing product or
  architecture authority.
- Decide whether a name should be deferred until the target has admitted the
  concept it would freeze.

Adequate proof:

- exported-symbol review
- package-name review for stutter and vagueness
- doc-comment review for public packages and exported names
- example or test proving intended caller use when a public contract is new

Common failure modes:

- `types` means "anything with a struct" instead of a narrowly scoped value
  package
- `interfaces` exists before any consumer needs an interface
- generated or agent-written identifiers use Java, TypeScript, or database
  naming conventions instead of Go naming
- doc comments repeat names without adding contract meaning
- package names hide unstable target decisions behind generic words

### Dependency Direction And Interface Placement

Use this slice when work introduces new dependencies, interfaces, adapters,
storage boundaries, platform support, or cross-package collaboration.

Dependency direction should preserve:

- high-level product workflow independent of concrete storage, transport, and
  runtime adapters when those adapters are replaceable details
- storage and platform support packages that do not import service-family or
  product workflow packages
- interfaces defined by the package that consumes behavior, not automatically
  by the package that implements it
- concrete types returned by implementor packages unless public abstraction is
  a real contract
- test seams that are narrower than whole subsystems
- dependency injection at composition boundaries instead of hidden package
  globals
- acyclic imports that match the target ownership graph

Product judgment effects:

- Decide where collaboration is product contract versus local implementation
  seam.
- Decide whether a proposed interface is needed now or is speculative
  architecture.
- Decide whether a new dependency requires promotion into target semantic
  authority, security review, or runtime proof.

Adequate proof:

- import graph or targeted import inspection for new package families
- tests proving collaboration through the intended seam
- no service-family imports from storage adapters
- no implementor-side interface created only for mocks
- no hidden global dependency that bypasses the composition root

Common failure modes:

- agents create interfaces for every struct before any consumer exists
- storage packages import workflow packages to "reuse" types
- platform support grows product rules
- mocks drive public API shape instead of real callers
- cyclic imports are resolved by moving everything into a generic package

### Context And Cancellation

Use this slice when work adds I/O, request handling, command execution,
workers, dependency calls, deadlines, retries, shutdown, or cancellation.

Context use should preserve:

- `context.Context` passed explicitly as the first parameter for operations
  that are request-specific, command-specific, I/O-bound, cancellable, or
  deadline-aware
- no `Context` stored in long-lived structs except where required by an
  external interface
- no custom context interfaces or custom context types in function signatures
- no context values for ordinary parameters, dependencies, optional settings,
  or product data
- derived contexts canceled by the owner that created them
- deadline and cancellation checked before starting expensive or blocking work
- cancellation propagated to downstream I/O and goroutines

Product judgment effects:

- Decide whether an operation is request-scoped, process-scoped, or pure local
  computation.
- Decide which cancellation path owns stopping work and which path only
  observes cancellation.
- Decide whether a context value is truly cross-cutting request metadata or a
  disguised parameter.

Adequate proof:

- cancellation test for changed cancellable operations
- deadline or timeout test where I/O or blocking work changed
- no context stored in newly changed structs unless explicitly justified
- no `context.Background()` below the composition or test boundary without
  reason
- downstream dependency calls receive the active context

Common failure modes:

- agents add `context.Background()` inside libraries to make code compile
- context is used as a hidden parameter bag
- long-running code ignores cancellation until after expensive work finishes
- shutdown cancels parent work from inside a child operation
- tests pass because they never assert cancellation behavior

### Goroutine Lifecycle And Shutdown

Use this slice when code starts goroutines, uses channels, timers, workers,
background loops, watchers, subscribers, or long-running service tasks.

Goroutine lifecycle should preserve:

- every goroutine has an owner, start condition, stop condition, and error
  reporting path
- channel senders and receivers cannot block forever after cancellation
- output channels close on all successful and canceled paths where the caller
  owns range consumption
- waits, joins, or explicit lifecycle handles where the caller must know work
  has stopped
- bounded cleanup on shutdown
- no goroutine started as a side effect of package import, constructor, or
  one-shot helper unless the type explicitly owns that lifecycle
- timer and ticker cleanup
- clear documentation when lifecycle is not obvious from local code

Product judgment effects:

- Decide whether background work is product runtime behavior, local support,
  or proof harness behavior.
- Decide which component owns errors, cancellation, retries, and shutdown.
- Decide whether a worker should exist at all or whether synchronous code is
  simpler and more proofable.

Adequate proof:

- cancellation and shutdown tests for new long-running goroutines
- blocked-send or blocked-receive tests for channel pipelines when feasible
- error propagation test from worker to owner
- no leaked goroutines after test-owned runtime shutdown when practical
- race detector run when shared state or concurrent behavior changed

Common failure modes:

- goroutines are started to avoid designing a return path
- channels are used where a simple function call or mutex is clearer
- shutdown closes a channel while another goroutine may still send to it
- workers swallow errors and make readiness or proof look green
- tests rely on `time.Sleep` instead of deterministic synchronization

### Error Contracts And Wrapping

Use this slice when work changes errors, public APIs, command failures, API
handlers, storage adapters, parser failures, or verification output.

Error contracts should preserve:

- errors returned rather than panics for ordinary failure
- normal path at low indentation and error path handled early
- no discarded errors except where the ignored result is explicitly harmless
- no in-band error values when an extra `error` or `ok` return can prevent
  misuse
- `fmt.Errorf(... %w ...)` only when callers should be able to inspect the
  wrapped error with `errors.Is` or `errors.As`
- no wrapping of implementation details that would accidentally become public
  API
- stable sentinel or typed errors only when callers have a real branch to take
- error strings that are lower-case, concise, and composable
- command or API error classification when automation depends on failure type

Product judgment effects:

- Decide whether an error is human diagnostic text, public machine-readable
  contract, command exit class, API error, or internal implementation detail.
- Decide whether exposing a wrapped underlying error commits the package to
  that dependency.
- Decide whether a changed error requires target semantic authority or API
  contract updates.

Adequate proof:

- tests for returned error class and caller-observable behavior
- `errors.Is` or `errors.As` tests for public wrapped errors
- no string-comparison tests for errors unless text is explicitly public
- command/API failure tests when automation consumes errors
- redaction check when errors may include secrets or private runtime state

Common failure modes:

- wrapping database, filesystem, or network errors through a public API without
  realizing that the dependency became part of the API
- panicking in library code because the impossible case was easier for the
  agent to express
- checking errors by exact text where a stable error class is needed
- returning nil values with nil errors after partial failure
- hiding a failed cleanup or flush error because it happened in a defer

### Testing And Table Driven Proof

Use this slice when Go behavior, package boundaries, public APIs, commands,
state machines, storage adapters, or examples change.

Go tests should preserve:

- tests beside the package they prove unless an external caller perspective is
  required
- table tests for families of cases without hiding case identity
- subtest names that make failures actionable and reproducible
- deterministic helpers and explicit fixtures
- examples for public package usage when examples would reduce caller
  ambiguity
- package-internal tests only when internals are the behavior under proof;
  external `_test` package tests when caller contract is being proved
- short-lane tests that stay fast and long-lane tests that are deliberately
  marked, named, or selected
- no broad `TestMain` or shared fixture that makes package tests order
  dependent unless the package truly needs whole-package setup

Product judgment effects:

- Decide which behavior is best proved through unit, package, external caller,
  integration, fuzz, race, or harness tests.
- Decide whether a test fixture is product example, durable corpus, or local
  support.
- Decide whether an untested branch is not applicable or an explicit proof gap.

Adequate proof:

- test cases cover success, failure, boundary, malformed input, idempotency,
  and non-change paths relevant to the changed Go surface
- external package test for public contracts when caller perspective matters
- deterministic cleanup with `t.Cleanup` or equivalent
- no test that only proves code compiles when behavior changed
- no reliance on test ordering, wall-clock sleeps, or global mutable state

Common failure modes:

- agents add one happy-path unit test and miss malformed, boundary, and error
  behavior
- table tests omit case names or collapse distinct defect classes
- tests reach private implementation by exporting symbols only for testing
- long integration setup silently enters ordinary short test lanes
- generated fixtures are accepted without drift checks

### Fuzzing And Corpus Discipline

Use this slice when Go code parses, decodes, deserializes, persists, or
processes untrusted input.

Go fuzzing should preserve:

- fuzz targets that are fast, deterministic, and isolated from persistent
  global state
- one package and one fuzz target selected per `go test -fuzz` invocation
  unless a wrapper explicitly orchestrates repeated invocations
- finite smoke and deep budgets in shared harness entrypoints
- small checked-in seed corpora under the owning package's
  `testdata/fuzz/<FuzzName>/` path when durable
- promotion of crash inputs or important generated coverage into regression
  tests or checked-in corpus entries before closure
- ordinary `go test` remaining fast even when fuzz seed corpora exist
- fuzz assertions that prove semantic invariants, not only "does not panic"
- corpus and crash paths reported in evidence when fuzzing is proof-relevant

Product judgment effects:

- Decide whether changed Go code has enough input, state, parser, or security
  risk to require fuzzing.
- Decide whether fuzzing is smoke confidence, deep exploration, or release
  evidence.
- Decide whether discovered inputs become durable fixtures or remain
  exploratory output.

Adequate proof:

- seed corpus passes under ordinary `go test`
- selected fuzz target runs with explicit finite `-fuzztime` when fuzzing is
  selected
- discovered crash or semantic failure is reproduced with a deterministic test
  or corpus entry
- fuzz assertion checks the relevant invariant, round trip, validation, or
  rejection behavior
- omitted fuzzing is recorded as not applicable or as a proof gap when the
  boundary class normally calls for it

Common failure modes:

- unbounded fuzz command hidden in a normal test or CI lane
- fuzz target uses global mutable state and becomes order dependent
- seed corpus grows into a large opaque artifact bucket
- fuzz target treats any non-panic as success despite invalid semantics
- generated corpus output is cited as proof without reproducing or promoting
  relevant cases

### Concurrency Race And Determinism Proof

Use this slice when shared state, caches, maps, goroutines, timers, channels,
snapshot reads, publication, ordering, or runtime progression changes.

Concurrency proof should preserve:

- explicit ownership of mutable state
- no unsynchronized shared map, slice, pointer, cache, or status mutation
- deterministic tests for sequencing, cancellation, retry, and publication
  behavior where the target depends on ordering
- race detector runs when concurrency or shared state changes
- clear separation between performance caches and semantic state
- no reliance on scheduler timing for correctness
- model, property, or state-machine tests when examples cannot cover the state
  space

Product judgment effects:

- Decide whether a concurrency change affects product semantics, performance
  only, or local support.
- Decide whether race detection, model proof, property proof, or integration
  proof is required.
- Decide whether a cache invalidation failure would be a correctness failure or
  only a performance degradation.

Adequate proof:

- `go test -race` over changed packages or selected concurrency surface when
  shared state changed
- deterministic synchronization in tests instead of sleeps
- restart, replay, or publication-order tests where state durability is
  involved
- cache-disabled or cache-invalidated test where caches must be semantics-free
- proof gap recorded if race or model proof is not feasible locally

Common failure modes:

- cache state becomes part of correctness
- tests pass because the scheduler happened to run in the expected order
- channels and goroutines hide a simple state transition that should be
  synchronous
- map mutation occurs from multiple goroutines without synchronization
- read snapshots accidentally observe future writes

### Agent Authored Go Guardrails

Use this slice when an agent is writing Go code, especially from incomplete
product authority or under broad implementation instructions.

Agent-authored Go should preserve:

- retrieve target semantic authority before naming product packages, services,
  commands, errors, or public types
- prefer small, boring, idiomatic Go over framework-shaped abstractions
- keep implementation local until a real caller requires export
- avoid inventing architecture through placeholder packages, interfaces,
  registries, global managers, or broad factories
- use `gofmt`, `go test`, and targeted proof commands as routine feedback
- keep code generation, fixtures, and helper scripts inspectable and
  reproducible
- write tests that prove defect classes, not merely coverage count
- record uncertainty as a Work Boundary question rather than encoding a guess
  into package names or exported APIs

Product judgment effects:

- Decide when missing target meaning blocks code generation.
- Decide when a generic agent pattern should be rejected in favor of Go's
  simpler local package style.
- Decide whether a proposed abstraction is required by real duplication,
  boundary proof, or caller contract.

Adequate proof:

- changed package names and exported names map to admitted target meaning or
  local implementation responsibility
- no speculative placeholder package or interface
- generated or helper output has a rerun path and drift check when durable
- tests cover the defect classes created by the agent's chosen implementation
- review finds no hidden globals, background work, or context escape hatches

Common failure modes:

- agent translates patterns from other languages into Go without considering
  package-local simplicity
- exported types are created because the agent anticipates future use
- `Manager`, `Service`, `Registry`, or `Factory` names appear before the
  target needs that level of abstraction
- helper packages hide uncertainty instead of resolving it
- code compiles but cannot be cleanly explained through package ownership

### Local Harness And Tooling

Use this slice when Go work adds or changes local scripts, task runners,
verification wrappers, `go run` flows, command adapters, CI glue, Docker or
Compose harnesses, or machine-readable proof output.

Local Go harnesses should preserve:

- stable repo-native command identities for common proof and runtime actions
  when a harness is part of target operation
- explicit package, target, timeout, verbosity, and environment selection
- non-interactive default behavior for shared automation surfaces
- stdout reserved for declared structured results when machine-readable mode is
  selected, with diagnostics on stderr
- no hidden mutable state in operator home directories by default
- explicit dependency preflight and actionable failure classes
- wrappers that delegate to canonical command meaning instead of redefining it
- retained artifact paths that are visible in output or evidence

Product judgment effects:

- Decide whether a harness command is product operator behavior, proof support,
  local convenience, or CI adapter.
- Decide which outputs become stable automation contract.
- Decide whether a wrapper has become a second authority over test or runtime
  semantics.

Adequate proof:

- harness command runs from the documented repo context
- non-interactive mode test or transcript
- invalid config or missing dependency failure test when relevant
- structured output shape check when automation consumes the result
- no wrapper drift from canonical Go command or target semantic authority

Common failure modes:

- wrapper scripts redefine what tests mean
- `go run` commands depend on an undeclared working directory
- diagnostics and JSON output are mixed on stdout
- hidden global machine setup is required for ordinary proof
- local harness behavior silently becomes production behavior

### Generated Code And Artifact Boundaries

Use this slice when Go work adds generated code, generated clients, OpenAPI or
schema output, codegen fixtures, corpus converters, embedded files, or build
artifacts.

Generated Go and artifacts should preserve:

- source artifact, generator command, generated output, and drift check all
  identifiable
- generated files separated from human-owned files by naming, comments, or
  directory ownership
- generated public API treated as public API, not as low-risk implementation
  detail
- generated output not edited manually unless the generator contract permits it
- checked-in artifacts only when they are durable support, contract, fixture,
  or reproducibility material
- large generated corpora or binaries kept out of ordinary source unless their
  retention is explicitly admitted

Product judgment effects:

- Decide whether the generator source or generated Go is the authority.
- Decide whether generated output changes product contract.
- Decide whether generated fixtures or corpora belong in product source,
  support source, or temporary proof output.

Adequate proof:

- generation command reruns cleanly when generated output is durable
- drift check between source contract and generated Go
- tests against generated clients or fixtures when callers depend on them
- artifact size and retention review
- no manual-only edits to generated output

Common failure modes:

- generated Go exposes public names no one reviewed as API
- source contract changes without regenerated output
- generated artifacts are committed because the agent needed them locally
- fixtures become huge and slow ordinary tests
- generated comments or package names violate Go readability but pass compile

### Product Boundary

Use this slice when applying Go Engineering discipline could accidentally
become product meaning.

This package may shape:

- Work Boundary product judgment about Go implementation risk
- package-boundary proof obligations
- command shell, context, goroutine, error, test, fuzz, and race proof effects
- agent implementation guardrails
- promotion pressure when target-specific Go choices should become semantic
  authority

This package must not decide:

- exact target package topology, service families, command names, adapter
  names, database choices, queue choices, logging libraries, CLI libraries, or
  framework choices
- target public API schemas, route names, payloads, generated client contracts,
  or OpenAPI semantics
- observability vocabulary, metric names, trace names, or readiness state
  vocabulary
- release gates, CI cadence, fuzz budgets, or production deployment topology

Product-specific Go statements should become target Context, Intent,
Assurance, Blueprint, or Description records when they need to govern target
implementation. Until that happens, use this package as implementation
judgment and discovery pressure, not as a substitute product architecture.

## Discovery Pressure

When the following questions arise, do not fill them in from this package:

- Which exact Go package names will the target use for future service families?
- Which public Go APIs are stable enough for `pkg` exposure?
- Which command names are product operator behavior versus local support?
- Which database, object store, message queue, CLI, logging, or metrics
  libraries will be selected?
- Which fuzz durations and CI lanes are exact release gates?
- Which generated artifacts are durable product contract?

Route those questions to target semantic authority or an active Work Boundary.

## Version Notes

`0.1.0` is the initial production-oriented Neutral organization package for Go
engineering work. It is intentionally conservative: it gives agents strong Go
implementation constraints where the failure modes are recurring and leaves
target-specific architecture to later discovery and semantic authority.

## Binding: Go Engineering Binding

```yaml
id: neutral.go-engineering.binding
name: Go Engineering binding
version: 0.1.0
status: current
install_path: bindings/neutral/go-engineering-binding.md
discipline_sources:
  - id: neutral.go-engineering
    version_range: ">=0.1.0 <1.0.0"
    required_slices:
      - go-module-and-package-boundaries
      - public-api-and-internal-surface
      - context-and-cancellation
      - goroutine-lifecycle-and-shutdown
      - error-contracts-and-wrapping
      - testing-and-table-driven-proof
      - product-boundary
selection_triggers:
  - Go package, module, import, cmd, internal, pkg, exported API, generated Go, test, fuzz, race, goroutine, context, cancellation, error, command shell, composition root, or local harness changes
  - agent is asked to scaffold, implement, or restructure Go backend code
  - product work touches parser, codec, persistence, runtime, API, command, or untrusted-input Go code
non_selection_rules:
  - non-Go work with no Go wrapper, generated Go, Go command, or Go proof effect
  - exact target product behavior, API schema, observability semantics, or release gate is the only question
  - purely mechanical gofmt/goimports cleanup with no package, export, test, runtime, or proof effect
state_effects:
  - Discovery
  - Work Boundary
  - Build
  - Proof
  - Closure
record_effects:
  section: disciplines_used
conflicts:
  - product semantic authority
  - selected discipline proof effects
  - admitted scope
  - execution boundary
  - proof feasibility
```

### Purpose

Use this binding when a run needs reusable Go implementation judgment for
backend code, package topology, command shells, public/internal surfaces,
context and goroutine lifecycle, errors, tests, fuzzing, race proof, generated
Go, or agent-authored Go guardrails.

### Discipline Sources

Retrieve slices from:

```text
neutral.go-engineering
```

Start with:

- `go-module-and-package-boundaries`
- `public-api-and-internal-surface`
- `context-and-cancellation`
- `goroutine-lifecycle-and-shutdown`
- `error-contracts-and-wrapping`
- `testing-and-table-driven-proof`
- `product-boundary`

Add narrower slices when the work touches those surfaces:

- `command-shell-and-composition-root`
- `package-naming-and-exported-contracts`
- `dependency-direction-and-interface-placement`
- `fuzzing-and-corpus-discipline`
- `concurrency-race-and-determinism-proof`
- `agent-authored-go-guardrails`
- `local-harness-and-tooling`
- `generated-code-and-artifact-boundaries`

### State Effects

#### Discovery

Mark this package as a candidate when source paths, product language, target
facts, or work boundaries mention Go packages, modules, `cmd`, `internal`,
`pkg`, package names, exported names, contexts, goroutines, channels, workers,
errors, fuzzing, race testing, generated Go, command shells, harnesses, or
agent-authored Go implementation.

#### Work Boundary

Before Build, require:

- selected package, binding, and retrieved slices
- Go surfaces being changed
- classification of changed surfaces as public contract, internal
  implementation, command shell, composition root, adapter, test support,
  generated artifact, or local harness
- adopted and rejected Go implementation constraints
- target-specific interpretation of any adopted constraints
- proof obligations for package boundaries, exports, context/cancellation,
  goroutine lifecycle, errors, tests, fuzzing, race, generated artifacts, or
  harness behavior when relevant
- explicit product-boundary handling when package names, command names, public
  APIs, errors, or service families would become target meaning
- promotion candidate decision for durable target-specific Go rules

#### Build

Build must preserve admitted Go package, public/internal, dependency,
context, goroutine, error, test, fuzz, generated-artifact, and harness
constraints.

Return to Work Boundary when:

- a new package, exported name, command surface, interface, goroutine, context
  boundary, generated artifact, or dependency appears
- an implementation detail starts leaking through public API or wrapped errors
- selected proof no longer covers concurrency, fuzz, error, or package-boundary
  risk
- a local harness starts defining product behavior
- target-specific Go architecture is being guessed rather than admitted

#### Proof

Require evidence tied to selected slices. Generic `go test ./...` is
inadequate when this binding selected public export review, package-boundary
inspection, cancellation proof, goroutine shutdown proof, error contract proof,
fuzz proof, race proof, generated-output drift proof, or harness transcript
obligations.

#### Closure

Require:

- `disciplines_used` in the active Control record when this package shaped
  the run
- Evidence Packet mapping for selected Go proof obligations when proof was
  required
- explicit promotion, rejection, archive, or deferral outcome for
  target-specific Go statements shaped by the package
- proof gap record when important Go risk was identified but not proved

### Record Effects

Record these fields when this binding shapes the run:

- package id
- package version
- discipline id
- discipline version
- selected binding
- retrieved slice
- selection reason
- used material
- treatment
- effect on product judgment, scope, proof, or promotion
- proof effect
- evidence satisfying proof effect
- conflicts and treatment
- promotion candidates

### Conflict Handling

Build must not proceed when Go Engineering discipline creates a material
conflict with product semantic authority, selected discipline proof effects,
admitted scope, execution boundary, or proof feasibility.

Resolve by Work Boundary revision, explicit rejection with reason, or
maintainer decision.
