# Inpatient Clinical Note — Domain Spec

Living domain specification. Update this before changing code; regenerate
derived artefacts after schema changes. See the repo root [`spec.md`](../../../spec.md)
§10 for the spec-driven workflow.

## 1. Purpose and boundary

An inpatient clinical note is one entry in the clinical record of an **admission
episode**. This spec defines the note's data shape, the two grading engines, and
the safety flags.

**In scope:** structured capture of any of the eight note types listed in §3,
documentation-completeness grading, clinical-acuity banding, safety flagging,
and export.

**Out of scope:** diagnosis, triage, treatment recommendation, prescribing
decision support, and the discharge summary document. The completeness grade
describes the *record*; the acuity band describes the *observations as recorded*.
Neither substitutes for clinical judgement, and neither is a medical-device
diagnostic function.

## 2. Entities

| Entity | Cardinality | Notes |
| --- | --- | --- |
| `patient` | 1 | Demographics; one patient has many notes |
| `clinician` | 1..n | Note author, responsible consultant, named seniors |
| `inpatient_clinical_note` | 1 | The note itself; belongs to one patient and one author |
| `inpatient_clinical_note_problem` | 0..n | Problem-list rows |
| `inpatient_clinical_note_medication_change` | 0..n | Prescribing-change rows |
| `inpatient_clinical_note_investigation` | 0..n | Investigations-reviewed rows |
| `inpatient_clinical_note_job` | 0..n | Plan / outstanding-job rows |
| `inpatient_clinical_note_grade` | 0..1 | Computed grading result (unique per note) |
| `inpatient_clinical_note_grade_rule` | 0..n | Audit trail of fired rules |
| `inpatient_clinical_note_grade_flag` | 0..n | Safety flags |

A note is soft-deleted (`deleted_at`), never hard-deleted: the clinical record
is append-only in law and in practice. Corrections are recorded by writing an
amended note with `status = 'amended'` that references the original.

## 3. Note types

`note_type` is required and drives §4's required-component set.

| Value | Meaning |
| --- | --- |
| `admission-clerking` | First full assessment on admission |
| `progress` | Routine interval progress entry |
| `consult` | Specialty opinion requested by the parent team |
| `event` | Acute deterioration or clinical incident |
| `procedure` | Bedside procedure performed on the ward |
| `handover` | End-of-shift handover entry |
| `transfer` | Inter-ward or inter-hospital transfer |
| `discharge-planning` | Discharge readiness and arrangements |

## 4. Completeness engine

### 4.1 Components

Twelve components. `documented` is a predicate over the note's fields; an
explicit negative counts as documented.

| Key | Base | Documented predicate |
| --- | --- | --- |
| `header` | required | `noteType != ''` and `noteAt != null` and `authorName != ''` and `authorGrade != ''` |
| `interval-history` | required | `intervalHistory != ''` or `noIntervalEvents == 'yes'` |
| `observations` | required | `news2Total != null` or all seven NEWS2 parameters present |
| `examination` | recommended | any `examination*` field non-empty |
| `investigations` | recommended | `investigations.length > 0` or `noInvestigationsReviewed == 'yes'` |
| `problems` | required | `problems.length > 0` |
| `medications` | required | `medicationChanges.length > 0` or `noMedicationChanges == 'yes'` |
| `risk-assessments` | required | `vteStatus != ''` |
| `impression` | required | `clinicalImpression != ''` |
| `plan` | required | `plan != ''` or `jobs.length > 0` |
| `escalation` | required | `escalationStatus != ''` and `ceilingOfCare != ''` |
| `communication` | recommended | `familyCommunication != ''` or `patientCommunication != ''` or `teamHandover != ''` |

### 4.2 Required set by note type

Base required = `header`, `interval-history`, `observations`, `problems`,
`medications`, `risk-assessments`, `impression`, `plan`, `escalation` (nine).
Note types add to this set:

| Note type | Additions | Total required |
| --- | --- | --- |
| `admission-clerking` | `examination`, `investigations` | 11 |
| `progress` | — | 9 |
| `consult` | `examination`, `communication` | 11 |
| `event` | — (all already required) | 9 |
| `procedure` | `examination`, `communication` | 11 |
| `handover` | — | 9 |
| `transfer` | `communication` | 10 |
| `discharge-planning` | `communication` | 10 |

### 4.3 Classification

Let `R` be the required set, `D` the documented members of `R`.

- `complete` — `|D| == |R|`.
- `partial` — `header`, `impression`, `plan` all in `D`, and `|D| >= ceil(|R| / 2)`.
- `incomplete` — otherwise.

`completenessPercent = round(|D| / |R| × 100)`.

The status is **not** overridable. It is a mechanical property of the record.

## 5. Acuity engine

Max-band over the rules below. Default `stable`. Bands order
`stable < watch < escalate < critical`.

### 5.1 NEWS2

`news2Total` is entered directly when known. When it is absent and all seven
parameters are present, it is derived per RCP 2017:

