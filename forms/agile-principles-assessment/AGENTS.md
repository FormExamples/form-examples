# Agile Principles Assessment — Agent Instructions

Self-assessment of an organisation's adoption of the **12 Agile Manifesto
principles**. Collects a Likert score (1–5) plus optional comment per
principle, then computes a composite agility maturity level
(Ad-hoc / Initial / Developing / Mature / Optimising), fires per-principle
rules, and emits operational flags (burnout risk, technical-debt risk,
command-and-control, etc.).

See [`index.md`](./index.md) for the full design and the 14-step wizard
table. The 12 principles are sourced verbatim from
[`seed.md`](./seed.md).

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./seed.md` — the 12 Agile Manifesto principles (source text)
- `./doc/` — background reference notes
- `./sql-migrations/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR R5 JSON per SQL entity
- `./front-end-form-with-html/` — static single-page assessment wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page assessment wizard
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit review dashboard
- `./full-stack-with-loco-tera-htmx-alpine/` — Rust backend with
  server-rendered HTMX UI

## Scoring engine

- **Input shape:** `AgileAssessment` TypeScript type containing the
  respondent identification block plus 12 `PrincipleResponse` objects
  (`{ score: 1|2|3|4|5|null; comment: string }`).
- **Output shape:**
  ```ts
  calculateMaturity(data: AgileAssessment): {
    answeredCount: number;        // 0..12
    meanScore: number | null;     // null if fewer than 6 answered
    maturity: 'optimising' | 'mature' | 'developing' | 'initial'
            | 'ad-hoc' | 'insufficient-data';
    perPrincipleBands: Array<'high' | 'mid' | 'low' | 'unanswered'>;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
  }
  ```
- **Algorithm:** unweighted mean of answered principle scores; thresholds in
  `index.md`. Each principle below 3 fires its own coaching rule; any score
  of 1 raises a critical-gap flag.
- **Engine files:** `types.ts`, `factory.ts`, `principles.ts`,
  `maturity-rules.ts`, `flagged-issues.ts`, `composite-grader.ts`.
- **Tests:** `composite-grader.test.ts`, `maturity-rules.test.ts`.

## Conventions

- Empty string `''` for unanswered text fields.
- `null` for unanswered numeric / Likert fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNN<PrincipleName>.svelte` (1-indexed). The
  twelve principle steps are numbered 02–13 to match the canonical ordering;
  step 01 is respondent identification and step 14 is summary.
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the
  front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` timestamps on every
  table.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF
- Vitest for engine unit tests

## Dashboard stack

- SvelteKit + TypeScript table (no SVAR dependency required for this form;
  the data shape is small).
- Sortable columns, dropdown filters (maturity level, role).
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Source grounding

- Beck, K. *et al.* *Manifesto for Agile Software Development* (2001).
- Beck, K. *et al.* *Principles behind the Agile Manifesto* (2001).
- Schwaber, K. & Sutherland, J. *The Scrum Guide* (2020).
- Cohn, M. *Succeeding with Agile* (2010).

## Verify

```sh
bin/test-form agile-principles-assessment
```
