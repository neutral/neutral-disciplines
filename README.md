# Neutral Disciplines

Neutral Disciplines provides reusable advisory practices for software engineering.
Each practice is an independently readable Intent Discipline record. Packs collect
related practices, and curated Sets offer useful starting selections.

| Pack | Focus |
| --- | --- |
| [Go Engineering](packs/go-engineering/pack.json) | Package design, exported contracts, cancellation, concurrency, errors, testing, and agent-authored changes. |
| [Test Strategy](packs/test-strategy/pack.json) | Verification design, test selection, malformed inputs, properties, replay, integration, and release evidence. |

Both Packs use version `0.1.0` and publisher `neutral`. Their
records keep stable `discipline.neutral.*` IDs so selections remain precise.

## Use a Pack

Choose practices that fit the target repository and current work. Read each
practice's applicability, guidance, and verification suggestions. Sets can overlap;
individual records remain independently selectable.

Use [Intent](https://github.com/neutral/intent) to inspect the supplied Pack and
prepare an adoption proposal. Select the exact Pack version and source revision,
review the proposed records and target configuration, then apply the selected
changes. The target owns its Work Types, requirements, Checks, and adoption choices.

The [IntentForge portfolio](https://github.com/neutral/intentforge) explains how
Intent, Atlas, and Forge support development. These Packs supply optional advice
for projects using Intent. Mandatory practices belong in the target's software
definitions and Checks.

## File layout

Each directory under `packs/` contains:

- `pack.json`: Pack identity, version, publisher, and curated Sets;
- `catalog.json`: record ownership and retrieval metadata;
- `connections.json`: advisory references and relationships;
- `records/`: current Discipline Markdown;
- `pack.manifest.json`: generated fingerprints for the supplied Pack files.

The Packs use Intent format 2. Local Markdown headers identify each record;
Markdown carries its practice meaning and global files carry shared metadata.
The Intent Library owns parsing, validation, and fingerprint computation.

## Check the catalog

Use Node.js 24 or newer and npm. From this repository, install the published
`@neutral/intent@0.1.0` tool and its dependencies from the committed lockfile:

```sh
npm ci
npm run check
npm test
```

Validation compares each supplied manifest with its current source files. Review
any mismatch together with the authored changes. The scripts also accept
`--intent-module /path/to/module/index.js`; `INTENT_MODULE` selects that module for
the test suite. These selections identify the installed public Library API.

## Maintain practices

Keep one useful practice in each record. Preserve its ID while its meaning remains
the same. Update applicability and verification advice together with the practice.
Review the Pack version and curated Set membership whenever meaning changes.

Preview manifests derived from the intended current files:

```sh
npm run update-manifests
npm run update-manifests -- --pack go-engineering
```

After reviewing the source changes and preview, apply them explicitly:

```sh
npm run update-manifests -- --write
npm run check
npm test
git diff --check
```

The updater writes the selected current manifests. Keep commits focused on the
reviewed practice and Pack changes.

## License

Original Neutral Disciplines material, including both Packs and the repository
tools, uses [CC0-1.0 OR 0BSD](LICENSE), at the recipient's choice. The complete
terms are in [CC0 1.0 Universal](LICENSE.CC0-1.0) and [Zero-Clause BSD](LICENSE.0BSD).
