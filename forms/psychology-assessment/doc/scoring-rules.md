# DASS-21 — Scoring Rules

This form implements the **Depression Anxiety Stress Scales — 21 item
(DASS-21)**, a self-report instrument developed by Lovibond and Lovibond
(1995). DASS-21 is the short form of the 42-item DASS and is in the
public domain for clinical and research use.

## Instrument structure

DASS-21 contains 21 items arranged in three 7-item subscales: Depression,
Anxiety, and Stress.

Each item is rated 0–3 on the experience over the past week:

| Code | Anchor                                                          |
| ---- | --------------------------------------------------------------- |
| 0    | Did not apply to me at all                                      |
| 1    | Applied to me to some degree, or some of the time               |
| 2    | Applied to me to a considerable degree, or a good part of time  |
| 3    | Applied to me very much, or most of the time                    |

## Subscale item assignment

| Subscale     | DASS-21 item numbers                  |
| ------------ | ------------------------------------- |
| Depression   | 3, 5, 10, 13, 16, 17, 21              |
| Anxiety      | 2, 4, 7, 9, 15, 19, 20                |
| Stress       | 1, 6, 8, 11, 12, 14, 18               |

## Scoring procedure

1. **Sum each subscale** (range 0–21 per subscale).
2. **Double the sum** to align with DASS-42 reference norms (range 0–42
   per subscale).
3. Apply the published severity bands (table below).

The doubling step is essential. Cut-offs published for DASS-21 are
expressed against the DASS-42 normative range and must be applied after
the doubling.

## Severity bands

Per Lovibond & Lovibond (1995); subscale-specific cut-offs:

| Severity         | Depression | Anxiety | Stress  |
| ---------------- | ----------:| -------:| -------:|
| Normal           |     0–9    |   0–7   |   0–14  |
| Mild             |   10–13    |   8–9   |  15–18  |
| Moderate         |   14–20    |  10–14  |  19–25  |
| Severe           |   21–27    |  15–19  |  26–33  |
| Extremely Severe |     28+    |   20+   |   34+   |

These values are the **doubled** subscale totals; the form computes both
the raw and the doubled scores and reports the band against the doubled
value.

## Risk-screen item

The form supplements DASS-21 with a separate risk-screen item to capture
suicidal ideation. DASS-21 does not include a standalone suicidality
item; this enhancement is described in the form's flagged-issues policy.
A positive response triggers urgent clinician review regardless of
subscale severity.

## Recommended output

The grading engine produces:

- `depressionRaw`, `depressionDoubled`, `depressionBand`.
- `anxietyRaw`, `anxietyDoubled`, `anxietyBand`.
- `stressRaw`, `stressDoubled`, `stressBand`.
- `riskFlag` — boolean from the risk-screen item.
- `overallSeverity` — the highest of the three subscale bands.

## Important limitations

- DASS-21 is a **screening / severity instrument**, not a diagnostic
  instrument. Clinical interview is required for diagnosis of major
  depressive disorder, generalized anxiety disorder, panic disorder, or
  adjustment disorder.
- DASS-21 measures the **past week**; consider PHQ-9 / GAD-7 (past two
  weeks) for stepped-care matching.
- The DASS-21 "Stress" subscale captures persistent tension and
  irritability; it is not a measure of recent traumatic stress.
- Normative data are drawn from a non-clinical Australian adult sample;
  consider locally validated cut-offs if available.
