# MMSE — Scoring Rules

This form implements the **Mini-Mental State Examination (MMSE)**, first
described by Folstein, Folstein and McHugh (1975). The MMSE is a brief
30-point clinician-administered cognitive screening instrument.

## Instrument structure

The MMSE assigns up to 30 points across the following domains:

| Domain                     | Max points | Form step              |
| -------------------------- | ----------:| ---------------------- |
| Orientation to time        |  5         | Orientation            |
| Orientation to place       |  5         | Orientation            |
| Registration               |  3         | Registration           |
| Attention and calculation  |  5         | Attention & Calculation |
| Recall                     |  3         | Recall                 |
| Language — naming          |  2         | Language               |
| Language — repetition      |  1         | Repetition & Commands  |
| Language — 3-stage command |  3         | Repetition & Commands  |
| Language — read and obey   |  1         | Language               |
| Language — write a sentence |  1        | Language               |
| Visuospatial copying       |  1         | Visuospatial           |
| **Total**                  | **30**     |                        |

### Orientation (10 points)

- Time (5): year, season, month, day of week, date.
- Place (5): country, county/state, city/town, building, floor/ward.

### Registration (3 points)

Examiner names three unrelated common objects clearly (e.g. "apple, table,
penny"), one second apart, then asks the patient to repeat. One point per
correct first-attempt repetition. Repeat the list until the patient learns
all three (up to six trials) but **score only the first trial**.

### Attention and calculation (5 points)

Serial sevens: subtract 7 from 100, then from each successive answer. Stop
after five subtractions (93, 86, 79, 72, 65). Score one point per correct
subtraction. As an alternative, spell **WORLD** backwards; score the number
of letters in correct order.

### Recall (3 points)

Ask the patient to recall the three objects named in Registration. Score
one point per correct recall.

### Language (8 points distributed)

- Naming (2): show a wristwatch and a pencil; one point each.
- Repetition (1): "No ifs, ands, or buts."
- 3-stage command (3): "Take this paper in your right hand, fold it in
  half, and put it on the floor."
- Read and obey (1): present "CLOSE YOUR EYES" written in large letters.
- Write a sentence (1): patient writes a spontaneous sentence with subject,
  verb, and sensible meaning.

### Visuospatial (1 point)

Patient copies two intersecting pentagons; the copy must show two
five-sided figures whose intersection forms a four-sided figure.

## Total score interpretation

| Score    | Band                                  |
| -------- | ------------------------------------- |
| 24–30    | Normal cognition                      |
| 18–23    | Mild cognitive impairment             |
| 0–17     | Severe cognitive impairment           |

These bands follow Folstein's original cut-offs. Some literature uses
27/30 as a more sensitive cut-off for mild cognitive impairment; this form
adopts the conservative 24/30 NICE-aligned cut-off.

## Recommended output

The grading engine produces:

- `mmseTotal` — integer 0–30.
- `severityBand` — `normal` (24–30), `mild` (18–23), `severe` (0–17).
- `domainScores` — sub-scores for orientation, registration, attention,
  recall, language, visuospatial.

## Important limitations

- The MMSE has **educational and language bias**. Less-educated patients,
  non-native English speakers, and those with sensory impairment may score
  lower without cognitive impairment.
- The MMSE has limited sensitivity for **frontal-executive dysfunction**.
  The Montreal Cognitive Assessment (MoCA) is more sensitive to mild
  impairment and to executive deficits.
- A normal MMSE does not exclude dementia; clinical judgement and
  collateral history take precedence.
- The MMSE is **copyrighted** by Psychological Assessment Resources (PAR)
  since 2001. Clinical use of the form should comply with PAR licensing
  terms.
