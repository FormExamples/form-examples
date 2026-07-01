# Corrected Calcium Calculator — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `corrected-calcium-calculator`

## 1. Purpose

An albumin-adjusted (corrected) calcium calculator for adults. It takes a
measured total calcium (mmol/L) and serum albumin (g/L), applies the standard
albumin-correction formula, and produces a corrected calcium value in mmol/L.
The corrected value is classified against the adult reference range
(hypocalcaemia / normal / hypercalcaemia), and severe results are flagged for
urgent action. It is an interpretation aid, not a diagnostic test and not a
substitute for a measured ionised calcium.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, calculation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric ranges,
ionised-calcium measurement.

## 3. Data model

A single logical calculation record. Fields default to `''` (text/enum) or
`null` (numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / pharmacist / laboratory-staff / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | general-practice / ward / emergency-department / outpatient / laboratory / other |
| `sampleReference` | text | sample / collection reference |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**Calculation inputs.**

| Field | Type | Notes |
| --- | --- | --- |
| `totalCalcium` | numeric (mmol/L) | measured total serum calcium |
| `albumin` | numeric (g/L) | measured serum albumin |
| `symptomatic` | enum (yes/no) | calcium-related symptoms present (supports symptomatic flag) |

**Derived (never stored as input).** `correctedCalcium`, `classification`,
`flaggedIssues[]`.

## 4. Calculation algorithm

Pure function, no I/O. Reference albumin `REF_ALBUMIN = 40` g/L; adjustment
factor `FACTOR = 0.02` mmol/L per g/L; reference range `LOW = 2.20`,
`HIGH = 2.60` mmol/L.

```
correctedCalcium = (totalCalcium != null && albumin != null)
                   ? totalCalcium + 0.02 × (40 − albumin)
                   : null

classification =
    correctedCalcium == null      -> 'unknown'
    correctedCalcium <  2.20      -> 'hypocalcaemia'
    correctedCalcium <= 2.60      -> 'normal'
    else                          -> 'hypercalcaemia'
```

- Both inputs are required; if either is missing, `correctedCalcium` is `null`,
  `classification` is `'unknown'`, and an incomplete-data flag is raised.
- The corrected value is rounded to two decimal places for display; the unrounded
  value is used for classification and flag thresholds.
- The reference range default is 2.20–2.60 mmol/L. Boundary handling: exactly
  2.20 and exactly 2.60 are `normal`.

## 5. Flagged issues (red flags)

Emitted independently of the classification, each with a priority:

- **Severe hypercalcaemia** (high, urgent) — `correctedCalcium >= 3.0`: risk of
  hypercalcaemic crisis; seek immediate senior / endocrine review.
- **Severe hypocalcaemia** (high, urgent) — `correctedCalcium < 1.9`: risk of
  tetany, seizures, arrhythmia; seek immediate review.
- **Symptomatic hypercalcaemia** (high) — `correctedCalcium > 2.60` and
  `symptomatic == 'yes'`: escalate; correlate polyuria, confusion, arrhythmia.
- **Hypercalcaemia** (medium) — `correctedCalcium > 2.60`: investigate cause
  (parathyroid, malignancy, drugs).
- **Hypocalcaemia** (medium) — `correctedCalcium < 2.20`: investigate cause
  (vitamin D, magnesium, renal, parathyroid).
- **Incomplete data** (low) — `totalCalcium` or `albumin` missing: no corrected
  value can be computed.

## 6. Inputs and outputs

**Input.** A typed calculation object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A result object emitted by the engine:

```ts
{
  correctedCalcium: number | null;   // mmol/L, rounded to 2 dp for display
  classification: 'hypocalcaemia' | 'normal' | 'hypercalcaemia' | 'unknown';
  flaggedIssues: FlaggedIssue[];
}
```

Rendered as HTML in the browser and convertible to FHIR R5 Bundle, XML, JSON,
CSV, or TSV.

## 7. Artefacts

| Subdirectory | Role |
| --- | --- |
| `sql` | source of truth |
| `xml` | generated |
| `fhir` | generated |
| `protobuf` | generated |
| `openapi` | generated |
| `front-end-with-html` | HTML + Lily (wizard + dashboard) |
| `front-end-with-svelte` | SvelteKit (wizard + dashboard) |
| `back-end-with-loco` | Rust + Loco JSON API |
| `back-end-with-loco-setup` | generated scaffold script |

Generated artefacts are never hand-edited; re-run the generators in
[`/AGENTS.md`](../../../AGENTS.md) §Tools after schema changes.

## 8. Acceptance criteria

- `bin/test-form corrected-calcium-calculator` exits cleanly.
- The calculation engine is pure (no side effects, no I/O) and unit-tested,
  covering the correction formula, classification boundaries (2.20 and 2.60), and
  every severity threshold (1.9, 3.0), plus the missing-input path.
- The HTML front-ends conform to the Lily HTML headless contract
  ([`forms/AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md)).
- The SvelteKit front-ends conform to the Lily Svelte headless contract
  ([`forms/AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)) and
  pass `pnpm check` and `pnpm test`.
- The Rust crate builds (`cargo build`) and tests pass (`cargo test`).

## 9. Compliance

Inherits the monorepo compliance baseline: MDCG 2019-11 Rev.1 (EU MDR/IVDR),
UK Medical Devices Regulations 2002, ISO/IEC/IEEE 26514:2022, UK MHRA Software
and AI as a Medical Device. Form-specific classification is recorded in
[`index.md`](../index.md) and [`AGENTS.md`](../AGENTS.md) where it differs from
the baseline.

## 10. References

- [`index.md`](../index.md) — form description and calculation details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form corrected-calcium-calculator
```
