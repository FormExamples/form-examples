# Oxford Knee Score (OKS) scoring rules

The Oxford Knee Score is a 12-item, patient-reported outcome measure completed
for the affected knee (Dawson, Fitzpatrick, Murray & Carr, *J Bone Joint Surg
Br* 1998). Each item is scored 0 (worst) to 4 (best) by the clinician from the
patient's answers during the consultation; the total ranges 0–48, where **48
is the best possible outcome**.

## The 12 items

| # | Item | SQL column | TypeScript field | 0 (worst) | 4 (best) |
| --- | --- | --- | --- | --- | --- |
| 1 | Usual knee pain severity | `oks_pain_severity` | `oksPainSeverity` | Severe, always | None |
| 2 | Washing and drying difficulty | `oks_washing_and_drying` | `oksWashingAndDrying` | Impossible | No difficulty |
| 3 | Getting in/out of a car or public transport | `oks_transport` | `oksTransport` | Impossible | No difficulty |
| 4 | Walking distance before severe pain | `oks_walking_distance` | `oksWalkingDistance` | < 5 minutes / housebound | No pain, unlimited |
| 5 | Pain sitting or lying | `oks_pain_sitting_or_lying` | `oksPainSittingOrLying` | Severe, always | None |
| 6 | Limping when walking | `oks_limping` | `oksLimping` | Severe, most of the time | Never / rarely |
| 7 | Kneeling difficulty | `oks_kneeling` | `oksKneeling` | Impossible | No difficulty |
| 8 | Night pain frequency | `oks_night_pain_frequency` | `oksNightPainFrequency` | Every night | Never |
| 9 | Pain interfering with usual work | `oks_pain_interfering_with_work` | `oksPainInterferingWithWork` | All the time | Not at all |
| 10 | Feeling the knee might "give way" | `oks_giving_way` | `oksGivingWay` | All the time | Never |
| 11 | Ability to do household shopping alone | `oks_shopping` | `oksShopping` | Impossible | No difficulty |
| 12 | Ability to walk down a flight of stairs | `oks_stairs` | `oksStairs` | Impossible | No difficulty |

Rule `R-OKS-TOTAL` fires with the total and its category on every grading run.
An unanswered item is treated as 0 for the running total (rule
`R-OKS-INCOMPLETE` also fires when fewer than 12 of the 12 items have been
answered, so the report can flag the total as partial).

## Category bands (this form's operational convention)

| Rule ID | Band | OKS total |
| --- | --- | --- |
| — | `severe` | 0–19 |
| — | `moderate` | 20–29 |
| — | `mild-to-moderate` | 30–39 |
| — | `satisfactory` | 40–48 |

These bands are this form's operational convention (see `spec/index.md` §3).
The published OKS literature commonly describes similar four-band groupings;
confirm against the specific source paper in use at a given deployment if a
stricter published convention is required.

## Kellgren-Lawrence radiographic grade

Scored 0–4 per compartment (medial, lateral, patellofemoral) from the
weight-bearing X-ray (Kellgren & Lawrence, *Ann Rheum Dis* 1957):

| Grade | Description |
| --- | --- |
| 0 | No radiographic features of osteoarthritis |
| 1 | Doubtful joint-space narrowing, possible osteophytic lipping |
| 2 | Definite osteophytes, possible joint-space narrowing |
| 3 | Moderate osteophytes, definite joint-space narrowing, some sclerosis |
| 4 | Large osteophytes, marked joint-space narrowing, severe sclerosis |

The engine computes `maxKellgrenLawrenceGrade` as the highest grade recorded
across the three compartments; a compartment left unanswered does not count
against this maximum.

## Surgical candidacy — rule `R-CANDIDACY`

Evaluated in order; the first matching rule wins.

| Order | Candidacy | Predicate |
| --- | --- | --- |
| 1 | `strong-candidate` | `oksTotal <= 19` **and** `maxKellgrenLawrenceGrade >= 3` **and** conservative measures exhausted |
| 2 | `candidate` | `oksTotal <= 29` **and** conservative measures exhausted **and** `maxKellgrenLawrenceGrade >= 2` |
| 3 | `continue-conservative` | conservative measures **not** exhausted (regardless of OKS or Kellgren-Lawrence) |
| 4 | `not-indicated` | `oksTotal >= 40` **or** `maxKellgrenLawrenceGrade <= 1` (or unrecorded) in every compartment |
| 5 | `mdt-review` | fallback — none of the above match (a mixed or borderline picture) |

Worked example of the fallback: OKS 35 (mild-to-moderate, so rules 1 and 2 do
not match because `oksTotal > 29`), Kellgren-Lawrence grade 2 (so rule 4 does
not match because `maxKellgrenLawrenceGrade > 1`), conservative measures
exhausted (so rule 3 does not match) → `mdt-review`.

## Safety flags

See `spec/index.md` §8 for the full table. Flag IDs: `F-CONSERVATIVE-TREATMENT-NOT-EXHAUSTED-001`,
`F-HIGH-BMI-SURGICAL-RISK-001`, `F-PRE-OP-BLOODS-INCOMPLETE-001`,
`F-FIXED-FLEXION-DEFORMITY-001`, `F-BILATERAL-SYMPTOMATIC-001`,
`F-PAEDIATRIC-001`. Flags are computed independently of the clinician's
candidacy override and are never suppressed.
