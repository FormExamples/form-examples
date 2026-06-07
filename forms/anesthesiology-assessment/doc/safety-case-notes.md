# Safety Case Notes

Notes for the clinical safety case (DCB 0129 manufacturer / DCB 0160
deployer) describing how the anaesthesiology assessment form mitigates
specific hazards.

## Regulatory framework

- DCB 0129 *Clinical Risk Management: its Application in the Manufacture of
  Health IT Systems* (NHS Digital). Index:
  https://digital.nhs.uk/services/clinical-safety/clinical-risk-management-standards
- DCB 0160 *Clinical Risk Management: its Application in the Deployment and
  Use of Health IT Systems*. Same index page.
- MDCG 2019-11 Rev.1 — Qualification and classification of software in
  EU MDR 2017/745 and IVDR 2017/746.
  https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en
- UK Medical Devices Regulations 2002 (as amended). Index:
  https://www.legislation.gov.uk/uksi/2002/618/contents
- UK MHRA *Software and AI as a Medical Device*. Programme index:
  https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device

## Classification position

Computing and recording ASA / Mallampati / RCRI / STOP-BANG as inputs to a
clinician decision is decision support, not autonomous decision-making. Under
MDCG 2019-11 the device is software intended to provide information used in
diagnosis and management, with the clinician as the actor of record. The
clinician override (final ASA grade with documented reason) is the key
control that keeps the device within decision-support classification.

## Hazards and mitigations

| Hazard | Mitigation in form |
| --- | --- |
| Mis-grading ASA leading to wrong anaesthetic plan | Structured per-system data capture; ASA computed plus mandatory clinician override with reason; both stored and printed |
| Failure to identify difficult airway | Mallampati capture is mandatory; thyromental distance, inter-incisor gap, neck movement collected; difficult-airway flag printed in red |
| Missed obstructive sleep apnoea | STOP-BANG mandatory; score ≥ 5 raises explicit OSA flag, recommendation for post-op continuous monitoring |
| Anticoagulant continuation through neuraxial block | Step 4 medication review surfaces anticoagulant class, last dose, INR; flag raised if neuraxial planned and timing not safe (per AAGBI guidance) |
| Fasting not confirmed | Step 10 records last food / drink times; flag raised if interval < threshold for planned anaesthesia |
| Anaphylaxis from known allergen | Step 5 mandatory; structured allergen list cross-checked against planned drugs (latex, antibiotics, NMBA, contrast) |
| Cardiac decompensation under anaesthesia | RCRI computed; ECG, echo EF, exercise tolerance collected; high-risk flag triggers consultant review |

## Audit and traceability

- Every clinician action is timestamped and attributed.
- Computed scores and final clinician-recorded grades are stored side by
  side; PDF report shows both.
- The composite-risk algorithm is deterministic and version-tagged.

## Data protection

- UK GDPR / Data Protection Act 2018 apply to all identifiable patient data.
- NHS Digital Data Security and Protection Toolkit.
- Patient-identifiable data does not leave the deployment boundary; the form
  emits FHIR R5 `Encounter`, `Observation`, and `RiskAssessment` resources
  for the local EHR.
