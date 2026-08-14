# CHA2DS2-VASc Score for Atrial Fibrillation Stroke Risk

A clinical prediction tool that estimates the annual risk of ischaemic stroke and
systemic thromboembolism in adults with **non-valvular atrial fibrillation** (AF),
and guides the decision to start oral anticoagulation. It records eight weighted
risk factors — **C**ongestive heart failure, **H**ypertension, **A**ge ≥ 75,
**D**iabetes, prior **S**troke/TIA/thromboembolism, **V**ascular disease,
**A**ge 65–74, and **S**ex **c**ategory (female) — sums a total of **0–9**, and
maps the total to a risk band with anticoagulation guidance and an estimated
annual stroke rate.

CHA2DS2-VASc refines the earlier CHADS2 score by adding vascular disease, an
age 65–74 band, and female sex category, and by doubling the weight of age ≥ 75.
It was derived and validated by Lip *et al.* (*Chest* 2010) and is recommended by
ESC, NICE, and AHA/ACC/HRS guidelines to identify patients with AF who are
**genuinely low risk** (and so do not need anticoagulation) and those who
benefit from it. A high CHA2DS2-VASc score is a prompt to consider oral
anticoagulation, weighed against bleeding risk (see **HAS-BLED**), not a mandate
to treat in isolation.

## Scope and intended users

- **Setting:** primary care, general and acute medicine, cardiology and
  arrhythmia clinics, anticoagulation services, emergency department — any
  setting where a patient with atrial fibrillation is assessed for stroke
  prevention.
- **Users:** general practitioners, cardiologists, physicians, specialist nurses,
  pharmacists, and other clinicians managing AF.
- **Patients:** adults (≥ 18 years) with non-valvular atrial fibrillation or
  atrial flutter.
- **Not for:** patients with moderate-to-severe mitral stenosis or a mechanical
  heart valve (these are anticoagulated regardless of score), for estimating
  **bleeding** risk (use **HAS-BLED**), or as a substitute for clinical
  judgement and shared decision-making. The score informs, but does not replace,
  the anticoagulation decision.

## Scoring system

**Primary instrument:** CHA2DS2-VASc — eight weighted criteria. Each present
criterion contributes its points; absent criteria contribute 0. Age is a single
mutually-exclusive choice (≥ 75 → 2, 65–74 → 1, < 65 → 0). Total score 0–9.

| # | Criterion | Scores when present | Points |
| --- | --- | --- | --- |
| C | Congestive heart failure / LV dysfunction | Signs, symptoms, or objective LV systolic dysfunction | 1 |
| H | Hypertension | History of hypertension or on treatment; resting BP > 140/90 on ≥ 2 occasions | 1 |
| A₂ | Age ≥ 75 years | Age 75 or older | 2 |
| D | Diabetes mellitus | Fasting glucose > 125 mg/dL (7 mmol/L) or on hypoglycaemic treatment | 1 |
| S₂ | Prior stroke / TIA / thromboembolism | History of stroke, transient ischaemic attack, or systemic embolism | 2 |
| V | Vascular disease | Prior MI, peripheral artery disease, or aortic plaque | 1 |
| A | Age 65–74 years | Age 65 to 74 inclusive | 1 |
| Sc | Sex category (female) | Female sex | 1 |

Maximum total is **9** (a female patient aged ≥ 75 scores at most 2 for age, not
2 + 1). Female sex is a **risk modifier**, not an independent risk factor: a
woman with no other risk factors (score 1 from sex alone) is managed as low risk.

**Interpretation.**

| Total score | Risk band | Estimated annual stroke rate | Recommended action |
| --- | --- | --- | --- |
| 0 (male) or 1 (female, sex point only) | Low | ~0.2–1.3 % | No antithrombotic therapy recommended. |
| 1 (male) | Intermediate | ~1.3 % | Consider oral anticoagulation; individualize on net clinical benefit and patient preference. |
| ≥ 2 (male) or ≥ 3 (female) | High | ~2.2 % and rising | Oral anticoagulation recommended (DOAC preferred, or warfarin with good time-in-therapeutic-range), unless contraindicated. |

**Estimated annual adjusted stroke rate by total score** (Lip *et al.*, *Chest*
2010, adjusted rates per year of follow-up; use as a guide, not a guarantee):

| Score | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Stroke %/yr | 0.2 | 1.3 | 2.2 | 3.2 | 4.0 | 6.7 | 9.8 | 9.6 | 6.7 | 15.2 |

The decision to anticoagulate always weighs stroke risk against bleeding risk:
pair CHA2DS2-VASc with **HAS-BLED**. A high HAS-BLED score flags modifiable
bleeding risks to correct — it does not by itself withhold anticoagulation.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
an **objective clinical criterion** or context.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, AF type (paroxysmal / persistent / permanent) |
| 2 | Patient identification | patient identifier, age (years), sex |
| 3 | Cardiac history | congestive heart failure / LV dysfunction, hypertension, vascular disease → criteria C, H, V |
| 4 | Metabolic and thromboembolic history | diabetes mellitus, prior stroke / TIA / thromboembolism → criteria D, S₂ |
| 5 | Age band | derived from age: ≥ 75 (2), 65–74 (1), < 65 (0) → criteria A₂ / A |
| 6 | Summary and score | computed CHA2DS2-VASc total, risk band, estimated annual stroke rate, fired criteria, flagged issues, anticoagulation recommendation, HAS-BLED cross-reference, free-text clinical note |

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
  decision-support tool; the output informs the anticoagulation decision rather
  than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Lip G.Y.H. *et al.* Refining Clinical Risk Stratification for Predicting Stroke
  and Thromboembolism in Atrial Fibrillation Using a Novel Risk Factor-Based
  Approach: the Euro Heart Survey on Atrial Fibrillation. *Chest* 2010;
  137(2):263–272.
- Hindricks G. *et al.* 2020 ESC Guidelines for the diagnosis and management of
  atrial fibrillation. *Eur Heart J* 2021; 42(5):373–498.
- NICE NG196. *Atrial fibrillation: diagnosis and management* (2021).
- January C.T. *et al.* 2019 AHA/ACC/HRS Focused Update on the Management of
  Atrial Fibrillation. *Circulation* 2019; 140(2):e125–e151.

## Verify

```sh
bin/test-form cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk
```
