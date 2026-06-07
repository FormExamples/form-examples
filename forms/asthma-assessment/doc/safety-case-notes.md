# Safety case notes

## Intended use

A structured-data capture form for an asthma annual review or follow-up
visit. It computes the validated ACT total and assigns a control category;
it does not replace clinician judgement, spirometry, or specialist review.

## Intended user

GP, asthma specialist nurse, respiratory physician, or respiratory pharmacist
acting within their normal scope of practice. The patient-facing route is
suitable for self-completion **prior to** the clinical encounter, but the
output must be reviewed by a clinician before any treatment change.

## Risk classification (MDCG 2019-11 Rev.1)

- **Class:** Class IIa medical device software (Rule 11), because the output
  drives treatment-step decisions that have foreseeable adverse outcomes if
  wrong (under-treatment increases NRAD-style asthma death risk; over-treatment
  exposes the patient to ICS side effects).
- The grading and flagged-issue rules are explicit, deterministic, and visible
  to the clinician; the final prescribing decision rests with the clinician.

## Foreseeable misuse

| Misuse | Mitigation |
| --- | --- |
| Self-completed ACT used to drive treatment without clinician review | Hard "clinician sign-off" requirement on Step 9 |
| Stale ACT recall (>4 weeks ago) | Mandatory "date of completion" timestamp |
| Missing inhaler technique check | Hard flag in summary if last check date >12 months |
| Missing personalised asthma action plan (PAAP) | Hard flag if no PAAP on file (NRAD criterion) |

## Regulatory framework

- EU MDR 2017/745 — Rule 11 software.
- UK Medical Devices Regulations 2002, MHRA registration.
- MHRA *Software and AI as a medical device*, 2022.
- ISO 14971:2019 risk management.
- IEC 62304:2006+A1:2015 software life cycle.
- ISO/IEC/IEEE 26514:2022.

## Clinical evidence base

- NICE/BTS/SIGN NG245 (2024) *Asthma: diagnosis, monitoring and chronic asthma
  management*. <https://www.nice.org.uk/guidance/ng245>
- Global Initiative for Asthma (GINA) 2024 report.
  <https://ginasthma.org/2024-report/>
- Nathan RA et al. *J Allergy Clin Immunol* 2004;113:59-65 — ACT development.
- Royal College of Physicians. *Why asthma still kills* (NRAD), 2014.

## Adverse-event reporting

Any unexpected behaviour of the form — particularly one that may have masked
a NRAD-criterion (e.g. recurrent oral steroid use, prior ITU admission, ≥3
SABA inhalers/year) — must be reported via:

- MHRA Yellow Card scheme: <https://yellowcard.mhra.gov.uk/>
- Internal medical-error-report workflow.

## See also

- [act-scoring-rules.md](act-scoring-rules.md)
- [clinical-guideline-alignment.md](clinical-guideline-alignment.md)
- [assessment-protocol.md](assessment-protocol.md)
- [references.md](references.md)
