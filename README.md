# Neutral Disciplines

Two Discipline Packs for [Intent](https://github.com/neutral/intent). A
Discipline states one practice that holds in any project of its kind, with its
reason, where it applies and the Checks that show a breach of it in a change.
Each Pack is a release in Intent's Pack format: a folder that a project adopts
whole.

| Pack folder | Name and version | What it is for |
| --- | --- | --- |
| [`packs/go-engineering`](packs/go-engineering) | `go-engineering` 0.3.0 | Go code that stays small and local, keeps package boundaries and exported contracts deliberate, makes contexts, goroutines and shared state explicit, treats errors as contracts, keeps generated code and local harnesses reproducible, and tests with tables and fuzzing that can fail. |
| [`packs/test-strategy`](packs/test-strategy) | `test-strategy` 0.3.0 | Tests and evidence in any language: choosing test families by the defects a change could cause; malformed-input, property, fuzz, model-based, differential, race, restart, contract, integration and smoke tests that assert what matters; and evidence that is fresh, exact about its subject and honest about its gaps. |

## Layout

Each Pack folder is a release:

- `pack.json` holds exactly the Pack's `name`, `version` and `title`.
- Each `.md` file directly in the folder is one Discipline record, one
  practice. Its ID is `discipline:<pack>.<file name without .md>`, as in
  `discipline:go-engineering.context-cancellation`.
- Nothing else in the folder is part of the release, and subfolders are not
  read.

The fingerprint of a release is computed from its record files alone. A
project's adoption records it, and `intent validate` reports a copy whose
fingerprint no longer matches.

## Adopt a Pack

From the project that adopts it, with this repository at hand on the same
machine:

```sh
intent adopt /path/to/neutral-disciplines/packs/go-engineering --applies '**/*.go'
intent adopt /path/to/neutral-disciplines/packs/test-strategy --applies 'tests/**' --applies 'src/**'
```

- `intent adopt` copies the release's records into
  `intent/discipline/<pack>/` and records in `intent/intent.json` the Pack's
  version, its fingerprint and the globs where it applies. Repeat `--applies`
  for each glob.
- Where a Pack applies is chosen by the adopting project, and only there. A
  project takes a release whole: there is no subset of a Pack to pick.
- Intent hands every Discipline of the Pack, with all its Checks, to an agent
  changing code under those globs. Each Check is written about what a change
  adds or alters, so it holds without effort when the change does not touch
  its subject.
- A Check reaches a change only through the paths its globs match. For
  `go-engineering`, `**/*.go` covers the Go code; add `go.mod`, `go.sum`,
  `**/testdata/**` and the project's harness and generator inputs, such as
  `Makefile`, `scripts/**` or `**/*.proto`, if their Checks should reach
  changes there. For `test-strategy`, cover the tests and harnesses, the CI
  configuration, and the product code whose changes should be asked for
  tests.
- Never edit the copy. When the project needs a practice held more strictly,
  write a Blueprint with a `practice` relation to the Discipline and put the
  project's own Check there. When a practice is missing or wrong, the lesson
  goes to this repository's next release.
- To take a new release, run `intent adopt` again on the new folder. Intent
  reports the Disciplines and Checks added, removed and changed, and the
  project records that name a changed one.

## Validate

Use Node.js 24 or newer. The scripts load the Intent Library from a module
path, given with `--intent-module PATH` or the `INTENT_MODULE` environment
variable, and call its `readPackRelease` on each Pack folder. The repository
has no dependencies.

```sh
npm run check -- --intent-module /path/to/intent/library/src/index.mjs
INTENT_MODULE=/path/to/intent/library/src/index.mjs npm test
```

- `npm run check` prints each Pack's name, version, record count and
  fingerprint, then every diagnostic, and exits 1 on any error.
- `npm test` fails on any diagnostic, warnings included, and on a Pack whose
  folder name differs from its name.

## Maintain a practice

- Keep each practice's record name. The name is the Discipline's ID, which
  adopting projects' Blueprints name in `practice` relations; renaming a file
  makes a different Discipline.
- Keep one practice per record, stated as what to do, with its reason, where
  it applies and its guidance. Keep each record self-contained and free of
  anything about one product. A Discipline writes no relations and has no
  Read against section.
- Change Checks with care: adopting projects rely on them. A Check whose slug
  changes is a different Check, and projects may have tests whose
  Descriptions apply a Check by its ID. Strengthen a Check's Claim or Fails
  when rather than replace it when its meaning stays the same.
- Each Check states its Claim, opening with the changes it is about, its Fails
  when, the Evidence that decides it, and `Applied by.` `test` or `judgment`.
  It may add a Holds when and its Limits. Each field is one paragraph. Use
  `test` only for a claim one test in an adopting project can decide for every
  later change; everything else is `judgment`.
- Keep a Discipline's Checks few. Every change under an adopting project's
  paths is handed every one, so a Check earns its place by catching a mistake
  a change is likely to make. The rest of the practice is its Guidance.
- Ask of each new or changed Check what wrong code would still pass it, and
  whether right code would fail it, and give that question to a judge other
  than the Check's author.
- Every byte change to a record changes the release's fingerprint. Raise the
  `version` in `pack.json` with each change that is released.
- Run `npm run check` and `npm test` before handing a change on.

The format is in Intent's contracts: `spec/packs.md` for a release,
`spec/records.md` for a record and `spec/checks.md` for a Check. `intent guide
discipline` and `intent guide checks` print what makes a Discipline and its
Checks good.

## License

Original Neutral Disciplines material, including both Packs and the repository
tools, uses [CC0-1.0 OR 0BSD](LICENSE), at the recipient's choice. The complete
terms are in [CC0 1.0 Universal](LICENSE.CC0-1.0) and [Zero-Clause BSD](LICENSE.0BSD).
