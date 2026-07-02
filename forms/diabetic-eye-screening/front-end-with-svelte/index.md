# Diabetic Eye Screening — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Diabetic Eye Screening record under the
UK NHS Diabetic Eye Screening Programme. A single continuous single-page wizard
captures the grading context, patient identification, and a per-eye grade block
for each eye (retinopathy R, maculopathy M, photocoagulation P, ungradable U);
the shared pure engine derives the worst-eye result across both eyes and routes
to a recall interval or referral pathway; and a SVAR DataGrid dashboard lists
screened patients with their engine-computed classification.

This is a **documentation and result-classification** form. The engine resolves
each record to exactly one `recallPathway` and one `referral` via a gated,
first-match cascade over the worst-eye summary. There is no numeric score,
cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/diabetic-eye-screenings/[id]`) — the five-step screening record;
  classifies on submit.
- **Report** (`/diabetic-eye-screenings/[id]/report`) — outcome banner,
  interpretation, per-eye grading, outcome detail, and flagged issues; PDF via
  `report/pdf`.
- **Dashboard** (`/diabetic-eye-screenings`) — SVAR DataGrid of screened patients
  (client-only, `ssr = false`), filterable by outcome and referral.

## Algorithm

The engine first derives a worst-eye summary — worst retinopathy by severity
`R0 < R1 < R2 < R3S < R3A` (ignoring unset / ungradable eyes), worst maculopathy
(M1 if either eye), any-ungradable, and low-risk eligibility — then applies the
gated cascade top-to-bottom by clinical urgency (most urgent wins):

```
worstRetinopathy == 'R3A'                              -> refer-hes-urgent     (interval null)
worstMaculopathy == 'M1' || worstRetinopathy == 'R3S'  -> refer-hes            (interval null)
anyUngradable                                          -> refer-slit-lamp      (interval null)
worstRetinopathy == 'R2'                               -> surveillance-6-month (6)
worstRetinopathy == 'R1'                               -> routine-12-month     (12)
worstRetinopathy == 'R0' && lowRiskEligible            -> routine-24-month     (24)
otherwise (R0, not low-risk eligible)                  -> routine-12-month     (12)
```

Flagged issues (active proliferative, maculopathy, stable proliferative,
pre-proliferative, ungradable images, patient overdue, incomplete grading,
eligibility) are computed independently of the pathway.

## Stack

SvelteKit 2, Svelte 5 runes, TypeScript, Tailwind CSS 4, SVAR Svelte DataGrid,
pdfmake, Vitest, and the Lily Design System (Svelte headless) component
contract. See [`AGENTS.md`](AGENTS.md) for the directory layout and conventions.

## Commands

```sh
pnpm install
pnpm run check      # svelte-check (0 errors, 0 warnings)
pnpm run build      # production build
pnpm exec vitest run # engine unit tests
```
