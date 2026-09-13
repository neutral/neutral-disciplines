---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.generated-artifacts",
  "status": "current"
}
---
# Go Generated Artifacts

Keep generated Go ownership, source inputs, regeneration, review, and drift
expectations explicit.

## Practice

Treat generated Go as a reproducible relationship between owned inputs, an
identifiable generator, and reviewable output.

Generated Go is maintainable when its input, generator, output policy, and
regeneration path are visible and reproducible.

## Applicability

Use this record for generated clients, schemas, mocks, protocol bindings,
embedded artifacts, and generator configuration. It adds little when no part of
that relationship changes.

Use this practice when:

- Adding or changing generated Go, clients, schemas, mocks, stringers, protocol
  bindings, or embedded artifacts
- Changing generator configuration or source inputs
- Changing whether generated output is committed

The practice has limited use when:

- No generated source, generator input, or generated-output policy changes

## Guidance

Make the source of truth discoverable, keep generated and handwritten ownership
clear, and avoid durable caches or manual edits that regeneration will erase.

- Make the source of truth and regeneration route discoverable
- Separate generated output from handwritten ownership where practical
- Avoid hand-editing output that will be overwritten
- Keep temporary generator caches and fetched tool state out of durable source

## Verification

Regenerate cleanly, inspect drift, test meaningful callers, and verify that only
intended durable output entered the repository.

- Regenerate from a clean state and inspect the exact diff
- Run drift detection when reproducibility matters
- Exercise callers that depend on the generated contract
- Check that temporary output and tool caches are not committed
