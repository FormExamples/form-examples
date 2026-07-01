# Corrected Calcium Calculator — Agent Instructions

An albumin-adjusted (corrected) calcium calculator for adults. It takes a
measured total calcium (mmol/L) and serum albumin (g/L) via a single continuous
single-page wizard, applies the correction
`correctedCalcium = totalCalcium + 0.02 × (40 − albumin)`, classifies the result
against the adult reference range 2.20–2.60 mmol/L (hypocalcaemia / normal /
hypercalcaemia), and flags severe results (≥ 3.0 or < 1.9 mmol/L) as urgent.

See [`index.md`](./index.md) for the full design and the assessment-step table,
and [`spec/index.md`](./spec/index.md) for the living domain spec.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./spec/` — living domain spec (`index.md` + `README.md` symlink)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — clinical reference documentation (Payne formula, ACB guidance)
- `./sql/` — Liquibase-formatted PostgreSQL schema (source of truth)
- `./xml/` — generated XML + DTD per SQL table
- `./fhir/` — generated FHIR HL7 R5 JSON per SQL entity
- `./protobuf/` — generated Protocol Buffers `.proto` schemas
- `./openapi/` — generated OpenAPI 3.1 specifications
- `./front-end-with-html/` — consolidated HTML wizard + dashboard (Lily)
- `./front-end-with-svelte/` — consolidated SvelteKit wizard + dashboard (Lily)
- `./back-end-with-loco/` — Rust axum + Loco JSON API

## Calculation engine

- **Input shape:** `CorrectedCalciumAssessment` TypeScript type — the two
  numeric inputs (`totalCalcium`, `albumin`), the `symptomatic` flag, plus
  context and identification fields.
- **Output shape:**
  ```ts
  calculateCorrectedCalcium(data: CorrectedCalciumAssessment): {
    correctedCalcium: number | null;   // mmol/L, rounded to 2 dp for display
    classification: 'hypocalcaemia' | 'normal' | 'hypercalcaemia' | 'unknown';
    flaggedIssues: FlaggedIssue[];
  }
  ```
- **Algorithm:** apply `totalCalcium + 0.02 × (40 − albumin)` when both inputs
  are present, else `null`. Classify against 2.20 / 2.60 boundaries (both
  boundaries inclusive-to-normal). See spec §4. The unrounded value is used for
  classification and flag thresholds; the rounded value is for display only.
- **Engine files:** `types.ts`, `utils.ts`, `calcium-rules.ts`,
  `calcium-calculator.ts`, `flagged-issues.ts`.
- **Tests:** `calcium-calculator.test.ts`, `calcium-rules.test.ts` — cover the
  correction formula, classification boundaries (2.20, 2.60), severity thresholds
  (1.9, 3.0), and the missing-input path.

## Flagged issues

Computed from the corrected value (see spec §5): severe hypercalcaemia
(`>= 3.0`, high/urgent), severe hypocalcaemia (`< 1.9`, high/urgent), symptomatic
hypercalcaemia (`> 2.60` and `symptomatic == 'yes'`, high), hypercalcaemia
(`> 2.60`, medium), hypocalcaemia (`< 2.20`, medium), incomplete data (either
input missing, low).

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

- Payne R.B. *et al.* Interpretation of serum calcium in patients with abnormal
  serum proteins. *BMJ* 1973; 4:643–646.
- Association for Clinical Biochemistry and Laboratory Medicine (ACB) — adjusted
  (corrected) calcium guidance.
- NICE Clinical Knowledge Summaries — *Hypercalcaemia*, *Hypocalcaemia*.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification).
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device.*

## Verify

```sh
bin/test-form corrected-calcium-calculator
```
