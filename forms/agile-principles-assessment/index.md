# Agile Principles Assessment

A team / organisation self-assessment that scores adoption of the
**12 principles of the Agile Manifesto** (Beck *et al.*, 2001) and produces a
composite **agility maturity level** (Ad-hoc / Initial / Developing / Mature /
Optimising), a list of weak-principle flags, and a coaching action plan.

The form is a single-page, 14-step wizard. Each principle is scored on a
1–5 Likert scale (Strongly disagree → Strongly agree) with an optional
free-text comment. The engine computes the per-principle band, the overall
maturity level, fired rules, and additional flags (e.g. burnout risk,
technical-debt risk, lack of retrospective practice).

## Scope and intended users

- **Setting:** software-development teams, product organisations, transformation
  programmes, agile coaches, scrum masters, engineering managers.
- **Respondents:** individual contributors, team leads, scrum masters, product
  owners, engineering managers, agile coaches, executive sponsors.
- **Unit of assessment:** a named team, programme, value stream, or whole
  organisation. One submission per respondent per assessment cycle.

## Scoring system

- **Per-principle Likert score:** 1 (Strongly disagree) … 5 (Strongly agree).
- **Per-principle band:**
  - **High** = 4–5 (principle is well-adopted)
  - **Mid**  = 3 (principle is partially adopted)
  - **Low**  = 1–2 (principle is weak or absent)
- **Composite maturity** is the unweighted mean of the 12 principle scores:

| Maturity     | Mean score | Description |
| ---          | ---        | --- |
| Optimising   | ≥ 4.50     | Agility is woven into daily work; team continuously inspects and adapts. |
| Mature       | 3.75–4.49  | High adoption with deliberate refinement; few weak principles. |
| Developing   | 3.00–3.74  | Practices in place but uneven; several principles are mid-band. |
| Initial      | 2.00–2.99  | Partial adoption; multiple weak principles; coaching needed. |
| Ad-hoc       | < 2.00     | Agility is largely aspirational; foundational coaching required. |

Unanswered principles are excluded from the mean. If fewer than 6 principles
are answered the composite maturity is reported as **insufficient-data**.

## 14-step wizard

| # | Step | Principle (or section) |
| --- | --- | --- |
| 1 | Respondent identification | name, role, team, organisation, assessment date |
| 2 | Customer satisfaction | early and continuous delivery of valuable software |
| 3 | Welcome change | changing requirements welcomed, even late |
| 4 | Deliver frequently | working software delivered in weeks, not months |
| 5 | Collaboration | business and developers work together daily |
| 6 | Motivated individuals | environment, support, trust |
| 7 | Face-to-face conversation | most efficient method of conveying information |
| 8 | Working software | primary measure of progress |
| 9 | Sustainable development | constant pace indefinitely |
| 10 | Technical excellence | continuous attention to design and quality |
| 11 | Simplicity | maximising work not done |
| 12 | Self-organising teams | best architectures and designs emerge |
| 13 | Regular reflection | retrospectives drive behaviour change |
| 14 | Summary & action plan | maturity level, fired rules, flags, top three actions, sign-off |

## Additional flags

Flags are computed independently of the maturity level and surface
specific operational concerns. Priority is **high / medium / low**.

| Category | Trigger | Priority |
| --- | --- | --- |
| Customer-disconnect risk | P1 (customer satisfaction) ≤ 2 | high |
| Change-resistance | P2 (welcome change) ≤ 2 | high |
| Slow-delivery | P3 (deliver frequently) ≤ 2 | medium |
| Silo-collaboration | P4 (collaboration) ≤ 2 | high |
| Motivation/morale risk | P5 (motivated individuals) ≤ 2 | high |
| Communication-gap | P6 (face-to-face) ≤ 2 | medium |
| Output-not-outcome | P7 (working software) ≤ 2 | medium |
| Burnout risk | P8 (sustainable development) ≤ 2 | high |
| Technical-debt risk | P9 (technical excellence) ≤ 2 | high |
| Scope-creep / over-engineering | P10 (simplicity) ≤ 2 | medium |
| Command-and-control | P11 (self-organising teams) ≤ 2 | high |
| No-retrospective | P12 (regular reflection) ≤ 2 | high |
| Critical principle gap | any principle = 1 | high |
| Insufficient data | fewer than 6 principles answered | medium |

## Output

- **HTML report preview** with computed maturity, fired rules, and flags.
- **Downloadable PDF** via `pdfmake` (Svelte build only).
- **FHIR R5 representation** is provided for monorepo consistency, even
  though the form is non-clinical. The assessment is mapped to a generic
  `QuestionnaireResponse` resource.
- **XML representation** for archival / legacy import.
- **Action plan** suitable to seed retrospective items or coaching backlog.

## Directory structure

```
agile-principles-assessment/
  index.md                                          # this file
  AGENTS.md                                         # agent instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  doc/                                              # background reference
  seed.md                                           # the 12 principles (source)
  sql/                                   # Liquibase Postgres migrations
  xml-representations/                              # XML + DTD per SQL table
  fhir-r5/                                          # FHIR R5 JSON resources
  front-end-form-with-html/                         # static single-page wizard
  front-end-form-with-svelte/                       # SvelteKit single-page wizard
  front-end-dashboard-with-html/                    # review dashboard (HTML)
  front-end-dashboard-with-svelte/                  # review dashboard (Svelte + table)
  back-end-with-loco/            # Rust backend + server-rendered UI
```

## References

- Beck, K. *et al.* *Manifesto for Agile Software Development* (2001).
  <https://agilemanifesto.org/>.
- Beck, K. *et al.* *Principles behind the Agile Manifesto* (2001).
  <https://agilemanifesto.org/principles.html>.
- Schwaber, K. & Sutherland, J. *The Scrum Guide* (2020).
  <https://scrumguides.org/>.
- Cohn, M. *Succeeding with Agile: Software Development Using Scrum*. Addison-
  Wesley, 2010.
- Sutherland, J. & Schwaber, K. *Software in 30 Days*. Wiley, 2012.
- Reinertsen, D. *The Principles of Product Development Flow*. Celeritas, 2009.

## Compliance

This form is non-clinical. The monorepo's clinical-software compliance
notes (MDCG 2019-11, UK MDR 2002, MHRA SaMD) do **not** apply to this
assessment. ISO/IEC/IEEE 26514:2022 (information for users) is followed
for documentation quality.

## Verify

```sh
bin/test-form agile-principles-assessment
```
