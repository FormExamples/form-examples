# HAS-BLED Score for Major Bleeding Risk

A bedside bleeding-risk score for adults with atrial fibrillation (AF) who are
receiving, or being considered for, oral anticoagulation. It records nine
clinical criteria — **H**ypertension, **A**bnormal renal and liver function,
**S**troke, **B**leeding history or predisposition, **L**abile INR,
**E**lderly, and **D**rugs or alcohol — scores each present criterion, sums a
total of **0–9**, and flags the patient as being at **higher risk of major
bleeding** when the score is **≥ 3**.

A high HAS-BLED score is **not** a contraindication to anticoagulation and must
not by itself be used to withhold it. Instead it identifies patients who warrant
**caution, more frequent review, and correction of modifiable bleeding-risk
factors** (uncontrolled hypertension, labile INR, concomitant antiplatelets or
NSAIDs, and excess alcohol). It is designed to be used **alongside** a
stroke-risk score (**CHA₂DS₂-VASc**): the two scores together inform the balance
of benefit and harm of anticoagulation.

HAS-BLED was derived and validated by Pisters *et al.* (*Chest* 2010) in the
Euro Heart Survey on Atrial Fibrillation and is recommended for bleeding-risk
assessment by the European Society of Cardiology (ESC) and NICE AF guidelines.

## Scope and intended users

- **Setting:** cardiology, general practice, anticoagulation clinics, acute
  medical and stroke services — any setting where oral anticoagulation for AF is
  started, reviewed, or reconsidered.
- **Users:** doctors, nurses, pharmacists, and other clinicians managing
  anticoagulation.
- **Patients:** adults (≥ 18 years) with atrial fibrillation who are on, or being
  considered for, oral anticoagulation.
- **Not for:** determining whether to withhold anticoagulation on its own,
  paediatric patients, venous thromboembolism dosing decisions, or as a
  substitute for clinical judgement. A HAS-BLED score below 3 does not guarantee
  the absence of bleeding.

## Scoring system

**Primary instrument:** HAS-BLED — nine criteria. Each present criterion adds the
points shown; two letters (**A** and **D**) cover two independently scored items.
Total score 0–9.

| Letter | Criterion | Scores when present | Points |
| --- | --- | --- | --- |
| H | Hypertension | Uncontrolled, systolic blood pressure > 160 mmHg | 1 |
| A | Abnormal renal function | Dialysis, transplant, or serum creatinine ≥ 200 µmol/L | 1 |
| A | Abnormal liver function | Chronic hepatic disease (e.g. cirrhosis) or bilirubin > 2× upper limit of normal with AST/ALT/ALP > 3× upper limit of normal | 1 |
| S | Stroke | Previous stroke history | 1 |
| B | Bleeding history or predisposition | Prior major bleeding, bleeding diathesis, or anaemia | 1 |
| L | Labile INR | Unstable or high INRs, or time in therapeutic range < 60% (warfarin patients) | 1 |
| E | Elderly | Age > 65 years | 1 |
| D | Drugs | Concomitant antiplatelet agents or NSAIDs | 1 |
| D | Alcohol | ≥ 8 alcohol units per week | 1 |

**Interpretation.**

| Total score | Risk band | Recommended action |
| --- | --- | --- |
| 0 | Low | Low estimated major-bleeding risk. Anticoagulate per stroke-risk (CHA₂DS₂-VASc); routine review. |
| 1–2 | Moderate | Moderate estimated bleeding risk. Anticoagulate where stroke risk warrants; address any modifiable factors and review periodically. |
| 3–9 | High | Higher estimated major-bleeding risk. **Not a contraindication** to anticoagulation: exercise caution, review more frequently, and actively correct modifiable factors (control blood pressure, improve INR stability, stop unnecessary antiplatelets/NSAIDs, reduce alcohol). Weigh against CHA₂DS₂-VASc stroke risk. |

The threshold for a positive (high-risk) screen is **HAS-BLED ≥ 3**, associated
in the derivation cohort with an increased annual rate of major bleeding. The
score's principal clinical value is to highlight **modifiable** bleeding-risk
factors that can be corrected rather than to decide for or against
anticoagulation.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
one or more HAS-BLED criteria.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, anticoagulation status (on / considering), CHA₂DS₂-VASc score if known |
| 2 | Patient identification | patient identifier, age, sex |
| 3 | Hypertension | uncontrolled hypertension / systolic BP > 160 mmHg → criterion H |
| 4 | Renal and liver function | abnormal renal function; abnormal liver function → criterion A (×2) |
| 5 | Stroke history | previous stroke → criterion S |
| 6 | Bleeding history | prior major bleeding, predisposition, or anaemia → criterion B |
| 7 | Labile INR | unstable/high INR or time in therapeutic range < 60% → criterion L |
| 8 | Age | age > 65 years → criterion E |
| 9 | Drugs and alcohol | antiplatelets/NSAIDs; alcohol ≥ 8 units/week → criterion D (×2) |
| 10 | Summary and score | computed HAS-BLED total, risk band, fired criteria, flagged issues (modifiable factors), recommendation, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support scoring tool; the output informs and prompts review rather
  than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Pisters R. *et al.* A Novel User-Friendly Score (HAS-BLED) to Assess 1-Year
  Risk of Major Bleeding in Patients with Atrial Fibrillation. *Chest* 2010;
  138(5):1093–1100.
- Lip G.Y.H. *et al.* Bleeding risk assessment and management in atrial
  fibrillation patients. *Thromb Haemost* 2011; 106(6):997–1011.
- Hindricks G. *et al.* 2020 ESC Guidelines for the diagnosis and management of
  atrial fibrillation. *Eur Heart J* 2021; 42(5):373–498.
- NICE NG196. *Atrial fibrillation: diagnosis and management* (2021).

## Verify

```sh
bin/test-form has-bled-score-for-major-bleeding-risk
```
