---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.package-naming-and-exported-contracts",
  "status": "current"
}
---
# Go Package Naming And Exported Contracts

Choose Go package and exported names that read naturally at call sites and keep
public contracts idiomatic, documented, and misuse-resistant.

## Practice

Choose Go package and exported names that read naturally at call sites and keep
public contracts idiomatic, documented, and misuse-resistant.

Names shape how a Go package is understood at every call site. Package
qualifiers, exported symbols, receivers, documentation, and result contracts
should work together as one idiomatic caller-facing surface.

## Applicability

Use this record when a change introduces or renames a package or exported
symbol, adjusts receiver or error conventions, or generates identifiers from a
non-Go source. It adds little when neither public naming nor caller use changes.

Use this practice when:

- Naming or renaming Go packages, exported types, functions, methods, constants,
  variables, receivers, or errors
- Adding a public Go contract or changing how callers use an exported symbol
- Generated or agent-authored Go introduces identifiers that may carry
  conventions from another language

The practice has limited use when:

- No Go package name, exported symbol, receiver, caller-visible error text, or
  result contract changes

## Guidance

Read names with their package qualifier and remove needless repetition. Keep Go
initialisms consistently cased and receiver names short and recognizable. Let
documentation explain caller meaning and special cases. Error text should
compose with added context, while a separate `error` or `ok` result is usually
clearer than hiding failure in an ordinary value.

- Use lower-case package names that read naturally as import qualifiers
- Avoid exported-name stutter when the package qualifier already supplies the
  noun
- Keep initialisms such as ID, URL, HTTP, JSON, and API consistently cased
- Use short receiver names that reflect receiver identity and stay consistent
  across a type's methods
- Write exported documentation around caller meaning and special cases rather
  than repeating the identifier
- Keep error text composable when callers add context
- Prefer an additional error or ok result over an in-band value that makes
  invalid use easy
- Choose names that reveal responsibility instead of implementation fashion

## Verification

Inspect real call sites, not just declarations. Review package names, exports,
receivers, initialisms, documentation, error composition, and result shapes as
one contract; use an example or focused test when new caller behavior benefits
from demonstration.

- Review package-qualified call sites for stutter, vagueness, and non-Go naming
- Inspect exported symbols, receiver names, initialism casing, and documentation
  together
- Check error text composition and look for in-band error values
- Use an example or focused test to show intended caller use when a public
  contract is new
