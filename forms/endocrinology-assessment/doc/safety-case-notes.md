# Safety case notes

Safety considerations for the endocrinology assessment form.

## Intended purpose

To record a structured endocrine consultation covering six axes (thyroid,
adrenal, glucose, reproductive, pituitary, bone/calcium), surface
biochemical and symptom abnormalities, and produce a per-axis severity
categorization to inform onward management.

## Intended users

Endocrinology specialists, registrars, specialist nurses, and primary-
care clinicians performing structured endocrine review.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, software that surfaces biochemical
abnormalities and category recommendations is **Class IIa** because
output may influence diagnostic and therapeutic decisions.

## Hazard analysis

| Hazard | Mitigation |
| --- | --- |
| Use of generic adult reference intervals in pregnancy | Demographics step asks pregnancy status; thyroid step shows trimester-specific intervals when pregnancy is flagged |
| Biotin interference falsely lowering TSH | Medication review captures biotin/multivitamin use; result page warns |
| Macroprolactinaemia mistaken for true hyperprolactinaemia | Form prompts for PEG precipitation confirmation when prolactin > 1000 mIU/L |
| Adrenal crisis missed | Symptom step flags hyperpigmentation, postural hypotension, hyponatraemia; severe-adrenal flag triggers urgent referral text |
| Acromegaly diagnosis delay | Pituitary step prompts IGF-1; OGTT-GH suppression test mentioned in onward-care text |
| Calcium not corrected for albumin | Engine accepts both raw and corrected calcium; conversion factor 0.02 × (40 − albumin) documented |
| Subclinical thyroid disease over-treated | Categorization distinguishes Subclinical from Mild; PDF report cites NICE NG145 thresholds |

## Out of scope

- The form does **not** perform dynamic-function-test interpretation; it
  records inputs and timings only.
- The form does **not** replace the diabetes-assessment form for
  comprehensive diabetes review.
- The form does **not** include endocrine paediatric reference intervals;
  it is designed for adults.
- The form does **not** prescribe specific medication doses.

## Equity considerations

- Reference intervals for cortisol, prolactin, and PTH vary by assay
  manufacturer; the form supports user-configured local reference ranges.
- The form does not encode ethnicity-stratified vitamin D thresholds;
  clinician judgement applies for pigmented skin and high-latitude
  populations.

## Post-market surveillance

UK operators report via MHRA Yellow Card:
<https://yellowcard.mhra.gov.uk/>.

## References

- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- NICE NG145 *Thyroid disease.* <https://www.nice.org.uk/guidance/ng145>
- MHRA *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- Society for Endocrinology Emergency Endocrine Guidance.
  <https://www.endocrinology.org/clinical-practice/clinical-guidance/emergency-endocrine-guidance/>
