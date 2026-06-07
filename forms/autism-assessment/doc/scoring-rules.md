# AQ-10 — Scoring Rules

This form implements the **Autism Spectrum Quotient — 10 item (AQ-10)**, a
brief adult screening instrument developed by Allison, Auyeung and
Baron-Cohen (Autism Research Centre, University of Cambridge). It is the
adult screener cited in the NICE quality standard for autism.

## Instrument structure

AQ-10 contains 10 self-report items. Each item is rated on a 4-point Likert
scale:

| Code | Anchor             |
| ---- | ------------------ |
| 0    | Definitely Agree   |
| 1    | Slightly Agree     |
| 2    | Slightly Disagree  |
| 3    | Definitely Disagree |

A point is awarded based on the keyed direction for each item. Some items
score 1 for "agree" responses; others score 1 for "disagree" responses.
Responses outside the keyed direction score 0.

| Item | Brief content                                                | 1 point when |
| ---- | ------------------------------------------------------------ | ------------ |
| 1    | Often notice small sounds when others do not                  | Agree        |
| 2    | Usually concentrate more on the whole picture                 | Disagree     |
| 3    | Find it easy to do more than one thing at once                | Disagree     |
| 4    | If interrupted, can return to what was doing very quickly     | Disagree     |
| 5    | Find it easy to "read between the lines"                      | Disagree     |
| 6    | Know how to tell if someone is getting bored                  | Disagree     |
| 7    | When reading a story, find it difficult to work out characters' intentions | Agree |
| 8    | Like to collect information about categories                  | Agree        |
| 9    | Find it easy to work out what someone is thinking from their face | Disagree |
| 10   | Find it difficult to work out people's intentions             | Agree        |

## Total score and cut-off

- **Total range**: 0–10.
- **Cut-off**: **6 or more** indicates that the patient should be referred
  for a full diagnostic assessment for autism spectrum disorder.

This 6/10 cut-off is the value recommended by Allison et al. (2012) and
adopted by the NICE quality standard QS51 and clinical guideline CG142.

## Recommended output

The grading engine produces:

- `aq10Score` — integer 0–10.
- `referralRecommended` — `true` when `aq10Score >= 6`.
- `severityBand`:
  - `belowThreshold` — score 0–5.
  - `referralRecommended` — score 6–10.

## Important limitations

- AQ-10 is a **screening tool**, not a diagnostic instrument. Diagnosis
  requires a multi-disciplinary assessment using DSM-5-TR or ICD-11
  criteria and tools such as ADOS-2 and ADI-R, conducted by a specialist
  team.
- AQ-10 is validated for adults aged 16 and over. Versions for
  adolescents (AQ-Adolescent) and children (AQ-Child) exist but are not
  implemented in this form.
- Sensitivity and specificity are documented in Allison et al. (2012)
  using a UK clinical sample; performance in other populations may differ.
- A score below 6 does not exclude autism; clinical judgement and
  collateral history take precedence.
