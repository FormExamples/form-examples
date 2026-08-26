# GAF — Scoring Rules

This form implements the **Global Assessment of Functioning (GAF) Scale**,
a single-dimension 1–100 scale for the clinician's overall judgement of
psychological, social, and occupational functioning. The GAF was
published in DSM-III-R Axis V and continued in DSM-IV-TR; it was removed
as an axial measure in DSM-5 (2013) but remains widely used in service
evaluation, court reports, and as a clinical communication shorthand.

## GAF anchors

| Score   | Anchor (abbreviated)                                                |
| ------- | ------------------------------------------------------------------- |
| 91–100  | Superior functioning in a wide range of activities; no symptoms     |
| 81–90   | Absent or minimal symptoms; good functioning in all areas           |
| 71–80   | Symptoms transient and expectable reactions to stressors            |
| 61–70   | Mild symptoms OR some difficulty in social/occupational functioning |
| 51–60   | Moderate symptoms OR moderate difficulty in functioning             |
| 41–50   | Serious symptoms OR any serious impairment in functioning           |
| 31–40   | Major impairment in several areas; impaired reality testing or communication |
| 21–30   | Behaviour is considerably influenced by delusions or hallucinations; inability to function |
| 11–20   | Some danger of hurting self or others; occasionally fails to maintain hygiene; gross impairment in communication |
| 1–10    | Persistent danger of severely hurting self or others OR persistent inability to maintain personal hygiene OR serious suicidal act |
| 0       | Inadequate information                                              |

The clinician selects the **lower** of the symptom severity rating and
the functional impairment rating where these differ.

## Severity bands used in this form

| Band       | GAF range | Description                                |
| ---------- | --------- | ------------------------------------------ |
| Superior   | 91–100    | Superior functioning                       |
| Absent     | 81–90     | Absent or minimal symptoms                 |
| Transient  | 71–80     | Transient / expectable                     |
| Mild       | 61–70     | Mild symptoms                              |
| Moderate   | 51–60     | Moderate symptoms                          |
| Serious    | 41–50     | Serious symptoms                           |
| Major      | 31–40     | Major impairment                           |
| Critical   | 21–30     | Behaviour influenced by psychosis          |
| Danger     | 11–20     | Some danger                                |
| Severe     | 1–10      | Persistent danger / severe self-neglect    |

## Mental status examination

Captured in the Mental Status Exam step using the conventional MSE
structure:

- **Appearance and behaviour** — grooming, dress, motor activity, eye
  contact, rapport.
- **Speech** — rate, rhythm, volume, prosody, fluency.
- **Mood** — patient's self-report.
- **Affect** — observed; congruence, range, reactivity, intensity.
- **Thought form** — linear, tangential, circumstantial, loosened
  associations, flight of ideas, thought block.
- **Thought content** — preoccupations, obsessions, compulsions,
  delusions, suicidal/homicidal ideation, perceptual abnormalities.
- **Perception** — hallucinations (modality, command, hypnagogic),
  illusions, derealization, depersonalization.
- **Cognition** — orientation, attention, memory, abstract reasoning.
- **Insight** — into illness and need for treatment.
- **Judgement** — practical, social, interpersonal.

## DSM-5-TR alternative: WHODAS 2.0

DSM-5 introduced the WHO Disability Assessment Schedule 2.0 (WHODAS 2.0)
as the preferred dimensional measure of functional impairment, replacing
the GAF on Axis V. WHODAS 2.0 covers six domains (cognition, mobility,
self-care, getting along, life activities, participation) and is available
from the WHO. This form retains GAF for continuity with services that
still use it; the clinician may record both.

## Recommended output

The grading engine produces:

- `gafScore` — integer 1–100.
- `severityBand` — as above.
- Summary MSE.
- Risk flag — see safety-case-notes.md.
- Provisional ICD-11 / DSM-5-TR diagnostic code.

## Important limitations

- GAF is a **single-dimension global rating** and obscures multi-domain
  functioning. Use with caution for service evaluation.
- Inter-rater reliability for GAF varies by training; a structured
  decision aid is recommended.
- GAF was removed from DSM-5 (2013); consider WHODAS 2.0 where a more
  modern dimensional measure is required.
- GAF includes risk in the 1–30 range; do not use as a stand-alone risk
  measure. Conduct a dedicated risk assessment.
