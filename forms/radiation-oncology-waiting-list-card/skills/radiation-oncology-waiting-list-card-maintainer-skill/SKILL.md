---
name: radiation-oncology-waiting-list-card-maintainer-skill
description: "Implementation workflow for maintaining and extending the Radiation Oncology Waiting List Card form (forms/radiation-oncology-waiting-list-card/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# Radiation Oncology Waiting List Card — Maintainer Skill

Implementation-facing companion to `radiation-oncology-waiting-list-card-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/radiation-oncology-waiting-list-card/` contains:

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |

Generated artefacts (`xml`, `fhir`, `protobuf`, `openapi`, the Loco setup script, `CHANGELOG.md`, `examples/assessment.json`) are never hand-edited — regenerate them instead; see the tool catalogue in [`/AGENTS.md`](../../../../AGENTS.md).

## Scoring engine

- **Input shape:** `WaitingListCard` TypeScript type containing practitioner,
  patient, referral, waiting-list-entry, appointment, communication, and
  sign-off fields.
- **Output shape:**

  ```ts
  calculateWaitingTimeStatus(card: WaitingListCard): {
    waitingTimeStatus: 'within-target' | 'approaching-breach' | 'breached' | 'long-wait';
    clinicalPriority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
    daysWaited: number;
    weeksWaited: number;
    daysToTarget: number | null;
    daysToBreach: number | null;
    daysToAppointment: number | null;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```

- **Algorithm:** the worst-band finding sets the Waiting Time Status; the
  clinical priority drives the target wait used in the days-to-target /
  days-to-breach calculation.
- **Engine files:** `types.ts`, `utils.ts`, `priority-targets.ts`,
  `waiting-time-rules.ts`, `composite-grader.ts`, `flagged-issues.ts`.
- **Tests:** `composite-grader.test.ts`, `waiting-time-rules.test.ts`.

## Verify

```sh
bin/test-form radiation-oncology-waiting-list-card
bin/test-sql-apply radiation-oncology-waiting-list-card
bin/test-personas radiation-oncology-waiting-list-card
bin/test-e2e --html radiation-oncology-waiting-list-card
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
