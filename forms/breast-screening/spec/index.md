# Breast Screening Record — specification

This file is the **living domain spec** for this form. It captures the contract
each implementation (SQL schema, generated representations, front-ends, and Rust
back-end) must satisfy. Treat it as the source of truth for behaviour — update
the spec before changing code.

Slug: `breast-screening`

## 1. Purpose

A documentation and result-classification record for a mammography breast
screening encounter within the NHS Breast Screening Programme. It records
eligibility, consent, the mammogram views taken, the radiological reporting
outcome of film reading, and — where the woman is recalled — the assessment
result as a five-point breast imaging classification. From these inputs the
engine derives the screening outcome and next action, validates completeness,
and raises flags. It is not a scored screen and not a diagnostic test.

Full design description: [`index.md`](../index.md).

## 2. Scope

In scope: the schema, classification engine, two consolidated front-ends
(`front-end-with-html`, `front-end-with-svelte`), the Rust Loco JSON-API crate,
and the generated representations (XML, FHIR R5, protobuf, OpenAPI). Out of
scope: hosted deployment, authentication, multi-tenancy, higher-risk
surveillance imaging protocols, and symptomatic-pathway assessment.

## 3. Data model

A single logical screening record. Fields default to `''` (text/enum) or `null`
(numeric/date/time) when unanswered.

**Context and identification.**

| Field | Type | Notes |
| --- | --- | --- |
| `clinicianName` | text | reporting clinician |
| `clinicianRole` | enum | mammographer / advanced-practitioner / breast-radiologist / screening-office |
| `reportedAt` | timestamp | date and time reported |
| `screeningUnit` | text | static or mobile unit |
| `episodeType` | enum | routine-recall / very-first-call / self-referral / higher-risk-surveillance |
| `patientIdentifier` | text | NHS number / local identifier |
| `ageYears` | numeric | age in years |
| `lastScreenedDate` | date | date of previous screen |
| `higherRiskSurveillance` | enum (yes/no) | on the separate surveillance pathway |

**Eligibility, consent, and imaging inputs.**

| Field | Type | Notes |
| --- | --- | --- |
| `symptomatic` | enum (yes/no) | breast symptom reported |
| `consentGiven` | enum | yes / no / declined |
| `viewsTaken` | enum | standard-four-view / additional-views / unable-to-image |
| `imageAdequacy` | enum | adequate / inadequate |
| `firstReadOpinion` | enum | normal / recall / technical (first reader) |
| `secondReadOpinion` | enum | normal / recall / technical (second reader) |
| `arbitrationOutcome` | enum | normal / recall / technical / not-required |
| `readingOutcome` | enum | normal-routine-recall / technical-repeat / recall-for-assessment |
| `assessmentPerformed` | enum (yes/no) | assessment clinic attended |
| `assessmentModalities` | enum | mammography / ultrasound / biopsy (multi-select serialised) |
| `imagingClassification` | numeric (1–5) | breast imaging classification, when assessed |

**Derived (never stored as input).** `eligibilityStatus`, `screeningOutcome`,
`outcomeBand`, `flaggedIssues[]`.

## 4. Classification algorithm

Pure function, no I/O. Order: eligibility → reading outcome → assessment result
→ screening outcome.

```
eligibilityStatus =
  symptomatic == 'yes'                          ? 'symptomatic-referral'
  : higherRiskSurveillance == 'yes'
    || episodeType == 'higher-risk-surveillance' ? 'higher-risk-surveillance'
  : (ageYears != null && (ageYears < 50 || ageYears > 70)
       && episodeType == 'routine-recall')       ? 'outside-age-range'
  :                                                'eligible'

// screeningOutcome is derived from the reading outcome, then refined by the
// assessment imaging classification when the woman was recalled and assessed.
if symptomatic == 'yes':
    screeningOutcome = 'symptomatic-pathway-referral'; outcomeBand = 'referral'
elif readingOutcome == 'technical-repeat':
    screeningOutcome = 'technical-repeat';             outcomeBand = 'repeat'
elif readingOutcome == 'normal-routine-recall':
    screeningOutcome = 'routine-recall';              outcomeBand = 'routine'
elif readingOutcome == 'recall-for-assessment':
    if assessmentPerformed != 'yes' or imagingClassification == null:
        screeningOutcome = 'recall-to-assessment-clinic'; outcomeBand = 'assessment'
    elif imagingClassification in (1, 2):
        screeningOutcome = 'routine-recall';          outcomeBand = 'routine'
    elif imagingClassification == 3:
        screeningOutcome = 'short-interval-follow-up'; outcomeBand = 'assessment'
    elif imagingClassification in (4, 5):
        screeningOutcome = 'urgent-breast-clinic';    outcomeBand = 'urgent'
else:
    screeningOutcome = '';                            outcomeBand = 'incomplete'
```

