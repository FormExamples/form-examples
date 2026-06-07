# Safety case notes

Safety considerations for the semaglutide eligibility-assessment form.

## Intended purpose

To screen adults for eligibility for semaglutide initiation (T2D or
chronic-weight-management indication), surface absolute and relative
contraindications, and produce an Eligible / Conditional / Ineligible
output to inform a clinician-led shared-decision conversation.

## Intended users

Primary-care clinicians, diabetes specialist nurses, weight-management
service staff, and pharmacists operating prescribing pathways.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, software that produces a
treatment-eligibility recommendation is **Class IIa**.

## Hazard analysis

| Hazard | Mitigation |
| --- | --- |
| MTC / MEN 2 family history missed → contraindicated initiation | Step 6 mandatory family-history question; affirmative response automatically rules to **Ineligible** |
| Pregnancy missed → teratogenic exposure | Step 1 / 6 explicit pregnancy and contraception capture; women of childbearing potential prompted for plan |
| Pancreatitis history missed → relapse | Step 7 mandatory; flagged as relative contraindication |
| Insulin / sulphonylurea dose not reduced → hypoglycaemia | Step 8 surfaces combinations needing dose review; result page includes a hypoglycaemia-counselling block |
| Eating-disorder history missed → harmful weight loss | Step 9 PHQ-9 / eating-disorder screening; affirmative active ED → **Ineligible** |
| Suicidality signal | Step 9 PHQ-9 item 9 captured; result page cites MHRA Drug Safety Update guidance |
| Off-label use without weight criteria met | Step 3 BMI gate; result page rejects when BMI < 27 and no T2D indication |
| Severe renal impairment (eGFR < 15) | Step 4 eGFR captured; rules to **Conditional** with specialist review |
| Diabetic retinopathy worsening on rapid glycaemic improvement | Result page flags need for retinal screening review for T2D |

## Out of scope

- The form does **not** prescribe; it screens.
- The form does **not** counsel on cost, supply, or commissioning rules;
  those are commissioner / pharmacy responsibilities.
- The form does **not** replace structured weight-management education
  (Tier-2 / Tier-3 NHS weight services).

## Off-label and informal supply

The form is designed for clinician-led NHS or regulated private
prescribing. Out-of-channel supply (online without prescription, beauty
clinic injectables) is not supported and the result page advises against
informal supply.

## Post-market surveillance

UK operators must report suspected adverse drug reactions via MHRA
Yellow Card: <https://yellowcard.mhra.gov.uk/>.
Patients and clinicians should monitor MHRA *Drug Safety Update*:
<https://www.gov.uk/drug-safety-update>.

## References

- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- MHRA Yellow Card. <https://yellowcard.mhra.gov.uk/>
- MHRA Drug Safety Update.
  <https://www.gov.uk/drug-safety-update>
- EMA GLP-1 RA review.
  <https://www.ema.europa.eu/en/news/ema-statement-ongoing-review-glp-1-receptor-agonists>
- Wegovy SmPC (UK). <https://www.medicines.org.uk/emc/product/13901>
- Ozempic SmPC (UK). <https://www.medicines.org.uk/emc/product/9748>
