# Test Strategy

```yaml
package_id: neutral.test-strategy
name: Test Strategy
version: 0.1.0
source_type: organization
discipline: test-strategy
scope: proof strategy, evidence adequacy, test selection, fuzzing, integration proof, release checks, and proof-gap handling
status: current
provenance: Neutral production seed derived from recurring under-proof, stale-proof, false-confidence, and release-evidence failures
surface_id: neutral.test-strategy
surface_install_path: surfaces/neutral/test-strategy.md
retrieval_slices:
  - proof-obligation-design
  - test-family-selection-and-coverage
  - short-long-verification-lanes
  - parser-and-malformed-input-proof
  - restart-replay-proof
  - publication-race-proof
  - fuzz-proof
  - property-proof
  - model-state-machine-proof
  - differential-proof
  - api-contract-proof
  - integration-container-proof
  - smoke-proof
  - release-gate-evidence-quality
  - evidence-freshness-and-gaps
  - product-boundary
binding_ids:
  - neutral.test-strategy.binding
```

## Purpose

Use this package when work needs proof strategy, evidence adequacy judgment, or
release-confidence checks beyond "run the usual tests."

The package supplies reusable judgment for selecting proof obligations,
choosing an adequate test family portfolio, designing evidence, avoiding false
confidence, and recording proof gaps. It does not decide a target product's
release gates, test commands, artifact names, CI lanes, or exact obligations.
Product-specific proof requirements belong in Assurance, Evidence Packets,
release records, or local Description records.

## Applies To

- any Delivery run where proof obligations are non-trivial, risky,
  cross-boundary, high-stakes, security-sensitive, data-sensitive, irreversible,
  externally visible, or user-impacting
- parser, serializer, fixture, or malformed-input changes
- durable workflow, idempotency, restart, replay, sequencing, publication,
  lease, race, retention, or recovery changes
- public API, admin API, generated client, runtime config, readiness, stream,
  observability, deployment, or security-boundary changes
- integration work where behavior only appears across process, storage,
  network, object-store, database, or runtime boundaries
- proof freshness, stale proof, partial proof, proof gap, or evidence
  reconciliation decisions

## Does Not Apply To

- purely editorial text changes with no product, runtime, proof, user, data, or
  operational meaning
- mechanical formatting changes with no behavior, schema, proof, generated
  output, or boundary effect
- cases where an existing Assurance already gives complete proof obligations
  and the run only executes them without changing proof strategy
- decisions about product behavior, release scope, or target-specific release
  gates before they are admitted through product semantic authority
- one-run proof commands as durable product meaning

## Discipline Concepts

### Proof Obligation Design

Use this slice before Build when a run changes behavior, structure, invariants,
interfaces, or proof-relevant data.

Good proof obligations are:

- tied to admitted behavior, invariant, structure, non-change, or discipline
  constraint
- specific enough to fail for the defect they guard against
- fresh against the final work delta
- mapped to commands, inspections, fixtures, or runtime evidence
- explicit about what remains unproved
- clear about failure response

Product judgment effects:

- Decide which claims are important enough to require proof before Build or
  before landing.
- Decide whether the proof target is behavior, invariant, structure,
  non-change, discipline, or release confidence.
- Decide what happens when proof is impossible, partial, stale, or too costly.

Adequate proof:

- obligation ID, claim, source, expected evidence, freshness condition, and
  failure response for each obligation
- mapping from every proof command or inspection to obligations
- explicit declared non-change checks when exclusions matter
- proof-gap handling before closure

Common failure modes:

- proof obligations are written after tests already ran
- obligations are broad statements that cannot fail specifically
- proof commands are listed without coverage mapping
- non-goals and exclusions are not checked

### Test Family Selection And Coverage

Use this slice before accepting a proof plan for any change with behavior,
state, parser, proof, API, runtime, persistence, security, or user-impacting
risk.

Test family selection should preserve:

- a deliberate choice across unit, example, malformed-input, round-trip,
  restart/replay, race, fuzz, property, model/state-machine, differential,
  API-contract, integration, smoke, and freshness checks
- selection by defect class and boundary shape, not by whichever tests are
  already easy to run
- explicit "selected", "not applicable", "deferred gap", or "covered by
  existing authority" treatment for each relevant family
