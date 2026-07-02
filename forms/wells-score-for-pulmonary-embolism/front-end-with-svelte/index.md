# Wells PE — SvelteKit front-end

Consolidated SvelteKit front-end for the **Wells Score for Pulmonary Embolism
(PE)**: a single-page, step-by-step questionnaire wizard plus a clinician
dashboard, both driven by the same pure scoring engine.

- **Framework:** SvelteKit 2, Svelte 5 runes, Tailwind CSS 4.
- **Dashboard:** SVAR Svelte DataGrid (client-only route, `ssr = false`).
- **PDF:** `pdfmake` via a SvelteKit server endpoint.
- **Tests:** Vitest over the scoring engine.
- **Design system:** Lily Design System (Svelte headless) component contract.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Welcome page linking to the form and dashboard |
| `/wells-score-for-pulmonary-embolisms` | Clinician dashboard (SVAR DataGrid) |
| `/wells-score-for-pulmonary-embolisms/[id]` | Single-page assessment wizard |
| `/wells-score-for-pulmonary-embolisms/[id]/report` | Graded report |
| `/wells-score-for-pulmonary-embolisms/[id]/report/pdf` | PDF endpoint (POST) |

## Wizard steps

1. **Assessment context** — clinician name and role, date/time, care setting.
2. **Patient identification** — identifier, age band, sex.
3. **Haemodynamic status** — stable vs unstable (suspected massive PE).
4. **Clinical criteria** — criteria 1, 2, 4, 5, 6, 7 (weighted +3/+1.5/+1).
5. **Observations** — measured heart rate; criterion 3 fires above 100 (+1.5).
6. **Summary and score** — live Wells total, two-level and three-level bands,
   recommended pathway, and a free-text clinical note.

## Scoring

Seven weighted criteria: clinical signs of DVT (+3), PE most likely (+3), heart
rate > 100 (+1.5), immobilisation/surgery (+1.5), previous DVT/PE (+1.5),
haemoptysis (+1), malignancy (+1). Total **0 to 12.5**.

- **Two-level (NICE NG158):** `> 4` → PE likely (CTPA); `≤ 4` → PE unlikely
  (D-dimer; consider PERC for low-gestalt cases).
- **Three-level (original Wells):** `< 2` low, `2–6` moderate, `> 6` high.

## Develop

```sh
pnpm install
pnpm dev            # dev server
pnpm run check      # svelte-check (type-check)
pnpm run build      # production build
pnpm exec vitest run # unit tests
```
