# Tasks: refactor `front-end-*-with-html/` to Lily Design System HTML headless

Companion to [`plan.md`](plan.md). Tasks are grouped by phase, numbered, and
include a status box and a one-line acceptance check.

Legend: `[ ]` open · `[~]` in progress · `[x]` done · `[-]` skipped/deferred

---

## Phase 0 — Foundations

- [x] **0.1  Decide Lily consumption model.** *Resolved:* Lily is a
  spec, not a runtime. Generators read it at authoring time; no runtime
  dependency on Lily, no vendored runtime files. Recorded in
  [`AGENTS-front-end-html.md`](AGENTS-front-end-html.md) §2.
- [ ] **0.2  Add `bin/lily-sync`.** Doc-snapshotting helper that copies
  Lily's spec comments from
  `~/git/lilydesignsystem/lily-design-system/lily-design-system-html-headless/components/`
  into `doc/lily-spec/` and records the pinned source commit in
  `doc/lily-version.md`. **Not** a runtime sync. *Acceptance:* re-running
  is idempotent and the pinned hash is updated.
- [x] **0.3  Inventory which Lily components every form will need.**
  *Done:* [`doc/lily-components-per-form.md`](doc/lily-components-per-form.md).
  Union of 25 core components covers ~99% of forms; ~12 specialised
  components needed for signature capture, country-specific IDs,
  measurements, ratings, NPS, RAG, file upload, calendar ranges.
- [x] **0.4  Confirm coverage.** *Done:* every required Lily component
  verified present in the Lily checkout (commit `7a51013`). Zero gaps.
  Recorded in `doc/lily-components-per-form.md` §4.
- [x] **0.5  Write `forms/AGENTS-front-end-html.md`.** Documents the new
  class vocabulary, script load order, persistence key, accessibility
  patterns, validation pattern (`.error-summary` + `.error-message`), and
  no-build constraint. *Done:* [`AGENTS-front-end-html.md`](AGENTS-front-end-html.md).
- [x] **0.6  Author the base stylesheet template.** *Done:*
  [`doc/templates/front-end-form-with-html/css/style.css`](doc/templates/front-end-form-with-html/css/style.css).
  Targets all Lily classes from §3 of the conventions doc; uses the
  existing CSS-variable palette; includes step-list `data-status`
  variants, button `data-variant`, alert `data-type`, focus/invalid
  states, and reduced-motion handling.
- [x] **0.7  Link the new conventions from the project root.** *Done:*
  link added to top-level `AGENTS.md` under Technology stacks and to
  `forms/AGENTS.md` under Cross-cutting docs.

---

## Phase 1 — Canonical reference

- [x] **1.1  Refactor `index.html`** to Lily classes. *Done* on branch
  `lily-html-canonical` (commit 2566291c).
- [x] **1.2  Refactor `css/style.css`** to consume Lily classes. *Done.*
- [x] **1.3  Refactor `js/app.js`** builders to emit Lily-shaped markup
  (type-specific input classes, fieldset/legend section structure,
  `.button` + `data-variant`). *Done.*
- [x] **1.4  Wire validation pattern.** `validateForm()` populates
  `#error-summary` + per-field `.error-message`; inputs get
  `aria-describedby` + `aria-invalid`. *Done.*
- [x] **1.5  Wire `.step-list`.** `renderStepList()` +
  `updateStepListStatuses()` manage `data-status` and `aria-current="step"`;
  clicks scroll to the corresponding `fieldset`. *Done.*
- [x] **1.6  Refactor `front-end-dashboard-with-html/`** to use
  `.data-table-*` classes; filters use `.search-input` / `.select`;
  status banner is `.alert[data-type="warning"]`. *Done* in commit
  `be899e4d`.
- [x] **1.7  Browser smoke test (form + dashboard, file://, Chromium
  via Playwright).** Form: no console errors, 16 step-list-items, 21
  text-inputs, 44 radio-groups, empty-submit populates error summary.
  Dashboard: `.data-table` shell renders, 12 rows × 12 cells, sort
  toggles, risk filter narrows 12 → 2. *Cross-browser (Safari) check
  deferred — same engine via webkit can be added later.*
- [x] **1.8  LocalStorage compatibility (passes by construction).** The
  refactor changes only rendering; `types.js`, `emptyAssessment()`, the
  state shape, and the storage key
  `pre-operative-assessment-by-clinician.front-end-form-with-html.v1`
  are unchanged. `loadState()` already merges the stored value over a
  fresh empty assessment, so existing drafts hydrate as before.