| Parameter | 3 | 2 | 1 | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Respiratory rate (/min) | ≤8 | | 9–11 | 12–20 | | 21–24 | ≥25 |
| SpO2 scale 1 (%) | ≤91 | 92–93 | 94–95 | ≥96 | | | |
| Air or oxygen | | oxygen | | air | | | |
| Systolic BP (mmHg) | ≤90 | 91–100 | 101–110 | 111–219 | | | ≥220 |
| Pulse (/min) | ≤40 | | 41–50 | 51–90 | 91–110 | 111–130 | ≥131 |
| Consciousness (ACVPU) | | | | Alert | | | C, V, P, or U |
| Temperature (°C) | ≤35.0 | | 35.1–36.0 | 36.1–38.0 | 38.1–39.0 | ≥39.1 | |

An entered total always wins over a derived one; both are reported. SpO2 scale 2
(hypercapnic respiratory failure) is recorded via `spo2Scale` and scored per the
RCP scale-2 table when selected.

### 5.2 Band rules

| Rule | Condition | Band |
| --- | --- | --- |
| `A-NEWS2-LOW` | NEWS2 0–4, no parameter scoring 3 | stable |
| `A-NEWS2-MEDIUM` | NEWS2 5–6 | watch |
| `A-NEWS2-SINGLE-3` | Any single parameter scores 3 | watch |
| `A-NEWS2-TREND` | `news2Trend == 'worsening'` | watch |
| `A-NEWS2-HIGH` | NEWS2 ≥ 7 | escalate |
| `A-NEW-OXYGEN` | `newOxygenRequirement == 'yes'` | escalate |
| `A-NEW-CONFUSION` | `acvpu` not `alert` and `newConfusion == 'yes'` | escalate |
| `A-SEPSIS` | `sepsisScreen == 'positive'` | escalate |
| `A-ABNORMAL-UNRESOLVED` | Any investigation abnormal and not actioned | escalate |
| `A-NEWS2-CRITICAL` | NEWS2 ≥ 9 | critical |
| `A-ARREST` | `arrestCall` in (`cardiac`, `respiratory`, `peri-arrest`) | critical |
| `A-CRITICAL-CARE` | `criticalCareReferral == 'yes'` | critical |
| `A-ORGAN-SUPPORT` | `newOrganSupport != ''` and `!= 'none'` | critical |

### 5.3 Override

The author may set `authorOverrideAcuity` with `authorOverrideReason`. The
computed band is retained in `computed_acuity_band`; the final band is stored in
`acuity_band`. An override without a reason is rejected by the front-end and by
the API.

## 6. Safety flags

Each flag has a stable id, category, priority, description, and suggested
action. Flags fire independently of both grades.

| Category | Condition | Priority |
| --- | --- | --- |
| `deteriorating-news2-no-escalation` | acuity ≥ escalate and `escalationAction == ''` | high |
| `sepsis-screen-positive-no-action` | `sepsisScreen == 'positive'` and no antimicrobial change and `escalationAction == ''` | high |
| `vte-not-assessed` | `vteStatus == 'not-done'` | high |
| `abnormal-result-not-actioned` | any investigation `abnormal == 'yes'` and `actioned == 'no'` | high |
| `no-plan-documented` | `plan == ''` and `jobs.length == 0` | high |
| `allergy-not-checked` | `medicationChanges.length > 0` and `allergyChecked != 'yes'` | high |
| `no-senior-review` | (acuity ≥ escalate or `ceilingOfCare != ''`) and `seniorReviewBy == ''` | medium |
| `ceiling-of-care-undocumented` | `escalationStatus != ''` and `ceilingOfCare == ''` | medium |
| `antimicrobial-review-overdue` | `antimicrobialReviewStatus == 'overdue'` | medium |
| `no-capacity-assessment` | `consentStatus` in (`lacks-capacity`, `best-interests`) and `capacityAssessed != 'yes'` | medium |
| `long-stay-no-discharge-plan` | `lengthOfStayDays > 7` and `estimatedDischargeDate == null` | low |
| `incomplete-entry` | any required component absent | low |

## 7. Field conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric, date, and time fields.
- `yes` / `no` / `''` for tri-state booleans; `na` added where genuinely not
  applicable.
- snake_case in SQL, camelCase in the front-end and in serde-facing Rust.
- All timestamps are `TIMESTAMPTZ`; durations (length of stay) are derived in
  code, never stored as a computed column.

## 8. Validation rules

- `note_at` must not precede `admission_at`.
- `estimated_discharge_date` must not precede the date of `note_at`.
- `news2_total` must be in 0..20 when present.
- An `authorOverrideAcuity` requires a non-empty `authorOverrideReason`.
- `status = 'signed'` requires `electronic_signature != ''` and
  `attestation_text != ''`.
- A `procedure` note requires `procedure_performed != ''`.
- A `consult` note requires `consult_question != ''`.

## 9. Open questions

- Whether to link an amended note to its predecessor by an explicit
  `amends_note_id` foreign key rather than by convention. Deferred until a
  second form in this family needs the same amendment chain.
- Whether the 4AT delirium screen should embed the full four-item scoring rather
  than the summary band, given
  [`four-a-test-for-delirium`](../../four-a-test-for-delirium) already models it
  in full.
