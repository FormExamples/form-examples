# Scoring equations

The "Hard CHD" Framingham risk equation predicts 10-year risk of myocardial
infarction or coronary heart disease death using the Cox proportional-hazards
model fit by Wilson et al. (1998) on the Framingham Offspring cohort.

## Primary source

- Wilson PWF, D'Agostino RB, Levy D, Belanger AM, Silbershatz H, Kannel WB.
  *Prediction of coronary heart disease using risk factor categories.*
  Circulation 1998;97(18):1837-1847. DOI: 10.1161/01.CIR.97.18.1837.
  PMID: 9603539.

The ATP III adult treatment panel published the simplified point-system
implementation derived from the Wilson equation:

- National Cholesterol Education Program (NCEP) Expert Panel. *Third Report
  of the Expert Panel on Detection, Evaluation, and Treatment of High Blood
  Cholesterol in Adults (ATP III).* NIH Publication No. 02-5215; 2002.
  Appendix III contains the point tables.
  <https://www.nhlbi.nih.gov/files/docs/resources/heart/atp-3-cholesterol-full-report.pdf>

## Model form

The Cox model has the form:

```
P(CHD in 10 y) = 1 - S0(10) ^ exp(Σ βi · (xi − x̄i))
```

where `S0(10)` is the baseline 10-year survival from the Framingham cohort
and `βi` are the coefficients of each risk-factor category. The Wilson 1998
paper publishes baseline survival values and coefficients separately for
men and women.

## Risk-factor categories (ATP III point system)

The point system used in this form mirrors the ATP III implementation of
the Wilson 1998 equation. Inputs:

- **Age** in years (range 20–79).
- **Total cholesterol** in mg/dL, banded < 160, 160–199, 200–239, 240–279,
  ≥ 280.
- **HDL cholesterol** in mg/dL, banded ≥ 60, 50–59, 40–49, < 40.
- **Systolic blood pressure** in mmHg, banded < 120, 120–129, 130–139,
  140–159, ≥ 160; treatment status further modifies the points.
- **Smoking status** (current smoker, yes/no).

Sex-stratified point tables are reproduced in ATP III Appendix III. The
final point total is mapped to the 10-year hard-CHD probability via the
sex-specific look-up table (men: ≤ −1 → < 1 %; 17+ → ≥ 30 %; women: ≤ 8 →
< 1 %; 25+ → ≥ 30 %).

## Categorization

Standard cut-points (ATP III §I-B):

- Low risk: < 10 %
- Intermediate risk: 10–19.9 %
- High risk: ≥ 20 %

## Eligibility and exclusions

Per the Wilson 1998 paper and ATP III §II-A:

- Adults aged 30–79 years.
- No history of CHD (prior MI, angina, coronary revascularization, or CHD
  death).
- No diabetes (diabetes is treated as a CHD risk equivalent in ATP III).
- No active lipid-lowering therapy at the time of measurement preferred.

## Unit conversion

- Total cholesterol mg/dL → mmol/L: divide by 38.67.
- HDL cholesterol mg/dL → mmol/L: divide by 38.67.

## Calibration and limitations

- The Wilson 1998 cohort was 94 % white, US-based (Framingham,
  Massachusetts). Calibration is poorer in non-white populations.
- The model does not include family history of premature CHD, eGFR,
  BMI, or ethnicity. These limitations motivated successor equations
  (ATP III General CVD 2008, ACC/AHA PCE 2013, AHA PREVENT 2023).
- Diabetes is **not** an input — patients with diabetes should instead be
  assessed with SCORE2-Diabetes (Europe) or PCE/PREVENT (US).
