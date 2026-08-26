# GRACE Score for Acute Coronary Syndrome

The **GRACE** (Global Registry of Acute Coronary Events) score is a validated
risk-stratification tool for adults presenting with an **acute coronary
syndrome** (ACS), used above all in **non-ST-elevation ACS** (NSTEMI and
unstable angina). It combines eight admission variables — **age**, **heart
rate**, **systolic blood pressure**, **serum creatinine**, **Killip class**,
**cardiac arrest at admission**, **ST-segment deviation**, and **elevated
cardiac enzymes / troponin** — into a **weighted point total** that maps to an
estimated **in-hospital** and **6-month all-cause mortality** risk, and to a
**Low / Intermediate / High** risk category.

Unlike a simple additive checklist, GRACE is derived from a **multivariable
logistic-regression model**: each variable contributes a differently weighted,
partly non-linear number of points (older age, faster heart rate, lower systolic
pressure, higher creatinine, and higher Killip class each add more points). The
point total is then read against calibrated mortality bands. The category does
not diagnose ACS; it **quantifies prognosis** and helps decide the **timing of
an invasive (coronary angiography) strategy**.

GRACE was derived from the Global Registry of Acute Coronary Events (Granger
*et al.*, *Arch Intern Med* 2003; Fox *et al.*, *BMJ* 2006) and refined as
**GRACE 2.0** (Fox *et al.*, *BMJ Open* 2014). It is recommended by the
**European Society of Cardiology (ESC)** NSTE-ACS guidelines and by **NICE**
for risk assessment after ACS.

## Scope and intended users

- **Setting:** emergency department, acute medical unit, coronary care unit,
  and cardiology wards — any setting managing a suspected or confirmed acute
  coronary syndrome.
- **Users:** emergency physicians, acute physicians, cardiologists, and
  cardiology nurse specialists performing admission risk assessment.
- **Patients:** adults presenting with **NSTE-ACS** (NSTEMI or unstable angina);
  the model is also applied to STEMI cohorts for prognosis.
- **Not for:** ruling ACS in or out (use troponin pathways and ECG), paediatric
  patients, or as a substitute for clinical judgement. A Low GRACE category does
  not exclude an evolving infarction or high-risk anatomy.

## Scoring system

**Primary instrument:** GRACE — a **weighted regression point model** over eight
admission variables. Each variable maps to a band of points; the points are
**summed** into a total (roughly **0–350+**) that is read against calibrated
mortality bands. The weights below are representative of the published GRACE
point tables; the canonical coefficients live in
[`spec/index.md`](spec/index.md) §4 and drive the engine.

| # | Variable | Type | Contribution (weighted) |
| --- | --- | --- | --- |
| 1 | Age | years | monotonically increasing; older age adds substantially more points |
| 2 | Heart rate | beats/min | higher rate adds more points |
| 3 | Systolic blood pressure | mmHg | **lower** pressure adds more points (inverse) |
| 4 | Serum creatinine | mg/dL (or µmol/L) | higher creatinine adds more points |
| 5 | Killip class | I–IV | I = 0; each higher class adds a large increment (heart-failure severity) |
| 6 | Cardiac arrest at admission | yes / no | fixed high-point increment when present |
| 7 | ST-segment deviation | yes / no | fixed increment when present |
| 8 | Elevated cardiac enzymes / troponin | yes / no | fixed increment when present |

**Interpretation — in-hospital mortality.**

| Point total | Risk category | Estimated in-hospital mortality |
| --- | --- | --- |
| ≤ 108 | Low | < 1 % |
| 109–140 | Intermediate | 1–3 % |
| > 140 | High | > 3 % |

**Interpretation — 6-month post-discharge mortality.**

| Point total | Risk category | Estimated 6-month mortality |
| --- | --- | --- |
| ≤ 88 | Low | < 3 % |
| 89–118 | Intermediate | 3–8 % |
| > 118 | High | > 8 % |

The overall **risk category** reported to the clinician is the **worse** of the
two bands (max-band rule), so a patient in the High band on either horizon is
flagged High.

**Guidance on invasive strategy** (aligned with ESC NSTE-ACS guidelines; final
timing is a clinical decision):

| Risk category | Suggested invasive strategy |
| --- | --- |
| Low (GRACE ≤ 108) | Selective invasive strategy; non-invasive testing for ischaemia first, angiography if positive. |
| Intermediate (109–140) | Invasive strategy, coronary angiography **within 72 hours**. |
| High (> 140) | **Early invasive strategy**, coronary angiography **within 24 hours**; senior cardiology review. |

## Assessment steps

Completed in order on a single continuous single-page wizard. Each step records
an **objective admission finding**.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, ACS presentation type |
| 2 | Patient identification | patient identifier, age (years), sex |
| 3 | Haemodynamics | heart rate (beats/min), systolic blood pressure (mmHg) |
| 4 | Renal function | serum creatinine (with unit mg/dL or µmol/L) |
| 5 | Heart failure severity | Killip class (I–IV) |
| 6 | High-risk features | cardiac arrest at admission, ST-segment deviation, elevated cardiac enzymes / troponin |
| 7 | Summary and score | computed GRACE point total, in-hospital and 6-month mortality bands, overall risk category, fired contributors, red-flag issues, invasive-strategy recommendation, free-text clinical note |

## Conventions

- Empty string `''` for unanswered text and enum fields; `null` for unanswered
  numeric, date, and time fields.
- camelCase property names in TypeScript and front-end Rust serde; snake_case in
  SQL and Rust internals.
- UUIDv4 primary keys via `gen_random_uuid()`.
- Timestamps on every table: `created_at`, `updated_at`, `deleted_at`.
- Import and export via JSON, XML, CSV, and TSV.
- Serum creatinine is normalized to a single internal unit before scoring; the
  entered unit is stored alongside the raw value.
- The scoring engine is pure (no side effects, no I/O) and unit-tested.

## Compliance

- **MDCG 2019-11 Rev.1** (EU MDR/IVDR software classification) — clinical
  decision-support risk-stratification tool; the output informs the timing of an
  invasive strategy rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Granger C.B. *et al.* Predictors of hospital mortality in the Global Registry
  of Acute Coronary Events. *Arch Intern Med* 2003; 163(19):2345–2353.
- Fox K.A.A. *et al.* Prediction of risk of death and myocardial infarction in
  the six months after presentation with acute coronary syndrome. *BMJ* 2006;
  333(7578):1091.
- Fox K.A.A. *et al.* Should patients with acute coronary disease be stratified
  for management according to their risk? Derivation, external validation and
  outcomes using the updated GRACE risk score (GRACE 2.0). *BMJ Open* 2014;
  4(2):e004425.
- ESC Guidelines for the management of acute coronary syndromes (2023).
- NICE NG185. *Acute coronary syndromes* (2020).

## Verify

```sh
bin/test-form grace-score-for-acute-coronary-syndrome
```
