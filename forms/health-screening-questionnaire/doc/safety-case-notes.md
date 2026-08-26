# Clinical safety case notes

Placeholders and working notes for the clinical-safety documentation this form
would need before deployment in an occupational-health, primary-care, or
fitness-industry setting. Nothing here is a completed safety case; it records
what must be produced and the current position on each point.

## Standards

| Standard | Applies to | Status |
| --- | --- | --- |
| DCB0129 — Clinical Risk Management: its Application in the Manufacture of Health IT Systems | the manufacturer of this software | **not started** — needs a named Clinical Safety Officer, a Clinical Risk Management Plan, a Hazard Log, and a Clinical Safety Case Report |
| DCB0160 — Clinical Risk Management: its Application in the Deployment and Use of Health IT Systems | the deploying organization | **not applicable until deployment** — the deploying employer, gym, or practice owns this |
| DTAC — Digital Technology Assessment Criteria | NHS procurement, where a primary-care or perioperative-referral deployment is commissioned by the NHS | not started |
| DSPT — Data Security and Protection Toolkit | the hosting organization | not applicable — this form ships no hosting |

## Regulatory classification

Under EU MDR Rule 11 and the UK MHRA guidance on software as a medical device,
software that provides information used to take decisions with diagnosis or
therapeutic purposes is normally **Class IIa**. This form computes a PAR-Q+
clearance status and an AUDIT-C band, both validated screening instruments,
and a composite risk band that can recommend urgent medical referral, so a
Class IIa position should be assumed unless a regulatory assessment concludes
otherwise. Deployments limited to the physical-activity-readiness /
gym-and-fitness use case, where PAR-Q+ is traditionally self-administered
paper-based decision support rather than a medical device, may qualify for a
lower classification — this needs a formal regulatory assessment per
deployment context, not an assumption baked into the software.

Mitigating design decisions already in place:

- The output is labelled decision support and states that it does not
  diagnose and does not replace the clinical judgement of a qualified
  professional.
- Every score is a faithful implementation of a published, validated
  instrument (PAR-Q+, AUDIT-C). The engine invents no thresholds.
- The `refer-urgently` band and the `urgent-cardiac-symptom` flag are worded
  to direct same-day medical attention, not routine follow-up, whenever
  unexplained chest pain or fainting is reported.
- The assessor may override the computed risk band, with a mandatory reason.
  Both the computed and final values are stored and printed, so the override
  is auditable rather than silent.
- Safety flags are computed independently of the risk band and are never
  suppressed by an override — see H-05 below.

## Preliminary hazard list

| ID | Hazard | Cause | Effect | Initial mitigation |
| --- | --- | --- | --- | --- |
| H-01 | Urgent cardiac symptom under-triaged | assessor or respondent misreads the chest-pain / fainting items | same-day cardiac event missed | `symptom_unexplained_chest_pain` and `symptom_dizzy_spells_or_fainting` alone force the `refer-urgently` band and the high-priority `urgent-cardiac-symptom` flag, independent of every other answer |
| H-02 | PAR-Q+ positive item not followed up | any PAR-Q+ item `yes`, but the follow-up is only a flag, not a full supplementary questionnaire | undetected condition-specific risk (deliberate scope simplification, see `spec/index.md` §2) | the report text explicitly directs the person to a qualified exercise professional or GP for the full PAR-Q+ follow-up before starting |
| H-03 | Non-clinical assessor misinterprets a clinical term | assessor is a gym instructor or HR officer, not a clinician | miscoded answer, wrong band | wizard uses plain-language question text; PAR-Q+ and AUDIT-C item wording is reproduced verbatim from the published instruments |
| H-04 | Unexplained weight loss dismissed as a lifestyle finding | weight loss recorded but no red-flag symptom present | delayed cancer or other serious diagnosis | `unexplained-weight-loss` flag (medium) fires independently and always renders on the report, regardless of the computed band |
| H-05 | Override used to suppress a safety flag | assessor lowers the risk band | flagged hazard hidden | the override changes the risk band only; safety flags are computed independently and always printed |
| H-06 | Paediatric respondent scored with an adult instrument | age not checked | invalid PAR-Q+/AUDIT-C score, wrong pathway | `paediatric` flag fires below age 16 and the report directs the user to a paediatric-specific pathway instead of a score |
| H-07 | Alcohol under-reporting | social-desirability bias in self-report | AUDIT-C band underestimates risk | AUDIT-C is administered verbatim per the validated instrument; no attempt is made to adjust for reporting bias, which is a known instrument limitation to be stated in any deployment guidance |
| H-08 | Draft lost | browser cleared, session ended | screening repeated, respondent burden | draft autosaved to LocalStorage under a versioned key; export to JSON available at any step |

Each hazard needs an initial and residual risk rating (severity × likelihood)
in a formal Hazard Log before this list can be treated as a safety artefact.

## Data protection

The form is client-side by default: the HTML front-end persists only to
LocalStorage on the user's own device, and nothing is transmitted unless a
back-end is configured. A deployment that enables the Loco back-end processes
special-category health data (and, for occupational screens, employment data)
and needs a Data Protection Impact Assessment, a lawful basis under UK GDPR
Article 6 and Article 9, and a retention schedule appropriate to the
occupational-health, primary-care, or fitness-industry context.

## Open questions

- Should the occupational-pre-placement pathway record a distinct legal basis
  and retention period from the routine-public-health / physical-activity
  pathways, given the different data controllers involved (employer vs.
  fitness provider vs. GP practice)?
- Does a gym/fitness deployment need a simplified consent flow that does not
  imply clinical registration, to avoid overstating the assessor's
  qualifications?
- Is there a need for a distinct paediatric sibling form, or is the
  redirect-only `paediatric` flag sufficient for this monorepo's scope?
