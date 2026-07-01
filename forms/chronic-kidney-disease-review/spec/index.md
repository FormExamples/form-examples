# Chronic Kidney Disease Annual Review — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `chronic-kidney-disease-review`

## 1. Purpose

A UK primary-care structured review of an adult with chronic kidney disease. It
records the two KDIGO staging measurements (eGFR and urine ACR), the blood
pressure, a medication review, and the core CKD bloods, then derives the
**G-stage (G1–G5)**, **albuminuria stage (A1–A3)**, and **KDIGO risk zone**
(low / moderate / high / very high), grades **review completeness**, and raises
**flags** mapped to NICE NG203 referral and safety criteria. It classifies and
prompts action; it does not diagnose or treat.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, dialysis/transplant
follow-up, paediatric CKD, and acute kidney injury.

## 3. Data model

A single logical review record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | reviewing clinician |
| `clinicianRole` | enum | gp / nurse / pharmacist / nephrology / other |
| `reviewedAt` | date | date of review |
| `careSetting` | enum | general-practice / long-term-conditions-clinic / community-nephrology / other |
| `reviewType` | enum | annual / interval / post-referral |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |
| `diabetesStatus` | enum | none / type1 / type2 |
| `primaryCause` | enum | diabetic / hypertensive / glomerular / polycystic / obstructive / unknown / other |
| `monthsSinceDiagnosis` | numeric | duration of known CKD |

**Renal function.**

| Field | Type | Notes |
| --- | --- | --- |
| `egfr` | numeric (mL/min/1.73 m²) | current eGFR → G-stage |
| `egfrSampleDate` | date | current sample date |
| `previousEgfr` | numeric | prior eGFR for decline check |
| `previousEgfrDate` | date | prior sample date |

**Albuminuria.**

| Field | Type | Notes |
| --- | --- | --- |
| `acr` | numeric (mg/mmol) | urine ACR → A-stage |
| `acrSampleDate` | date | sample date |
| `acrMeasured` | enum (yes/no) | whether ACR measured this review |

**Blood pressure.**

| Field | Type | Notes |
| --- | --- | --- |
| `systolicBloodPressure` | numeric (mmHg) | |
| `diastolicBloodPressure` | numeric (mmHg) | |

**Medication review.**

| Field | Type | Notes |
| --- | --- | --- |
| `aceiOrArbPrescribed` | enum (yes/no/contraindicated) | RAAS blockade |
| `sglt2iPrescribed` | enum (yes/no/not-indicated) | SGLT2 inhibitor |
| `statinPrescribed` | enum (yes/no/declined) | CVD risk |
| `nephrotoxicDrugPresent` | enum (yes/no) | e.g. NSAID, certain antibiotics |
| `nephrotoxicDoseAdjusted` | enum (yes/no/not-applicable) | dose-adjusted or held |
| `medicationReviewCompleted` | enum (yes/no) | structured review documented |

**Metabolic bloods.**

| Field | Type | Notes |
| --- | --- | --- |
| `hba1c` | numeric (mmol/mol) | glycaemic control |
| `potassium` | numeric (mmol/L) | hyperkalaemia check |
| `bicarbonate` | numeric (mmol/L) | acidosis check |
| `calcium` | numeric (mmol/L) | CKD-MBD |
| `phosphate` | numeric (mmol/L) | CKD-MBD |
| `pth` | numeric (pmol/L) | CKD-MBD |
| `haemoglobin` | numeric (g/L) | anaemia check |

**Referral & summary.**

| Field | Type | Notes |
| --- | --- | --- |
| `referralDecision` | enum | none / monitor / refer-nephrology / already-under-nephrology |
| `clinicalNote` | text | free-text |

**Derived (never stored as input).** `gfrCategory`, `albuminuriaCategory`,
`kdigoRiskZone`, `bloodPressureTarget`, `bloodPressureAtTarget`, `reviewStatus`,
`completenessScore`, `firedCriteria[]`, `flaggedIssues[]`.

