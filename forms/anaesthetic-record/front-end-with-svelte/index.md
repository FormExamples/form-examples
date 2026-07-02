# Anaesthetic Record — SvelteKit front-end (form + dashboard)

Consolidated SvelteKit front-end for the Anaesthetic Record: the
intra-operative anaesthesia chart. A single continuous single-page wizard plus a
clinician dashboard, styled with the Lily Design System (Svelte headless) and
powered by a pure Svelte 5 completeness engine.

This is a **multi-table documentation form**: a parent record plus three
one-to-many child lists — drug administrations, timed physiological
observations, and intra-operative events. The engine grades **completeness**
(Complete / Partial / Incomplete) with a completeness percent and, independently,
raises safety flags. It is not a numeric severity score.

- **Wizard** — `/anaesthetic-records/[id]`: twelve sections (case
  identification, pre-induction checks, ASA & airway, drugs & doses [repeating],
  airway management, monitoring, timed observations [repeating], fluids & blood
  loss, regional / neuraxial, events & complications [repeating], recovery
  handover, summary & sign-off). Live completeness status and percent.
- **Dashboard** — `/anaesthetic-records`: SVAR DataGrid with the engine-derived
  completeness status, completeness percent, and safety-flag count; filter by
  urgency and status.
- **Report** — `/anaesthetic-records/[id]/report` with a server-generated PDF
  (`pdfmake`).

## Completeness engine

`src/lib/engine/`: `types.ts`, `utils.ts`, `anaesthetic-record-rules.ts`,
`anaesthetic-record-grader.ts`, `flagged-issues.ts`. A fixed set of
mandatory-item rules, each tagged critical or non-critical. Any critical item
missing → Incomplete; else any non-critical missing → Partial; else Complete.
`completenessPercent` = round(100 × satisfied / total). Safety flags
(WHO checklist, allergy conflict, difficult airway, anaphylaxis, unlogged
consent, physiological derangement, incomplete) are computed independently.
Tests in `anaesthetic-record-grader.test.ts`.

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
