# AHA PREVENT equations

The American Heart Association *PREVENT* (Predicting Risk of CVD EVENTs)
equations were released in 2023 to replace the 2013 Pooled Cohort
Equations (PCE) for primary CVD prevention. PREVENT predicts 10- and
30-year risk of total CVD (ASCVD + heart failure), with sub-models for
ASCVD-only and heart-failure-only outcomes.

## Primary source

- Khan SS, Matsushita K, Sang Y, et al. *Development and validation of the
  American Heart Association's PREVENT equations.* Circulation
  2024;149(6):430-449. DOI: 10.1161/CIRCULATIONAHA.123.067626.
  PMID: 37947085.

Companion AHA scientific statement:

- Khan SS, Coresh J, Pencina MJ, et al. *Novel Prediction Equations for
  Absolute Risk Assessment of Total Cardiovascular Disease Incorporating
  Cardiovascular-Kidney-Metabolic Health: A Scientific Statement From the
  American Heart Association.* Circulation 2023;148(24):1982-2004.
  DOI: 10.1161/CIR.0000000000001191. PMID: 37947085.

## Cohort

PREVENT was developed using individual-level data from 25 cohorts including
3,281,919 person-time observations from 6,612,004 unique individuals aged
30–79 years without prior CVD, drawn from electronic health records and
research cohorts in the United States.

Outcomes were ascertained using validated EHR algorithms and adjudicated
events. The cohort by design includes adults from all major US ethnic
groups but the equations are not race-stratified — unlike the 2013 PCE,
PREVENT does not include race as a predictor (Khan 2024 §Methods).

## Predictor set

Base model:

- Age (30–79 y).
- Sex.
- Total cholesterol (mg/dL or mmol/L).
- HDL cholesterol.
- Systolic blood pressure.
- Antihypertensive use.
- Diabetes (yes/no).
- Current smoking (yes/no).
- eGFR (CKD-EPI 2021 equation, mL/min/1.73 m²).
- BMI (kg/m²).

Optional add-ons for total CVD risk (Khan 2024 Table 4):

- HbA1c.
- Urine albumin-to-creatinine ratio (UACR).
- Social deprivation index (zip-code derived).

## Outputs

- 10-year risk of total CVD.
- 30-year risk of total CVD.
- 10-year risk of ASCVD (subset).
- 10-year risk of heart failure (subset).
- 30-year analogues of all three.

## Risk bands (10-year total CVD)

Khan 2024 / 2023 AHA scientific statement:

- Low: < 5 %
- Borderline: 5 – < 7.5 %
- Intermediate: 7.5 – < 20 %
- High: ≥ 20 %

## Calculator

- AHA PREVENT online calculator:
  <https://professional.heart.org/en/guidelines-and-statements/prevent-calculator>
- MDCalc PREVENT calculator:
  <https://www.mdcalc.com/calc/10491/predicting-risk-cardiovascular-disease-events-prevent>

## Coefficients

Sex-stratified Cox-proportional-hazards coefficients are published in
Khan 2024 Supplemental Tables S6–S11. Implementations must replicate the
exact transformations (age centring, log-transform of eGFR, etc.) used in
the paper. Refer to the AHA PREVENT calculator source rather than
hand-typing coefficients.

## Differences from PCE 2013

- Race-free (PCE used black/non-black categorisation).
- Adds eGFR and BMI as predictors (PCE had neither).
- Adds 30-year horizon (PCE was 10-year only).
- Adds heart failure outcome (PCE was ASCVD only).
- Re-calibrated to recent US cohorts (PCE used cohorts from 1948–1990s and
  was shown to overestimate risk in contemporary US adults).

## References

- Khan SS et al. *Development and validation of the American Heart
  Association's PREVENT equations.* Circulation 2024;149(6):430-449.
  DOI: 10.1161/CIRCULATIONAHA.123.067626.
- Khan SS et al. *Novel Prediction Equations… Scientific Statement.*
  Circulation 2023;148(24):1982-2004.
  DOI: 10.1161/CIR.0000000000001191.
- AHA PREVENT calculator.
  <https://professional.heart.org/en/guidelines-and-statements/prevent-calculator>
