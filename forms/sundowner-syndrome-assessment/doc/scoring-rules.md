# CMAI + NPI — Scoring Rules

This form combines two validated instruments for behavioural and
psychological symptoms in people with dementia (BPSD), in the specific
context of evening / late-day agitation ("sundowning"):

- **CMAI — Cohen-Mansfield Agitation Inventory** (Cohen-Mansfield, 1986;
  Cohen-Mansfield, Marx & Rosenthal, 1989). Carer-rated frequency of
  29 agitation behaviours.
- **NPI — Neuropsychiatric Inventory** (Cummings et al., 1994).
  Caregiver-rated frequency × severity across 12 neuropsychiatric
  domains, plus carer distress.

Note: "sundowner syndrome" is a clinical descriptor for late-afternoon
or early-evening behavioural change in older people, most commonly seen
in dementia. It is not a discrete diagnostic entity in DSM-5-TR or
ICD-11; the most relevant codes are dementia (ICD-11 6D80–6D8Z; DSM-5-TR
Major Neurocognitive Disorder) and Delirium (ICD-11 6D70; DSM-5-TR
780.09 / F05).

## CMAI scoring

CMAI rates the frequency of 29 agitation behaviours over the past two
weeks. Each item is scored 1–7:

| Code | Anchor                                |
| ---- | ------------------------------------- |
| 1    | Never                                 |
| 2    | Less than once a week                 |
| 3    | Once or twice a week                  |
| 4    | Several times a week                  |
| 5    | Once or twice a day                   |
| 6    | Several times a day                   |
| 7    | Several times an hour                 |

**Total range**: 29–203.

The 29 items factor into three broad categories (Cohen-Mansfield, Marx &
Rosenthal, 1989):

- **Aggressive behaviour** — hitting, kicking, biting, grabbing, pushing,
  scratching, tearing, throwing, cursing, verbal aggression, sexual
  advances.
- **Physically non-aggressive behaviour** — pacing, restlessness, trying
  to get to a different place, handling things inappropriately,
  inappropriate dress/disrobing, repetitive mannerisms.
- **Verbally agitated behaviour** — complaining, repetitive questions,
  constant requests, screaming, negativism.

### Severity bands

The form uses the following CMAI bands, consistent with frequency
groupings used in the dementia care literature:

| Total       | Band                                                          |
| ----------- | ------------------------------------------------------------- |
| 29–45       | Mild — occasional restlessness, redirectable                  |
| 46–75       | Moderate — daily episodes, requires intervention              |
| 76–120      | Severe — aggressive behaviour, safety risk                    |
| > 120       | Critical — self-harm or harm-to-others risk, constant supervision |

These bands are descriptive cut-points used in this form; the original
CMAI does not specify normative severity bands. Clinical judgement
remains paramount.

## NPI scoring

NPI rates 12 neuropsychiatric domains. Each domain has a screening
question; if the symptom is present, the caregiver rates:

- **Frequency** 1–4 (occasionally / often / frequently / very frequently).
- **Severity** 1–3 (mild / moderate / marked).
- **Caregiver distress** 0–5.

Domain score = Frequency × Severity (range 0–12).
**NPI total** = sum of domain scores (range 0–144 across 12 domains).

The 12 domains are:

| # | Domain                                  |
| - | --------------------------------------- |
| 1 | Delusions                               |
| 2 | Hallucinations                          |
| 3 | Agitation / aggression                  |
| 4 | Depression / dysphoria                  |
| 5 | Anxiety                                 |
| 6 | Elation / euphoria                      |
| 7 | Apathy / indifference                   |
| 8 | Disinhibition                           |
| 9 | Irritability / lability                 |
| 10 | Aberrant motor behaviour                |
| 11 | Sleep / night-time behaviour            |
| 12 | Appetite / eating change                |

## Temporal pattern (sundowning specifier)

The Temporal Pattern Assessment step captures:

- Time of day of peak symptoms (afternoon / early evening / late evening /
  night-time / wake-up).
- Duration of episodes.
- Consistency over days.
- Relationship to caregiver shift change, mealtimes, daylight transition,
  visitor schedule.

The conventional "sundowning" pattern is symptom worsening in the late
afternoon and early evening, often with a return to baseline overnight or
the following morning.

## Recommended output

The grading engine produces:

- `cmaiTotal`, `cmaiBand`.
- `cmaiAggressive`, `cmaiNonAggressive`, `cmaiVerbal` — category sub-scores.
- `npiTotal`, `npiDomainScores` (12 domains).
- `caregiverDistress` — sum of NPI distress sub-scores.
- `sundowningPattern` — temporal characterization.
- Flagged issues — see safety-case-notes.md.

## Important limitations

- Both CMAI and NPI rely on caregiver report; rater reliability is
  affected by caregiver fatigue, knowledge, and observation
  opportunity.
- Sundowning is not a discrete diagnostic entity; treatment targets the
  underlying dementia, delirium, environment, or unmet need.
- Always exclude **delirium** in any acute behavioural change. Delirium
  mimics or coexists with dementia agitation and requires urgent medical
  workup (see safety-case-notes.md).
- Severity bands for CMAI used in this form are operational cut-points;
  refer to published literature for context-specific norms.
