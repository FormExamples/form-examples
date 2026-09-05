---
name: national-early-warning-score-2-maintainer-skill
description: "Implementation workflow for maintaining and extending the National Early Warning Score 2 (NEWS2) form (forms/national-early-warning-score-2/) — editing its spec, schema, or engine, regenerating derived artefacts, and running its verify gates. Use when implementing a change to this form's spec, SQL schema, front-end, back-end, or personas. For the repo-wide workflow, use form-examples-maintainer-skill instead."
---

# National Early Warning Score 2 (NEWS2) — Maintainer Skill

Implementation-facing companion to `national-early-warning-score-2-skill` (this form's end-user concepts skill) and to `form-examples-maintainer-skill` (the repo-wide maintainer skill — read that one first for the golden rule, generators, and the full verify-gate catalogue). This skill is the one-form-scoped map.

## Directory layout

`forms/national-early-warning-score-2/` contains:

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

- **Input shape:** `News2Assessment` — patient identity, assessment context
  (including `spo2Scale`), and the six observations.
  ```ts
  type Acvpu = 'alert' | 'confusion' | 'voice' | 'pain' | 'unresponsive';
  interface News2Assessment {
    spo2Scale: 'scale1' | 'scale2';
    respirationRate: number | null; // breaths/min
    spo2: number | null;            // %
    airOrOxygen: 'air' | 'oxygen' | '';
    systolicBp: number | null;      // mmHg
    pulse: number | null;           // beats/min
    consciousness: Acvpu | '';
    temperature: number | null;     // °C
  }
  ```
- **Output shape:**
  ```ts
  gradeNews2(data: News2Assessment): {
    subscores: {
      respirationRate: 0 | 1 | 2 | 3 | null;
      spo2: 0 | 1 | 2 | 3 | null;
      airOrOxygen: 0 | 2;
      systolicBp: 0 | 1 | 2 | 3 | null;
      pulse: 0 | 1 | 2 | 3 | null;
      consciousness: 0 | 3 | null;
      temperature: 0 | 1 | 2 | 3 | null;
    };
    aggregate: number;                // 0..20+
    redScore: boolean;                // any single parameter == 3
    riskBand: 'low' | 'low-medium' | 'medium' | 'high';
    monitoringFrequency: string;      // e.g. '12-hourly', '1-hourly', 'continuous'
    recommendation: string;
    firedRules: FiredRule[];
    flags: Flag[];
  };
  ```
- **Algorithm:** score each parameter to 0–3 via the published bands; `spo2` uses
  Scale 1 or Scale 2 per `spo2Scale`, with Scale 2 also depending on
  `airOrOxygen`. `airOrOxygen` adds 2 for `oxygen`. `consciousness` scores 3 for
  any value other than `alert`. `aggregate` is the sum of all subscores.
  `redScore` is true when any single parameter subscore is 3. The `riskBand` is
  the **worst** of the aggregate band (0 / 1–4 / 5–6 / ≥7) and the red-score band
  (max-severity), which drives `monitoringFrequency` and `recommendation`.
- **Engine files:** `types.ts`, `utils.ts`, `news2-rules.ts` (per-parameter band
  tables + Scale 1 / Scale 2 SpO₂ logic), `news2-grader.ts` (aggregate + band +
  monitoring/response), `flagged-issues.ts` (safety flags).
- **Tests:** `news2-grader.test.ts`, `news2-rules.test.ts` — cover the published
  RCP worked examples for both SpO₂ scales, boundary values on every band, and
  the red-score escalation.

## Verify

```sh
bin/test-form national-early-warning-score-2
bin/test-sql-apply national-early-warning-score-2
bin/test-personas national-early-warning-score-2
bin/test-e2e --html national-early-warning-score-2
```

## See also

- [`../../AGENTS.md`](../../AGENTS.md) — this form's agent instructions.
- [`../../spec/index.md`](../../spec/index.md) — living domain spec.
- [`../../tasks.md`](../../tasks.md) — task tracking.
- [`../../../../AGENTS.md`](../../../../AGENTS.md) — repo-wide tool catalogue and verify gates.
