# Recognition Of Stroke In the Emergency Room (ROSIER)

A bedside stroke-recognition instrument for adults presenting acutely to the
emergency department with suspected stroke or transient ischaemic attack. It
first excludes two common stroke mimics — **loss of consciousness / syncope**
and **seizure activity** — each subtracting a point, then records five new,
acute-onset neurological signs — **asymmetric facial weakness**, **asymmetric
arm weakness**, **asymmetric leg weakness**, **speech disturbance**, and
**visual field defect** — each adding a point. The signed total runs from
**−2 to +5**. A total **greater than 0** indicates that **stroke is likely** and
the acute stroke pathway should be activated; a total of **0 or below** makes
stroke unlikely but does **not** exclude it. Blood glucose must be measured and
hypoglycaemia corrected before the score is interpreted, because hypoglycaemia
is a treatable stroke mimic.

ROSIER was derived and validated by Nor *et al.* (*Lancet Neurology* 2005) to
improve the accuracy of stroke recognition by emergency-department staff over
general screening tools, distinguishing acute stroke from common mimics at the
point of first contact so that time-critical reperfusion pathways are triggered
without delay.

## Scope and intended users

- **Setting:** emergency department triage and assessment, acute medical take,
  and any first-contact acute-care setting where a suspected stroke arrives.
- **Users:** emergency-department doctors and nurses, acute physicians, stroke
  specialist nurses, and triage clinicians performing the first neurological
  assessment.
- **Patients:** adults (≥ 16 years) presenting with acute suspected stroke or
  transient ischaemic attack within the assessment window.
- **Not for:** definitive stroke diagnosis (which requires imaging), paediatric
  patients, patients whose symptoms are not of new acute onset, or as a
  substitute for clinical judgement. A ROSIER of 0 or below does not exclude
  stroke — if clinical suspicion remains, escalate regardless.

## Scoring system

**Primary instrument:** ROSIER — two exclusionary mimic criteria scoring −1 each
and five acute-onset neurological signs scoring +1 each. Signed total −2 to +5.

**Precondition.** Measure blood glucose first. If blood glucose is
**< 3.5 mmol/L**, treat the hypoglycaemia and reassess; the ROSIER score is not
valid while the patient is hypoglycaemic.

| # | Criterion | Question | Points |
| --- | --- | --- | --- |
| 1 | Loss of consciousness or syncope | Has there been loss of consciousness or syncope? | −1 if yes |
| 2 | Seizure activity | Has there been seizure activity? | −1 if yes |
| 3 | Asymmetric facial weakness | Is there new acute onset of asymmetric facial weakness? | +1 if yes |
| 4 | Asymmetric arm weakness | Is there new acute onset of asymmetric arm weakness? | +1 if yes |
| 5 | Asymmetric leg weakness | Is there new acute onset of asymmetric leg weakness? | +1 if yes |
| 6 | Speech disturbance | Is there new acute onset of speech disturbance? | +1 if yes |
| 7 | Visual field defect | Is there new acute onset of visual field defect? | +1 if yes |

Each criterion is answered **yes** (contributes its points) or **no**
(contributes 0). The total is the signed sum, ranging from −2 (both mimics
present, no neurological signs) to +5 (all five signs present, no mimics).

**Interpretation.**

| Total score | Band | Recommended action |
| --- | --- | --- |
| > 0 (i.e. +1 to +5) | Stroke likely | Positive screen. Activate the acute stroke pathway: urgent stroke-team referral, immediate CT / imaging, and start the thrombolysis / reperfusion clock. Time is brain. |
| ≤ 0 (i.e. −2 to 0) | Stroke unlikely | Stroke is unlikely but **not excluded**. Consider stroke mimics and alternative diagnoses; if clinical suspicion of stroke remains, escalate regardless of the score. |

The threshold for a positive screen is **ROSIER > 0**. In the derivation cohort
this threshold gave high sensitivity for acute stroke while excluding common
mimics such as seizure, syncope, and hypoglycaemia.

## Assessment steps

Completed in order on a single continuous single-page wizard. The glucose
precondition is recorded before the scored criteria.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, symptom onset time |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Blood glucose precondition | measured blood glucose (mmol/L), whether hypoglycaemia corrected before scoring |
| 4 | Mimic exclusions | loss of consciousness / syncope (−1), seizure activity (−1) |
| 5 | Neurological signs | asymmetric facial weakness, asymmetric arm weakness, asymmetric leg weakness, speech disturbance, visual field defect (+1 each) |
| 6 | Summary and score | computed ROSIER total (−2..+5), band (stroke likely / unlikely), fired criteria, red-flag issues, escalation recommendation, free-text clinical note |

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
  decision-support screening tool; the output prompts activation of the stroke
  pathway rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Nor A.M. *et al.* The Recognition of Stroke in the Emergency Room (ROSIER)
  scale: development and validation of a stroke recognition instrument. *Lancet
  Neurology* 2005; 4(11):727–734.
- NICE NG128. *Stroke and transient ischaemic attack in over 16s: diagnosis and
  initial management* (2019, updated 2022).
- Royal College of Physicians. *National Clinical Guideline for Stroke* (2023).

## Verify

```sh
bin/test-form recognition-of-stroke-in-the-emergency-room
```
