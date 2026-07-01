# Apgar Score — Agent Instructions

A rapid assessment of a newborn's condition in the first minutes after birth.
Collects five signs via a single continuous single-page wizard — Appearance
(skin colour), Pulse (heart rate), Grimace (reflex irritability), Activity
(muscle tone), Respiration — each scored 0/1/2, summed to a total of 0–10 at
each timepoint (1 minute, 5 minutes, and 10 minutes when the 5-minute total is
below 7). Each total maps to a band (7–10 reassuring, 4–6 moderately low, 0–3
low), and the trend across timepoints is reported.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Apgar 1953, RCUK NLS, NICE NG235)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `ApgarAssessment` TypeScript type — birth context,
  identification, resuscitation notes, and a repeated array of per-timepoint
  five-sign scores.
- **Output shape:**
  ```ts
  gradeApgar(data: ApgarAssessment): {
    timepoints: Array<{
      timepointMinutes: number;
      total: number;                                   // 0..10
      band: 'reassuring' | 'moderately-low' | 'low';
    }>;
    trend: 'improving' | 'static' | 'falling' | 'insufficient';
    firedSigns: FiredSign[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — per timepoint, sum the five signs (each 0/1/2) to a
  total of 0–10; the total determines the band (`>= 7` reassuring, `4–6`
  moderately low, `<= 3` low). The trend compares consecutive scored timepoints.
  See spec §4. A missing sign contributes 0 and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `apgar-rules.ts`, `apgar-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `apgar-grader.test.ts`, `apgar-rules.test.ts` — cover each band
  boundary (totals 3/4, 6/7), every trend direction, and the conditional
  10-minute rule.

## Flagged issues

Computed independently of the totals (see spec §5): resuscitation required
(any total ≤ 3, high), continue scoring (5-minute total < 7, high), falling
trend (a later total below an earlier total, high), support and stimulation
(any total 4–6, medium), missing 10-minute score (5-minute < 7 without a
10-minute record, medium), incomplete assessment (any sign missing at a scored
timepoint, low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Apgar V. A proposal for a new method of evaluation of the newborn infant.
  *Curr Res Anesth Analg* 1953; 32(4):260–267.
- American Academy of Pediatrics & ACOG. *The Apgar Score* (Committee Opinion).
- Resuscitation Council UK. *Newborn Life Support* guidelines.
- NICE NG235. *Intrapartum care* (2023).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form apgar-score
```
</content>
