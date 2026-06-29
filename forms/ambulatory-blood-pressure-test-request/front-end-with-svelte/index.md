# Ambulatory Blood Pressure Test Request — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Consolidated gold front-end: a single continuous single-page wizard plus a SVAR
DataGrid vetting dashboard, sharing one pure four-axis grading engine.

## Routes

- `/` — welcome page (purpose, links to the form and dashboard).
- `/ambulatory-blood-pressure-test-requests` — vetting dashboard (SVAR DataGrid, client-only).
- `/ambulatory-blood-pressure-test-requests/[id]` — request wizard (`new` for a fresh draft).
- `/ambulatory-blood-pressure-test-requests/[id]/report` — vetting report.
- `/ambulatory-blood-pressure-test-requests/[id]/report/pdf` — server PDF endpoint.

## Engine

`src/lib/engine/` — a pure, deterministic four-axis grader:

- **A. Appropriateness** — NICE NG136 1–9 ordinal + band.
- **B. Suitability** — BIHS oscillometric accuracy (atrial fibrillation, large arm): ok / caution / limited.
- **C. Completeness** — weighted mandatory-field checklist 0–100 %.
- **D. Triage priority** — routine / urgent / emergency, with severe / accelerated
  hypertension (clinic BP ≥180/120) auto-escalation.

Plus an overall recommendation and safety flags. See parent
[`../index.md`](../index.md) for the clinical specification.

@../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md
