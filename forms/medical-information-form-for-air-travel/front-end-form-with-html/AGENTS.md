# HTML MEDIF wizard — Agent Instructions

Single-page static HTML implementation of the 14-step **Medical Information
Form for Air Travel (MEDIF)** wizard. No build step, no framework, no server.
Alpine.js 3.x is loaded from a CDN for lightweight conditional fields and
the wizard renders all 14 sections on one continuous page.

## Stack

- HTML5 + CSS3 + vanilla JavaScript (ES2020).
- Alpine.js 3.x via CDN (one `<script defer>` tag) for `x-show` toggles on
  conditional sub-questions (e.g. show oxygen flow rate only when
  supplemental oxygen is requested).
- No build step, no node_modules, no bundler, no server requirement.
- Designed to run from `file://` for an airline medical-desk laptop or an
  air-gapped clinic workstation.
- Single classic `<script>` tag for `js/app.js`, wrapped in an IIFE so it
  does not leak globals.

## Files

- `index.html` — page shell with all 14 wizard sections inline as
  `<section>` elements, sticky progress bar, and the report region.
- `css/style.css` — mobile-first stylesheet (no framework dependencies).
- `js/app.js` — progress tracking, fitness-band computation, safety-flag
  detection, report rendering, JSON export.

## Field naming

Front-end form fields use camelCase identifiers that map 1:1 to the
snake_case SQL columns defined in
`../sql-migrations/04_create_table_medical_information_form_for_air_travel.sql`:

- `submitterName` ↔ `submitter_name`
- `outboundFlightNumber` ↔ `outbound_flight_number`
- `restingSpo2Percent` ↔ `resting_spo2_percent`
- `requiresSupplementalOxygen` ↔ `requires_supplemental_oxygen`
- `oxygenFlowRateLpm` ↔ `oxygen_flow_rate_lpm`
- ...and so on, following the camelCase ↔ snake_case rule on every column.

Unanswered text and enum fields default to `''`; unanswered numeric and
date fields default to `null`.

## 14-step wizard

The wizard renders all 14 steps on one continuous page (no pagination). Each
step is a `<section class="section-card">` with a step number, title, and
description, mirroring the table in `../index.md`:

1. Submitting agent identification
2. Passenger identification
3. Trip details
4. Reason MEDIF is required
5. Attending physician identification
6. Diagnosis and clinical history
7. Cardiovascular fitness
8. Respiratory fitness
9. Recent events and surgery
10. Pregnancy and obstetric history
11. Communicable disease screening
12. In-flight medical requirements
13. Medications and equipment in cabin
14. Summary and physician sign-off

## Airline-aligned fitness-to-fly rules

The JavaScript engine implements the same airline-aligned rules documented
in `../AGENTS.md`:

- **Acute MI within 7 days** → `unfit-to-fly` (high cardiac flag).
- **Pneumothorax within 14 days** → `unfit-to-fly` (high pulmonary flag).
- **Intra-ocular / intra-cranial / intra-abdominal gas within 7 days** →
  `unfit-to-fly` (high gas-expansion flag).
- **Recent abdominal surgery within 10 days** → `requires-review`.
- **Active communicable disease** in infectious period → `unfit-to-fly`.
- **Singleton pregnancy > 36 weeks** or **multiple pregnancy > 32 weeks**
  → `unfit-to-fly`.
- **Singleton pregnancy 28–36 weeks** or **multiple 24–32 weeks** →
  `requires-review`.
- **Severe anaemia (Hb < 75 g/L)** → `unfit-to-fly`.
- **Resting SpO₂ < 85 % on room air** → `unfit-to-fly`.
- **Supplemental oxygen flow > 4 L/min** → `requires-review`.
- **Stretcher / incubator** → `requires-review`.
- **Battery-powered medical device** → `requires-review`.

The default band is `fit` when no rule fires. The max-grade algorithm uses
the priority order `fit < fit-with-conditions < requires-review <
unfit-to-fly`; the worst-band finding wins.

## Safety flags

Safety flags are computed independently of the fitness band. Each flag
carries a `priority` (`high`, `medium`, `low`), a `category` (e.g.
`cardiac`, `pulmonary`, `gas-expansion`, `communicable`, `pregnancy`,
`anaemia`, `equipment`, `mobility`), and a human-readable message.

## Progress indicator

A sticky `<progressbar>` at the top of the page tracks the number of
answered fields (non-empty string, non-null number, or non-empty date).
The `aria-valuenow` is updated live and a text readout is appended for
sighted users.

## Accessibility

- Semantic landmark structure (`<header>`, `<main>`, `<section>`,
  `<footer>`).
- Every input is paired with an explicit `<label for>`.
- Sticky progress bar uses `role="progressbar"` + `aria-valuenow`.
- Report region uses `role="region"` and `aria-live="polite"`.
- Skip link at the top of the page.
- WCAG 2.2 AA colour contrast.

## Verify

```sh
bin/test-form medical-information-form-for-air-travel
```
