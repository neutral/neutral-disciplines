---
{
  "schema": "intent.knowledge-record.v2",
  "kind": "discipline",
  "id": "discipline.neutral.test-strategy.test-family-selection",
  "status": "current"
}
---
# Test Family Selection

Choose test families by changed boundaries and defect classes rather than by the
tests already close at hand.

## Practice

Select a proportionate mix of test families that can expose the material
failures of the changed subject.

Different test families expose different defects. Selection should follow the
changed boundary and failure shape rather than the existing test directory.

## Applicability

Use this record when a change crosses meaningful behavior, state, input, API,
runtime, or operational boundaries and several forms of proof may help.

Use this practice when:

- Work affects behavior, state, parsing, APIs, persistence, concurrency,
  security, deployment, or user-visible boundaries
- Example tests alone may leave a broad input or state space unexplored
- Several proof families could provide materially different confidence

The practice has limited use when:

- The changed subject and its complete test-family treatment are already fixed
  by current target-owned Checks

## Guidance

Consider relevant example, negative, property, stateful, concurrency, contract,
integration, and smoke perspectives. Choose a proportionate subset and keep
important omissions visible.

- Consider unit, example, negative, round-trip, replay, race, fuzz, property,
  model, differential, contract, integration, and smoke families where relevant
- Choose by failure shape rather than habit
- Treat a skipped commonly relevant family as a judgment worth a short reason
- Turn failures found through exploration into stable focused regressions

## Verification

Compare the chosen families with plausible failures, inspect assertion quality,
and distinguish a reasoned omission from an accidental proof gap.

- Review the chosen families against the changed boundaries and risks
- Check that selected tests assert meaningful behavior rather than only
  completion
- Inspect whether negative and failure paths received proportionate attention
- Keep deferred coverage visible as a gap rather than implied success