- negative and adversarial tests for public, persisted, security, and
  proof-facing boundaries
- broad generated or randomized coverage when examples cannot reasonably cover
  the input or state space
- deterministic regression tests for any bug discovered by fuzz, property,
  model, differential, or exploratory testing
- proof freshness after generated outputs, fixtures, corpora, configs, or
  semantic authority change

Product judgment effects:

- Decide which defect classes matter for the changed boundary.
- Decide which test families are required before Build, before Closure, or
  before release.
- Decide whether a skipped family is truly not applicable or is an explicit
  proof gap.
- Decide when a selected family creates a durable target Assurance or release
  requirement.

Adequate proof:

- test-family selection matrix or equivalent Work Boundary text covering the
  relevant families
- selected families mapped to proof obligations and commands, inspections,
  fixtures, corpora, or runtime evidence
- rationale for not-applicable families when they are commonly relevant to the
  boundary class
- explicit gap and failure response for any deferred selected family
- final Evidence Packet mapping showing which families actually ran and what
  they proved

Common failure modes:

- only unit tests are added for a parser, state machine, persistence boundary,
  or security-sensitive change
- examples are used where property, fuzz, model, or differential coverage is
  needed to explore broad input or state space
- fuzz tests generate data but assert only "no panic"
- integration smoke runs but failure, not-ready, restart, or cleanup behavior
  is not tested
- test-family omissions are left implicit

### Short Long Verification Lanes

Use this slice when work needs different feedback speeds, CI lanes, local
commands, release gates, or deep verification passes.

Verification lanes should preserve:

- a short lane that catches common regressions quickly
- a longer lane for expensive, container, fuzz, integration, or deep semantic
  checks
- clear trigger rules for when the long lane is required
- no implication that short-lane pass is sufficient for high-risk work
- artifact capture or receipts for release-significant lanes
- deterministic commands and bounded runtime expectations

Product judgment effects:

- Decide what proof is enough for local iteration versus release.
- Decide which high-risk changes route to long/deep lanes.
- Decide when skipped long-lane proof blocks closure or creates a recorded gap.

Adequate proof:

- short lane command passes
- long lane command passes when selected by risk
- lane selection rationale in Work Boundary or Evidence Packet
- skipped lane recorded as not applicable or as a proof gap

Common failure modes:

- short lane becomes the only release gate
- expensive lane exists but no one knows when to run it
- failed long-lane proof is treated as optional after it catches a real risk
- CI lanes drift from local proof commands

### Parser And Malformed Input Proof

Use this slice when input shape, parsing, serialization, canonical form,
fixtures, or public data formats change.

Adequate parser proof covers:

- valid canonical inputs
- accepted normalized inputs, when normalization is admitted
- rejected malformed inputs
- wrong length, missing fields, wrong type, invalid alphabet, extra whitespace,
  duplicate IDs, unknown enum, ambiguous encoding, and structurally invalid
  cases as relevant
- round-trip behavior where emitted output becomes input later
- fuzzing or property tests when the input grammar is broad

Product judgment effects:

- Decide which input grammar is product contract and which is local parsing
  tolerance.
- Decide whether non-canonical inputs are accepted, rejected, normalized, or
  reserved.
- Decide what malformed input failures mean to callers or operators.

Adequate proof:

- canonical positive cases
- malformed negative cases
- boundary values
- duplicate, unknown, missing, wrong-type, wrong-length, and ambiguous input
  cases as relevant
- round-trip and fuzz proof when representation is broad

Common failure modes:

- testing only valid examples
- accepting malformed or extra fields silently
- comparing strings without validating decoded semantics
- fixtures are loaded without malformed fixture tests

### Restart Replay Proof

Use this slice when durable behavior must survive crash, restart, retry,
replay, migration, or restoration.

Adequate restart/replay proof covers:

- work persisted before acknowledgement
- replay does not duplicate accepted liability or side effects
- retry with the same identity returns the same logical result
- conflicting replay is rejected or routed explicitly
- recovery reads authoritative durable state rather than incidental memory
- stale, partial, or corrupt durable state fails closed

Product judgment effects:

- Decide what durable acknowledgement or accepted state means.
- Decide whether replay returns the same result, rejects conflict, or creates a
  new action.
- Decide which recovery state is authoritative after crash or restart.

Adequate proof:

