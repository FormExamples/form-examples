# Clinical safety case notes

Placeholders and working notes for the clinical-safety documentation this form
would need before deployment in an NHS setting. Nothing here is a completed
safety case; it records what must be produced and the current position on each
point.

## Standards

| Standard | Applies to | Status |
| --- | --- | --- |
| DCB0129 — Clinical Risk Management: its Application in the Manufacture of Health IT Systems | the manufacturer of this software | **not started** — needs a named Clinical Safety Officer, a Clinical Risk Management Plan, a Hazard Log, and a Clinical Safety Case Report |
| DCB0160 — Clinical Risk Management: its Application in the Deployment and Use of Health IT Systems | the deploying organisation | **not applicable until deployment** — the deploying trust or health board owns this |
| DTAC — Digital Technology Assessment Criteria | NHS procurement | not started |
| DSPT — Data Security and Protection Toolkit | the hosting organisation | not applicable — this form ships no hosting |

## Regulatory classification

Under EU MDR Rule 11 and the UK MHRA guidance on software as a medical device,
software that provides information used to take decisions with diagnosis or
therapeutic purposes is normally **Class IIa**. This form computes validated
screening scores (MUST, NRS-2002, SARC-F) and a malnutrition diagnosis (GLIM)
that inform a nutrition care plan, so a Class IIa position should be assumed
unless a regulatory assessment concludes otherwise.

Mitigating design decisions already in place:

- The output is labelled decision support and states that it does not diagnose
  and does not replace the clinical judgement of a registered dietitian.
- Every score is a faithful implementation of a published, validated
  instrument. The engine invents no thresholds.
- A registered dietitian must sign off on step 16 before the report is final;
  the form cannot emit an unsigned final report.
- The dietitian may override the computed risk category, with a mandatory
  reason. Both the computed and final values are stored and printed, so the
  override is auditable rather than silent.

## Preliminary hazard list

| ID | Hazard | Cause | Effect | Initial mitigation |
| --- | --- | --- | --- | --- |
| H-01 | MUST score computed from a stale or mistyped weight | data-entry error | risk category too low; malnourished patient not referred | weight, height, and BMI shown together with the computed band; BMI auto-computed and read-only; out-of-range values rejected by `CHECK` constraints |
| H-02 | Weight declined, score silently omitted | patient declines to be weighed | no score produced; patient falls through the screen | `declined` is a first-class measurement method; MUAC fallback estimates the BMI component; the report states the score is estimated |
| H-03 | Refeeding risk missed | electrolytes not yet available at the time of assessment | feeding started unsafely | refeeding criteria evaluated on BMI, weight loss, and intake days alone; a missing electrolyte panel raises the flag rather than clearing it |
| H-04 | Dysphagia not escalated | dysphagia recorded but no speech-and-language-therapy referral | aspiration pneumonia | `dysphagia-aspiration-risk` flag fires at high priority whenever dysphagia is recorded without an SLT assessment |
| H-05 | Allergy not carried into the care plan | allergy captured on step 10 but plan authored on step 16 | anaphylaxis | recorded allergies are rendered on the step-16 summary panel and printed on the report; anaphylaxis history raises a high-priority flag |
| H-06 | Paediatric patient scored with an adult tool | age not checked | invalid score, wrong pathway | `paediatric` flag fires below age 16 and the report directs the user to a paediatric-specific tool |
| H-07 | Override used to suppress a safety flag | dietitian lowers the risk category | flagged hazard hidden | the override changes the risk category only; safety flags are computed independently and always printed |
| H-08 | Draft lost | browser cleared, session ended | consultation repeated, patient burden | draft autosaved to LocalStorage under a versioned key; export to JSON available at any step |

Each hazard needs an initial and residual risk rating (severity × likelihood)
in a formal Hazard Log before this list can be treated as a safety artefact.

## Data protection

The form is client-side by default: the HTML front-end persists only to
LocalStorage on the user's own device, and nothing is transmitted unless a
back-end is configured. A deployment that enables the Loco back-end processes
special-category health data and needs a Data Protection Impact Assessment, a
lawful basis under UK GDPR Article 6 and Article 9, and a retention schedule.

## Open questions

- Which energy and protein requirement equation is local policy — Henry,
  Schofield, or a kcal/kg rule of thumb? The form records the equation used
  rather than choosing one.
- Does the deploying organisation require the MUST tool to be reproduced
  verbatim, including the BAPEN flowchart imagery, for the score to be
  accepted?
- Is a paediatric sibling form (STAMP or PYMS) needed, or is redirect-only
  sufficient?
