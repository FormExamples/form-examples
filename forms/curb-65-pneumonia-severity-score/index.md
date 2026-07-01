# CURB-65 Pneumonia Severity Score

A clinician-facing severity assessment for adults with community-acquired
pneumonia (CAP). The form records the five **CURB-65** criteria, computes a
**0–5 severity score** (one point per criterion), assigns a **mortality-risk
band**, and generates a signed report with a recommended disposition (home /
outpatient, short-stay / supervised, or hospital admission with possible
intensive-care review).

CURB-65 is a validated clinical prediction rule derived by Lim *et al.* (2003)
and endorsed by the British Thoracic Society (BTS) for stratifying CAP mortality
risk and guiding the site-of-care decision. It complements — but does not
replace — clinical judgement, and is intended to be used alongside an assessment
of oxygenation, comorbidity, and social circumstances.

## Scope and intended users

- **Setting:** emergency department, acute medical unit, general practice,
  out-of-hours and urgent-care services, ambulatory / same-day emergency care.
- **Users:** emergency physicians, acute and general physicians, GPs, advanced
  nurse practitioners, paramedics, and other clinicians assessing an adult with
  suspected or confirmed CAP.
- **Patients:** adults (≥ 16 years) with a clinical or radiological diagnosis of
  community-acquired pneumonia. The rule is **not** validated for children, for
  hospital-acquired or ventilator-associated pneumonia, or for immunosuppressed
  patients, in whom it may underestimate risk.

A primary-care variant, **CRB-65**, omits the urea criterion (which requires a
blood test) and scores 0–4; it is described in *Scoring system* below for
settings without immediate access to laboratory results.

## Scoring system

**Primary instrument:** CURB-65 — five criteria, one point each, total 0–5.

| Letter | Criterion | Threshold (positive = 1 point) |
| --- | --- | --- |
| **C** | Confusion | New-onset mental confusion (Abbreviated Mental Test score ≤ 8, or new disorientation in person, place, or time) |
| **U** | Urea | Serum urea > 7 mmol/L (blood urea nitrogen > 19 mg/dL) |
| **R** | Respiratory rate | ≥ 30 breaths per minute |
| **B** | Blood pressure | Systolic < 90 mmHg **or** diastolic ≤ 60 mmHg |
| **65** | Age | ≥ 65 years |

Each positive criterion scores 1; the total is the sum (0–5).

### Risk bands and disposition

| Score | Severity | 30-day mortality (approx.) | Recommended disposition |
| --- | --- | --- | --- |
| 0–1 | Low | ~0.7–3% | Consider treatment at home / outpatient management |
| 2 | Intermediate | ~9% | Consider short-stay inpatient care or hospital-supervised outpatient treatment |
| 3–5 | High | ~14–40% | Hospitalise and manage as severe CAP; for scores **4–5**, assess for intensive-care / HDU admission |

Mortality figures are the pooled derivation/validation estimates from Lim *et al.*
(2003) and are indicative only; local outcomes vary. The score informs, but does
not override, the clinical decision on site of care.

### CRB-65 (primary-care variant)

Where serum urea is not immediately available, **CRB-65** uses the four clinical
criteria (Confusion, Respiratory rate, Blood pressure, age ≥ 65), scoring 0–4:

| Score | Risk | Suggested action |
| --- | --- | --- |
| 0 | Low (~ < 1% mortality) | Manage at home where appropriate |
| 1–2 | Intermediate (~ 5–12%) | Consider hospital assessment / referral |
| 3–4 | High (~ > 10%) | Urgent hospital admission |

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Clinician & encounter | clinician name, role, registration number, assessment date and time, care setting, CAP diagnosis basis (clinical / radiological) |
| 2 | Patient identification | identifier, name, date of birth (age auto-derived), sex |
| 3 | Confusion (C) | new-onset confusion present (yes/no), AMT score if measured, basis (disorientation in person / place / time) |
| 4 | Urea (U) | serum urea (mmol/L) or BUN (mg/dL); "not measured" flag for CRB-65 pathway |
| 5 | Respiratory rate (R) | respiratory rate (breaths/min) |
| 6 | Blood pressure (B) | systolic and diastolic blood pressure (mmHg) |
| 7 | Age (65) | age in years (derived from date of birth; confirm) |
| 8 | Adjuncts (advisory) | oxygen saturation, temperature, significant comorbidity, bilateral / multilobar changes on imaging — recorded for context, not scored |
| 9 | Score & disposition | computed CURB-65 (and CRB-65 where urea absent) score, risk band, fired flags, recommended disposition, clinician override + reason, notes, electronic signature |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- Age is derived from date of birth at assessment time; the derived value is the
  scored input.
- Both the **computed** score and any clinician-adjusted **final** disposition
  are stored and rendered.
- UUIDv4 primary keys; `created_at`, `updated_at`, `deleted_at` on every table.
- Import and export via JSON, XML, CSV, and TSV; FHIR R5 Bundle for exchange.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR/IVDR Software Classification) — clinical decision
  support; Class IIa where the output drives the site-of-care decision.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022 — design and development of information for users.
- UK MHRA *Software and AI as a Medical Device*.

## Clinical references

- Lim W.S. *et al.* Defining community acquired pneumonia severity on
  presentation to hospital: an international derivation and validation study.
  *Thorax* 2003; 58:377–382.
- British Thoracic Society. *Guidelines for the management of community acquired
  pneumonia in adults* (2009 update; annotated 2015).
- NICE NG138. *Pneumonia (community-acquired): antimicrobial prescribing* (2019).

## Verify

```sh
bin/test-form curb-65-pneumonia-severity-score
```
