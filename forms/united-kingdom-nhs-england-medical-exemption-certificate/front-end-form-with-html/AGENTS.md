# Front-end form with HTML — FP92A

Static single-page step-by-step wizard for the FP92A medical exemption
application. Vanilla HTML / CSS / JavaScript — no framework, no build step.
Opens directly via `file://`.

## Files

- `index.html` — wizard markup; ten `<section class="step">` blocks
- `css/style.css` — NHS-blue-themed mobile-first styles
- `js/types.js` — eligible-condition codes, labels, step titles
- `js/fp92a-rules.js` — declarative rule set (one per condition + disqualifiers)
- `js/flagged-issues.js` — advisory flag set
- `js/fp92a-validator.js` — `evaluateFp92a(data)` engine
- `js/app.js` — wizard controller; persists draft to `localStorage`

## Running

Open `index.html` in any modern browser. No server required.

## Behaviour

- One step visible at a time (`hidden` attribute toggled).
- Previous / Next buttons step through 1..10.
- On step 10, the eligibility outcome, fired rules, and flags render in the
  summary panel.
- Draft answers are auto-saved to `localStorage` (`fp92a.application.v1`).
- Reset discards the draft.

## See also

- [`../index.md`](../index.md) — overall form design
- [`../AGENTS.md`](../AGENTS.md) — eligibility rules and condition codes
- [`../sql-migrations/`](../sql-migrations/) — canonical data model
