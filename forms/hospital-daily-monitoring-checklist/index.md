# Hospital Daily Monitoring Checklist

A hospital administrator's / medical superintendent's **daily rounds
checklist** that audits **97 concrete operational checkpoints** across
**22 hospital areas** — OPD, Causality (Casualty), Dispensary, HR
attendance, Ambulance, Diagnostic Facility (Pathology Lab + Radio
Imaging), Store, OT/ICU, Labour Room, Wards, House Keeping, Water
Supply, Electric Supply, Diet, Hospital Signage, Fire Fighting
Equipment, Patient Feedback, Mortuary, Hospital Furniture, Hospital
Waste Management, Infection Control Protocols, and Record Room.

The form is a single-page, continuous wizard. Each checkpoint is
answered as **satisfactory / needs attention / not applicable**, with
an optional free-text remark. The inspecting officer records their
name, designation, the site/department visited, and the inspection
date at the top of the form, and signs off with overall notes and an
action plan at the end.

## Scope and intended users

- **Setting:** general hospitals, primary/community health centres,
  district hospitals — any facility that runs a structured daily or
  periodic administrative rounds process.
- **Respondents:** Resident Medical Officer (RMO), Medical
  Superintendent, hospital administrator, quality/infection-control
  officer, or any designated inspecting officer.
- **Unit of assessment:** one hospital site on one inspection date.
  One submission per round.

## Checklist structure

| # | Area | Checkpoints |
| --- | --- | --- |
| 1 | OPD | 11 |
| 2 | Causality | 4 |
| 3 | Dispensary | 3 |
| 4 | H.R. status check attendance | 2 |
| 5 | Ambulance | 3 |
| 6 | Diagnostic Facility (Pathology Lab, Radio Imaging) | 11 |
| 7 | Store | 4 |
| 8 | O.T. / ICU | 5 |
| 9 | Labour Room | 4 |
| 10 | Wards | 5 |
| 11 | House Keeping | 8 |
| 12 | Water Supply | 6 |
| 13 | Electric Supply | 3 |
| 14 | Diet | 6 |
| 15 | Hospital Signage | 1 |
| 16 | Fire Fighting Equipment | 1 |
| 17 | Patient Feedback | 1 |
| 18 | Mortuary | 1 |
| 19 | Hospital Furniture | 1 |
| 20 | Hospital Waste Management | 10 |
| 21 | Observance & Practice of Infection Control Protocols | 5 |
| 22 | Record Room | 2 |

Total: **97 checkpoints**. Each checkpoint carries a stable dotted
identifier (`1.1`, `6.1.1`, `20.10`, …) matching the source proforma's
numbering, plus a bare section number (`15`, `16`, …) for the five
areas with no sub-items. The full item text is in
[`spec/index.md`](./spec/index.md).

## Response model

- **Per-checkpoint status:** `satisfactory`, `needs-attention`,
  `not-applicable`, or `''` (unanswered).
- **Per-checkpoint remarks:** optional free text, most useful when
  status is `needs-attention`.
- **Summary:** count of checkpoints answered, count marked
  `needs-attention` (overall and per area), and an overall action-plan
  free-text field completed at sign-off.

There is no clinical grading engine — this is an operational
compliance checklist, not a diagnostic instrument.

## Wizard

| # | Step | Content |
| --- | --- | --- |
| 1 | Inspection details | hospital / site name, department, inspection date, inspecting officer name & designation |
| 2–23 | One step per area (22 areas) | checkpoints for that area, each with status + remarks |
| 24 | Summary & sign-off | needs-attention count and list, overall notes, action plan, signature |

## Output

- **HTML report preview** listing every checkpoint marked
  `needs-attention`, grouped by area.
- **Downloadable PDF** via `pdfmake` (Svelte build only).
- **FHIR R5 representation** for monorepo consistency, mapped to a
  generic `QuestionnaireResponse` resource, even though the form is
  non-clinical.
- **XML representation** for archival / legacy import.

## Directory structure

```
hospital-daily-monitoring-checklist/
  index.md                                # this file
  AGENTS.md                               # agent instructions
  plan.md                                 # implementation roadmap
  tasks.md                                # task tracking
  spec/                                    # living spec: full 97-item catalogue
  doc/                                     # background reference
  sql/                                     # Liquibase Postgres migrations
  xml/                                     # XML + DTD per SQL table
  fhir/r5/                                 # FHIR R5 JSON resources
  front-end-with-html/                     # static single-page wizard + dashboard
  front-end-with-svelte/                   # SvelteKit single-page wizard + dashboard
  back-end-with-loco/                      # Rust axum + Loco JSON API
```

## Compliance

This form is non-clinical (facility/operations audit, not a patient
record). The monorepo's clinical-software compliance notes (MDCG
2019-11, UK MDR 2002, MHRA SaMD) do **not** apply. ISO/IEC/IEEE
26514:2022 (information for users) is followed for documentation
quality.

## Verify

```sh
bin/test-form hospital-daily-monitoring-checklist
```
