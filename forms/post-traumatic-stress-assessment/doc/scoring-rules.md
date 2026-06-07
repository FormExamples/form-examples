# PCL-5 — Scoring Rules

This form implements the **PTSD Checklist for DSM-5 (PCL-5)**, a 20-item
self-report measure of the 20 DSM-5 symptoms of PTSD. PCL-5 was developed
by the National Center for PTSD (US Department of Veterans Affairs) and
is in the public domain.

## Instrument structure

The PCL-5 has 20 items, each scored on a 5-point Likert scale:

| Code | Anchor          |
| ---- | --------------- |
| 0    | Not at all      |
| 1    | A little bit    |
| 2    | Moderately      |
| 3    | Quite a bit     |
| 4    | Extremely       |

The 20 items map to the four DSM-5 symptom clusters:

| Cluster | DSM-5 label                                   | PCL-5 items |
| ------- | --------------------------------------------- | ----------- |
| B       | Intrusion                                     | 1–5         |
| C       | Avoidance                                     | 6–7         |
| D       | Negative alterations in cognitions and mood   | 8–14        |
| E       | Alterations in arousal and reactivity         | 15–20       |

## Total score and severity bands

- **Range**: 0–80.
- **Provisional PTSD threshold**: total score ≥ **33** (Weathers et al.,
  2013; Bovin et al., 2016). This cut-off is the value most commonly
  cited in the National Center for PTSD scoring guidance.

| Score   | Band      | Recommended response                                  |
| ------- | --------- | ----------------------------------------------------- |
| 0–20    | Minimal   | Below clinical concern                                |
| 21–32   | Mild      | Sub-threshold; monitor and offer support              |
| 33–37   | Moderate  | Probable PTSD; diagnostic interview recommended       |
| 38–80   | Severe    | Clinically significant PTSD; trauma-focused therapy indicated |

The 33-point cut-off is provisional. The National Center for PTSD
recommends that local validation studies should drive site-specific
cut-offs, and that **clinical interview (CAPS-5)** remains the diagnostic
gold standard.

## DSM-5 symptom-cluster algorithm

A second, complementary scoring approach for **provisional DSM-5
diagnosis** uses the symptom-cluster criteria:

A symptom is considered "endorsed" when the corresponding PCL-5 item
scores **2 (Moderately) or higher**.

Provisional PTSD diagnosis requires:

- ≥ 1 endorsed item in Cluster B (items 1–5).
- ≥ 1 endorsed item in Cluster C (items 6–7).
- ≥ 2 endorsed items in Cluster D (items 8–14).
- ≥ 2 endorsed items in Cluster E (items 15–20).

The form computes both the total-score band and the symptom-cluster
provisional diagnosis indicator.

## Trauma event identification

PCL-5 must be paired with an identified Criterion A traumatic event. The
Trauma Event Identification step uses the **Life Events Checklist for
DSM-5 (LEC-5)** structure, where the patient identifies the index event
(directly experienced, witnessed, learned of happening to a close other,
or repeated exposure to aversive details).

## Recommended output

The grading engine produces:

- `pcl5Total` — integer 0–80.
- `clusterBScore`, `clusterCScore`, `clusterDScore`, `clusterEScore` —
  per-cluster totals.
- `severityBand` — `minimal` / `mild` / `moderate` / `severe`.
- `provisionalDsm5Diagnosis` — boolean from the cluster algorithm.
- `traumaEventIdentified` — boolean from the Trauma Event step.
- Safety flags — see safety-case-notes.md.

## Important limitations

- PCL-5 is a **screening / severity instrument**, not a diagnostic
  instrument. Diagnostic confirmation requires CAPS-5 or equivalent
  clinical interview against DSM-5-TR criteria.
- The PCL-5 cut-off of 33 was developed in US Veterans Affairs samples.
  Performance may differ in primary care, paediatric, or post-disaster
  populations.
- PCL-5 does not cover the ICD-11 Complex PTSD (CPTSD) construct;
  consider the International Trauma Questionnaire (ITQ) where CPTSD is
  suspected.
- PCL-5 is for adults; for children use the Child PTSD Symptom Scale
  (CPSS-V) or UCLA PTSD Reaction Index.
- Item 9 / 10 / 14 capture negative mood and self-blame; flag for
  suicidality even where the total is below 33.
