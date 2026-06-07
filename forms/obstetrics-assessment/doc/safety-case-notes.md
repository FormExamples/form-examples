# Safety case notes

Working safety log for the obstetrics-assessment software.

## Intended purpose

Antenatal risk-stratification questionnaire that supports allocation of
care pathway (midwife-led, joint, consultant-led) and surveillance
schedule, aligned with NICE NG201.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa — produces a care-pathway recommendation
but does not deliver care. Care decisions remain with the named midwife and
consultant.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Missed pre-eclampsia risk factor combination | Engine applies the NICE NG133 high-risk and moderate-risk lists explicitly; prophylactic aspirin recommendation surfaced if criteria met |
| H2 | VTE risk under-scored | RCOG GTG 37a risk score implemented as a separate calculator within the form; antenatal LMWH threshold flagged |
| H3 | GDM screening missed in high-BMI women | BMI ≥ 30 triggers GTT recommendation per NICE NG3 |
| H4 | Mental health risks under-detected | Whooley + GAD-2 used at booking; positive screen triggers perinatal mental health referral; previous severe mental illness flagged for perinatal team |
| H5 | Domestic abuse routine enquiry omitted | NG201 §1.4 implemented as a non-skippable question with safe disclosure prompt |
| H6 | Reduced fetal movements protocol not surfaced | Form's patient-facing safety-net text and PDF include the RCOG GTG 47 advice |
| H7 | Multiple pregnancy default to midwife-led care | Twin / triplet entry immediately sets consultant-led and signposts NICE NG137 |
| H8 | Previous CS not flagged for mode-of-birth discussion | Any prior CS triggers VBAC/elective CS discussion flag for the 36-week appointment |
| H9 | Patient confidentiality (domestic abuse, mental health) | Front-end build holds no PHI by default; back-end follows NHS DSPT controls; sensitive answers shown to clinician only |
| H10 | Female genital mutilation safeguarding | FGM enquiry included per NICE NG194; positive answer triggers safeguarding pathway with FGM Risk Indication System (FGM-RIS) reminder |

## Verification artefacts

- `antenatal-grader.test.ts` — unit tests for risk-band logic and
  pathway recommendation
- `rules.ts` tests — coverage of every NG201, NG133, NG3, and GTG 37a
  trigger
- Reference vignettes per pathway (uncomplicated nulliparous; previous CS;
  Type 1 diabetic; previous severe pre-eclampsia; twin pregnancy)

## Outstanding work

- Annual review against current NICE NG201, NG133, NG3, NG137, NG194 and
  CG192 versions
- Review against MBRRACE-UK annual report recommendations
- Welsh-language version
- WCAG 2.2 AA accessibility audit
- Safeguarding-flow expert review
