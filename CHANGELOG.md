# Changelog

All notable repository-level changes are recorded here. The format is based on
[Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and the project
aims to follow [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

**Two scopes, deliberately.** This file records changes to the *repository*: the
conventions every form obeys, the toolchain, the CI gates, the fleet-wide
rollouts. Each form additionally carries its own `forms/<slug>/CHANGELOG.md`
under the same format, versioned independently, for changes to that form's
schema, engine, and front-ends.

Sections before `[1.0.0]`'s date are dated milestones reconstructed from git
history (no release existed yet); git history remains the authoritative record
for them.

## [Unreleased]

### Fixed

- **Dependabot alerts, enabled per `spec/dependabot/`, immediately surfaced
  207 real open vulnerabilities (7 critical, 60 high, 126 moderate, 14
  low) — down to 3 (all low, no safe fix available) after triage:**
  - `formexamples.github.io/package.json` carried four dependencies never
    referenced anywhere in the site's source or scripts — `migrate`,
    `npx`, `package`, `sv`. `npx` alone (a package that has no reason to
    be a project dependency at all; it ships with npm itself) dragged in
    its own deeply bundled, years-old copy of npm and accounted for most
    of the 84 alerts against this file, the production site's actual
    `npm ci` build lockfile. Removed all four; `npm audit` dropped from
    66 to 3 low-severity findings; `npm run check` and `npm run build`
    verified clean against the regenerated lockfile.
  - 3 of the 355 forms' `front-end-with-svelte/` (`cognitive-assessment`,
    `predicting-risk-of-cardiovascular-disease-events`,
    `prescription-request`) carried a leftover npm `package-lock.json`
    dated before the `pnpm-lock.yaml` beside it — every other form has
    `pnpm-lock.yaml` only. Nothing installs from these stale files (46
    of the 207 alerts, against files no build ever reads); deleted.
  - The remaining 113 (medium-severity, one per Loco crate as GitHub's
    scan progressed across the fleet in stages) were the same
    `opentelemetry_sdk` unbounded-memory-on-oversized-baggage-header
    advisory (GHSA-w9wp-h8wv-79jx). Grepped this fleet's own code and
    loco-rs 1.1.0's source for the only vulnerable function,
    `BaggagePropagator::extract_with_context` — neither calls it, so the
    path is unreachable. Dismissed via the GitHub API with that reasoning
    on record, the same basis already used for RUSTSEC-2023-0071 in
    `deny.toml`; a synchronized major-version bump of the whole
    OpenTelemetry stack (0.27 → 0.32+) across all 355 crates is real work
    disproportionate to an unreachable, DoS-only finding.
  - The 3 remaining low-severity alerts are the same transitive `cookie`
    advisory inside `@sveltejs/kit`'s own dependency tree in three
    different lockfiles; `npm audit fix --force` can only "fix" it by
    downgrading `@sveltejs/kit` to a 2022-era prerelease, so left for a
    real upstream fix via the existing Dependabot npm watch instead of a
    regression.
- **CI went fully green for the first time in this repository's history**
  (run [33213955606](https://github.com/FormExamples/form-examples/actions/runs/33213955606):
  every job — both matrices, FHIR, drift, SQL apply, structure — `success`,
  confirmed via `gh run view`, not assumed). Getting there took ten more
  real, previously-undiscovered bugs, each found by watching an actual CI
  run rather than guessing what it would do:
  - Two forms' `locales.ts` had regressed to non-canonical content in a
    merge conflict two days earlier, failing `bin/test-vendored-uniformity`;
    restored from the fleet-uniform content every other form carries.
  - `bin/xml-representations/generate-xml-representations.py` wrote example
    values into XML elements unescaped, breaking well-formedness wherever a
    SQL CHECK-constraint enum contained a literal `<` (2 forms), and never
    deleted a stale `.xml`/`.dtd` left over from a renamed or dropped table
    (260 orphaned files across 110 forms). Both fixed at the generator.
  - `@sveltejs/kit@3.0.0-next.23` (the fleet's pin) renamed
    `$app/environment` to `$app/env`, keeping the old path only as a
    type-less deprecated shim — `svelte-check` fails outright on it fleet-
    wide. (An earlier attempt in this same investigation misdiagnosed this
    as a missing `svelte.config.js` and was reverted before landing.) 7
    forms' hand-written `vitest.config.ts` stubbed the old module path for
    their store tests, so fixing the source imports back to `$app/env`
    needed the stub's alias key fixed to match; new
    `bin/svelte-vitest-app-env-alias-fix`.
  - 11 forms' `App::seed()` carried a stray `let _ = base;` left over from
    before `bin/loco-seed-base-rename` renamed the parameter it referenced
    to `_base` — a hard `E0425` compile error, not a lint. New
    `bin/loco-seed-base-stray-usage-fix`.
  - Every Rust CI shard was failing identically on the runner's own "No
    space left on device": ~44 independent Loco crates per shard, each
    leaving its `target/` behind, filled the disk before the shard could
    finish. Fixed by freeing preinstalled runner toolchains and wiping each
    crate's `target/` once it's done — at the cost of Swatinem/rust-cache's
    cross-run warm start, which was never reliable while shards were
    disk-overflowing anyway.
  - FHIR CI had never once completed: the validator's default terminology-
    server round-trip (`-tx http://tx.fhir.org`) against 2,600+ generated
    resources hung for hours with no output. Fixed with `-tx n/a` (~19s for
    the whole fleet locally) — which then surfaced the real validation
    errors it had been masking: 1,090 empty `valueString`s (FHIR forbids an
    empty primitive value) across 522 files; every example Bundle declared
    `type: document` without the Composition/identifier it requires,
    changed to `type: collection`; `DetectedIssue.severity` values outside
    FHIR's fixed `high|moderate|low` set (22 distinct words across the
    fleet) now go through a proper map with a safe default; two fabricated
    `patient-ethnicity`/`patient-occupation` extension URLs (3 forms)
    removed rather than standing up a custom FHIR IG to carry two ad hoc
    fields.
  - The workflow's `concurrency` group covered every trigger type, so a
    `schedule` run (GitHub can queue these for hours during high load —
    a 03:17 UTC cron here actually started at 15:22 UTC) cancelled a real,
    in-progress push-triggered run outright, discarding hours of Rust-
    matrix work. Scoped the group by `github.event_name` so push and
    schedule runs no longer compete.
  - `cargo loco generate scaffold`'s `config/test.yaml` ships
    `max_connections: 1` with a 500ms `connect_timeout` — a genuine race
    with `cargo test`'s default multi-threaded concurrency
    (`SqlxError(PoolTimedOut)` the moment two DB-touching tests in one
    crate run at once), not unexplained flakiness. Raised to 10 fleet-wide
    (355 forms, two different literal shapes); new
    `bin/loco-test-max-connections-fix`.
  - The nightly E2E job's `e2e/.gitignore` listed `package-lock.json`, so
    `npm ci` had no lockfile to install from — this schedule-only job had
    never been able to get past its install step. Lockfile committed.
- CI's Rust and Svelte matrices, which had never gone green on this
  repository (confirmed against GitHub's run history, including every run
  v1.0.0's own commits triggered) — two pre-existing, fleet-wide bugs,
  neither introduced by v1.0.0:
  - Every `loco new` scaffold ships an unused `base` parameter on
    `App::seed()` and a redundant `&` in the generated test's
    `auth_header()` helper; both fail `clippy -D warnings` by default on
    346/355 crates. New `bin/loco-seed-base-rename` and
    `bin/loco-test-auth-header-fix` (each `--check`-gated, wired into the
    generated setup script) fix and guard both fleet-wide.
  - The Svelte CI job ran `npm ci` against front-ends that are pnpm-only
    projects (no `package-lock.json`), which has failed immediately since
    npm 5. Switched to `pnpm/action-setup` + `pnpm install
    --frozen-lockfile`, matching `bin/test-e2e --svelte` and the
    documented dev workflow.
- Watching that fix's own CI run (rather than assuming it worked) surfaced
  two more pre-existing bugs it didn't touch:
  - The drift job's `bin/openapi/generate-openapi-combined.py` needs
    PyYAML, which the job's Python setup never installed — ran locally
    only because PyYAML happens to already be present on the maintainer's
    machine. Added `pip install pyyaml` to the drift job.
  - Every one of the 355 `front-end-with-svelte/pnpm-workspace.yaml` files
    was missing the `packages:` key pnpm 9 (the CI-pinned version)
    requires — `ERROR packages field missing or empty`, failing all 8
    Svelte shards outright before any real work ran. The local pnpm 11
    tolerates the omission, which is why this went unnoticed. New
    `bin/svelte-pnpm-workspace-fix` adds `packages: ['.']` fleet-wide and
    normalizes the same file's `allowBuilds.esbuild` (a stray unfilled
    template string in 32 files, `false` in 1) to `true`. Verified with a
    real pnpm 9 binary, not the local pnpm 11 that cannot see the bug.
- `bin/lib/engine-loader.js`'s `NON_ENGINE` skip-list wrongly excluded
  `form-validator.js` as a presumed generic DOM utility; it is the actual
  scoring engine's entry file in the 4 forms that use that name
  (`code-of-conduct-notice`, `consent-to-treatment`,
  `medical-records-release-permission`,
  `research-and-planning-privacy-notice`), so both `bin/test-engines` and
  `bin/test-personas` silently failed to load them. Found authoring
  `consent-to-treatment`'s personas; fixed and re-verified.
- A `bin/test-personas --update` run against a formula engine that uses
  `Math.pow()` with a fractional exponent (the eGFR calculator's CKD-EPI
  equation) recorded an `expected` that failed CI's drift job outright —
  `expected` was computed on local Node v26.7.0; CI runs the pinned Node
  22, and `Math.pow()`'s IEEE 754 result for a non-integer exponent is not
  guaranteed bit-identical across V8/Node versions (both mismatches were
  in `egfrRaw`'s last one or two digits; the rounded, displayed value and
  classification were unaffected either way). `bin/test-personas` compares
  exact JSON, so even a last-ULP difference fails it. Fixed by installing
  Node 22.23.2 via mise (matching `ci.yml`'s pin) and regenerating
  `expected` with that binary — confirmed the mismatch reproduces on
  Node 26 and disappears on Node 22, rather than assuming the fix.
  **Lesson for authoring personas on a formula engine that uses `pow()`,
  `sqrt()`, or similar: regenerate `--update` under the CI-pinned Node
  version, not whatever's on `PATH` locally.**
- The Node 22 → 26 pin bump (below) reproduced the exact same
  `estimated-glomerular-filtration-rate-calculator` ULP mismatch in the
  opposite direction: `bin/test-personas` run fleet-wide under Node 26
  (207 personas, 355 forms) found 2 of that form's personas' `egfrRaw`
  off in the last digit against `expected` recorded under Node 22
  (`g2-mildly-decreased-middle-aged`, `g5-kidney-failure`; the rounded
  `egfr` and `egfrStage` were unaffected). Regenerated `expected` under
  Node 26.8.1 to match the new pin; fleet-wide personas and
  `bin/test-engines` both verified clean under Node 26 afterward
  (207/207 and 279/279 respectively).
- `forms/pre-operative-assessment-by-patient/.npmrc` sat at the form root,
  not inside `front-end-with-svelte/` where its sibling 109 forms all
  carry theirs — no `package.json` or `pnpm-workspace.yaml` next to it, so
  its `engine-strict=true` had never constrained anything. Moved to the
  correct location.

### Added

- **`spec/node-current-version/` applied fleet-wide** via a new
  `bin/node-current-version-set` (`--check` is the CI drift detector):
  `engines.node` pinned in all 358 `package.json` files (355 forms'
  `front-end-with-svelte`, one stray `front-end-with-html`, `e2e/`,
  `formexamples.github.io/`); `.npmrc`'s `engine-strict=true` confirmed on
  the 110 that already carry one (the spec creates nothing that doesn't
  already exist); no `.nvmrc`/`.tool-versions` exist yet, so those two
  spec steps are currently no-ops. Verified with real installs, not
  assumed: `npm install` under Node 25.9.0 against a `.npmrc` with
  `engine-strict=true` fails `EBADENGINE` as expected, and succeeds under
  26 — but the identical `.npmrc` setting is a **silent no-op under
  pnpm** (`pnpm install` only warns, never fails, even fresh with no
  cache) — the fleet's actual front-end package manager. Confirmed the
  mechanism that does work (`pnpm-workspace.yaml`'s camelCase
  `engineStrict: true`, raising `ERR_PNPM_UNSUPPORTED_ENGINE`) and had the
  tool set it alongside every `.npmrc`, beyond the spec's literal text but
  required to make its own stated verification requirement true for pnpm.
  Re-verified end to end on a real form after the fix: fails under Node
  25.9.0, succeeds under 26.

- [GitHub Sponsors](https://github.com/sponsors/joelparkerhenderson) as a
  funding channel: `.github/FUNDING.yml`, and `CONTRIBUTING.md`'s "Donate
  money" item now points to it instead of stating there is no funding
  mechanism — a personal sponsorship of the sole maintainer, not of an
  organization; the project still has no legal entity, and this doesn't
  change that. Open Collective, the spec's other half, is explicitly
  deferred: it needs a fiscal host or a legal entity this project
  deliberately doesn't have.
- Trusted Publishing recorded as general supply-chain policy in
  `SECURITY.md`, per `spec/trusted-publishing/`: if this or any future
  project of this maintainer's publishes a package from CI, OIDC-based
  short-lived credentials are the intended mechanism, not a stored API
  token. Not yet applicable here — this repository doesn't publish a
  package today, and `INSTALL.md` is explicit that it never will.
- Personas for `anion-gap-calculator` (every classification band — normal,
  high, very-high, low — plus the hypoalbuminaemia-masking case, where a
  reassuring raw gap hides a raised albumin-corrected one, and the
  incomplete/unknown path) and `corrected-calcium-calculator` (normal,
  mild and severe hypocalcaemia, mild and severe hypercalcaemia,
  incomplete). Fleet persona total 186 → 188. Personas for
  `estimated-glomerular-filtration-rate-calculator`: every CKD G-stage
  (G1–G5), the non-steady-state caveat (a numeric eGFR still computes but
  shouldn't be relied on for staging during a possible acute kidney
  injury), and incomplete. Fleet persona total 188 → 189.
- Personas for `advance-decision-to-refuse-treatment` (a valid general
  refusal; a form complete on every required MCA field but missing
  recommended ones; a life-sustaining refusal missing the s25(5) statutory
  written-statement/signature/witness formalities — invalid) and
  `advance-statement-about-care` (partial with full content but no
  signature; complete once witnessed; verified once the GP also
  acknowledges it — the engine's three-tier ladder exercised end to end).
  Fleet persona total 179 → 181. Personas for
  `cardiopulmonary-resuscitation-training` (pass with every criterion met;
  fail on three accumulated non-critical deficiencies; fail on three
  critical failures — rate, depth, and no visible chest rise) and
  `consent-to-treatment` (complete at all 26 required fields; incomplete
  missing 6 identification/scheduling fields; incomplete missing only the
  two witness fields, since the engine's status is binary). Fleet persona
  total 181 → 183.

### Changed

- **`formexamples.github.io` refactored onto the Lily Design System**,
  via the published npm packages rather than a vendored local copy (the
  site previously carried none of Lily at all — plain Tailwind CSS with
  a hand-rolled dark-mode toggle): `lily-design-system-svelte-theme-picker`,
  `-text-size-picker`, and `-share-picker`. Every component moved from
  Tailwind `dark:` variants to a small, hand-authored `--color-base-*` /
  `--color-primary*` token set (`static/themes/{light,dark}.css`,
  `$lib/config/themes.ts`) matching the same `data-theme` contract every
  form's `front-end-with-svelte` uses — not a copy of Lily's ~20 KB-per-
  theme component stylesheet, which this Tailwind-utility site has no use
  for. Every theme is preloaded (one `<link>` per `$lib/config/themes.ts`
  entry, emitted from the root `+layout.svelte`), so the picker's runtime
  switch is pure `data-theme` attribute mutation, never a stylesheet
  fetch. `SharePicker` wires LinkedIn/Mastodon/Bluesky/Reddit share-intent
  URLs plus copy-link, titled from a new `page.data.title` convention
  (`+page.ts` per route, typed via `src/app.d.ts`) so a page's tab title
  and its shared title can never drift apart. No `LocalePicker` — the
  site has no translated content, so wiring one would be decorative.
  Also fixed: the home/architecture/tech-stacks/get-started pages still
  described a retired architecture (116 forms, a split
  `front-end-form-with-*`/`front-end-dashboard-with-*` layout, SVAR
  dashboards, `full-stack-with-loco-tera-htmx-alpine/`) rewritten to the
  current 355-form / `front-end-with-html` + `front-end-with-svelte` +
  `back-end-with-loco` reality; and `scripts/generate-forms-data.ts`
  listed *any* directory under `forms/` (picking up `doc/`, `fhir/`,
  `lily-spec/`, `lily-svelte-spec/` as 4 bogus entries on the public
  Forms page) rather than requiring an `index.md`.
- **Node 22 → 26 fleet-wide** (`ci.yml`'s `svelte` and `e2e` jobs;
  `deploy-formexamples.yml`), plus the doc/skill prose that names the
  CI-pinned version (`CONTRIBUTING.md`, `INSTALL.md`,
  `form-examples-maintainer-skill/SKILL.md`). Node 26 (first released
  2026-04) is Current, not yet LTS (expected 2026-10). See "Fixed" above
  for the one real fallout (`estimated-glomerular-filtration-rate-calculator`
  personas) and its regeneration.
- `deploy-formexamples.yml` was pinned to Node **20** — a full major
  behind `ci.yml`'s Node 22 — and unnoticed because nothing exercises it
  except an actual push-to-`main` deploy. Bumped straight to 26 with
  everything else, closing the gap rather than landing on 22 first.
- **`ci.yml`'s `drift` job — the one that runs `bin/test-personas` and
  `bin/test-engines` — had no `actions/setup-node` step at all.** Despite
  CONTRIBUTING.md and the maintainer skill both describing "the CI-pinned
  Node version" for regenerating personas, that job ran on whatever Node
  `ubuntu-latest` happens to ship preinstalled — never actually pinned by
  this repo, and exactly the kind of floating dependency that produces a
  silent Math.pow()/sqrt() ULP drift like the one just fixed above. Added
  an explicit `actions/setup-node@v7` pin (Node 26, matching every other
  job) so "the CI-pinned version" is now true rather than aspirational.
- While bumping the deploy workflow, found `formexamples.github.io` was
  carrying two competing lockfiles: `package-lock.json` (the deliberate,
  actively-maintained one — confirmed as `deploy-formexamples.yml`'s real
  `npm ci` input by the Dependabot-triage fix above) and a `pnpm-lock.yaml`
  + `pnpm-workspace.yaml` pair added incidentally by the fleet-wide
  Aug-15 "Update Svelte" commit (which otherwise only touched forms'
  `front-end-with-svelte/`), never wired into any script or workflow, and
  itself broken — `pnpm-workspace.yaml` still held the unfilled
  `allowBuilds.esbuild: set this to true or false` template placeholder
  the same bug `bin/svelte-pnpm-workspace-fix` fixes fleet-wide for forms
  (a tool whose target glob doesn't reach this directory). Deleted the
  orphaned pnpm pair; `package-lock.json` remains the single lockfile,
  regenerated under Node 26 to pick up the three
  `lily-design-system-svelte-*` picker packages from the theming
  refactor above.

## [1.0.0] - 2026-08-26

First tagged release. Everything below happened before any release existed;
this section gathers the `[Unreleased]` history that shipped as v1.0.0.

### Added

- `#![forbid(unsafe_code)]` on every crate root in every form's
  `back-end-with-loco/` — the library, the `-cli` binary, the `migration`
  library, and the integration-test target — 1,412 crate roots across 355
  crates. Nothing in these crates needs `unsafe`, and `forbid`, unlike `deny`,
  cannot be reopened by a later inner `allow`.
- `bin/loco-forbid-unsafe`, the tool that applies and gates the above, with
  `--check` wired into the CI drift job. Every form's generated
  `back-end-with-loco-setup` script now calls it as its final step, so a newly
  scaffolded crate arrives with the attribute already in place.
- Repository-level special files for public repositories: `AI_STATEMENT.md`,
  `BENCHMARKS.md`, `CHANGELOG.md`, `CODEOWNERS`, `COMPARISONS.md`,
  `GOVERNANCE.md`, `INSTALL.md`, `MAINTAINERS.md`, `NEWS.md`, and `SECURITY.md`,
  per [`spec/special-files-for-public-repos/`](spec/special-files-for-public-repos).
- SPDX identification in `LICENSE.md`, and richer metadata in `CITATION.cff`.

### Changed

- `CONTRIBUTING.md` gained the ways to contribute that are not code.

### Added

- CI now runs every repo-internal verify gate (ten were missing), a
  changed-forms detection job that narrows the Rust/Svelte matrices to
  touched forms on pushes and PRs (full fleet nightly), a weekly cargo-deny
  advisories sweep over every crate's lockfile, `workflow_dispatch`, npm
  caching, and Dependabot for Actions, the site, and the E2E harness.
- `bin/test-vendored-uniformity` — proves the vendored theme catalogues and
  Lily Svelte helpers are byte-identical across all 355 forms (the
  CI-checkable half of the checkout-reading sync tools' invariant).
- Personas for `medical-records-release-permission` (complete and valid;
  nearly-complete on three missing signature/acknowledgement fields — and
  a correction recorded in the persona file itself: the engine's
  completeness and validation labels are not fully independent axes,
  since missing required fields populate the same firedRules list format
  errors do; complete-but-minor-issues on malformed emails and an
  end-before-start authorisation period). This is the second of the 4
  forms unblocked by the form-validator.js loader fix above.
- Personas for `employee-onboarding-checklist` (complete, low risk; a
  critical DBS-not-started case regardless of otherwise-high completion; a
  high-risk case on unsatisfactory references and a pending DBS) and
  `first-aid-training-checklist` (pass with every criterion met;
  needs-development right at the 2-deficiency boundary; fail on missed
  tourniquet application and anaphylaxis recognition).
- Personas for `general-practitioner-referral-letter` (routine complete at
  10/10 mandatory; an NG12 two-week-wait whose conditional fields grow the
  mandatory set to 13/13; an urgent referral missing its urgency reason)
  and `history-and-physical-examination` (complete CAP clerking; a partial
  thunderclap-headache clerking with red flags and a plan; a stalled 04:05
  clerking held incomplete by both blocking rules).
- Personas for `medical-error-report` (wrong-patient near miss at low risk;
  a three-day anticoagulant overdose at moderate with candour completed; an
  ABO-incompatible transfusion at critical with candour outstanding) and
  `child-safeguarding-referral` (consented neglect referral at standard; a
  same-day disclosure at urgent on the seeking-consent-increases-risk
  basis; an immediate-danger referral graded emergency while failing three
  of six mandatory rules).
- Personas for `soap-note` (complete home-managed tonsillitis with
  safety-netting; COPD phone consult missing safety-netting; a septic home
  visit with Assessment and Plan never written, firing six flags) and
  `nursing-care-plan` (complete two-problem RLT plan; high falls risk
  assessed-but-not-actioned; a 03:00 skeleton plan at 0%).
- Personas for `partogram` (1 cm/h progress exactly on the WHO alert line;
  alert-line crossing with meconium; six hours of arrest crossing the action
  line with maternal fever and fetal tachycardia) and
  `post-anaesthesia-care-unit-record` (Aldrete 10 + PADSS 10 street-fit;
  Aldrete 9 held not-ready by the SpO2 gate; slow emergence at Aldrete 3).
- Personas for `who-surgical-safety-checklist` (clean completed case; the
  three managed-risk informational flags; a lapsed evening case firing all
  seven discipline flags) and `emergency-department-triage-note` (the
  engine's only Level-5 presentation; cardiac chest pain at Level 2; a
  shocked GI bleed at Level 1 with NEWS2 15).
- Personas for `inpatient-clinical-note` (complete stable ward round;
  NEWS2-7 sepsis deterioration; sparse overnight entry exercising the
  acuity-override-with-reason path) and `medical-operation-note` (routine
  lap chole; open conversion with unplanned HDU step-up; a critical case
  with intra-operative arrest, retained-swab never event, and count
  discrepancy).
- Personas for the flagship `cardiology-request` / `cardiology-response`
  pair: routine-accept, urgent typical-angina, and an emergency ACS
  escalation on the request; no-abnormality, HFrEF (EF 32%), and an
  uncommunicated critical aortic-stenosis result on the response.
- Personas for the entire `*-waiting-list-card` family (56 forms; fleet
  total 109 → 181 verified): three clinically coherent RTT scenarios each —
  routine P4 within target, urgent P2 approaching target with an interpreter
  flag, and a P3 52-week long-wait breach with harm-review and
  missing-appointment flags. `bin/test-personas` gained an optional
  per-persona `options` object passed as the grader's second argument, so
  clock-derived engines pin `todayIso` and the recorded oracle cannot rot.
- GitHub issue templates (defect; clinical-correctness, which requires a
  citation against the published instrument; contact links routing security
  reports to SECURITY.md's private path) and a pull-request template carrying
  the spec-first checklist and the `AI_STATEMENT.md` §10 disclosure section.
- GOVERNANCE.md documents the intended repository settings (branch
  protection, required checks, why review-requirement stays off at bus
  factor one) and a 5-step release runbook; repo topics set from NEWS.md's
  fact sheet.

### Merged

- The `glp1-frailty-perioperative-management` branch: GLP-1 receptor-agonist
  perioperative management (hold-per-guideline, gastric POCUS, full-stomach
  precautions, `F-GLP1-ASPIRATION-RISK`) and expanded Fried-frailty fields
  for `perioperative-optimization` and
  `pre-operative-assessment-by-clinician` — SQL through representations,
  both front-ends, Loco migrations, and the engines. Merged with the
  post-fork conventions applied (SvelteKit 3 `#lib` alias, `.js` import
  extensions, prettier); all gates and builds green; personas extended and
  re-verified.
- The `oxford-spelling-repo-wide-sweep` branch, by re-application rather
  than merge: the branch's 237-word `-ise` → `-ize` mapping was extracted
  from its diff and re-applied to current prose (1,656 files), protecting
  code spans and the spec's keep-list.

### Changed

- The fleet `deny.toml` policy tracks the loco-rs 1.1 dependency tree:
  RUSTSEC-2023-0071 (rsa Marvin attack, no fixed release; unreachable here —
  JWT auth is HMAC HS256) ignored with the reasoning stated, and the four
  stale 0.16-era ignores dropped.
- Every Loco crate bumped loco-rs 1.0.1 → 1.1.0 and uuid 1.24 → 1.25,
  lockfiles refreshed; fleet-verified with `cargo check --all-targets` on all
  355 crates (355/355 PASS) before committing.
- The clippy pedantic debt in the 8 strict-header crates cleared (~140
  findings fixed or given scoped, justified allows); all 8 now pass
  `clippy --all-targets -- -D warnings`.

### Fixed

- The formexamples.com Pages deploy: `package-lock.json` regenerated after
  the Svelte/Vite bump left it inconsistent (npm ci refused); the first
  Dependabot cycle's ten bumps applied (site packages + workflow actions).
- The headless engine oracle, broken fleet-wide since the 2026-07 ES-modules
  conversion: `bin/lib/engine-loader.js` now loads ES-module engines with real
  dynamic `import()` (temp dir + `{"type":"module"}`, merged exports; classic
  vm fallback kept), skips the vendored header-control helpers whose
  module-scoped `STORAGE_KEY` collided, and `bin/test-engines` shares the lib
  instead of an inlined duplicate. `bin/test-engines`: FAIL 355 → PASS 279 /
  SKIP 76 / FAIL 0; `bin/test-personas`: FAIL 109 → PASS 109 with a zero-diff
  `--update` (the ESM path reproduces the recorded oracle byte-identically).
- `bin/es-modules-refactor` no longer reports pure-whitespace drift on the 36
  HTML front-ends formatted at 8-space indent: the emitted script block now
  matches the file's own indentation.
- Lily snapshots re-pinned to upstream `e05a138e6` and the theme catalogues
  re-synced fleet-wide (the unwired date-time-picker's
  `:disabled` → `[data-disabled]` selectors); two divergent `locales.ts`
  canonicalized. All Lily drift gates green.
- `#![warn(clippy::clippy::pedantic)]` — a doubled path segment, and therefore
  an unknown lint that did nothing — corrected to `#![warn(clippy::pedantic)]`
  in the three crates carrying it (`architecture-decision-record`,
  `inpatient-clinical-note`, `medical-operation-note`), matching the five
  rustdoc'd crates that already had the correct spelling.

## 2026-08 — loco-rs 1.0, schema fidelity, five new full-stack forms

### Added

- Five new forms built to full-stack depth (cataract diagnostic evaluation,
  health screening questionnaire, hernia diagnostic evaluation, hip replacement
  surgery evaluation, knee replacement surgery evaluation): spec, SQL, both
  front-ends, and a Loco crate each.
- [`spec/oxford-spelling/`](spec/oxford-spelling) — the repository's prose
  spelling standard (`en-GB-oxendict`).
- `bin/loco-migration-defaults`, `bin/loco-migration-nullability`, and
  `bin/loco-rs-1-migration`, each with a `--check` drift gate.

### Changed

- Every Loco crate migrated from loco-rs 0.16 to 1.0.1: the `auth_jwt`/`bg_pg`
  feature rename, and every `id`/`*_id` moved `i32` → `i64` to match 1.0's
  `BIGINT` primary keys.
- Lily Svelte helper components re-vendored, clearing the fleet-wide
  accessibility and state warnings they had been emitting.

### Fixed

- Column defaults from each form's `sql/` mirrored into its Loco migration; the
  scaffold generator cannot express defaults, so the back-end schema had been
  silently disagreeing with its own source of truth.
- Column nullability restored across migration, entity, and controller `Params`
  together. Loco has no nullable-unique column type, so `StringUniq` had forced
  nullable UNIQUE columns such as `united_kingdom_nhs_number` to `NOT NULL
  UNIQUE` — which admits exactly one row without the identifier, the rest
  colliding on the empty string. Uniqueness is now an explicit unique index.
- The `sv migrate sveltekit-3` codemod's fleet-wide `themesUrl` mistake.

## 2026-07 — route layouts, gates, and front-end modernization

### Added

- The SQL apply gate (`bin/test-sql-apply`): every form's numbered migrations,
  applied in order to a fresh scratch Postgres.
- Per-form `llms.txt`, `CHANGELOG.md`, and `examples/` (a filled-form JSON
  fixture plus a FHIR R5 Bundle), each with its generator and `--check` gate.
- Authored personas per form, cross-checked against engine output.
- A `/` welcome page in every Svelte front-end.
- `localStorage` autosave in the HTML wizards.
- The Lily header controls — theme, locale, text size, share — plus the vendored
  date-time picker, across both front-end stacks.
- `cargo deny` supply-chain policy per Loco crate, generated and gate-checked.

### Changed

- Route layouts settled: Loco crates under `back-end-with-loco/src/<snake>/`,
  Svelte routes nested under `src/routes/<form-kebab-case>/`.
- Every HTML front-end converted from classic `window.<Namespace>` scripts to
  native ES modules, with `spec/es-modules.md` and a `--check` gate.
- Form front-ends made fully scrollable: the fixed and sticky header and footer
  are gone.
- All Loco crates rebuilt to the relational gold layout: one migration and one
  entity per SQL table.
- `sql-migrations/` renamed to `sql/` everywhere, and the SQL-derived generators
  modernized to read it.
- The Lily HTML and Svelte helpers renamed `*-chooser` → `*-picker`, tracking
  upstream.

### Fixed

- A class of broken submits that rendered a 404 instead of the report, plus the
  single-page-wizard smoke gate that now catches it.
- 61 forms missing from `forms.tsv`; 81 stale Loco setup scripts; several stale
  FHIR example bundles.

## 2026-06 — one back-end design, one front-end per stack

### Changed

- Every form's back end migrated to the canonical Loco + SeaORM + PostgreSQL
  JSON API, replacing the earlier Tera/HTMX/Alpine full-stack approach.
- Postgres-only background queue, plus OpenTelemetry and a Prometheus `/metrics`
  endpoint, standardized across every crate.
- Every form's Svelte front-end consolidated into `front-end-with-svelte/`.
- Directory reorganization: `spec.md` → `spec/index.md`, `xml-representations/`
  → `xml/`, `fhir-r5/` → `fhir/r5/`.
- Every Loco crate documented to satisfy `deny(missing_docs)`.

## 2026-05 — the Lily Design System rollout

### Added

- The Lily Design System class contract for both front-end stacks, with pinned
  upstream snapshots under `forms/lily-spec/` and `forms/lily-svelte-spec/` and
  the `--check` detectors that keep every form on it.
- The `formexamples.com` site, built from `formexamples.github.io/` and deployed
  by GitHub Pages.

### Changed

- Every form's HTML and Svelte front-end refactored onto the Lily contract, and
  the canonical Lily UI components promoted over the legacy per-form ones.

## 2026-04 — the generator pipeline

### Added

- The generators that derive XML + DTD, FHIR R5, and the Loco scaffold script
  from each form's SQL, and `bin/test-form` to validate a form's structure.

### Changed

- Multi-step forms replaced by the single-page, all-in-one wizard that is now
  the rule.
- SQL and the generators refactored to per-entity files.

## 2026-03 — first commit

### Added

- The repository, the `forms/<slug>/` layout, `bin/create-form`, and the first
  forms: advance decision to refuse treatment, advance statement about care,
  allergy assessment, and others.
