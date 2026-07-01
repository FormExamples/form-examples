# Modified Early Warning Score (MEWS) — Agent Instructions

Bedside aggregate track-and-trigger score for adult inpatients. Collects five
physiological observations via a single continuous single-page wizard — systolic
blood pressure, heart rate, respiratory rate, temperature, and AVPU level of
consciousness — allocates each a sub-score of 0–3, sums an aggregate of 0–14,
and flags **aggregate ≥ 5** or **any single parameter = 3** as a trigger for
urgent medical review and critical-care outreach.

MEWS predates and is superseded by NEWS2 in the UK; cross-reference the sibling
form [`national-early-warning-score-2`](../national-early-warning-score-2/index.md).

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Subbe 2001, NICE CG50, NEWS2)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `MewsObservation` TypeScript type — the five parameter inputs
  plus context, identification, and optional `previousMewsScore`.
- **Output shape:**
  ```ts
  gradeMews(data: MewsObservation): {
    systolicBloodPressurePoint: 0 | 1 | 2 | 3;
    heartRatePoint: 0 | 1 | 2 | 3;
    respiratoryRatePoint: 0 | 1 | 2 | 3;
    temperaturePoint: 0 | 1 | 2 | 3;
    avpuPoint: 0 | 1 | 2 | 3;
    mewsScore: number;              // 0..14
    riskBand: 'low' | 'medium' | 'high';
    singleParameterTrigger: boolean;
    firedParameters: FiredParameter[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** each parameter maps its measured value to a 0–3 sub-score via
  the Subbe (2001) allocation table; the sub-scores sum to the aggregate 0–14.
  `riskBand` is `high` (≥ 5), `medium` (2–4), or `low` (0–1);
  `singleParameterTrigger` is true when any sub-score equals 3. See spec §4. A
  missing numeric input contributes 0 points and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `mews-rules.ts`, `mews-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `mews-grader.test.ts`, `mews-rules.test.ts` — cover every allocation
  band boundary (SBP 70/71, 80/81, 100/101, 199/200; HR 40/41, 50/51, 100/101,
  110/111, 129/130; RR 8/9, 14/15, 20/21, 29/30; temperature 34.9/35.0,
  38.4/38.5; each AVPU level), the aggregate band edges (1/2, 4/5), and the
  single-parameter=3 trigger.

## Flagged issues

Computed independently of the aggregate (see spec §5): aggregate escalation
(`mewsScore >= 5`, high), single-parameter trigger (any sub-score = 3, high),
deteriorating trend (`mewsScore > previousMewsScore`, high), hypotension
(`SBP <= 100`, high), reduced consciousness (`avpu != alert`, high), tachypnoea /
bradypnoea (medium), tachycardia / bradycardia (medium), pyrexia / hypothermia
(medium), incomplete observation (any parameter input missing, low).

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

- Subbe C.P. *et al.* Validation of a modified Early Warning Score in medical
  admissions. *QJM* 2001; 94(10):521–526.
- Royal College of Physicians. *National Early Warning Score (NEWS2)* (2017).
- NICE CG50. *Acutely ill adults in hospital: recognising and responding to
  deterioration.*

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form modified-early-warning-score
```
