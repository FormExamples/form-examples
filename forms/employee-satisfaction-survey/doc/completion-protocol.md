# Completion protocol — employee satisfaction survey

## Survey lifecycle

1. **Design** — choose scales (this implementation: UWES-9 + job
   characteristics + eNPS + free text).
2. **Pilot** — test on a sample (≥30) to verify wording and scale
   behaviour.
3. **Distribution** — open to the full population; window typically
   2 weeks.
4. **Reminder** — once, mid-window.
5. **Close** — analyse; embargo individual results.
6. **Report** — aggregate at cohort level only; minimum cohort 10.
7. **Action** — leadership response with named owners and due dates.

## Anonymity model

- Responses keyed by an opaque submission identifier; no link to user
  identity at rest.
- Demographics (team, tenure band, location, role band) collected
  separately and joined only when the resulting cohort is at least 10
  respondents.
- Free text is reviewed for personally identifying content before any
  aggregation that could reveal identity.

This is consistent with CIPD anonymity guidance and ICO recommendations
for staff surveys.

## Scale items

### UWES-9 (vigour / dedication / absorption)

UWES-9 includes three items per dimension. The implementation persists
the published English-language items (free for non-commercial use per
Schaufeli's licence). Item text is loaded from a configurable bundle so
the survey can be administered in any of the languages for which UWES
has been validated.

Response: 7-point frequency scale (0 = never; 6 = always / every day) as
specified in the UWES manual.

### Job characteristics

Five core items based on the Hackman / Oldham model:

- skill variety;
- task identity;
- task significance;
- autonomy;
- feedback from the job.

Response: 7-point agreement scale (1 = strongly disagree; 7 = strongly
agree).

### eNPS

Single 0–10 likelihood-to-recommend item.

### Free text

- "What is going well?"
- "What should we change?"
- "Anything else?"

## Data captured

- Response identifier (opaque UUID).
- Per-item numeric or text answer.
- Cohort metadata (team, tenure, location, role) — held separately.
- Submission timestamp.
- Survey instance identifier (so longitudinal trends are possible).

## Reporting rules

- Aggregate only; never per-respondent.
- Minimum cohort = 10.
- Score rules:
  - UWES per dimension: mean of the three items.
  - UWES total: mean of all nine items.
  - Job characteristics: mean of the five items.
  - eNPS: % promoters (9–10) − % detractors (0–6).
- Confidence intervals reported at 95 % using normal approximation
  where N≥30; otherwise bootstrap (10 000 resamples).

## Trends

The implementation persists prior survey instances so leadership can
see UWES, job-characteristics, and eNPS over time. Trend lines call out
statistically significant changes (p<0.05) but do not interpret them.

## References

- Schaufeli, W. B., & Bakker, A. B. (2003) UWES manual.
  <https://www.wilmarschaufeli.nl/tests/>
- Reichheld, F. F. (2003) "The One Number You Need to Grow." HBR.
- ICO — Anonymisation: managing data protection risk code of practice.
  <https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/anonymisation/>
- CIPD — Employee engagement.
  <https://www.cipd.org/uk/knowledge/factsheets/engagement-factsheet/>
