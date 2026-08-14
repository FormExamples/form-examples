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
gates a surgical-listing decision. A Class IIa position should be assumed
unless a regulatory assessment concludes otherwise.

Mitigating design decisions already in place:

- The Oxford Hip Score is reproduced unaltered against the published
  instrument (Dawson et al. 1996); the engine invents nothing beyond the
  documented category-banding convention (see `ohs-scoring.md`).
- The output is labelled decision support and states that the form does not
  replace clinical judgement.
- **Step 15 requires an explicit clinician sign-off.** The engine's computed
  candidacy is never the final word; the clinician records a final candidacy
  and an electronic signature.
- The clinician override is auditable: computed and final candidacy are both
  stored and printed, and an override that differs from the computed value
  requires a reason.
- Safety flags are computed independently of the candidacy recommendation and
  are never filtered by the override.

## Preliminary hazard list

| ID | Hazard | Cause | Effect | Initial mitigation |
| --- | --- | --- | --- | --- |
| H-01 | Patient listed for surgery despite conservative measures never having been tried | `conservativeMeasuresExhausted` left blank or wrongly recorded | inappropriate surgical exposure ahead of lower-risk treatment | `no` forces `continue-conservative` unconditionally and raises a non-suppressible flag; the rule is checked first, ahead of every other input |
| H-02 | Missing Kellgren and Lawrence grade silently treated as passing a threshold | imaging not yet reported when the form is completed | a patient without radiographic confirmation reaches `strong-candidate` or `candidate` | a `null` grade never satisfies a `>=` comparison; the case routes to `mdt-review` instead |
| H-03 | High-BMI surgical risk missed | BMI not flagged separately from the candidacy recommendation | avoidable perioperative complication (wound healing, infection, dislocation) | dedicated flag at BMI ≥ 40, independent of candidacy and the override |
| H-04 | Surgery planned with incomplete pre-operative work-up | one or more baseline tests (FBC, renal function, clotting/INR, ECG, MRSA screen, urinalysis) not done | delayed or unsafe listing | dedicated flag naming exactly which tests are outstanding |
| H-05 | Leg-length discrepancy not factored into templating | discrepancy recorded but not surfaced to the surgical team | post-operative leg-length inequality and patient dissatisfaction | dedicated flag above 2cm, independent of candidacy |
| H-06 | Override used to hide a hazard | clinician sets a candidacy the engine would not compute | flagged hazard invisible downstream | the override changes the candidacy only; flags are computed independently and always printed, and the computed candidacy is printed beside the final one |
| H-07 | Paediatric patient scored with an adult instrument | age not checked | invalid Oxford Hip Score result | `paediatric` flag below 16 years, and the report states the score is invalid |
| H-08 | This form's output conflated with an ASA-grading pre-operative assessment | a deployment wires this form's `finalCandidacy` into an anaesthetic-fitness decision | inappropriate anaesthetic risk assessment | documented in `AGENTS.md` §"What this form is not"; this form does not compute or claim to compute an ASA grade |
| H-09 | Draft lost mid-evaluation | browser cleared, portal session ended | patient burden, repeated appointment | draft autosaved to LocalStorage under a versioned key; JSON export available at any step |
| H-10 | Duplicate, contradictory data across pathway forms | this form and an ASA-grading sibling both completed for the same patient | conflicting records | documented in `plan.md` §Risks; a deployment should populate one from the other rather than asking twice |

Each hazard needs an initial and residual risk rating (severity × likelihood)
in a formal Hazard Log before this list can be treated as a safety artefact.

## Data protection

The form is client-side by default: the HTML front-end persists only to
LocalStorage on the user's own device, and nothing is transmitted unless a
back-end is configured. A deployment enabling the Loco back-end processes
special-category health data and needs a Data Protection Impact Assessment, a
lawful basis under UK GDPR Article 6 and Article 9, and a retention schedule.

## Instrument licensing

The Oxford Hip Score requires a commercial licence from Oxford University
Innovation for large-scale digital deployment. See
[`ohs-scoring.md`](./ohs-scoring.md) §Instrument licensing. Resolve this
before any commercial deployment.

## Open questions

- Is the four-band OHS category split (0–19 / 20–29 / 30–39 / 40–48) the
  banding the deploying trust already uses, or does local policy use a
  different split?
- Should `not-indicated` at `kellgrenLawrenceGrade <= 1` apply even when the
  Oxford Hip Score is very low (severe patient-reported symptoms with
  radiographically mild disease) — is `mdt-review` a safer default for that
  combination?
- Does the deploying organisation want the OHS licence obtained centrally, or
  per site?
