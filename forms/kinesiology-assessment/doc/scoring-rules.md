# FMS — Functional Movement Screen Scoring Rules

This form implements the **Functional Movement Screen (FMS)**, a 7-test
movement-quality screen developed by Cook, Burton and Hoogenboom (2006).
The FMS is widely used in sports medicine, athletic training, military
fitness, and physical therapy to identify movement asymmetries and
limitations associated with injury risk.

## Instrument structure

The FMS consists of 7 movement tests, each scored 0–3. The composite is
the sum (0–21).

| Test | Movement                       | Range |
| ---- | ------------------------------ | ----- |
| 1    | Deep squat                     | 0–3   |
| 2    | Hurdle step                    | 0–3   |
| 3    | In-line lunge                  | 0–3   |
| 4    | Shoulder mobility              | 0–3   |
| 5    | Active straight leg raise      | 0–3   |
| 6    | Trunk stability push-up        | 0–3   |
| 7    | Rotary stability               | 0–3   |

For tests 2–5 and 7 the scorer rates the left and right sides separately
and **takes the lower of the two**. Asymmetry between sides is recorded
even when both are passing.

## Individual test scoring

Universal scoring scale:

| Score | Meaning                                                          |
| ----- | ---------------------------------------------------------------- |
| 0     | Pain reported during the movement (regardless of quality)        |
| 1     | Cannot perform the movement, even with compensations             |
| 2     | Performs the movement with compensations or asymmetry            |
| 3     | Performs the movement correctly to standard, bilaterally         |

Pain on any clearing test scores 0 for the associated movement.

## Clearing tests

Three "clearing tests" check for pain and disqualify their parent test
if positive:

- **Shoulder clearing** — hand-to-opposite-shoulder reach. Pain disqualifies
  test 4 (shoulder mobility) and scores 0.
- **Spinal extension clearing** — press-up from prone. Pain disqualifies
  test 6 (trunk stability push-up).
- **Spinal flexion clearing** — quadruped rock-back. Pain disqualifies
  test 7 (rotary stability).

## Composite score interpretation

| Total | Band                       |
| ----- | -------------------------- |
| 18–21 | Low injury risk            |
| 15–17 | Moderate injury risk       |
|  0–14 | Increased injury risk      |

The 14/21 threshold is the cut-off introduced by Kiesel, Plisky and
Voight (2007) in a study of NFL players showing that scores at or below
14 were associated with increased risk of injury. The threshold has been
replicated in some populations (military recruits, firefighters) but
not consistently in all athletic populations (see review references).

## Asymmetry flag

Asymmetry between sides on tests 2–5 or 7 is recorded as an independent
flag. Some FMS practitioners weigh asymmetry as comparable in importance
to the composite score.

## Recommended output

The grading engine produces:

- `fmsTotal` — integer 0–21.
- `fmsBand` — `low-risk` / `moderate-risk` / `increased-risk`.
- Per-test scores.
- `asymmetryCount` — number of tests with left/right asymmetry.
- `painPresent` — boolean if any test or clearing test produced pain.
- Flagged issues — pain present, ≥1 score of 0, ≥3 scores of 1.

## Important limitations

- FMS is a **screening tool** for movement quality. A passing FMS does
  not guarantee freedom from injury; a failing FMS does not predict
  injury reliably in all populations.
- Validity for predicting injury is **mixed** in the literature. Some
  systematic reviews (e.g. Bonazza et al., 2017) report modest
  predictive validity in selected populations; others find limited
  predictive value across the broader athletic population.
- FMS does not replace a comprehensive sports physiotherapy or
  musculoskeletal examination.
- Pain (score 0) on any test requires referral for medical / physical
  therapy evaluation before continued training.
- Inter-rater reliability requires standardized training; videoed scoring
  improves consistency.
