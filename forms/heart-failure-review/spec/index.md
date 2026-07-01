# Heart Failure Annual Review — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `heart-failure-review`

## 1. Purpose

A UK primary-care structured **annual review** for adults with established
chronic heart failure. It records functional status, fluid balance, monitoring
bloods, and medication optimisation, then derives an **NYHA functional status**,
a **medication-optimisation status** (against the four pillars of guideline-
directed medical therapy), a **review-completeness grade**, and a set of safety
flags. It is a documentation and status-classification form; it does not
diagnose heart failure or its subtype.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, initial diagnosis, and
acute decompensated heart-failure management.

## 3. Data model

A single logical review record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | reviewing clinician |
| `clinicianRole` | enum | gp / practice-nurse / hf-nurse / pharmacist / cardiologist / other |
| `reviewDate` | date | date of this review |
| `careSetting` | enum | general-practice / community-hf-service / hospital-clinic / other |
| `reviewType` | enum | routine-annual / post-discharge / medication-titration |
| `lastReviewDate` | date | date of previous review |
| `patientIdentifier` | text | local identifier |
| `ageBand` | enum | adult age band |
| `sex` | enum | patient sex |

**Diagnosis.**

| Field | Type | Notes |
| --- | --- | --- |
| `yearOfDiagnosis` | numeric | year heart failure diagnosed |
| `heartFailureType` | enum | reduced / mildly-reduced / preserved / unknown |
| `latestLvef` | numeric (%) | most recent left-ventricular ejection fraction |
| `lastEchoDate` | date | date of last echocardiogram |
| `aetiology` | enum | ischaemic / hypertensive / valvular / other / unknown |

**Functional status.**

| Field | Type | Notes |
| --- | --- | --- |
| `nyhaClass` | numeric (1–4) | New York Heart Association class |
| `breathlessness` | enum | none / on-exertion / at-rest |
| `orthopnoea` | enum (yes/no) | |
| `paroxysmalNocturnalDyspnoea` | enum (yes/no) | |
| `fatigue` | enum | none / mild / moderate / severe |
| `changeSinceLastReview` | enum | improved / unchanged / worse |
| `decompensation` | enum (yes/no) | documented decompensation since last review |

**Fluid status and observations.**

| Field | Type | Notes |
| --- | --- | --- |
| `weightKg` | numeric (kg) | |
| `weightChangeKg` | numeric (kg) | change since last review (positive = gain) |
| `peripheralOedema` | enum | none / mild / moderate / severe |
| `raisedJvp` | enum (yes/no) | |
| `lungCrackles` | enum (yes/no) | |
| `systolicBloodPressure` | numeric (mmHg) | |
| `diastolicBloodPressure` | numeric (mmHg) | |
| `heartRate` | numeric (bpm) | |
| `heartRhythm` | enum | sinus / atrial-fibrillation / paced / other |

**Investigations.**

| Field | Type | Notes |
| --- | --- | --- |
| `ntProBnp` | numeric (ng/L) | |
| `sodium` | numeric (mmol/L) | |
| `potassium` | numeric (mmol/L) | RAAS/MRA monitoring |
| `urea` | numeric (mmol/L) | |
| `creatinine` | numeric (µmol/L) | |
| `egfr` | numeric (mL/min/1.73m²) | |
| `haemoglobin` | numeric (g/L) | |
| `ferritin` | numeric (µg/L) | iron status |
| `transferrinSaturation` | numeric (%) | iron status |
| `hba1c` | numeric (mmol/mol) | |
| `bloodsDate` | date | date monitoring bloods taken |

**Medication optimisation.** For each of the four pillars a repeating group:
`status` (prescribed / not-prescribed / contraindicated / not-tolerated),
`agent` (text), `dose` (text), `atTargetDose` (yes/no), `adherence`
(good / partial / poor). Pillars: `raasInhibitor` (ACEi/ARB/ARNI),
`betaBlocker`, `mra`, `sglt2Inhibitor`. Plus `loopDiuretic` (agent + dose),
`otherMedications` (text).

**Devices, vaccinations, self-management.** `icd`, `crt`, `pacemaker`,
`deviceCheckStatus`; `influenzaVaccination`, `pneumococcalVaccination`,
`covidVaccination`; `smokingStatus`, `alcoholStatus`, `dailyWeights`,
`selfManagementPlan`, `cardiacRehab` (each yes/no or enum).

