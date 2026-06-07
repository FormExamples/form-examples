# Safety case notes

Safety considerations for the PREVENT primary-prevention risk calculator,
framed for the UK Medical Devices Regulations 2002 and MDCG 2019-11 Rev.1
software classification.

## Intended purpose

To estimate 10- and 30-year risk of total CVD (and its ASCVD and HF
sub-components) using the AHA PREVENT equations (Khan 2024) in adults
aged 30–79 years without prior CVD, for use in primary-prevention shared
decision-making about lifestyle, blood-pressure, lipid-lowering, and
metabolic therapy.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, a calculator that drives lipid- or
blood-pressure-lowering treatment decisions is **Class IIa**.

## Hazard analysis

| Hazard | Mitigation |
| --- | --- |
| Coefficients diverge from Khan 2024 supplemental tables | Engine implementation references Khan 2024 supplemental tables S6–S11; unit tests verify worked examples from the paper |
| eGFR computed with wrong CKD-EPI variant (race-based 2009 vs race-free 2021) | Engine uses Inker 2021 race-free equation per Khan 2024 §Methods; unit tests cover boundary cases |
| Patient out of validated age range (30–79 y) | Step 1 enforces; out-of-range warning prevents calculation |
| Prior CVD missed → spurious primary-prevention recommendation | Step 7 mandatory CVD-history items |
| Diabetes flag inverted (yes/no swap) | Multi-step capture (HbA1c, fasting glucose, established Dx) cross-checked at review step |
| 30-year risk misinterpreted as 10-year | Report formatting separates horizons clearly; PDF labels include time horizon |
| Race-based pre-2024 PCE assumptions carried over | This form explicitly does not collect race for risk computation (PREVENT is race-free) |
| Use in UK/EU contexts without local recalibration | Result page acknowledges PREVENT is US-derived; cross-references QRISK3 (UK) and SCORE2 (EU) |

## Equation provenance

PREVENT was derived and validated by Khan et al. 2024 on US EHR cohorts
totalling > 6.6 million unique adults. Supplemental Tables S6–S11 list the
sex-specific Cox coefficients. Implementations should test their numerical
output against the worked examples in the Khan 2024 paper and against the
AHA PREVENT online calculator at
<https://professional.heart.org/en/guidelines-and-statements/prevent-calculator>.

## Limitations communicated to operator

- US-derived equations; may over- or under-estimate in non-US populations.
- 30-year risk is informative for shared decision-making but has wider
  prediction intervals than the 10-year estimate.
- HF prediction is a new output and clinical thresholds for action are
  evolving (no validated treatment threshold exists comparable to the
  ASCVD ≥ 20 % rule).
- The extended model (HbA1c, UACR, SDI) is optional and changes 10-year
  risk modestly; missing optional inputs do not invalidate the base score.

## Out of scope

- Secondary prevention (established CVD) — use post-event care pathways.
- Familial hypercholesterolaemia — use NICE CG71 / US FH Foundation
  pathway.
- Children and adults < 30 y — out of validated range.
- Acute risk (e.g. acute coronary syndrome) — use GRACE 2.0 / TIMI scores.

## Post-market surveillance

UK operators should report misclassification or workflow incidents via
MHRA Yellow Card: <https://yellowcard.mhra.gov.uk/>. US operators should
follow FDA MedWatch where applicable.

## References

- Khan SS et al. *Development and validation of the AHA PREVENT
  equations.* Circulation 2024;149(6):430-449.
  DOI: 10.1161/CIRCULATIONAHA.123.067626.
- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- MHRA *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- AHA PREVENT calculator.
  <https://professional.heart.org/en/guidelines-and-statements/prevent-calculator>
