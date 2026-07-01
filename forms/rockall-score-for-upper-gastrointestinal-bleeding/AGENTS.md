# Rockall Score for Upper Gastrointestinal Bleeding — Agent Instructions

Risk-stratification instrument for adults with acute upper GI bleeding. Collects
three clinical parameters via a single continuous single-page wizard — age,
shock (heart rate and systolic blood pressure), and comorbidity — for a
**pre-endoscopy (clinical) Rockall score of 0–7**, and adds two endoscopic
parameters (diagnosis, stigmata of recent haemorrhage) for a **full
(post-endoscopy) Rockall score of 0–11** when endoscopy has been performed. A
higher score means a higher risk of rebleeding and death; a full score of **≤ 2**
is low risk.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Rockall 1996, NICE CG141)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `RockallAssessment` TypeScript type — the clinical and
  endoscopic parameter inputs plus context and identification fields.
- **Output shape:**
  ```ts
  gradeRockall(data: RockallAssessment): {
    agePoints: 0 | 1 | 2;
    shockPoints: 0 | 1 | 2;
    comorbidityPoints: 0 | 2 | 3;
    clinicalRockallScore: number;      // 0..7
    diagnosisPoints: 0 | 1 | 2;
    stigmataPoints: 0 | 2;
    fullRockallScore: number | null;   // 0..11 or null (no endoscopy)
    riskBand: 'low' | 'intermediate' | 'high' | 'clinical-only';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive per parameter (see spec §4).
  - age: `< 60 → 0`, `60–79 → 1`, `≥ 80 → 2`
  - shock: `SBP < 100 → 2`, else `HR ≥ 100 → 1`, else `0`
  - comorbidity: `none → 0`, `major → 2`, `severe → 3`
  - clinical score = age + shock + comorbidity (0–7)
  - diagnosis: `mallory-weiss-or-none → 0`, `all-other → 1`, `upper-gi-malignancy → 2`
  - stigmata: `none-or-dark-spot → 0`, `high-risk → 2`
  - full score (only when `endoscopyPerformed == 'yes'`) = clinical + diagnosis + stigmata (0–11)
  - band from full score (`≤ 2 low`, `3–4 intermediate`, `≥ 5 high`), else `clinical-only` (clinical 0 → `low`)
- **Engine files:** `types.ts`, `utils.ts`, `rockall-rules.ts`,
  `rockall-grader.ts`, `flagged-issues.ts`.
- **Tests:** `rockall-grader.test.ts`, `rockall-rules.test.ts` — cover each
  threshold boundary (age 59/60/79/80, HR 99/100, SBP 99/100), every enum value,
  and the clinical-only vs full path.

## Flagged issues

Computed independently of the total (see spec §5): high mortality / rebleeding
risk (`fullRockallScore ≥ 5` or `clinicalRockallScore ≥ 3`, high), shock
(`shockPoints ≥ 1`, high), high-risk endoscopic stigmata
(`stigmata == 'high-risk'`, high), upper GI malignancy
(`diagnosis == 'upper-gi-malignancy'`, medium), incomplete assessment (any
clinical numeric input missing, low).

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

- Rockall T.A. *et al.* Risk assessment after acute upper gastrointestinal
  haemorrhage. *Gut* 1996; 38(3):316–321.
- NICE CG141. *Acute upper gastrointestinal bleeding in over 16s: management.*
- Blatchford O. *et al.* A risk score to predict need for treatment for upper
  gastrointestinal haemorrhage. *Lancet* 2000; 356(9238):1318–1321.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form rockall-score-for-upper-gastrointestinal-bleeding
```
