# Meeting — Front-end Form (HTML) Agent Instructions

Static single-page wizard for the meeting form, authored as one
self-contained `index.html` with sibling CSS and JavaScript. No build
step, no package manager, no framework.

## Tools

- Plain HTML, CSS, vanilla JavaScript (ES2022).
- `pdfmake` via CDN for client-side PDF export.
- Any static file server (`python3 -m http.server`).

## File naming convention

- `index.html` — the wizard page.
- `styles.css` — Tailwind-flavoured utility CSS, hand-authored.
- `app.js` — wizard state machine, validation engine, PDF export.
- `sample.json` — sample meeting record for the *Load sample* button.

## Contents

- `./index.md` — overview
- `./AGENTS.md` — this file
- `./CLAUDE.md` — Claude Code project instructions (defers to `AGENTS.md`)
- `./plan.md` — implementation roadmap
- `./tasks.md` — task tracking

## Implementation notes

- One continuous single-page wizard — 10 sections rendered on one page,
  no route transitions (monorepo rule).
- `validateMeeting()` runs on every input change; fired rules and flags
  are rendered in an aside panel.
- Empty string `''` for unanswered text fields; `null` for numeric fields.
- 250-character cap on the summary enforced both in the textarea
  `maxlength` and via a JavaScript guard.
- LocalStorage autosave keyed by meeting `id`.
- PDF export uses `pdfmake.createPdf(docDefinition).download()`.

## Verify

```sh
bin/test-form meeting
```

## Lily Design System HTML headless

This form conforms to the Lily Design System HTML headless class contract.
See [`../../AGENTS-front-end-html.md`](../../AGENTS-front-end-html.md) for
the shared vocabulary (`.field`, `.fieldset`, `.text-input`, `.step-list`,
`.error-summary`, `.button[data-variant]`, etc.), the page-shell template,
validation pattern, and accessibility commitments.
