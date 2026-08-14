# Architecture Decision Record — Agent Instructions

This form captures an Architecture Decision Record (ADR) using the
Tyree & Akerman 14-section template, plus authorship metadata.

## Domain

Unlike the clinical assessment forms in this repo, the ADR form is a pure
documentation aid:

- No scoring engine, no rules, no flags. Every field is text or enum.
- Lists (assumptions, constraints, implications, related-*) are stored as
  newline-separated text on the main row, except for **positions** and
  **notes**, which are 1:N tables because they have internal structure.
- "Status" is the only field with workflow significance: it gates whether the
  ADR is treated as a draft, a binding decision, or superseded.

## Tables

1. `author` — the architect or decision-maker (name, role, organization, email)
2. `organization` — the company/team context for the ADR
3. `architecture_decision_record` — main row, 14 Tyree & Akerman fields plus
   metadata (slug, title, status, group, decision date, sign-off)
4. `architecture_decision_record_position` — alternatives considered (1:N);
   each row has `name`, `description`, `model_or_diagram_url`,
   `is_chosen` (boolean)
5. `architecture_decision_record_note` — discussion notes captured during
   socialization (1:N); each row has `noted_at`, `noted_by`, `body`

All tables follow the repo conventions: UUIDv4 primary keys, `created_at` and
`updated_at` timestamps, `deleted_at` for soft delete on root entities,
`set_updated_at()` trigger on every table.

## Field conventions

- Empty string `''` for unanswered text/enum fields
- `null` for unanswered numeric fields (none in this form)
- Enums use lowercase-hyphenated values (e.g. `pending`, `decided`,
  `approved`, `superseded`, `deprecated`)
- camelCase in TypeScript / JSON; snake_case in SQL and Rust;
  `serde(rename_all = "camelCase")` on shared structs

## Wizard

16 steps, Step components named `StepNName.svelte` (1-indexed). Single-page,
no multi-page navigation. The user can move freely between steps.

## Status enum

```
pending      — drafting, not yet socialised
decided      — author has chosen, awaiting review
approved     — formally accepted
superseded   — replaced by a later ADR (link via related-decisions)
deprecated   — no longer relevant; preserved for history
```

## Group enum

Tyree & Akerman suggest organizing by architectural concern. We use:

```
business         — business architecture
data             — data architecture
integration      — system integration
presentation     — UI / UX
security         — authn, authz, secrets
infrastructure   — hosting, networking, deployment
operations       — observability, runbooks, incident response
governance       — policy, compliance, risk
other
```

## Output

- **Markdown** report at `/report` — copy-paste into `docs/adr/NNNN-slug.md`
- **FHIR R5 JSON** Bundle — Composition resource with sections matching the
  14 Tyree & Akerman headings; Practitioner for author; Organization for org
- **XML** — column-per-element, one file per table, with DTD

## Stack

- Front-end SvelteKit 2.x + Svelte 5 runes + Tailwind 4 + pdfmake (for PDF)
- Front-end HTML: static HTML + Alpine.js, classic `<script>` tags so it
  works from `file://`
- Back-end: Rust edition 2024, Loco 0.16, axum 0.8, SeaORM 1.1 (JSON API)
  2.0.8, Alpine.js 3.14.8

## What this form is NOT

- Not a workflow tool. It does not push notifications, route reviews, or
  enforce approval chains.
- Not a search index. The dashboard is read-only and locally scoped.
- Not Markdown Architectural Decision Records (MADR) — that's a different
  template. This is specifically Tyree & Akerman.
