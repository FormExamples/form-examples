# SPAQ GSS + PHQ-9 — Scoring Rules

This form combines two screening instruments:

- **SPAQ — Seasonal Pattern Assessment Questionnaire**, published by
  Rosenthal, Bradt and Wehr (1984). The SPAQ derives a **Global
  Seasonality Score (GSS)** for seasonal variation in mood, behaviour,
  and physical complaints.
- **PHQ-9** — Patient Health Questionnaire-9 (Kroenke, Spitzer & Williams,
  2001) for current depression severity. See the mental-health-assessment
  form for full PHQ-9 documentation.

The combination supports the clinical recognition of Seasonal Affective
Disorder (SAD) as a "with seasonal pattern" specifier of recurrent major
depressive disorder.

## SPAQ Global Seasonality Score (GSS)

Six items each ask the patient to rate the degree of seasonal change in:

| Item | Domain                                              |
| ---- | --------------------------------------------------- |
| 1    | Sleep length                                        |
| 2    | Social activity                                     |
| 3    | Mood                                                |
| 4    | Weight                                              |
| 5    | Appetite                                            |
| 6    | Energy level                                        |

Each item is scored 0–4:

| Code | Anchor      |
| ---- | ----------- |
| 0    | No change   |
| 1    | Slight      |
| 2    | Moderate    |
| 3    | Marked      |
| 4    | Extreme     |

**Total range**: 0–24.

| GSS    | Band                |
| ------ | ------------------- |
| 0–7    | No SAD              |
| 8–10   | Subsyndromal SAD    |
| 11–24  | SAD likely          |

GSS alone is insufficient for diagnosis. SPAQ also asks whether seasonal
changes are perceived as a **problem** ("not a problem" through to
"severe disabling problem") and identifies the **months of greatest and
least difficulty** to support the seasonal-pattern specifier.

## PHQ-9 — current depression severity

PHQ-9 scoring is described in detail in the mental-health-assessment
form documentation. Bands:

| Score | Band                 |
| ----- | -------------------- |
| 0–4   | Minimal              |
| 5–9   | Mild                 |
| 10–14 | Moderate             |
| 15–19 | Moderately severe    |
| 20–27 | Severe               |

## Combined severity classification

This form combines GSS and PHQ-9 into a 5-band overall severity:

| Overall band | GSS         | PHQ-9                    |
| ------------ | ----------- | ------------------------ |
| No SAD       | 0–7         | 0–4                      |
| Mild         | 8–10        | 5–9                      |
| Moderate     | 11–24       | 10–14                    |
| Severe       | 11–24       | 15–19                    |
| Critical     | 11–24       | 20–27 OR suicidal ideation present |

Any positive endorsement of PHQ-9 item 9 (suicidality) escalates to
Critical regardless of the combined-severity table.

## DSM-5-TR and ICD-11 seasonal-pattern criteria

A diagnosis of major depressive disorder **with seasonal pattern**
(DSM-5-TR specifier; ICD-11 within 6A70/6A71) requires:

- Regular temporal relationship between the onset of depressive episodes
  and a particular time of year (e.g. autumn or winter).
- Full remissions or change to non-depressed phase at a characteristic
  time of year (e.g. spring).
- Two seasonal episodes in the last 2 years with no non-seasonal episodes
  in that period.
- Lifetime seasonal episodes substantially outnumber non-seasonal ones.

The SPAQ history and PHQ-9 severity together provide the clinical
evidence for these criteria; diagnostic confirmation requires clinical
interview.

## Recommended output

The grading engine produces:

- `gss` — integer 0–24.
- `gssBand` — `no-sad` / `subsyndromal` / `sad-likely`.
- `phq9` — integer 0–27.
- `phq9Band` — `minimal` / `mild` / `moderate` / `moderately-severe` / `severe`.
- `combinedSeverity` — as above.
- `suicidalityFlag` — boolean from PHQ-9 item 9.
- `seasonalPattern` — months of peak / trough difficulty.

## Important limitations

- SPAQ has known limitations including ceiling effects and reliance on
  retrospective seasonal self-report. The GSS cut-off of 11 has been
  criticized as over-inclusive in milder presentations.
- The "with seasonal pattern" specifier requires a longitudinal
  history; a single winter screen does not establish the specifier.
- Geographical latitude affects SAD prevalence and pattern; clinicians
  in low-latitude settings should be cautious about applying GSS cut-offs
  derived from high-latitude populations.
