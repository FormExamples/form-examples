# Plan: Cataract Diagnostic Evaluation

## Current status

Created 2026-08-14. Per-phase checkboxes live in [`tasks.md`](./tasks.md).

| Layer | Status |
| --- | --- |
| Documentation (`index.md`, `spec/`, `AGENTS.md`, `doc/`) | complete |
| `sql/` migrations (source of truth) | complete — `bin/test-sql-apply` passes |
| Generated representations (XML, FHIR R5, protobuf, OpenAPI) | generated from `sql/` |
| `examples/`, `CHANGELOG.md`, `llms.txt` | generated |
| Scoring engine (`front-end-with-svelte/src/lib/engine/`) | complete — 40 Vitest cases pass |
| `front-end-with-html/` | complete — 40/40 Node engine-mirror tests pass, `bin/lily-html-refactor --check` clean |
| `front-end-with-svelte/` UI | complete — `pnpm check`/`pnpm test`/`pnpm build` pass, `bin/lily-svelte-refactor --check` clean |
| `back-end-with-loco/` | complete — loco-rs 1.0.1, `cargo build` + 28 tests pass |

`bin/test-form cataract-diagnostic-evaluation` passes.

## Why this form exists

Cataract is confirmed and staged at the slit lamp, but the decision to refer
for surgery depends on more than the lens grade alone: functional impact
(glare, night driving, reading), best-corrected acuity, and — critically —
whether a competing posterior-segment pathology is hiding behind the lens
opacity. A routine vision test does not capture LOCS III grading, glare
testing, or biometry; this form is the dedicated cataract work-up that turns
those findings into a documented surgical-candidacy recommendation and a
record ready for a surgical referral letter.

## Design principles

- **Validated instrument, honestly scoped.** LOCS III is the real,
  literature-standard grading system (Chylack et al. 1993). Its severity-band
  and surgical-candidacy derivations are explicitly labelled as this form's
  own operational simplification, not part of the LOCS III publication —
  see `doc/locs-iii-grading.md`.
- **Max-grade, never diluted.** The worse eye and the worse finding set the
  computed candidacy; a single severe finding or fired safety flag cannot be
  averaged away by an otherwise reassuring picture.
- **Flags are independent of the override.** A clinician may override the
  final surgical-candidacy recommendation with a reason, but safety flags —
  and the `urgent-referral` override they force — are always computed and
  always shown.
- **Bilateral by construction.** Nearly every clinical finding in this form
  is naturally per-eye. Paired `_right` / `_left` columns and TypeScript
  properties keep both eyes visible together rather than hidden in a child
  table, mirroring `eye-vision-test-result`.
- **Engine-first.** The TypeScript engine (`front-end-with-svelte/src/lib/engine/`)
  is the single source of truth for every rule and flag ID. The HTML
  front-end's JavaScript engine is a byte-for-byte behavioural mirror,
  verified against the same boundary cases.

## Build order

1. Spec (`spec/index.md`), `index.md`, `AGENTS.md`.
2. SQL migrations (`sql/02`–`sql/06`), verified against a scratch Postgres.
3. Generated representations (XML, FHIR R5, protobuf, OpenAPI, Loco setup,
   examples, CHANGELOG, llms.txt).
4. TypeScript engine + Vitest boundary tests (this repo's engine-first
   convention) — done before any UI code.
5. SvelteKit front-end: step components, RESTful dashboard routes, PDF
   report endpoint, vendored Lily UI components and theme CSS.
6. HTML front-end: hand-mirrored JavaScript engine, wizard, dashboard,
   vendored shared JS/CSS.
7. Loco back-end: relational per-table schema, JSON API, `i64` ids.
8. `doc/` reference material, `plan.md`, `tasks.md`, `CHANGELOG.md`.
9. Full verification-gate pass.

## Open questions

See `doc/safety-case-notes.md` §Open questions for the standing clinical and
regulatory questions (LOCS III photograph licensing, IOL formula choice,
configurable acuity thresholds).
