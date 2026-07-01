# Hypertension Annual Review — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `hypertension-review`

## 1. Purpose

A UK primary-care annual hypertension review (NICE NG136). It records clinic and
home/ambulatory blood pressure, medication and adherence, cardiovascular risk
(QRISK), annual bloods (U&E, HbA1c, lipids), urine albumin:creatinine ratio
(ACR), lifestyle, and complications. The engine classifies blood-pressure
**control** against an age- and comorbidity-specific target, assigns a
hypertension **stage**, grades **review completeness**, and raises **flags**. It
is a documentation and control-classification tool, not a diagnostic or
prescribing instrument.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, initial diagnosis of
hypertension, hypertensive-emergency management, pregnancy hypertension, and
paediatric assessment.

## 3. Data model

A single logical review record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | reviewing clinician |
| `clinicianRole` | enum | gp / practice-nurse / pharmacist / other |
| `reviewedAt` | date | date of review |
| `practiceSite` | text | practice or site |
| `patientIdentifier` | text | NHS number / local identifier |
| `ageBand` | enum | adult age band (drives target; `≥80` distinguished) |
| `sex` | enum | patient sex |
| `ethnicity` | enum | patient ethnicity |

**Diagnosis and comorbidity (target drivers).**

| Field | Type | Notes |
| --- | --- | --- |
| `diagnosisDate` | date | date of hypertension diagnosis |
| `type2Diabetes` | enum (yes/no) | comorbidity |
| `chronicKidneyDisease` | enum (yes/no) | comorbidity |
| `establishedCvd` | enum (yes/no) | prior CVD |
| `atrialFibrillation` | enum (yes/no) | comorbidity |

**Blood pressure.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicSystolic` | numeric (mmHg) | best of repeated seated readings |
| `clinicDiastolic` | numeric (mmHg) | best of repeated seated readings |
| `homeSystolic` | numeric (mmHg) | HBPM / ABPM daytime average |
| `homeDiastolic` | numeric (mmHg) | HBPM / ABPM daytime average |
| `monitoringMethod` | enum | clinic-only / hbpm / abpm |
| `posturalDrop` | enum (yes/no) | symptomatic postural systolic fall ≥ 20 mmHg |

**Medication, risk, bloods, ACR, lifestyle.**

| Field | Type | Notes |
| --- | --- | --- |
| `antihypertensiveAgents` | numeric | count of current agents |
| `adherence` | enum | good / partial / poor |
| `sideEffects` | enum (yes/no) | troublesome side effects |
| `qriskPercent` | numeric (%) | QRISK 10-year cardiovascular risk |
| `smokingStatus` | enum | never / ex / current |
| `statinTherapy` | enum (yes/no) | on a statin |
| `serumCreatinine` | numeric (µmol/L) | U&E |
| `egfr` | numeric (mL/min/1.73m²) | U&E |
| `serumPotassium` | numeric (mmol/L) | U&E |
| `hba1c` | numeric (mmol/mol) | glycaemic control |
| `totalCholesterol` | numeric (mmol/L) | lipids |
| `hdlCholesterol` | numeric (mmol/L) | lipids |
| `urineAcr` | numeric (mg/mmol) | urine albumin:creatinine ratio |
| `bmi` | numeric (kg/m²) | anthropometry |

**Derived (never stored as input).** `bpTarget`, `controlClass`, `controlStatus`,
`hypertensionStage`, `reviewStatus`, `firedRules[]`, `flags[]`.

## 4. Control-classification & completeness algorithm

Pure function, no I/O.

### 4.1 Target selection (NICE NG136)

```
clinicTarget = { systolic: 140, diastolic: 90 }             // default, age < 80
if ageBand == '>=80'                    -> { 150, 90 }
if type2Diabetes == 'yes'               -> { 140, 90 }
if chronicKidneyDisease == 'yes'
   && (type2Diabetes == 'yes' || urineAcr >= 70) -> { 130, 80 }   // tightest target wins
homeTarget = { systolic: clinicTarget.systolic - 5, diastolic: clinicTarget.diastolic - 5 }
```

The tightest applicable target wins. `bpTarget` records both the clinic and
home/ambulatory target and the group that selected it.

### 4.2 Control class

```
severe = clinicSystolic != null && clinicDiastolic != null
         && (clinicSystolic >= 180 || clinicDiastolic >= 120)

// primary reading: home/ambulatory if present, else clinic
if home readings present -> compare (homeSystolic, homeDiastolic) to homeTarget
else                     -> compare (clinicSystolic, clinicDiastolic) to clinicTarget

aboveTarget = primarySystolic > target.systolic || primaryDiastolic > target.diastolic

controlClass = severe        ? 'severe-uncontrolled'
             : aboveTarget    ? 'uncontrolled'
             : 'controlled'
```

`controlStatus` bundles `controlClass`, `bpTarget`, the primary reading source
(`home` | `clinic`), and `hypertensionStage`.

### 4.3 Hypertension stage (raw readings)

```
stage3 = clinicSystolic >= 180 || clinicDiastolic >= 120
stage2 = clinic >= 160/100 && home >= 150/95
stage1 = clinic >= 140/90  && home >= 135/85
hypertensionStage = stage3 ? 'stage-3-severe' : stage2 ? 'stage-2' : stage1 ? 'stage-1' : 'none'
```

Where a home reading is absent, staging falls back to the clinic reading only.

### 4.4 Review status (completeness)

```
hasBp        = clinic or home readings present
coreComplete = medication & adherence, U&E, HbA1c, lipids, urineAcr,
               qriskPercent, lifestyle all present
reviewStatus = !hasBp        ? 'incomplete'
             : coreComplete  ? 'complete'
             : 'partial'
```

## 5. Flagged issues (flags)

Emitted independently of the control class, each with a priority:

- **Severe hypertension** (high) — clinic BP ≥ 180/120: arrange same-day
  assessment.
- **Uncontrolled blood pressure** (high) — `controlClass == 'uncontrolled'`:
  review and step up antihypertensive medication.
- **Missing annual bloods** (medium) — any of U&E (creatinine/eGFR/potassium),
  HbA1c, or lipids not recorded.
- **Missing urine ACR** (medium) — `urineAcr == null`.
- **High cardiovascular risk untreated** (medium) — `qriskPercent >= 10` and
  `statinTherapy != 'yes'`.
- **Adherence concern** (medium) — `adherence == 'poor'` or `sideEffects == 'yes'`.
- **Postural drop** (medium) — `posturalDrop == 'yes'`.

## 6. Inputs and outputs

**Input.** A typed review object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
review(data: HypertensionReview): {
  controlStatus: {
    controlClass: 'controlled' | 'uncontrolled' | 'severe-uncontrolled';
    bpTarget: { clinic: { systolic: number; diastolic: number };
                home:   { systolic: number; diastolic: number };
                group: string };
    primarySource: 'home' | 'clinic' | 'none';
    hypertensionStage: 'none' | 'stage-1' | 'stage-2' | 'stage-3-severe';
  };
  reviewStatus: 'complete' | 'partial' | 'incomplete';
  firedRules: FiredRule[];
  flags: Flag[];
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

- `bin/test-form hypertension-review` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each BP-target group, each control class (including the 180/120 severe
  boundary and target boundaries such as 139/140 and 89/90), each hypertension
  stage, and each review-status level.
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
bin/test-form hypertension-review
```
