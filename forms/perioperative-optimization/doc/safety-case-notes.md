# Clinical safety case notes

Placeholders and working notes for the clinical-safety documentation this form
would need before NHS deployment. Nothing here is a completed safety case; it
records what must be produced and the current position on each point.

## Standards

| Standard | Applies to | Status |
| --- | --- | --- |
| DCB0129 — Clinical Risk Management in the Manufacture of Health IT Systems | the manufacturer | **not started** — needs a named Clinical Safety Officer, a Clinical Risk Management Plan, a Hazard Log, and a Clinical Safety Case Report |
| DCB0160 — Clinical Risk Management in the Deployment and Use of Health IT Systems | the deploying organization | not applicable until deployment |
| DTAC — Digital Technology Assessment Criteria | NHS procurement | not started |
| DSPT — Data Security and Protection Toolkit | the hosting organization | not applicable — this form ships no hosting |

## Regulatory classification

Under EU MDR Rule 11 and the UK MHRA guidance on software as a medical device,
software providing information used to take decisions with diagnostic or
therapeutic purposes is normally **Class IIa**.

This form sits closer to that line than a pure calculator, because its output
gates a surgical decision: a `defer-surgery` band is an input to whether an
operation goes ahead on a given date. A Class IIa position should be assumed
unless a regulatory assessment concludes otherwise.

Mitigating design decisions already in place:

- Every threshold is a faithful implementation of published guidance (CPOC,
  NICE, WHO, the instrument source papers). The engine invents nothing.
- The output is labelled decision support and states that the form does not
  decide whether surgery proceeds.
- **Step 16 requires an explicit human gate decision.** The engine's readiness
  band is never the final word; a clinician must select `proceed`,
  `proceed-with-prehabilitation`, `defer-and-optimize`,
  `accept-unoptimized-risk`, `mdt-review`, or `cancel`, and sign.
- The clinician override is auditable: computed and final bands are both stored
  and printed, and an override that differs from the computed band requires a
  reason.
- Safety flags are computed independently of the readiness band and are never
  filtered by the override.

## Preliminary hazard list

| ID | Hazard | Cause | Effect | Initial mitigation |
| --- | --- | --- | --- | --- |
| H-01 | Surgery proceeds believing the patient is optimized when an intervention had no time to work | `insufficient-time` treated as advisory | avoidable postoperative complication | `insufficient-time` forces `defer-surgery`, raises a non-suppressible flag, and step 16 requires an explicit gate decision naming the accepted risk |
| H-02 | Wrong `weeksToSurgery` from a mistyped date | data-entry error | wrong domain statuses in either direction | both dates are shown alongside the computed weeks in the live panel and on the report; a negative value is displayed rather than hidden |
| H-03 | Anaemia domain cleared on haemoglobin alone | ferritin and transferrin saturation not entered | iron deficiency missed; transfusion risk stands | the domain triggers on haemoglobin **or** iron studies independently; a missing iron panel does not clear the domain |
| H-04 | SGLT2 inhibitor not held | plan never agreed | euglycaemic diabetic ketoacidosis, potentially fatal and easily missed on glucose alone | dedicated field, dedicated rule, high-priority flag firing whenever the drug is in use without an agreed plan |
| H-05 | GLP-1 agonist aspiration risk missed | standard fasting assumed adequate | aspiration on induction | flag fires whenever the drug is in use, regardless of any plan, so the anaesthetic team sees it on the day |
| H-06 | Anticoagulant gap mismanaged | no agreed plan, or bridging applied by default | bleeding or thrombosis | dedicated rule and flag; per-drug hold fields in `patient_medication` rather than a single free-text note |
| H-07 | Override used to hide a hazard | clinician lowers the readiness band | flagged hazard invisible downstream | the override changes the band only; flags are computed independently and always printed, and the computed band is printed beside the final one |
| H-08 | Deferral advised when delay is the greater harm | engine applied without clinical context to oncological or rapidly deteriorating cases | harm from delay | the band is advisory; `accept-unoptimized-risk` is a first-class gate decision, and the form never states that surgery must not proceed |
| H-09 | Paediatric patient scored with adult instruments | age not checked | invalid MUST and Clinical Frailty Scale results | `paediatric` flag below 16 years, and the report directs the user to a paediatric pathway |
| H-10 | Duplicate, contradictory data across pathway forms | this form and an ASA-grading sibling both completed | conflicting records | documented in `plan.md` §Risks; a deployment should populate one from the other rather than asking twice |
| H-11 | Draft lost mid-assessment | browser cleared, portal session ended | patient burden, repeated appointment | draft autosaved to LocalStorage under a versioned key; JSON export available at any step |
| H-12 | Lead times wrong for local policy | trust policy differs from the shipped defaults | systematically wrong gating | lead times live in one `DOMAIN_DEFINITIONS` table, documented in `doc/optimization-domains.md`, and flagged in `plan.md` as expected to be tuned per deployment |

Each hazard needs an initial and residual risk rating (severity × likelihood) in
a formal Hazard Log before this list can be treated as a safety artefact.

## Data protection

The form is client-side by default: the HTML front-end persists only to
LocalStorage on the user's own device, and nothing is transmitted unless a
back-end is configured. A deployment enabling the Loco back-end processes
special-category health data and needs a Data Protection Impact Assessment, a
lawful basis under UK GDPR Article 6 and Article 9, and a retention schedule.

An online-portal deployment (the MyPreOp pattern, where the patient completes
the form at home) adds identity-verification and safeguarding considerations
that a clinic-completed form does not have. Neither is addressed here.

## Instrument licensing

STOP-BANG and the Clinical Frailty Scale are free for non-commercial use but
require a licence for commercial distribution. See
[`optimization-domains.md`](./optimization-domains.md) §Licensing. Resolve this
before any commercial deployment.

## Open questions

- Are the shipped lead times acceptable to the deploying trust, particularly the
  twelve-week HbA1c figure, which will mark most short-notice lists
  `insufficient-time`?
- Should the anaemia lead time switch automatically to four weeks when the
  intravenous route is available locally, rather than on the recorded route?
- Does the deploying organization want `defer-surgery` to be visible to booking
  staff, or only to clinicians? The dashboard currently shows it to anyone with
  access.
- Is a patient-facing variant needed for the online-portal pattern, with plain
  language and no clinician-only fields?
