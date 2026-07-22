# Patient-Reported Outcome Measures — Spec

Living spec for `patient-reported-outcome-measures`. A battery of **four
independent, validated patient-reported outcome instruments**,
transcribed from a cervical-spine surgery outcomes appendix
(source PDF: *Appendix B — Patient-Reported Outcome Measures
Questionnaires*):

1. [36-Item Short Form Health Survey, Version 2 (SF-36v2)](#1-sf-36v2-health-survey)
2. [Neck Disability Index (NDI)](#2-neck-disability-index-ndi)
3. [modified Japanese Orthopedic Association score (mJOA)](#3-modified-japanese-orthopedic-association-mjoa)
4. [EuroQol 5-Dimensions, 3-level (EQ-5D-3L)](#4-euroqol-5-dimensions-eq-5d-3l)

There is no single composite score across instruments — each is scored
independently and all four results are reported together, alongside a
`visit` header (subject ID, visit label, assessment date).

## Header

| Field | Type |
| --- | --- |
| `subjectId` | string |
| `visit` | string (e.g. "Baseline", "6-week", "3-month", "1-year") |
| `assessmentDate` | date |

## 1. SF-36v2 Health Survey

36 raw items across 11 numbered questions, each with its own response
scale. Field names below are the canonical camelCase identifiers used
throughout the codebase.

| Q | Field(s) | Response scale (1 = first option) |
| --- | --- | --- |
| 1 | `generalHealth` | 1 Excellent … 5 Poor |
| 2 | `healthChangeVsYearAgo` | 1 Much better than one year ago … 5 Much worse than one year ago |
| 3a–j | `vigorousActivities`, `moderateActivities`, `liftingCarryingGroceries`, `climbingSeveralFlights`, `climbingOneFlight`, `bendingKneelingStooping`, `walkingMoreThanMile`, `walkingSeveralHundredYards`, `walkingOneHundredYards`, `bathingDressing` | 1 Yes, limited a lot / 2 Yes, limited a little / 3 No, not limited at all |
| 4a–d | `cutDownTimePhysical`, `accomplishedLessPhysical`, `limitedInKindPhysical`, `difficultyPerformingPhysical` | 1 All of the time … 5 None of the time |
| 5a–c | `cutDownTimeEmotional`, `accomplishedLessEmotional`, `lessCarefulThanUsual` | 1 All of the time … 5 None of the time |
| 6 | `socialActivitiesInterference` | 1 Not at all … 5 Extremely |
| 7 | `bodilyPain` | 1 None … 6 Very severe |
| 8 | `painInterferenceWithWork` | 1 Not at all … 5 Extremely |
| 9a–i | `feltFullOfLife`, `veryNervous`, `soDownInDumps`, `feltCalmPeaceful`, `lotOfEnergy`, `downheartedDepressed`, `feltWornOut`, `beenHappy`, `feltTired` | 1 All of the time … 5 None of the time |
| 10 | `socialActivitiesInterferenceTime` | 1 All of the time … 5 None of the time |
| 11a–d | `getSickEasier`, `asHealthyAsAnybody`, `expectHealthWorse`, `healthExcellent` | 1 Definitely true … 5 Definitely false |

### Scoring algorithm

This form computes the **8 SF-36 domain scores** using the standard,
public-domain **RAND 36-Item Health Survey 1.0** scoring method (RAND
Corporation; item wording and structure are effectively identical to
SF-36v2, and RAND's scoring manual carries no licensing fee, unlike
QualityMetric's norm-based SF-36v2 algorithm — see "What is not
implemented" below).

**Step 1 — recode every item to 0–100**, where 0 = worst possible
health and 100 = best possible health for that item, via a **linear**
transform `recoded = (raw − low) / (high − low) × 100` using each
item's own polarity (see the direction column in the item table
above — e.g. for a 1–5 item where 1 is worst, `recoded = (raw−1)/4×100`;
where 1 is best, `recoded = (5−raw)/4×100`). Item 3a–j (1–3 scale) use
`recoded = (raw−1)/2×100`.

**Step 2 — average the recoded items within each of the 8 domains:**

| Domain | Field | Items averaged |
| --- | --- | --- |
| Physical Functioning | `pf` | 3a–j (10 items) |
| Role-Physical | `rp` | 4a–d (4 items) |
| Bodily Pain | `bp` | 7, 8 (2 items) |
| General Health | `gh` | 1, 11a, 11b, 11c, 11d (5 items) |
| Vitality | `vt` | 9a, 9e, 9g, 9i (4 items) |
| Social Functioning | `sf` | 6, 10 (2 items) |
| Role-Emotional | `re` | 5a–c (3 items) |
| Mental Health | `mh` | 9b, 9c, 9d, 9f, 9h (5 items) |

Each domain score is 0–100 (higher = better). A domain with zero
answered items is reported as `null`.

**Step 3 — simplified summary scores** (`pcsApprox`, `mcsApprox`):
unweighted mean of the 4 "physical" domains (PF, RP, BP, GH) and the 4
"mental" domains (VT, SF, RE, MH) respectively.

### What is not implemented

The licensed **QualityMetric norm-based scoring algorithm** (the
proprietary factor-score coefficients that produce the trademarked
"SF-36v2 PCS/MCS" T-scores, mean 50 / SD 10, US-population-normed) is
**not** implemented here — those coefficients are commercial IP, not
public domain. `pcsApprox`/`mcsApprox` are clearly labelled as
simplified unweighted-average approximations, not the licensed
norm-based scores. Do not present `pcsApprox`/`mcsApprox` as
equivalent to a QualityMetric-licensed SF-36v2 PCS/MCS report.

## 2. Neck Disability Index (NDI)

10 sections, each answered A–F (recorded as 0–5: A=0 … F=5, per
Vernon & Mior 1991, used here with permission from Fairbank as noted
in the source document).

| Field | Section |
| --- | --- |
| `painIntensity` | Section 1 — Pain Intensity |
| `personalCare` | Section 2 — Personal Care (washing, dressing, etc.) |
| `lifting` | Section 3 — Lifting |
| `reading` | Section 4 — Reading |
| `headache` | Section 5 — Headache |
| `concentration` | Section 6 — Concentration |
| `work` | Section 7 — Work |
| `driving` | Section 8 — Driving |
| `sleeping` | Section 9 — Sleeping |
| `recreation` | Section 10 — Recreation |

### Scoring algorithm

```
rawScore = sum of all answered sections (0-5 each)
answeredSections = count of sections answered
percentageScore = (rawScore / (5 × answeredSections)) × 100
```

(the standard "missing-section" adjustment — if all 10 sections are
answered, this is simply `rawScore / 50 × 100`).

**Interpretation bands** (standard NDI bands, Vernon & Mior 1991):

| `percentageScore` | Band |
| --- | --- |
| 0–4% | No disability |
| 5–14% | Mild disability |
| 15–24% | Moderate disability |
| 25–34% | Severe disability |
| ≥35% | Complete disability |

## 3. modified Japanese Orthopedic Association (mJOA)

6 subscales, each with its own point range, summed for a total score
0–17 (higher = less dysfunction from myelopathy).

| Field | Subscale | Range | 0 (worst) … max (no deficit) |
| --- | --- | --- | --- |
| `motorArms` | Motor, arms | 0–4 | 0 Unable to feed oneself / 1 Unable to use a knife and fork, able to eat with spoon / 2 Able to use knife and fork with much difficulty / 3 Able to use knife and fork with slight difficulty / 4 No deficit |
| `motorLegs` | Motor, legs | 0–4 | 0 Unable to walk / 1 Can walk on flat floor with a walking aid / 2 Can walk up or down stairs with a handrail / 3 Lack of stability and smooth gait / 4 No deficit |
| `sensationArms` | Sensation, arms | 0–2 | 0 Severe sensory loss or pain / 1 Mild sensory loss / 2 No deficit |
| `sensationLegs` | Sensation, legs | 0–2 | 0 Severe sensory loss or pain / 1 Mild sensory loss / 2 No deficit |
| `sensationTrunk` | Sensation, trunk | 0–2 | 0 Severe sensory loss or pain / 1 Mild sensory loss / 2 No deficit |
| `bladderFunction` | Bladder function | 0–3 | 0 Unable to void / 1 Marked difficulty with micturition (retention) / 2 Difficulty in micturition (frequency, hesitation) / 3 No deficit |

### Scoring algorithm

```
totalScore = motorArms + motorLegs + sensationArms + sensationLegs + sensationTrunk + bladderFunction   // 0-17
```

**Interpretation bands** (per the source document, which states "a
typical patient with moderate cervical myelopathy has a mJOA score
between 12 and 14"):

| `totalScore` | Band |
| --- | --- |
| 15–17 | Mild myelopathy |
| 12–14 | Moderate myelopathy |
| 0–11 | Severe myelopathy |

## 4. EuroQol 5-Dimensions (EQ-5D-3L)

5 dimensions, each answered at one of 3 levels (1 = no problems, 2 =
some/moderate problems, 3 = unable/extreme), plus a 0–100 visual
analogue scale (VAS) of current health ("Your own health state
today", 0 = worst imaginable, 100 = best imaginable).

| Field | Dimension |
| --- | --- |
| `mobility` | Mobility |
| `selfCare` | Self-Care |
| `usualActivities` | Usual Activities (work, study, housework, family, or leisure) |
| `painDiscomfort` | Pain/Discomfort |
| `anxietyDepression` | Anxiety/Depression |
| `vasScore` | EQ VAS, 0-100 |

### Scoring algorithm

**Health-state descriptor:** the 5 dimension levels concatenated in
the fixed order above, e.g. `"11123"` (full health in the first three
dimensions, moderate pain, extreme anxiety/depression).

**UK time-trade-off (TTO) crosswalk index value** (Dolan, P. *Modeling
valuations for EuroQol health states*. Medical Care, 1997;
35(11):1095-1108 — the original published UK value-set coefficients,
public domain research, distinct from EuroQol's own licensed current
value sets):

```
index = 1.0
if health-state descriptor != "11111":
    index -= 0.081                          // constant term (N3 in Dolan 1997), any deviation from full health
    if mobility == 2:            index -= 0.069
    if mobility == 3:            index -= 0.314
    if selfCare == 2:             index -= 0.104
    if selfCare == 3:             index -= 0.214
    if usualActivities == 2:      index -= 0.036
    if usualActivities == 3:      index -= 0.094
    if painDiscomfort == 2:       index -= 0.123
    if painDiscomfort == 3:       index -= 0.386
    if anxietyDepression == 2:    index -= 0.071
    if anxietyDepression == 3:    index -= 0.236
    if any dimension == 3:        index -= 0.269   // N3 term: any dimension at the worst level
```

Range: approximately −0.594 (worst imaginable state, "33333") to 1.0
(full health, "11111"), higher = better. `vasScore` is reported as-is
(no computation — it is a direct 0–100 patient rating).

## Wizard

| # | Step | Content |
| --- | --- | --- |
| 1 | Visit details | subject ID, visit label, assessment date |
| 2–5 | SF-36v2 | questions 1–2, 3, 4–5, 6–11 (grouped for a manageable step length) |
| 6 | Neck Disability Index | 10 sections |
| 7 | modified JOA | 6 subscales |
| 8 | EQ-5D-3L | 5 dimensions + VAS |
| 9 | Summary | all four instruments' computed scores together |

## Source

Transcribed from *Appendix B — Patient-Reported Outcome Measures
Questionnaires* (a cervical-spine surgery outcomes study appendix),
comprising the SF-36v2 Health Survey (© 1992, 1996, 2000 Medical
Outcomes Trust and QualityMetric Incorporated), the Neck Disability
Index (Vernon H, Mior S. *The Neck Disability Index: a study of
reliability and validity*. J Manipulative Physiol Ther. 1991;
14(7):409-15; used with permission from Fairbank J), the modified
Japanese Orthopedic Association score, and the EQ-5D (© EuroQol Group
1990). Item wording is preserved verbatim from the source; scoring
algorithms for NDI and mJOA are the standard published methods. SF-36
domain scoring follows the public-domain RAND-36 method rather than
the licensed SF-36v2 norm-based algorithm (see §1 "What is not
implemented"). The EQ-5D-3L index uses the original published Dolan
(1997) UK TTO tariff rather than EuroQol's current licensed value
sets.
