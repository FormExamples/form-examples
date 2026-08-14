# Safety Case Notes — Orthopaedic Assessment

## Regulatory framework

- DCB 0129 / DCB 0160.
  https://digital.nhs.uk/services/clinical-safety/clinical-risk-management-standards
- MDCG 2019-11 Rev.1.
  https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en
- UK Medical Devices Regulations 2002.
  https://www.legislation.gov.uk/uksi/2002/618/contents
- UK MHRA *Software and AI as a Medical Device*.
  https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device
- ISO/IEC/IEEE 26514:2022.

## Device classification position

This form computes the DASH score from clinician-entered patient responses.
DASH is a validated PROM with a deterministic scoring formula and a
standard interpretation. Under MDCG 2019-11 the device is software
intended to provide information used in diagnosis or management.

## Hazards and mitigations

| Hazard | Mitigation |
| --- | --- |
| Invalid DASH score from too many missing items | Form enforces 27/30 completion threshold for a numerical score; otherwise reports "incomplete" |
| Mis-scoring DASH due to manual arithmetic | Server-side scoring per the IWH manual; computed score stored alongside raw responses |
| Missed red-flag pathology (e.g., suspected septic arthritis, tumour) | Step 2 chief-complaint and step 3 pain assessment include red-flag prompts (night pain, systemic symptoms, recent fever, unintentional weight loss) that fire urgent-referral flags |
| Inappropriate use as sole determinant of surgery | Form output is decision support; clinician must record the final treatment plan in step 9; PDF shows both |
| Wrong-side surgery preparation | Step 2 captures laterality; mismatches with imaging report in step 8 raise a flag |
| Anticoagulant continuation through surgery | Step 9 records anticoagulant status; flag if surgical plan present |
| Patient confidentiality on shared PROM links | Patient-facing links are tokenized; access role-restricted |

## Patient-facing considerations

DASH is typically self-completed. This form supports:

- Direct patient entry via tokenized link
- Clinician-assisted entry where the patient lacks the manual dexterity
  or literacy to complete unassisted
- Each mode is recorded as part of the response metadata for audit

## Information governance

- UK GDPR / DPA 2018.
- NHS DSPT compliance for storage and access.
- Patient-identifiable data does not leave the deployment boundary.

## DASH licensing

DASH is free for clinical use. The Institute for Work & Health requires
that the licence-text reference is preserved on patient-facing renderings:

- https://dash.iwh.on.ca/about-dash

This form's PDF report includes the IWH attribution required by the
licence.
