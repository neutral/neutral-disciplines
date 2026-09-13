---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.api-contract-testing",
  "status": "current"
}
---
# API Contract Testing

Test public request, response, error, compatibility, and generated-client
behavior at the contract boundary.

## Practice

Exercise public API behavior from a caller-visible boundary and keep schema,
implementation, examples, and generated clients aligned.

Contract tests focus on what a caller can send, receive, and rely on across a
public or component boundary.

## Applicability

Use this record for APIs, schemas, events, commands, libraries, generated
clients, compatibility, and error envelopes. Internal refactoring with no
contract effect usually does not need it.

Use this practice when:

- Changing public HTTP, RPC, event, command, or library contracts
- Changing schemas, status mapping, error envelopes, pagination, compatibility,
  or generated clients
- Multiple implementations or consumers rely on the same boundary

The practice has limited use when:

- No public or cross-component contract changes

## Guidance

Exercise both success and failure from the caller boundary, keep generated
artifacts aligned, and distinguish transport completion from semantic success.

- Test success and meaningful failure responses through the public boundary
- Include compatibility and unknown-field behavior where relevant
- Regenerate and exercise clients when generation is part of the contract
- Keep transport success separate from semantic success

## Verification

Run against the real boundary, compare source and generated contracts, exercise
representative clients, and inspect compatibility and error cases.

- Run contract tests against the real boundary implementation
- Compare generated artifacts with source schemas
- Exercise representative client usage
- Inspect error, compatibility, and boundary validation cases