- successful persistence before acknowledgement
- same request replay returns same logical result
- conflicting replay is rejected or routed explicitly
- restart recovers from durable state
- partial or corrupt durable state fails closed

Common failure modes:

- behavior passes in memory but fails after restart
- retries duplicate side effects
- stale state is accepted as current
- conflict handling is missing because happy path never retries

### Publication Race Proof

Use this slice when sequencing, leasing, claiming, publication, ordering,
object writes, or background progression changes.

Adequate publication proof covers:

- no-work behavior
- successful bounded publication
- claim loss or concurrent publisher race
- artifact write and readback integrity
- sequence contiguity or accepted ordering invariant
- idempotent repeat behavior
- partial publication failure handling
- downstream visibility only after required durable publication and binding

Product judgment effects:

- Decide whether publication is synchronous, background, operator-triggered, or
  external.
- Decide when downstream readers may observe published state.
- Decide how no-work, claim loss, partial failure, and retries affect product
  status.

Adequate proof:

- no-work pass
- successful publication pass
- concurrent claim or race handling
- partial artifact failure handling
- downstream visibility only after binding
- rerun/idempotency behavior

Common failure modes:

- concurrent publishers both claim success
- downstream state appears before durable publication
- partial write creates an apparently complete publication
- no-work path creates placeholder artifacts

### Fuzz Proof

Use this slice when parsers, byte formats, storage formats, or input-heavy
logic accept broad or adversarial input.

Fuzz proof should preserve:

- meaningful seed corpus
- generator scope that reaches real parser or validation paths
- invariants strong enough to catch semantic failures
- runtime bounds and reproducibility expectations
- minimized failure retention or deterministic regression tests for discovered
  bugs
- clear separation between fuzz smoke and deep fuzz proof

Product judgment effects:

- Decide whether fuzzing is release proof, hardening proof, or exploratory
  support.
- Decide what fuzz duration or corpus is adequate for the risk.
- Decide which fuzz-discovered bug becomes a deterministic regression.

Adequate proof:

- fuzz smoke for parser/path availability
- deeper fuzz run for high-risk boundaries
- invariant assertions beyond "does not crash" when correctness matters
- saved regression case for discovered defects

Common failure modes:

- fuzz test only checks no panic
- generator never reaches meaningful states
- fuzz corpus is empty or stale
- discovered failure is fixed without a deterministic regression

### Property Proof

Use this slice when correctness can be expressed as invariants over many
inputs or operation sequences.

Property proof should preserve:

- clear invariant statement
- generator covering valid and relevant invalid states
- shrinking or failure reproduction when tooling supports it
- negative properties when invalid inputs should fail
- deterministic regression tests for found counterexamples

Product judgment effects:

- Decide which properties are product invariants versus implementation
  conveniences.
- Decide whether examples are insufficient and property coverage is required.
- Decide how property failures route back to authority or design.

Adequate proof:

- property tests over relevant input domains
- invalid domain generation when rejection matters
- counterexample retention
- ordinary tests for named edge cases

Common failure modes:

- properties restate implementation behavior instead of product invariant
- generators exclude edge cases
- invalid cases are not generated
- failures are ignored as "random"

### Model State Machine Proof

Use this slice when behavior depends on state transitions, lifecycle ordering,
workflow progression, retries, or multi-step history.

Model and state-machine proof should preserve:

- allowed states and transitions
- invalid transition rejection
- history-dependent invariants
- restart or replay points when durable state matters
- terminal states and no-hidden-active-state checks
- comparison between model behavior and implementation behavior when possible

Product judgment effects:

- Decide which state transitions are product behavior.
- Decide which states are terminal, transient, retryable, or invalid.
- Decide whether implementation can be trusted without an explicit model.

Adequate proof:

- transition table or model
- valid sequence tests
- invalid transition tests
- state-machine or model-based randomized sequences when state space is broad
- restart/replay integration when state is durable

Common failure modes:

- tests cover individual functions but not transition sequences
- terminal state can regress
- invalid transitions are silently accepted
- state machine exists only in prose

### Differential Proof

Use this slice when an implementation can be compared to a reference model,
oracle, independent implementation, specification, or slower trusted algorithm.

Differential proof should preserve:

- explicit reference model or oracle boundary
- input generator shared across implementation and oracle
- comparison of outputs and failure modes
- known divergence rules
- corpus cases for historical mismatches

