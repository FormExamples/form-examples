# Hospital Discharge — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

A continuous single-page hospital discharge-summary wizard and a SVAR
DataGrid clinician dashboard, sharing one pure validation engine.

## Routes

- `/` — welcome page
- `/hospital-discharges` — clinician dashboard (SVAR DataGrid; client-only)
- `/hospital-discharges/new` and `/hospital-discharges/[id]` — discharge wizard
- `/hospital-discharges/[id]/report` — completeness report
- `/hospital-discharges/[id]/report/pdf` — server-rendered PDF

## Engine

NICE NG27 Discharge Summary Completeness Validation. The engine
(`src/lib/engine/`) runs every mandatory and optional rule, classifies the
summary as **Complete**, **Partial**, or **Incomplete**, and detects
safety-critical flags (medication-reconciliation gaps, date anomalies,
pending investigations without a chase plan, etc.).

See parent [`../index.md`](../index.md) for the full form specification.
