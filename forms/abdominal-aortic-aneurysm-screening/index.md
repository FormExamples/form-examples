# Abdominal Aortic Aneurysm (AAA) Screening

A documentation and result-classification form for the **UK NHS Abdominal
Aortic Aneurysm (AAA) Screening Programme**. It records a single abdominal
ultrasound of the aorta: eligibility, consent, and the **maximum
antero-posterior aortic diameter** measured in centimetres. From that diameter
a validated engine classifies the aorta into one of four categories — normal,
small aneurysm, medium aneurysm, or large aneurysm — and sets the corresponding
**surveillance or referral action**. It checks completeness and raises clinical
flags (large aneurysm requiring vascular referral, rapid growth, a
non-visualized aorta requiring re-scan, or a symptomatic patient requiring
emergency assessment).

An abdominal aortic aneurysm is a localized dilatation of the abdominal aorta.
Most are asymptomatic until rupture, which is frequently fatal. Ultrasound
screening of the at-risk population detects aneurysms early so that small ones
can be watched and large ones repaired electively. In England, men are invited
in the year they turn 65; men over 65 who have never been screened may
self-refer. The programme measures the aorta, classifies the result by
diameter, and either discharges the patient, enrols them in surveillance, or
refers them to vascular surgery.

This form is **documentation plus a deterministic result-classification
engine**: it captures the scan and, from the maximum aortic diameter, derives
the aneurysm category and the surveillance/referral action. It does not
diagnose, and it does not decide whether to operate — that is a vascular
surgical decision informed by the referral.

## Scope and intended users

- **Setting:** community and hospital-based ultrasound clinics operating within
  the NHS AAA Screening Programme, and vascular services receiving referrals.
- **Users:** AAA screening technicians and clinical skills trainers performing
  and recording the ultrasound; screening programme administrators managing
  invitation, surveillance recall, and referral; vascular nurse specialists and
  vascular surgeons acting on referrals.
- **Patients:** men in the year they turn 65 (routine cohort) and men over 65
  who self-refer; other patients scanned at clinician discretion.
- **Not for:** definitive diagnosis of aortic pathology beyond infrarenal
  diameter, decisions on surgical technique, thoracic aortic disease, or
  paediatric use. The result prompts surveillance or referral; it does not
  replace vascular clinical judgement.

## Data captured & classification model

The clinically significant measurement is the **maximum aortic diameter** in
centimetres (the largest antero-posterior inner-to-inner diameter of the
infrarenal aorta). The classification engine maps that single value to a
category, a surveillance/referral band, and a recommended action using fixed
thresholds:

| Category | Maximum aortic diameter | Surveillance / referral action |
| --- | --- | --- |
| **Normal** | `< 3.0 cm` | No aneurysm. Discharge from screening; no further surveillance. |
| **Small aneurysm** | `3.0 – 4.4 cm` | Annual (12-monthly) ultrasound surveillance. |
| **Medium aneurysm** | `4.5 – 5.4 cm` | Three-monthly (quarterly) ultrasound surveillance. |
| **Large aneurysm** | `≥ 5.5 cm` | Refer to vascular surgery for assessment and consideration of elective repair. |

The three thresholds are **3.0 cm**, **4.5 cm**, and **5.5 cm**. Bands are
inclusive of their lower bound and exclusive of the next (`[3.0, 4.5)`,
`[4.5, 5.5)`, `[5.5, ∞)`); anything below 3.0 cm is normal. These are the
thresholds and recall intervals used by the NHS AAA Screening Programme.

An aorta that cannot be adequately visualized is **not** classified as normal:
the result is recorded as *non-visualized* and a re-scan is arranged.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Screening context | screening technician name and role, clinic / site, date and time of scan, ultrasound device identifier |
| 2 | Patient identification & eligibility | patient identifier, age, sex, eligibility route (routine year-of-65 invitation / self-referral over 65 / other), first scan or surveillance re-scan |
| 3 | Consent | informed consent given (yes/no), information leaflet provided, any refusal or query recorded |
| 4 | Ultrasound measurement | aorta adequately visualized (yes/no), maximum aortic diameter (cm), prior maximum diameter and prior scan date (for surveillance patients) |
| 5 | Clinical observations | patient symptomatic (abdominal/back pain, tenderness), incidental findings, notes |
| 6 | Result & action | computed category, surveillance/referral band, recommended action, growth since prior scan, flagged issues, free-text result note |

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
  decision-support screening tool; the output prompts surveillance or referral
  rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NHS AAA Screening Programme (NHS AAA SP). *Programme standards and clinical
  service specification* — diameter thresholds (3.0 / 4.5 / 5.5 cm) and recall
  intervals (annual, three-monthly).
- Public Health England / NHS England. *Abdominal aortic aneurysm screening:
  programme overview.*
- NICE NG156. *Abdominal aortic aneurysm: diagnosis and management* (2020).

## Verify

```sh
bin/test-form abdominal-aortic-aneurysm-screening
```
