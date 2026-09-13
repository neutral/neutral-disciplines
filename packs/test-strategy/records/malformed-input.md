---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.malformed-input",
  "status": "current"
}
---
# Malformed Input Testing

Exercise malformed, ambiguous, oversized, truncated, and boundary inputs with
explicit failure expectations.

## Practice

Test input boundaries through meaningful invalid classes and verify both
rejection and safe failure behavior.

Valid examples show the happy grammar; malformed classes expose ambiguity,
resource problems, partial state, and unsafe error handling.

## Applicability

Use this record for parsers, schemas, protocols, imports, uploads, and other
externally supplied inputs. It does not apply when no validation boundary moves.

Use this practice when:

- Changing parsers, decoders, serializers, schemas, protocols, uploads, imports,
  or user-controlled input
- Input size, nesting, encoding, duplication, or ambiguity can affect
  correctness
- Error handling or partial output is part of the boundary

The practice has limited use when:

- The change has no parsing, decoding, validation, or externally supplied input
  surface

## Guidance

Select invalid cases from both the grammar and implementation risks, and inspect
failure behavior as well as rejection. Keep target-specific limits in the
target's own authority.

- Choose invalid classes from the grammar and likely implementation failure
  modes
- Include truncation, extra data, duplicate values, invalid encoding, extreme
  sizes, and ambiguous forms where relevant
- Check that failure does not leave partial durable state
- Treat useful bounded diagnostics as part of the observable failure

## Verification

Exercise deterministic invalid classes, representative bounds, cleanup, and
partial-state behavior; add broader generation when the space warrants it.

- Run deterministic examples for material invalid classes
- Check resource bounds on representative oversized or deeply nested input
- Inspect partial-state and cleanup behavior
- Use broader generation when enumerated cases cannot cover the input space
