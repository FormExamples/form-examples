# Completeness Rules

Per-section minimum thresholds used by the scoring engine to assign
`empty` / `partial` / `complete` to each of the 12 arc42 sections.

A section is `empty` when none of its required fields are populated.
A section is `complete` when it meets **all** of the minimums listed below.
A section is `partial` when it has some content but does not yet meet the
`complete` threshold.

## Per-section minimums for `complete`

| § | Section | Minimums for `complete` |
| --- | --- | --- |
| 1 | Introduction & Goals | introduction present, ≥1 business goal, ≥3 quality goals (each with priority + scenario), ≥2 stakeholders |
| 2 | Constraints | ≥1 item across the three kinds (technical, organizational, conventions) |
| 3 | Context & Scope | business description present + ≥1 business partner; technical description present + ≥1 technical interface |
| 4 | Solution Strategy | strategy summary present + ≥1 technology decision |
| 5 | Building Block View | overview present + ≥3 building blocks |
| 6 | Runtime View | ≥1 runtime scenario with steps populated |
| 7 | Deployment View | ≥1 deployment node |
| 8 | Crosscutting Concepts | ≥1 crosscutting concept |
| 9 | Architectural Decisions | ≥3 ADRs with status ≠ `draft` |
| 10 | Quality Requirements | ≥3 quality scenarios fully populated (all five fields: source, stimulus, artifact, response, measure) |
| 11 | Risks & Technical Debt | ≥1 risk item with mitigation present |
| 12 | Glossary | ≥5 glossary terms |
