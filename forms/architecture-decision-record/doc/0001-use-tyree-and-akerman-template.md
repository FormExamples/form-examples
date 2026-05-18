# 0001 — Use the Tyree & Akerman template for ADRs in this repo

- **Status:** approved
- **Group:** governance
- **Date:** 2026-05-08
- **Author:** Joel Parker Henderson <joel@joelparkerhenderson.com> (architect)
- **Organization:** formexamples/form-examples

## Issue
The medical-forms monorepo captures clinical assessments with a strict
schema: SQL migrations are the source of truth, XML/FHIR/JSON
representations are generated, and front-ends are built in HTML and
SvelteKit. To add the architecture-decision-record form, we need to
pick a template for ADRs themselves so the form's data model maps
cleanly onto a recognised ADR schema. We're picking *now* because every
sibling form already commits to a specific upstream standard
(FHIR, ASA, NEWS2…) and the ADR form should match that pattern.

## Decision
Use the Jeff Tyree & Art Akerman 14-section template (IEEE Software,
2005) for both the form's data model and the canonical Markdown
output. Author and organization metadata sit on separate tables; the
14 template sections become columns on `architecture_decision_record`
plus two child tables (`..._position`, `..._note`) for the lists that
have internal structure.

## Assumptions
A team adopting this form is willing to write down assumptions,
constraints, alternatives, and implications — not just a one-line
decision.
The form is a *documentation aid*, not a workflow tool: no notifications,
no approval routing, no centralised search.
Markdown is the canonical artefact: ADRs end up committed to a repo at
`docs/adr/NNNN-slug.md`, not stored only in this form's database.

## Constraints
Empty-string convention for unanswered text/enum fields (matches the
sibling forms in this repo).
camelCase in TypeScript/JSON, snake_case in SQL/Rust — fixed across
the monorepo.
The wizard must be one continuous single-page form (no multi-page nav)
— a repo-level rule.

## Positions
### 1. Use Michael Nygard's lightweight template
A 4-section template: Context, Decision, Status, Consequences. Widely
adopted, very low friction.

**Pros:**
- low ceremony
- familiar to most engineers
- fast to author

**Cons:**
- no first-class enumeration of alternatives
- no slot for related requirements or principles
- harder to audit decisions years later — the "why" is implicit

### 2. Use MADR (Markdown Architectural Decision Records)
A modern Markdown-first template with optional sections.

**Pros:**
- well-tooled (adr-tools, log4brains)
- composable optional sections

**Cons:**
- "optional" sections mean two teams using MADR may produce ADRs with very different shapes — hard to template a form against
- the spec moves; pinning to a version adds maintenance

### 3. Use Jeff Tyree & Art Akerman's 14-section template  ✓ chosen
A rigorous template from IEEE Software 2005: Issue, Decision, Status, Group, Assumptions, Constraints, Positions, Argument, Implications, Related Decisions/Requirements/Artifacts/Principles, Notes.
Model/diagram: <https://github.com/joelparkerhenderson/architecture-decision-record>

**Pros:**
- every section is required, so the form has a fixed shape
- alternatives ("positions") are first-class — exactly what the form needs to capture, validate, and render
- captures relationships to requirements, artifacts, and principles — matches how architecture is governed in regulated industries
- the template's own paper documents the rationale, so we can cite it

**Cons:**
- more sections to fill in than Nygard — higher friction
- the template predates Markdown ecosystem tooling
- "Group" categorisation is opinionated and may not match every org

## Argument
The form is a structured data-entry tool whose value scales with
schema rigidity. Tyree & Akerman is the most schema-friendly of the
mainstream ADR templates: every section is required, alternatives are
modelled as discrete rows, and the related-* fields give us natural
foreign-key surfaces for future cross-ADR linking. Adopting it lets
us treat each section as a column or child table, which is exactly
what `bin/generate-xml-representations.py` and
`bin/generate-fhir-r5-representations.py` expect. Nygard would have
collapsed half the form into one freeform "Context" textarea, defeating
the structured-form goal.

## Implications
Authors writing a "quick" ADR will hit 16 wizard steps. Status `pending`
exists so authors can save partial work; status `decided` is the
assertion that all sections are populated.
The Markdown output is necessarily longer than a Nygard-style ADR.
That's fine — the artefact is meant to be auditable years later, not
scanned in a hallway.
Future ADR import/export tools in the repo must round-trip this exact
format. `parseMarkdown()` in the HTML form's `app.js` is the reference
parser.

## Related Decisions
- ADR 0002 — Empty-string convention for unanswered text fields (monorepo)
- ADR 0003 — UUIDv4 primary keys with set_updated_at trigger (monorepo)
- ADR 0004 — SvelteKit 2 + Svelte 5 + Tailwind 4 for front-ends (monorepo)

## Related Requirements
- REQ-1: ADRs must round-trip cleanly between SQL, XML, FHIR JSON, Markdown
- REQ-2: Authors must enumerate at least two alternatives before status=approved
- REQ-3: Notes are append-only and timestamped

## Related Artifacts
- forms/architecture-decision-record/sql-migrations/
- forms/architecture-decision-record/front-end-form-with-html/js/app.js
- forms/architecture-decision-record/front-end-form-with-svelte/src/lib/report/build-markdown.ts

## Related Principles
- P-01 — SQL migrations are the source of truth; other formats are generated
- P-02 — One continuous single-page wizard, no multi-page forms
- P-03 — camelCase in TypeScript/JSON, snake_case in SQL/Rust
- P-04 — Empty string `''` for unanswered text/enum; `null` for unanswered numeric

## Notes
- **2026-05-08T10:00:00Z** (Joel Parker Henderson): Initial draft. Considered MADR but the optional-sections problem killed it for a structured form.
- **2026-05-08T14:00:00Z** (Joel Parker Henderson): Verified with the maintainer of joelparkerhenderson/architecture-decision-record that the 14-section template is the right primary recommendation.
- **2026-05-15T09:00:00Z** (Joel Parker Henderson): Reviewed against the implemented schema; all 14 sections map cleanly onto columns or child tables. Approved.

---
Signed off by Joel Parker Henderson on 2026-05-15T09:00:00Z.
