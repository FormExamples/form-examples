# Diabetic Eye Screening record

A structured record of a diabetic retinal screening episode for the **UK NHS
Diabetic Eye Screening Programme (DESP)**. For each eye it captures the grade
assigned to retinal photographs using the programme's **retinopathy (R)** and
**maculopathy (M)** classification, together with the **photocoagulation (P)**
and **ungradable (U)** markers. From the two graded eyes it classifies the
worst-eye result, derives the **recall interval** or **referral pathway**,
validates completeness, and raises flagged issues (urgent ophthalmology,
routine hospital eye service referral, re-screen / slit-lamp biomicroscopy,
patient overdue).

This is a **documentation + result-classification** form. It does not interpret
raw images; it records the grade a trained screener/grader has assigned and
applies the programme's deterministic feature-based grading and outcome rules to
produce the onward action. The output prompts recall or referral rather than
determining treatment.

## Scope and intended users

- **Setting:** the NHS Diabetic Eye Screening Programme — mobile and fixed
  digital retinal screening clinics, grading centres, and the hospital eye
  service (HES) / ophthalmology clinics that receive referrals.
- **Users:** retinal screeners and photographers who capture the images;
  primary and secondary graders who assign R/M grades; failsafe and programme
  administrators managing recall; ophthalmologists reviewing referrals.
- **Patients:** people registered with diabetes (Type 1 or Type 2) aged
  **12 years or over** who are eligible for and invited to routine diabetic eye
  screening.
- **Not for:** symptomatic acute ophthalmic presentations (send directly to
  eye casualty), children under 12, non-diabetic retinopathy, or as a substitute
  for slit-lamp examination where the digital images are ungradable.

## Data captured & classification model

The record has two graded eyes. Each eye carries four features.

**Per-eye retinopathy grade (R).**

| Grade | Meaning |
| --- | --- |
| `R0` | No diabetic retinopathy |
| `R1` | Background diabetic retinopathy |
| `R2` | Pre-proliferative diabetic retinopathy |
| `R3A` | Proliferative diabetic retinopathy — **active** |
| `R3S` | Proliferative diabetic retinopathy — **stable** (treated) |

**Per-eye maculopathy grade (M).**

| Grade | Meaning |
| --- | --- |
| `M0` | No diabetic maculopathy |
| `M1` | Diabetic maculopathy present |

**Per-eye markers.**

| Marker | Meaning |
| --- | --- |
| `P` | Photocoagulation — evidence of previous laser treatment |
| `U` | Ungradable — image quality insufficient to assign a grade |

**Worst-eye classification and outcome.** The engine ranks retinopathy severity
`R0 < R1 < R2 < R3S < R3A`, takes the worst grade across both eyes for
retinopathy and for maculopathy, notes whether either eye is ungradable, and
maps the result to a recall / referral pathway (most urgent wins).

| Pathway | Triggered by (worst eye) | Action |
| --- | --- | --- |
| `refer-hes-urgent` | any `R3A` | Urgent / fast-track referral to ophthalmology |
| `refer-hes` | any `M1` maculopathy, or `R3S` stable proliferative | Routine referral to hospital eye service |
| `refer-slit-lamp` | any `U` ungradable, no referable disease above | Re-screen or refer for slit-lamp biomicroscopy |
| `surveillance-6-month` | any `R2` pre-proliferative, no maculopathy / proliferative / ungradable | 6-monthly digital surveillance |
| `routine-12-month` | worst grade `R1`, or `R0`/`M0` not eligible for extended recall | Routine 12-monthly digital screening |
| `routine-24-month` | `R0`/`M0` both eyes and low-risk eligible (prior screen also `R0`/`M0`) | Routine 24-monthly (extended, low-risk) screening |

`P` (photocoagulation) is a modifier recorded for context; it does not by itself
change the pathway. Low-risk 24-monthly recall is only offered when this and the
previous screen are both `R0`/`M0`.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Grading context | grader name and role, grading date, image capture date, imaging media / camera |
| 2 | Patient identification | patient identifier, age band, diabetes type, years since diagnosis, previous screen date and result |
| 3 | Right eye grading | retinopathy grade, maculopathy grade, photocoagulation, ungradable, visual acuity |
| 4 | Left eye grading | retinopathy grade, maculopathy grade, photocoagulation, ungradable, visual acuity |
| 5 | Summary and outcome | computed worst-eye R/M grade, recall / referral pathway, recall interval, fired flags, free-text grader note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The grading engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support screening tool; the output prompts recall or referral rather
  than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- NHS Diabetic Eye Screening Programme. *Grading definitions for referable
  disease* and *Diabetic eye screening: grading feature classification.*
- Public Health England / NHS England. *NHS Diabetic Eye Screening Programme
  overview* and *pathway standards.*
- Harding S. *et al.* Grading and disease management in national screening for
  diabetic retinopathy in England and Wales. *Diabetic Medicine* 2003.
- Royal College of Ophthalmologists. *Diabetic Retinopathy Guidelines.*

## Verify

```sh
bin/test-form diabetic-eye-screening
```
