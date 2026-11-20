# United States Health Care Power of Attorney — agent instructions

Execution-readiness form for a United States durable power of attorney for
health care. Read [`spec/index.md`](spec/index.md) first and update it before
changing code. This is documentation support, not legal advice.

## Engine

- HTML: `front-end-with-html/js/{rules,grader,flags,types}.js`. `rules.js` holds
  `STATE_RULES` (CA, NY, TX, FL, IL, PA, OH, WA) and the predicates;
  `grader.js` `gradeDirective(d)` returns `{ readinessClass, ruleSetName,
  missingCount, executionRisk }`; `flags.js` `detectFlaggedIssues(d)` returns the
  flags (a split engine: the persona oracle uses `flagsArgs: ["state"]`).
- Svelte: `front-end-with-svelte/src/lib/engine/` mirrors it in TypeScript; keep
  the two in step.
- Classes: `ready-to-execute`, `incomplete`, `execution-risk`
  (`execution-risk` takes precedence).
- Flags: `F-HCPOA-NNN`, listed in the spec.
- Adding a state: verify the statute, add the row to both `STATE_RULES`, add a
  persona, record the source in `doc/state-rules.md`.

## Tables

`principal`, `reviewer`, `united_states_health_care_power_of_attorney`, and its
`_grade`, `_grade_rule`, `_grade_flag` triad. The Axum crate follows the fleet
standard (`AGENTS/back-end-with-axum.md`).

## Verify

```sh
bin/test-form united-states-health-care-power-of-attorney
bin/test-personas united-states-health-care-power-of-attorney
bin/test-engines united-states-health-care-power-of-attorney
bin/test-examples-conformance united-states-health-care-power-of-attorney
bin/test-e2e --html united-states-health-care-power-of-attorney
bin/generate-llms-txt.py --check united-states-health-care-power-of-attorney
bin/generate-form-skills.py --check united-states-health-care-power-of-attorney
```

Scoring system: none; a readiness classification (see the spec).
