# Safety case notes

Working safety log for the endometriosis-assessment software.

## Intended purpose

Decision-support questionnaire that records pain, GI, urinary, and fertility
history; calculates EHP-30 domain scores; records rASRM staging from
surgical reports; flags critical features; and produces a structured PDF.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device — the output
influences referral and management decisions but does not directly diagnose
or treat. Endometriosis diagnosis remains a clinical and surgical
responsibility.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Pain severity under-reported by patient (cultural normalization of period pain) | NRS prompts the patient to compare to childbirth, kidney stones, etc.; absolute thresholds (NRS ≥7) trigger flags regardless of stated coping |
| H2 | Bowel-endometriosis red flags missed | Dedicated questions for cyclical rectal bleeding, tenesmus, sub-occlusion symptoms; any positive triggers BSGE-centre referral suggestion |
| H3 | Ureteric obstruction unrecognized | Cyclical haematuria, loin pain, and reduced output questions feed into a "critical" flag |
| H4 | Confusion between rASRM stage and severity | Separate fields and clear labelling; severity band is presentational only and never overrides rASRM |
| H5 | EHP-30 scoring error | Scoring algorithm taken directly from Jones 2001; covered by unit tests |
| H6 | Fertility concern not raised | Duration-trying and age fields drive a NICE CG156-aligned flag; age ≥36 with > 6 months trying triggers early referral suggestion |
| H7 | Mental health impact missed | EHP-30 emotional well-being domain triggers a low-mood-screen recommendation if ≥ 60 |
| H8 | Adolescent patient inappropriately assessed | Form age check refuses < 16 and redirects to a specialist paediatric pathway |

## Verification artefacts

- `endo-grader.test.ts` — covers EHP-30 domain scoring, rASRM stage cut-offs,
  and severity-band logic
- `flagged-issues.ts` tests — coverage of critical features (bowel
  obstruction, ureteric obstruction, severe pain)
- Reference vignettes per stage and per critical-flag combination

## Outstanding work

- Annual review against current NICE NG73 and ESHRE 2022 versions
- Validation of severity-band thresholds against published cut-offs (the
  EHP-30 paper does not specify clinical cut-offs; current thresholds are
  presentational)
- Welsh-language version
- WCAG 2.2 AA accessibility audit
