# Sequential Organ Failure Assessment (SOFA)

A UK NHS–aligned, clinician-driven **Sequential Organ Failure Assessment
(SOFA)** score that records **objective physiological and laboratory findings**
for six organ systems and computes an organ-dysfunction score for each system
(0–4), a **total SOFA score** (0–24), the change from a prior assessment
(**delta-SOFA**), a mortality-risk band, and a set of safety-critical flags. The
output is a signed clinician report suitable for the intensive-care record and
for sepsis screening under the Sepsis-3 definition.

The SOFA score was developed by the Working Group on Sepsis-Related Problems of
the European Society of Intensive Care Medicine (Vincent *et al.*, *Intensive
Care Medicine* 1996) to describe and quantify the degree of organ dysfunction
over time in critically ill patients. It is completed by an intensivist, ICU
resident, critical-care nurse, or acute-care physician rather than by the
patient. Under the Third International Consensus Definitions for Sepsis and
Septic Shock (Sepsis-3, Singer *et al.*, *JAMA* 2016), an acute rise in the
total SOFA score of **≥ 2 points** in a patient with suspected infection is used
to identify sepsis.

## Scope and intended users

- **Setting:** intensive care unit (ICU), high-dependency unit (HDU), critical
  care outreach, acute medical unit, or emergency department resuscitation area.
- **Users:** intensivists, critical-care and acute-medicine physicians, ICU
  residents, critical-care nurses, and outreach practitioners.
- **Patients:** critically ill adults (≥ 16 years) with actual or suspected
  organ dysfunction, sepsis, or septic shock. A paediatric variant (pSOFA)
  exists but is out of scope for this form.

## Scoring system

- **Primary instrument:** SOFA score — six organ-system sub-scores of 0–4 each,
  summed to a total of **0–24**. A higher score indicates more severe organ
  dysfunction and higher predicted mortality.
- **Secondary derivation:** **delta-SOFA** — the change in total score from a
  recorded baseline or previous assessment. A rising SOFA score over the first
  48 hours of ICU admission predicts a mortality of at least 50 % regardless of
  the initial score.
- **Sepsis-3 flag:** an acute increase in total SOFA of **≥ 2 points** from
  baseline, in a patient with suspected infection, meets the Sepsis-3
  operational criterion for sepsis. In patients with no known pre-existing
  organ dysfunction the baseline SOFA is assumed to be 0.

Each organ system is scored on objective criteria as follows. Where two units
are given, either may be entered; SI units (kPa, µmol/L) are preferred in the UK.

### 1. Respiration — PaO₂/FiO₂ ratio

| Score | PaO₂/FiO₂, mmHg | PaO₂/FiO₂, kPa | Condition |
| --- | --- | --- | --- |
| 0 | ≥ 400 | ≥ 53.3 | — |
| 1 | < 400 | < 53.3 | — |
| 2 | < 300 | < 40.0 | — |
| 3 | < 200 | < 26.7 | with respiratory support |
| 4 | < 100 | < 13.3 | with respiratory support |

Respiratory support means mechanical ventilation or CPAP; scores of 3 and 4
require the patient to be receiving respiratory support.

### 2. Coagulation — Platelets

| Score | Platelets, ×10³/µL (= ×10⁹/L) |
| --- | --- |
| 0 | ≥ 150 |
| 1 | < 150 |
| 2 | < 100 |
| 3 | < 50 |
| 4 | < 20 |

### 3. Liver — Bilirubin

| Score | Bilirubin, mg/dL | Bilirubin, µmol/L |
| --- | --- | --- |
| 0 | < 1.2 | < 20 |
| 1 | 1.2–1.9 | 20–32 |
| 2 | 2.0–5.9 | 33–101 |
| 3 | 6.0–11.9 | 102–204 |
| 4 | ≥ 12.0 | > 204 |

### 4. Cardiovascular — MAP / vasopressors

Vasopressor doses are in µg/kg/min administered for at least one hour.

| Score | Criterion |
| --- | --- |
| 0 | MAP ≥ 70 mmHg |
| 1 | MAP < 70 mmHg |
| 2 | Dopamine ≤ 5, or dobutamine (any dose) |
| 3 | Dopamine > 5, or adrenaline (epinephrine) ≤ 0.1, or noradrenaline (norepinephrine) ≤ 0.1 |
| 4 | Dopamine > 15, or adrenaline (epinephrine) > 0.1, or noradrenaline (norepinephrine) > 0.1 |

