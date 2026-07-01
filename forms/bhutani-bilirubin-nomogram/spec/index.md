# Bhutani Bilirubin Nomogram — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `bhutani-bilirubin-nomogram`

## 1. Purpose

A predictive risk-stratification tool for neonatal hyperbilirubinaemia. It maps a
newborn's total serum bilirubin (TSB) at a known age in hours onto the
hour-specific Bhutani nomogram to assign a **percentile risk zone** (low,
low-intermediate, high-intermediate, high), and compares the same point against
the age- and gestation-specific **treatment-threshold graphs** to indicate
whether the infant is at or above the **phototherapy** or **exchange-transfusion**
threshold. It is a **classification**, not an additive score, and it does not
diagnose the cause of jaundice.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine (zone lookup + threshold
comparison), two consolidated front-ends (`front-end-with-html`,
`front-end-with-svelte`), the Rust Loco JSON-API crate, and the generated
representations (XML, FHIR R5, protobuf, OpenAPI). Out of scope: hosted
deployment, authentication, multi-tenancy, diagnosis of jaundice aetiology, and
infants outside the supported gestational range of the threshold charts.

## 3. Data model

A single logical assessment record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | assessing clinician |
| `clinicianRole` | enum | midwife / neonatal-nurse / paediatrician / other |
| `assessedAt` | timestamp | date and time of assessment |
| `careSetting` | enum | postnatal-ward / neonatal-unit / midwife-led-unit / community / other |
| `infantIdentifier` | text | local identifier |
| `sex` | enum | infant sex |
| `bornAt` | timestamp | date and time of birth |
| `gestationalAgeWeeks` | numeric (weeks) | gestational age at birth; selects the threshold curve |

**Measurement inputs.**

| Field | Type | Notes |
| --- | --- | --- |
| `ageHours` | numeric (hours) | age at measurement; nomogram x-axis (may be derived from `bornAt` and `assessedAt`, or entered directly) |
| `totalSerumBilirubin` | numeric (µmol/L) | measured TSB; nomogram y-axis |
| `measurementMethod` | enum | serum / transcutaneous |

**Risk factors (each yes/no enum).**

| Field | Criterion |
| --- | --- |
| `gestationUnder38Weeks` | gestational age < 38 weeks |
| `previousSiblingJaundice` | previous sibling required phototherapy / had neonatal jaundice |
| `exclusiveBreastfeeding` | exclusively breastfed |
| `bruisingOrCephalohaematoma` | significant bruising or cephalohaematoma |
| `bloodGroupIncompatibility` | ABO / Rhesus incompatibility or positive DAT |
| `onsetUnder24Hours` | jaundice onset before 24 hours of age |

**Derived (never stored as input).** `ageHours` (when computed), `riskZone`,
`percentileBand`, `phototherapyThreshold`, `exchangeThreshold`,
`abovePhototherapy`, `aboveExchange`, `firedRiskFactors[]`, `flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. Two independent lookups against tabulated curves.

**(a) Zone lookup (prediction).** Interpolate the 40th / 75th / 95th percentile
TSB tracks at `ageHours`, then band the measured TSB:

```
p40 = percentile40(ageHours)
p75 = percentile75(ageHours)
p95 = percentile95(ageHours)

riskZone = TSB <  p40 ? 'low'
         : TSB <  p75 ? 'low-intermediate'
         : TSB <  p95 ? 'high-intermediate'
         :              'high'
percentileBand mirrors riskZone (<40 / 40-75 / 75-95 / >=95)
```

**(b) Threshold comparison (treatment signal).** Select the phototherapy and
exchange curves for the infant's gestational band, interpolate at `ageHours`,
and compare:

```
phototherapyThreshold = phototherapyCurve(gestationBand)(ageHours)
exchangeThreshold     = exchangeCurve(gestationBand)(ageHours)

abovePhototherapy = TSB != null && TSB >= phototherapyThreshold
aboveExchange     = TSB != null && TSB >= exchangeThreshold
```

- `ageHours` is clamped to the defined nomogram domain (approximately 0–168 h);
  values outside raise a data-range flag rather than extrapolating.
- If `ageHours` or `totalSerumBilirubin` is `null`, no zone is assigned and a
  data-completeness flag is raised.
- Threshold curves are lower for lower gestational age; the tool never treats a
  lower-gestation infant against a term curve.

## 5. Flagged issues (red flags)

Emitted independently of the zone, each with a priority:

- **Above exchange-transfusion threshold** (high, urgent) — `aboveExchange`:
  medical emergency; urgent senior / neonatal review and preparation for exchange
  transfusion.
- **Above phototherapy threshold** (high) — `abovePhototherapy`: start
  phototherapy per the gestation-specific chart and repeat TSB.
- **High-risk zone** (high) — `riskZone == 'high'`: TSB ≥ 95th percentile for
  age; ensure timely re-testing and treatment review.
- **Rapid rise** (high) — where a prior TSB is available, a rate of rise above
  the age-appropriate concern (e.g. crossing centiles) suggests haemolysis.
- **Early jaundice** (high) — `onsetUnder24Hours`: jaundice within 24 hours is
  pathological until proven otherwise; urgent investigation.
- **Risk factors present** (medium) — any of the risk-factor flags set: lower the
  effective threshold and reassess sooner.
- **High-intermediate zone** (medium) — `riskZone == 'high-intermediate'`:
  closer surveillance and earlier re-measurement.
- **Out-of-range age** (low) — `ageHours` outside the nomogram domain: result not
  computed; re-check age.
- **Incomplete assessment** (low) — `ageHours` or `totalSerumBilirubin` missing:
  no zone assigned; re-measure.

## 6. Inputs and outputs

**Input.** A typed assessment object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
{
  ageHours: number | null;
  riskZone: 'low' | 'low-intermediate' | 'high-intermediate' | 'high' | null;
  percentileBand: '<40' | '40-75' | '75-95' | '>=95' | null;
  phototherapyThreshold: number | null;
  exchangeThreshold: number | null;
  abovePhototherapy: boolean;
  aboveExchange: boolean;
  firedRiskFactors: FiredRiskFactor[];
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

- `bin/test-form bhutani-bilirubin-nomogram` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each zone boundary (below/at p40, p75, p95), each threshold boundary
  (just below / at the phototherapy and exchange lines), gestation-curve
  selection, out-of-range age, and missing inputs.
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

- [`index.md`](../index.md) — form description and risk-zone model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form bhutani-bilirubin-nomogram
```
