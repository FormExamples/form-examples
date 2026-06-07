# ASRS v1.1 — Scoring Rules

This form implements the **Adult ADHD Self-Report Scale (ASRS-v1.1)**, the
World Health Organization (WHO) screener developed for the World Mental Health
Survey Initiative in collaboration with Kessler et al. (2005). The screener
is in the public domain and intended for adults aged 18 and older.

## Instrument structure

ASRS v1.1 is an 18-item self-report symptom checklist that maps to the
DSM-IV/DSM-5 ADHD criterion-A symptom list. It is divided into:

- **Part A** — 6 items (the *screener*). Part A is the validated short-form
  used to determine whether the adult's symptoms are highly consistent with
  ADHD in adults.
- **Part B** — 12 items (supplemental). Part B is not a stand-alone screener
  and exists to give the clinician extra cues for the diagnostic interview.

Each item rates the frequency of a symptom on a 5-point scale:

| Code | Anchor       |
| ---- | ------------ |
| 0    | Never        |
| 1    | Rarely       |
| 2    | Sometimes    |
| 3    | Often        |
| 4    | Very Often   |

## Part A — screener scoring

The Part A items use **item-specific thresholds** (the "darkly shaded" boxes
on the official WHO form). A response is counted as positive only when the
respondent's frequency meets or exceeds the item-specific threshold.

| Item | Wording (short)                                                     | Positive when |
| ---- | ------------------------------------------------------------------- | ------------- |
| 1    | Trouble wrapping up the final details of a project                  | Sometimes+    |
| 2    | Difficulty getting things in order when doing tasks needing organisation | Sometimes+    |
| 3    | Problems remembering appointments or obligations                    | Sometimes+    |
| 4    | Avoidance / delay of tasks requiring a lot of thought               | Often+        |
| 5    | Fidget or squirm with hands or feet when sitting a long time        | Often+        |
| 6    | Feel overly active and compelled to do things, as if driven by a motor | Often+      |

**Threshold rule**: **4 or more** Part-A items reaching the item-specific
threshold is **highly consistent** with adult ADHD and warrants a full
diagnostic evaluation. This rule is reproduced from the WHO/HMRP ASRS
scoring sheet.

## Part B — supplemental scoring

Part B items do not have a published cut-off score. The 12 items are used to
prompt clinical discussion across the inattention (items 7–11) and
hyperactivity/impulsivity (items 12–18) dimensions. The form sums Part B
frequency codes 0–4 to a numeric total (0–48) for trend monitoring, but the
total **must not be used as a diagnostic threshold**.

## Recommended output

The grading engine produces:

- `partAPositiveCount` — number of Part A items at or above threshold (0–6).
- `partAFlag` — `true` when `partAPositiveCount >= 4`.
- `partBTotal` — sum of Part B item codes (0–48).
- `severityBand`:
  - `unlikely` — Part A positive count 0–3.
  - `likely` — Part A positive count 4–6.

## Important limitations

- The ASRS is a **screener**, not a diagnostic instrument. A positive result
  triggers a clinical interview against DSM-5-TR or ICD-11 criteria.
- Symptoms must have onset before age 12 (DSM-5-TR) or in childhood (ICD-11
  6A05) to support an ADHD diagnosis.
- The ASRS does not subtype presentations (inattentive vs hyperactive-impulsive
  vs combined). The combined clinical interview is required for subtyping.
