# Newborn Blood Spot Screening — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the NHS Newborn Blood Spot (heel-prick)
Screening record. A single continuous single-page wizard captures the sample
event and its quality, eligibility and consent, and a per-condition result for
nine screened conditions; the shared pure engine classifies each condition and
derives the overall screening outcome by precedence; and a SVAR DataGrid
dashboard lists screened babies with their engine-computed outcome.

This is a **documentation and result-classification** form. Each of the nine
conditions carries one result class (`not-suspected`, `suspected`, `carrier`,
`repeat-required`, `declined`, `pending`); the engine derives the overall
outcome — `all-not-suspected`, `referral-required`, `repeat-required`,
`incomplete`, or `declined-only-outstanding` — plus a referral status. There is
no numeric score, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/newborn-blood-spot-screenings/[id]`) — the seven-step blood spot
  record; classifies on submit.
- **Report** (`/newborn-blood-spot-screenings/[id]/report`) — outcome banner,
  interpretation, condition-result table, urgent referrals, and flagged issues;
  PDF via `report/pdf`.
- **Dashboard** (`/newborn-blood-spot-screenings`) — SVAR DataGrid of screened
  babies (client-only, `ssr = false`), filterable by outcome and referral status.

## Algorithm

Overall outcome precedence (first match wins, top to bottom):

```
any suspected            -> 'referral-required'   (urgent referral)
any repeat-required      -> 'repeat-required'      (repeat sample)
any pending/outstanding  -> 'incomplete'
any declined (rest ok)   -> 'declined-only-outstanding'
otherwise                -> 'all-not-suspected'    (routine)
```

- Nine conditions: SCD, CF, CHT, PKU, MCADD, MSUD, IVA, GA1, HCU.
- `carrier` is valid for SCD only; a carrier on any other condition is a
  data-validity flag and is treated as outstanding.
- Every `suspected` condition emits an urgent `Referral` to its specialist
  service.
- Sample quality derives `withinWindow` (day 5–8) and `avoidableRepeat`.

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