Product judgment effects:

- Decide whether the oracle is authoritative, advisory, or only test support.
- Decide which divergences are acceptable and which are product defects.
- Decide when oracle changes require semantic authority review.

Adequate proof:

- representative deterministic comparisons
- randomized or generated comparisons when input space is broad
- malformed or edge input comparison when relevant
- recorded allowed divergence list
- regression cases for prior mismatches

Common failure modes:

- oracle has unclear authority
- implementation and oracle share the same bug through copied code
- divergences are normalized away without review
- only happy-path examples are compared

### API Contract Proof

Use this slice when public API, admin API, generated client, stream, or
contract artifact changes.

Adequate API proof covers:

- request schema validation
- response schema validation
- example compatibility
- error vocabulary and status mapping
- route ownership and exposure
- generated-client drift
- public/admin boundary separation
- streaming envelope and boundedness when relevant

Product judgment effects:

- Decide which API artifacts are product authority.
- Decide which generated clients or examples must remain compatible.
- Decide whether contract drift blocks release.

Adequate proof:

- schema validation
- example validation
- handler response validation
- generated-client drift proof
- public/admin exposure checks
- error mapping tests

Common failure modes:

- examples pass manually but fail schema
- generated client is stale
- admin route appears on public listener
- handler emits fields absent from contract

### Integration Container Proof

Use this slice when behavior depends on external processes, databases, object
stores, queues, generated clients, network listeners, containers, or runtime
profiles.

Integration/container proof should preserve:

- dependency startup and readiness
- representative end-to-end path
- expected failure, not-ready, unavailable, and cleanup paths
- artifact or state retention across process boundaries
- deterministic local commands or scripts
- safe local credentials and explicit non-production posture
- isolation between test runs

Product judgment effects:

- Decide whether integration proof is local confidence, release evidence, or
  deployment proof.
- Decide which dependencies are required for product readiness.
- Decide which local assumptions cannot be generalized to production.

Adequate proof:

- clean dependency startup
- service readiness check
- end-to-end success path
- expected not-ready/failure path
- rerun cleanup or isolation proof
- artifact/state verification after boundary crossing

Common failure modes:

- integration test passes because previous state exists
- process starts but dependency is not usable
- local credentials are treated as production defaults
- cleanup hides retention or replay bugs

### Smoke Proof

Use this slice when behavior depends on external processes, databases,
object stores, network listeners, generated clients, containers, or runtime
profiles.

Smoke proof should preserve:

- one or more small representative paths
- fast reproducible command
- clear preconditions and cleanup expectations
- enough assertions to prove more than process startup
- explicit statement of what smoke does not prove
- no substitution for deeper proof when selected discipline requires it

Product judgment effects:

- Decide whether smoke proof is enough for local handoff or release.
- Decide which deeper obligations remain open after smoke passes.
- Decide whether smoke failure blocks closure.

Adequate proof:

- command exits successfully
- representative product or runtime path asserted
- failure/not-ready path when relevant
- proof gap statement for untested deep behavior

Common failure modes:

- smoke only checks process starts
- smoke pass is treated as full integration proof
- smoke relies on stale local state
- smoke does not assert response content or persisted effect

### Release Gate Evidence Quality

Use this slice when proof affects landing, release, production readiness,
merge, deployment, or external confidence.

Release gate evidence should preserve:

- named gate and owning authority
- required proof commands or evidence classes
- freshness conditions
- acceptable skip, waiver, or deferral route
- failure response
- artifact capture for review
- distinction between local confidence, merge readiness, release readiness, and
  production readiness

Product judgment effects:

- Decide which proof gates block release or only block a narrower handoff.
- Decide whether a failed or skipped gate is acceptable and who can decide.
- Decide what proof artifacts future reviewers need.

Adequate proof:

- all required gate commands or evidence classes completed
- failed and skipped gates reconciled
- freshness verified after final work delta
- release notes or closure records point to evidence

Common failure modes:

- release gate names exist but no commands or evidence are tied to them
- skipped gates are not recorded
- stale proof is used after final changes
- local smoke is treated as production readiness

### Evidence Freshness And Gaps

Use this slice during Proof and Closure.

Evidence remains adequate only when:

