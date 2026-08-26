# Architecture Decision Record (Tyree & Akerman)

A structured form for capturing an Architecture Decision Record (ADR) using
the Jeff Tyree & Art Akerman template ("Architecture Decisions: Demystifying
Architecture", IEEE Software, 2005). The form walks an architect through a
single-page, 16-step wizard, captures all 14 sections of the canonical
template plus authorship metadata, and produces an ADR document as Markdown,
FHIR R5–style structured JSON, and XML.

The Tyree & Akerman template is one of the most cited ADR templates because
it is more rigorous than the lightweight Michael Nygard template: it forces
the author to enumerate alternatives ("positions"), the rationale
("argument"), and the impact on related decisions, requirements, artifacts,
and principles.

This form is intentionally text-heavy. It is not a clinical assessment, not a
scoring engine, and not a diagnostic tool. It is a documentation aid for
architecture governance.

## Sections (Tyree & Akerman, 14)

1. **Issue** — the architectural design issue being addressed; why now
2. **Decision** — the position chosen, stated clearly
3. **Status** — pending, decided, approved, superseded, or deprecated
4. **Group** — category (integration, presentation, data, security, etc.)
5. **Assumptions** — environmental factors influencing the decision
6. **Constraints** — environmental limits imposed by the decision
7. **Positions** — viable alternatives considered, each with rationale
8. **Argument** — why this position was chosen over the others
9. **Implications** — consequences, follow-on decisions, scope/schedule impact
10. **Related Decisions** — other ADRs this one depends on or supersedes
11. **Related Requirements** — business/functional requirements addressed
12. **Related Artifacts** — designs, models, or scope documents impacted
13. **Related Principles** — enterprise principles this aligns with or breaks
14. **Notes** — discussion log captured during socialization

## Wizard layout (16 steps)

1. Author identification
2. Organization & context
3. Issue
4. Decision
5. Status & group
6. Assumptions
7. Constraints
8. Positions (alternatives)
9. Argument
10. Implications
11. Related decisions
12. Related requirements
13. Related artifacts
14. Related principles
15. Notes
16. Summary, review status, sign-off

## Output

- **Markdown** — the canonical ADR document, suitable for committing to a
  repository under `docs/adr/NNNN-<slug>.md`.
- **FHIR R5 JSON** — structured Bundle with author, organization, and the
  decision record itself encoded as Composition + extensions.
- **XML** — column-per-element representation matching the SQL schema.

## Workflow

The form ships in three independent flavours that share the same SQL
schema and the same canonical Markdown format. Pick the one that fits
where in the team's lifecycle the ADR is being captured.

### Author a new ADR

1. Open one of the wizards:
   - `front-end-with-html/index.html` — static, opens from
     `file://`, no build step
   - `front-end-with-svelte/` — `pnpm dev`, then visit
     `http://localhost:5173`
   - `back-end-with-loco/` — `cargo loco start`,
     then visit `http://localhost:5150/architecture_decision_records/new`
2. Fill the 16-step wizard. The HTML and SvelteKit forms autosave to
   `localStorage` under `adr.form.v1` as you type. The Loco backend
   auto-numbers and auto-slugs the row on submit.
3. Click **Generate Markdown ADR**. Copy the output or download the
   `.md` file into `docs/adr/NNNN-slug.md` in your project repo.

### Edit a committed ADR

1. Open a wizard.
2. Click **Import .md** and pick the committed file.
3. The wizard is populated from the Markdown (HTML and SvelteKit only —
   the Loco wizard edits the row directly via `/edit`).
4. Re-generate Markdown when done; commit the updated file.

### Browse the register

- `front-end-with-html/index.html` — static, reads sample
  data from `js/data.js`. Replace with a generated `data/adrs.json`
  when wiring to a real backend.
- `front-end-with-svelte/` — sortable / filterable register
  with status pills. Set `VITE_API_BASE_URL=http://localhost:5150` in
  `.env.local` to read live from the Loco backend's `/api/adrs`
  endpoint. Clicking a row navigates to `/{slug}` for an inline
  Markdown view.

### Run the backend

```sh
cd back-end-with-loco
cargo loco db migrate
cargo loco start
```

Routes:

- `GET  /architecture_decision_records` — register HTML
- `GET  /architecture_decision_records/new` — minimal new-draft form
- `GET  /architecture_decision_records/:id` — read-only ADR view with
  status banners (superseded / deprecated / pending)
- `GET  /architecture_decision_records/:id/edit` — 16-section wizard
- `GET  /architecture_decision_records/:id/markdown` — rendered ADR as
  `text/markdown`
- `GET  /api/adrs` — JSON register for the SvelteKit dashboard
- `GET  /api/adrs/:slug` — JSON view (metadata + rendered Markdown)
- HTMX partials at `/architecture_decision_records/:id/positions` and
  `/architecture_decision_records/:id/notes` for inline child-table
  edits in the wizard

## Directory structure

```
architecture-decision-record/
  index.md
  AGENTS.md
  CLAUDE.md
  plan.md
  tasks.md
  doc/                                          References and template source
  sql/                                PostgreSQL Liquibase migrations
  xml/                           XML + DTD per SQL table
  fhir/r5/                                       FHIR HL7 R5 JSON per SQL table
  front-end-with-html/                      Static HTML + Alpine.js wizard
  front-end-with-svelte/                    SvelteKit 2 + Svelte 5 wizard
  front-end-with-html/                 Decision register (HTML table)
  front-end-with-svelte/               Decision register (SVAR Grid)
  back-end-with-loco/         Rust + Loco JSON API
```

## References

- Jeff Tyree & Art Akerman, "Architecture Decisions: Demystifying
  Architecture", *IEEE Software*, March/April 2005.
- joelparkerhenderson/architecture-decision-record — canonical template
  source: <https://github.com/joelparkerhenderson/architecture-decision-record>
- Michael Nygard, "Documenting Architecture Decisions", 2011 — lighter
  alternative template.
