# Otolaryngology Assessment — front-end (SvelteKit)

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4. Vitest for unit tests.

Consolidated gold front-end for the Otolaryngology Assessment: a single
continuous ten-section wizard and an SVAR DataGrid clinician dashboard,
both powered by the shared SNOT-22 scoring engine.

## Routes

- `/` — welcome page with links to the form and the dashboard.
- `/otolaryngology-assessments` — clinician dashboard (SVAR DataGrid).
- `/otolaryngology-assessments/[id]` — the assessment wizard.
- `/otolaryngology-assessments/[id]/report` — the graded report.
- `/otolaryngology-assessments/[id]/report/pdf` — server-rendered PDF.

## Scoring

SNOT-22 (Sino-Nasal Outcome Test): 22 items each rated 0-5, total 0-110,
banded Mild (0-7), Moderate (8-19), Severe (20+). A separate flag engine
raises red-flag clinician alerts (neck mass, sudden hearing loss,
tympanic perforation, nasal polyps, asymmetric tonsils, and more).

See parent [`../index.md`](../index.md) for the full form specification.
