# National Early Warning Score 2 (NEWS2) — agent instructions

UK NHS–aligned implementation of the **National Early Warning Score 2 (NEWS2)**,
the Royal College of Physicians' (RCP, 2017) standardized track-and-trigger early
warning system. A clinician records six physiological parameters via a single
continuous single-page wizard; the engine scores each parameter 0–3, adds a
supplemental-oxygen weighting, aggregates to **0–20+**, applies the red-score
rule, and returns the clinical-risk band with the RCP-recommended monitoring
frequency and escalation response plus safety flags.

See [`index.md`](./index.md) for the full design, the parameter point-allocation
table, and the aggregate risk bands.

## Directory map

- `./index.md` — project overview and scoring detail
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (RCP NEWS2 report, chart, scoring)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` per SQL entity
- `./openapi/` — generated OpenAPI 3.1 YAML per SQL entity
- `./front-end-with-html/` — HTML + Lily wizard (`index.html`) + dashboard
- `./front-end-with-svelte/` — SvelteKit wizard + dashboard (RESTful routes)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Source of truth

`sql/` is the schema source of truth. After editing it, regenerate derived
artefacts (XML, FHIR R5, protobuf, OpenAPI, Loco setup, examples, `spec/`,
`CHANGELOG.md`) with the repo generators in `bin/` — never hand-edit generated
files.

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

## Key rules

- **Red score** — any single parameter scoring 3 escalates to at least the
  low-medium band (1-hourly, urgent ward-clinician review) even when the
  aggregate is 1–4.
- **SpO₂ Scale 2** — used only for a prescribed 88–92 % target (e.g. hypercapnic
  respiratory failure); requires clinician endorsement recorded in context.
- **ACVPU** — new-onset confusion is treated identically to V/P/U (score 3).
- **Out of scope** — age < 16, pregnancy, spinal-cord injury: raise
  `out-of-scope`; do not present the score as validated.

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`; `created_at` / `updated_at` /
  `deleted_at` timestamps on every table.
- Single continuous single-page wizard — no multi-page forms.
- Import and export via JSON, XML, CSV, and TSV.

## Clinical grounding

- Royal College of Physicians. *National Early Warning Score (NEWS) 2* (2017) —
  see `doc/`.
- NHS England — NEWS adoption across acute and ambulance trusts.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — Class IIa where output
  drives monitoring frequency and escalation of care.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.

## Verify

```sh
bin/test-form national-early-warning-score-2
```
