# 2. Architecture Constraints

## 2.1 Process constraints

| Constraint | Rationale |
| ---------- | --------- |
| **Spec before code.** The system spec (`spec.md`) and each form's domain spec (`forms/<slug>/spec/index.md`) are updated *before* the implementation. Code changes because the spec changed. | Keeps a singular, authoritative contract; makes the repo amenable to spec-driven development (`spec.md` §10). |
| **Generated artefacts are never hand-edited.** `xml/`, `fhir/r5/`, `protobuf/`, `openapi/`, and `back-end-with-loco-setup` are regenerated; hand-edits are overwritten on the next run. | The test of correctness is *regeneration idempotency* — a hand-edit would be silently lost, so it is forbidden. |
| **SQL is the single source of truth for data shape.** All representations derive from `forms/<slug>/sql/`. | One authoritative schema; no divergence between representations. |
| **Per-form independence.** Each form is self-contained; there is no shared runtime and no unified backend serving every form. Each Loco crate is independently buildable and deployable. | Domains evolve independently; a change to one form cannot break another at runtime. |
| **Single-page wizard.** The whole questionnaire lives on one URL; no multi-page forms. | UX contract in `spec.md` §5; drafts are resumable via LocalStorage autosave. |
| **Fully scrollable page.** No fixed or sticky header/footer; page chrome scrolls with the content. | Guarantees the entire form is reachable by scrolling on any viewport. |

## 2.2 Technology constraints

| Layer | Constraint |
| ----- | ---------- |
| **Database** | PostgreSQL 18; UUIDv4 primary keys via `gen_random_uuid()`; `created_at` / `updated_at` / `deleted_at` timestamps on every table; migrations in numbered `NN_create_table_<name>.sql` files. |
| **Back-end** | Rust (edition 2024) + axum 0.8 + Loco 0.16 + SeaORM 1.1. **JSON API only** — no Tera templates, no HTMX, no Alpine.js, no static assets, no Lily/CSS. Postgres-backed background queue only (`bg_pg`; not `bg_sqlt`/`bg_redis`). OpenTelemetry (OTLP) + Prometheus `/metrics`. |
| **Front-end (HTML)** | Framework-free HTML + the **Lily Design System HTML headless** class contract. No build step; pages work over `file://`. Classic `<script>` tags only — no modules, no bundler. |
| **Front-end (Svelte)** | SvelteKit + Svelte 5 runes + Tailwind CSS 4 + SVAR DataGrid, conforming to the **Lily Design System Svelte headless** component contract. RESTful routes nested under `src/routes/<slug>/`. |
| **Generators** | Python 3 scripts under `bin/`; deterministic and idempotent. |
| **Lily** | Consumed as a **spec (contract)**, not a runtime library, in both HTML and Svelte flavours; the upstream commit is pinned (`forms/lily-version.md`, `forms/lily-svelte-version.md`). |

## 2.3 Naming and value conventions (repo-wide)

- `camelCase` on the wire (TypeScript and Rust serde via `serde(rename_all = "camelCase")`); `snake_case` in SQL and Rust internals.
- Empty string `''` for unanswered text and enum fields; `null` for unanswered numeric, date, and time fields (so in-progress drafts never violate `NOT NULL`).
- Import and export via JSON, XML, CSV, and TSV.

## 2.4 Regulatory constraints

Every form attests to the following, and per-form `index.md` / `spec/index.md`
records the declared device classification (escalated where output drives
clinical decisions, e.g. ASA grading):

- [MDCG 2019-11 Rev.1 — EU MDR/IVDR software classification](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)
- [UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)
- [ISO/IEC/IEEE 26514:2022 — Design and development of information for users](https://www.iso.org/standard/77451.html)
- [UK MHRA — Software and AI as a medical device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)
