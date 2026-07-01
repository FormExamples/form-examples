# TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI) — Agent Instructions

Risk-stratification tool for adults with unstable angina (UA) or NSTEMI.
Collects seven clinical criteria via a single continuous single-page wizard —
age ≥ 65; ≥ 3 coronary risk factors; known CAD (stenosis ≥ 50%); aspirin in the
prior 7 days; ≥ 2 anginal episodes in 24 h; ST deviation ≥ 0.5 mm; positive
cardiac marker — awards 1 point each, sums a total of 0–7, and maps that total
to a risk band (0–1 low, 2–4 intermediate, 5–7 high) and a 14-day risk of death,
MI, or urgent revascularisation.

A **separate TIMI STEMI score exists**; this form is the UA/NSTEMI version only.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Antman TIMI 11B / ESSENCE, NICE NG185)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Scoring engine

- **Input shape:** `TimiAssessment` TypeScript type — the seven criterion inputs
  (age plus the risk-factor and clinical yes/no flags) plus context and
  identification fields.
- **Output shape:**
  ```ts
  gradeTimi(data: TimiAssessment): {
    agePoint: 0 | 1;
    riskFactorCount: 0 | 1 | 2 | 3 | 4 | 5;
    riskFactorPoint: 0 | 1;
    knownCadPoint: 0 | 1;
    aspirinPoint: 0 | 1;
    anginaPoint: 0 | 1;
    stDeviationPoint: 0 | 1;
    cardiacMarkerPoint: 0 | 1;
    timiScore: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    riskBand: 'low' | 'intermediate' | 'high';
    fourteenDayRiskPercent: number;
    firedCriteria: FiredCriterion[];
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** additive — each of the seven criteria contributes 0 or 1; the
  total 0–7 determines the band (`≤ 1` low, `2–4` intermediate, `≥ 5` high) and a
  lookup of the 14-day composite-event risk. See spec §4. Criterion 2 fires when
  **≥ 3** of the five risk factors are `yes`. A missing input counts as absent
  (0 points) and raises a data-completeness flag.
  - age ≥ 65 → 1
  - ≥ 3 of {hypertension, hypercholesterolaemia, diabetes, current smoking,
    family history of premature CAD} → 1
  - known CAD (stenosis ≥ 50%) → 1
  - aspirin in prior 7 days → 1
  - ≥ 2 anginal episodes in 24 h → 1
  - ST deviation ≥ 0.5 mm → 1
  - positive cardiac marker (troponin / CK-MB) → 1
- **Engine files:** `types.ts`, `utils.ts`, `timi-rules.ts`, `timi-grader.ts`,
  `flagged-issues.ts`.
- **Tests:** `timi-grader.test.ts`, `timi-rules.test.ts` — cover the age
  boundary (64/65), the risk-factor threshold (2/3 factors), each band
  transition (1→2, 4→5), and every total 0–7 with its mapped 14-day risk.

## Flagged issues

Computed independently of the total (see spec §5): high-risk score
(`timiScore >= 5`, high), positive troponin with ST deviation
(`positiveCardiacMarker == 'yes'` and `stDeviation == 'yes'`, high), positive
cardiac marker (high), ST deviation (medium), intermediate-risk score
(`timiScore` 2–4, medium), incomplete assessment (any criterion input missing,
low).

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

- Antman E.M. *et al.* The TIMI Risk Score for Unstable Angina/Non-ST Elevation
  MI. *JAMA* 2000; 284(7):835–842.
- Morrow D.A. *et al.* TIMI Risk Score for STEMI. *Circulation* 2000;
  102(17):2031–2037 (the separate STEMI instrument).
- NICE NG185. *Acute coronary syndromes.*
- Collet J-P. *et al.* 2020 ESC Guidelines for the management of ACS without
  persistent ST-segment elevation. *Eur Heart J* 2021; 42(14):1289–1367.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form timi-risk-score-for-acute-coronary-syndrome
```
