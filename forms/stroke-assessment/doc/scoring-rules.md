# NIHSS — Acute Stroke Scoring Rules

This form implements the **National Institutes of Health Stroke Scale
(NIHSS)** for acute stroke severity grading. The NIHSS was first
published by Brott et al. (1989) and is the international standard
quantitative measure of stroke-related neurological deficit.

This document focuses on **acute stroke applications**. See the
neurology-assessment form for general NIHSS scoring rules.

## NIHSS items and ranges

| Item | Domain                                  | Range |
| ---- | --------------------------------------- | -----:|
| 1a   | Level of consciousness                  | 0–3   |
| 1b   | LOC questions (month, age)              | 0–2   |
| 1c   | LOC commands (open/close eyes, grip)    | 0–2   |
| 2    | Best gaze                               | 0–2   |
| 3    | Visual fields                           | 0–3   |
| 4    | Facial palsy                            | 0–3   |
| 5a   | Motor arm — left                        | 0–4   |
| 5b   | Motor arm — right                       | 0–4   |
| 6a   | Motor leg — left                        | 0–4   |
| 6b   | Motor leg — right                       | 0–4   |
| 7    | Limb ataxia                             | 0–2   |
| 8    | Sensory                                 | 0–2   |
| 9    | Best language                           | 0–3   |
| 10   | Dysarthria                              | 0–2   |
| 11   | Extinction and inattention              | 0–2   |

Total range: 0–42.

## Severity bands

| Score   | Band                       |
| ------- | -------------------------- |
| 0       | No stroke symptoms         |
| 1–4     | Minor stroke               |
| 5–15    | Moderate stroke            |
| 16–20   | Moderate-to-severe stroke  |
| 21–42   | Severe stroke              |

## Symptom onset and last known well

Captured in the Symptom Onset step. The clinician records:

- **Last known well (LKW) time** — the most recent time the patient was
  known to be at neurological baseline. Determines the treatment window.
- **Witnessed onset time** — when symptoms were first observed.
- **Wake-up stroke** — symptoms present on waking; LKW is the time the
  patient was last seen well, typically the night before.
- **Mode of onset** — sudden vs gradual vs progressive vs fluctuating.

Treatment windows:

- **Intravenous thrombolysis** (alteplase or tenecteplase) — within 4.5
  hours of LKW; later windows possible with advanced imaging selection.
- **Mechanical thrombectomy** — within 6 hours; up to 24 hours with
  advanced imaging selection per DAWN / DEFUSE-3 criteria.

## Reperfusion-decision thresholds

The Royal College of Physicians 2023 National Clinical Guideline for
Stroke recommends:

- **IV thrombolysis** for ischaemic stroke with disabling neurological
  deficit (typically NIHSS ≥ 5, or any deficit considered disabling)
  within the time window and without contraindication.
- **Mechanical thrombectomy** for ischaemic stroke with proven
  large-vessel occlusion AND NIHSS ≥ 6 AND ASPECTS ≥ 6 within the time
  window.

These are guideline recommendations; the local stroke team's protocol
takes precedence.

## Recommended output

The grading engine produces:

- `nihssTotal` — integer 0–42.
- `severityBand` — `none` / `minor` / `moderate` / `moderate-severe` /
  `severe`.
- Per-item scores.
- `lastKnownWell` — timestamp.
- `timeFromLkwToAssessment` — minutes.
- Flagged issues — see safety-case-notes.md.

## Important limitations

- See neurology-assessment for the discussion of NIHSS limitations
  (left-hemisphere bias, posterior-circulation under-weighting).
- A LOW NIHSS does not exclude stroke; thrombectomy may still be
  indicated for posterior-circulation stroke with severe disability
  despite a low NIHSS.
- NIHSS does NOT measure the long-term disability potential of a stroke;
  the modified Rankin Scale (mRS) is the conventional outcome measure.
- NIHSS administration in a hyperacute setting must be standardized;
  delays in scoring delay treatment.
