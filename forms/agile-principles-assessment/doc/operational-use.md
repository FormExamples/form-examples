# Operational Use

This document describes how the Agile Principles Assessment is deployed in
practice — who completes it, when, how the results are consumed, and how
the form is integrated with the team's existing Scrum / Kanban / SAFe /
LeSS rhythm.

## Who completes it

- Individual contributors, team leads, scrum masters, product owners,
  engineering managers, agile coaches, executive sponsors.
- One submission per respondent per assessment cycle.

The unit of assessment is a **named team, programme, value stream, or
whole organisation**. The form's `respondent` block captures the
respondent identity and the unit they are reporting on.

## When to run it

| Trigger | Cadence |
| --- | --- |
| Team onboarding | Once, in the first 4 weeks |
| Quarterly health check | Every 13 weeks |
| Pre-coaching baseline | Within 2 weeks of engagement start |
| Post-coaching closing | Within 2 weeks of engagement end |
| Pre-Sprint Review (optional) | Each Sprint, light version |
| Ad-hoc retrospective trigger | When the team senses regression |

The quarterly cadence aligns with the Scrum Guide's emphasis on
inspection-and-adaptation at the Sprint Review and the wider team's
quarterly review rhythm.

## How results are consumed

1. **Individual respondent**: receives an HTML / PDF report listing
   per-principle bands, the composite maturity, fired rules, and flags.
2. **Team**: the dashboard aggregates submissions for the named team and
   surfaces variance — high variance across respondents on the same
   principle is itself a signal worth discussing in the next
   retrospective.
3. **Coach / Scrum Master**: uses the fired-rules list to seed the next
   retrospective and to prioritise coaching topics.
4. **Sponsor / Executive**: uses the composite maturity trend over time
   as a leading indicator of organisational change.

## Integration with Scrum

The form pairs cleanly with the Scrum Guide's empirical-process pillars:

| Scrum pillar | Form contribution |
| --- | --- |
| Transparency | The report makes principle-level adoption visible to the team. |
| Inspection | The team inspects the report at the retrospective. |
| Adaptation | The action plan seeds adaptation in the next Sprint. |

Scrum Guide: <https://scrumguides.org/>

## Integration with Kanban

For teams running Kanban without timeboxed Sprints, the quarterly cadence
still applies, with the team's existing operations review (or service
delivery review) as the consumption point.

## Integration with SAFe and LeSS

SAFe and LeSS have their own readiness and inspect-and-adapt instruments.
The form is **complementary**, not a substitute:

- SAFe — <https://scaledagileframework.com/>
- LeSS — <https://less.works/>

A SAFe ART (Agile Release Train) running an Inspect & Adapt event may use
the form's output as one input to the I&A workshop, alongside SAFe's own
business-value and predictability metrics.

## Action plan

The Step 14 summary produces a three-action plan ranked by priority. The
team is expected to:

1. Add the actions as retrospective items in the next iteration.
2. Pick at least one to commit to within the Sprint.
3. Re-score the affected principle(s) at the next cycle.

## Submission process

- Respondents complete the form in 10–20 minutes.
- Anonymous mode is supported: the `respondent` block can record a role
  but not a name, where the team prefers anonymous self-assessment.
- Submissions are stored with `created_at`, `updated_at`, and
  `deleted_at` timestamps; soft-deletion preserves the audit trail.

## Information governance

The respondent identity (where captured) is personal data. The lawful
basis is:

- UK GDPR Article 6(1)(b) — performance of an employment contract (the
  respondent is contributing to a team self-assessment as part of work).
- UK GDPR Article 6(1)(f) — legitimate interests, balanced against the
  respondent's privacy expectation. Anonymous-mode submissions avoid
  collecting personal data.

The form is not a medical device and does not process health data; UK
GDPR Article 9 special-category rules do not apply.

## Continuous improvement

The form is itself an instance of principle 12 (regular reflection). The
report PDF includes a section titled "Reflection on the assessment" so
respondents can record any concerns about the form itself; these are
treated as form-improvement signals.

## Related forms

- `agile-consulting-scorecard-for-hiring-help` — binary readiness check
  for hiring external coaches; complements this Likert assessment.
- `employee-satisfaction-survey` — broader team-health survey; can be run
  alongside.
- `workplace-climate-assessment` — organisation-level culture survey.
