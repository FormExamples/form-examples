# Safety case notes

Safety considerations for the haematology assessment form.

## Intended purpose

To record a structured haematology consultation, capture FBC, coagulation,
iron, haemoglobinopathy, and transfusion history, and to surface
abnormalities requiring specialist review or urgent action.

## Intended users

Haematology specialists, haematology specialist nurses, and primary-care
clinicians performing initial workup.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, software that surfaces test results and
recommends urgent referral is **Class IIa**.

## Hazard analysis

| Hazard | Mitigation |
| --- | --- |
| Reference intervals mis-applied across sex / pregnancy / ethnicity | Step 2 supports sex- and pregnancy-aware reference intervals; benign ethnic neutropenia flag |
| Blast cells on peripheral film not actioned | Step 4 dedicated field; affirmative blast result triggers immediate "same-day haematology" referral text |
| Iron-deficiency anaemia without underlying-cause investigation | Step 5 flags need for NG12 endoscopy referral in adults ≥ 60 y, men ≥ 50 y, or post-menopausal women |
| Neutropenic sepsis missed | Step 2 neutrophil count linked to fever capture; high-priority sepsis flag |
| Anticoagulant errors (wrong DOAC dose for renal function / weight) | Step 9 records eGFR and weight; not a prescribing tool but flags review |
| Transfusion alloimmunisation history not transmitted to laboratory | Step 8 specifies alloantibodies; output to FHIR includes Specimen and Observation |
| Jehovah's Witness or other patient preference for no blood products | Step 8 dedicated field; result page surfaces alternative-management pathways |
| Suspected acute leukaemia (blasts + pancytopenia) not flagged urgently | Composite severity engine flags **Severe** with same-day haematology referral text |

## Out of scope

- The form does **not** issue prescriptions for chemotherapy or
  anticoagulants; it records current therapy and recommends review.
- The form does **not** replace laboratory haematology film morphology
  reporting; it records the laboratory haematologist's interpretation.
- The form does **not** perform haematology genetic / cytogenetic
  interpretation; it records the result.

## Equity considerations

- Benign ethnic neutropenia (people of West African heritage) is captured
  with a dedicated field so that normal-variant neutrophil counts are not
  mis-classified.
- Sickle-cell trait carriage status is captured for risk-stratification
  in surgery, athletes, and altitude.

## Post-market surveillance

UK operators report misclassification or workflow incidents via MHRA
Yellow Card: <https://yellowcard.mhra.gov.uk/>. Transfusion incidents
must be reported to SHOT (<https://www.shotuk.org/>) and SABRE / MHRA.

## References

- MDCG 2019-11 Rev.1.
  <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- BSH guidelines. <https://b-s-h.org.uk/guidelines/>
- NICE NG24, NG158, NG12.
  <https://www.nice.org.uk/guidance>
- MHRA *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- SHOT. <https://www.shotuk.org/>
- WHO 2024 anaemia cutoffs.
  <https://www.who.int/publications/i/item/9789240088542>
