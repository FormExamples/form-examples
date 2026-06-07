# Safety case notes

Working safety log for the gynecology-assessment software.

## Intended purpose

A symptom-led intake questionnaire that captures gynaecological history,
flags NICE NG12 suspected-cancer features, and produces a structured PDF
report supporting referral decisions.

## Risk class

Per MDCG 2019-11 Rev.1: Class IIa software-as-medical-device — produces a
referral recommendation but does not diagnose.

## Foreseeable hazards

| ID | Hazard | Mitigation |
| -- | ------ | ---------- |
| H1 | Postmenopausal bleeding misclassified as withdrawal bleed on HRT | The form has separate questions for "currently on HRT?" and "bleeding pattern on HRT"; any unscheduled bleed on HRT triggers a referral flag |
| H2 | Missed ovarian-cancer features | NICE NG12-aligned ovarian symptom cluster (early satiety, bloating > 12 days/month, urinary frequency, abdominal distension in women 50+) flagged with explicit CA125 recommendation |
| H3 | Persistent intermenstrual bleeding in 45+ overlooked | Dedicated question for IMB duration; ≥ 4 weeks in 45+ triggers urgent referral |
| H4 | Vulval cancer missed | Vulval symptom questions include lump, persistent itch, pain, ulcer, colour change; any positive triggers urgent referral |
| H5 | HMB impact under-reported | NG88 impact question framed as quality-of-life impact rather than volume estimation |
| H6 | Pregnancy not excluded before NSAIDs/tranexamic acid recommended | Pregnancy-status question gates HMB recommendations; if unsure, pregnancy test prompted |
| H7 | Under-16 patient inappropriately assessed | Form age check redirects to paediatric/safeguarding pathway |
| H8 | Sexual coercion or domestic abuse missed | The form includes safeguarding signposting at the sexual-health step; not a diagnostic instrument but provides resources |
| H9 | Loss of sensitive gynaecology data | Front-end build holds no PHI by default; back-end follows NHS DSPT controls |

## Verification artefacts

- `symptom-grader.test.ts` — unit tests for the band classification and red
  flag logic
- `flagged-issues.ts` tests — coverage of every NG12 red-flag pathway
- Reference vignettes per pathway

## Outstanding work

- Annual review against current NICE NG12, NG88, NG23, NG123 versions
- Welsh-language version
- WCAG 2.2 AA accessibility audit
- Safeguarding-flow expert review
