# PERC — SvelteKit front-end (form + dashboard)

The consolidated SvelteKit front-end for the Pulmonary Embolism Rule-out
Criteria (PERC): a single continuous single-page wizard plus a clinician
dashboard, both driven by one shared pure classification engine.

PERC is a **status / classification** instrument, not a numeric-score form. The
engine records eight objective criteria — age under 50, heart rate under 100,
SpO2 at least 95%, no unilateral leg swelling, no haemoptysis, no recent surgery
or trauma, no prior venous thromboembolism, and no exogenous oestrogen — plus the
clinician's gestalt pre-test probability. When the pre-test probability is
**low** and **all eight criteria are satisfied**, the result is
**PERC-negative** (PE excluded without D-dimer or imaging); otherwise it is
**PERC-positive** (proceed to further workup).

## Surfaces

- **Welcome** (`/`) — overview and links to the two working surfaces.
- **Wizard** (`/pulmonary-embolism-rule-out-criterias/[id]`) — the six-section
  single-page form; the classification is computed on submit. `new` starts a
  blank draft; an existing id seeds from the sample data.
- **Report** (`/pulmonary-embolism-rule-out-criterias/[id]/report`) — the
  classification banner, interpretation, per-criterion results, flagged issues,
  and an assessment summary, with a server-generated PDF download.
- **Dashboard** (`/pulmonary-embolism-rule-out-criterias`) — a SVAR DataGrid of
  assessed patients with their engine-derived classification, applicability,
  failed-criteria count, and flag count; filterable by care setting and
  classification. Rendered client-only (`ssr = false`).

## Engine

See [`AGENTS.md`](./AGENTS.md) for the algorithm and file layout. The engine is
pure and framework-free (`src/lib/engine/`), unit-tested by
`perc-grader.test.ts`, and shared by both the wizard and the dashboard so the
two surfaces can never disagree.

## Commands

```sh
pnpm install
pnpm run check          # svelte-check (0 errors, 0 warnings)
pnpm run build          # production build
pnpm exec vitest run    # engine unit tests
pnpm dev                # dev server
```
