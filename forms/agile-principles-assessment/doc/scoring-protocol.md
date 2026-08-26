# Scoring Protocol

This document specifies how the engine consumes the assessment object
and produces a maturity verdict, per-principle bands, fired rules, and
operational flags.

## Inputs

The engine consumes an `AgileAssessment` TypeScript object:

```ts
type AgileAssessment = {
  respondent: { name, role, team, organisation, assessmentDate };
  principles: {
    p01: PrincipleResponse;
    p02: PrincipleResponse;
    // ... through p12
  };
};

type PrincipleResponse = {
  score: 1 | 2 | 3 | 4 | 5 | null;  // null = unanswered
  comment: string;
};
```

## Per-principle band

| Score | Band |
| --- | --- |
| 4 or 5 | `high` (principle is well-adopted) |
| 3 | `mid` (principle is partially adopted) |
| 1 or 2 | `low` (principle is weak or absent) |
| `null` | `unanswered` |

## Composite maturity

The composite maturity is the unweighted mean of the answered principle
scores.

```ts
const answered = principlesArray.filter(p => p.score !== null);
const meanScore = answered.length >= 6
  ? answered.reduce((s, p) => s + p.score, 0) / answered.length
  : null;
```

If fewer than 6 principles are answered the composite is reported as
`insufficient-data`.

| Maturity | Mean score |
| --- | --- |
| `optimising` | ≥ 4.50 |
| `mature` | 3.75–4.49 |
| `developing` | 3.00–3.74 |
| `initial` | 2.00–2.99 |
| `ad-hoc` | < 2.00 |
| `insufficient-data` | fewer than 6 answered |

## Fired rules

Each principle scoring at or below 2 fires a per-principle coaching rule.
Principles scoring at or below 3 emit a "mid" advisory rule.

| Rule | Trigger | Coaching focus |
| --- | --- | --- |
| `rule_customer_disconnect` | P1 ≤ 2 | Customer engagement |
| `rule_change_resistance` | P2 ≤ 2 | Change tolerance |
| `rule_slow_delivery` | P3 ≤ 2 | Sprint cadence |
| `rule_silo_collaboration` | P4 ≤ 2 | Business-dev daily collaboration |
| `rule_motivation_morale` | P5 ≤ 2 | Team health |
| `rule_communication_gap` | P6 ≤ 2 | Face-to-face / video communication |
| `rule_output_not_outcome` | P7 ≤ 2 | Outcome measurement |
| `rule_burnout` | P8 ≤ 2 | Sustainable pace |
| `rule_technical_debt` | P9 ≤ 2 | Technical excellence and design |
| `rule_scope_creep` | P10 ≤ 2 | Simplicity (maximizing work not done) |
| `rule_command_and_control` | P11 ≤ 2 | Self-organizing teams |
| `rule_no_retrospective` | P12 ≤ 2 | Regular reflection |

## Additional flags

Flags are computed independently of fired rules and surface high-impact
operational concerns:

| Category | Trigger | Priority |
| --- | --- | --- |
| Customer-disconnect risk | P1 ≤ 2 | high |
| Change-resistance | P2 ≤ 2 | high |
| Slow-delivery | P3 ≤ 2 | medium |
| Silo-collaboration | P4 ≤ 2 | high |
| Motivation/morale risk | P5 ≤ 2 | high |
| Communication-gap | P6 ≤ 2 | medium |
| Output-not-outcome | P7 ≤ 2 | medium |
| Burnout risk | P8 ≤ 2 | high |
| Technical-debt risk | P9 ≤ 2 | high |
| Scope-creep / over-engineering | P10 ≤ 2 | medium |
| Command-and-control | P11 ≤ 2 | high |
| No-retrospective | P12 ≤ 2 | high |
| Critical principle gap | any principle = 1 | high |
| Insufficient data | fewer than 6 principles answered | medium |

## Output

The engine returns:

```ts
{
  answeredCount: number;       // 0..12
  meanScore: number | null;    // null if < 6 answered
  maturity: MaturityLevel;
  perPrincipleBands: BandPerPrinciple[];
  firedRules: FiredRule[];
  additionalFlags: AdditionalFlag[];
}
```

## Action plan

The summary step (Step 14) emits a three-action recommendation derived
from the highest-priority flags:

1. Pick the highest-priority flag.
2. Map to the corresponding principle.
3. Pull the recommended first action from the static coaching catalogue.

The catalogue references:

- *The Scrum Guide* for cadence and team-roles actions
  (<https://scrumguides.org/>).
- *Manifesto for Agile Software Development*
  (<https://agilemanifesto.org/>) for the foundational value
  re-statement actions.
- Lean / TPS literature for waste-reduction and process-improvement
  actions.

## Algorithm verification

The engine has Vitest unit tests in `composite-grader.test.ts` and
`maturity-rules.test.ts`. The Rust backend mirrors the TypeScript engine
with parity tests against golden fixtures.

## Use in retrospectives

The output is designed to seed retrospective items or a coaching
backlog. The dashboard surfaces a per-team historical view so
multi-cycle trends can be reviewed at the Sprint Review and the team's
overall retrospective rhythm.
