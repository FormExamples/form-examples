# Abdominal Aortic Aneurysm (AAA) Screening — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `abdominal-aortic-aneurysm-screening`

## 1. Purpose

A documentation and result-classification form for the UK NHS AAA Screening
Programme. It records an abdominal ultrasound of the aorta — eligibility,
consent, and the maximum antero-posterior aortic diameter in centimetres — and
from that diameter classifies the aorta into one of four categories (normal,
small, medium, large), sets the surveillance/referral action, checks
completeness, and raises clinical flags. It does not diagnose and does not
decide on repair.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, the classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, invitation/recall
scheduling, and any surgical decision-making beyond raising a referral.

## 3. Data model

A single logical screening-scan record. Fields default to `''` (text/enum) or
`null` (numeric/date/time) when unanswered.

**Context.**

| Field | Type | Notes |
| --- | --- | --- |
| `technicianName` | text | screening technician performing the scan |
| `technicianRole` | enum | screening-technician / clinical-skills-trainer / other |
| `clinicSite` | text | clinic or site name |
| `scannedAt` | timestamp | date and time of the scan |
| `deviceIdentifier` | text | ultrasound device identifier |

**Identification & eligibility.**

| Field | Type | Notes |
| --- | --- | --- |
| `patientIdentifier` | text | NHS number / local identifier |
| `age` | numeric (years) | patient age |
| `sex` | enum | patient sex |
| `eligibilityRoute` | enum | routine-year-of-65 / self-referral-over-65 / other |
| `scanType` | enum | first-scan / surveillance-rescan |

**Consent.**

| Field | Type | Notes |
| --- | --- | --- |
| `consentGiven` | enum (yes/no) | informed consent to scan |
| `leafletProvided` | enum (yes/no) | information leaflet given |
| `consentNote` | text | refusal or query detail |

**Ultrasound measurement.**

| Field | Type | Notes |
| --- | --- | --- |
| `aortaVisualised` | enum (yes/no) | aorta adequately visualised |
| `maxAorticDiameterCm` | numeric (cm) | maximum antero-posterior diameter — the classified value |
| `priorMaxDiameterCm` | numeric (cm) | prior maximum diameter (surveillance patients) |
| `priorScanDate` | date | date of prior scan (surveillance patients) |

**Clinical observations.**

| Field | Type | Notes |
| --- | --- | --- |
| `symptomatic` | enum (yes/no) | abdominal/back pain or tenderness |
| `incidentalFindings` | text | incidental findings |
| `resultNote` | text | free-text result note |

**Derived (never stored as input).** `category`, `surveillanceBand`,
`recommendedAction`, `growthCm`, `flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. Classification is driven solely by
`maxAorticDiameterCm`, with a guard for non-visualisation:

```
if aortaVisualised == 'no' || maxAorticDiameterCm == null:
    category          = 'non-visualised'
    surveillanceBand  = 'rescan'
    recommendedAction = 'Aorta not adequately measured — arrange a re-scan.'
else if maxAorticDiameterCm < 3.0:
    category          = 'normal'
    surveillanceBand  = 'discharge'
    recommendedAction = 'No aneurysm. Discharge from screening; no further surveillance.'
else if maxAorticDiameterCm < 4.5:            // 3.0 .. 4.4
    category          = 'small'
    surveillanceBand  = 'annual'
    recommendedAction = 'Small aneurysm. Annual (12-monthly) ultrasound surveillance.'
else if maxAorticDiameterCm < 5.5:            // 4.5 .. 5.4
    category          = 'medium'
    surveillanceBand  = 'three-monthly'
    recommendedAction = 'Medium aneurysm. Three-monthly ultrasound surveillance.'
else:                                          // >= 5.5
    category          = 'large'
    surveillanceBand  = 'refer-vascular'
    recommendedAction = 'Large aneurysm. Refer to vascular surgery for consideration of repair.'
```

Thresholds: **3.0 cm**, **4.5 cm**, **5.5 cm**. Bands are lower-bound inclusive,
upper-bound exclusive: `[3.0, 4.5)` small, `[4.5, 5.5)` medium, `[5.5, ∞)`
large; `< 3.0` normal.

**Growth.** When both current and prior diameters are present:
`growthCm = maxAorticDiameterCm - priorMaxDiameterCm` (null otherwise). Growth
feeds the rapid-growth flag.

## 5. Flagged issues (red flags)

Emitted independently of the category, each with a priority:

- **Vascular referral** (high) — `category == 'large'` (`>= 5.5 cm`): refer to
  vascular surgery for consideration of elective repair.
- **Symptomatic aneurysm** (high) — `symptomatic == 'yes'` with any aneurysm
  present: possible tender/expanding or ruptured aneurysm; arrange emergency
  vascular assessment, do not wait for routine referral.
- **Rapid growth** (high) — `growthCm >= 1.0` over a ~12-month interval (or
  growth exceeding the programme threshold for the interval): accelerated
  expansion; consider expediting referral.
- **Non-visualised aorta** (medium) — `aortaVisualised == 'no'` or
  `maxAorticDiameterCm == null`: aorta not adequately measured; arrange re-scan.
- **Incomplete assessment** (low) — required context, consent, or measurement
  fields missing: record cannot be finalised; complete before sign-off.

## 6. Inputs and outputs

**Input.** A typed screening-scan object whose shape mirrors the SQL schema in
`sql/`. Unanswered text/enum fields default to `''`; unanswered numeric, date,
and time fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
{
  category: 'normal' | 'small' | 'medium' | 'large' | 'non-visualised';
  surveillanceBand: 'discharge' | 'annual' | 'three-monthly' | 'refer-vascular' | 'rescan';
  recommendedAction: string;
  growthCm: number | null;
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

- `bin/test-form abdominal-aortic-aneurysm-screening` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each threshold boundary (2.9/3.0, 4.4/4.5, 5.4/5.5 cm), the
  non-visualised guard, and the growth calculation.
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

- [`index.md`](../index.md) — form description and classification details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form abdominal-aortic-aneurysm-screening
```
