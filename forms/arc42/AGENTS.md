# arc42 Architecture Documentation Form — Agent Instructions

Single-page wizard that guides an architect through the **12 sections of the
arc42 template**, scores completeness on a 0–3 scale per section, computes an
overall maturity (Draft / Developing / Established / Optimised), fires
section-specific flags, and emits a gap-action-plan report.

See [`index.md`](./index.md) for the full design, the 14-step wizard table, and
the completeness-flag table.

## Directory map

- `./index.md` — project overview
- `./AGENTS.md` — this file (referenced by `CLAUDE.md`)
- `./plan.md` — development roadmap and status
- `./tasks.md` — task tracking
- `./doc/` — reference documentation (arc42 overview, completeness rules,
  maturity rules, ADR format, safety-case notes)
- `./sql-migrations/` — Liquibase-formatted Postgres schema
- `./xml-representations/` — generated XML + DTD per SQL table
- `./fhir-r5/` — generated FHIR HL7 R5 JSON per SQL entity
- `./front-end-form-with-html/` — static single-page architect wizard
- `./front-end-form-with-svelte/` — SvelteKit single-page architect wizard
- `./front-end-dashboard-with-html/` — HTML review table
- `./front-end-dashboard-with-svelte/` — SvelteKit SVAR DataGrid dashboard
- `./full-stack-with-loco-tera-htmx-alpine/` — Rust backend with
  server-rendered HTMX UI

## Scoring engine

- **Input shape:** `Arc42Assessment` TypeScript type containing:
  - `respondent` — `RespondentBlock` (name, role, systemName, organisation,
    reviewDate, arc42Version)
  - `sections` — array of 12 `SectionResponse` objects
    (`{ sectionId: 1..12; score: 0|1|2|3|null; notes: string }`)
  - `stakeholders` — `Stakeholder[]` (name, role, concern)
  - `adrs` — `ArchitecturalDecisionRecord[]`
  - `glossaryTerms` — `GlossaryTerm[]`
  - `risks` — `Risk[]`

- **Output shape:**
  ```ts
  calculateMaturity(data: Arc42Assessment): {
    answeredCount: number;             // 0..12
    totalScore: number | null;         // null if fewer than 4 sections answered
    maturity: 'optimised' | 'established' | 'developing' | 'draft'
            | 'insufficient-data';
    perSectionScores: Array<{ sectionId: number; score: 0|1|2|3|null }>;
    firedRules: FiredRule[];
    additionalFlags: AdditionalFlag[];
    topGaps: number[];                 // up to 3 sectionIds with lowest scores
  }
  ```

- **Algorithm:** unweighted sum of answered section scores; thresholds in
  `index.md`. Each section below 2 fires its own coaching rule; a score of 0
  on a high-priority section raises a high-priority flag.

- **Engine files:** `types.ts`, `factory.ts`, `sections.ts`,
  `completeness-rules.ts`, `maturity-rules.ts`, `flagged-issues.ts`,
  `composite-grader.ts`.

- **Tests:** `composite-grader.test.ts`, `completeness-rules.test.ts`.

## Conventions

- Empty string `''` for unanswered text fields.
- `null` for unanswered numeric / score fields.
- camelCase property names in TypeScript.
- snake_case in SQL and Rust.
- Step components named `StepNNName.svelte` (1-indexed, zero-padded to two
  digits). Steps 02–13 correspond to arc42 sections 1–12; step 01 is respondent
  identification and step 14 is the summary.
- UI components in `src/lib/components/ui/`.
- `serde(rename_all = "camelCase")` on Rust structs shared with the front-end.
- UUIDv4 primary keys; `created_at` + `updated_at` timestamps on every table.

## Front-end SvelteKit stack

- SvelteKit 2.x + TypeScript
- Svelte 5 runes (`$state`, `$derived`, `$bindable`, `$props`)
- Tailwind CSS 4 with `@import 'tailwindcss'` and `@theme`
- `pdfmake` for client-side PDF
- Vitest for engine unit tests

## Dashboard stack

- SvelteKit + SVAR DataGrid (`@svar-ui/svelte-grid`) with the Willow theme.
- Sortable columns, dropdown filters (maturity level, system name, review date).
- Backend API client with sample-data fallback for standalone development.

## Backend stack

- Rust edition 2024
- Loco 0.16 framework on axum 0.8
- SeaORM 1.1 with PostgreSQL
- Tera templates with HTMX 2.0.8 and Alpine.js 3.14.8
- `serde(rename_all = "camelCase")` for front-end interop

## Source grounding

- Starke, G. & Hruschka, P. *arc42 — Architecture Documentation Template*.
  <https://arc42.org/>.
- Starke, G. *Effective Software Architectures: A Practical Guide*. Hanser, 2023.
- Nygard, M. "Documenting Architecture Decisions." *Cognitect Blog*, 2011.

## Compliance

This form is non-clinical. ISO/IEC/IEEE 26514:2022 (information for users) is
followed for documentation quality.

## Verify

```sh
bin/test-form arc42
```
