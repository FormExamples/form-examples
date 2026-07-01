# Glasgow-Blatchford Bleeding Score (GBS) — Agent Instructions

Pre-endoscopy risk-stratification score for adults with suspected acute upper
gastrointestinal bleeding. Collects eight weighted admission parameters via a
single continuous single-page wizard — blood urea, haemoglobin (sex-specific),
systolic blood pressure, pulse, melaena, syncope, hepatic disease, and cardiac
failure — and sums them into a total of **0–23**. A score of **0** (or **≤ 1** by
local policy) flags a very-low-risk patient who may be considered for outpatient
management or discharge; higher scores prompt admission and endoscopy.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Blatchford 2000, NICE CG141)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `GbsAssessment` TypeScript type — the eight parameter inputs
  plus context and identification fields (including `sex`, which selects the
  haemoglobin band table).
- **Output shape:**
  ```ts
  gradeGbs(data: GbsAssessment): {
    bloodUreaPoints: 0 | 2 | 3 | 4 | 6;
    haemoglobinPoints: 0 | 1 | 3 | 6;
    systolicBloodPressurePoints: 0 | 1 | 2 | 3;
    pulsePoint: 0 | 1;
    melaenaPoint: 0 | 1;
    syncopePoint: 0 | 2;
    hepaticDiseasePoint: 0 | 2;
    cardiacFailurePoint: 0 | 2;
    gbsScore: number; // 0..23
    riskBand: 'very-low' | 'low-moderate' | 'high';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted additive — each parameter contributes points by band
  (see spec §4); the total 0–23 determines the risk band (`0` → `very-low`,
  `1–5` → `low-moderate`, `≥ 6` → `high`). Haemoglobin uses sex-specific bands.
  A missing numeric input contributes 0 points and raises a data-completeness
  flag; unknown sex falls back to the female haemoglobin table.
  - blood urea: <6.5→0, 6.5–7.9→2, 8.0–9.9→3, 10.0–24.9→4, ≥25.0→6
  - haemoglobin (men): ≥130→0, 120–129→1, 100–119→3, <100→6
  - haemoglobin (women): ≥120→0, 100–119→1, <100→6
  - systolic BP: ≥110→0, 100–109→1, 90–99→2, <90→3
  - pulse ≥100→1; melaena→1; syncope→2; hepatic disease→2; cardiac failure→2
- **Engine files:** `types.ts`, `utils.ts`, `gbs-rules.ts`, `gbs-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `gbs-grader.test.ts`, `gbs-rules.test.ts` — cover every band
  boundary (urea 6.4/6.5, 7.9/8.0, 9.9/10.0, 24.9/25.0; Hb 99/100, 119/120,
  129/130 for both sexes; SBP 89/90, 99/100, 109/110; pulse 99/100) and the
  total endpoints 0 and 23.

## Flagged issues

Computed independently of the total (see spec §5): high-risk bleed
(`gbsScore ≥ 6`, high), shock / hypotension (`SBP < 90` or `pulse ≥ 100`, high),
severe anaemia (`Hb < 100`, high), syncope (`syncope = yes`, medium), very low
risk (`gbsScore == 0`, info — consider discharge), incomplete assessment (any
parameter input missing or unknown sex, low).

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

- Blatchford O., Murray W.R., Blatchford M. A risk score to predict need for
  treatment for upper-gastrointestinal haemorrhage. *Lancet* 2000;
  356(9238):1318–1321.
- NICE CG141. *Acute upper gastrointestinal bleeding in over 16s: management.*
- Stanley A.J. *et al.* Comparison of risk scoring systems for patients
  presenting with upper gastrointestinal bleeding. *BMJ* 2017; 356:i6432.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form glasgow-blatchford-bleeding-score
```
