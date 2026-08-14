# Clinical protocol

Operational protocol for the PREVENT-based primary-prevention assessment.

## Indications

- Adults aged 30–79 years.
- No prior atherosclerotic cardiovascular disease (MI, stroke, peripheral
  arterial disease, coronary or peripheral revascularization).
- No prior heart failure (a separate HF outcome is *predicted* by PREVENT;
  patients with existing HF require disease-specific management not
  primary-prevention scoring).
- Used for primary prevention shared decision-making about lifestyle,
  blood-pressure management, lipid-lowering therapy, and (where relevant)
  metabolic therapy.

## Required measurements

Per Khan 2024 Methods §Predictors:

- Age, sex.
- Systolic blood pressure (preferably mean of two readings).
- Antihypertensive use (any agent).
- Total cholesterol and HDL-cholesterol.
- Diabetes status (yes/no based on HbA1c ≥ 6.5 %, fasting glucose ≥ 7.0
  mmol/L, or established diagnosis).
- Current smoking (yes/no).
- eGFR via CKD-EPI 2021 creatinine equation.
- BMI from height and weight.

Optional inputs for the extended model:

- HbA1c (mmol/mol or %).
- Urine albumin-to-creatinine ratio (UACR).
- Zip-code-derived social deprivation index (US).

## Step-by-step

1. **Demographics.** Confirm age 30–79 y and absence of prior CVD/HF.
2. **Blood Pressure.** Sitting BP after 5 min rest; mean of two readings.
   Record antihypertensive use.
3. **Cholesterol & Lipids.** Total cholesterol and HDL-C in mmol/L (UK) or
   mg/dL (US); record measurement date.
4. **Metabolic Health.** Height, weight → BMI. Record HbA1c for the
   extended model.
5. **Renal Function.** Serum creatinine, age, sex → eGFR via CKD-EPI 2021.
   Record UACR if available.
6. **Smoking History.** Current / former / never; pack-years if relevant.
7. **Medical History.** Confirm absence of prior CVD/HF; record diabetes.
8. **Current Medications.** Antihypertensive(s), statin, glucose-lowering.
9. **Review & Calculate.** Compute 10- and 30-year total CVD risk, with
   sub-outputs for ASCVD and HF.

## Output interpretation

- 10-year total CVD ≥ 20 % → high; emphasize intensive lifestyle and
  high-intensity statin per 2018 Cholesterol Guideline.
- 10-year total CVD 7.5 – < 20 % → intermediate; shared-decision statin.
- 10-year total CVD 5 – < 7.5 % → borderline; consider risk-enhancers.
- 10-year total CVD < 5 % → low; lifestyle and reassessment in 4–6 years.
- 30-year risk is a communication device for younger adults whose 10-year
  risk is low; pair with lifestyle counselling and risk-factor optimization.

## Onward actions

- BP confirmation per 2017 ACC/AHA Hypertension Guideline if elevated.
- Lipid management per 2018 Cholesterol Guideline.
- Diabetes management per ADA *Standards of Care in Diabetes 2025*.
- CKD review if eGFR < 60 mL/min/1.73 m² or UACR ≥ 30 mg/g.

## References

- Khan SS et al. Circulation 2024;149(6):430-449.
  DOI: 10.1161/CIRCULATIONAHA.123.067626.
- Whelton PK et al. *2017 ACC/AHA Hypertension Guideline.* Hypertension
  2018;71(6):e13-e115. DOI: 10.1161/HYP.0000000000000065.
- 2018 AHA/ACC/Multisociety Cholesterol Guideline.
  DOI: 10.1161/CIR.0000000000000625.
- ADA *Standards of Care in Diabetes 2025.* Diabetes Care 2025;48(Suppl 1).
  DOI: 10.2337/dc25-Sint.
  <https://diabetesjournals.org/care/issue/48/Supplement_1>
- Inker LA et al. *CKD-EPI 2021 creatinine equation.* N Engl J Med
  2021;385:1737-1749. DOI: 10.1056/NEJMoa2102953.
