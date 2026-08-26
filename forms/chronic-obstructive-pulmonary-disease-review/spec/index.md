# Chronic Obstructive Pulmonary Disease Review (COPD Annual Review) — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `chronic-obstructive-pulmonary-disease-review`

## 1. Purpose

A UK primary-care annual review for adults with confirmed COPD. It records
spirometry, symptom burden, exacerbation history, smoking, inhaler technique and
adherence, vaccinations, pulmonary rehabilitation, oxygen, comorbidities, and the
self-management plan, then derives a **GOLD airflow-limitation grade (1–4)**, a
combined **ABE assessment group**, a **review-completeness grade**, and clinical
flags. It is a documentation / completeness and severity-classification
instrument; it neither diagnoses COPD nor prescribes treatment. Aligned with NICE
NG115 and GOLD 2023+.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, grading engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, initial COPD diagnosis,
asthma management, acute-exacerbation triage, paediatric respiratory assessment.

## 3. Data model

A single logical review record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | reviewing clinician |
| `clinicianRole` | enum | gp / practice-nurse / respiratory-nurse / pharmacist / other |
| `reviewedAt` | date | date of review |
| `reviewType` | enum | routine-annual / post-exacerbation / opportunistic |
| `patientIdentifier` | text | NHS number / local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**Diagnosis & history.**

| Field | Type | Notes |
| --- | --- | --- |
| `diagnosisYear` | numeric | year of COPD diagnosis |
| `spirometryConfirmed` | enum (yes/no) | diagnosis confirmed on spirometry |
| `exposureNotes` | text | occupational / environmental exposures |

**Spirometry.**

| Field | Type | Notes |
| --- | --- | --- |
| `fev1Litres` | numeric (L) | post-bronchodilator FEV₁ |
| `fev1PercentPredicted` | numeric (%) | drives GOLD grade |
| `fvcLitres` | numeric (L) | forced vital capacity |
| `fev1FvcRatio` | numeric | FEV₁/FVC (obstruction if < 0.70) |
| `spirometryDate` | date | date of spirometry |

**Symptom burden.**

| Field | Type | Notes |
| --- | --- | --- |
| `mrcGrade` | numeric (1–5) | MRC dyspnoea grade (pulmonary-rehab trigger) |
| `mmrcGrade` | numeric (0–4) | mMRC dyspnoea grade (symptom axis) |
| `catScore` | numeric (0–40) | COPD Assessment Test total (symptom axis) |

**Exacerbations.**

| Field | Type | Notes |
| --- | --- | --- |
| `exacerbationsLast12m` | numeric | moderate exacerbations, past 12 months |
| `hospitalisationsLast12m` | numeric | exacerbations needing admission |
| `lastExacerbationDate` | date | date of most recent exacerbation |
| `rescuePackCourses` | numeric | rescue-pack courses used |

**Smoking & cessation.**

| Field | Type | Notes |
| --- | --- | --- |
| `smokingStatus` | enum | current / ex / never |
| `packYears` | numeric | smoking pack-years |
| `cessationSupportOffered` | enum (yes/no) | brief advice / referral offered |

**Inhaler therapy.**

| Field | Type | Notes |
| --- | --- | --- |
| `inhaledTherapy` | text | current SABA/LABA/LAMA/ICS regimen |
| `deviceType` | text | inhaler device(s) |
| `inhalerTechniqueChecked` | enum (yes/no) | technique checked this review |
| `inhalerTechniqueAdequate` | enum (yes/no) | technique adequate |
| `adherence` | enum | good / partial / poor |

**Vaccinations.**

| Field | Type | Notes |
| --- | --- | --- |
| `influenzaVaccine` | enum | up-to-date / due / declined |
| `pneumococcalVaccine` | enum | up-to-date / due / declined |
| `covidVaccine` | enum | up-to-date / due / declined |

**Pulmonary rehabilitation, oxygen & self-management.**