**Derived (never stored as input).** `functionalStatus`,
`medicationOptimisation` (with `indicatedPillars`, `prescribedPillars`,
`missingPillars[]`, `status`), `reviewStatus`, `completenessScore`,
`flaggedIssues[]`.

## 4. Classification & completeness algorithm

Pure function, no I/O.

**Functional status** — from `nyhaClass`:

```
functionalStatus = nyhaClass == null      ? 'unknown'
                 : nyhaClass <= 2          ? 'stable'
                 : nyhaClass == 3          ? 'symptomatic'
                 :                           'advanced'   // NYHA IV
```

**Medication optimisation** — the indicated pillar set depends on
`heartFailureType`:

```
indicatedPillars = heartFailureType == 'reduced'        ? 4   // all four pillars
                 : heartFailureType in {'mildly-reduced','preserved'} ? 1 // SGLT2i primary
                 :                                          0   // unknown → not-applicable

prescribedPillars = count of indicated pillars whose status == 'prescribed'
counted            = count of indicated pillars whose status in
                     {'prescribed','contraindicated','not-tolerated'}

status = indicatedPillars == 0                 ? 'not-applicable'
       : counted == indicatedPillars           ? 'optimised'
       : prescribedPillars == 0                ? 'suboptimal'
       :                                          'partial'

missingPillars = indicated pillars whose status == 'not-prescribed'
```

For HFrEF all four pillars are indicated; for HFmrEF/HFpEF the SGLT2 inhibitor
is treated as the principal disease-modifying pillar. A pillar documented as
`contraindicated` or `not-tolerated` counts as addressed (does not lower the
grade) but is still reported.

**Review completeness** — six required domains: functional status
(`nyhaClass`), fluid status (`weightKg` or oedema/JVP), monitoring bloods
(`potassium` and `egfr`), medication review (all four pillars have a `status`),
vaccinations (`influenzaVaccination`), self-management (`selfManagementPlan`).

```
completenessScore = round(100 * documentedDomains / 6)
reviewStatus = documentedDomains == 6 ? 'complete'
             : documentedDomains >= 4 ? 'partial'
             :                          'incomplete'
```

## 5. Flagged issues (safety flags)

Emitted independently of the grades, each with a priority:

- **Urgent review** (high) — `nyhaClass >= 3` or `decompensation == 'yes'`:
  symptomatic/advanced heart failure; arrange prompt clinical review.
- **Optimisation gap** (high when HFrEF and ≥ 2 pillars missing; medium
  otherwise) — one or more indicated pillars `not-prescribed` without a
  documented contraindication.
- **Hyperkalaemia** (high) — `potassium > 5.5`: review RAAS inhibitor / MRA.
- **Hypokalaemia** (medium) — `potassium < 3.5`.
- **Renal impairment** (high) — `egfr < 30` (or a significant fall relevant to
  RAAS-inhibitor and MRA safety).
- **Fluid overload** (high when `nyhaClass >= 3`; medium otherwise) —
  `weightChangeKg >= 2`, `peripheralOedema` moderate/severe, `raisedJvp == 'yes'`,
  or `lungCrackles == 'yes'`.
- **Missing monitoring bloods** (medium) — on a RAAS inhibitor or MRA but
  `potassium == null` or `egfr == null` or `bloodsDate` absent.
- **Incomplete review** (low) — `reviewStatus != 'complete'`.

## 6. Inputs and outputs

**Input.** A typed review object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A grading object emitted by the engine:

```ts
{
  functionalStatus: 'stable' | 'symptomatic' | 'advanced' | 'unknown';
  medicationOptimisation: {
    indicatedPillars: number;
    prescribedPillars: number;
    missingPillars: Pillar[];
    status: 'optimised' | 'partial' | 'suboptimal' | 'not-applicable';
  };
  reviewStatus: 'complete' | 'partial' | 'incomplete';
  completenessScore: number;   // 0..100
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

- `bin/test-form heart-failure-review` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering each NYHA class (I–IV), each `heartFailureType`, the optimisation
  status transitions, the potassium/eGFR thresholds, and each completeness band.
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
bin/test-form heart-failure-review
```
