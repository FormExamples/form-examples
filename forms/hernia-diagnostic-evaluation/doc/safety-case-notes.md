# Clinical safety case notes

Placeholders and working notes for the clinical-safety documentation this form
would need before deployment in an NHS setting. Nothing here is a completed
safety case; it records what must be produced and the current position on each
point.

## Standards

| Standard | Applies to | Status |
| --- | --- | --- |
| DCB0129 — Clinical Risk Management: its Application in the Manufacture of Health IT Systems | the manufacturer of this software | **not started** — needs a named Clinical Safety Officer, a Clinical Risk Management Plan, a Hazard Log, and a Clinical Safety Case Report |
| DCB0160 — Clinical Risk Management: its Application in the Deployment and Use of Health IT Systems | the deploying organization | **not applicable until deployment** — the deploying trust or health board owns this |
| DTAC — Digital Technology Assessment Criteria | NHS procurement | not started |
| DSPT — Data Security and Protection Toolkit | the hosting organization | not applicable — this form ships no hosting |

## Regulatory classification

Under EU MDR Rule 11 and the UK MHRA guidance on software as a medical device,
software that provides information used to take decisions with diagnosis or
therapeutic purposes is normally **Class IIa**. This form computes a hernia
classification and an urgency band that inform an emergency-referral decision,
so a Class IIa position should be assumed unless a regulatory assessment
concludes otherwise; the safety-critical red-flag path in particular would
attract close regulatory scrutiny.

Mitigating design decisions already in place:

- The output is labelled decision support and states that it does not
  diagnose and does not replace the clinical judgement of the examining
  clinician.
- The urgency band is computed red-flag-first: a single positive red flag
  cannot be diluted or averaged away by a reassuring examination elsewhere in
  the form (H-01).
- A clinician must sign off on step 14 before the report is final; the form
  cannot emit an unsigned final report.
- The clinician may override the computed urgency band, with a mandatory
  reason. Both the computed and final values are stored and printed, so the
  override is auditable rather than silent (H-02).

## Preliminary hazard list

| ID | Hazard | Cause | Effect | Initial mitigation |
| --- | --- | --- | --- | --- |
| H-01 | Override used to suppress a safety flag or an emergency urgency band | clinician lowers the urgency band | flagged emergency hidden from the referral summary | the override changes the urgency band only; safety flags are computed independently and always printed; `computedUrgency` and `finalUrgency` are both stored and both rendered |
| H-02 | Red flag recorded but not acted on | clinician completes step 8 but does not act before signing off | delayed emergency referral for a strangulating hernia | step 8 is styled as a visually distinct warning panel; step 14 shows the computed urgency band prominently and requires a documented override reason to move away from `emergency` |
| H-03 | Reducibility mis-recorded | ambiguous examination, time pressure | incarcerated hernia scored as reducible; urgency understated | step 7 offers three explicit mutually-clarifying sub-questions (reduces spontaneously / with manual pressure / does not reduce) alongside the single reducibility-status field, so the clinician's own wording checks the coded answer |
| H-04 | Size grade mis-banded | clinician bands EHS grade inconsistently between assessments | inconsistent urgency for equivalent presentations | `mass_size_as_cm` is recorded separately as a raw measurement on step 6, so a reviewer can audit the size grade against the measured value even though banding is a clinician judgement, not auto-derived (see `doc/ehs-classification.md`) |
| H-05 | Recurrent hernia not flagged | prior repair recorded without a site | `recurrent-hernia` flag does not fire, referral does not note added surgical complexity | the flag requires both `priorHerniaRepair = yes` and a non-empty `priorHerniaRepairSite`; a blank site is a data-quality gap the form should prompt for, not silently treat as "not recurrent" |
| H-06 | Paediatric patient examined and referred on adult pathways | age not checked | delayed access to a paediatric surgical service; examination technique mismatch | `paediatric` flag fires below age 16, computed from `patient.birthDate` and `clinician.assessmentDate` rather than from the clock, so it is reproducible from the stored record |
| H-07 | Draft lost | browser cleared, session ended | consultation repeated, patient burden, delayed referral for a possibly urgent hernia | draft autosaved to LocalStorage under a versioned key; export to JSON available at any step |
| H-08 | `capacity-concern` flag category defined in schema but not yet wired to a wizard field | no dedicated capacity/consent step in this form's 14-step wizard (unlike the sibling `dietic-assessment` form, which has one) | the flag can never fire even when clinically relevant | tracked as an open item below; the SQL `CHECK` constraint on `hernia_diagnostic_evaluation_grade_flag.category` reserves the category for fleet-wide flag-taxonomy consistency and for a future capacity-assessment step |

Each hazard needs an initial and residual risk rating (severity × likelihood)
in a formal Hazard Log before this list can be treated as a safety artefact.

## Data protection

The form is client-side by default: the HTML front-end persists only to
LocalStorage on the user's own device, and nothing is transmitted unless a
back-end is configured. A deployment that enables the Loco back-end processes
special-category health data and needs a Data Protection Impact Assessment, a
lawful basis under UK GDPR Article 6 and Article 9, and a retention schedule.

## Open questions

- Should `capacity-concern` (H-08) be wired to an explicit field, and if so,
  where in the 14-step wizard does it best sit without duplicating the
  reducibility and red-flag steps' focus?
- Does local policy require photographic documentation of the bulge, and if
  so, how should that be represented in a form whose data model is currently
  entirely structured fields and free text?
- Is a distinct paediatric hernia examination pathway (analogous to the
  paediatric redirect in `dietic-assessment`) needed as a sibling form, or is
  the `paediatric` flag's redirect message sufficient?
