# Agile consulting scorecard for hiring help

A self-assessment scorecard that helps an organization decide whether it is
ready to hire agile consulting help. The respondent walks through a
single-page, step-by-step questionnaire of **sixteen yes/no checklist
items** drawn from the four points of the *Agile Manifesto* and the twelve
*Principles behind the Agile Manifesto*, scores one point per "yes", and
receives a banded readiness verdict (Low / Medium / High) with rationale
and recommended next actions.

The point of the scorecard is to **save time and money** for the
organization: if the team cannot honestly tick most of the boxes, hiring
external agile consultants is unlikely to succeed and the organization
should instead invest in foundational work first.

This form is the "non-clinical" counterpart in the monorepo: it reuses the
same patient-assessment scaffold (single-page wizard, pure scoring engine,
SQL-XML-FHIR representation, four front-ends, full-stack Rust backend) but
treats the *organization* as the patient and *agile readiness* as the
condition being graded.

## Scope and intended users

- **Setting:** any company, agency, charity, or public-sector body
  considering procuring external agile coaching, agile transformation
  consultancy, scrum master coaching, or executive agile change support.
- **Respondents:** the buyer-side leader (CXO, VP, programme director,
  head of product, head of engineering, transformation lead) on behalf
  of the whole organization, with input from product, delivery, and
  operations leads.
- **Subjects:** the organization itself — its leadership, teams, ways of
  working, and current agile maturity.

## Sixteen-item checklist

Each item is a single binary question (`true` = the organization
demonstrably does this today; `false` = it does not). Source: `seed.md`.

### Agile Manifesto (4 items)

| # | Manifesto value | Checklist item |
| --- | --- | --- |
| 1 | Individuals and interactions over processes and tools | Every leader is in conversation with customers ≥ 1 hour per week, with weekly results radiated to stakeholders |
| 2 | Working software over comprehensive documentation | The team has launched a brand-new "hello world" program to production and discussed the experience |
| 3 | Customer collaboration over contract negotiation | The organization has bought copies of the customer's favourite book and shared with the team (org spend, not personal) |
| 4 | Responding to change over following a plan | Every senior leader (BoD, CXO, VP, Dir) has read one agile change-management book and shared three takeaways |

### Agile Principles (12 items)

| # | Principle | Checklist item |
| --- | --- | --- |
| 5 | Highest priority is customer satisfaction | Every product lead measures customer NPS |
| 6 | Welcome changing requirements | The "hello world" program has been internationalized to ≥ 1 additional language using the user locale |
| 7 | Deliver working software frequently | The internationalized version has been launched to production and verified by a native speaker |
| 8 | Business and developers work together daily | Commitment is in place from every product / project / programme / practice lead |
| 9 | Motivated individuals + environment + trust | A "3 amigos" team (business + dev + test) has shipped a real new MVP within 30 days and on budget |
| 10 | Face-to-face conversation | Every product owner has committed to ≥ 50 % face-to-face time (or weekly-video equivalent for remote teams) |
| 11 | Working software is the primary measure | A new "fizz buzz" program has been created and shipped to production |
| 12 | Sustainable pace | All staff have a sustaining budget for ≥ 1 year secured |
| 13 | Technical excellence and good design | Quality-attribute metrics are wired into pre-commit hooks and CI |
| 14 | Simplicity — maximize work not done | Every product team has ≥ 2 people with process-improvement skills (Lean, Six Sigma, VSM, TPS, TPC) |
| 15 | Self-organizing teams | A 5-point Likert "our team is self-organizing" averages "Agree" or better |
| 16 | Reflection at regular intervals | Every leader has shared their previous 2 retrospectives with all stakeholders |

## Scoring

- One point per `true` answer; sum is `score_total` ∈ {0, 1, …, 16}.
- The composite readiness band follows `seed.md`:

| Total | Band | Verdict |
| --- | --- | --- |
| 0 – 4 | Low | Don't hire agile help yet — focus on internal operations (BPO, VSM, Lean) |
| 5 | Borderline | Treated as Low until the organization clears at least one more item; explicitly noted because the seed leaves 5 outside its bands |
| 6 – 10 | Medium | Do the agile homework first; revisit the scorecard in ~3 months |
| 11 – 16 | High | Likely ready; trial an engagement and review in ~3 months |

The score and the band are **independent**: the band is a recommendation
band, not a sum, so future tunings (e.g. weighting manifesto vs.
principles) leave the raw score intact.

### Safety / readiness flags

Computed independently of the band. Each flag fires when a *specific*
item is `false` and would block a successful consulting engagement:

- `flag_no_senior_leadership_buyin` — manifesto item 4 is `false`
  (no senior leader has read an agile change book).