- proof ran after the final work delta it claims to cover
- relevant semantic authority, policy, support config, generated artifacts, and
  target surfaces have not changed in ways that invalidate the proof
- proof coverage maps to all current proof obligations
- failed, stale, partial, or superseded proof is explained
- remaining gaps have failure responses or explicit deferrals
- generic tests are not treated as satisfying discipline-specific obligations

### Product Boundary

Use this slice when reusable verification guidance creates a product-specific
release or assurance statement.

Generic verification principles stay in discipline. Accepted
product-specific proof requirements must be rewritten into target terms before
promotion. For example, "publication races need proof" is discipline;
"the target's publish operation must prove concurrent claim loss returns a
bounded internal failure and leaves no visible ordered receipt" is candidate
product authority.

## Constraints

- State proof obligations before substantive Build when obligations are known.
- Select the test family portfolio before accepting a narrow proof plan.
- Map every selected proof command, inspection, or runtime observation to a
  proof obligation or declared non-change.
- Do not treat a generic full-suite pass as adequate when selected discipline
  requires parser, replay, race, API, integration, or freshness evidence.
- Include negative and malformed cases for public, persisted, security, and
  proof-facing boundaries.
- Include restart/replay proof when behavior depends on durable state.
- Include race/partial-failure proof when behavior depends on claims, leases,
  background work, publication, or external writes.
- Consider fuzz, property, model/state-machine, and differential proof whenever
  examples cannot cover the input, state, proof, or adversarial space.
- Keep proof freshness explicit after implementation, generated artifacts,
  semantic authority, support config, or policy changes.
- Record proof gaps and failure responses rather than stretching evidence.
- Do not promote generic proof rules into semantic authority without rewriting
  them as target-specific Assurance or release requirements.

## Recurring Failure Modes

- writing proof obligations after implementation and calling it planning
- skipping test-family selection and defaulting to the fastest existing unit
  suite
- relying on happy-path tests for parser, API, publication, or security
  changes
- running a broad generic suite while leaving the changed boundary untested
- treating a local smoke test as proof of all production behavior
- omitting negative cases for malformed input, conflicting replay, or not-ready
  dependencies
- failing to rerun proof after generated output or config changes
- recording proof commands without mapping them to obligations
- not distinguishing failed, stale, superseded, and current proof receipts
- using fuzz tests that generate values but assert weak or irrelevant
  properties
- omitting property, model, or differential proof because no existing test file
  already uses that style
- declaring proof adequate while a selected discipline obligation remains
  untested

## Adequate Proof

Adequate proof may include:

- proof-obligation list tied to admitted behavior, non-goals, invariants,
  structure, selected discipline, and declared non-changes
- test-family selection matrix or equivalent rationale covering selected,
  not-applicable, and deferred families
- targeted unit tests for changed logic
- parser and malformed-input tests for changed input boundaries
- restart, replay, idempotency, and recovery tests for durable workflows
- race, partial-failure, and no-work tests for publication or background work
- API contract, example, generated-client, and error-mapping checks
- fuzz, property, state-machine, or differential tests when examples are
  insufficient
- integration smoke tests for process, database, object-store, network, or
  deployment boundaries
- proof freshness verification and gap reconciliation in the Evidence Packet

## Inadequate Proof

Proof is inadequate when:

- only existing broad tests are run without checking the changed boundary
- only happy-path examples are covered
- failed proof is ignored because a later command passed without explaining
  coverage
- stale proof is used after code, generated artifacts, config, policy, or
  semantic authority changed materially
- fuzz tests do not assert meaningful invariants
- no test-family selection exists for a risky change
- integration tests do not check failure or not-ready behavior
- proof commands are listed but not tied to proof obligations
- proof gaps are described as "low risk" without a failure response
- product-specific proof requirements are copied from generic discipline guidance
  instead of being admitted through target Assurance or Evidence records

## Examples

Adequate Work Boundary statement:

```text
The selected Test Strategy package applies because this run changes a
public parser and durable replay path. The test-family selection chooses unit,
malformed-input, round-trip, restart/replay, fuzz-smoke, and freshness checks;
it marks integration as not applicable because no process boundary changed and
records deep fuzz as a deferred gap. The run adopts malformed-input,
round-trip, restart replay, fuzz, and evidence-freshness slices. Evidence must
map parser tests, replay tests, generated artifact checks, fuzz-smoke, and
final proof receipt freshness to the current proof obligations.
```

