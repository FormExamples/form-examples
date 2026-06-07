# Safety case notes

Working safety log for the gerontology-assessment software.

## Intended purpose

A structured CGA-style questionnaire that captures frailty (CFS), function,
cognition, mobility, nutrition, polypharmacy, mood, and continence, and
generates a flagged-issues list and onward-referral recommendation.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Delirium missed | Form embeds 4AT and triggers urgent medical review at ≥ 4; explicit instruction not to use CFS in acute presentation |
| H2 | CFS misapplied during acute illness | Form prompts the clinician to record baseline CFS (2 weeks pre-admission) rather than current state, per CFS guidance |
| H3 | Falls under-reported | Specific "any fall in last 12 months" question (yes/no) plus number of falls field |
| H4 | Anticholinergic burden not visible | Polypharmacy step lists each drug's anticholinergic score (using a published scale) and total burden |
| H5 | Beers/STOPP list out of date | Form references AGS 2023 Beers and STOPP/START v3 (2023); update task scheduled annually |
| H6 | Capacity not assessed | Form prompts the clinician to record decision-specific capacity per NICE NG108 |
| H7 | Suicidal ideation not actioned | GDS-15 question 4 ("Do you often feel helpless?") plus PHQ-9 item 9 prompt; positive triggers urgent MH pathway |
| H8 | Carer strain missed | Form has dedicated carer-strain question and signposts to Carers UK |
| H9 | Confidentiality of cognitive and mood data | Front-end build holds no PHI by default; back-end follows NHS DSPT controls |
| H10 | End-of-life misclassification (CFS 9 vs 8) | Form mirrors CFS v2.0 disambiguation: 9 = terminally ill but otherwise not frail; 8 = very severely frail and approaching end of life |

## Verification artefacts

- `cfs-grader.test.ts` — unit tests for CFS label assignment
- `rules.ts` tests — coverage of every published flag (4AT, MUST, GDS-15,
  Beers, STOPP, Timed Up & Go cut-offs)
- Reference vignettes per CFS level

## Outstanding work

- Annual review against AGS Beers, STOPP/START, BGS guidance
- Validation of the form's anticholinergic burden scoring choice (ACB
  vs ARS vs DBI)
- Welsh-language version
- WCAG 2.2 AA accessibility audit
- Carer-pathway expert review
