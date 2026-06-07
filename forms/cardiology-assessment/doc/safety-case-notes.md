# Safety case notes

Safety considerations for the cardiology assessment form, framed for the
UK Medical Devices Regulations 2002 and MDCG 2019-11 Rev.1 software
classification.

## Intended purpose

To provide a structured record of subjective angina and heart-failure
functional status (CCS class, NYHA class) and to highlight findings that
warrant onward referral. The form is **not** a diagnostic device; it does
not compute mortality risk and does not replace clinician judgement.

## Intended users

Cardiology clinicians (consultants, registrars, nurse specialists) and
primary-care clinicians performing structured cardiac review.

## Intended use environment

Outpatient clinic, GP surgery, or community heart-failure service with a
clinician operator. Not validated for unsupervised patient self-use.

## Risk classification

Per MDCG 2019-11 Rev.1 Rule 11, software providing information for clinical
decisions is **Class IIa** if used for diagnosis or therapy. Because this
form records observations rather than providing decision recommendations,
it sits at the boundary of Class I / IIa. Operators must treat the form as
an aide-memoire — clinical decisions remain the operator's responsibility.

## Hazard analysis (key items)

| Hazard | Mitigation |
| --- | --- |
| Misclassified CCS or NYHA class (operator misreading scale) | In-form descriptive prompts for each class; reviewer dashboard surfaces transcribed values for QA |
| Missed red-flag symptoms (e.g. crescendo angina, rest pain) | Step 2 prompts for rest-pain and recent-progression items; form output highlights CCS IV |
| Omission of BNP / NT-proBNP for suspected HF | Step 7 "Diagnostic Results" makes BNP a recorded field with NICE NG106 thresholds in the helper text |
| Out-of-date medication list leading to drug interaction | Allergy and medication steps are mandatory before completing the form |
| Loss of data in transit | FHIR R5 Bundle uses HL7 standard; HTTPS transport required by deployment guidance |

## Out-of-scope

- The form does **not** compute the GRACE 2.0 ACS risk score, TIMI risk
  score, Killip class, or coronary stenosis severity scores. These belong
  to dedicated calculators.
- The form does **not** prescribe medications; it records current therapy.
- The form does **not** replace 12-lead ECG, echocardiogram, or troponin
  measurement; it records their results.

## Post-market surveillance

Per MHRA *Software and AI as a Medical Device* guidance, operators should
report adverse events (including misclassification incidents) via the
Yellow Card scheme at <https://yellowcard.mhra.gov.uk/>.

## References

- MDCG 2019-11 Rev.1 — Guidance on Qualification and Classification of
  Software in Regulation (EU) 2017/745 — MDR and Regulation (EU) 2017/746 —
  IVDR. <https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en>
- UK Medical Devices Regulations 2002.
  <https://www.legislation.gov.uk/uksi/2002/618/contents>
- MHRA. *Software and AI as a Medical Device.*
  <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
