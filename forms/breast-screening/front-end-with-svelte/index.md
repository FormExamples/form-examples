# Breast Screening — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Breast Screening Record (NHS Breast
Screening Programme). A single continuous single-page wizard captures
eligibility, consent, the mammogram, the radiological reading outcome, and — where
the woman is recalled — a five-point breast imaging classification; the shared
pure engine derives the screening outcome and next action; and a SVAR DataGrid
dashboard lists screening records with their engine-computed outcome.

This is a result-**classification** form, not a scored screen and not a
diagnosis. The engine derives an eligibility status, then maps the reading
outcome (refined by the imaging classification after a recall) to a screening
outcome and an outcome band via a first-match pathway. There is no numeric
score, cut-off, or total.

## Surfaces

- **Welcome** (`/`) — purpose, specification, documentation, and links.
- **Wizard** (`/breast-screenings/[id]`) — the seven-step screening record;
  classifies on submit.
- **Report** (`/breast-screenings/[id]/report`) — outcome banner, recommended
  action, classification table, and flagged issues; PDF via `report/pdf`.
- **Dashboard** (`/breast-screenings`) — SVAR DataGrid of screening records
  (client-only, `ssr = false`), filterable by screening unit and outcome band.

## Algorithm

Eligibility gate (first match wins):

```
symptomatic == 'yes'                                   -> symptomatic-referral
higherRiskSurveillance == 'yes' | higher-risk episode  -> higher-risk-surveillance
routine episode & age < 50 or > 70                     -> outside-age-range
otherwise                                              -> eligible
```

Screening outcome (ordered first-match pathway):

```
symptomatic == 'yes'                       -> symptomatic-pathway-referral / referral
readingOutcome == 'technical-repeat'       -> technical-repeat / repeat
readingOutcome == 'normal-routine-recall'  -> routine-recall / routine
readingOutcome == 'recall-for-assessment':
  not assessed or classification null      -> recall-to-assessment-clinic / assessment
  classification 1-2                       -> routine-recall / routine
  classification 3                         -> short-interval-follow-up / assessment
  classification 4-5                       -> urgent-breast-clinic / urgent
otherwise                                  -> incomplete
```

Flagged issues are computed independently: symptomatic wrong-pathway (high),
suspicious/malignant class 4-5 (high), recall for assessment (medium),
indeterminate class 3 (medium), technical repeat / inadequate image (medium),
consent not given (medium), outside age range (low), overdue (low), and
incomplete record (low).

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
