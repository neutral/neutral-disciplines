# Working on Neutral Disciplines

This repository maintains reusable advisory Intent Discipline Packs. Read the
[repository guide](README.md) and the applicable
[Intent contracts](https://github.com/neutral/intent) before changing Pack structure.
Targets own their requirements, Work Types, Checks, and adoption choices.

Inspect `git status --short` before editing and preserve existing work. Keep each
practice self-contained and useful on its own. Preserve IDs for the same meaning.
Keep applicability, guidance, and verification suggestions consistent. Curated Sets
are ordered selections of unique, scalar-value-sorted record IDs.

Each Pack uses Intent format 2: `pack.json`, `catalog.json`, `connections.json`,
Discipline Markdown in `records/`, and generated `pack.manifest.json`. Headers
contain `schema`, `kind`, `id`, and `status`. Catalog ownership matches the Pack's
publisher. Relationships are optional `related-to` links; conflicts remain empty.

Use the public `@neutral/intent` Library for parsing, validation, and manifests.
Keep local scripts thin. Validation reports mismatches against the supplied current
manifest. Explicit manifest updates follow review of authored meaning and Pack
version choices.

Write current guidance in short, active prose. Keep repository names and links
aligned with Neutral Disciplines and the public IntentForge portfolio. Current
files describe the maintained catalog.

Run `npm run check`, `npm test`, and `git diff --check` with the selected installed
Intent package. Inspect the complete diff and report the tested scope. Pack
validation checks structure and correspondence; practice quality and target
adoption receive their own review. Keep source records, metadata, and manifests
consistent with the verified behavior.