| Field | Type | Notes |
| --- | --- | --- |
| `pulmonaryRehabStatus` | enum | completed / referred / eligible-not-referred / not-indicated |
| `oxygenUse` | enum | none / long-term / ambulatory |
| `restingSpo2` | numeric (%) | resting SpO₂ on room air |
| `comorbidities` | text | recorded comorbidities |
| `selfManagementPlan` | enum (yes/no) | personalized plan in place |
| `rescuePackSupplied` | enum (yes/no) | rescue pack supplied |
| `nextReviewInterval` | text | months to next review |
| `clinicianNote` | text | free-text summary |

**Derived (never stored as input).** `goldGrade`, `symptomBurden`,
`exacerbationRisk`, `abeGroup`, `reviewStatus`, `firedRules[]`, `flaggedIssues[]`.

## 4. Grading algorithm

Pure function, no I/O.

**GOLD airflow-limitation grade** (from FEV₁ % predicted):

```
goldGrade =
  fev1PercentPredicted == null            ? null :
  fev1PercentPredicted >= 80              ? 1 :
  fev1PercentPredicted >= 50              ? 2 :
  fev1PercentPredicted >= 30              ? 3 :
                                            4
```

**Symptom axis:**

```
symptomBurden = (mmrcGrade != null && mmrcGrade >= 2)
                || (catScore != null && catScore >= 10)  ? 'high' : 'low'
```

**Exacerbation axis:**

```
exacerbationRisk = (exacerbationsLast12m != null && exacerbationsLast12m >= 2)
                   || (hospitalisationsLast12m != null && hospitalisationsLast12m >= 1)
                   ? 'high' : 'low'
```

**ABE group:**

```
abeGroup =
  (no symptom and no exacerbation data)   ? null :
  exacerbationRisk == 'high'              ? 'E' :
  symptomBurden == 'high'                ? 'B' :
                                            'A'
```

**Review-completeness grade.** Core elements: spirometry (FEV₁ % predicted), a
symptom measure (mMRC or CAT), exacerbation history, smoking status,
inhaler-technique check, vaccination status (all three), pulmonary-rehab status,
self-management plan.

```
reviewStatus =
  any core clinical element missing                          ? 'incomplete' :
  all core present but one or more supporting items missing  ? 'partial' :
                                                               'complete'
```

- A missing numeric input contributes nothing to its axis (treated as absent, not
  as a normal value) and lowers the completeness grade.

## 5. Flagged issues

Emitted independently of the grades, each with a priority:

- **High exacerbation risk** (high) — `abeGroup == 'E'` (≥ 2 moderate or ≥ 1
  hospitalized exacerbation): review and consider escalating maintenance inhaled
  therapy.
- **Current smoker** (high) — `smokingStatus == 'current'`: offer very-brief
  advice and refer to stop-smoking support with pharmacotherapy.
- **Poor / unchecked inhaler technique** (high) —
  `inhalerTechniqueAdequate == 'no'` or `inhalerTechniqueChecked == 'no'`:
  re-educate and re-assess device.
- **Missing vaccinations** (medium) — any of `influenzaVaccine`,
  `pneumococcalVaccine`, `covidVaccine` not `up-to-date`: offer / recall.
- **Pulmonary-rehab candidate** (medium) — `mrcGrade >= 3` and
  `pulmonaryRehabStatus` not `completed` / `referred`: refer for pulmonary
  rehabilitation.
- **Incomplete review** (low) — any core review element missing: complete the
  dataset.

## 6. Inputs and outputs

**Input.** A typed review object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  goldGrade: 1 | 2 | 3 | 4 | null;
  symptomBurden: 'low' | 'high';
  exacerbationRisk: 'low' | 'high';
  abeGroup: 'A' | 'B' | 'E' | null;
  reviewStatus: 'complete' | 'partial' | 'incomplete';
  firedRules: FiredRule[];
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

- `bin/test-form chronic-obstructive-pulmonary-disease-review` exits cleanly.
- The grading engine is pure (no side effects, no I/O) and unit-tested, covering
  each GOLD boundary (FEV₁ % 80/79, 50/49, 30/29), each symptom threshold
  (mMRC 1/2, CAT 9/10), each exacerbation threshold (1/2 moderate, 0/1
  hospitalized), every ABE group, and every completeness grade.
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

- [`index.md`](../index.md) — form description and grading details
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form chronic-obstructive-pulmonary-disease-review
```
