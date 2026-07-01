# Wells Score for Pulmonary Embolism

A clinical prediction rule that estimates the pre-test probability of acute
pulmonary embolism (PE) in adults presenting with suspected PE. It records seven
weighted criteria, sums a total of **0–12.5**, and stratifies the patient into a
probability band that selects the next diagnostic step — a **D-dimer** test when
PE is unlikely, or a **CT pulmonary angiogram (CTPA)** when PE is likely.

The rule was derived and validated by Wells *et al.* (*Thromb Haemost* 2000;
*Ann Intern Med* 2001) and is embedded in the NICE two-level pathway
(NG158, *Venous thromboembolic diseases*). It is a risk-stratification aid to
rationalise imaging and D-dimer testing; it is not a diagnosis of PE and does
not override clinical judgement or the management of a haemodynamically unstable
patient.

## Scope and intended users

- **Setting:** emergency departments, acute and ambulatory medical units, and
  any setting where an adult presents with suspected acute PE (pleuritic chest
  pain, breathlessness, haemoptysis, or unexplained tachycardia / hypoxia).
- **Users:** doctors, advanced nurse practitioners, physician associates, and
  other clinicians assessing suspected PE.
- **Patients:** adults (≥ 16 years) with a clinical suspicion of PE.
- **Not for:** definitive diagnosis of PE, paediatric or pregnant patients (use
  a pregnancy-specific pathway), a substitute for clinical judgement, or a
  haemodynamically unstable patient — massive PE with shock requires immediate
  resuscitation and imaging or empirical treatment, not scoring.

## Scoring system

**Primary instrument:** the seven-item Wells criteria. Each present criterion
contributes its weighted points; absent criteria contribute 0.

| # | Criterion | Points when present |
| --- | --- | --- |
| 1 | Clinical signs and symptoms of DVT (leg swelling and pain on palpation of the deep veins) | +3 |
| 2 | PE is the number-one diagnosis, or equally likely | +3 |
| 3 | Heart rate > 100 beats per minute | +1.5 |
| 4 | Immobilisation ≥ 3 days, or surgery in the previous 4 weeks | +1.5 |
| 5 | Previous objectively diagnosed DVT or PE | +1.5 |
| 6 | Haemoptysis | +1 |
| 7 | Malignancy (on treatment, treated within the last 6 months, or palliative) | +1 |

Total score ranges from **0 to 12.5**.

### Two-level interpretation (NICE, default)

| Total score | Probability band | Recommended pathway |
| --- | --- | --- |
| ≤ 4 | PE **unlikely** | Arrange a **D-dimer** test. If positive, arrange CTPA; if negative, consider an alternative diagnosis and (where appropriate) apply the PERC rule to support ruling PE out without D-dimer. |
| > 4 | PE **likely** | Arrange an immediate **CTPA** (interim anticoagulation if imaging is delayed). If CTPA is negative, consider proximal-leg vein ultrasound. |

The positive threshold for the "PE likely" pathway is **> 4 points**.

### Three-level interpretation (original, informational)

| Total score | Probability band |
| --- | --- |
| < 2 | Low |
| 2–6 | Moderate |
| > 6 | High |

The two-level scheme is the operational pathway; the three-level bands are
retained for reference and audit.

### Pairing with PERC

For patients scored **PE unlikely** with a low gestalt probability, the
Pulmonary Embolism Rule-out Criteria (PERC) may support excluding PE without
D-dimer testing when all eight PERC items are negative. PERC is an adjunct to,
not a replacement for, the Wells stratification.

## Assessment steps

Completed in order on a single continuous single-page wizard.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Haemodynamic status | haemodynamically stable or unstable (unstable → bypass scoring, resuscitate and image immediately) |
| 4 | Clinical criteria | DVT signs, PE most likely, previous DVT/PE, immobilisation or recent surgery, haemoptysis, malignancy |
| 5 | Observations | measured heart rate (beats/min) → criterion 3 |
| 6 | Summary and score | computed Wells total, two-level band, three-level band, recommended pathway, fired criteria, flagged issues, free-text clinical note |

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
  decision-support risk-stratification tool; the output selects the next
  diagnostic step rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Wells P.S. *et al.* Derivation of a simple clinical model to categorize
  patients probability of pulmonary embolism. *Thromb Haemost* 2000;
  83(3):416–420.
- Wells P.S. *et al.* Excluding pulmonary embolism at the bedside without
  diagnostic imaging. *Ann Intern Med* 2001; 135(2):98–107.
- NICE NG158. *Venous thromboembolic diseases: diagnosis, management and
  thrombophilia testing* (2020, updated 2023).
- Kline J.A. *et al.* Clinical criteria to prevent unnecessary diagnostic
  testing in emergency department patients with suspected pulmonary embolism
  (PERC). *J Thromb Haemost* 2004; 2(8):1247–1255.

## Verify

```sh
bin/test-form wells-score-for-pulmonary-embolism
```
