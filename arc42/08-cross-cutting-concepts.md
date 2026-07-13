# 8. Cross-cutting Concepts

## 8.1 Data model

Every form's `sql/` follows one relational pattern (see
[§5.4](05-building-block-view.md) for the worked example):

- **Shared entities.** `patient` (demographics) and `clinician` are the same
  shape across forms — UUID PK, the timestamp trio, domain columns.
- **Core record.** `<form>` holds the submitted questionnaire answers.
- **Grading trio.** `<form>_grade` (1:1 computed result — scoring axes, bands,
  recommendation, sign-off), `<form>_grade_rule` (1:N audit of every fired
  scoring rule: `rule_id`, `axis`, `category`, `description`), and
  `<form>_grade_flag` (1:N safety-critical flags fired independently of the
  axes: `flag_id`, `category`, `priority`, `description`, `suggested_action`).
- **Extension tables.** Richer domains add relational child tables (e.g.
  operation-note team members, procedures, implants) — the schema grows by
  adding tables, not by widening one (see [ADR-1](09-architecture-decisions.md)).

Repo-wide conventions applied to every table:

- **UUIDv4 primary keys** via `gen_random_uuid()`.
- **Timestamp trio** on every table: `created_at`, `updated_at`, `deleted_at`
  (soft delete), with a `set_updated_at()` trigger.
- **Empty-value sentinels:** `''` for unanswered text and enum fields (the
  `CHECK (x IN ('', …))` list includes the empty sentinel); `null` for
  unanswered numeric, date, and time fields — so an in-progress draft never
  violates `NOT NULL` and never diverges the grader.
- **Naming boundary:** `snake_case` in SQL and Rust internals; `camelCase` on
  the wire via `serde(rename_all = "camelCase")`.

## 8.2 The Lily Design System

Lily is a **headless** design system consumed as a **contract**, not a runtime
dependency, in two paired flavours:

- **HTML headless** — a specification of accessible, framework-free HTML
  components (class name, ARIA, `data-*`, keyboard behaviour). Forms conform to
  the class vocabulary; nothing is installed or bundled.
- **Svelte headless** — a library of Svelte 5 components that emit the *same*
  class names. Each form mirrors the API locally in `src/lib/components/ui/`.

Both share one class vocabulary (`form`, `field`, `fieldset`, `text-input`,
`radio-group`, `step-list`, `button`, `error-summary`, `data-table`, `panel`,
…) so a single stylesheet serves both stacks. The upstream commit is pinned
(`forms/lily-version.md`, `forms/lily-svelte-version.md`); snapshots live in
`forms/lily-spec/` and `forms/lily-svelte-spec/`, refreshed by `bin/lily-sync`
and `bin/lily-svelte-sync`.

## 8.3 The generator pipeline and drift gates

SQL is the source of truth; Python generators project it to XML/DTD, FHIR R5
JSON, Protocol Buffers, OpenAPI 3.1, and the Loco scaffold script (see
[§4.2](04-solution-strategy.md), [§6.3](06-runtime-view.md)). Generators are
**deterministic and idempotent**: correct regeneration yields zero diff. Every
generator and mechanical refactor exposes a `--check` mode used as a CI **drift
gate** — it re-runs generation in dry-run and exits non-zero if any output would
change. This turns "the artefacts match the source" into an executable test.

## 8.4 Scoring engines (three mirrored implementations)

Grading logic is a **pure engine** decomposed into small files —
`types → rules → grader → flagged-issues` — implemented identically in the HTML
front-end (`js/`), the Svelte front-end (`src/lib/engine/`), and the Rust
back-end (`src/<snake>/engine/`). All three use the **same rule IDs and flag
IDs**, so their outputs agree. Purity makes each unit-testable (Vitest / cargo
test). The engine's output — `firedRules[]` + `additionalFlags[]` + bands/scores
— is what the report renders and what the `_grade` / `_grade_rule` /
`_grade_flag` tables persist.

## 8.5 Accessibility

Accessibility is a first-class quality goal (WCAG 2 AA), identical across the
HTML and Svelte front-ends per the Lily contract:

- one visible `<h1>` per page; every input has an associated `<label>`;
- a skip link at the top of the body;
- submit-time validation with an `.error-summary` that takes focus, per-field
  `.error-message`, and `aria-invalid` / `aria-describedby` wiring;
- the wizard step list reflects the current step via `aria-current="step"` and
  `data-status`; the report region is `role="region"` `aria-live="polite"`;
- full keyboard operation (stepping, radio/checkbox choice, dialog open/close);
- AA colour contrast on all interactive states.

## 8.6 Import / export

Every form supports data interchange via **JSON, XML, CSV, and TSV**, plus the
generated **FHIR R5 Bundle** samples and **Protocol Buffers** schemas for
system-to-system exchange. Drafts persist client-side in LocalStorage under
`<slug>.front-end-with-html.v1` / `<slug>.front-end-with-svelte.v1` (the shared
key shape lets a draft move between the two front-end stacks).

## 8.7 Spec-driven development

The governing process: update the spec (`spec.md` or `forms/<slug>/spec/index.md`)
first; then update `sql/` if data shape changed; regenerate derived artefacts;
update front-ends and back-end to satisfy the new spec; update `tasks.md`; and
verify with `bin/test-form <slug>` and `bin/test`. Generated artefacts are never
hand-edited. This keeps a single authoritative contract that the implementation
must satisfy (`spec.md` §10).
