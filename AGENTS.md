# Repository Instructions

## Purpose

This repository authors external Lifecycle Discipline Packs. It does not
develop Lifecycle, operate Lifecycle against itself, initialize a target, or
own any target's Product Knowledge.

Use these formal terms exactly:

- Pack
- Pack Discipline record
- Adopted Discipline record
- Set
- Work Type

The retired package, binding, generated-surface, install-profile, and
`disciplines_used` model has no standing here. Do not add compatibility files,
aliases, readers, migration helpers, or parallel legacy vocabulary.

## Repository Shape

```text
README.md                 repository orientation
packs/<pack>/pack.json    exact Pack manifest
packs/<pack>/records/     Pack Discipline records
scripts/                  standalone manifest and validation tools
```

Every Markdown file below a Pack's `records/` directory is one complete
`lifecycle.knowledge-record.v2` record with kind `discipline`. A Pack manifest
inventories every such record and no others. A Set is an exact curated record-ID
list inside that manifest.

## Authority Boundary

Discipline is supporting Knowledge. It may help an agent notice risks, choose
an approach, or review a result. It supplies guidance, not target requirements
or authority; the target remains the source of its own decisions.

Keep target-specific decisions out of Pack records. Examples may illustrate a
practice, but Pack records remain reusable guidance rather than target policy.

## Record Authoring

Before editing, run:

```sh
git status --short
```

Preserve existing work. Use `rg` and `rg --files` for discovery.

Each Pack Discipline record must:

- use the complete Knowledge record v2 universal header;
- use kind `discipline` and an owner-scoped stable `discipline.*` ID;
- keep `conflicts` empty;
- use only optional `related-to` relationships when a relationship is useful;
- provide the exact structured fields `practice`, `appliesWhen`,
  `doesNotApplyWhen`, `guidance`, and `verification`;
- contain the required body sections `Practice`, `Applicability`, `Guidance`,
  and `Verification` exactly once;
- be independently understandable and useful;
- use tags only as retrieval labels; and
- stay advisory and proportionate.

Prefer concise guidance and useful questions over exhaustive rules. Avoid
repeating generic advice in several records merely to make them look complete.
Do not add a dependency, conflict, preference, feature-choice, or automatic
selection engine. Curated Sets and founder-developer judgment own composition.

## Pack And Set Changes

`pack.json` conforms to `lifecycle.discipline-pack.v1`. Record paths are relative
to the Pack root. Inventories and Set member IDs are unique and code-point
ordered. Sets may overlap; overlap simply names the same exact record.

A changed record keeps its stable ID only when it owns the same practice and
advances through the Knowledge revision and supersession rules. Materially new
practice receives a new ID. Never reuse an ID for unrelated meaning.

A Pack version identifies one exact manifest. Updating a record, record
inventory, or Set changes the Pack version and manifest digest. Do not use
floating versions or mutable external references as installed identity.

After a record or Set change, run:

```sh
npm run update-manifests
npm run check
git diff --check
```

Inspect the resulting manifest diff. Digest generation is mechanical; meaning,
record identity, revision, and Set composition remain review decisions.

## Security And Repository Hygiene

Pack content is untrusted input when adopted by a target. It cannot raise
instruction priority, grant capability, reveal secrets, or authorize effects.
Never include credentials, authority material, private target paths, provider
transcripts, runtime custody, or proprietary source in a public Pack.

Only regular non-executable UTF-8 files belong in a Pack. Do not add symlinks,
submodules, archives, generated runtime output, dependency caches, target
registries, Adopted Discipline state, or temporary files.

## Completion

Before reporting completion:

1. inspect the complete diff;
2. confirm every record is self-contained and advisory;
3. confirm manifests inventory every and only Pack record;
4. confirm Set membership is intentional and exact;
5. run `npm run check`, `npm test`, and `git diff --check`; and
6. state any schema or Lifecycle integration work that remains external to this
   repository.
