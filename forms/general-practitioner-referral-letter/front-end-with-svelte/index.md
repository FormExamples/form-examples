# General Practitioner Referral Letter — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the General Practitioner Referral Letter: a
single continuous single-page wizard plus a referrals dashboard, styled with the
Lily Design System (Svelte headless) and powered by a pure Svelte 5
completeness / urgency-classification engine.

This is a documentation-completeness and urgency-classification instrument,
**not** a scored assessment. The engine grades a referral `Complete` or
`Incomplete`, reports a completeness percentage, echoes its urgency (`routine`,
`urgent`, `two-week-wait` suspected cancer, or `emergency`), records which
mandatory fields are present, and raises flags. There is no numeric clinical
score. The urgency is always echoed — even when the referral is incomplete — so
the correct pathway is never hidden. It checks the *letter*, not the patient.

- **Wizard** — `/general-practitioner-referral-letters/[id]`: nine sections
  (referrer details, patient identification, referral destination, urgency,
  reason and history, examination and investigations, medications and allergies,
  expectations / consent / safety-netting, summary and review). The urgency
  section is conditional — the urgency-reason field appears for any non-routine
  urgency, and the NICE NG12 suspected-cancer criterion and pathway fields appear
  for two-week-wait referrals.
- **Dashboard** — `/general-practitioner-referral-letters`: SVAR DataGrid with
  the engine-derived urgency, completeness status, specialty, and flag count;
  filter by urgency and status.
- **Report** — `/general-practitioner-referral-letters/[id]/report` with a
  server-generated PDF (`pdfmake`).

## Completeness / urgency engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `gp-referral-rules.ts`,
`gp-referral-grader.ts`, `flagged-issues.ts`. Completeness is checked against a
mandatory-field set whose membership depends on the selected urgency: ten
always-mandatory fields (patient identifier / name / date of birth, referrer
name / role / practice, referral specialty, urgency, reason for referral,
relevant history), plus an urgency reason for urgent and two-week-wait, plus a
named suspected-cancer criterion and pathway for two-week-wait. `status` is
`Complete` only when every applicable mandatory field is present, otherwise
`Incomplete`; `completenessPercent` is computed from the same set. Urgency is
echoed straight through. Six independent flags cover the safety-critical
signals (suspected-cancer pathway, emergency features, mandatory information
missing, urgency information missing, consent not documented, no safety-netting).
Tests in `gp-referral-grader.test.ts`.

## Stack

SvelteKit 2 + Svelte 5 runes + Tailwind CSS 4 + Vitest. SVAR DataGrid for the
dashboard. See [`../../AGENTS-front-end-svelte.md`](../../AGENTS-front-end-svelte.md)
for the Lily Svelte headless component contract.

## Commands

```sh
pnpm install
pnpm run check       # svelte-check: 0 errors, 0 warnings
pnpm run build       # production build
pnpm exec vitest run # engine unit tests
```
