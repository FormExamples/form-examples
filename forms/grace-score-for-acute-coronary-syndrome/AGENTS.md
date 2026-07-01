# GRACE Score for Acute Coronary Syndrome — Agent Instructions

Risk-stratification tool for adults with an acute coronary syndrome (chiefly
NSTE-ACS). Collects eight admission variables via a single continuous
single-page wizard — age, heart rate, systolic blood pressure, serum creatinine,
Killip class, cardiac arrest at admission, ST-segment deviation, and elevated
cardiac enzymes / troponin — applies the **GRACE weighted regression point
model**, and produces a point total mapped to an in-hospital and 6-month
mortality band, an overall **Low / Intermediate / High** risk category, and a
recommendation on the timing of an invasive strategy.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (GRACE derivation, GRACE 2.0,
  ESC NSTE-ACS, NICE NG185)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `GraceAssessment` TypeScript type — the eight GRACE variable
  inputs (plus creatinine unit) and the context and identification fields.
- **Output shape:**
  ```ts
  gradeGrace(data: GraceAssessment): {
    gracePoints: number;                       // weighted total, ~0..350+
    inHospitalMortalityBand: 'low' | 'intermediate' | 'high';
    sixMonthMortalityBand: 'low' | 'intermediate' | 'high';
    riskCategory: 'low' | 'intermediate' | 'high';
    invasiveStrategy: string;                  // recommendation keyed on riskCategory
    firedContributors: FiredContributor[];     // per-variable point contribution
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted regression point model (see spec §4) — each variable
  maps through a **weighted, banded lookup** (not a simple sum of yes/no items);
  the points are summed into a total, which is read against the in-hospital
  (≤108 / 109–140 / >140) and 6-month (≤88 / 89–118 / >118) mortality bands. The
  overall `riskCategory` is the worse of the two (max-band rule). Serum
  creatinine is normalised to mg/dL (µmol/L ÷ 88.4) before banding. A missing
  numeric input contributes 0 points and raises a data-completeness flag.
- **Engine files:** `types.ts`, `utils.ts`, `grace-rules.ts`, `grace-grader.ts`,
  `flagged-issues.ts`.
  - `grace-rules.ts` holds the named per-band point lookup tables (age, heart
    rate, systolic BP, creatinine, Killip, and the three yes/no contributors)
    plus the mortality-band thresholds.
  - `utils.ts` holds creatinine unit normalisation and band-lookup helpers.
- **Tests:** `grace-grader.test.ts`, `grace-rules.test.ts` — cover each band
  boundary (age, heart rate, systolic BP, creatinine; Killip I–IV; each yes/no
  contributor), the mortality-band boundaries (108/109, 140/141, 88/89,
  118/119), creatinine unit normalisation, and the max-band rule.

## Flagged issues

Computed independently of the total (see spec §5): high-risk category
(`riskCategory == 'high'`, high), cardiac arrest at admission (high), Killip
class ≥ II (high), hypotension (`systolicBloodPressure < 90`, high), renal
impairment (normalised creatinine ≥ 2.0 mg/dL, medium), ST-segment deviation
(medium), incomplete assessment (any GRACE variable input missing, low).

## Conventions

- Empty string `''` for unanswered text / enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde.
- snake_case in SQL and Rust internals.
- Serum creatinine stores both the raw value and the entered unit; scoring
  normalises to mg/dL.
- Step components named `StepNName.svelte` (1-indexed).
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys via `gen_random_uuid()`.
- `created_at`, `updated_at`, `deleted_at` timestamps on every table.
- Import and export via JSON, XML, CSV, and TSV.
- Generated artefacts (XML, FHIR, protobuf, OpenAPI, Loco setup) are never
  hand-edited.

## Clinical grounding

- Granger C.B. *et al.* GRACE predictors of hospital mortality. *Arch Intern
  Med* 2003; 163(19):2345–2353.
- Fox K.A.A. *et al.* Six-month risk prediction after ACS. *BMJ* 2006;
  333(7578):1091.
- Fox K.A.A. *et al.* GRACE 2.0 derivation and external validation. *BMJ Open*
  2014; 4(2):e004425.
- ESC Guidelines for the management of acute coronary syndromes (2023).
- NICE NG185. *Acute coronary syndromes* (2020).

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form grace-score-for-acute-coronary-syndrome
```