- `flag_no_customer_contact` — manifesto item 1 or principle 5 is `false`
  (leaders not talking to customers, or no NPS measurement).
- `flag_no_working_software` — manifesto item 2 *and* principle 11 are
  both `false` (team has not shipped any of the warm-up programs).
- `flag_no_sustainable_budget` — principle 12 is `false`
  (< 1 year of staff budget secured).
- `flag_no_self_organization` — principle 15 is `false`
  (self-organization Likert average below "Agree").
- `flag_no_reflection_culture` — principle 16 is `false`
  (leaders are not running or sharing retrospectives).

A `High` band combined with any flag downgrades the practical
recommendation: the engagement can proceed, but the consultant should be
briefed on the flagged area as the first focus.

## 6-step single-page wizard

| # | Step | Captures |
| --- | --- | --- |
| 1 | Organization & respondent | org name, sector, size, respondent name, role, email, assessment date |
| 2 | Manifesto (4 items) | 4 yes/no answers + optional evidence note per item |
| 3 | Principles 1–4 | items 5–8 yes/no + optional evidence |
| 4 | Principles 5–8 | items 9–12 yes/no + optional evidence |
| 5 | Principles 9–12 | items 13–16 yes/no + optional evidence |
| 6 | Score & sign-off | computed total, band, flags, optional reviewer override + reason, signature |

## Output

- **HTML report preview** with the 16 items, evidence notes, computed
  total, band, and flags.
- **Downloadable PDF** via `pdfmake`.
- **FHIR R5 Bundle** mapping the organization to `Organization`, the
  respondent to `Practitioner`, the assessment to `ClinicalImpression`,
  each item to an `Observation`, and each flag to a `DetectedIssue`.
- **XML** representation for archival.
- **Plain-text procurement summary** for pasting into a tender or
  vendor-selection document.

## Directory structure

```
agile-consulting-scorecard-for-hiring-help/
  index.md                                          # this file
  README.md -> index.md                             # GitHub symlink
  AGENTS.md                                         # agent instructions
  CLAUDE.md                                         # Claude Code project instructions
  plan.md                                           # implementation roadmap
  tasks.md                                          # task tracking
  seed.md                                           # original design seed (preserved verbatim)
  doc/                                              # documentation (AGENTS, running, api-reference)
  samples/                                          # golden-file fixtures for engine-parity tests
  scripts/                                          # demo.sh — end-to-end pipeline smoke test
  sql/                                   # Liquibase Postgres migrations (8 files, 7 tables)
  xml/                              # XML + DTD per SQL table
  fhir/r5/                                          # FHIR HL7 R5 JSON resources
  front-end-with-html/                         # static single-page wizard + printable report
  front-end-with-svelte/                       # SvelteKit wizard + /report + /report/pdf + /diff
  front-end-with-html/                    # static reviewer table (11 columns)
  front-end-with-svelte/                  # SVAR Grid dashboard + /report/[id] + /import + stats panel
  back-end-with-loco/            # Rust axum server + scoring engine + CLI
  back-end-with-loco-setup       # Loco scaffold-generator shell script
```

## Quick start

The shortest path from clone to running pipeline:

```sh
scripts/demo.sh
```

Boots the Rust axum server, exercises every one of the nine HTTP
endpoints with the golden sample, and tears down — about 10 seconds.
For per-component instructions see [`doc/running.md`](./doc/running.md).
For wire-level integration see [`doc/api-reference.md`](./doc/api-reference.md).

## References

- Beck, K. et al. *Manifesto for Agile Software Development.* 2001.
  <https://agilemanifesto.org/>
- *Principles behind the Agile Manifesto.*
  <https://agilemanifesto.org/principles.html>
- Reichheld, F. *The One Number You Need to Grow.* Harvard Business
  Review, 2003 — origin of Net Promoter Score.
- Seddon, J. *The Vanguard Method* — referenced in the seed under
  self-organization improvement.
- Womack, J.P. & Jones, D.T. *Lean Thinking.* 1996 — process-improvement
  discipline referenced under principle 10.
- Ohno, T. *Toyota Production System.* 1988 — referenced under
  principle 10.
- Kotter, J.P. *Leading Change.* 1996 — representative agile-change
  guide under manifesto item 4.

## Compliance

- ISO 9001:2015 — quality-management-system context for organizational
  self-assessment.
- ISO/IEC/IEEE 26514:2022 — design and development of information for
  users (applies to the report and PDF outputs).
- UK GDPR — respondent identity is personal data; the report stores
  email and signature.
- This form is *not* a medical device. MDR / IVDR classification does
  not apply.

## Verify

```sh
bin/test-form agile-consulting-scorecard-for-hiring-help
```
