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
therapeutic purposes is normally **Class IIa**. This form computes a
validated lens-grading instrument (LOCS III) and this form's own operational
severity-band and surgical-candidacy simplifications that inform a referral
decision, so a Class IIa position should be assumed unless a regulatory
assessment concludes otherwise.

Mitigating design decisions already in place:

- The output is labelled decision support and states that it does not
  diagnose and does not replace the clinical judgement of an optometrist or
  ophthalmologist.
- The LOCS III subscores are recorded exactly as read by the clinician
  against the standard photographs; the engine invents no grading criteria.
  The severity-band and surgical-candidacy thresholds derived from those
  subscores are explicitly documented as this form's own operational
  simplification, not part of the LOCS III publication.
- A clinician must sign off on step 15 before the report is final; the form
  cannot emit an unsigned final report.
- The clinician may override the computed surgical-candidacy recommendation,
  with a mandatory reason. Both the computed and final values are stored and
  printed, so the override is auditable rather than silent.

## Preliminary hazard list

| ID | Hazard | Cause | Effect | Initial mitigation |
| --- | --- | --- | --- | --- |
| H-01 | LOCS III subscore mistyped or transposed between eyes | data-entry error | wrong eye graded severe/mild, wrong surgical candidacy | each subscore is entered against a clearly labelled right/left column; out-of-range values rejected by `CHECK` constraints (0.1–6.9 / 0.1–5.9) |
| H-02 | Competing pathology missed because the cataract obscured the fundus view | dense cataract prevents examination, dilated exam skipped | glaucoma, AMD, or diabetic retinopathy progresses undetected before surgery | `view-obscured-fundus-not-assessed` flag fires whenever the view is obscured and no dilated exam was performed |
| H-03 | Raised intraocular pressure overlooked | glaucoma screen not prioritised alongside cataract assessment | undiagnosed glaucoma, irreversible visual field loss | `raised-iop` flag fires above 21 mmHg in either eye, independent of the cataract grading |
| H-04 | Rapid, atypical cataract progression attributed to normal ageing | duration not asked or not checked against the grade | underlying cause (steroid, trauma, uveitis, diabetes) missed | `rapid-progression` flag fires when symptom duration is under 3 months with a severe LOCS III grade |
| H-05 | Surgery listed without biometry | urgency to refer skips the planning step | wrong or unavailable IOL power at the time of surgery, cancelled operating list | `biometry-incomplete-for-surgical-planning` flag fires whenever a surgical referral is recommended without biometry recorded |
| H-06 | Paediatric patient assessed with an adult-validated instrument and pathway | age not checked | invalid grading, wrong referral pathway, delayed paediatric ophthalmology input | `paediatric` flag fires below age 16 and the report directs the user to a paediatric ophthalmology pathway; the flag also forces the computed recommendation to `urgent-referral` |
| H-07 | Override used to suppress a safety flag | clinician lowers the surgical-candidacy recommendation | flagged hazard hidden from the referral pathway | the override changes the final surgical-candidacy recommendation only; safety flags are computed independently and always printed, and always force `urgent-referral` regardless of the override |
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

- Should the standard LOCS III reference photographs be embedded in the UI
  (subject to licence) so the clinician grades in-context, or is the numeric
  entry alone sufficient given clinicians already grade at the slit lamp?
- Is a formal IOL power calculation formula (SRK/T, Barrett Universal II,
  Hoffer Q) needed, or does this form record only the site's own calculated
  result as free text/numeric, deferring the calculation itself to dedicated
  biometry software?
- Does local policy require the surgical-candidacy thresholds (LogMAR 0.30 /
  0.48) to be configurable per commissioning area, since "6/12 driving
  standard" style thresholds vary by context (e.g. DVLA group 2 licences use
  a different acuity standard)?
