# Clinical references

Authoritative guidance underpinning the four-axis grading engine.

## Appropriateness (RCPath National Minimum Retesting Intervals + indication match)

The 1–9 appropriateness scale is **anchored**, not a single validated
instrument — no published 1–9 score exists for blood tests. It combines two
inputs:

1. **Retesting-interval appropriateness** — was a requested test ordered inside
   its RCPath / ACB *National Minimum Retesting Interval* (MRI)? Repeating a
   stable test inside its MRI is low-value and lowers the score.
2. **Indication match** — does a recognised clinical indication justify the
   selected panels (e.g. ferritin/iron for anaemia; lipid profile for
   cardiovascular-risk; INR for anticoagulation-monitoring)?

Bands: usually-appropriate (7–9), may-be-appropriate (4–6),
usually-not-appropriate (1–3).

## Pre-analytical / specimen safety

| Band | Meaning |
| --- | --- |
| ok | Fasting met (or not required); specimen collected; correct handling |
| caution | Fasting status unknown, or specimen not yet collected |
| reject-risk | Fasting-required test collected non-fasting; mislabelling / wrong-tube risk |

Selected pre-analytical facts:

- **HbA1c** — non-fasting; EDTA (purple) tube. Unsuitable in pregnancy, children,
  and conditions affecting red-cell turnover.
- **Lipid profile** — NICE: fasting **not** required; report non-HDL cholesterol.
- **Glucose (fasting)** — requires an 8-hour fast.
- **Coagulation screen / INR** — citrate (blue) tube; correct fill volume matters.

A `fasting_required` test collected `non-fasting` (or with `unknown` fasting
status) sets the `fasting_violation` flag and pushes the band toward reject-risk.

## Triage tiers

| Tier | Target | Triggers |
| --- | --- | --- |
| Stat | within ~1 hour | stat urgency; troponin, d-dimer, blood culture, crossmatch in an acute context |
| Urgent | same day / 24–72 h | urgent urgency; clinically time-sensitive monitoring |
| Routine | standard booking | routine monitoring, screening, scheduled follow-up |

## Completeness

Percentage of mandatory fields present, with **clinical details** and **primary
indication** weighted highest. Missing clinical details or indication each fire a
dedicated flag.

## Sources

- RCPath / ACB / IBMS *National Minimum Retesting Intervals in Pathology*
  (report G147, March 2021).
- ACB *Minimum Retesting Intervals for Clinical Biochemistry* recommendations.
- NICE guidance on lipid measurement (non-fasting sample acceptable).
- WHO *Use of HbA1c in the diagnosis of diabetes mellitus*.
- WHO *Guidelines on drawing blood: best practices in phlebotomy* (pre-analytical
  handling; blood-borne-virus precautions).
