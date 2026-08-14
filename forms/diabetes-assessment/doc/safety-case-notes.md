# Safety case notes

Safety considerations for the diabetes assessment form.

## Intended purpose

To record a structured annual diabetes review aligned with NICE NG28 /
NG17 and the Diabetes UK 15 Healthcare Essentials, and to surface
modifiable risk factors and out-of-target measurements to support clinical
decision-making.

## Intended users

Primary-care and diabetes-team clinicians (GPs, practice nurses, diabetes
specialist nurses, consultants, dietitians).

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, software for diabetes annual review that
surfaces target deviations is **Class IIa** because the output may
influence medication and referral decisions.

## Hazard analysis

| Hazard | Mitigation |
| --- | --- |
| HbA1c units (mmol/mol vs DCCT %) confused | Both accepted at input; engine stores mmol/mol; PDF prints both |
| Individualized HbA1c target mis-set, leading to spurious "suboptimal" or "controlled" | Step 3 captures clinician-defined target as an input; the form records the reason for relaxation per NG28 |
| Severe hypoglycaemia event under-reported | Step 3 dedicated field; Step 8 cross-check |
| Active diabetic foot problem missed | Step 9 dedicated; NG19 risk-stratification mandatory |
| ACR / eGFR omitted leading to missed CKD | Step 5 mandatory; absence raises a flag |
| Mental-health risk under-detected | Step 8 PHQ-9 and PAID-5; PHQ-9 ≥ 15 raises high-priority flag |
| Statin not offered when QRISK / CG181 indicates | Step 6 captures CVD-risk score and statin status; engine flags missing statin per NG28 §1.6.42 |
| Drug interactions or contraindications | Out of scope; the BNF and local formulary remain the prescribing authority |

## Out of scope

- The form does **not** prescribe or recommend specific medications; it
  records current treatment and flags target deviations.
- The form does **not** perform retinal grading; it records the result of
  the NHS Diabetic Eye Screening Programme.
- The form does **not** replace structured education or hypoglycaemia
  unawareness training (e.g. BERTIE, DAFNE-HART).

## Equity considerations

- BMI and waist-circumference cut-offs in NICE NG28 are adjusted for
  South Asian, Chinese, African-Caribbean, and Black African ethnicity
  (Annex B). The form's body-measurements step uses ethnicity-adjusted
  thresholds where applicable.
- Diabetes UK *Tackling Inequality* policy recommends extra support
  channels for the most deprived quintiles; the form supports flagging for
  social-prescribing referral.

## Post-market surveillance

Report incidents (e.g. missed foot ulcer, wrong HbA1c unit) via MHRA
Yellow Card at <https://yellowcard.mhra.gov.uk/>.

## References

- NICE NG28 (2015, updated 2022). <https://www.nice.org.uk/guidance/ng28>
- NICE NG17 (2015, updated 2022). <https://www.nice.org.uk/guidance/ng17>
- NICE NG19 (2015, updated 2019). <https://www.nice.org.uk/guidance/ng19>
- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- MHRA *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- Diabetes UK. *15 Healthcare Essentials.*
  <https://www.diabetes.org.uk/about-us/our-policies/healthcare-services/15-healthcare-essentials>
