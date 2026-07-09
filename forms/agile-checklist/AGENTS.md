# Agile Checklist — Agent Instructions

Self-assessment that audits **57 concrete agile behaviours** organised
in three sections (Teams, Stakeholders, Practices). Each item is
answered **yes / no / not-applicable**. The engine computes a
per-section percentage of "yes" answers, a composite maturity level
(Ad-hoc / Initial / Developing / Mature / Optimising), fired
per-section rules, and operational flags (autonomy risk, trust risk,
discipline risk, finished-work risk, etc.).

See [`index.md`](./index.md) for the full design and the 5-step wizard
table. The 57 items are sourced verbatim from [`seed.md`](./seed.md).

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — the 57 checklist items (source text)
- `./doc/` — background reference notes
- `./sql/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR R5 JSON per SQL entity
- `./front-end-form-with-html/` — static single-page assessment wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page assessment wizard
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit review dashboard
- `./back-end-with-loco/` — Rust backend with
  server-rendered HTMX UI

## Scoring engine

- **Input shape:** `AgileChecklist` TypeScript type containing the
  respondent identification block plus 57 `ItemResponse` entries
  (`{ answer: 'yes' | 'no' | 'not-applicable' | '' }`), grouped by
  section.
- **Output shape:**
  ```ts
  calculateMaturity(data: AgileChecklist): {
    answeredCount: number;            // 0..57
    teamsPercent: number | null;      // 0..100, null if section unanswered
    stakeholdersPercent: number | null;
    practicesPercent: number | null;
    overallPercent: number | null;    // unweighted mean of the three sections
    maturity: 'optimising' | 'mature' | 'developing' | 'initial'
            | 'ad-hoc' | 'insufficient-data';
    sectionBands: {
      teams: 'high' | 'mid' | 'low' | 'unanswered';
      stakeholders: 'high' | 'mid' | 'low' | 'unanswered';
      practices: 'high' | 'mid' | 'low' | 'unanswered';
    };
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** per-section percentage of `yes` answers over
  applicable items (`not-applicable` excluded from denominator);
  unweighted mean of the three section percentages produces the
  composite. Thresholds in `index.md`.
- **Engine files:** `types.ts`, `factory.ts`, `items.ts` (the 57 items
  with section, ordinal, slug, text), `maturity-rules.ts`,
  `flagged-issues.ts`, `composite-grader.ts`.
- **Tests:** `composite-grader.test.ts`, `maturity-rules.test.ts`.

## Conventions

- `''` for unanswered text fields; `''` enum for unanswered selects.
- `null` for unanswered numeric fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNN<SectionName>.svelte` (1-indexed):
  `Step01Respondent.svelte`, `Step02Teams.svelte`,
  `Step03Stakeholders.svelte`, `Step04Practices.svelte`,
  `Step05Summary.svelte`.
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys
- timestamps on every table: `created_at`, `updated_at`, `deleted_at`
- localStorage autosave

## Item identifiers

Every item carries a stable identifier that survives reordering:

- `t01` … `t25` — Teams items (25)
- `s01` … `s14` — Stakeholders items (14)
- `p01` … `p18` — Practices items (18)

The SQL columns use these slugs (`t01_problems_to_solve`,
`s07_delegate_authority`, `p12_finished_over_wip`, etc.) so the
mapping from item-text in `seed.md` to schema column is unambiguous.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF
- Vitest for engine unit tests

## Dashboard stack

- SvelteKit + TypeScript table (no SVAR dependency required for this
  form; the data shape is small).
- Sortable columns, dropdown filters (maturity level, role, period).
- Backend API client with sample-data fallback for standalone
  development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Source grounding

- Beck, K. _et al._ _Manifesto for Agile Software Development_ (2001).
- Beck, K. _et al._ _Principles behind the Agile Manifesto_ (2001).
- Schwaber, K. & Sutherland, J. _The Scrum Guide_ (2020).
- Cohn, M. _Succeeding with Agile_ (2010).
- Larman, C. & Vodde, B. _Large-Scale Scrum: More with LeSS_ (2016).

## Verify

```sh
bin/test-form agile-checklist
```
