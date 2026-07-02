# Ottawa Knee Rule — SvelteKit front-end

Consolidated SvelteKit front-end for the **Ottawa Knee Rule**: a single-page,
step-by-step questionnaire wizard plus a clinician dashboard, both driven by the
same pure decision engine.

- **Framework:** SvelteKit 2, Svelte 5 runes, Tailwind CSS 4.
- **Dashboard:** SVAR Svelte DataGrid (client-only route, `ssr = false`).
- **PDF:** `pdfmake` via a SvelteKit server endpoint.
- **Tests:** Vitest over the decision engine.
- **Design system:** Lily Design System (Svelte headless) component contract.

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Welcome page linking to the form and dashboard |
| `/ottawa-knee-rules` | Clinician dashboard (SVAR DataGrid) |
| `/ottawa-knee-rules/[id]` | Single-page assessment wizard |
| `/ottawa-knee-rules/[id]/report` | Graded report |
| `/ottawa-knee-rules/[id]/report/pdf` | PDF endpoint (POST) |

## Wizard steps

1. **Assessment context** — clinician name and role, date/time, care setting,
   injury mechanism, hours since injury.
2. **Patient identification** — identifier, sex, injured side.
3. **Age** — patient age in years (criterion 1).
4. **Bony tenderness** — patellar tenderness, other bony tenderness (isolation),
   fibular head tenderness (criteria 2 and 3).
5. **Knee flexion** — inability to flex to 90 degrees (criterion 4).
6. **Weight-bearing** — inability to take four steps (criterion 5).
7. **Summary and decision** — live imaging decision and a free-text clinical note.

## Decision rule (ANY-of, not a score)

Five objective bedside criteria. A knee X-ray is **indicated** when **any one**
is present, and **not indicated** when all five are absent. There is no numeric
total and no threshold to sum.

| # | Criterion | X-ray indicated when |
| --- | --- | --- |
| 1 | Age | Age 55 years or older |
| 2 | Isolated patellar tenderness | Patellar tenderness with no other bony tenderness |
| 3 | Fibular head tenderness | Tenderness at the head of the fibula |
| 4 | Knee flexion | Unable to flex the knee to 90 degrees |
| 5 | Weight-bearing | Unable to bear weight (four steps) immediately and in the ED |

## Develop

```sh
pnpm install
pnpm dev            # dev server
pnpm run check      # svelte-check (type-check)
pnpm run build      # production build
pnpm exec vitest run # unit tests
```
