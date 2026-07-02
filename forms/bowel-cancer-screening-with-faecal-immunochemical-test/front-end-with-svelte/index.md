# Bowel Cancer Screening with FIT — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the NHS Bowel Cancer Screening Programme
FIT form: a single continuous single-page wizard plus a clinician dashboard,
styled with the Lily Design System (Svelte headless) and powered by a pure
Svelte 5 classification engine.

- **Wizard** — `/fit-screenings/[id]`: seven sections (assessment context,
  participant identification, eligibility and invitation, kit return and
  adequacy, FIT result, symptoms, summary). Live result-class badge and
  management action.
- **Dashboard** — `/fit-screenings`: SVAR DataGrid with the engine-derived
  faecal haemoglobin, result class, management action, and symptomatic flag;
  filter by screening hub and result.
- **Report** — `/fit-screenings/[id]/report` with a server-generated PDF
  (`pdfmake`).

## Classification engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `bowel-fit-rules.ts`,
`bowel-fit-grader.ts`, `flagged-issues.ts`. Priority-ordered classification (not
an additive score): kit not returned or inadequate sample → repeat kit;
`faecalHaemoglobin >= thresholdApplied` (default 120 µg Hb/g) → positive →
colonoscopy; below threshold → negative → routine two-yearly recall. Red-flag
symptoms set the symptomatic pathway independently of the result class. Tests in
`bowel-fit-grader.test.ts` cover the threshold boundary (119 / 120 / 121), each
result class, non-return, spoilt, incomplete, and the symptomatic override.

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
