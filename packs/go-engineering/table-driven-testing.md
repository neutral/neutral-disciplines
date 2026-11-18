---
{"id":"discipline:go-engineering.table-driven-testing"}
---
# Go tests use tables only for cases of one shape, name each case by its behavior, and fail saying which case broke

Test structure should make the behavior under review and the differences
between cases easy to see. Tables help when cases share one shape and hinder
when they hide different stories; in either form, a failure should name the
case, the input and what went wrong, and a regression test should fail
without its fix.

## Practice

Use a table when several cases share one setup and one assertion shape, and
write separate tests when they do not. Name each case for the behavior or
boundary it covers, run it as a subtest, and report the input, the result and
the expected result when it fails. Test from the boundary that owns the
claim, include the failure and edge cases of the changed behavior, and make
sure a regression test fails for the defect it guards.

Without it, tables grow flags that switch behavior per row, a failure reads
`mismatch` with no case or values, the error and boundary paths go untested,
and a regression test passes against the bug it was written for.

## Applicability

Use this practice when:

- adding or changing Go behavior, package boundaries, public APIs, commands,
  errors or state transitions;
- several inputs share the same observable assertion shape;
- a regression needs a small durable example.

It has limited use when a table would hide materially different setup,
behavior or failure meaning; write separate tests then. The project decides
its coverage depth and suite organization.

## Guidance

- Use tables for genuinely comparable cases, not as a default ceremony.
- Name cases by meaningful behavior or boundary, and run each with `t.Run`.
- Keep assertions close enough to the failure that its message says what
  went wrong, with the got and want values.
- Prefer tests in an external test package when the public contract is the
  subject, and internal tests when the internals are.
- Run the focused package tests and the broader affected suite.

## Checks

### Check fix-has-regression-test

**Claim.** In a change that fixes a defect, a test is added whose input
reaches the lines the fix changed and that asserts the corrected result.

**Fails when.** No test is added; the test's input never reaches the fixed
code; it asserts only that no error occurred; or it compares against a value
computed by the defective function itself.

**Evidence.** The added test: its input, the path that input takes through the
fixed lines, and what it asserts.

**Limits.** Says nothing of whether the test was seen to fail before the fix.

**Applied by.** judgment

### Check error-paths-tested

**Claim.** In a change that adds or alters an error path, such as a new error
return, each such path is reached by a test.

**Fails when.** A new error return, such as a validation failure or a failed
dependency call, is reached by no test; or only one of several new error
returns is tested.

**Evidence.** Each error return the change adds or alters, and the test that
reaches it.

**Limits.** Says nothing of whether the test asserts which error it was.

**Applied by.** judgment
