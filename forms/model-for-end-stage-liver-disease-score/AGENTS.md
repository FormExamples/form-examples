# Model for End-Stage Liver Disease (MELD) Score — Agent Instructions

Laboratory-based severity calculator for chronic liver disease. Collects total
bilirubin, INR, serum creatinine, and (for MELD-Na) serum sodium via a single
continuous single-page wizard, applies a weighted logarithmic formula with a
dialysis creatinine rule and value bounds, and produces an integer score of
**6–40** mapped to an estimated 3-month mortality band. A higher score means
more severe disease and higher transplant-list priority.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (MELD, MELD-Na, MELD 3.0)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Calculation engine

- **Input shape:** `MeldAssessment` TypeScript type — the laboratory inputs
  (bilirubin + unit, INR, creatinine + unit, dialysis sessions, CVVHD flag,
  sodium, albumin) plus context and identification fields (including
  `meldVariant`).
- **Output shape:**
  ```ts
  calculateMeld(data: MeldAssessment): {
    bilirubinMgDl: number | null;
    creatinineMgDl: number | null;
    creatinineAdjusted: number | null;
    dialysisRuleApplied: boolean;
    meldScore: number | null;          // 6..40 when computable
    mortalityBand: 'low' | 'moderate' | 'high' | 'very-high' | 'extreme' | '';
    estimatedMortalityPercent: number | null;
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** weighted logarithmic formula (see spec §4). Convert units to
  mg/dL; apply the dialysis rule (≥ 2 haemodialysis sessions in the past 7 days
  **or** ≥ 24 h CVVHD → creatinine set to 4.0); lower-bound bilirubin, INR, and
  creatinine to 1.0 and cap creatinine at 4.0; compute
  `3.78·ln(bili) + 11.2·ln(inr) + 9.57·ln(creat) + 6.43`; for MELD-Na add the
  sodium correction (sodium clamped 125–137, applied when base MELD > 11); for
  MELD 3.0 add sex and albumin terms; round and clamp to 6–40; map to a
  mortality band.
- **Engine files:** `types.ts`, `utils.ts`, `meld-rules.ts`,
  `meld-calculator.ts`, `flagged-issues.ts`.
- **Tests:** `meld-calculator.test.ts`, `meld-rules.test.ts` — cover the lower
  bound (< 1.0 → 1.0), the creatinine cap (4.0), the dialysis rule, unit
  conversion, the 6–40 clamp, the MELD-Na sodium correction (`meld > 11` gate,
  125–137 bounds), and each mortality-band boundary.

## Flagged issues

Computed alongside the score (see spec §5): transplant referral
(`meldScore ≥ 15`, high), urgent review (`meldScore ≥ 30`, high), on dialysis /
renal failure (dialysis rule applied, high), hyponatraemia (`sodium < 130`,
medium), coagulopathy (`inr ≥ 2.5`, medium), incomplete assessment (a required
lab input missing, low → no score produced).

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

- Malinchoc M. *et al.* Model to predict poor survival after TIPS. *Hepatology*
  2000; 31(4):864–871.
- Kamath P.S. *et al.* A model to predict survival in patients with end-stage
  liver disease. *Hepatology* 2001; 33(2):464–470.
- Kim W.R. *et al.* Hyponatremia and mortality on the liver-transplant waiting
  list. *NEJM* 2008; 359(10):1018–1026.
- Kim W.R. *et al.* MELD 3.0. *Gastroenterology* 2021; 161(6):1887–1895.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form model-for-end-stage-liver-disease-score
```
