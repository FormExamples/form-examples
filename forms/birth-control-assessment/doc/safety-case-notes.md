# Safety case notes

This is a working safety log for the birth-control-assessment software,
intended as input to a formal safety case file built to BS EN 62366-1
(usability engineering) and IEC 62304 (medical-device software lifecycle).
It is not the safety case file itself.

## Intended purpose

A decision-support questionnaire that maps patient-reported risk factors to
UKMEC categories, presents a shortlist of suitable contraceptive methods, and
flags conditions requiring clinician review. The clinician retains decision
authority.

## Intended users

- UK general practice clinicians (GP, ANP, practice nurse with FSRH training)
- Integrated sexual health (ISH) clinic clinicians
- Patients completing a self-assessment prior to consultation

## Intended use environment

UK primary care or community sexual health clinic, on a clinician's
workstation or patient's personal device, prior to or during a consultation.

## Patient population

Adults assigned female at birth aged 16 to 55 (inclusive) seeking
contraceptive advice. Out of scope: patients under 16 (Fraser competence
required), peri-menopausal patients seeking HRT (see separate HRT form), and
patients with gender-affirming hormone therapy regimens.

## Risk classification

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device — drives or
influences a clinical decision but does not directly diagnose or treat.

## Foreseeable hazards (preliminary)

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Misclassification of migraine with aura as without aura, leading to CHC prescription in UKMEC 4 patient | Aura screening uses ICHD-3-aligned questions; any positive response triggers flagged issue with no recommendation |
| H2 | Missed VTE history (patient under-reports) | Form prompts for personal, family, surgical, and travel-related VTE history; recommends VTE risk reassessment annually |
| H3 | Drug interaction (enzyme inducer + CHC) not detected | Medication list cross-checked against FSRH drug-interactions list; flagged issue raised for any match |
| H4 | Blood pressure not measured before CHC prescription | Engine refuses to recommend CHC without a BP measurement dated within the last 12 months |
| H5 | Pregnancy at time of assessment | Engine flags if LMP > 28 days ago without protection; recommends pregnancy test before initiating any method |
| H6 | Postpartum CHC < 6 weeks | Engine sets UKMEC 4 for CHC if delivery date within last 42 days |
| H7 | Over-reliance on tool by trainee clinician | UI displays explicit "decision support — clinician must confirm" banner; PDF report records "advisory only" footer |
| H8 | Data leakage of sensitive sexual health data | No PHI persisted by default in the front-end build; back-end uses standard NHS DSPT controls |

## Verification artefacts

- `mec-grader.test.ts` — unit tests for category assignment per condition
- `flagged-issues.ts` tests — coverage of UKMEC 3 and 4 trigger conditions
- Manual end-to-end walkthroughs of three reference vignettes per method

## Open issues

- The Drug Interactions list in FSRH guidance is updated independently of the
  UKMEC document. The engine's interaction list must be reviewed annually
  against the current FSRH guideline edition.
- No automated cross-check against the BNF interaction database.
- LARC-fitting safety considerations (uterine perforation risk, expulsion)
  are not within the scope of this assessment form.
