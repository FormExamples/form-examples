# Safety case notes

Working safety log for the fertility-assessment software.

## Intended purpose

A questionnaire that captures reproductive and lifestyle history, accepts
investigation results, applies NICE CG156-aligned referral triggers, and
produces a structured PDF referral letter.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device — produces a
referral recommendation but does not diagnose or treat infertility.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Age-related fertility decline not communicated | Form explicitly displays the CG156 trigger of age ≥ 36 with ≥ 6 months trying and prompts an "early referral" flag |
| H2 | Anovulation missed where cycles described as "regular but long" | Cycle length entry validated against 21–35 day reference; outside that range triggers anovulation flag |
| H3 | Out-of-date semen reference values | Form uses WHO 6th edition (2021) reference values; comments in source code reference the WHO publication |
| H4 | Recurrent miscarriage routed as standard subfertility | Form has explicit recurrent miscarriage question; positive answer triggers RCOG Green-top 17 referral pathway |
| H5 | Lifestyle modifiable factors overlooked | BMI, smoking, alcohol, caffeine, drugs all surfaced as explicit flags in the recommendation report |
| H6 | Patient distress | Form opens with a wellbeing acknowledgement and signposts to the HFEA patient information pages |
| H7 | Equity: NHS-funded IVF criteria vary by ICB | Form records the eligibility-related fields but explicitly does not make a funding decision |
| H8 | Same-sex / single parent pathway not handled | Form supports both-partner and single-applicant routes; partner-factor section can be omitted; pathway statement signposts the HFEA |
| H9 | Loss of sensitive reproductive data | Front-end build holds no PHI by default; back-end follows NHS DSPT controls |

## Verification artefacts

- `fertility-grader.test.ts` — unit tests for the concern-band logic
- `rules.ts` tests — coverage of every CG156-aligned trigger
- Reference vignettes per band (regular-cycle 32-year-old at 8 months;
  34-year-old with anovulation; 38-year-old with 7 months trying; 42-year-old
  with low AMH)

## Outstanding work

- Annual review against the current edition of CG156 and the WHO andrology
  manual
- Validation of AMH/AFC thresholds against CG156 specific recommendations
- Welsh-language version
- WCAG 2.2 AA accessibility audit
