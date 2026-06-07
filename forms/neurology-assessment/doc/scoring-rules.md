# NIHSS — Scoring Rules

This form implements the **National Institutes of Health Stroke Scale
(NIHSS)**, the international standard quantitative measure of
stroke-related neurological deficit. The NIHSS was published by Brott et
al. (1989) and is the scale used throughout the NIH-funded NINDS rt-PA
Stroke Study.

## Instrument structure

The NIHSS consists of 15 items scored 0–42 across the following
neurological domains. Each item has its own scoring rubric.

| Item | Domain                                  | Range |
| ---- | --------------------------------------- | -----:|
| 1a   | Level of consciousness (LOC)            | 0–3   |
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
| 11   | Extinction and inattention (neglect)    | 0–2   |

**Total range**: 0–42.

## Severity bands

| Score   | Band                       |
| ------- | -------------------------- |
| 0       | No stroke symptoms         |
| 1–4     | Minor stroke               |
| 5–15    | Moderate stroke            |
| 16–20   | Moderate-to-severe stroke  |
| 21–42   | Severe stroke              |

These bands derive from the NINDS rt-PA study group's analyses and
subsequent stroke literature.

## Administration standards

The NIHSS must be administered in a **fixed sequence**, with item-specific
prompts and standardised stimuli. The official NINDS training and
certification programme is available at:

- https://www.ninds.nih.gov/health-information/public-education/know-stroke
- https://learn.heart.org for the American Heart Association NIHSS
  certification course.

Item-specific rules that affect scoring:

- **Item 1a — LOC**: score 3 only if the patient makes no movement (other
  than reflexive posturing) in response to noxious stimulation.
- **Item 1b — LOC questions**: only the **first answer** counts. The
  examiner does not coach. Aphasic and stuporous patients who do not
  comprehend the questions score 2.
- **Item 2 — Best gaze**: forced deviation overcomeable by oculocephalic
  manoeuvre scores 1.
- **Items 5a/5b/6a/6b**: drift below the held position over 10 seconds
  (arm) or 5 seconds (leg) scores 1.
- **Item 7 — Ataxia**: scored as present only when out of proportion to
  weakness.
- **Item 9 — Best language**: pictures of common objects and a paragraph
  to read are used. Comatose patients automatically score 3.
- **Item 11 — Neglect**: a score of 0 requires demonstration of
  bilateral simultaneous stimulation; score 1 for single-modality
  neglect; score 2 for multimodality neglect.

## Clinical decision implications

NIHSS thresholds frequently used in clinical pathways:

- **NIHSS ≤ 4**: small stroke; thrombolysis decision balances modest
  benefit against haemorrhage risk.
- **NIHSS 6–25**: typical range for intravenous thrombolysis (alteplase
  / tenecteplase) within the relevant time window (per NICE TA264 and
  the National Clinical Guideline for Stroke).
- **NIHSS ≥ 6 with large-vessel occlusion**: eligibility for mechanical
  thrombectomy (per NICE NG128 / Royal College of Physicians 2023
  guideline).

## Recommended output

The grading engine produces:

- `nihssTotal` — 0–42.
- `severityBand` — `none` / `minor` / `moderate` / `moderate-severe` /
  `severe`.
- Per-item scores for audit and inter-rater reliability monitoring.
- Flagged issues — last known well time, blood pressure thresholds for
  thrombolysis, contraindications to thrombolysis.

## Important limitations

- NIHSS is **left-hemisphere biased**: right-hemisphere strokes can
  cause severe disability with low NIHSS scores due to under-weighting of
  neglect and other non-dominant-hemisphere signs.
- NIHSS does **not** capture posterior-circulation features well (e.g.
  vertigo, vertical gaze palsy, ataxia in proportion to weakness,
  bilateral signs).
- A NIHSS of 0 does not exclude stroke; a TIA can resolve before
  examination.
- NIHSS should not be used in isolation for thrombolysis or thrombectomy
  decisions; the clinical pathway must integrate imaging, time-from-onset,
  and contraindication screen.
