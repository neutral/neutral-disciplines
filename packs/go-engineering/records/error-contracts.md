---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.error-contracts",
  "status": "current"
}
---
# Go Error Contracts

Keep error identity, wrapping, classification, and caller handling intentional
across Go boundaries.

## Practice

Design errors around useful caller decisions and preserve identity or context
only where callers need it.

Errors are part of a boundary when callers use them to retry, report, recover,
or choose another path. Their identity and context deserve deliberate handling.

## Applicability

Use this record when returned errors, wrapping, classification, retries, command
failures, or API failure mapping change. It is unnecessary when failure behavior
is byte-for-byte and semantically unchanged.

Use this practice when:

- Adding or changing returned errors, sentinels, typed errors, wrapping, or
  classification
- Changing command or API failure behavior
- Adding retry, fallback, not-found, validation, or conflict handling

The practice has limited use when:

- Error behavior and caller interpretation are unchanged

## Guidance

Expose only useful stable identities, preserve context without leaking secrets,
and separate returning from logging. The target owns its exact error taxonomy.

- Expose stable error identity only when callers have a reason to branch on it
- Wrap errors to preserve useful context without leaking secrets or unstable
  implementation detail
- Use errors.Is or errors.As when identity is part of the contract
- Keep logging and returning separate so one failure is not duplicated or lost

## Verification

Exercise caller decisions, wrapping behavior, and observable status mapping.
Read failure messages for both diagnostic value and unintended disclosure.

- Exercise representative error classifications and caller branches
- Check wrapping with errors.Is or errors.As where promised
- Review messages for useful context and accidental sensitive data
- Confirm command or API status mapping when it is caller-visible
