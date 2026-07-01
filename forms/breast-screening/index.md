# Breast Screening Record (NHS Breast Screening Programme)

A documentation and result-classification record for a mammography breast
screening encounter within the **NHS Breast Screening Programme (NHSBSP)**. It
captures the screening episode end to end — **eligibility**, **consent**, the
**mammogram views** taken, the **radiological reporting outcome** of film
reading, and, where the woman is recalled, the **assessment result** expressed
with a breast imaging classification. From these inputs the engine classifies
the **screening outcome and next action**, validates completeness, and raises
safety flags.

Routine screening invites women aged **50–70** on a **3-yearly** recall cycle
(the age range is being extended to 47–73 in a phased randomised roll-out).
Women at higher-than-average risk (for example strong family history or a known
pathogenic variant) are managed on a **separate higher-risk surveillance
pathway** and are out of scope for routine-recall classification here. A woman
with a **breast symptom** is not a screening candidate and must be referred via
the **symptomatic breast pathway**, not screening.

This is a **documentation + result-classification** form, not a scored screen: it
records what was done and the reported result, then derives the outcome and the
correct onward action.

## Scope and intended users

- **Setting:** NHS breast screening unit (static or mobile), breast radiology
  reading room, and screening office administration.
- **Users:** mammographers and advanced-practitioner radiographers (image
  acquisition and technical reporting), breast radiologists (film reading and
  assessment), and screening-office staff (episode administration and recall).
- **Subjects:** women invited for routine mammography screening (age 50–70,
  3-yearly), and women attending assessment after a screening recall.
- **Not for:** higher-risk surveillance imaging (separate pathway), symptomatic
  breast assessment (symptomatic pathway), diagnostic staging of known cancer,
  or paediatric use. A normal screening result does not exclude interval cancer;
  re-attend at the next invitation and report new symptoms promptly.

## Data captured & result-classification model

The record has three logical parts: **eligibility and consent**, **mammogram and
reporting outcome**, and **assessment result**. From these the engine derives the
**screening outcome** and **next action**.

**Reading outcome** (film-reading result, normally by double reading with
arbitration):

| Reading outcome | Meaning |
| --- | --- |
| Normal — routine recall | No significant abnormality; return to routine 3-yearly screening. |
| Technical repeat | Image quality inadequate (positioning, exposure, movement); repeat the mammogram. |
| Recall for assessment | Abnormality or query detected; recall the woman to an assessment clinic. |

**Assessment result** — breast imaging classification (used when the woman is
recalled and assessed; the NHSBSP five-point imaging concept, aligned with the
RCR breast imaging classification and the BI-RADS family):

| Class | Category | Interpretation |
| --- | --- | --- |
| 1 | Normal | No abnormality; return to routine recall. |
| 2 | Benign | Benign appearance; return to routine recall. |
| 3 | Indeterminate / probably benign | Uncertain; short-interval follow-up or biopsy per local protocol. |
| 4 | Suspicious | Suspicious of malignancy; needs tissue diagnosis and urgent review. |
| 5 | Malignant | Highly suggestive of malignancy; urgent breast-clinic and MDT pathway. |

**Screening outcome / next action** (derived):

| Screening outcome | Driven by |
| --- | --- |
| Routine 3-yearly recall | Reading outcome *normal*, or assessment class 1–2. |
| Technical repeat | Reading outcome *technical repeat*. |
| Recall to assessment clinic | Reading outcome *recall for assessment*, before an assessment result is recorded. |
| Short-interval / early-recall follow-up | Assessment class 3 (indeterminate). |
| Urgent breast-clinic referral | Assessment class 4–5 (suspicious / malignant). |
| Symptomatic-pathway referral | Woman is symptomatic — not a screening outcome. |

**Eligibility rules** (derived): *eligible* when age 50–70 and the episode is a
routine recall; *outside age range* below 50 or above 70 for a routine episode;
*higher-risk surveillance* when flagged on the surveillance pathway;
*symptomatic referral* when a symptom is reported. *Overdue* when the last screen
was more than the recall interval (≈ 36 months) ago.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Screening context | reporting clinician name and role, date and time reported, screening unit, episode type (routine recall / very-first-call / self-referral / higher-risk surveillance) |
| 2 | Identification & eligibility | patient identifier (NHS number), age in years, date last screened, higher-risk surveillance flag |
| 3 | Symptom & consent check | symptomatic (yes/no), consent given (yes / no / declined) |
| 4 | Mammogram | views taken (standard four-view / additional views / unable to image), image adequacy (adequate / inadequate) |
| 5 | Reading outcome | first-read opinion, second-read opinion, arbitration outcome, reading outcome (normal / technical repeat / recall for assessment) |
| 6 | Assessment result | assessment performed (yes/no), modalities used (mammography / ultrasound / biopsy), breast imaging classification 1–5 |
| 7 | Summary & outcome | computed eligibility status, reading outcome, imaging classification, screening outcome and next action, flagged issues, free-text note |

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

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — screening
  documentation and result-classification decision support; the output records a
  reported result and prompts the correct onward pathway rather than making a
  diagnosis.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Public Health England / NHS England. *NHS Breast Screening Programme (NHSBSP)*
  guidance and *Consolidated standards*.
- Royal College of Radiologists. *Breast imaging classification* and reporting
  guidance.
- NHSBSP. *Clinical guidance for breast cancer screening assessment* (double
  reading, arbitration, and assessment).
- NICE NG101. *Early and locally advanced breast cancer* (referral and
  assessment context).

## Verify

```sh
bin/test-form breast-screening
```
