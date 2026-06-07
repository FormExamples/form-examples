# Safety case notes

A working safety log for the contraception-assessment software. This is
intended as input to a formal safety case file built to BS EN 62366-1
(usability) and IEC 62304 (medical-device software lifecycle), not the safety
case file itself.

## Intended purpose

Decision-support questionnaire that produces UKMEC categories per method
based on patient history, displays flagged issues for clinician review, and
generates a structured PDF report.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa — software intended to drive or influence
clinical decisions but not directly diagnose or treat.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Missed migraine-with-aura history | ICHD-3-aligned aura screen; any positive response sets CHC initiation to UKMEC 4 with explicit clinician confirmation |
| H2 | Drug interaction with enzyme inducers undetected | Form medication list cross-checked against FSRH *Drug Interactions* guideline list |
| H3 | Inaccurate BP / BMI entry | Form refuses CHC recommendation without a BP reading dated within 12 months; BMI computed from height + weight rather than free text |
| H4 | Underreported VTE history | Separate questions for personal VTE, family VTE, surgical VTE, thrombophilia, oestrogen-related VTE |
| H5 | Pregnancy at assessment | Engine raises a "rule out pregnancy" flag when LMP > 28 days and no protection |
| H6 | Postpartum CHC initiation < 21 days | Engine excludes CHC entirely until 21 days postpartum and applies UKMEC 4 until 42 days for breastfeeding women |
| H7 | Breast cancer history not captured | Explicit question with current vs past distinction; current breast cancer sets all hormonal methods to UKMEC 4 |
| H8 | Over-reliance on tool by trainee clinician | UI banner declaring decision-support status; PDF footer "advisory only" |
| H9 | Confidentiality breach of sexual-health data | Front-end build holds no PHI by default; back-end follows NHS DSPT controls |

## Verification artefacts

- `ukmec-grader.test.ts` — unit tests for category assignment per condition
  and per method
- `flagged-issues.ts` tests — coverage of every category 3 and 4 trigger
- Reference vignettes per method (e.g. 38-year-old smoker requesting CHC,
  BMI 36 patient requesting CHC, postnatal day 30)

## Outstanding work

- Annual review against new edition of UKMEC and FSRH *Drug Interactions*
  guideline
- Cross-check against BNF interactions database
- Translation review for non-English speakers (current form English only)
- Accessibility audit against WCAG 2.2 AA
