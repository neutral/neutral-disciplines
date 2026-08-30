---
{
  "schema": "lifecycle.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.go-engineering.local-harnesses",
  "title": "Go Local Harnesses",
  "status": "current",
  "revision": 1,
  "supersedes": null,
  "summary": "Keep local Go harnesses scriptable, explicit about prerequisites, and honest about what their successful output establishes.",
  "owners": ["neutral"],
  "sources": [],
  "relationships": [],
  "conflicts": [],
  "tags": ["go", "harness", "scripts", "tooling"],
  "spec": {
    "practice": "Provide stable repository-native routes for recurring local operations while keeping configuration, prerequisites, and limitations visible.",
    "appliesWhen": ["Adding or changing Go-oriented scripts, task runners, development commands, local services, or proof helpers", "A recurring command depends on working directory, environment, tools, containers, or generated inputs", "Automation consumes harness output or exit status"],
    "doesNotApplyWhen": ["A one-time investigation does not create or change a durable repository command"],
    "guidance": ["Use a stable repository entrypoint for recurring actions", "Validate prerequisites and configuration with actionable failures", "Keep working-directory and environment assumptions explicit", "Separate product operator behavior from development support"],
    "verification": ["Run the harness from its documented entrypoint", "Exercise a representative missing-prerequisite or invalid-configuration case", "Check cleanup and repeatability", "Inspect machine-readable output and exit behavior when automation relies on them"]
  }
}
---
# Go Local Harnesses

## Practice

A useful local harness makes recurring work easier without hiding machine setup,
configuration, or the limits of a successful run.

## Applicability

Use this record for scripts, task runners, local services, proof helpers, and
automation-facing commands. One-time scratch investigation does not need a
durable harness contract.

## Guidance

Keep the entrypoint stable, preflight dependencies, state environment and
working-directory needs, and separate developer support from product behavior.

## Verification

Run the documented route, try a useful failure case, check cleanup and
repeatability, and inspect output semantics used by automation.
