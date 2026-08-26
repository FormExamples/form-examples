# Safety case notes

Working safety log for the pediatric-assessment software.

## Intended purpose

A child/adolescent screening questionnaire that supports preventive
care visits and triage decisions. It is not an acute care decision tool
and does not replace NICE NG143/NG51 acute clinical assessment.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Missed sepsis in an unwell child | Form's first question for acute presentations applies NICE NG51 paediatric sepsis screen and exits to "ED now" if positive; the form explicitly is not used as the sole tool for unwell children |
| H2 | Growth faltering not detected | UK-WHO chart logic flags below 0.4th centile, two-space drop, or head circumference outside 0.4th–99.6th |
| H3 | Developmental delay missed because parent under-reports | Open "what worries you?" prompt + objective milestone checklist; either route triggers review |
| H4 | Immunization status incorrectly assumed up-to-date | Schedule compared against UKHSA Green Book complete schedule; missing doses listed explicitly |
| H5 | Safeguarding indicators missed | NICE NG76 and CG89 prompts surfaced; disclosure routed to safeguarding lead; named professional must confirm action |
| H6 | Weight-based medication errors | Form prompts for weight at any medication entry; dosing not performed by the form |
| H7 | Audiology / SaLT referral delay | Concerns about hearing or speech route to dedicated referral suggestion |
| H8 | Looked-after children pathway missed | Question for LAC status routes to NICE NG174 pathway |
| H9 | Gillick / Fraser competence for adolescent | Form prompts the clinician to record competence determination explicitly for any consent-relevant action in 12-15 year-olds |
| H10 | Confidentiality (mental health, safeguarding) | Front-end build holds no PHI by default; back-end follows NHS DSPT controls |

## Verification artefacts

- `dev-grader.test.ts` — unit tests for outcome logic
- `dev-rules.ts` tests — coverage of every HCP, NG143, NG51, and Green
  Book trigger
- Reference vignettes (well 12-month-old, missed 1-year immunizations,
  growth faltering 9-month-old, febrile 18-month-old with amber features,
  adolescent with HEEADSSS concerns)

## Outstanding work

- Annual review against current UK-WHO charts and Green Book schedule
- Annual review against MBRRACE-UK perinatal report and Child Death
  Overview Panel themes
- Welsh-language version
- WCAG 2.2 AA accessibility audit
- Safeguarding-flow expert review
