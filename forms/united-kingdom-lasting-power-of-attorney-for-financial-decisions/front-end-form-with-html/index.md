# UK Lasting Power of Attorney for Financial Decisions — static HTML wizard

Single-page static HTML implementation of the LP1F (lasting power of
attorney for property and financial affairs) data-entry wizard, built with
plain HTML, Tailwind via the Play CDN, and Alpine.js 3.14.8 from CDN. No
build step; no server required.

## Stack

- HTML5
- Tailwind CSS via the Play CDN
- Alpine.js 3.14.8 via jsDelivr CDN
- Vanilla JavaScript validator (`js/validator.js`)
- localStorage autosave under
  `uk-lpa-financial.front-end-form-with-html.v1`

## Running

```sh
# From this directory:
python3 -m http.server 8080
```

Open <http://localhost:8080>.

The form also runs directly from `file://` — open `index.html` in a modern
browser (CDNs require network access).

## Files

- `index.html` — one continuous single-page 15-step wizard.
- `css/styles.css` — component-level overrides on top of Tailwind.
- `js/validator.js` — pure-JS port of every blocker and flag rule in
  `../doc/lpa-validation-rules.md`. Exports `validateLpa(lpa)`.
- `js/sample-data.js` — the "clean deed" fixture (Example 4) for demo.
- `js/app.js` — Alpine.js initialisation and wizard helpers.

## What it does

- Donor scrolls a single page through 15 sections that map 1:1 to LP1F
  sections 1–15.
- Right-hand validation summary updates live as the donor types: a
  `validityBand` (`draft` -> `ready_for_registration`), a `compositeRisk`
  badge (`low` / `moderate` / `high` / `critical`), and the list of fired
  statutory blockers and additional flags with citations and remediation
  hints.
- Sample-fixture and reset buttons for demo use.
- No PDF export — the deed must still be printed and wet-signed.
