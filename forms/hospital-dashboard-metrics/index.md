# Hospital Dashboard Metrics

A periodic (typically monthly) hospital KPI dashboard: **67 operational
metrics** across **14 departmental categories** — antibiotics/narcotics
and culture monitoring, inpatient/ward, emergency department, infection
control (HAI/CAUTI/VAP/SSI/CLABSI), blood bank, outpatient (OPD),
surgery/OR, pharmacy, radiology, patient flow/waiting times, human
resources, patient experience, occurrence variance reports (OVR), and
facilities/biomedical engineering.

The form is a single-page, continuous wizard. Each metric is recorded
as a **numeric value** with an optional free-text note (the unit —
percentage, rate, day count, currency, minutes — is implied by the
metric name and documented in [`spec/index.md`](./spec/index.md)).
There is no clinical grading engine; this is an operational KPI
data-entry form, not a diagnostic instrument.

**Note on category titles:** the source proforma separated metrics into
14 groups with `---` dividers but did not name most of them. The
category titles above and in the wizard are inferred from the metrics
they contain (e.g. "HAI, CAUTI, VAP, SSI, CLABSI" → "Infection Control
Metrics") and are clearly documented as an editorial choice, not part
of the original source text.

## Scope and intended users

- **Setting:** any hospital or health system running a periodic
  (monthly/quarterly) KPI reporting cycle.
- **Respondents:** hospital quality/performance-improvement officer,
  department heads, or a hospital administrator compiling the
  dashboard.
- **Unit of assessment:** one hospital, for one reporting period.

## Metric structure

| # | Category | Metrics |
| --- | --- | --- |
| 1 | Antibiotics, Narcotics & Culture Monitoring | 3 |
| 2 | Inpatient / Ward Metrics | 11 |
| 3 | Emergency Department Metrics | 8 |
| 4 | Infection Control Metrics | 5 |
| 5 | Blood Bank Metrics | 3 |
| 6 | Outpatient Department (OPD) Metrics | 9 |
| 7 | Surgery / Operating Room Metrics | 6 |
| 8 | Pharmacy Metrics | 5 |
| 9 | Radiology Metrics | 1 |
| 10 | Patient Flow / Waiting Times | 2 |
| 11 | Human Resources Metrics | 3 |
| 12 | Patient Experience Metrics | 2 |
| 13 | Occurrence Variance Report (OVR) Metrics | 3 |
| 14 | Facilities & Biomedical Engineering Metrics | 6 |

Total: **67 metrics**. Each metric carries a stable dotted identifier
(`1.1`, `4.3`, `14.6`, …) matching its category and position. The full
metric text is in [`spec/index.md`](./spec/index.md).

## Response model

- **Per-metric value:** a decimal number, or unanswered (`null`).
- **Per-metric notes:** optional free text.
- **Header:** hospital/site name, reporting period (month + year),
  prepared-by name.
- **Summary:** count of metrics reported per category, completed at
  sign-off.

## Wizard

| # | Step | Content |
| --- | --- | --- |
| 1 | Reporting period | hospital/site name, period month/year, prepared by |
| 2–15 | One step per category (14 categories) | metrics for that category, each with value + notes |
| 16 | Summary & sign-off | reported-metric count by category, overall notes, signature |

## Output

- **HTML report preview** listing every metric and its recorded value,
  grouped by category.
- **Downloadable PDF** via `pdfmake` (Svelte build only).
- **FHIR R5 representation** for monorepo consistency, mapped to a
  generic `QuestionnaireResponse` resource, even though the form is
  non-clinical.
- **XML representation** for archival / legacy import.

## Directory structure

```
hospital-dashboard-metrics/
  index.md                                # this file
  AGENTS.md                               # agent instructions
  plan.md                                 # implementation roadmap
  tasks.md                                # task tracking
  spec/                                    # living spec: full 67-metric catalogue
  doc/                                     # background reference
  sql/                                     # Liquibase Postgres migrations
  xml/                                     # XML + DTD per SQL table
  fhir/r5/                                 # FHIR R5 JSON resources
  front-end-with-html/                     # static single-page wizard + dashboard
  front-end-with-svelte/                   # SvelteKit single-page wizard + dashboard
  back-end-with-loco/                      # Rust axum + Loco JSON API
```

## Related forms

- [`hospital-daily-monitoring-checklist`](../hospital-daily-monitoring-checklist) —
  a facility-condition rounds checklist (satisfactory / needs-attention
  per checkpoint), rather than a numeric KPI dashboard.
- [`hospital-performance-indicators`](../hospital-performance-indicators) —
  a Balanced Scorecard (Finance / Process / Learning & Growth /
  Customer) hospital indicator set; overlaps with some metrics here
  (e.g. ALOS, bed occupancy, mortality rate) but organized by strategic
  perspective rather than department.

## Compliance

This form is non-clinical (an operational/administrative KPI
dashboard, not a patient record). The monorepo's clinical-software
compliance notes (MDCG 2019-11, UK MDR 2002, MHRA SaMD) do **not**
apply. ISO/IEC/IEEE 26514:2022 (information for users) is followed for
documentation quality.

## Verify

```sh
bin/test-form hospital-dashboard-metrics
```
