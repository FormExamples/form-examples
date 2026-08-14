# Completion protocol — workplace climate assessment

## Survey lifecycle

1. **Design** — scale selection (see methodology-reference.md);
   leadership briefing on action commitment.
2. **Pre-communication** — purpose, anonymity model, scope, timeline,
   action commitment.
3. **Distribution** — invitation to in-scope population; 2-week window
   typical.
4. **Reminder** — one mid-window reminder.
5. **Close** — analyse, embargo individual responses.
6. **Report** — aggregate to leadership and to the whole population,
   broken down by cohort with minimum cohort 10.
7. **Action** — leadership commits to named actions with owners and
   due dates, captured as Issues / OKRs.

## Items

The default item bundle includes:

### Psychological safety (Edmondson 1999)

Seven items, e.g.:
- "If I make a mistake on this team, it is often held against me."
  (reverse-scored)
- "Members of this team are able to bring up problems and tough
  issues."
- "It is safe to take a risk on this team."

(Implementation loads exact licensed wording from a configurable
bundle.)

### Procedural justice (Colquitt 2001)

Seven items measuring perceptions of procedure-application fairness
(consistent, bias-suppressed, accurate, correctable, representative,
ethical, voice).

### Distributive justice (Colquitt 2001)

Four items measuring outcome fairness (effort, work performed,
contribution, performance).

### Inclusion climate (Mor Barak / Nishii)

Items on whether the team values different views, makes equitable
decisions across protected characteristics, and creates a sense of
belonging.

### Voice climate (Morrison & Phelps 1999)

Items on whether employees feel safe to raise concerns to management
and whether concerns are acted on.

### Leader-member exchange (LMX-7, Graen & Uhl-Bien 1995)

Seven items measuring the quality of the relationship with the direct
manager.

### Free text

- "What would you change about working here?"
- "What do you most want leadership to know?"

## Anonymity model

- Responses keyed by opaque submission identifier.
- Demographics stored separately and joined only for cohort analytics
  with cohort size ≥ 10.
- Free-text reviewed for personally identifying content before any
  release.
- Demographic break-downs that would create a cohort smaller than 10
  are suppressed in the report.

## Action commitment

A climate survey without subsequent action erodes trust. The
implementation requires:

- Leadership pre-commitment to publish results within a stated window.
- A named owner for each thematic finding.
- Action items recorded as Issues linked to the survey instance.
- A follow-up survey at the next cycle measuring change against
  baseline.

## Scoring

- Subscale score = mean of subscale items (reverse-scored items
  inverted).
- Top-2-box and bottom-2-box percentages reported alongside means.
- Confidence intervals (95 %) reported.

## Equality monitoring (optional)

Where the organization collects protected-characteristic data for
Equality Act 2010 monitoring, those data join the climate analysis only
where cohort ≥ 10. Special-category data (race, religion, sexual
orientation, etc.) is processed under UK GDPR Art. 9(2)(b) — employment
law obligations — and DPA 2018 Schedule 1, Part 1, paragraph 1.

## Anti-patterns

- Surveying without action commitment.
- Slicing demographics so finely that respondents become identifiable.
- Manager pressure on response patterns.
- Reading individual free-text responses to a small team.
