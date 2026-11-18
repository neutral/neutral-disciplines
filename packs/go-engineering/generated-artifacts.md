---
{"id":"discipline:go-engineering.generated-artifacts"}
---
# Generated Go is reproduced from owned inputs by a named generator, and never edited by hand

Generated Go stays maintainable when its input, its generator and the command
that regenerates it are visible and reproducible, and when generated and
handwritten code are kept apart. Treat generated output as the product of
that relationship, not as source to patch.

## Practice

Keep each generated Go file reproducible: its inputs are in the repository or
pinned, its generator and version are named, and one documented command
regenerates it byte for byte. Change generated code by changing its inputs or
its generator and regenerating, keep handwritten code in files the generator
does not write, and keep generator caches and fetched tools out of the
repository.

Without it, a hand fix disappears at the next regeneration, two developers
regenerate different output from the same input, nobody can find which
schema a client came from, and reviewers cannot tell generated lines from
lines someone must maintain.

## Applicability

Use this practice when:

- adding or changing generated Go, such as clients, schema bindings, mocks,
  stringers or protocol bindings, or files generated for `//go:embed`;
- changing generator configuration or source inputs;
- changing whether generated output is committed.

It has limited use when no generated source, generator input or
generated-output policy changes.

## Guidance

- Make the source of truth and the regeneration command discoverable, with
  a `//go:generate` directive or a task next to the output.
- Pin the generator's version, such as a `tool` directive in `go.mod` or a
  versioned `go run` path.
- Separate generated output from handwritten code; add methods to generated
  types in a separate file.
- Do not hand-edit output that regeneration will overwrite.
- Keep temporary generator caches and fetched tool binaries out of the
  repository.

## Checks

### Check regeneration-reproduces

**Claim.** In a change that alters a generator, its inputs or a committed
generated file, running the project's documented generation command leaves
every committed generated file unchanged.

**Fails when.** Regeneration changes a committed file, because the generator
version differs from the pinned one or the output depends on a timestamp, an
absolute path or map order, or because the file was edited after it was
generated.

**Evidence.** The generation command run on the change's final content, and
`git status` after it.

**Applied by.** test
