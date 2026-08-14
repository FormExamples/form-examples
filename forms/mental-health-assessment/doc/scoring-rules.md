# PHQ-9 + GAD-7 — Scoring Rules

This form implements two complementary self-report screeners:

- **PHQ-9** — Patient Health Questionnaire-9 (Kroenke, Spitzer & Williams,
  2001). 9-item depression severity measure derived from the DSM-IV
  depression criteria.
- **GAD-7** — Generalized Anxiety Disorder 7-item scale (Spitzer, Kroenke,
  Williams & Löwe, 2006).

Both instruments are in the public domain; their use is permitted free of
charge and without permission from the developers.

## PHQ-9 scoring

Each of the 9 items asks "Over the last 2 weeks, how often have you been
bothered by..." and is scored 0–3:

| Code | Anchor                       |
| ---- | ---------------------------- |
| 0    | Not at all                   |
| 1    | Several days                 |
| 2    | More than half the days      |
| 3    | Nearly every day             |

PHQ-9 items map to DSM-5 major depressive disorder criteria:

| Item | Content (abbreviated)                                  | DSM-5 criterion |
| ---- | ------------------------------------------------------ | --------------- |
| 1    | Little interest or pleasure                            | A2 (anhedonia)  |
| 2    | Feeling down, depressed, or hopeless                   | A1 (mood)       |
| 3    | Trouble sleeping or sleeping too much                  | A4 (sleep)      |
| 4    | Tired or little energy                                 | A5 (fatigue)    |
| 5    | Poor appetite or overeating                            | A3 (appetite)   |
| 6    | Feeling bad about yourself / failure                   | A7 (worthlessness) |
| 7    | Trouble concentrating                                  | A8 (concentration) |
| 8    | Moving or speaking slowly / restless                   | A6 (psychomotor) |
| 9    | Thoughts of self-harm or being better off dead         | A9 (suicidality) |

**Total range**: 0–27.

| Score | Band                    | Recommended response                            |
| ----- | ----------------------- | ----------------------------------------------- |
| 0–4   | Minimal                 | No treatment required; reassess as needed       |
| 5–9   | Mild                    | Watchful waiting, low-intensity intervention    |
| 10–14 | Moderate                | High-intensity intervention; consider medication |
| 15–19 | Moderately severe       | Antidepressant + psychological therapy          |
| 20–27 | Severe                  | Immediate initiation of treatment; specialist referral |

**Item 9 (suicidality)** is treated as an independent safety flag: any
non-zero response triggers risk assessment regardless of total score.

## GAD-7 scoring

Each of the 7 items uses the same 0–3 scale as PHQ-9.

| Item | Content (abbreviated)                            |
| ---- | ------------------------------------------------ |
| 1    | Feeling nervous, anxious, or on edge             |
| 2    | Not being able to stop or control worrying       |
| 3    | Worrying too much about different things         |
| 4    | Trouble relaxing                                 |
| 5    | Being so restless it is hard to sit still        |
| 6    | Becoming easily annoyed or irritable             |
| 7    | Feeling afraid as if something awful might happen |

**Total range**: 0–21.

| Score | Band     | Recommended response                                      |
| ----- | -------- | --------------------------------------------------------- |
| 0–4   | Minimal  | No treatment required                                     |
| 5–9   | Mild     | Watchful waiting, self-help                               |
| 10–14 | Moderate | Active treatment with psychological therapy or medication |
| 15–21 | Severe   | Specialist mental health input                            |

A score of **10 or more** on GAD-7 is the validated cut-off for further
evaluation of generalized anxiety disorder (Spitzer et al., 2006).

## Recommended output

The grading engine produces:

- `phq9Total`, `phq9Band`.
- `gad7Total`, `gad7Band`.
- `suicidalityFlag` — `true` if PHQ-9 item 9 score > 0.
- `functionalImpairmentScore` — from the PHQ-9 functional-impact follow-up
  question ("how difficult have these problems made it for you...").
- Risk-stratification level: `routine` / `urgent` / `emergency`.

## Important limitations

- PHQ-9 and GAD-7 are screeners, not diagnostic instruments. Diagnosis of
  major depressive disorder or generalized anxiety disorder requires
  clinical interview against DSM-5-TR or ICD-11 criteria.
- A normal PHQ-9 or GAD-7 does not exclude depression or anxiety;
  collateral history and clinical judgement take precedence.
- PHQ-9 and GAD-7 do not differentiate between disorders (e.g. unipolar
  vs bipolar depression; GAD vs panic vs social anxiety). The clinician
  must consider the differential.
- These instruments were developed for use in adults; paediatric versions
  (PHQ-A) exist but are not implemented in this form.
