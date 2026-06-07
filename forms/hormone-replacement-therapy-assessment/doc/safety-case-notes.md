# Safety case notes

Safety considerations for the HRT assessment form.

## Intended purpose

To record menopausal symptom burden (MRS), HRT eligibility / contraindication
screening, and treatment preferences to support shared-decision discussion
between a clinician and a patient considering hormone replacement therapy.

## Intended users

Primary-care clinicians, menopause specialists, and gynaecologists
performing structured HRT review.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, software that surfaces eligibility,
contraindications, and treatment-band recommendations is **Class IIa**.

## Hazard analysis

| Hazard | Mitigation |
| --- | --- |
| Active hormone-sensitive cancer missed → harmful HRT initiation | Step 9 mandatory contraindication screen; affirmative cancer flag blocks "Eligible" output |
| VTE history missed → oral oestrogen instead of transdermal | Step 8 prompts VTE history; engine recommends transdermal route when VTE / high-risk thrombophilia flagged |
| Migraine with aura → stroke risk on oral oestrogen | Step 2 / 8 captures aura history; engine recommends transdermal |
| Breast lump or atypical bleeding not actioned | Result page highlights 2-week-wait cancer pathway if recent lump / postmenopausal bleeding flagged |
| MRS misinterpreted (English-language assumption) | Form supports validated international MRS translations from <https://www.menopause-rating-scale.info/> |
| Patient self-reported menopause status discordant with biochemistry | Form supports clinician override of self-reported status; FSH not required for diagnosis ≥ 45 y (NICE NG23 §1.1.2) |
| Cardiovascular risk under-estimated | Step 6 captures QRISK3 / SCORE2 baseline |

## Out of scope

- The form does **not** prescribe specific HRT products or doses; it
  records preferences and surfaces eligibility.
- The form does **not** replace mammographic screening or bone-density
  assessment.
- The form does **not** apply to gender-affirming hormone therapy; that
  belongs to a dedicated pathway.

## Equity considerations

- The MRS has validated translations in > 30 languages; clinicians should
  use the language matching the patient's preferred reading language.
- Breast cancer baseline risk differs by ethnicity; the Tyrer-Cuzick risk
  tool (IBIS) and NICE NG241 may be appropriate adjuncts for women with a
  family history.
- Transgender and non-binary patients on cross-sex hormones should follow
  specialty pathways; this form is designed for cisgender peri- and
  postmenopausal women.

## Post-market surveillance

UK operators report adverse events via MHRA Yellow Card:
<https://yellowcard.mhra.gov.uk/>.

## References

- NICE NG23 (2024). <https://www.nice.org.uk/guidance/ng23>
- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- MHRA *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- BMS *Tools for clinicians.*
  <https://thebms.org.uk/publications/tools-for-clinicians/>
- Collaborative Group on Hormonal Factors in Breast Cancer. Lancet
  2019;394(10204):1159-1168. DOI: 10.1016/S0140-6736(19)31709-X.