MAP = mean arterial pressure. The highest applicable band across the MAP and
vasopressor criteria sets the cardiovascular sub-score.

### 5. Central nervous system — Glasgow Coma Scale

| Score | Glasgow Coma Scale (GCS) |
| --- | --- |
| 0 | 15 |
| 1 | 13–14 |
| 2 | 10–12 |
| 3 | 6–9 |
| 4 | < 6 |

Where the patient is sedated, the GCS prior to sedation (or the best available
estimate) should be used.

### 6. Renal — Creatinine / urine output

| Score | Creatinine, mg/dL | Creatinine, µmol/L | Urine output |
| --- | --- | --- | --- |
| 0 | < 1.2 | < 110 | — |
| 1 | 1.2–1.9 | 110–170 | — |
| 2 | 2.0–3.4 | 171–299 | — |
| 3 | 3.5–4.9 | 300–440 | < 500 mL/day |
| 4 | ≥ 5.0 | > 440 | < 200 mL/day |

The higher band of the creatinine and urine-output criteria sets the renal
sub-score.

### Total score and mortality bands

The six sub-scores are summed to a **total of 0–24**. Higher totals correspond
to higher observed ICU mortality (indicative bands from Vincent *et al.* 1998
and Ferreira *et al.* 2001):

| Total SOFA | Indicative mortality band |
| --- | --- |
| 0–6 | Low (< 10 %) |
| 7–9 | Moderate (~15–20 %) |
| 10–12 | High (~40–50 %) |
| 13–14 | Very high (~50–60 %) |
| 15–24 | Extreme (> 80 %) |

These bands are indicative only; observed mortality varies with case-mix,
timing, and whether the initial, maximum, or mean score is used. Rising and
maximum scores are more strongly associated with mortality than the admission
score alone.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step collects
**objective clinician-observed findings** — physiology and laboratory values,
not patient self-report.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Clinician & context | assessor name, role, registration number, date and time, ICU/HDU location, hours since admission |
| 2 | Patient & baseline | patient identifier, age, admission diagnosis, suspected infection (yes/no/unknown), baseline (prior) total SOFA for delta calculation |
| 3 | Respiration | PaO₂, FiO₂ (or PaO₂/FiO₂ ratio), respiratory-support flag (ventilated / CPAP / none) |
| 4 | Coagulation | platelet count |
| 5 | Liver | bilirubin |
| 6 | Cardiovascular | MAP, vasopressor agent + dose (dopamine, dobutamine, adrenaline, noradrenaline) |
| 7 | Central nervous system | Glasgow Coma Scale, sedation flag |
| 8 | Renal | creatinine, 24-hour urine output |
| 9 | Summary & sign-off | computed per-system sub-scores, total 0–24, delta-SOFA vs baseline, mortality band, Sepsis-3 flag, safety flags, clinician notes, electronic signature |

## Conventions

- Empty string `''` for unanswered text and enum fields.
- `null` for unanswered numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde;
  snake_case in SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Clinical references

- Vincent J.-L. *et al.* The SOFA (Sepsis-related Organ Failure Assessment)
  score to describe organ dysfunction/failure. *Intensive Care Medicine* 1996;
  22:707–10.
- Vincent J.-L. *et al.* Use of the SOFA score to assess the incidence of organ
  dysfunction/failure in intensive care units. *Critical Care Medicine* 1998;
  26:1793–800.
- Ferreira F.L. *et al.* Serial evaluation of the SOFA score to predict outcome
  in critically ill patients. *JAMA* 2001; 286:1754–8.
- Singer M. *et al.* The Third International Consensus Definitions for Sepsis and
  Septic Shock (Sepsis-3). *JAMA* 2016; 315:801–10.

## Compliance

- MDCG 2019-11 Rev.1 (EU MDR Software Classification) — clinical decision
  support; Class IIa where output informs escalation or sepsis screening.
- UK Medical Devices Regulations 2002.
- ISO/IEC/IEEE 26514:2022.
- UK MHRA *Software and AI as a Medical Device*.

## Verify

```sh
bin/test-form sequential-organ-failure-assessment
```
