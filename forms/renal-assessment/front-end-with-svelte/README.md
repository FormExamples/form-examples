# Renal Assessment — consolidated front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Lily Design System Svelte
headless. SVAR DataGrid dashboard. Vitest for the grading engine.

Consolidated front-end: a single continuous KDIGO CKD assessment wizard plus a
clinician dashboard, served from RESTful routes:

- `/renal-assessments/` — SVAR DataGrid dashboard (engine-derived rows)
- `/renal-assessments/[id]` — single-page assessment wizard
- `/renal-assessments/[id]/report` — classified report (+ `report/pdf`)

The shared engine in `src/lib/engine/` applies the KDIGO 2012/2024 CKD
classification (GFR category G1–G5 × albuminuria category A1–A3 → composite
risk level), with eGFR estimated via the CKD-EPI 2021 race-free equation. See
parent [`../index.md`](../index.md) for the full domain specification.
