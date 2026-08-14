# Oxford Hip Score (OHS) — scoring rules

The OHS is the validated 12-item patient-reported outcome measure for hip
osteoarthritis (Dawson J, Fitzpatrick R, Carr A, Murray D. *Questionnaire on
the perceptions of patients about total hip replacement.* J Bone Joint Surg
Br. 1996;78(2):185–190). Each item is scored 0 (worst) to 4 (best); the total
is the sum of the 12 items, 0–48, where 48 is the best possible outcome.

## The 12 items

| # | SQL column | Item concept |
| --- | --- | --- |
| 1 | `ohs_pain_severity` | Usual hip pain severity |
| 2 | `ohs_washing_and_drying` | Difficulty washing and drying yourself |
| 3 | `ohs_transport` | Difficulty getting in/out of a car, or using public transport |
| 4 | `ohs_dressing_socks` | Difficulty putting on socks or stockings |
| 5 | `ohs_shopping` | Ability to do the household shopping alone |
| 6 | `ohs_walking_pain` | Pain experienced walking |
| 7 | `ohs_limping` | Limping when walking |
| 8 | `ohs_kneeling` | Difficulty kneeling and getting up again |
| 9 | `ohs_night_pain` | How often hip pain troubles you in bed at night |
| 10 | `ohs_work_interference` | How much hip pain interferes with usual work |
| 11 | `ohs_giving_way` | How often the hip feels like it might give way |
| 12 | `ohs_stairs` | Ability to walk down a flight of stairs |

Rule ID: `R-OHS-TOTAL` (engine: `js/ohs-rules.js` / `src/lib/engine/ohs-rules.ts`,
function `scoreOhs`).

## Category banding (this form's operational convention)

Published secondary sources describe the OHS banding with minor variation.
This repository fixes the following four bands and documents them here so the
convention is explicit rather than an undocumented magic number:

| Band | OHS total |
| --- | --- |
| `severe` | 0–19 |
| `moderate` | 20–29 |
| `mild-to-moderate` | 30–39 |
| `satisfactory` | 40–48 |

Function: `ohsCategoryFromTotal(total)`.

## Surgical-candidacy rule IDs

Evaluated in this order — the first matching rule wins:

| Rule ID | Condition | Result |
| --- | --- | --- |
| `R-CANDIDACY-CONSERVATIVE-NOT-EXHAUSTED` | `conservativeMeasuresExhausted === 'no'` | `continue-conservative` |
| `R-CANDIDACY-NOT-INDICATED` | `ohsTotal >= 40` or `kellgrenLawrenceGrade <= 1` | `not-indicated` |
| `R-CANDIDACY-STRONG` | `ohsTotal <= 19` and `kellgrenLawrenceGrade >= 3` | `strong-candidate` |
| `R-CANDIDACY-CANDIDATE` | `ohsTotal <= 29` and `kellgrenLawrenceGrade >= 2` | `candidate` |
| `R-CANDIDACY-MDT-REVIEW` | none of the above | `mdt-review` (fallback) |

A `null` Kellgren and Lawrence grade never satisfies a `>=` threshold, so a
missing imaging grade routes to `mdt-review` rather than silently passing a
band gate.

## Kellgren and Lawrence radiographic grade

0 (none), 1 (doubtful), 2 (minimal), 3 (moderate), 4 (severe). (Kellgren JH,
Lawrence JS. *Radiological assessment of osteo-arthrosis.* Ann Rheum Dis.
1957;16(4):494–502.)

## Clinician override

The clinician may override `finalCandidacy` on step 15 with a mandatory
reason when it differs from `computedCandidacy`. Both values are stored in
`hip_replacement_surgery_evaluation_grade`. Safety flags (see
[`safety-case-notes.md`](./safety-case-notes.md)) are computed independently
and are never suppressed by the override.
