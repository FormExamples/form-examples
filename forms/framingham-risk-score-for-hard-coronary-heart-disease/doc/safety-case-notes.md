# Safety case notes

Safety considerations for the Framingham Hard CHD risk calculator,
framed for the UK Medical Devices Regulations 2002 and MDCG 2019-11
Rev.1 software classification.

## Intended purpose

To estimate the 10-year probability of myocardial infarction or coronary
heart disease death in adults aged 30–79 years without prior CHD or
diabetes, as described by Wilson et al. (Circulation 1998;97(18):1837-1847)
and the ATP III point-system simplification. The output is a risk
percentage and risk band to support clinical decision-making about lipid-
and blood-pressure-lowering therapy.

## Intended users

Primary-care and cardiology clinicians performing structured
cardiovascular-disease risk assessment.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, software that provides information to
drive treatment decisions is **Class IIa**. The calculator output may
influence statin prescribing per ATP III, so the implementation must be
verified against published point tables.

## Hazard analysis

| Hazard | Likelihood / impact | Mitigation |
| --- | --- | --- |
| Unit-conversion error (mg/dL ↔ mmol/L) | Possible / serious miscalculation | Input fields show units; conversion factor 38.67 documented; tests cover boundary values |
| Use outside intended population (age <30 or >79, prior CHD, diabetes) | Possible / model invalid | Eligibility checks at step 1 and step 6; warning displayed for out-of-range age; diabetes flag short-circuits to "Framingham not applicable; use SCORE2-Diabetes" |
| Stale risk-factor data (cholesterol >12 months) | Common / under- or over-estimate | Data-capture step asks for measurement date; result page warns if data > 12 months old |
| Operator confuses Wilson "Hard CHD" with D'Agostino "Total CVD" or PCE | Possible / over- or under-treatment | Form title and PDF report clearly identify the equation; cite Wilson 1998 explicitly |
| Patient acted on raw % without clinical interpretation | Possible / over- or under-treatment | Output is delivered to clinician; PDF report has interpretation guidance and lists CG181 / 2018 ACC/AHA recommended thresholds |
| Race/ethnicity miscalibration | Common in non-white populations | Result page footnote acknowledges the Wilson 1998 cohort demographics and recommends QRISK3 in the UK |

## Limitations communicated to operator

- Wilson 1998 cohort was 94 % white US adults from Massachusetts; risk may
  be over- or under-estimated in other populations.
- The model does not include family history of premature CVD, eGFR,
  inflammatory markers, ethnicity, or CKD.
- Newer equations (QRISK3 in the UK, PREVENT in the US, SCORE2 in Europe)
  are preferred by current guidelines for most use cases.

## Out of scope

- The calculator does **not** prescribe therapy; it surfaces a probability
  to inform shared decision-making.
- The calculator does **not** apply to patients with established CHD or
  diabetes; for diabetes use SCORE2-Diabetes (Europe), PCE/PREVENT (US),
  or the Steno T1 Risk Engine (type 1).
- The calculator does **not** estimate total CVD risk (stroke, peripheral
  arterial disease, heart failure); for total CVD use D'Agostino 2008,
  SCORE2, or PREVENT.

## Post-market surveillance

Operators in the UK should report performance issues via MHRA Yellow Card:
<https://yellowcard.mhra.gov.uk/>.

## References

- Wilson PWF et al. *Prediction of coronary heart disease using risk
  factor categories.* Circulation 1998;97(18):1837-1847. PMID: 9603539.
- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- MHRA *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
