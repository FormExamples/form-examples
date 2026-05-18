# Coaching rules

For each of the three sections the composite grader fires exactly one
coaching rule whose text depends on the section's band (`high` /
`mid` / `low` / `unanswered`). Every rule is stored as a row in
`agile_checklist_grade_rule` with a stable `rule_id`.

## Rule IDs

```
R-TEAMS-HIGH
R-TEAMS-MID
R-TEAMS-LOW
R-TEAMS-UNANSWERED
R-STAKEHOLDERS-HIGH
R-STAKEHOLDERS-MID
R-STAKEHOLDERS-LOW
R-STAKEHOLDERS-UNANSWERED
R-PRACTICES-HIGH
R-PRACTICES-MID
R-PRACTICES-LOW
R-PRACTICES-UNANSWERED
```

The `unanswered` rule only fires when a section has zero applicable
items (i.e. every item was `not-applicable` or left blank).

## Rule descriptions

### Teams

| Band | Coaching text |
| --- | --- |
| high | Teams have strong agile habits — autonomy, learning, and finishing. Preserve psychological safety as the team grows. |
| mid | Team behaviours are uneven. Identify two or three weak items and turn them into named retrospective experiments. |
| low | Teams are not yet operating with agile habits. Start with autonomy, finishing work, and dissent-safety; coaching is needed. |
| unanswered | Teams section was not answered. |

### Stakeholders

| Band | Coaching text |
| --- | --- |
| high | Stakeholders trust and support the team. Continue investing in transparency and shared goals. |
| mid | Stakeholder support is partial. Audit which decisions sponsors still take back at the first sign of trouble. |
| low | Stakeholder behaviour is the binding constraint. No team can outrun a sponsor who revokes authority and punishes experiments. |
| unanswered | Stakeholders section was not answered. |

### Practices

| Band | Coaching text |
| --- | --- |
| high | Operating practices are healthy — quick decisions, finished-work focus, blame-free culture. Keep watching for over-engineering. |
| mid | Practices are partly in place. Pick the two weakest items and address them at the system level, not the team level. |
| low | Operating practices are working against agility. Address finished-over-WIP, quality-over-deadline, and blame culture before adding rituals. |
| unanswered | Practices section was not answered. |

## Coaching philosophy

Three things shape the wording:

1. **Diagnose the system, not the person.** Low-band coaching always
   names a *system* change (WIP limits, decision-rights renegotiation,
   experiment budget) rather than asking individuals to "try harder".
2. **Sequence matters.** Low-band Stakeholders is called out as "the
   binding constraint" — no team can fix culture upward without sponsor
   buy-in. High-band Teams flags psychological safety as the thing to
   protect, because safety degrades as the team scales.
3. **Mid-band is the working zone.** Mid-band coaching always asks the
   team to *pick two or three* items, not all of them. Trying to lift
   every mid-band item simultaneously is the most common failure mode.

These rules are intentionally text-only; they do **not** prescribe
metric thresholds (e.g. "ship within 14 days") because the right
threshold is team-specific and is best discovered in a retrospective.
