# Agile Checklist

A team / organisation self-assessment that audits **57 concrete behaviours**
of an agile way-of-working across three sections — **Teams**,
**Stakeholders**, and **Practices** — and produces a composite
**agility maturity level** (Ad-hoc / Initial / Developing / Mature /
Optimising), a per-section sub-score, weak-section flags, and a coaching
action plan.

The form is a single-page, 5-step wizard. Each item is answered as
**yes / no / not-applicable**. The engine computes the per-section
percentage of "yes" answers (over applicable items), the overall
maturity level, fired rules per section, and additional flags
(e.g. team-autonomy risk, stakeholder-trust risk, finished-work risk).

The 57 items are sourced verbatim from [`seed.md`](./seed.md).

## Scope and intended users

- **Setting:** software-development teams, product organisations,
  transformation programmes, agile coaches, scrum masters, engineering
  managers, executive sponsors.
- **Respondents:** team members, team leads, scrum masters, product
  owners, engineering managers, agile coaches, executive sponsors.
- **Unit of assessment:** a named team, programme, value stream, or
  whole organisation. One submission per respondent per assessment cycle.

## Item structure

| Section | Items | Focus |
| --- | --- | --- |
| Teams | 25 | autonomy, collaboration, learning, motivation, delivery |
| Stakeholders | 14 | trust, delegation, support for experimentation, communication |
| Practices | 18 | pace of decisions, focus on finished work, transparency, scope |

Total: **57 items**. Each item is a binary statement (yes / no /
not-applicable).

## Scoring system

- **Per-item answer:** `yes`, `no`, or `not-applicable`.
- **Per-section score:** percentage of `yes` answers over applicable
  items. Items answered `not-applicable` are excluded from the
  denominator. Items left `unanswered` are treated as `no` for the
  composite computation but reported separately as the
  *answered-coverage* metric.
- **Per-section band:**
  - **High** = ≥ 75 % yes
  - **Mid**  = 50 – 74 % yes
  - **Low**  = < 50 % yes
- **Composite maturity** is the unweighted mean of the three section
  percentages:

| Maturity     | Mean % yes | Description |
| ---          | ---        | --- |
| Optimising   | ≥ 90 %     | Agile behaviours are pervasive; team continuously inspects and adapts. |
| Mature       | 75 – 89 %  | High adoption with deliberate refinement; few weak sections. |
| Developing   | 50 – 74 %  | Practices in place but uneven; one or two weak sections. |
| Initial      | 25 – 49 %  | Partial adoption; multiple weak sections; coaching needed. |
| Ad-hoc       | < 25 %     | Agility is largely aspirational; foundational coaching required. |

If fewer than 30 of the 57 items are answered (yes / no /
not-applicable) the composite maturity is reported as
**insufficient-data**.

## 5-step wizard

| # | Step | Content |
| --- | --- | --- |
| 1 | Respondent identification | name, role, team, organisation, assessment date, assessment period |
| 2 | Teams (25 items) | autonomy, collaboration, learning, motivation, delivery |
| 3 | Stakeholders (14 items) | trust, delegation, experimentation, communication |
| 4 | Practices (18 items) | decisions, plans, dependencies, finished work, transparency |
| 5 | Summary & action plan | maturity level, per-section bands, fired rules, flags, top three actions, sign-off |

## Additional flags

Flags are computed independently of the maturity level and surface
specific operational concerns. Priority is **high / medium / low**.

| Category | Trigger | Priority |
| --- | --- | --- |
| Teams-autonomy risk | Teams section < 50 % yes | high |
| Stakeholders-trust risk | Stakeholders section < 50 % yes | high |
| Practices-discipline risk | Practices section < 50 % yes | high |
| Section imbalance | spread between any two sections > 30 percentage points | medium |
| Finished-work risk | items `t08` (rarely wait) and `p12` (finished over WIP) both `no` | high |
| Experimentation-blocked | items `s09` (support experiments) and `s10` (no punishment) both `no` | high |
| Learning-stalled | items `t17` (seek new skills) and `t18` (continue to learn) both `no` | medium |
| Psychological-safety risk | items `t22` (express dissent), `s08` (don't take authority back), and `p14` (no blame) any `no` | high |
| Insufficient data | fewer than 30 items answered | medium |

## Output

- **HTML report preview** with computed maturity, per-section bands,
  fired rules, and flags.
- **Downloadable PDF** via `pdfmake` (Svelte build only).
- **FHIR R5 representation** for monorepo consistency, mapped to a
  generic `QuestionnaireResponse` resource, even though the form is
  non-clinical.
- **XML representation** for archival / legacy import.
- **Action plan** suitable to seed retrospective items or coaching
  backlog.

## Directory structure

```
agile-checklist/
  index.md                                          # this file
  AGENTS.md                                         # agent instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  seed.md                                           # the 57 checklist items (source)
  doc/                                              # background reference
  sql-migrations/                                   # Liquibase Postgres migrations
  xml-representations/                              # XML + DTD per SQL table
  fhir-r5/                                          # FHIR R5 JSON resources
  front-end-form-with-html/                         # static single-page wizard
  front-end-form-with-svelte/                       # SvelteKit single-page wizard
  front-end-dashboard-with-html/                    # review dashboard (HTML)
  front-end-dashboard-with-svelte/                  # review dashboard (Svelte + table)
  back-end-with-loco/            # Rust backend + server-rendered UI
```

## Related forms

- [`agile-principles-assessment`](../agile-principles-assessment) — Likert
  (1–5) self-assessment of the 12 Agile Manifesto principles. Companion
  form: principles vs. concrete behaviours.

## References

- Beck, K. *et al.* *Manifesto for Agile Software Development* (2001).
  <https://agilemanifesto.org/>.
- Beck, K. *et al.* *Principles behind the Agile Manifesto* (2001).
  <https://agilemanifesto.org/principles.html>.
- Schwaber, K. & Sutherland, J. *The Scrum Guide* (2020).
  <https://scrumguides.org/>.
- Cohn, M. *Succeeding with Agile: Software Development Using Scrum*.
  Addison-Wesley, 2010.
- Larman, C. & Vodde, B. *Large-Scale Scrum: More with LeSS*.
  Addison-Wesley, 2016.
- Reinertsen, D. *The Principles of Product Development Flow*.
  Celeritas, 2009.

## Compliance

This form is non-clinical. The monorepo's clinical-software compliance
notes (MDCG 2019-11, UK MDR 2002, MHRA SaMD) do **not** apply to this
assessment. ISO/IEC/IEEE 26514:2022 (information for users) is followed
for documentation quality.

## Verify

```sh
bin/test-form agile-checklist
```