Inadequate Work Boundary statement:

```text
Run all tests.
```

Adequate proof-gap statement:

```text
The local integration smoke covers configured dependency startup and one
end-to-end success path. It does not prove production failover. Production
failover remains an explicit unproved gap and must not be treated as release
readiness without a later proof obligation.
```

## Version Notes

`0.1.0` is the initial production-oriented Neutral organization package for
test strategy, proof strategy, and evidence adequacy.

## Binding: Test Strategy Binding

```yaml
id: neutral.test-strategy.binding
name: Test Strategy binding
version: 0.1.0
status: current
install_path: bindings/neutral/test-strategy-binding.md
discipline_sources:
  - id: neutral.test-strategy
    version_range: ">=0.1.0 <1.0.0"
    required_slices:
      - proof-obligation-design
      - test-family-selection-and-coverage
      - evidence-freshness-and-gaps
selection_triggers:
  - proof strategy, test family selection, Evidence Packet, release gate, Assurance check, generated artifact, test lane, fuzz, property, model, differential, integration, smoke, or proof freshness changes
  - public, persisted, durable, API, runtime, deployment, security, or irreversible behavior changes with non-trivial proof obligations
  - any selected discipline package creates proof effects not already covered by current Assurance or Evidence records
non_selection_rules:
  - editorial-only change with no product, runtime, proof, user, data, operational, generated artifact, or semantic authority effect
  - mechanical formatting change with no behavior, schema, proof, generated output, or boundary effect
  - existing complete Assurance obligations are merely executed without changing proof strategy or adequacy judgment
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
  - organization release policy
  - admitted scope
  - execution boundary
  - proof feasibility
```

### Purpose

Use this binding when a run needs explicit proof strategy, evidence adequacy,
freshness, or proof-gap handling.

### Discipline Sources

Retrieve slices from:

```text
neutral.test-strategy
```

Start with:

- `proof-obligation-design`
- `test-family-selection-and-coverage`
- `evidence-freshness-and-gaps`

Add narrower slices when the work touches those surfaces:

- `short-long-verification-lanes`
- `parser-and-malformed-input-proof`
- `restart-replay-proof`
- `publication-race-proof`
- `fuzz-proof`
- `property-proof`
- `model-state-machine-proof`
- `differential-proof`
- `api-contract-proof`
- `integration-container-proof`
- `smoke-proof`
- `release-gate-evidence-quality`
- `product-boundary`

### State Effects

#### Discovery

Mark this package as a candidate when work shape implies non-trivial proof
strategy, high-risk proof, selected discipline proof effects, release
evidence, integration proof, proof freshness, or proof-gap reconciliation.

#### Work Boundary

Before Build, require:

- selected package, binding, and retrieved slices
- selected, not-applicable, and deferred test families for the changed boundary
- proof obligations tied to admitted behavior, invariants, structure,
  non-changes, selected discipline, or product judgment
- expected proof commands, inspections, fixtures, or runtime evidence when
  known
- proof freshness conditions
- failure response for each obligation
- explicit unproved gaps and route-back conditions when proof is incomplete
- promotion candidate decision for any durable target-specific proof rule

#### Build

Build must preserve proofability. Return to Work Boundary when:

- a change creates new proof obligations
- selected proof is no longer adequate
- generated outputs, support config, policy, semantic authority, or target
  surfaces change proof freshness
- a proof command becomes infeasible
- a proof gap changes product judgment or admission

#### Proof

Require evidence mapped to obligations. Generic test passes are inadequate when
selected slices require parser, replay, race, API, fuzz, property, model,
differential, integration, or freshness evidence.

#### Closure

Require:

- Evidence Packet mapping for selected proof obligations
- proof freshness and proof-gap reconciliation
- `disciplines_used` in the active Control record when this package shaped
  the run
- explicit promotion, rejection, archive, or deferral outcome for
  product-specific proof requirements shaped by the package

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

Build must not proceed when test strategy discipline creates a material conflict
with product semantic authority, selected discipline proof effects,
organization release policy, admitted scope, execution boundary, or proof
feasibility.

Resolve by Work Boundary revision, explicit rejection with reason, or
maintainer decision.
