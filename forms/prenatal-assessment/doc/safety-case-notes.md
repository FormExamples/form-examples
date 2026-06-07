# Safety case notes

Working safety log for the prenatal-assessment software.

## Intended purpose

A booking-visit antenatal questionnaire that supports allocation of care
pathway and ongoing surveillance, aligned with NICE NG201.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Pre-eclampsia risk factors missed | Engine applies NICE NG133 high-risk and moderate-risk lists; prophylactic aspirin flag surfaced if criteria met |
| H2 | VTE risk under-scored | RCOG GTG 37a risk score implemented as separate calculator within the form; antenatal LMWH threshold flagged |
| H3 | GDM screening missed in high-BMI women | BMI ≥ 30 triggers GTT recommendation per NICE NG3 |
| H4 | Mental health risks under-detected | Whooley + GAD-2 used at booking; positive screen triggers EPDS/PHQ-9 and perinatal MH referral |
| H5 | Domestic abuse routine enquiry omitted | Implemented per NICE NG201 §1.4 as a non-skippable question with safe disclosure prompt |
| H6 | Reduced fetal movements protocol not surfaced | Patient-facing safety-net text and PDF include the RCOG GTG 47 advice |
| H7 | Multiple pregnancy default to midwife-led care | Twin/triplet entry sets consultant-led and signposts NICE NG137 |
| H8 | Confidentiality (domestic abuse, mental health) | Front-end build holds no PHI by default; back-end follows NHS DSPT controls |
| H9 | FGM safeguarding | FGM enquiry per NICE NG194; positive answer triggers safeguarding pathway with FGM-RIS reminder |
| H10 | Anaemia missed | FBC entry triggers iron-therapy flag at Hb < 110 g/L booking, < 105 g/L second trimester, per CKS |

## Verification artefacts

- `risk-grader.test.ts` — unit tests for the risk-band logic
- `risk-rules.ts` tests — coverage of every NG201, NG133, NG3, GTG 37a
  trigger
- Reference vignettes per band (uncomplicated nulliparous, previous severe
  pre-eclampsia, Type 1 diabetic, twin pregnancy)

## Outstanding work

- Annual review against current NICE NG201, NG133, NG3, NG137, NG194 and
  CG192 versions
- Review against MBRRACE-UK annual report recommendations
- Welsh-language version
- WCAG 2.2 AA accessibility audit
- Safeguarding-flow expert review
