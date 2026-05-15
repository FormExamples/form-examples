# Plan: Meeting — Front-end Form (HTML)

## Current status

Scaffolded 2026-05-13. Implementation deferred — `tasks.md` tracks the
remaining build steps.

## Goal

A self-contained `index.html` that renders the 10-step single-page
wizard described in the top-level [`index.md`](../index.md) and produces
a downloadable PDF via `pdfmake`.

## Build order

1. Author `styles.css` — Tailwind-flavoured utility classes for the
   wizard, the aside flag panel, and the report preview.
2. Author `app.js` — wizard state, autosave, sample loader,
   `validateMeeting()` engine port, PDF export.
3. Author `index.html` — the 10 sections wired to `app.js`.
4. Author `sample.json` — one realistic example for the *Load sample*
   button.
5. Run `bin/test-form meeting` and resolve any failures.

## Design principles

- One continuous single-page wizard (no multi-page forms).
- No build step — open `index.html` and the form works.
- Engine logic mirrors the SvelteKit and Rust ports rule-for-rule.
- LocalStorage autosave with draft recovery.
- Print-styles produce a readable record without `pdfmake`.
