# Tasks

- [x] 2026-07-22 — Scaffold form via `bin/create-form`; research
      `Appendix_B.pdf` (SF-36v2, NDI, mJOA, EQ-5D-3L); author `index.md`,
      `AGENTS.md`, `spec/index.md` with exact scoring algorithms for
      all 4 instruments, including explicit documentation of what is
      NOT implemented (licensed SF-36v2 norm-based PCS/MCS) and which
      public-domain substitutes are used instead (RAND-36 domain
      scoring; Dolan 1997 UK EQ-5D-3L TTO tariff).
- [x] SQL migrations (`patient_reported_outcome_measures` raw +
      `patient_reported_outcome_measures_score` computed, 1:1).
- [x] Generated representations (XML, FHIR R5, protobuf, OpenAPI).
- [x] Scoring engine (`sf36-rules.js`, `ndi-rules.js`, `mjoa-rules.js`,
      `eq5d-rules.js`, `composite.js`) hand-written and verified against
      known worked examples (all-best/all-worst SF-36 domain boundaries;
      EQ-5D "11111"→1.0 and "33333"→-0.594 exactly; NDI/mJOA band
      boundaries) before any UI was built around it.
- [x] `front-end-with-html/` — 9-step wizard + dashboard, built around
      the verified engine (engine files untouched). Verified via
      Playwright (58 answerable controls, cross-instrument submit,
      hand-checked EQ-5D index 0.157 for descriptor "11232" matches
      the Dolan 1997 formula exactly) and `bin/lily-html-refactor --check`
      (0 risky lines).
- [x] `front-end-with-svelte/` — 9-step wizard + dashboard + scoring
      engine (TypeScript, line-for-line port of the vanilla-JS engine).
      Verified via `svelte-check` (0 errors), `vitest run` (21/21,
      including all worked-example assertions), and Playwright
      end-to-end (fixed a real `v.toFixed` crash found during testing).
- [x] `back-end-with-loco/` — Rust JSON API, 1:1 raw + score entities
      (`has_one`/`belongs_to`, UNIQUE FK index enforcing the 1:1 at the
      DB level). Same Loco FK-auto-singularization bug as the other
      new forms, fixed identically via explicit-column-name override.
      Verified via `cargo check` (clean) and `cargo test` (27/27).
- [x] Filled in doc-stub files + `llms.txt` that `bin/create-form`
      leaves empty.
- [x] `bin/test-form patient-reported-outcome-measures` — **PASS**.
