# Safety case notes

Working safety log for the blood-donation-assessment software.

## Intended purpose

Donor-screening questionnaire that produces a Donor Selection Guidelines
(DSG)-aligned eligibility decision and a donor record for session staff.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device. The form
informs a donor-suitability decision; the session clinician is responsible
for the final decision and is required to review any flagged case.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Out-of-date DSG version | Form version tag links to the DSG edition implemented; revalidation task scheduled quarterly |
| H2 | Donor under-reports risk behaviour | IRA question set worded per FAIR recommendation; one-to-one private setting required |
| H3 | Travel deferral missed (vector-borne disease) | Country list pre-populated from DSG geographic matrix; engine flags any country with current advisory |
| H4 | Hb measurement error | Form requires two readings if first is borderline; HemoCue calibration cross-checked |
| H5 | Pregnancy deferral missed | Pregnancy status as discrete question with options including "could be pregnant"; defer if uncertain |
| H6 | Adverse donor reaction risk under-detected | Form prompts for prior vasovagal, low BMI in first-time donors, low-Hb history |
| H7 | Permanent deferral applied incorrectly | Permanent deferral codes always reviewed by session clinician before being recorded; reason text required |
| H8 | Donor distress at deferral (e.g. permanent on infection grounds) | Form provides scripted disclosure language, GP signposting, and confidential support contacts |
| H9 | Confidentiality of sexual / drug-use answers | Single-donor private setting required by UI banner; back-end follows NHS DSPT controls and BSQR record-keeping rules |
| H10 | Transfusion-transmitted infection risk under-screened | Form is one layer; mandatory laboratory testing of every donation is the second layer |

## Verification artefacts

- `donor-grader.test.ts` — unit tests for every Eligible / Temporary /
  Permanent decision code
- `rules.ts` tests — coverage of DSG permanent, temporary, and travel rule
  sets
- Reference vignettes per pathway

## Outstanding work

- Quarterly review against DSG updates and geographic-risk matrix changes
- Annual review against IRA wording (FAIR steering group updates)
- Welsh-language version
- WCAG 2.2 AA accessibility audit
- BSQR compliance review with NHSBT QA team
