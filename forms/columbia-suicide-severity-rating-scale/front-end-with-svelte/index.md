# C-SSRS — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Columbia Suicide Severity Rating Scale
(C-SSRS). A single continuous single-page wizard captures the ideation items,
behaviour categories, and lethality; the shared pure engine derives the risk
tier and produces a classification report; and a SVAR DataGrid dashboard lists
assessed patients with their engine-computed ideation level and risk tier.

This is a **status- and severity-classification** form. The engine derives the
highest affirmative ideation level (0-5), whether suicidal behaviour is present
and recent, and lethality, then classifies the patient into a
**Low / Moderate / High** risk tier. There is no numeric score, cut-off, or
band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/columbia-suicide-severity-rating-scales/[id]`) — the eight-step
  C-SSRS screen; classifies on submit.
- **Report** (`/columbia-suicide-severity-rating-scales/[id]/report`) —
  risk-tier banner, management recommendation, ideation and behaviour tables,
  and flagged issues; PDF via `report/pdf`.
- **Dashboard** (`/columbia-suicide-severity-rating-scales`) — SVAR DataGrid of
  assessed patients (client-only, `ssr = false`), filterable by care setting
  and risk tier.

## Algorithm

```
ideationLevel = highest N in 1..5 whose ideation item == 'yes', else 0
suicidalBehaviourPresent = actual | interrupted | aborted attempt | preparatory acts
recentBehaviour = suicidalBehaviourPresent && behaviourRecency == 'within-3-months'
highLethality   = actualLethality >= 3 || potentialLethality == 2

riskTier = HIGH     if ideationLevel >= 4 || recentBehaviour || highLethality
           MODERATE else if ideationLevel == 3 || suicidalBehaviourPresent
           LOW      otherwise
```

Non-suicidal self-injury is tracked separately and does not set a tier. The
management recommendation is derived from the tier (spec §4).

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
