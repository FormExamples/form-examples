# Hypertension Annual Review

A UK primary-care **annual hypertension review** that records the objective data
needed to confirm blood-pressure control and complete a structured yearly review
under **NICE NG136** (*Hypertension in adults: diagnosis and management*). It
captures clinic and home/ambulatory blood pressure, medication and adherence,
cardiovascular risk (QRISK), annual bloods (U&E, HbA1c, lipids), urine
albumin:creatinine ratio (ACR), lifestyle, and complications.

The engine is a **control-classification and documentation-completeness** tool.
It does not diagnose or prescribe. It classifies blood-pressure control against
the patient's age- and comorbidity-specific target, assigns a hypertension stage
where relevant, grades how complete the annual review is, and raises flags —
most importantly a **severe hypertension** flag (clinic BP ≥ 180/120 mmHg) that
prompts same-day assessment, an **uncontrolled BP** flag that prompts medication
review, and completeness flags for missing annual bloods, missing urine ACR, and
high cardiovascular risk that is untreated.

## Scope and intended users

- **Setting:** UK general practice — annual chronic-disease review clinic,
  hypertension or long-term-conditions clinic, community pharmacy review.
- **Users:** general practitioners (GPs), practice nurses, and clinical
  pharmacists conducting the structured annual review.
- **Patients:** adults (≥ 16 years) already on a hypertension register, attending
  for their scheduled annual review.
- **Not for:** initial diagnosis of hypertension (use ABPM/HBPM confirmation),
  hypertensive emergency triage, pregnancy hypertension / pre-eclampsia
  management, or paediatric blood-pressure assessment. A "controlled"
  classification does not remove the need for clinical judgement.

## Sections captured

The review is completed in order on a single continuous single-page wizard. Each
step records **objective review data**.

| # | Section | Key fields |
| --- | --- | --- |
| 1 | Review context | clinician name and role (GP / practice nurse / pharmacist), review date, practice/site, review type |
| 2 | Patient identification | NHS number, name, date of birth, age band, sex, ethnicity |
| 3 | Diagnosis & comorbidity | date of diagnosis, type 2 diabetes, chronic kidney disease (CKD), established cardiovascular disease (CVD), atrial fibrillation — these drive the BP target |
| 4 | Clinic blood pressure | seated clinic systolic/diastolic (best of repeated readings), arm, postural (lying/standing) BP |
| 5 | Home / ambulatory BP | HBPM average or ABPM daytime average systolic/diastolic, monitoring method |
| 6 | Medication & adherence | antihypertensive drug classes and doses, number of agents, adherence assessment, side effects |
| 7 | Cardiovascular risk | QRISK 10-year percentage, smoking status, statin therapy, prior CVD event |
| 8 | Bloods & investigations | U&E (sodium, potassium, creatinine, eGFR), HbA1c, total and HDL cholesterol, sample dates, ECG if performed |
| 9 | Urine ACR | urine albumin:creatinine ratio, sample date, ACR category |
| 10 | Lifestyle | smoking, alcohol units per week, physical activity, dietary salt, BMI, weight |
| 11 | Complications & target-organ damage | left-ventricular hypertrophy, retinopathy, CKD progression, prior stroke / MI, heart failure |
| 12 | Summary & plan | computed control status, hypertension stage, review completeness, fired rules, flags, medication and recall plan, clinician note |

## Control-classification & completeness model

### Blood-pressure targets (NICE NG136)

The target is selected from the patient's age band and comorbidity. Home and
ambulatory (HBPM/ABPM) targets are 5 mmHg lower on each of systolic and diastolic
than the clinic target.

| Patient group | Clinic target | HBPM / ABPM target |
| --- | --- | --- |
| Age < 80, no qualifying comorbidity | < 140/90 | < 135/85 |
| Age ≥ 80 | < 150/90 | < 145/85 |
| Type 2 diabetes | < 140/90 | < 135/85 |
| CKD with ACR < 70 mg/mmol (no diabetes) | < 140/90 | < 135/85 |
| CKD with diabetes, or ACR ≥ 70 mg/mmol | < 130/80 | < 125/75 |

When both a clinic and a home/ambulatory reading are present, the home/ambulatory
reading is the primary basis for control classification (it is less affected by
white-coat effect); the clinic reading still drives the severe-hypertension flag.

### Control classes

The engine classifies control against the selected target:

- **Controlled** — measured BP at or below the applicable target, and not severe.
- **Uncontrolled** — measured BP above target (systolic or diastolic), and not
  severe.
- **Severe uncontrolled** — clinic BP **≥ 180/120 mmHg** (systolic ≥ 180 *or*
  diastolic ≥ 120). Prompts same-day clinical assessment.

### Hypertension stage (from raw readings, NICE NG136)

- **Stage 1** — clinic ≥ 140/90 and HBPM/ABPM average ≥ 135/85.
- **Stage 2** — clinic ≥ 160/100 and HBPM/ABPM average ≥ 150/95.
- **Stage 3 (severe)** — clinic systolic ≥ 180 or clinic diastolic ≥ 120.

### Review status (documentation completeness)

The engine grades how complete the annual review is against its core components
(clinic BP, home/ambulatory BP, medication & adherence, U&E, HbA1c, lipids,
urine ACR, cardiovascular risk, lifestyle):

- **Complete** — all core components recorded.
- **Partial** — blood pressure recorded but one or more secondary components
  (bloods, ACR, CV risk, lifestyle) missing.
- **Incomplete** — no blood-pressure reading recorded, so control cannot be
  classified.

### Flags

Computed independently of the control class, each with a priority:

- **Severe hypertension** (high) — clinic BP ≥ 180/120: arrange same-day
  assessment.
- **Uncontrolled blood pressure** (high) — BP above target: review and step up
  antihypertensive medication.
- **Missing annual bloods** (medium) — U&E, HbA1c, or lipids not recorded in the
  review period.
- **Missing urine ACR** (medium) — no urine albumin:creatinine ratio recorded.
- **High cardiovascular risk untreated** (medium) — QRISK ≥ 10% with no statin
  therapy recorded.
- **Adherence concern** (medium) — reported non-adherence or troublesome side
  effects.
- **Postural drop** (medium) — symptomatic postural systolic fall ≥ 20 mmHg.

## Assessment steps

See the *Sections captured* table above — twelve steps on one continuous
single-page wizard, ending in a computed summary (control status, hypertension
stage, review completeness, fired rules, flags) and a free-text clinician note.

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The classification engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support and documentation tool; the output classifies and flags
  rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NICE NG136. *Hypertension in adults: diagnosis and management* (2019, updated
  2023).
- NICE CG181. *Cardiovascular disease: risk assessment and reduction, including
  lipid modification.*
- NICE NG203. *Chronic kidney disease: assessment and management.*
- ClinRisk. *QRISK3 cardiovascular risk calculator.*
- British and Irish Hypertension Society. *Home blood-pressure monitoring
  protocol.*

## Verify

```sh
bin/test-form hypertension-review
```
