# Diabetes Podiatry Assessment — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Diabetes Podiatry Assessment, a
diabetic foot risk-screening record aligned with NICE NG19. A single
continuous single-page wizard captures the assessment context, patient-wide
risk factors, and a per-foot examination block for each foot (neuropathy
status, pedal pulses, deformity, callus, skin breakdown, active ulceration
and its severity, ulceration/amputation history, and a
suspected-Charcot-foot marker); the shared pure engine classifies each
foot's risk, applies patient-wide overrides, and derives an overall risk
category and review pathway; and a SVAR DataGrid dashboard lists assessed
patients with their engine-computed classification.

This is a **risk-stratification** form. The engine resolves each record to
exactly one `reviewPathway` and one `referral` via a gated, first-match
cascade over the per-foot and overall risk. There is no numeric score,
cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/diabetes-podiatry-assessments/[id]`) — the five-step
  assessment record; classifies on submit.
- **Report** (`/diabetes-podiatry-assessments/[id]/report`) — outcome
  banner, interpretation, per-foot examination, outcome detail, and flagged
  issues; PDF via `report/pdf`.
- **Dashboard** (`/diabetes-podiatry-assessments`) — SVAR DataGrid of
  assessed patients (client-only, `ssr = false`), filterable by overall risk
  and referral.

## Algorithm

The engine first classifies each foot independently — a risk-factor count
(insensate neuropathy, diminished/absent pulses, deformity, callus/skin
breakdown) maps to low / moderate / high — then applies the active-urgent
override (active ulcer or suspected Charcot) and the at-least-high override
(previous ulceration or amputation). The worse of the two feet, raised to at
least high by renal replacement therapy, becomes the overall risk, which
then routes to exactly one review pathway via a gated cascade top-to-bottom
by clinical urgency (most urgent wins):

```
worstFootRisk == 'active-urgent'                                -> urgent-mdt-referral  (interval null)
(worstFootRisk == 'high' || onRenalReplacementTherapy) && history -> high-risk-review     (1)
worstFootRisk == 'high' || onRenalReplacementTherapy             -> high-risk-review     (3)
worstFootRisk == 'moderate'                                      -> moderate-risk-review (6)
otherwise (low)                                                  -> annual-review        (12)
```

Flagged issues (active ulceration, suspected Charcot, critical limb
ischaemia, previous major amputation, renal replacement therapy, combined
risk factors, footwear, self-care, incomplete examination) are computed
independently of the pathway.

## Stack

SvelteKit 2, Svelte 5 runes, TypeScript, Tailwind CSS 4, SVAR Svelte
DataGrid, pdfmake, Vitest, and the Lily Design System (Svelte headless)
component contract. See [`AGENTS.md`](AGENTS.md) for the directory layout
and conventions.

## Commands

```sh
pnpm install
pnpm run check      # svelte-check (0 errors, 0 warnings)
pnpm run build      # production build
pnpm exec vitest run # engine unit tests
```
