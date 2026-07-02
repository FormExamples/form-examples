# Cervical Screening — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Cervical Screening record under the UK
NHS Cervical Screening Programme (HPV primary screening with reflex cytology). A
single continuous single-page wizard captures the encounter context, patient
identification, eligibility, consent, symptoms, sample adequacy, the primary
hrHPV result, and reflex cytology; the shared pure engine classifies the result
and the management outcome; and a SVAR DataGrid dashboard lists screened
patients with their engine-computed classification.

This is a **documentation and result-classification** form. The engine resolves
each record to exactly one `resultClass` and one `managementAction` via a gated,
first-match cascade. There is no numeric score, cut-off, or band table.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/cervical-screenings/[id]`) — the nine-step screening record;
  classifies on submit.
- **Report** (`/cervical-screenings/[id]/report`) — result banner,
  interpretation, result detail, and flagged issues; PDF via `report/pdf`.
- **Dashboard** (`/cervical-screenings`) — SVAR DataGrid of screened patients
  (client-only, `ssr = false`), filterable by care setting and result class.

## Algorithm

Applied top-to-bottom; the first matching branch sets `resultClass` and
`managementAction`:

```
not eligible (age < 25 / age > 64, or ceased) -> cease-not-eligible / cease-screening
sampleAdequacy == 'inadequate'                -> inadequate / repeat-sample-3-months
hpvResult == 'negative'                       -> hpv-negative / routine-recall
hpvResult == 'positive':
  cytology 'negative'                         -> hpv-positive-cytology-normal / early-repeat-12-months
  cytology 'borderline' | 'low-grade'         -> hpv-positive-cytology-abnormal-low / colposcopy-referral
  cytology 'high-grade'                        -> hpv-positive-cytology-abnormal-high / urgent-colposcopy-referral
  else                                        -> hpv-positive-cytology-pending / awaiting-cytology
otherwise (hrHPV missing / not-tested)        -> pending / awaiting-result
```

Flagged issues (urgent colposcopy, symptomatic, missing consent, inadequate
sample, cytology outstanding, patient overdue, age outside range, incomplete)
are computed independently of the result class.

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
