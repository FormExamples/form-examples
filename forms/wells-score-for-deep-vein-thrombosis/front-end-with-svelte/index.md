# Wells DVT — SvelteKit front-end

Consolidated SvelteKit front-end for the **Wells Score for Deep Vein Thrombosis
(DVT)**: a single-page, step-by-step questionnaire wizard plus a clinician
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
| `/wells-score-for-deep-vein-thromboses` | Clinician dashboard (SVAR DataGrid) |
| `/wells-score-for-deep-vein-thromboses/[id]` | Single-page assessment wizard |
| `/wells-score-for-deep-vein-thromboses/[id]/report` | Graded report |
| `/wells-score-for-deep-vein-thromboses/[id]/report/pdf` | PDF endpoint (POST) |

## Wizard steps

1. **Assessment context** — clinician name and role, date/time, care setting.
2. **Patient identification** — identifier, age band, sex, symptomatic leg.
3. **Predisposing factors** — criteria 1, 2, 3, 9 (each +1).
4. **Leg examination** — criteria 4–8 (each +1).
5. **Alternative diagnosis** — the single −2 adjustment.
6. **Summary and score** — live Wells total, two-level and three-level bands,
   recommended investigation, and a free-text clinical note.

## Scoring

Nine criteria each score **+1** when present; **−2** is subtracted when an
alternative diagnosis is at least as likely as DVT. Total **−2 to 9**.

- **Two-level (NICE NG158):** `≥ 2` → DVT likely (proximal leg vein ultrasound);
  `≤ 1` → DVT unlikely (D-dimer).
- **Three-level (original Wells):** `≤ 0` low, `1–2` moderate, `≥ 3` high.

## Develop

```sh
pnpm install
pnpm dev            # dev server
pnpm run check      # svelte-check (type-check)
pnpm run build      # production build
pnpm exec vitest run # unit tests
```