- The `readingOutcome` should be consistent with the double-read opinions and
  arbitration; a discrepancy between reads with `arbitrationOutcome == 'not-required'`
  raises a completeness flag.
- A missing required input (views, image adequacy, reading outcome, or the
  classification after a recall) leaves the outcome incomplete and raises a flag.

## 5. Flagged issues (red flags)

Emitted independently of the outcome, each with a priority:

- **Symptomatic — wrong pathway** (high) — `symptomatic == 'yes'`: refer via the
  symptomatic breast pathway, not screening.
- **Suspicious / malignant** (high) — `imagingClassification` 4 or 5: urgent
  breast-clinic referral, tissue diagnosis, MDT.
- **Recall for assessment** (medium) — `readingOutcome == 'recall-for-assessment'`
  and not yet assessed: book assessment clinic.
- **Indeterminate result** (medium) — `imagingClassification == 3`: short-interval
  follow-up or biopsy per local protocol.
- **Technical repeat** (medium) — `readingOutcome == 'technical-repeat'` or
  `imageAdequacy == 'inadequate'`: repeat the mammogram.
- **Consent not given** (medium) — `consentGiven != 'yes'`: do not proceed / record
  declination.
- **Outside eligible age range** (low) — routine episode with age < 50 or > 70:
  confirm eligibility / route to the correct pathway.
- **Overdue** (low) — `lastScreenedDate` more than ≈ 36 months ago: recall due.
- **Incomplete record** (low) — any required input missing: outcome cannot be
  finalised.

## 6. Inputs and outputs

**Input.** A typed screening object whose shape mirrors the SQL schema in `sql/`.
Unanswered text/enum fields default to `''`; unanswered numeric, date, and time
fields default to `null`.

**Output.** A classification object emitted by the engine:

```ts
{
  eligibilityStatus: 'eligible' | 'outside-age-range'
    | 'higher-risk-surveillance' | 'symptomatic-referral';
  readingOutcome: 'normal-routine-recall' | 'technical-repeat'
    | 'recall-for-assessment' | '';
  imagingClassification: 1 | 2 | 3 | 4 | 5 | null;
  screeningOutcome: 'routine-recall' | 'technical-repeat'
    | 'recall-to-assessment-clinic' | 'short-interval-follow-up'
    | 'urgent-breast-clinic' | 'symptomatic-pathway-referral' | '';
  outcomeBand: 'routine' | 'repeat' | 'assessment' | 'urgent'
    | 'referral' | 'incomplete';
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

- `bin/test-form breast-screening` exits cleanly.
- The classification engine is pure (no side effects, no I/O) and unit-tested,
  covering every reading outcome, every imaging classification 1–5, the
  symptomatic override, the age-range boundaries (49/50, 70/71), and the
  recalled-but-not-yet-assessed state.
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

- [`index.md`](../index.md) — form description and result-classification model
- [`AGENTS.md`](../AGENTS.md) — agent instructions
- [`plan.md`](../plan.md) — implementation roadmap
- [`tasks.md`](../tasks.md) — task tracking
- [`/spec.md`](../../../spec.md) — system-level specification
- [`/AGENTS.md`](../../../AGENTS.md) — cross-cutting agent instructions

## 11. Verify

```sh
bin/test-form breast-screening
```
