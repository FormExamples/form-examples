# Specification — Medical Forms monorepo

This file is the **living, comprehensive specification** of the medical-forms
monorepo. It exists to make the project amenable to **spec-driven
development**: the spec is read before code is written, and code is changed
*because* the spec changed — not the other way around.

This file is the top-level system spec. Each form's domain spec lives in
[`forms/<slug>/spec/index.md`](forms/AGENTS.md); together they form the contract
that the implementation must satisfy.

## 1. Purpose

A monorepo of single-page, step-by-step medical questionnaires. Each form:

- collects structured clinical or administrative data,
- applies a validated scoring or grading engine,
- emits a report (HTML preview, PDF download, FHIR R5 Bundle, XML),
- generates safety-critical flags from rule-firing,
- carries compliance attestations for medical-device classification.

The monorepo exists to show that *one* shared design — schema, validation
pattern, accessibility contract, scoring engine layout — works across more
than a hundred distinct clinical domains.

## 2. Scope

In scope:

- Per-form schema (SQL migrations as the source of truth for data shape).
- Generated representations (XML, FHIR R5 JSON, Protocol Buffers, OpenAPI).
- Four front-ends per form (form + dashboard, each in HTML and SvelteKit).
- One Rust back-end JSON API implementation per form (axum + Loco).
- Cross-cutting documentation, agent instructions, and verification.

Out of scope (today):

- Hosted deployment, infrastructure, authentication, multi-tenancy.
- A unified backend serving every form (each crate is independent).
- Internationalisation beyond English + Welsh (planned in `plan.md`).

## 3. Architecture

### 3.1 Source-of-truth layering

```
forms/<slug>/index.md           (human-readable design)
        │
        ▼
forms/<slug>/spec/index.md      (machine + human spec; the contract)
        │
        ▼
forms/<slug>/sql-migrations/    (source of truth for DATA SHAPE)
        │                       Generates ↓
        ├──► xml-representations/         (XML + DTD)
        ├──► fhir-r5/                     (FHIR HL7 R5 JSON)
        ├──► protobuf/                    (.proto schemas)
        └──► openapi/                     (OpenAPI 3.1 .yaml)
```

```
forms/<slug>/spec/index.md      (source of truth for BEHAVIOUR)
        │
        ├──► front-end-with-html/             (HTML wizard + dashboard, one dir)
        ├──► front-end-with-svelte/           (SvelteKit app; /<plural>/ list + /<plural>/[id] form)
        └──► back-end-with-loco/              (Rust JSON API back-end)
```

**Rule:** generated artefacts are never hand-edited. Hand-edits to
`xml-representations/`, `fhir-r5/`, `protobuf/`, or `openapi/` will be
overwritten by the next regenerator run; the test of correctness is
regeneration idempotency.

### 3.2 Cross-layer contracts

| From            | To              | Contract                                                  |
| --------------- | --------------- | --------------------------------------------------------- |
| SQL `snake_case`| TypeScript      | `serde(rename_all = "camelCase")` at the Rust boundary    |
| SQL `snake_case`| Rust struct     | `serde(rename_all = "camelCase")` for front-end interop   |
| Spec algorithm  | Engine `*.ts`   | One small file per concern (`types`, `*-rules`, `*-grader`) |
| Spec algorithm  | Engine `*.rs`   | Same shape; same rule IDs; same flag IDs                  |
| Engine output   | Report          | `firedRules[]` + `additionalFlags[]` rendered server-side |

### 3.3 Empty-value sentinels

- Unanswered text fields: empty string `''`.
- Unanswered numeric fields: `null` (`NULL` in SQL).
- Unanswered enum fields: empty string `''` (the `CHECK (x IN ('', …))` list
  includes the empty sentinel).
- Unanswered date / time fields: `null`.

These sentinels exist so that the front-end can submit an in-progress
draft without violating `NOT NULL` constraints or triggering grader
divergence.