## 4. Classification & completeness algorithm

Pure function, no I/O.

**G-stage** from `egfr`:

```
egfr >= 90 → G1;  60..89 → G2;  45..59 → G3a;  30..44 → G3b;  15..29 → G4;  < 15 → G5
egfr == null → null
```

**A-stage** from `acr`:

```
acr < 3 → A1;  3..30 → A2;  > 30 → A3;  acr == null → null
```

**KDIGO risk zone** (GFR × ACR heat-map):

```
                A1        A2         A3
G1 / G2         low       moderate   high
G3a             moderate  high       very-high
G3b             high      very-high  very-high
G4 / G5         very-high very-high  very-high
```

When either stage is `null` the zone is `null` and a data-completeness flag is
raised (missing ACR and/or missing eGFR).

**Blood-pressure target** (NICE NG203):

```
target = (acr != null && acr >= 70) || diabetesStatus in {type1,type2}
         ? { systolic: 130, diastolic: 80 }
         : { systolic: 140, diastolic: 90 }
bloodPressureAtTarget = systolicBloodPressure != null && diastolicBloodPressure != null
         ? systolicBloodPressure < target.systolic && diastolicBloodPressure < target.diastolic
         : null
```

**Rapid decline** — true when current and previous eGFR are both present and:
a fall of `≥ 25 %` from previous **and** a change in G-stage, **or** an
annualised fall of `≥ 15 mL/min/1.73 m²` between the two sample dates.

**Review completeness** — count the recorded bundle items (eGFR, ACR, BP,
`medicationReviewCompleted == 'yes'`, and the core bloods potassium and
haemoglobin present):

```
complete   → eGFR, ACR, BP, medication review, and core bloods all present
partial    → eGFR and BP present but ≥ 1 bundle item missing
incomplete → eGFR missing, or ≥ 2 core items missing
```

`completenessScore` is the integer count of bundle items present.

## 5. Flagged issues (red flags)

Emitted independently of the risk zone, each with a priority:

- **Nephrology referral — very-high risk** (high) — `kdigoRiskZone == 'very-high'`.
- **Nephrology referral — eGFR < 30** (high) — G4 or G5.
- **Nephrology referral — ACR ≥ 70** (high) — `acr >= 70`.
- **Rapid eGFR decline** (high) — decline rule in §4 satisfied.
- **Hyperkalaemia** (high when `potassium >= 6.0`; medium when `5.5 <= potassium < 6.0`).
- **Anaemia of CKD** (medium) — `haemoglobin < 110`.
- **Uncontrolled blood pressure** (medium) — `bloodPressureAtTarget == false`.
- **Nephrotoxic drug without dose adjustment** (high) —
  `nephrotoxicDrugPresent == 'yes'` and `nephrotoxicDoseAdjusted != 'yes'`.
- **Missing ACR** (medium) — `acrMeasured != 'yes'` or `acr == null`.
- **Incomplete review** (low) — `reviewStatus == 'incomplete'`.

## 6. Inputs and outputs

**Input.** A typed review object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  gfrCategory: 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | null;
  albuminuriaCategory: 'A1' | 'A2' | 'A3' | null;
  kdigoRiskZone: 'low' | 'moderate' | 'high' | 'very-high' | null;
  bloodPressureTarget: { systolic: number; diastolic: number } | null;
  bloodPressureAtTarget: boolean | null;
  reviewStatus: 'complete' | 'partial' | 'incomplete';
  completenessScore: number;
  firedCriteria: FiredCriterion[];
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

- `bin/test-form chronic-kidney-disease-review` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each G-stage and A-stage boundary (eGFR 89/90, 59/60, 44/45, 29/30,
  14/15; ACR 3, 30, 70), every heat-map cell, the BP-target derivation, the
  rapid-decline rule, and each completeness grade.
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
bin/test-form chronic-kidney-disease-review
```
