# UK Fit Note HTML Dashboard — Agent Instructions

Static HTML dashboard for reviewing UK Statement of Fitness for Work (Med 3 /
fit note) submissions. Vanilla JavaScript only — no Alpine.js, no Tailwind
CDN, no build step.

## Stack

- HTML5 + CSS3 + vanilla JavaScript (ES2020).
- No node_modules, no server, no bundler.
- Classic `<script>` tags (no ES modules) so the dashboard runs from
  `file://` on air-gapped GP workstations.
- Each script is wrapped in an IIFE and publishes its public symbols on
  `window.UkFitNoteDashboard`.

## Files

- `index.html` — page shell, summary statistics, filter bar, sortable table.
- `css/style.css` — NHS-styled stylesheet (NHS Blue, NHS Warm Yellow).
- `js/sample-data.js` — twelve realistic fit-note records covering all
  recommendation types, both fitness categories, varied adaptation counts.
- `js/app.js` — wizard renderer, persistence, summary counters, filter
  bindings, click-to-sort.

## Columns

| Column | Source |
| --- | --- |
| Patient | patient.given_name + patient.family_name |
| NHS number | patient.nhs_number (NNN NNN NNNN) |
| Issuer profession | clinician.profession |
| Assessment date | fit_note.assessment_date |
| Fitness category | grade.fitness_category |
| Adaptation intensity | grade.adaptation_intensity |
| Period days | grade.period_days |
| Period compliance | grade.period_compliance |
| Recommendation | grade.recommendation |
| Safety flag count | grade_flag rows referencing the fit note |

## Summary statistics (page header)

- Total fit notes.
- Count by recommendation (`standard`, `refer_occupational_health`,
  `refer_access_to_work`, `refer_employment_advisor`, `review_for_validity`).
- Count by fitness category (`not_fit`, `may_be_fit`).

## Filters

- Recommendation dropdown.
- Fitness category dropdown.
- Issuer profession dropdown.
- Free-text search across patient name, NHS number, profession, diagnosis.

## Accessibility

- Semantic landmark structure (`<header>`, `<main>`, `<footer>`).
- Skip link to the table.
- Sortable headers expose `aria-sort` and clickable buttons.
- WCAG 2.2 AA contrast.

## Verify

Open `index.html` in any modern browser. Use the filter dropdowns and click
column headers to confirm sorting works.

## Lily Design System HTML headless

This dashboard conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) §3
(`.data-table-*` family) for the shared vocabulary, filter shape
(`.text-input`, `.select`), and `.alert[data-type]` status messages.
