# SCORE2-Diabetes equation

SCORE2-Diabetes extends the European Society of Cardiology's SCORE2 risk
algorithm with diabetes-specific predictors. It estimates 10-year risk of
fatal and non-fatal CVD in adults aged 40–69 with type 2 diabetes and
without prior CVD.

## Primary sources

- SCORE2-Diabetes Working Group and ESC Cardiovascular Risk
  Collaboration. *SCORE2-Diabetes: 10-year cardiovascular risk estimation
  in type 2 diabetes in Europe.* Eur Heart J 2023;44(28):2544-2556.
  DOI: 10.1093/eurheartj/ehad260. PMID: 37247330.
- SCORE2 working group and ESC Cardiovascular Risk Collaboration. *SCORE2
  risk prediction algorithms: new models to estimate 10-year risk of
  cardiovascular disease in Europe.* Eur Heart J 2021;42(25):2439-2454.
  DOI: 10.1093/eurheartj/ehab309.

## Derivation and validation

- Derivation cohorts: SCORE2-Diabetes pooled 229,460 individuals with type
  2 diabetes from four cohorts (UK Biobank, Scottish Care Information –
  Diabetes Collaboration, Clinical Practice Research Datalink, and the
  Emerging Risk Factors Collaboration), with 43,706 incident CVD events.
- External validation: 217,036 participants from eight cohorts.
- Outcome: composite of cardiovascular death, non-fatal myocardial
  infarction, and non-fatal stroke.

## Predictor set

In addition to the SCORE2 baseline predictors:

- Age (40–69 y at modelling; SCORE2-OP covers 70+).
- Sex.
- Current smoking (yes/no).
- Systolic blood pressure.
- Non-HDL cholesterol (mmol/L).

SCORE2-Diabetes adds:

- Age at diagnosis of diabetes (years).
- HbA1c (mmol/mol).
- eGFR (CKD-EPI 2021, mL/min/1.73 m²).

## Recalibration to risk regions

SCORE2 and SCORE2-Diabetes are recalibrated to four European CVD-mortality
risk regions (Low, Moderate, High, Very High) defined by WHO age-
standardised CVD mortality. The recalibration tables are in the 2021 and
2023 ESC publications and in the 2021 ESC Prevention Guidelines.

- Low-risk countries include Belgium, Denmark, France, Germany, Israel,
  Luxembourg, Norway, Spain, Switzerland, the Netherlands, the United
  Kingdom (Hageman 2021 Table 2; 2021 ESC Prevention Guidelines §3.5).
- Moderate-risk countries include Austria, Cyprus, Finland, Iceland,
  Ireland, Italy, Malta, Portugal, San Marino, Slovenia, Sweden.
- High-risk countries include Albania, Bosnia and Herzegovina, Croatia,
  Czech Republic, Estonia, Hungary, Kazakhstan, Poland, Slovakia, Türkiye.
- Very-high-risk countries include Algeria, Armenia, Azerbaijan, Belarus,
  Bulgaria, Egypt, Georgia, Kyrgyzstan, Latvia, Lebanon, Libya, Lithuania,
  Montenegro, Morocco, Republic of Moldova, Romania, Russian Federation,
  Serbia, Syrian Arab Republic, North Macedonia, Tunisia, Ukraine,
  Uzbekistan.

## Risk thresholds and clinical action (ESC 2023)

Age-modified thresholds for "very high" 10-year CVD risk, per the 2023 ESC
SCORE2-Diabetes update and 2021 ESC Prevention Guidelines:

- Age 40–49: very high ≥ 7.5 %; high 2.5 – < 7.5 %; low/moderate < 2.5 %.
- Age 50–69: very high ≥ 10 %; high 5 – < 10 %; low/moderate < 5 %.

Patients with diabetes and target-organ damage (eGFR < 45 mL/min/1.73 m²,
microalbuminuria, retinopathy, neuropathy) or established CVD are
automatically classified as **very high risk** and do not require SCORE2
computation (2021 ESC Prevention §6).

## Coefficients

The Cox model coefficients are listed in Hageman 2023 Supplemental Tables
and the SCORE2 2021 paper. Implementations must replicate the published
transformations (centring of age and HbA1c, log-eGFR, smoking × age
interaction) precisely. Use the ESC calculator at
<https://www.escardio.org/Education/ESC-Prevention-of-CVD-Programme/Risk-assessment/SCORE2-Diabetes>
as a reference.

## References

- Hageman SHJ, McKay AJ, Ueda P, et al. *SCORE2-Diabetes.* Eur Heart J
  2023;44(28):2544-2556. DOI: 10.1093/eurheartj/ehad260.
- SCORE2 Working Group. Eur Heart J 2021;42(25):2439-2454.
  DOI: 10.1093/eurheartj/ehab309.
- Visseren FLJ et al. *2021 ESC Prevention Guidelines.* Eur Heart J
  2021;42(34):3227-3337. DOI: 10.1093/eurheartj/ehab484.
- ESC SCORE2-Diabetes calculator.
  <https://www.escardio.org/Education/ESC-Prevention-of-CVD-Programme/Risk-assessment/SCORE2-Diabetes>
