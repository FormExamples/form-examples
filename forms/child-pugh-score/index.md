# Child-Pugh Score (Child-Turcotte-Pugh)

A prognostic score for the severity of chronic liver disease, principally
cirrhosis. It grades **five parameters** — total bilirubin, serum albumin, INR
(or prothrombin time), ascites, and hepatic encephalopathy — on a 1-to-3 scale,
sums a total of **5-15**, and assigns a **class (A, B, or C)** that maps to
estimated one- and two-year survival and to peri-operative mortality risk. The
score guides prognosis, transplant assessment, and surgical-risk stratification.

Originally described by Child and Turcotte (1964) for stratifying operative
mortality in portal-hypertension surgery, and refined by Pugh *et al.* (1973),
who replaced nutritional status with prothrombin time and formalised the graded
scoring used today.

## Scope and intended users

- **Setting:** hepatology and gastroenterology clinics, general and acute
  medicine, hepatobiliary and general surgery, anaesthetics and pre-operative
  assessment, transplant assessment, and intensive care.
- **Users:** hepatologists, gastroenterologists, surgeons, anaesthetists,
  physicians, and specialist nurses caring for patients with chronic liver
  disease.
- **Patients:** adults (≥ 16 years) with established chronic liver disease,
  typically cirrhosis, in whom prognosis or surgical risk must be estimated.
- **Not for:** acute liver failure, paediatric patients (use a paediatric
  measure), sole determination of transplant priority (MELD / UKELD are used for
  organ allocation), or as a substitute for clinical judgement.

## Scoring system

**Primary instrument:** Child-Pugh score — five parameters, each scored 1, 2, or
3 points against fixed thresholds. Total score 5-15.

| # | Parameter | 1 point | 2 points | 3 points |
| --- | --- | --- | --- | --- |
| 1 | Total bilirubin | < 34 µmol/L (< 2 mg/dL) | 34-50 µmol/L (2-3 mg/dL) | > 50 µmol/L (> 3 mg/dL) |
| 2 | Serum albumin | > 35 g/L | 28-35 g/L | < 28 g/L |
| 3 | INR (or prothrombin time) | < 1.7 (PT < 4 s prolonged) | 1.7-2.3 (PT 4-6 s prolonged) | > 2.3 (PT > 6 s prolonged) |
| 4 | Ascites | None | Mild (diuretic-responsive) | Moderate-to-severe (refractory) |
| 5 | Hepatic encephalopathy | None | Grade 1-2 (or medically controlled) | Grade 3-4 (or refractory) |

Bilirubin and albumin thresholds are shown in SI units with conventional units
in parentheses; higher bilirubin and lower albumin score more points. INR is the
modern standardised measure of prothrombin time; either may be recorded.

**Interpretation.** The total maps to one of three classes:

| Total score | Class | Description | ~1-year survival | ~2-year survival | Peri-operative mortality |
| --- | --- | --- | --- | --- | --- |
| 5-6 | A | Well-compensated disease | ~100% | ~85% | Low (~10%) |
| 7-9 | B | Significant functional compromise | ~80% | ~60% | Moderate (~30%) |
| 10-15 | C | Decompensated disease | ~45% | ~35% | High (~80%) |

Survival and surgical-risk figures are widely cited approximations from the
original and follow-up cohorts; they support prognostic discussion and are not
guarantees for an individual patient. Class C in particular signals decompensated
cirrhosis with poor prognosis and prohibitive elective surgical risk, and should
prompt transplant consideration.

## Assessment steps

Completed in order on a single continuous single-page wizard. Steps 3-7 each
capture one scored parameter.

| # | Step | Key fields |
| --- | --- | --- |
| 1 | Assessment context | assessing clinician name and role, date and time of assessment, care setting, aetiology of liver disease |
| 2 | Patient identification | patient identifier, age band, sex |
| 3 | Total bilirubin | measured total bilirubin (µmol/L) → parameter 1 |
| 4 | Serum albumin | measured serum albumin (g/L) → parameter 2 |
| 5 | Coagulation | INR value (or prothrombin-time prolongation, seconds) → parameter 3 |
| 6 | Ascites | clinical grade: none / mild / moderate-to-severe → parameter 4 |
| 7 | Hepatic encephalopathy | clinical grade: none / grade 1-2 / grade 3-4 → parameter 5 |
| 8 | Summary and score | computed total 5-15, class A/B/C, per-parameter points, survival and surgical-risk estimates, red-flag issues, free-text clinical note |

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
  decision-support / prognostic tool; the output supports clinical judgement
  rather than determining treatment.
- **UK Medical Devices Regulations 2002.**
- **ISO/IEC/IEEE 26514:2022** — design and development of information for users.
- **UK MHRA** *Software and AI as a Medical Device.*

## Clinical references

- Child C.G., Turcotte J.G. Surgery and portal hypertension. In: *The Liver and
  Portal Hypertension.* Saunders, 1964: 50-64.
- Pugh R.N.H. *et al.* Transection of the oesophagus for bleeding oesophageal
  varices. *Br J Surg* 1973; 60(8):646-649.
- European Association for the Study of the Liver. *EASL Clinical Practice
  Guidelines for the management of patients with decompensated cirrhosis.*
  *J Hepatol* 2018; 69(2):406-460.
- NICE NG50. *Cirrhosis in over 16s: assessment and management* (2016, updated
  2023).

## Verify

```sh
bin/test-form child-pugh-score
```
