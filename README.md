# Lifecycle Discipline Packs

This repository publishes reusable engineering guidance as Discipline Packs.
Each Pack divides a broad practice area into small records that projects can
choose independently. Projects remain responsible for their own requirements
and decisions.

## Vocabulary

- A **Pack** is a versioned distribution unit with one exact manifest.
- A **Pack Discipline record** is a full `lifecycle.knowledge-record.v2`
  Discipline record authored in a Pack.
- An **Adopted Discipline record** is a Pack Discipline record copied into a
  target's `records/discipline/` root and registered with exact provenance in
  that target's Discipline Registry.
- A **Set** is a curated, named list of records in one Pack. It is a convenient
  starting point, not another authority layer.
- A **Work Type** is target-owned configuration describing work the target
  actually performs. Packs do not infer or configure target Work Types.

Discipline is light-touch supporting Knowledge. It gives founder-developers and
agents durable practice guidance, useful review questions, and pointers to
possible verification. A target uses that guidance when useful and remains the
source of its own requirements and decisions.

## Packs

```text
packs/
  go-engineering/
    pack.json
    records/
  test-strategy/
    pack.json
    records/
```

[`neutral.go-engineering`](packs/go-engineering/pack.json) decomposes Go
engineering guidance into independently readable records for package
boundaries, package naming and exports, command composition, APIs, dependency
direction, cancellation, goroutine ownership, errors, tests, fuzzing,
concurrency, local harnesses, generated artifacts, and agent-authored changes.

[`neutral.test-strategy`](packs/test-strategy/pack.json) decomposes proof
strategy into independently readable records for proof design, test-family
selection, verification lanes, malformed inputs, replay, races, fuzzing,
properties, models, differential testing, API contracts, integration, smoke,
release evidence, and freshness.

Each `pack.json` is machine-readable. It inventories every record by stable ID,
path, revision, source digest, and semantic digest, then declares curated Sets
as exact record-ID lists. The manifest digest binds the complete inventory and
Set definitions.

## Using a Pack

1. Choose one exact Pack version and manifest digest.
2. Inspect a curated Set or choose individual records using ordinary judgment.
3. Copy the selected exact record bytes into the target's
   `records/discipline/` root.
4. Record the Pack provenance and exact adopted records in the target's
   Discipline Registry.
5. Configure target-owned Work Types to make relevant adopted records easy to
   discover.
6. Commit and validate the target-local result through the target's normal
   governed change path.

After adoption, Lifecycle reads only the target-tracked records and Registry.
It never needs this repository, a sibling checkout, a package manager, or the
network during Delivery. Upstream Pack changes do not flow into a target until
the target explicitly adopts them.

An agent should normally receive only a compact notice that applicable adopted
Discipline exists and where its exact projected copy can be read. Packs are
split so the agent can read the few relevant records instead of receiving a
large general handbook.

## Authoring Principles

A Pack Discipline record should:

- stand on its own without a hidden parent document;
- address one coherent practice concern;
- state when it helps and when it does not;
- offer guidance rather than prescribe target-specific product choices;
- provide review questions or possible verification without claiming that the
  record itself proves compliance;
- remain useful when selected alone; and
- keep target-specific architecture, commands, thresholds, and release policy
  in the target that owns them.

Composition remains intentionally simple. Sets are maintainer-curated examples,
and founder-developers use ordinary judgment when combining records or Packs.
This repository has no dependency solver, conflict engine, automatic chooser,
or compatibility layer for the retired format.

## Validation

The validator uses only Node.js built-ins:

```sh
npm run check
```

After changing record bytes or Set membership, refresh the exact manifest
digests and rerun validation:

```sh
npm run update-manifests
npm run check
```

`npm test` runs focused validator tests followed by the same complete standalone
validation. No generated runtime surface, install profile, package manifest,
dependency cache, or target state is checked in.
