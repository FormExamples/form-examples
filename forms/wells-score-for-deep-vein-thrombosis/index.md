# Wells Score for Deep Vein Thrombosis (DVT)

A bedside clinical prediction rule that estimates the pre-test probability of a
first lower-limb **deep vein thrombosis (DVT)** in adults with a suspicious leg.
It records nine clinical criteria — each scoring **+1** when present — subtracts
**2** when an alternative diagnosis is judged at least as likely as DVT, sums a
total of **−2 to 9**, and stratifies the patient so the right first
investigation is chosen: a **proximal leg vein ultrasound** when DVT is *likely*
or a **D-dimer** when DVT is *unlikely*. The score does not diagnose or exclude
DVT on its own; it directs the diagnostic pathway.

The rule was derived and validated by Wells and colleagues (*Lancet* 1997;
*NEJM* 2003) and is the pre-test probability tool recommended by NICE
(NG158, *Venous thromboembolic diseases*). This form implements the modern
**two-level** interpretation (DVT likely vs DVT unlikely) and also records the
original **three-level** band (low / moderate / high) for continuity with older
guidance.

## Scope and intended users

- **Setting:** emergency department, ambulatory / same-day emergency care, acute
  medical units, and DVT / anticoagulation clinics — any setting assessing a
  patient with a painful, swollen, or discoloured leg.
- **Users:** doctors, nurse practitioners, physician associates, and other
  clinicians performing the initial assessment of suspected DVT.
- **Patients:** adults (≥ 18 years) with clinically suspected lower-limb DVT.
- **Not for:** suspected pulmonary embolism (use the Wells score for PE),
  upper-limb DVT, pregnancy or the postpartum period (Wells is not validated;
  follow a pregnancy-specific pathway), recurrent ipsilateral DVT where a prior
  clot confounds the criteria, or as a substitute for clinical judgement. A
  low score does not by itself exclude DVT.

## Scoring system

**Primary instrument:** the Wells DVT clinical prediction rule — nine criteria
each scoring **+1** when present, plus a **−2** adjustment when an alternative
diagnosis is at least as likely as DVT. Total score ranges **−2 to 9**.

| # | Criterion | Points |
| --- | --- | --- |
| 1 | Active cancer (treatment ongoing, within the previous 6 months, or palliative) | +1 |
| 2 | Paralysis, paresis, or recent plaster immobilisation of the lower extremities | +1 |
| 3 | Recently bedridden ≥ 3 days, or major surgery within the previous 12 weeks requiring general or regional anaesthesia | +1 |
| 4 | Localised tenderness along the distribution of the deep venous system | +1 |
| 5 | Entire leg swollen | +1 |
| 6 | Calf swelling ≥ 3 cm larger than the asymptomatic side (measured 10 cm below the tibial tuberosity) | +1 |
| 7 | Pitting oedema confined to the symptomatic leg | +1 |
| 8 | Collateral superficial veins (non-varicose) | +1 |
| 9 | Previously documented DVT | +1 |
| — | An alternative diagnosis is at least as likely as DVT | **−2** |

**Two-level interpretation (NICE NG158 — primary).**

| Total score | Band | Recommended action |
| --- | --- | --- |
| ≥ 2 | **DVT likely** | Offer a **proximal leg vein ultrasound**, ideally within 4 hours. If the scan cannot be done within 4 hours, offer a D-dimer test and interim anticoagulation, then a scan within 24 hours. |
| ≤ 1 | **DVT unlikely** | Offer a **D-dimer** test with a result available within 4 hours (or interim anticoagulation if not). A negative D-dimer effectively excludes DVT; a positive D-dimer triggers a proximal leg vein ultrasound. |

**Three-level interpretation (original Wells — recorded for continuity).**

| Total score | Probability |
| --- | --- |
| < 1 (i.e. ≤ 0) | Low |
| 1–2 | Moderate |
| ≥ 3 | High |

The threshold for the primary pathway is **Wells ≥ 2 → DVT likely**. The score
supports, but does not replace, D-dimer testing and imaging.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
one or more clinical criteria as present or absent.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting |
| 2 | Patient identification | patient identifier, age band, sex, symptomatic leg (left / right) |
| 3 | Predisposing factors | active cancer; paralysis/paresis or plaster immobilisation; recently bedridden ≥ 3 days or major surgery ≤ 12 weeks; previously documented DVT (criteria 1, 2, 3, 9) |
| 4 | Leg examination | localised deep-vein tenderness; entire leg swollen; calf swelling ≥ 3 cm; pitting oedema confined to symptomatic leg; collateral superficial veins (criteria 4–8) |
| 5 | Alternative diagnosis | whether an alternative diagnosis is at least as likely as DVT (−2 adjustment) |
| 6 | Summary and score | computed Wells total, two-level band, three-level band, fired criteria, flagged issues, recommended investigation, free-text clinical note |

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
  decision-support tool; the output selects the next diagnostic step rather than
  determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Wells P.S. *et al.* Value of assessment of pretest probability of deep-vein
  thrombosis in clinical management. *Lancet* 1997; 350(9094):1795–1798.
- Wells P.S. *et al.* Evaluation of D-dimer in the diagnosis of suspected
  deep-vein thrombosis. *NEJM* 2003; 349(13):1227–1235.
- NICE NG158. *Venous thromboembolic diseases: diagnosis, management and
  thrombophilia testing* (2020, updated 2023).

## Verify

```sh
bin/test-form wells-score-for-deep-vein-thrombosis
```