- [x] **1.9  Commit the canonical reference.** Done across three
  commits on branch `lily-html-canonical`: `2566291c` (form),
  `5ac6e2a0` (tasks-progress), `be899e4d` (dashboard). The plan
  originally called for a single squashed commit; keeping the three
  semantic commits aids review.

---

## Phase 2 — Refactor tool (reframed from generator)

See `plan.md` §7 Phase 2 for the rationale. The 132 other forms carry
heavy hand-coded `app.js`; a scaffold generator would clobber it.
Build a mechanical refactor tool instead.

- [ ] **2.1  Add `bin/lily-html-refactor` (Python).** In-place safe
  class swaps across a form's `front-end-form-with-html/` and
  `front-end-dashboard-with-html/`. Idempotent. Flags: `--dry-run`,
  `--scope=form|dashboard|both`, `--all`. *Acceptance:* running on
  `agile-checklist` (a held-out form) produces a diff that compiles,
  loads, and renders without console errors when opened via `file://`.
- [ ] **2.2  Define the safe-swap catalogue.** Documented in
  `bin/lily-html-refactor` as a constant. Covers the patterns surveyed
  on 2026-05-23: button classes, textarea class, select-input,
  form-actions, report-region, status-banner, thead/tbody table-data
  classes, and the JS `className = 'btn btn-*'` variants. *Acceptance:*
  catalogue list in the script header matches §3 of
  `AGENTS-front-end-html.md`.
- [ ] **2.3  Risky-change reporting mode.** Detect patterns that
  require structural rewrites the tool won't attempt: `class="section-
  card"`, `radio-options`/`radio-option`, custom progress-bar markup,
  `class="assessment-form"`, custom shell layouts. Print each per file
  with line numbers so a follow-up subagent pass can handle them.
  *Acceptance:* on `care-privacy-notice` (which has unusual structure),
  the tool reports the risky patterns instead of attempting them.
- [ ] **2.4  Smoke-test the refactor tool.** Run on a clean
  not-yet-refactored form, then open via `file://` in Chromium
  (Playwright). Confirm: no console errors, button styles render,
  selects render, form is interactive. *Acceptance:* documented in
  `tasks.md` and (eventually) wired into `bin/test`.
- [ ] **2.5  Deferred: scaffold generator for NEW forms.** Out of
  scope for migration. Will be picked up once Phase 3 batches are
  underway and the canonical reference is stable enough to template.

---

## Phase 3 — Batch migration

For each batch: run `bin/lily-html-refactor` for the mechanical pass →
dispatch a subagent for the structural rewrite (using the canonical
reference as the model) → Playwright smoke-test (form + dashboard) →
commit per form with `git commit --only forms/<slug>/`.

- [x] **3.0  Pilot: `asthma-assessment`.** End-to-end Phase 3 dry-run.
  Mechanical pass (commit `a601dfb7`) + structural pass via dispatched
  subagent (commit `3ea76ccd`). Smoke tests green: 9 step items, 30
  Lily inputs, 35 radio-groups, empty-submit validation works,
  dashboard data-table renders 12 rows × 72 cells. **Process lesson:**
  the worktree at `.claude/worktrees/lily-html-canonical/` was removed
  from git mid-task by external activity; the subagent worked in the
  stale path but its output was salvaged by verifying do-not-modify
  files were byte-equal to main. For future batches, work directly in
  the main checkout with `git commit --only <path>` to avoid worktree
  fragility, OR re-add a worktree per batch with explicit
  documentation of its lifecycle.

- [x] **3.1  Batch: privacy notices and acknowledgements** (4 migrated +
  2 N/A out of 6).
  - [x] `research-and-planning-privacy-notice` (`e58adccc` + `c879c6c2`).
    3 steps. 23/23 smoke checks.
  - [x] `code-of-conduct-notice` (`e58adccc` + `a054d210`). 3 steps;
    step 2 read-only auto-finished.
  - [x] `united-states-hipaa-authorization-form` (`4ff6510b`). 9 steps,
    no signature-pad needed (checkbox + date for sig/witness).
    Engine uses ES modules; needs `--allow-file-access-from-files`
    flag in Chromium or local http server. Pre-existing divergence
    from conventions.
  - [x] `care-privacy-notice` (outlier, `<hash>`). Was bespoke-class
    multi-stage UI; collapsed to single continuous wizard per AGENTS.md.
    ES-module engine wrapped in IIFE + `window.CarePrivacyNotice`
    namespace for file:// portability. 17/17 form + 9/9 dashboard
    smoke checks.
  - [-] `legal-requirements-privacy-notice` — **N/A**. Static
    informational HTML with inline styles, no form, no JS. Lily
    structural refactor doesn't apply.
  - [-] `screening-program-privacy-notice` — **N/A**. Same as above.
