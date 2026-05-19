# HTML MEDIF dashboard — Agent Instructions

Static HTML medical-desk dashboard for **Medical Information Form for Air
Travel (MEDIF)** submissions. A sortable, filterable table of multiple
MEDIF assessments rendered from a baked-in sample dataset — no backend
required.

## Stack

- HTML5 + CSS3 + vanilla JavaScript (ES2020).
- No build step, no node_modules, no bundler.
- Designed to run from `file://` as well as any static server.
- Classic `<script>` tags only (no ES modules) so the page renders from
  the file system without CORS issues.
- Whole-file IIFE keeps top-level locals out of the global scope.

## Files

- `index.html` — dashboard shell with header, filter bar, and the
  assessments table.
- `css/style.css` — table styling, badge colour bands, mobile-friendly
  scrolling.
- `js/app.js` — sample dataset, sort + filter state, and table
  rendering.

## Columns

The dashboard surfaces the airline-medical-desk view of every MEDIF row:

| Column | Source field |
| --- | --- |
| Passenger | passenger name |
| Airline | airline IATA + name |
| Flight | outbound flight number |
| Departure | outbound date |
| Primary diagnosis | clinical history step 6 |
| Fitness band | computed band |
| Flags | count of safety flags |
| Status | row status (`draft`, `submitted`, `reviewed`, `cleared`, `declined`, `urgent`) |

## Filters

- **Search** — passenger name, airline, flight number, diagnosis,
  booking reference.
- **Fitness band** — `fit`, `fit-with-conditions`, `requires-review`,
  `unfit-to-fly`.
- **Status** — lifecycle dropdown.
- **Flags** — with / without safety flags.

## Sample data

Sample dataset lives inline in `js/app.js` and contains 8 made-up rows
covering the four fitness bands and a variety of clinical reasons
(stable diabetes, late-stage pregnancy, recent MI, severe COPD, etc.).
This is **not** real patient data — names, NHS numbers, and booking
references are illustrative only.

## Accessibility

- Semantic landmark structure (`<header>`, `<main>`, `<footer>`).
- Sortable `<th>` elements expose `aria-sort` ascending / descending.
- Search and select inputs paired with `<label for>` elements.
- Skip link at the top of the page.

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
```
