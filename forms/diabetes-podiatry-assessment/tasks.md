# Diabetes Podiatry Assessment — tasks

Task tracking. See [`plan.md`](./plan.md) for the roadmap.

## Done

- [x] Author `index.md` (title, scope, data captured & classification model,
      assessment steps, conventions, compliance, references).
- [x] Author `spec/index.md` (data model per foot, classification / outcome
      algorithm, flagged issues, I/O shapes, acceptance criteria).
- [x] Author `AGENTS.md` (directory map, classification engine shape and
      files, conventions, compliance).
- [x] Author `plan.md` and `tasks.md`.
- [x] SQL migrations in `sql/` (assessment table, right/left foot
      examination blocks, grade / grade_rule / grade_flag trio, UUIDv4 PK,
      timestamps). Verified against a scratch Postgres 18.
- [x] Populate the boilerplate `index.md` / `AGENTS.md` / `CLAUDE.md` /
      `README.md` for every generated-representation subdirectory (`doc/`,
      `fhir/r5/`, `protobuf/`, `sql/`, `typespec/`, `xml/`).
- [x] Generated XML, FHIR R5, protobuf, OpenAPI, Loco setup.
- [x] `back-end-with-loco` (Rust axum + Loco JSON API). Scaffolded via
      `cargo loco generate scaffold` for all 6 tables (patient, clinician,
      diabetes_podiatry_assessment, grade, grade_rule, grade_flag), route
      layout converted via `bin/route-loco-layout`, and every fleet-wide
      Loco convention tool applied and verified `--check`-clean
      (`loco-forbid-unsafe`, `loco-seed-base-rename`,
      `loco-test-auth-header-fix`, `loco-rs-1-migration` + hand-aligned
      `Cargo.toml`/MSRV to the fleet's 1.1.0/1.96 pin, `loco-config-refactor`,
      `loco-migration-defaults`, `loco-migration-nullability`,
      `loco-test-max-connections-fix`, `loco-camel-case-json-refactor`,
      `loco-serve-openapi-refactor`, `generate-loco-deny-config.py`). Two
      real, hand-fixed issues found along the way: (1) the freshly-scaffolded
      `App::seed()` still referenced the now-renamed `_base` param body-side
      — fixed to the `CARGO_MANIFEST_DIR`-relative fixture path pattern;
      (2) the scaffold's own default list-endpoint tests assert a
      trailing-slash GET returns 200, which 404s on this Loco/loco-rs
      version — fixed to match the fleet's already-documented
      trailing-slash + content-type-assertion pattern. Verified:
      `cargo check`/`cargo clippy --all-targets -D warnings` clean,
      `cargo test` 35/35 green (live scratch Postgres), and a live HTTP
      round-trip (`POST /api/patients` + `GET /api/openapi.yaml`) confirmed
      camelCase + the OpenAPI route both work.
- [x] Classification engine JS (`types.js`, `rules.js`, `grader.js`,
      `flags.js` in `front-end-with-html/js/`) — hand-authored, grounded in
      NICE NG19 diabetic foot risk stratification.
- [x] `front-end-with-html` (Lily wizard + dashboard) — built by a
      background agent mirroring `diabetes-eye-screening`. Verified: no
      hardcoded palette colours, `bin/lily-html-refactor --check` clean,
      `bin/test-engines` PASS, `bin/test-e2e --html` 2/2 (Playwright smoke +
      axe-core a11y + dashboard CSV/TSV export).
- [x] `front-end-with-svelte` (Lily wizard + dashboard) — full greenfield
      build (114 files) by a background agent, porting the JS engine to
      TypeScript verbatim. Verified: `pnpm check` 0 errors/0 warnings,
      `pnpm build` succeeds, `pnpm exec vitest run` 57/57 (2 engine test
      files covering every risk-category boundary, every override, and
      mismatched feet), no hardcoded palette colours,
      `bin/lily-svelte-refactor --check` / `bin/svelte-pnpm-workspace-fix
      --check` / `bin/svelte-vitest-app-env-alias-fix --check` all clean,
      `bin/test-e2e --svelte` 1/1.
- [x] **Real bug found and fixed during the Svelte port**: `hasHistory(foot)`
      in `rules.js`/`podiatry-rules.ts` checked `previousAmputation !==
      'none'`, but the unanswered default is `''` (not `'none'`), so a
      completely blank/untouched foot incorrectly evaluated as
      history-present — giving a 1-month high-risk review interval instead
      of the intended 3-month interval for a clinician who never touches
      `previousAmputation`. Found by the Svelte-porting agent (which
      correctly preserved the bug verbatim per its port-exactly
      instructions, then flagged it); fixed in both `rules.js` and
      `podiatry-rules.ts` to check `previousAmputation === 'minor' ||
      previousAmputation === 'major'` explicitly. Re-verified both engines
      after the fix (Node smoke test on the HTML side; `pnpm check` + build
      + vitest 57/57 on the Svelte side, including two rewritten test cases
      covering the blank-foot case explicitly).
- [x] Scaffold `CHANGELOG.md` and `examples/`
      (`bin/generate-changelog-and-examples.py`).
- [x] Regenerate `skills/` (`bin/generate-form-skills.py`).
- [x] Add this form to `forms/AGENTS.md`'s alphabetical index.
- [x] Lily HTML / Svelte drift checks pass (`bin/lily-html-refactor
      --check`, `bin/lily-svelte-refactor --check`).
- [x] `bin/test-form diabetes-podiatry-assessment` passes (PASS, no
      errors; cargo test skipped only because no default-port Postgres was
      running locally at that moment — independently verified separately
      against a scratch Postgres, 35/35).

- [x] Author `examples/personas.json` (6 hand-curated, clinically realistic
      scenarios spanning low / moderate / high-combined-factors /
      high-with-ulcer-history / active-urgent-ulcer /
      active-urgent-suspected-Charcot, with `expected` verified against the
      real engine via `bin/test-personas`). Closes this form's gap in the
      fleet's persona backlog — verified fleet-wide: 353/353 forms with an
      engine now PASS, the only 3 forms without personas are genuinely
      engine-less documentation/notice forms by design (not a gap).

## To do

- [ ] Nothing outstanding for this form's foundation + full-stack build.
      Future work (CSV/TSV export samples, API transcripts) is the same
      fleet-wide backlog every form shares — see the repo root `tasks.md`.
