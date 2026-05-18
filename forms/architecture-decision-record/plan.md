# Architecture Decision Record — Plan

Status: scaffolded 2026-05-08.

## Why this form

Architecture decisions get lost. Teams agree to something in a meeting,
ship it, and three years later nobody remembers why. The Tyree & Akerman
template forces the author to write down the alternatives, the rationale,
and the implications — so the next architect can audit the decision rather
than guess at it.

This form provides a single-page wizard so an author can capture all 14
sections of the template in one sitting and produce a Markdown ADR ready
to commit.

## Design principles

- **Documentation, not workflow.** No approvals, no notifications, no
  routing. The form produces an ADR; humans handle review out of band.
- **Full Tyree & Akerman, not lite.** Every section is required at draft
  time. Status `pending` lets authors save partial work; status `decided`
  asserts all sections are populated.
- **Markdown is the canonical output.** SQL is the source of truth, but
  the Markdown rendering is what gets committed to source control.
- **Alternatives are first-class.** The "positions" table is 1:N because
  enumerating alternatives is the whole point — collapsing them to a text
  blob undermines the template.
- **Notes are append-only.** Discussion captured during socialisation is
  timestamped and never edited. This preserves the audit trail.

## Build order

1. [x] `bin/create-form architecture-decision-record`
2. [x] `index.md`, `AGENTS.md`, `plan.md`, `tasks.md`
3. [x] SQL migrations (extensions, set_updated_at, author, organization,
       architecture_decision_record, ..._position, ..._note)
4. [ ] XML + DTD per table via `bin/xml-representations/generate-xml-representations.py`
5. [ ] FHIR R5 JSON per table via `bin/fhir-r5/generate-fhir-r5-representations.py`
6. [ ] Front-end form (HTML + Alpine.js)
7. [ ] Front-end form (SvelteKit + Svelte 5 + Tailwind 4)
8. [ ] Front-end dashboard (HTML, decision register table)
9. [ ] Front-end dashboard (SvelteKit + SVAR DataGrid)
10. [ ] Full-stack (Rust + Loco + Tera + HTMX + Alpine.js)
11. [ ] `bin/test-form architecture-decision-record` passes

## Output formats

- Markdown — the canonical ADR rendering for `docs/adr/NNNN-slug.md`
- FHIR R5 Bundle — Composition + Practitioner + Organization
- XML — one file per table, column-per-element

## Out of scope

- Diagrams. Authors link to external diagrams via URL fields; we don't
  embed an editor.
- Multi-author. One ADR has one author; co-authors go in the notes.
- Numbering / slug generation. The author picks the slug.
- Search across ADRs. The dashboard is a flat register, not an index.
