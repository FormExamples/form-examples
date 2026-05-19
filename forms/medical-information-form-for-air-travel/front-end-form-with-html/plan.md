# Static HTML MEDIF wizard — implementation plan

Single-page static HTML implementation of the Medical Information Form for
Air Travel (MEDIF) wizard. Plain HTML + CSS + vanilla JavaScript, with
Alpine.js 3.x via CDN for conditional sub-questions.

## Phases

1. **Scaffold** — `index.html` shell with header, progress bar, `<main>`
   with 14 `<section>` cards, Submit / Reset buttons, and an empty report
   region.
2. **Stylesheet** — mobile-first `css/style.css` reusing the visual
   language from the canonical reference (pre-operative-assessment-by-
   clinician); section cards, radio chips, sticky progress bar, fitness-
   band badges, safety-flag list.
3. **Fields** — render all 14 steps inline. Use Alpine.js `x-data` on
   conditional sub-blocks (oxygen flow rate when oxygen requested; POC
   make / model when POC requested; gestation weeks when pregnant;
   communicable-disease detail when status non-`none`).
4. **Engine** — `js/app.js` implements `evaluateFitness(data)` returning
   `{ band, firedRules, safetyFlags, deskRecommendation, validUntil }`.
   The max-grade algorithm picks the worst-band rule fired.
5. **Progress** — answered-field counter recomputed on every `input` /
   `change` event; updates the sticky progress bar and ARIA value.
6. **Report** — Submit button reveals a report card with the band badge,
   fired-rule table, safety-flag list, and a JSON download link.
7. **Persistence** — autosave to `localStorage` under the
   `medical-information-form-for-air-travel.front-end-form-with-html.v1`
   key; restore on reload.

## Acceptance

- Single continuous HTML page; no multi-page navigation.
- All 14 wizard steps are visible as section cards in document order.
- Field names map 1:1 (camelCase) to the SQL columns (snake_case) from
  `../sql-migrations/04_create_table_medical_information_form_for_air_travel.sql`.
- The fitness-band engine implements every rule listed in `../AGENTS.md`.
- `bin/test-form medical-information-form-for-air-travel` passes for the
  static-HTML subproject.