- [x] **3.2  Batch: training and onboarding checklists** (8 of 8 done).
  - [x] `agile-checklist` (`b0ed943b` + `865ef165`). 5-step; tri-state
    Yes/No/N-A radios; 57 radio-groups.
  - [x] `employee-onboarding-checklist` (`b0ed943b` + `f18b6542`). 10
    steps, 69 Lily inputs.
  - [x] `vaccinations-checklist` (`b0ed943b` + `4b6db443`). 10 steps,
    182 Lily inputs.
  - [x] `first-aid-training-checklist` (`b0ed943b` + `8fa0cd3d`). 10
    steps, 155 inputs, tri-state radios.
  - [x] `cardiopulmonary-resuscitation-training` (`4e2a8ec2` + `75e2c130`).
    8 steps, 108 inputs.
  - [x] `employee-offboarding-checklist` (`4e2a8ec2` + `87a764d2`).
    10 steps, 153 inputs.
  - [x] `lifeguard-certification-checklist` (`4e2a8ec2` + `367f79d2`).
    10 steps, 141 radios in 47 groups.
  - [x] `who-surgical-safety-checklist` (`4e2a8ec2` + `5fffc50d`).
    5 sections, 1789 LOC pre-refactor; new `datetime-input` Lily class
    added for coordinator stamps.
- [x] **3.3  Batch: surveys and feedback** (6 of 6 done).
  - [x] `employee-satisfaction-survey` (`42033691` + `8c286daf`). 10
    steps, 204 inputs, Likert + eNPS groups.
  - [x] `encounter-satisfaction` (`42033691` + `c34f5da3`). 8 steps,
    100 radios in 21 groups, colored Likert chip scale.
  - [x] `patient-satisfaction-survey` (`42033691` + `996398da`). 10
    steps, 227 radios.
  - [x] `workplace-climate-assessment` (`42033691` + `6f1b0efe`). 10
    domains, likert-group on Lily contract.
  - [x] `workplace-safety-assessment` (`42033691` + `fdcb1622`). 10
    sections, grade-1..4 severity badges preserved.
  - [x] `workplace-stress-assessment` (`42033691` + `85e7369b`). 9
    sections, 35 likert-groups (175 radios).
- [ ] **3.4  Batch: simple single-grader assessments (~30 forms).** Allergy,
  asthma, attention deficit, audiology, autism, dental, dermatology,
  diabetes, dyslexia, ergonomic, fall risk, fertility, gastroenterology,
  genetics, gerontology, hearing aid, hematology, integumentary,
  kinesiology, learning disability, mobility, nutrition, ophthalmology,
  orthopedic, otolaryngology, sleep quality, sports medicine,
  substance abuse, urology, vaccinations.
- [ ] **3.5  Batch: multi-grader clinical assessments (~30 forms).** Major
  clinical assessments with multiple scoring engines: anesthesiology,
  audio-vestibular, birth control, blood donation, bone marrow donation,
  cardiology, cognitive, contraception, endocrinology, endometriosis,
  first responder, hormone replacement therapy, mast cell activation
  syndrome, mental health, neurology, obstetrics, occupational therapy,
  oncology, organ donation, palliative, pediatric, plastic surgery,
  post-traumatic stress, prenatal, psychiatry, psychology, pulmonology,
  renal, respirology, rheumatology, seasonal affective disorder,
  semaglutide, stroke, sundowner syndrome.
- [ ] **3.6  Batch: pre-op, post-op, intake, transfer (~10 forms).**
  `consent-to-treatment`, `hospital-discharge`, `medical-error-report`,
  `medical-records-release-permission`, `patient-intake`,
  `post-operative-report`, `pre-operative-assessment-by-patient`,
  `prescription-request`, `provider-transfer-request`, `return-to-work`.
  (Note: pre-op-by-clinician already done as canonical in Phase 1.)
