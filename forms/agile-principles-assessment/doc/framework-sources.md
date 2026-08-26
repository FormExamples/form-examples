# Framework Sources

The Agile Principles Assessment scores adoption of the twelve principles
behind the Agile Manifesto. This document captures the canonical
sources for each principle and the rationale for the Likert-based
maturity model.

## Agile Manifesto and Principles (2001)

The Manifesto and Principles are the foundational text. Both pages on
agilemanifesto.org are the canonical, unchanged text since 2001:

- Beck, K. *et al.* *Manifesto for Agile Software Development* (2001) —
  <https://agilemanifesto.org/>
- *Principles Behind the Agile Manifesto* (2001) —
  <https://agilemanifesto.org/principles.html>

The twelve principles are restated verbatim in the form's `seed.md`. The
Likert-scored items are operational restatements of each principle as a
single statement the respondent can agree or disagree with.

## Principle-by-principle mapping

| # | Principle (abridged) | Operational restatement |
| --- | --- | --- |
| 1 | Customer satisfaction through early and continuous delivery | The team delivers valuable software early and often |
| 2 | Welcome changing requirements, even late | The team welcomes late-arriving requirement changes |
| 3 | Deliver working software frequently | Working software is delivered in weeks, not months |
| 4 | Business and developers work together daily | Business and developers collaborate daily |
| 5 | Build projects around motivated individuals | The team is motivated, supported, and trusted |
| 6 | Face-to-face conversation is most efficient | Face-to-face conversation (or video equivalent) is the primary channel |
| 7 | Working software is the primary measure of progress | Progress is measured by working software, not artefacts |
| 8 | Sustainable development pace | The team works at a sustainable, indefinitely-maintainable pace |
| 9 | Technical excellence and good design | The team continuously attends to design and quality |
| 10 | Simplicity — maximize work not done | Simplicity (maximizing work not done) is actively practised |
| 11 | Self-organizing teams | Architecture, requirements, and designs emerge from self-organizing teams |
| 12 | Regular reflection and adjustment | The team reflects regularly and adjusts behaviour accordingly |

Each is scored on a 1–5 Likert scale (Strongly disagree → Strongly agree).
Unanswered principles are recorded as `null` and excluded from the mean.

## Scrum Guide

The Scrum Guide is the canonical operational framework that operationalizes
many of the principles (notably the Sprint Review for principle 12, and
the Daily Scrum for principles 4 and 6).

- Schwaber, K. & Sutherland, J. *The Scrum Guide* (current edition) —
  <https://scrumguides.org/>

## Maturity model rationale

The five-band maturity model (Ad-hoc / Initial / Developing / Mature /
Optimizing) borrows from the Capability Maturity Model (CMM and CMMI)
tradition of process-maturity self-assessment.

- Capability Maturity Model Integration (CMMI) — Software Engineering
  Institute, Carnegie Mellon —
  <https://cmmiinstitute.com/>

The thresholds are tuned to:

- **Optimizing** (≥ 4.50): nearly every principle scored 5; teams in this
  band are "continuously inspecting and adapting".
- **Mature** (3.75–4.49): high adoption with a few weak points.
- **Developing** (3.00–3.74): practices in place but uneven.
- **Initial** (2.00–2.99): partial adoption; multiple weak principles.
- **Ad-hoc** (< 2.00): agility is aspirational rather than practised.

Unanswered principles drop out of the mean. If fewer than 6 principles
are answered the composite maturity is reported as `insufficient-data`.

## Supplementary literature

The form's flag set borrows from standard agile-coaching diagnostics:

- Cohn, M. *Succeeding with Agile: Software Development Using Scrum*
  (Addison-Wesley, 2010).
- Sutherland, J. & Schwaber, K. *Software in 30 Days* (Wiley, 2012).
- Reinertsen, D. *The Principles of Product Development Flow* (Celeritas,
  2009).
- Drucker, P.F. *The Effective Executive* (1966) — for the burnout /
  sustainable-pace lens applied to principle 8.

## Standards

The form is not a medical device. Applicable standards:

- ISO 9001:2015 — Quality management systems — Requirements —
  <https://www.iso.org/standard/62085.html>
- ISO/IEC/IEEE 26514:2022 — Design and development of information for
  users —
  <https://www.iso.org/standard/77451.html>

## Distinction from related forms

The monorepo includes a companion scorecard,
`agile-consulting-scorecard-for-hiring-help`, which uses binary yes/no
items rather than Likert scoring. The two forms answer different
questions:

| Form | Question |
| --- | --- |
| `agile-principles-assessment` (this form) | How mature is our agile practice today, across the 12 principles? |
| `agile-consulting-scorecard-for-hiring-help` | Are we ready to engage external agile coaching? |

A team that has run this assessment and identified weak principles is
the natural input to the scorecard's binary readiness check.
