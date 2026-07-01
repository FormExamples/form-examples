# TIMI Risk Score for Acute Coronary Syndrome (UA/NSTEMI)

A bedside risk-stratification tool for adults presenting with unstable angina
(UA) or non-ST-elevation myocardial infarction (NSTEMI). It records **seven
clinical criteria**, awards **1 point** for each criterion that is present,
sums a total of **0–7**, and maps that total to the **14-day risk of a composite
adverse event** — all-cause death, new or recurrent myocardial infarction, or
severe recurrent ischaemia requiring **urgent revascularisation**. A higher
score identifies patients who benefit most from an **early invasive strategy**
and more intensive antithrombotic therapy.

The instrument is the **Thrombolysis In Myocardial Infarction (TIMI) risk score
for UA/NSTEMI**, derived by Antman *et al.* (*JAMA* 2000) from the TIMI 11B and
ESSENCE trial cohorts. A **separate TIMI risk score for STEMI** exists (Morrow
*et al.*, *Circulation* 2000) for patients with ST-segment-elevation myocardial
infarction; **this form is the UA/NSTEMI version** and must not be used to score
a STEMI presentation.

## Scope and intended users

- **Setting:** emergency department, chest-pain unit, acute and general medical
  wards, cardiology and coronary-care units — any setting where a patient with
  suspected UA/NSTEMI needs early risk stratification.
- **Users:** emergency physicians, cardiologists, acute-medicine clinicians,
  advanced nurse practitioners, and other clinicians assessing acute chest pain.
- **Patients:** adults with a working diagnosis of unstable angina or NSTEMI.
- **Not for:** ST-elevation myocardial infarction (use the TIMI STEMI score),
  non-cardiac chest pain, definitive diagnosis, or as a substitute for clinical
  judgement, serial troponin testing, or a validated chest-pain pathway. A low
  score does not exclude an acute coronary syndrome.

## Scoring system

**Primary instrument:** TIMI UA/NSTEMI risk score — seven criteria, each scoring
**1 point** when present and **0** when absent. Total score **0–7**.

| # | Criterion | Scores 1 point when | Points |
| --- | --- | --- | --- |
| 1 | Age ≥ 65 years | patient is 65 years or older | 0 or 1 |
| 2 | ≥ 3 coronary risk factors | at least three of: hypertension, hypercholesterolaemia, diabetes, current smoking, family history of premature CAD | 0 or 1 |
| 3 | Known coronary artery disease | prior coronary stenosis ≥ 50% documented on angiography | 0 or 1 |
| 4 | Aspirin use in prior 7 days | patient took aspirin within the last 7 days | 0 or 1 |
| 5 | Severe recent angina | ≥ 2 anginal episodes in the last 24 hours | 0 or 1 |
| 6 | ST deviation | ST-segment deviation ≥ 0.5 mm on presenting ECG | 0 or 1 |
| 7 | Positive cardiac marker | elevated troponin or CK-MB | 0 or 1 |

**Interpretation.** The total maps to the observed 14-day rate of the composite
end point (all-cause mortality, new or recurrent MI, or severe recurrent
ischaemia prompting urgent revascularisation) in the derivation cohorts.

| Total score | Risk band | 14-day event risk | Recommended action |
| --- | --- | --- | --- |
| 0 | Low | ~4.7% | Consider a conservative, ischaemia-guided strategy; continue monitoring and serial troponin. |
| 1 | Low | ~4.7% | As above. |
| 2 | Intermediate | ~8.3% | Admit for observation; guideline-directed medical therapy; consider an early invasive strategy. |
| 3 | Intermediate | ~13.2% | Early invasive strategy warranted for most; intensify antithrombotic therapy. |
| 4 | Intermediate | ~19.9% | Early invasive strategy; cardiology review. |
| 5 | High | ~26.2% | Early invasive strategy; urgent cardiology / coronary-care involvement. |
| 6–7 | High | ~40.9% | Urgent early invasive strategy; intensive antithrombotic and anti-ischaemic therapy. |

Grouped bands: **0–1 low**, **2–4 intermediate**, **5–7 high**. Event risk rises
monotonically and roughly tenfold across the range, from ~4.7% at 0–1 to ~40.9%
at 6–7.

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
one or more of the seven scored criteria plus context.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, working diagnosis (UA / NSTEMI) |
| 2 | Patient identification | patient identifier, age (years), sex |
| 3 | Age and risk factors | age ≥ 65 → criterion 1; hypertension, hypercholesterolaemia, diabetes, current smoking, family history → criterion 2 (≥ 3) |
| 4 | Cardiac history and medication | known CAD (stenosis ≥ 50%) → criterion 3; aspirin in prior 7 days → criterion 4 |
| 5 | Presentation | ≥ 2 anginal episodes in 24 h → criterion 5 |
| 6 | Investigations | ST deviation ≥ 0.5 mm → criterion 6; positive troponin / CK-MB → criterion 7 |
| 7 | Summary and score | computed TIMI total, risk band, 14-day event risk, fired criteria, flagged issues, management recommendation, free-text clinical note |

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
  decision-support risk-stratification tool; the output informs the choice of
  strategy rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Antman E.M. *et al.* The TIMI Risk Score for Unstable Angina/Non-ST Elevation
  MI: A Method for Prognostication and Therapeutic Decision Making. *JAMA* 2000;
  284(7):835–842.
- Morrow D.A. *et al.* TIMI Risk Score for ST-Elevation Myocardial Infarction.
  *Circulation* 2000; 102(17):2031–2037 (the separate STEMI instrument).
- NICE NG185. *Acute coronary syndromes* (2020, updated 2025).
- Collet J-P. *et al.* 2020 ESC Guidelines for the management of acute coronary
  syndromes in patients presenting without persistent ST-segment elevation.
  *Eur Heart J* 2021; 42(14):1289–1367.

## Verify

```sh
bin/test-form timi-risk-score-for-acute-coronary-syndrome
```