- [x] **3.7  Batch: cardiovascular calculators** (4 of 4 done).
  - [x] `framingham-risk-score-for-hard-coronary-heart-disease`
    (`f8aeb9c5` + `826660ee`). 10 steps, 74 inputs.
  - [x] `heart-health-check` (`f8aeb9c5` + `6bafdfda`). 10 steps, 13
    radio-groups.
  - [x] `predicting-risk-of-cardiovascular-disease-events`
    (`f8aeb9c5` + `5e4b4676`). 10 sections, PREVENT calculator.
  - [x] `systematic-coronary-risk-evaluation-2-diabetes` (`f8aeb9c5` +
    `e61ba2b8`). 10 sections, SCORE2-Diabetes.
- [x] **3.8  Batch: language assessments** (2 of 2 done).
  - [x] `medical-language-speaking-assessment-for-cymraeg` (`f8aeb9c5`
    + `4c17c60b`). 5 sections, Welsh strings preserved, 82 rating chips.
  - [x] `medical-language-speaking-assessment-for-english` (`f8aeb9c5`
    + `1a1d468c`). 5 sections, OET-style.
- [ ] **3.9  Batch: UK statutory forms.** `united-kingdom-driver-and-vehicle-
  licensing-agency-b1-form`, `…-m1-form`, `…-v1-form`,
  `united-kingdom-lasting-power-of-attorney-for-financial-decisions`,
  `…-for-health-and-care-decisions`, `united-kingdom-maternity-certificate-
  mat-b1`, `united-kingdom-nhs-england-medical-exemption-certificate`,
  `united-kingdom-statement-of-fitness-for-work`.
- [ ] **3.10  Batch: WHO emergency/referral forms (~6 forms).**
  `who-acute-referral-form`, `who-counter-referral-form`,
  `who-emergency-first-aid-form`, `who-emergency-unit-general-form`,
  `who-emergency-unit-trauma-form`, `who-prehospital-form`.
- [ ] **3.11  Batch: misc / planning / templates.** `arc42`,
  `agile-consulting-scorecard-for-hiring-help` (if present),
  `casualty-card-form`, `emergency-medical-technician-psychomotor-
  examination`, `international-certificate-of-vaccination-or-prophylaxis`,
  `international-patient-summary`, `issue-tracker`,
  `medical-information-form-for-air-travel`,
  `objectives-and-key-results-tracker`, `advance-decision-to-refuse-treatment`,
  `advance-statement-about-care`.
- [ ] **3.12  Reconcile.** Run `bin/forms-as-kebab-case` and confirm every
  slug appears in exactly one batch above. *Acceptance:* zero forms
  unaccounted for.

---

## Phase 4 — Cleanup

- [ ] **4.1  Delete dead CSS.** Per-form `style.css` rules that target
  the old class vocabulary (`.btn`, `.form-group`, `.select-input`,
  `.step-indicator-*`, …) and have no current consumer. *Acceptance:*
  zero references to old class names across `forms/*/front-end-*-with-html/`.
- [ ] **4.2  Update per-form `front-end-form-with-html/AGENTS.md`** to
  reference the Lily conventions and the generator. Same for
  `front-end-dashboard-with-html/AGENTS.md`. *Acceptance:* every form's
  AGENTS.md points at the shared conventions doc.
- [ ] **4.3  Update `AGENTS.md`** at repo root and `forms/AGENTS.md` to
  list the Lily-based HTML stack alongside the existing Svelte and Loco
  stacks. *Acceptance:* `AGENTS/front-end-with-html-headless-lily.md`
  exists and is linked.
- [ ] **4.4  Run `bin/test`** across all 133 forms. *Acceptance:* clean.
- [ ] **4.5  Wire `--check` mode of the generators into CI** so future
  hand-edits to generated files are caught. *Acceptance:* CI fails on
  drift.
- [ ] **4.6  Tag the Lily-pinned commit** referenced by `bin/lily-sync`
  with a release note in this repo. *Acceptance:* a single line in
  `doc/lily-version.md` recording the pinned hash and date.

---

## Cross-cutting / nice-to-have

- [ ] **X.1  Storybook-style component browser for forms.** Optional:
  a static page that imports every Lily component used by these forms,
  with the project's CSS palette applied. Useful for visual review.
- [ ] **X.2  Migration script for in-browser drafts.** If any key shape
  change is unavoidable, write a one-time JS shim that runs on page
  load and migrates the localStorage payload.
- [ ] **X.3  Upstream contributions to Lily.** Any missing components
  identified in 0.4 — file or contribute back. Track here as discovered.
