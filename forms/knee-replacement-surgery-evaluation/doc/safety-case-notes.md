# Clinical safety case notes

Placeholders and working notes for the clinical-safety documentation this form
would need before NHS deployment. Nothing here is a completed safety case; it
records what must be produced and the current position on each point.

## Standards

| Standard | Applies to | Status |
| --- | --- | --- |
| DCB0129 — Clinical Risk Management in the Manufacture of Health IT Systems | the manufacturer | **not started** — needs a named Clinical Safety Officer, a Clinical Risk Management Plan, a Hazard Log, and a Clinical Safety Case Report |
| DCB0160 — Clinical Risk Management in the Deployment and Use of Health IT Systems | the deploying organisation | not applicable until deployment |
| DTAC — Digital Technology Assessment Criteria | NHS procurement | not started |
| DSPT — Data Security and Protection Toolkit | the hosting organisation | not applicable — this form ships no hosting |

## Regulatory classification

Under EU MDR Rule 11 and the UK MHRA guidance on software as a medical device,
software providing information used to take decisions with diagnostic or
therapeutic purposes is normally **Class IIa**.

This form sits closer to that line than a pure calculator, because its output
gates a surgical decision: a `strong-candidate` or `candidate` computed
recommendation is an input to whether a patient is listed for knee-replacement
surgery. A Class IIa position should be assumed unless a regulatory assessment
concludes otherwise.

Mitigating design decisions already in place:

- The scoring is a faithful implementation of the published Oxford Knee Score
  and Kellgren-Lawrence grading. The engine invents nothing beyond the
  documented, form-operational category bands (see `doc/oks-scoring.md`).
- The output is labelled decision support and states that the form does not
  decide whether surgery proceeds.
- **Step 15 requires an explicit human sign-off.** The engine's computed
  candidacy is never the final word; the clinician records a final
  recommendation on step 14 and signs off on step 15.
- The clinician override is auditable: computed and final candidacy are both
  stored (`computed_candidacy` / `final_candidacy`) and printed, and an
  override that differs from the computed value requires a reason
  (`override_reason`).
- Safety flags are computed independently of the candidacy override and are
  never filtered by it.

## Preliminary hazard list

| ID | Hazard | Cause | Effect | Initial mitigation |
| --- | --- | --- | --- | --- |
| H-01 | Surgery recommended before conservative options are tried | step 10 left incomplete or optimistic | avoidable surgery, unnecessary risk exposure | `conservative_measures_exhausted` directly gates the `strong-candidate`/`candidate` computed rules; `F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001` fires independently whenever a surgical recommendation is made without it |
| H-02 | Wrong Oxford Knee Score item recorded (item order or 0-vs-4 direction reversed) | data-entry error, unclear item wording in the UI | wrong candidacy in either direction | each item's UI presents both anchor descriptions (worst and best) inline, per `doc/oks-scoring.md`; the report echoes every item score alongside its label |
| H-03 | Kellgren-Lawrence grade left blank on all compartments | imaging step skipped | `not-indicated` incorrectly reached because the engine treats "no compartment graded" the same as "no compartment above grade 1" | the report and dashboard flag an evaluation with `maxKellgrenLawrenceGrade: null` distinctly from one with a genuinely low grade |
| H-04 | Pre-operative bloods checklist incomplete but surgery proceeds anyway | step 12 not revisited after the recommendation changes | infection, bleeding, or cardiac complication not screened for before listing | `F-PRE-OP-BLOODS-INCOMPLETE-001` fires whenever a surgical recommendation is made with any checklist item outstanding, independent of the override |
| H-05 | High BMI surgical risk not acted on | BMI not recalculated after a weight change | wound-healing complication, prosthesis-loosening risk | `F-HIGH-BMI-SURGICAL-RISK-001` fires at BMI 40 and above, independent of the override |
| H-06 | Fixed flexion deformity affecting surgical planning missed | examination not completed or degrees not recorded | intra-operative surprise, poor post-operative alignment | `F-FIXED-FLEXION-DEFORMITY-001` fires above 15 degrees, independent of the override |
| H-07 | Override used to hide a hazard | clinician changes the candidacy recommendation | flagged hazard invisible downstream | the override changes the candidacy only; flags are computed independently and always printed, and the computed candidacy is printed beside the final one |
| H-08 | Bilateral disease staged as if unilateral | `knee_side` recorded incorrectly | one symptomatic knee left untreated, or a staging decision missed | `F-BILATERAL-SYMPTOMATIC-001` fires whenever `knee_side` is `bilateral` |
| H-09 | Paediatric patient scored with an adult instrument | age not checked | invalid Oxford Knee Score result | `F-PAEDIATRIC-001` flag below 16 years, and the report directs the user to a paediatric orthopaedic pathway |
| H-10 | This form and an ASA-grading pre-operative sibling both completed with contradictory general-health data | step 11 here is deliberately high-level, not a substitute for a formal pre-op assessment | conflicting or duplicated records | documented in `spec/index.md` §2 "What this form is not"; a deployment should treat this form's step 11 as a screen, not a source of truth for anaesthetic fitness |
| H-11 | Draft lost mid-assessment | browser cleared, portal session ended | patient burden, repeated appointment | draft autosaved to LocalStorage under a versioned key; JSON export available at any step |
| H-12 | Wrong side operated on | `knee_side` not carried through to the theatre list | wrong-site surgery — a "never event" | out of scope for this form (it does not integrate with theatre-list or WHO Surgical Safety Checklist systems); the target-list-date and responsible-surgeon fields on step 14 are administrative only and do not substitute for local site-marking policy |

Each hazard needs an initial and residual risk rating (severity × likelihood)
in a full Hazard Log before this form could be used outside a supervised
evaluation. This table is a starting point for that log, not the log itself.

## Data protection

- Patient-identifiable data (name, date of birth, NHS number) is collected.
  A DPIA (Data Protection Impact Assessment) would be required before any
  live deployment.
- No data leaves the browser/back-end pair described in this repository; there
  is no third-party analytics or telemetry.

## Not yet addressed

- Formal risk rating (severity × likelihood) per hazard.
- A named Clinical Safety Officer and sign-off.
- Usability evaluation with representative orthopaedic surgeons and extended-
  scope physiotherapists.
- Interoperability testing of the FHIR R5 Bundle export against a receiving
  system.
