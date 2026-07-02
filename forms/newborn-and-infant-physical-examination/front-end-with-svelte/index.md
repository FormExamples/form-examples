# NIPE — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Newborn and Infant Physical
Examination (NIPE) national-screening examination. A single continuous
single-page wizard captures the four key screening components plus the
head-to-toe systematic examination; the shared pure engine classifies each
component and rolls the applicable components up into an overall screening
outcome; and a SVAR DataGrid dashboard lists examined babies with their
engine-computed outcome.

This is a **classification / completeness** form. The engine classifies each
key component (eyes, heart, hips, testes) as `satisfactory`, `refer`, or
`not-examined` (testes → `not-applicable` for girls), then computes an overall
outcome — `satisfactory`, `refer`, or `incomplete` — plus referral pathways.
There is no numeric score, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/newborn-and-infant-physical-examinations/[id]`) — the nine-step
  NIPE screen; classifies on submit.
- **Report** (`/newborn-and-infant-physical-examinations/[id]/report`) — outcome
  banner, interpretation, key-component table, referral pathways, and flagged
  issues; PDF via `report/pdf`.
- **Dashboard** (`/newborn-and-infant-physical-examinations`) — SVAR DataGrid of
  examined babies (client-only, `ssr = false`), filterable by examination
  context and outcome.

## Algorithm

```
each key component = refer trigger ? 'refer'
                   : all obs unexamined ? 'not-examined' : 'satisfactory'
testes             = sex != 'male' ? 'not-applicable' : (as above)

overallOutcome     = any 'refer' ? 'refer'
                   : any 'not-examined' ? 'incomplete' : 'satisfactory'
```

- eyes — red reflex (both) and external appearance
- heart — murmur, femoral pulses, central cyanosis, pre-/post-ductal saturations
- hips — Barlow, Ortolani, abduction, plus breech / family-history risk factors
- testes — both descended and palpable (boys only)

Each `refer` component emits a referral with a pathway and urgency (`same-day`
/ `within-2-weeks` / `by-6-weeks` / `review-6-8-weeks`).

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
