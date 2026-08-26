# Hospital Performance Indicators

A hospital **Balanced Scorecard** (Kaplan & Norton, 1992/1996) KPI
report: **50 indicators** across the four classic Balanced Scorecard
perspectives applied to a hospital — **Finance** (9), **Process**
(28), **Learning and Growth** (8), and **Customer** (5).

The form is a single-page, continuous wizard. Each indicator is
recorded as a **numeric value** with an optional free-text note (the
unit — ratio, percentage, currency, day count, rate — is implied by
the indicator name and documented in [`spec/index.md`](./spec/index.md)).
There is no clinical grading engine; this is a strategic-performance
KPI report, not a diagnostic instrument.

## Scope and intended users

- **Setting:** any hospital or health system running a periodic
  Balanced Scorecard reporting cycle.
- **Respondents:** hospital quality/performance-improvement officer,
  finance officer, or a hospital administrator compiling the
  scorecard.
- **Unit of assessment:** one hospital, for one reporting period.

## Indicator structure

| # | Perspective | Indicators |
| --- | --- | --- |
| 1 | Finance | 9 |
| 2 | Process | 28 |
| 3 | Learning and Growth | 8 |
| 4 | Customer | 5 |

Total: **50 indicators**. Each indicator carries a stable dotted
identifier (`1.1`, `2.15`, `4.5`, …) matching its perspective and
position. The full indicator text is in
[`spec/index.md`](./spec/index.md).

## Response model

- **Per-indicator value:** a decimal number, or unanswered (`null`).
- **Per-indicator notes:** optional free text.
- **Header:** hospital/site name, reporting period (month + year),
  prepared-by name.
- **Summary:** count of indicators reported per perspective, completed
  at sign-off.

## Wizard

| # | Step | Content |
| --- | --- | --- |
| 1 | Reporting period | hospital/site name, period month/year, prepared by |
| 2 | Finance | 9 indicators |
| 3 | Process | 28 indicators |
| 4 | Learning and Growth | 8 indicators |
| 5 | Customer | 5 indicators |
| 6 | Summary & sign-off | reported-indicator count by perspective, overall notes, signature |

## Output

- **HTML report preview** listing every indicator and its recorded
  value, grouped by perspective.
- **Downloadable PDF** via `pdfmake` (Svelte build only).
- **FHIR R5 representation** for monorepo consistency, mapped to a
  generic `QuestionnaireResponse` resource, even though the form is
  non-clinical.
- **XML representation** for archival / legacy import.

## Directory structure

```
hospital-performance-indicators/
  index.md                                # this file
  AGENTS.md                               # agent instructions
  plan.md                                 # implementation roadmap
  tasks.md                                # task tracking
  spec/                                    # living spec: full 50-indicator catalogue
  doc/                                     # background reference
  sql/                                     # Liquibase Postgres migrations
  xml/                                     # XML + DTD per SQL table
  fhir/r5/                                 # FHIR R5 JSON resources
  front-end-with-html/                     # static single-page wizard + dashboard
  front-end-with-svelte/                   # SvelteKit single-page wizard + dashboard
  back-end-with-loco/                      # Rust axum + Loco JSON API
```

## Related forms

- [`hospital-dashboard-metrics`](../hospital-dashboard-metrics) —
  a departmental (not strategic-perspective) hospital KPI dashboard,
  67 metrics across 14 department-organized categories.
- [`hospital-daily-monitoring-checklist`](../hospital-daily-monitoring-checklist) —
  a facility-condition rounds checklist (satisfactory / needs-attention
  per checkpoint), rather than a numeric KPI report.

## Source grounding

- Kaplan, R. S. & Norton, D. P. *The Balanced Scorecard — Measures
  That Drive Performance*. Harvard Business Review, 1992.
- Kaplan, R. S. & Norton, D. P. *The Balanced Scorecard: Translating
  Strategy into Action*. Harvard Business School Press, 1996.
- Indicators transcribed from a hospital Balanced Scorecard indicator
  list; item text lightly normalized for readability.

## Compliance

This form is non-clinical (a strategic/administrative KPI report, not
a patient record). The monorepo's clinical-software compliance notes
(MDCG 2019-11, UK MDR 2002, MHRA SaMD) do **not** apply. ISO/IEC/IEEE
26514:2022 (information for users) is followed for documentation
quality.

## Verify

```sh
bin/test-form hospital-performance-indicators
```
