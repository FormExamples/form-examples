# CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk — Agent Instructions

Clinical prediction tool estimating annual ischaemic-stroke and thromboembolism
risk in adults with non-valvular atrial fibrillation, and guiding oral
anticoagulation. Collects eight weighted criteria via a single continuous
single-page wizard — congestive heart failure (1), hypertension (1), age ≥ 75 (2)
or 65–74 (1), diabetes (1), prior stroke/TIA/thromboembolism (2), vascular
disease (1), female sex category (1) — sums a total of **0–9**, maps it to a risk
band, an estimated annual stroke rate, and an anticoagulation recommendation.
Pairs with **HAS-BLED** (bleeding risk) for the treatment decision.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Lip 2010, ESC, NICE NG196)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `Cha2ds2VascAssessment` TypeScript type — the eight criterion
  inputs (age and sex drive the age and sex-category points) plus context and
  identification fields.
- **Output shape:**
  ```ts
  gradeCha2ds2Vasc(data: Cha2ds2VascAssessment): {
    congestiveHeartFailurePoint: 0 | 1;
    hypertensionPoint: 0 | 1;
    agePoint: 0 | 1 | 2;
    diabetesPoint: 0 | 1;
    strokePoint: 0 | 2;
    vascularDiseasePoint: 0 | 1;
    sexPoint: 0 | 1;
    cha2ds2VascScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    riskBand: 'low' | 'intermediate' | 'high';
    annualStrokeRatePercent: number;
    anticoagulationRecommendation: 'none' | 'consider' | 'recommended';
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive with weighted and mutually-exclusive terms; see spec §4.
  - CHF / hypertension / diabetes / vascular disease → 1 each when present
  - prior stroke / TIA / thromboembolism → 2 when present
  - age ≥ 75 → 2; age 65–74 → 1; age < 75 and ≥ 65 handled as a single band
    (never both)
  - female sex → 1
  - total 0–9 → risk band, with the edge cases: male total 0 = low, female total 1
    (sex point only) = low, male total 1 = intermediate, otherwise high
  - `annualStrokeRatePercent` is a fixed lookup indexed by total score
    (0→0.2, 1→1.3, 2→2.2, 3→3.2, 4→4.0, 5→6.7, 6→9.8, 7→9.6, 8→6.7, 9→15.2)
  - A missing enum input is treated as absent (`no`) and raises a
    data-completeness flag; missing `ageYears` scores 0 for age and flags.
- **Engine files:** `types.ts`, `utils.ts`, `cha2ds2vasc-rules.ts`,
  `cha2ds2vasc-grader.ts`, `flagged-issues.ts`.
- **Tests:** `cha2ds2vasc-grader.test.ts`, `cha2ds2vasc-rules.test.ts` — cover the
  age boundaries (64/65/74/75), mutually-exclusive age bands, the female-total-1
  low-risk case, the male-total-1 intermediate case, and every total 0–9 against
  the stroke-rate lookup.

## Flagged issues

Computed independently of the total (see spec §5): anticoagulation recommended
but none recorded (`riskBand == 'high'`, high), bleeding-risk cross-reference to
HAS-BLED (`riskBand == 'high'`, high), prior stroke / TIA
(`priorStrokeTiaThromboembolism == 'yes'`, high), advanced age
(`ageYears >= 75`, medium), female sex modifier (`sex == 'female'` and total 1,
low), incomplete assessment (any criterion input or `ageYears` missing, low).

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

- Lip G.Y.H. *et al.* Refining Clinical Risk Stratification … *Chest* 2010;
  137(2):263–272.
- Hindricks G. *et al.* 2020 ESC Guidelines for AF. *Eur Heart J* 2021;
  42(5):373–498.
- NICE NG196. *Atrial fibrillation: diagnosis and management* (2021).
- January C.T. *et al.* 2019 AHA/ACC/HRS Focused Update. *Circulation* 2019;
  140(2):e125–e151.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk
```
