# Pulmonary Embolism Rule-out Criteria (PERC)

A bedside rule-out screen for adults in whom a clinician already judges the
pre-test probability of pulmonary embolism (PE) to be **low**. It records eight
objective criteria — age, heart rate, oxygen saturation, unilateral leg
swelling, haemoptysis, recent surgery or trauma, prior venous thromboembolism,
and exogenous oestrogen use — and asks whether the clinician's gestalt pre-test
probability is low. When **all eight criteria are satisfied** *and* the pre-test
probability is **low**, the patient is **PERC-negative**: PE can be excluded
without a D-dimer or imaging. If any criterion fails, or the pre-test probability
is not low, the patient is **PERC-positive** and further workup (D-dimer and/or
imaging) is warranted.

PERC is a rule-out gestalt tool, not a graded severity score. Its output is a
**binary classification** (PERC-negative / PERC-positive), not a number. It was
derived and validated by Kline *et al.* (*J Thromb Haemost* 2004; validation
2008) to safely reduce unnecessary D-dimer testing and imaging in low-risk
emergency-department patients, where a false-positive D-dimer commonly triggers
avoidable CT pulmonary angiography, radiation, contrast exposure, and cost.

## Scope and intended users

- **Setting:** emergency department and acute ambulatory care — any setting where
  a clinician is considering PE but has already judged the pre-test probability
  to be low.
- **Users:** emergency physicians, acute-care physicians, advanced practitioners,
  and triage clinicians competent to form a gestalt pre-test probability of PE.
- **Patients:** adults presenting with symptoms that could suggest PE (for
  example pleuritic chest pain, dyspnoea) in whom clinical suspicion is **low**.
- **Not for:** patients with moderate or high pre-test probability of PE (PERC
  does not apply — proceed to D-dimer / imaging regardless), pregnant patients,
  patients on anticoagulation, or as a substitute for clinical judgement. A
  PERC-positive result is not a diagnosis of PE; it only means PE cannot be ruled
  out by PERC alone.

## Scoring system

**Primary instrument:** PERC — eight criteria, each either **satisfied** (the
low-risk / reassuring state) or **failed**. PERC is applied **only** when the
clinician's gestalt pre-test probability of PE is already low.

| # | Criterion | Satisfied when | Fails when |
| --- | --- | --- | --- |
| 1 | Age | Age < 50 years | Age ≥ 50 years |
| 2 | Heart rate | Heart rate < 100 beats/min | Heart rate ≥ 100 beats/min |
| 3 | Oxygen saturation | SpO₂ ≥ 95% on room air | SpO₂ < 95% |
| 4 | Unilateral leg swelling | No unilateral leg swelling | Unilateral leg swelling present |
| 5 | Haemoptysis | No haemoptysis | Haemoptysis present |
| 6 | Recent surgery or trauma | No surgery or trauma requiring general anaesthesia in the past 4 weeks | Surgery or trauma requiring general anaesthesia within 4 weeks |
| 7 | Prior venous thromboembolism | No prior DVT or PE | Prior DVT or PE |
| 8 | Exogenous oestrogen | No oestrogen use (oral contraceptive, HRT) | Current oestrogen use |

**Interpretation.**

| Result | Condition | Recommended action |
| --- | --- | --- |
| **PERC-negative** | Pre-test probability **low** *and* **all eight** criteria satisfied | PE is excluded on clinical grounds. No D-dimer or imaging is required for PE on the basis of this presentation. Document and discharge / continue as clinically appropriate. |
| **PERC-positive** | Pre-test probability not low, **or** any criterion fails | PERC does not exclude PE. Proceed to the next step in the diagnostic pathway: D-dimer, and imaging (CT pulmonary angiography or V/Q) as indicated by local policy and further risk stratification. |

The rule is deliberately conservative: a single failed criterion, or a pre-test
probability that is not low, makes the patient PERC-positive. PERC is **not** a
count or a sum — one failure is sufficient to require workup.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
an **objective bedside finding** or a documented clinical judgement.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, presenting complaint |
| 2 | Patient identification | patient identifier, age, sex |
| 3 | Pre-test probability | clinician gestalt pre-test probability of PE (low / not-low); applicability gate for PERC |
| 4 | Vital signs | heart rate (beats/min), oxygen saturation (SpO₂ %) → criteria 2, 3 |
| 5 | Clinical criteria | unilateral leg swelling, haemoptysis, recent surgery or trauma, prior DVT/PE, oestrogen use → criteria 4–8 (criterion 1 derives from age) |
| 6 | Summary and result | computed PERC classification, satisfied / failed criteria, applicability note, red-flag issues, recommended action, free-text clinical note |

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
  decision-support rule-out tool; the output guides whether further testing is
  needed rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Kline J.A. *et al.* Clinical criteria to prevent unnecessary diagnostic testing
  in emergency department patients with suspected pulmonary embolism.
  *J Thromb Haemost* 2004; 2(8):1247–1255.
- Kline J.A. *et al.* Prospective multicenter evaluation of the pulmonary
  embolism rule-out criteria. *J Thromb Haemost* 2008; 6(5):772–780.
- Freund Y. *et al.* Effect of the Pulmonary Embolism Rule-Out Criteria on
  subsequent thromboembolic events among low-risk emergency department patients
  (PROPER trial). *JAMA* 2018; 319(6):559–566.
- NICE NG158. *Venous thromboembolic diseases: diagnosis, management and
  thrombophilia testing* (2020, updated 2023).

## Verify

```sh
bin/test-form pulmonary-embolism-rule-out-criteria
```