## 4. Per-form artefacts (the contract a slug satisfies)

| Path                                            | Owner               | Generated? |
| ----------------------------------------------- | ------------------- | ---------- |
| `index.md`                                      | author              | no         |
| `README.md` → `index.md`                        | author (symlink)    | no         |
| `AGENTS.md`                                     | author              | no         |
| `CLAUDE.md`                                     | author              | no         |
| `spec/index.md`                                 | author              | no         |
| `plan.md`                                       | author              | no         |
| `tasks.md`                                      | author              | no         |
| `doc/`                                          | author              | no         |
| `sql-migrations/`                               | author              | no (source of truth) |
| `xml-representations/`                          | `bin/xml-representations/generate-xml-representations.py` | **yes** |
| `fhir-r5/`                                      | `bin/fhir-r5/generate-fhir-r5-representations.py` | **yes** |
| `protobuf/`                                     | `bin/protobuf/generate-protobuf-representations.py` | **yes** |
| `openapi/`                                      | `bin/openapi/generate-openapi-representations.py` | **yes** |
| `front-end-with-html/`                          | author + `bin/lily-html-refactor` for mechanical class swaps | partial |
| `front-end-with-svelte/`                        | author              | no         |
| `back-end-with-loco/`                           | author              | no         |
| `back-end-with-loco-setup`                      | `bin/back-end-with-loco/generate-back-end-with-loco-setup.py` | **yes** |

`bin/test-form <slug>` asserts every required path exists and is non-empty.

## 5. Front-end UX contract

- **Single-page wizard.** No multi-page forms. The whole questionnaire lives
  on one URL; the user moves through steps with in-page navigation.
- **Lily Design System HTML headless** is the class vocabulary for every
  `front-end-*-with-html/` directory. See
  [`forms/AGENTS-front-end-html.md`](forms/AGENTS-front-end-html.md) for the
  contract (classes, ARIA, validation pattern, accessibility commitments).
- **Lily Design System Svelte headless** is the component contract for every
  `front-end-*-with-svelte/` directory. Each form's `src/lib/components/ui/`
  mirrors the Lily Svelte API and emits the same class vocabulary. See
  [`forms/AGENTS-front-end-svelte.md`](forms/AGENTS-front-end-svelte.md).
- **Tailwind CSS 4 + SVAR DataGrid (Willow)** is the styling layer that
  attaches to the Lily class names in SvelteKit projects.
- **LocalStorage autosave.** Drafts persist under the key
  `<slug>.front-end-with-html.v1` (HTML) or
  `<slug>.front-end-with-svelte.v1` (SvelteKit). The shape is the
  scoring engine's input type; missing fields are filled from the
  `emptyAssessment()` factory on load.
- **Validation.** Submit-time validation populates a top-of-form
  `.error-summary` and per-field `.error-message` siblings. `aria-invalid`
  and `aria-describedby` wire the inputs to their errors. Focus moves to
  the error summary on validation failure.
- **Report.** The report is rendered into a `<section class="panel"
  role="region" aria-live="polite">` placeholder. The PDF endpoint is
  `/report/pdf` in SvelteKit, served by `pdfmake`.

## 6. Back-end contract

- One Rust crate per form under `back-end-with-loco/`.
- `serde(rename_all = "camelCase")` on every struct shared with the
  front-end.
- **JSON API only.** No HTML rendering, no Tera templates, no HTMX, no
  Alpine.js, no static assets, no Lily Design System. The canonical
  resource is `/api/assessments` (list, create, read, update, submit,
  result); see [`AGENTS/back-end-with-loco.md`](AGENTS/back-end-with-loco.md).
- Database name pattern: `<slug_snake>_development`, `<slug_snake>_test`,
  `<slug_snake>_production`. Connection string for production lives in
  `DATABASE_URL`.

## 7. Compliance

Every form attests to:

- **[MDCG 2019-11 Rev.1](https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en)** — EU MDR/IVDR software classification.
- **[UK Medical Devices Regulations 2002](https://www.legislation.gov.uk/uksi/2002/618/contents)**.
- **[ISO/IEC/IEEE 26514:2022](https://www.iso.org/standard/77451.html)** — Design and development of information for users.
- **[UK MHRA Software and AI as a Medical Device](https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device/software-and-artificial-intelligence-ai-as-a-medical-device)**.

Where a form's output drives clinical decisions (e.g. ASA grading), the
classification is escalated; per-form `index.md` and `spec.md` record the
declared classification.

## 8. Versioning and the Lily pin

Lily Design System is consumed as a **spec** (contract), not a runtime
library, in both HTML and Svelte flavours.

- **Lily HTML headless.** Pinned upstream commit hash:
  [`forms/lily-version.md`](forms/lily-version.md). Component HTML
  snapshots: `forms/lily-spec/` (refreshed via `bin/lily-sync`). CI
  drift detector: `bin/lily-html-refactor --check --all`.
- **Lily Svelte headless.** Pinned upstream commit hash:
  [`forms/lily-svelte-version.md`](forms/lily-svelte-version.md).
  Component source snapshots: `forms/lily-svelte-spec/` (refreshed via
  `bin/lily-svelte-sync`). Drift detector: `bin/lily-svelte-sync --check`.

Both libraries share one class vocabulary (`text-input`, `radio-group`,
`button`, `field`, `fieldset`, `step-list`, …) so a single Tailwind/CSS
stylesheet can serve both stacks.

## 9. Verification

System-level acceptance:

```sh
bin/test                              # validates every form's structure
bin/lily-html-refactor --check --all  # Lily HTML contract drift
bin/lily-sync --check                 # Lily HTML spec-snapshot drift
bin/lily-svelte-sync --check          # Lily Svelte spec-snapshot drift
bin/generate-spec.py --check          # per-form spec.md drift
```

Per-form acceptance:

```sh
bin/test-form <slug>
```

Per-stack acceptance (run from each form's stack directory):

```sh
pnpm install && pnpm check && pnpm test    # SvelteKit
cargo build && cargo test && cargo clippy  # Loco/Rust
```

## 10. Spec-driven development workflow

1. **Update `spec.md`** (this file, or `forms/<slug>/spec/index.md`) to declare
   the new behaviour, contract change, or constraint.
2. **Update `forms/<slug>/sql-migrations/`** if data shape changes.
3. **Regenerate** the derived artefacts (XML, FHIR, protobuf, OpenAPI):

   ```sh
   python3 bin/xml-representations/generate-xml-representations.py
   python3 bin/fhir-r5/generate-fhir-r5-representations.py
   python3 bin/protobuf/generate-protobuf-representations.py
   python3 bin/openapi/generate-openapi-representations.py
   ```

4. **Update front-ends and backend** to satisfy the new spec.
5. **Update `forms/<slug>/tasks.md`** to reflect the work done.
6. **Verify** with `bin/test-form <slug>` and `bin/test`.

## 11. Where to look next

- Per-stack documentation: [`AGENTS/`](AGENTS/) (one `.md` per stack).
- Lily Design System HTML contract: [`forms/AGENTS-front-end-html.md`](forms/AGENTS-front-end-html.md).
- Lily Design System Svelte contract: [`forms/AGENTS-front-end-svelte.md`](forms/AGENTS-front-end-svelte.md).
- Lily upstream pins:
  [`forms/lily-version.md`](forms/lily-version.md) (HTML),
  [`forms/lily-svelte-version.md`](forms/lily-svelte-version.md) (Svelte).
- Per-form list: [`forms/AGENTS.md`](forms/AGENTS.md).
- Cross-form Lily refactor plan + tasks: [`forms/plan.md`](forms/plan.md), [`forms/tasks.md`](forms/tasks.md).
- Repo plan: [`plan.md`](plan.md). Repo tasks: [`tasks.md`](tasks.md).
