# arc42 Architecture Documentation Form

A structured, single-page wizard that guides an architect or technical lead
through the **12 sections of the arc42 architecture documentation template**
(Gernot Starke & Peter Hruschka), produces a completeness score and a maturity
rating (Draft / Developing / Established / Optimised), fires section-specific
completeness flags, and generates a downloadable architecture report.

This is a **non-clinical reference form** for the `form-examples` monorepo. It
demonstrates the standard form pattern (single-page wizard, structured schema,
scoring engine, multi-format output) applied to software architecture
documentation rather than a medical assessment. The monorepo compliance notes
for MDCG 2019-11, UK MDR 2002, and UK MHRA SaMD do **not** apply to this form.

## Scope and intended users

- **Setting:** software-development teams, architecture guilds, consultancies,
  enterprise architecture programmes, open-source projects.
- **Respondents:** software architects, technical leads, principal engineers,
  enterprise architects, solution architects, development team leads.
- **Unit of assessment:** a named software system or subsystem. One submission
  per architecture review cycle (typically per release or per quarter).

## Scoring system

Each of the 12 arc42 sections is rated on a **0–3 completeness scale**:

| Score | Label | Meaning |
| --- | --- | --- |
| 0 | Missing | Section is absent or contains only the template placeholder |
| 1 | Stub | Section exists but covers fewer than half the required content items |
| 2 | Partial | Section covers most required items but has gaps |
| 3 | Complete | Section fully addresses all required content items |

The **overall maturity** is derived from the unweighted sum of all 12 section
scores (maximum 36):

| Maturity | Sum | Description |
| --- | --- | --- |
| Optimised | 32–36 | All or nearly all sections are complete; documentation actively maintained. |
| Established | 24–31 | Most sections are complete; a few gaps remain. |
| Developing | 12–23 | Several sections are partial or stub; architecture is partially documented. |
| Draft | 0–11 | Documentation is at an early stage; major sections are missing or stub-only. |

If fewer than 4 sections are answered the maturity is reported as
**insufficient-data**.

## 14-step wizard

| # | Step | arc42 section |
| --- | --- | --- |
| 1 | Respondent identification | architect name, role, system name, organisation, review date, arc42 version used |
| 2 | Introduction and goals | requirements overview, quality goals, stakeholders |
| 3 | Constraints | technical constraints, organisational constraints, conventions |
| 4 | Context and scope | business context (external actors, interfaces), technical context (channels, protocols) |
| 5 | Solution strategy | fundamental technology decisions, top-level decomposition, approaches to achieve key quality goals |
| 6 | Building block view | whitebox overall system, level-1 building blocks, level-2 building blocks (where needed) |
| 7 | Runtime view | important runtime scenarios (primary use case, error/exception scenario, operational scenario) |
| 8 | Deployment view | infrastructure environments, deployment diagrams, quality/performance characteristics |
| 9 | Cross-cutting concepts | domain models, UX patterns, safety and security concepts, patterns and design decisions |
| 10 | Architectural decisions | ADR log — at least three significant decisions captured with context, decision, and consequences |
| 11 | Quality requirements | quality tree, quality scenarios, acceptance criteria |
| 12 | Risks and technical debt | known risks with probability/impact, technical-debt register |
| 13 | Glossary | domain terms and technical terms defined |
| 14 | Summary and report | overall maturity, completeness scores per section, fired flags, top-three gaps, sign-off |

## Completeness flags

Flags are computed independently of the maturity score and surface specific
documentation gaps. Priority is **high / medium / low**.

| Flag | Trigger | Priority |
| --- | --- | --- |
| Missing goals | section 2 score = 0 | high |
| No stakeholders listed | section 2 has no stakeholder entries | high |
| Missing constraints | section 3 score = 0 | medium |
| No context diagram | section 4 score = 0 | high |
| No solution strategy | section 5 score = 0 | high |
| No building blocks | section 6 score = 0 | high |
| No runtime scenarios | section 7 score = 0 | medium |
| No deployment view | section 8 score = 0 | medium |
| No ADRs | section 10 score = 0 | high |
| No quality scenarios | section 11 score = 0 | medium |
| No risk register | section 12 score = 0 | medium |
| No glossary | section 13 score = 0 | low |
| Insufficient data | fewer than 4 sections answered | medium |
| Stale documentation | review date > 180 days ago | medium |

## Maturity rules

Each section below completeness 2 fires a coaching rule that names the gap and
suggests the minimum content needed to advance to the next score band. Rules are
defined in `doc/maturity-rules.md` and consumed by the scoring engine.

## Output

- **HTML report preview** with overall maturity, per-section scores, and flags.
- **Downloadable PDF** via `pdfmake` (Svelte build only).
- **FHIR R5 representation** provided for monorepo consistency, mapped to a
  generic `QuestionnaireResponse` resource.
- **XML representation** for archival / legacy import.
- **Gap action plan** listing the top-three sections to improve next, suitable
  to seed a team backlog or architecture guild agenda.

## Directory structure

```
arc42/
  index.md                                           # this file
  AGENTS.md                                          # agent instructions
  plan.md                                            # implementation roadmap
  tasks.md                                           # task tracking
  doc/                                               # reference documentation
  sql-migrations/                                    # Liquibase Postgres migrations
  xml-representations/                               # XML + DTD per SQL table
  fhir-r5/                                           # FHIR R5 JSON resources
  front-end-form-with-html/                          # static single-page wizard
  front-end-form-with-svelte/                        # SvelteKit single-page wizard
  front-end-dashboard-with-html/                     # review dashboard (HTML)
  front-end-dashboard-with-svelte/                   # review dashboard (Svelte + SVAR Grid)
  full-stack-with-loco-tera-htmx-alpine/             # Rust backend + server-rendered UI
```

## References

- Starke, G. & Hruschka, P. *arc42 — Architecture Documentation Template*.
  <https://arc42.org/>.
- Starke, G. *Effective Software Architectures: A Practical Guide*. 9th ed.,
  Hanser, 2023.
- Starke, G. & Hruschka, P. *arc42 in Practice*. Leanpub, 2016.
  <https://leanpub.com/arc42inpractice>.
- Richards, M. & Ford, N. *Fundamentals of Software Architecture*. O'Reilly,
  2020.
- Clements, P. *et al.* *Documenting Software Architectures: Views and Beyond*.
  2nd ed., Addison-Wesley, 2010.
- Nygard, M. "Documenting Architecture Decisions." *Cognitect Blog*, 2011.
  <https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions>.

## Compliance

This form is non-clinical. ISO/IEC/IEEE 26514:2022 (information for users) is
followed for documentation quality.

## Verify

```sh
bin/test-form arc42
```
