# Urgency-band rules

The urgency band is computed **red-flag-first**, not by summing a numeric
score: a single positive finding on step 8 forces `emergency` regardless of
every other input. This mirrors the pattern in
[`perioperative-optimization`](../../perioperative-optimization)'s
`insufficient-time` domain forcing `defer-surgery`
(`front-end-with-svelte/src/lib/engine/gating.ts` /
`flagged-issues.ts` in that form).

## Evaluation order

`classification-rules.ts`'s `computeUrgency()` evaluates branches in this
strict order, returning as soon as one matches:

| Order | Rule ID | Predicate | Urgency |
| --- | --- | --- | --- |
| 1 | `R-URGENCY-EMERGENCY-RED-FLAG` | any of the seven step-8 red flags is `yes` | `emergency` |
| 2 | `R-URGENCY-URGENT-REDUCIBILITY` | `reducibility.reducibilityStatus` is `incarcerated` or `irreducible`, and no red flag fired | `urgent` |
| 3 | `R-URGENCY-SOON` | `reducible`, and (`painScore0To10 > 4` or `ehsSizeGrade === '3'`) | `soon` |
| 4 | *(default)* | none of the above | `routine` |

Branch 1 is checked unconditionally before branches 2–3, so a red flag always
wins even when reducibility looks reassuring or has not been recorded — for
example an incarcerated hernia with a positive red flag is `emergency`, not
`urgent`; the reducibility branch is only reached when the red-flag screen is
entirely clear.

## Red flags (step 8)

| Field | Rule ID | Clinical meaning |
| --- | --- | --- |
| `redFlagSeverePain` | `R-RED-FLAG-RED-FLAG-SEVERE-PAIN` | Pain out of proportion to examination findings — suggests strangulation. |
| `redFlagVomiting` | `R-RED-FLAG-RED-FLAG-VOMITING` | Suggests bowel obstruction. |
| `redFlagFever` | `R-RED-FLAG-RED-FLAG-FEVER` | Suggests strangulation or bowel ischaemia. |
| `redFlagAbsoluteConstipation` | `R-RED-FLAG-RED-FLAG-ABSOLUTE-CONSTIPATION` | No passage of flatus — suggests complete bowel obstruction. |
| `redFlagErythemaOrDiscolouration` | `R-RED-FLAG-RED-FLAG-ERYTHEMA-OR-DISCOLOURATION` | Skin changes over the hernia — suggests strangulation. |
| `redFlagPreviouslyReducibleNowIrreducible` | `R-RED-FLAG-RED-FLAG-PREVIOUSLY-REDUCIBLE-NOW-IRREDUCIBLE` | Classic sign of new incarceration. |
| `redFlagTachycardia` | `R-RED-FLAG-RED-FLAG-TACHYCARDIA` | Systemic sign of strangulation or sepsis. |

Any single positive answer sets `anyRedFlag = true`.

## Why red-flag-first rather than max-grade

The dietetic and perioperative-optimization sibling forms both use a
max-grade algorithm across several weighted instruments. A hernia diagnostic
evaluation has no equivalent numeric instrument to grade against — the
literature (HerniaSurge, EHS, NICE CKS) frames urgency as a binary safety
screen (does this need emergency assessment today?) layered on top of a
separate, non-urgent classification exercise. Modelling it as "any positive
red flag wins" keeps the safety-critical branch simple enough to audit at a
glance, rather than burying it inside a weighted sum where a moderate finding
could theoretically outweigh a red flag through arithmetic.

## Clinician override

The clinician may set `summary.overrideUrgency` on step 14 to move the
**final** urgency band away from the computed value, with a mandatory
`summary.overrideReason`. The override never changes `computedUrgency`, and it
never suppresses safety flags (see `doc/safety-case-notes.md` hazard H-01) —
both the computed and the overridden value are stored and printed, so an
override that quietens an emergency is visible in the audit trail rather than
hidden.
