# Anion Gap Calculator — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `anion-gap-calculator`

## 1. Purpose

A point-of-care calculator that computes the serum anion gap from a routine
electrolyte panel, derives an albumin-corrected anion gap, and classifies the
result as **low**, **normal**, **high**, or **very high**. A high anion gap is
the laboratory signature of a high anion gap metabolic acidosis (HAGMA) and
prompts a structured differential (GOLDMARK / MUDPILES). It is a calculator and
decision-support prompt, not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, calculation engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, paediatric reference
ranges, arterial blood-gas interpretation.

## 3. Data model

A single logical calculation record. Fields default to `''` (text/enum) or
`null` (numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | doctor / nurse / scientist / pharmacist / other |
| `calculatedAt` | timestamp | date and time of calculation |
| `careSetting` | enum | emergency-department / ward / intensive-care / laboratory / other |
| `clinicalContext` | text | indication / clinical context |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**Calculation inputs (mmol/L unless noted).**

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `sodium` | numeric (mmol/L) | yes | serum sodium |
| `chloride` | numeric (mmol/L) | yes | serum chloride |
| `bicarbonate` | numeric (mmol/L) | yes | serum bicarbonate (HCO₃⁻) |
| `potassium` | numeric (mmol/L) | no | serum potassium; selects the potassium-inclusive formula and reference range |
| `albumin` | numeric (g/L) | no | serum albumin; enables the albumin correction |

**Derived (never stored as input).** `includesPotassium`, `anionGap`,
`correctedAnionGap` (nullable), `classificationValue`, `normalLow`,
`normalHigh`, `classificationBand`, `flaggedIssues[]`.

## 4. Calculation algorithm

Pure function, no I/O. All electrolytes in mmol/L; albumin in g/L.

```
includesPotassium = potassium != null

anionGap = includesPotassium
             ? (sodium + potassium) − (chloride + bicarbonate)
             :  sodium              − (chloride + bicarbonate)

correctedAnionGap = albumin != null
                      ? anionGap + 0.25 × (40 − albumin)
                      : null

normalLow  = 8
normalHigh = includesPotassium ? 16 : 12

classificationValue = correctedAnionGap != null ? correctedAnionGap : anionGap

classificationBand =
    classificationValue >= 20            ? 'very-high'
  : classificationValue >  normalHigh    ? 'high'
  : classificationValue <  normalLow     ? 'low'
  :                                        'normal'
```

- `anionGap` is `null` when any required input (`sodium`, `chloride`,
  `bicarbonate`) is missing; classification and flags are then suppressed and an
  incomplete-assessment flag is raised.
- The classification uses the **corrected** gap when an albumin is available,
  otherwise the raw gap, so hypoalbuminaemia does not mask a raised gap.
- The `very-high` band (`>= 20 mmol/L`) is a subset of `high` for escalation
  purposes.

## 5. Flagged issues (red flags)

Emitted independently, each with a priority:

- **Very high anion gap** (urgent) — `classificationValue >= 20`: marked
  elevation; urgent search for the cause of the metabolic acidosis.
- **High anion gap** (high) — `normalHigh < classificationValue < 20`:
  investigate a high anion gap metabolic acidosis; work through the GOLDMARK /
  MUDPILES differential.
- **Hypoalbuminaemia masking a raised gap** (high) — raw `anionGap <= normalHigh`
  but `correctedAnionGap > normalHigh`: the uncorrected gap looks normal but the
  albumin-corrected gap is raised.
- **Low anion gap** (medium) — `classificationValue < normalLow`: consider
  hypoalbuminaemia (if uncorrected), laboratory error, paraproteinaemia, or
  lithium / bromide toxicity.
- **Incomplete calculation** (low) — any of `sodium`, `chloride`, `bicarbonate`
  missing: the anion gap cannot be computed; complete the panel.

## 6. Inputs and outputs

**Input.** A typed calculation object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A result object emitted by the engine:

```ts
{
  includesPotassium: boolean;
  anionGap: number | null;
  correctedAnionGap: number | null;
  normalLow: number;
  normalHigh: number;
  classificationValue: number | null;
  classificationBand: 'low' | 'normal' | 'high' | 'very-high' | null;
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

- `bin/test-form anion-gap-calculator` exits cleanly.
- The calculation engine is pure (no side effects, no I/O) and unit-tested,
  covering: both formulae (with / without potassium), the albumin correction,
  each classification boundary (7/8, 12/13, 16/17, 19/20), and the
  hypoalbuminaemia-masking case.
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
bin/test-form anion-gap-calculator
```
