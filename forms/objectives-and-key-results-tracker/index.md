# Objectives and Key Results tracker

A general-purpose Objectives and Key Results (OKR) tracker. Each submission
captures one Objective with its 1–5 Key Results through a single-page,
ten-step wizard, applies a seven-axis scoring engine, and produces a
signed report with a composite Red / Amber / Green status and a list of
risk flags.

This form is the second non-clinical sibling in the monorepo (after
`issue-tracker`): it reuses the same scaffold (single-page wizard → SQL
→ XML + DTD → FHIR R5 → four front-ends + Rust full-stack) but treats
the *objective itself* as the subject.

## Scope and intended users

- **Setting:** team OKR rituals, departmental planning, company strategy
  reviews, individual performance objectives, quarterly business reviews.
- **Users:** OKR owners (DRIs), team leads, department heads, executives,
  OKR coaches, programme managers.
- **Subjects:** any objective at any organizational level — individual,
  team, department, or company.

## Ten-step single-page wizard

| # | Step | Captures |
| --- | --- | --- |
| 1 | Reporter & cycle | reporter id, role, level, cycle, cycle_start_date, cycle_end_date |
| 2 | Objective | title, long description, strategic theme, parent_objective_id |
| 3 | Participants | DRI, contributors, reviewers, stakeholders to inform |
| 4 | Strategic alignment | how this ladders to the parent / mission, business-value statement |
| 5 | Key Results | 1–5 KRs, each: title, type, start/current/target value, unit, owner, due date |
| 6 | Initiatives | planned actions, projects, programmes that drive each KR |
| 7 | Risks & dependencies | known risks, blockers, external dependencies, mitigation plans |
| 8 | Check-in narrative | latest update, what changed, current blockers, asks |
| 9 | Forecast | per-KR end-of-cycle confidence, expected final value, residual risk |
| 10 | Score & sign-off | seven scores, computed RAG, risk flags, override, signature |

## Seven scoring scales

| # | Score | Range | Origin |
| --- | --- | --- | --- |
| 1 | progress_percent | 0–100 | Doerr, *Measure What Matters* (2018) |
| 2 | confidence_decile | 1–10 | Industry practice (Atlassian, Asana) |
| 3 | stretch_tier | 1–3 | Google OKR — committed / aspirational / moonshot |
| 4 | alignment_grade | 1–5 | Enterprise OKR practice (Profit.co, Quantive) |
| 5 | impact_tier | 1–5 | MoSCoW prioritization (Clegg & Barker, 1994) |
| 6 | smart_quality | 0–5 | Doran (1981) — SMART criteria count |
| 7 | pace_deviation_percent | −100..+100 | PMI earned-value analysis (SPI/CPI) |

Composite RAG uses the worst-band-finding algorithm (modulated by
stretch_tier for the progress threshold). Twelve risk flags are
computed independently.

See [the design spec](../../docs/superpowers/specs/2026-05-08-objectives-and-key-results-tracker-design.md)
for the full data model, RAG thresholds, and flag triggers.

## Verify

```sh
bin/test-form objectives-and-key-results-tracker
```
