# Safety case notes

Safety considerations for the nutrition assessment form.

## Intended purpose

To record a structured nutritional review using the BAPEN-published MUST
tool plus dietary, swallowing, gastrointestinal, and support-history
fields, and to surface malnutrition risk and refeeding-syndrome risk to
inform dietitian and clinical-team action.

## Intended users

Registered nurses, dietitians, GPs, and other registered healthcare
professionals performing structured nutritional review.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, software that performs malnutrition
screening and triggers nutritional-support decisions is **Class IIa**.

## Hazard analysis

| Hazard | Mitigation |
| --- | --- |
| BMI computed from inaccurate height or weight | Step 2 supports alternative measurements (MUAC, ulna length) per BAPEN; out-of-range BMI surfaces warning |
| Weight-loss percentage miscalculated when usual weight unknown | Engine refuses to compute % weight loss without usual weight; UI surfaces "unknown" rather than guessing |
| Acute-disease effect score over- or under-applied | Step 3 prompts for both criteria (acutely ill AND > 5 days no/little intake) before scoring 2 |
| Refeeding syndrome risk missed | Step 4 + biochemistry inputs trigger CG32 §1.4 risk flag; result page displays explicit refeeding protocol summary |
| Dysphagia / aspiration risk missed → unsafe oral feeding | Step 5 dysphagia screen mandatory; positive result triggers "nil by mouth pending SLT review" recommendation |
| Confused allergy vs intolerance leading to mis-labelled diet | Step 7 separates IgE-mediated allergy from intolerance and from coeliac disease |
| ONS supplied without flavour / preference consideration | Step 7 / 8 captures preference; care plan free-text |
| Cultural / religious diet not respected | Step 3 / 7 captures dietary preferences; care plan includes consultation note |

## Out of scope

- The form does **not** compute individualised tube-feed formulas; it
  records the regimen prescribed by the dietitian.
- The form does **not** diagnose coeliac disease or food allergy; it
  records existing diagnoses and triggers onward referral.
- The form does **not** replace the dietitian-led detailed nutrition
  assessment using GLIM criteria; it screens and identifies who needs
  detailed assessment.

## Equity considerations

- BMI cut-offs are population-based and may misclassify in adults with
  high muscle mass; clinician judgement applies.
- Cultural and religious dietary patterns are captured in steps 3 and 7
  and must be respected in the care plan.

## Post-market surveillance

UK operators should report misclassification or workflow incidents via
MHRA Yellow Card: <https://yellowcard.mhra.gov.uk/>.

## References

- NICE CG32. <https://www.nice.org.uk/guidance/cg32>
- NICE QS24. <https://www.nice.org.uk/guidance/qs24>
- BAPEN MUST. <https://www.bapen.org.uk/screening-and-must/must>
- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- MHRA *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
