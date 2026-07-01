# QRISK3 Cardiovascular Disease Risk Score

A primary-prevention risk calculator that estimates an adult's **10-year risk of
a first cardiovascular disease (CVD) event** — coronary heart disease, stroke, or
transient ischaemic attack — from routinely available clinical data. It records
demographic, lifestyle, comorbidity, and measurement inputs on a single
continuous single-page wizard, applies the published **QRISK3 Cox
proportional-hazards model**, and returns a **10-year CVD risk percentage**, a
risk band, and a **heart age**. A result of **≥ 10 %** meets the NICE threshold
at which a lipid-lowering statin (atorvastatin 20 mg) should be offered alongside
lifestyle advice.

QRISK3 (Hippisley-Cox *et al.*, *BMJ* 2017) is the calculator recommended by
NICE for CVD risk assessment in England and Wales. It refines the earlier QRISK2
by adding chronic kidney disease stages, atrial fibrillation, migraine,
corticosteroid and atypical-antipsychotic use, systemic lupus erythematosus,
severe mental illness, erectile dysfunction, and systolic blood-pressure
variability. Separate models are fitted for women and men. A high score is not a
diagnosis; it identifies people who are likely to benefit from primary
prevention.

## Scope and intended users

- **Setting:** UK primary care — general practice, community pharmacy, NHS Health
  Check, and practice-nurse clinics running structured CVD risk assessment.
- **Users:** general practitioners, practice and community nurses, clinical
  pharmacists, and other clinicians undertaking primary-prevention risk review.
- **Patients:** adults aged **25–84** without established cardiovascular disease,
  assessed for **primary** prevention.
- **Not for:** people with existing CVD (previous MI, angina, stroke, or TIA),
  people with familial hypercholesterolaemia (FH — assess separately), patients
  outside the 25–84 age range, or use as a substitute for clinical judgement.
  QRISK3 estimates risk; it does not prescribe.

## Scoring system

**Primary instrument:** QRISK3 — a sex-specific **Cox proportional-hazards
survival model**. Each input is transformed (continuous variables via fractional
polynomials, some centred on the cohort mean) and multiplied by a fitted
regression coefficient; the weighted contributions are summed into a linear
predictor, combined with age interaction terms, and mapped through the model's
baseline survival function to a **10-year risk percentage**. It is a **weighted
risk engine**, not a simple additive point score — no input is worth a fixed
number of "points".

**Inputs.**

| Group | Inputs |
| --- | --- |
| Demographics | age (25–84), sex, ethnicity (nine-category), Townsend deprivation score (derived from postcode; optional) |
| Lifestyle | smoking status (non / ex / light / moderate / heavy), body-mass index (BMI) |
| Cardiometabolic | diabetes status (none / type 1 / type 2), total-cholesterol : HDL ratio, systolic blood pressure, systolic blood-pressure standard deviation (SBP SD, its visit-to-visit variability), on blood-pressure treatment |
| History | family history of coronary heart disease in a first-degree relative under 60, atrial fibrillation, chronic kidney disease (stage 3, 4, or 5), migraine, rheumatoid arthritis, systemic lupus erythematosus (SLE), severe mental illness, erectile dysfunction (men) |
| Medication | on atypical antipsychotics, on regular corticosteroids |

**Interpretation.**

| 10-year risk | Risk band | Recommended action |
| --- | --- | --- |
| < 10 % | Low / not raised | Reinforce lifestyle measures; reassess per local policy (typically every 5 years). A low score does not exclude future risk. |
| ≥ 10 % | Raised | Meets the NICE threshold: offer a statin (**atorvastatin 20 mg**) for primary prevention after informed discussion, plus structured lifestyle advice (smoking, diet, activity, alcohol, weight). |
| ≥ 20 % | High | Raised band; prioritise statin and intensive lifestyle optimisation, and consider review of modifiable factors and adherence. |

The decision threshold is **10-year QRISK3 ≥ 10 %** (NICE NG238 / CG181). The
model also reports a **heart age** — the age of a person of the same sex with the
same estimated risk but otherwise optimal risk factors — as a communication aid.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
routinely collected primary-care data.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting |
| 2 | Patient identification | patient identifier, age, sex, ethnicity, postcode / Townsend deprivation score (optional) |
| 3 | Eligibility | confirm no established CVD, no familial hypercholesterolaemia, age within 25–84 |
| 4 | Lifestyle | smoking status, body-mass index (or height and weight) |
| 5 | Cardiometabolic measurements | total-cholesterol : HDL ratio, systolic blood pressure, systolic BP standard deviation, on blood-pressure treatment |
| 6 | Comorbidities | diabetes status, family history of CHD, atrial fibrillation, chronic kidney disease stage, migraine, rheumatoid arthritis, SLE, severe mental illness, erectile dysfunction |
| 7 | Medication | atypical antipsychotics, regular corticosteroids |
| 8 | Summary and result | computed 10-year CVD risk %, risk band, heart age, flagged issues, statin/lifestyle recommendation, free-text clinical note |

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
  decision-support risk calculator; the output informs a prescribing discussion
  rather than determining treatment automatically.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Hippisley-Cox J., Coupland C., Brindle P. Development and validation of QRISK3
  risk prediction algorithms to estimate future risk of cardiovascular disease.
  *BMJ* 2017; 357:j2099.
- NICE NG238. *Cardiovascular disease: risk assessment and reduction, including
  lipid modification* (2023, updating CG181).
- NICE CG181. *Cardiovascular disease: risk assessment and reduction* (2014,
  updated 2016).
- ClinRisk Ltd. *QRISK3-2017* open-source reference implementation.

## Verify

```sh
bin/test-form qrisk3-cardiovascular-disease-risk-score
```
