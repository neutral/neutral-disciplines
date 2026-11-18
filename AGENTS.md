# Working on Neutral Disciplines

This repository holds two Intent Discipline Packs, each a release folder in
`packs/`. Read the [README](README.md) first. The format is in Intent's
contracts (`spec/packs.md` for a release, `spec/records.md` for a record and
its ID, `spec/checks.md` for a Check); `intent guide discipline` and `intent
guide checks` print what makes a Discipline and its Checks good.

Inspect `git status --short` before editing and keep existing work.

## Records

- A Pack folder holds `pack.json`, with exactly `name`, `version` and `title`,
  and one `.md` record per practice at its top level. Put nothing else in it:
  no subfolders, catalogs, manifests or notes.
- Line 2 of a record is `{"id":"discipline:<pack>.<file name without .md>"}`
  and nothing more.
- After the header: a level-1 title stating the practice, a one-paragraph
  summary, then `## Practice` (what to do and why), `## Applicability` (when
  to use it and when it has limited use), `## Guidance`, and `## Checks`.
- A Discipline writes no Relations section and no Read against section, and
  names no project, product, path or other record. Each record reads on its
  own.
- Where a tool already decides a rule, such as gofmt, go vet or a configured
  linter, say to run the tool in the Guidance instead of writing a Check.

## Checks

- Each Check is a `### Check <slug>` block of fields only, each one paragraph:
  `**Claim.**`, optionally `**Holds when.**`, `**Fails when.**`,
  `**Evidence.**`, optionally `**Limits.**`, and `**Applied by.**` `test` or
  `judgment`.
- Keep them few: a Check for the mistake a change is likely to make, and the
  rest of the practice in the Guidance.
- Every Check is handed for every change under an adopting project's globs,
  and its judge sees only the Check, its record and the diff. So write each
  Claim about what the change adds or alters, so that it holds when the
  change does not touch its subject; put in Fails when the wrong code an
  agent is likely to write, as a diff would show it; and use Holds when for
  right code the Claim could seem to fail.
- No Check's Claim names the change's report or its commit message: a judge
  is shown neither. A practice that is about the plan or the report of a
  change, as `proof-obligation-design` is, has no Check of its own, and says
  so under its Checks heading.
- One claim per Check. Use `test` only when one test in an adopting project
  decides the claim for every later change, such as a regeneration test;
  otherwise use `judgment`.
- Never change a published slug for the same meaning, and change a Check's
  wording only to strengthen or correct it: adopting projects' tests and
  Blueprints rely on it. Ask a judge other than the author what wrong code
  would still pass each new or changed Check, and what right code would fail
  it.

## Releases and validation

- Raise `version` in `pack.json` with each released change; any byte change
  to a record changes the fingerprint.
- Validate with the Intent Library:
  `npm run check -- --intent-module PATH` and `INTENT_MODULE=PATH npm test`,
  where `PATH` is the Library's module. Fix every diagnostic, warnings
  included. Keep `scripts/` thin: the Library owns parsing, validation and the
  fingerprint.
- Run `git diff --check`, read the whole diff, and report what was validated
  and with which Library.
