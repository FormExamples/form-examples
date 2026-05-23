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

- [ ] **1.1  Refactor
  `forms/pre-operative-assessment-by-clinician/front-end-form-with-html/index.html`**
  to use Lily classes and structure (form, fieldset, field, label,
  text-input, select, radio-group, checkbox-group, step-list,
  error-summary, error-message, button). *Acceptance:* HTML contains
  only Lily class names plus layout helpers and `.visually-hidden`.
- [ ] **1.2  Refactor `css/style.css`** to consume Lily classes. *Acceptance:*
  no orphan rules; every rule targets a Lily class, a `data-*`
  attribute, or a layout helper.
- [ ] **1.3  Refactor `js/app.js`** rendering functions to emit Lily-shaped
  markup. *Acceptance:* `renderStepN()` functions produce Lily HTML;
  scoring engines and `types.js` are untouched.
- [ ] **1.4  Wire validation pattern.** On Next/Submit, render
  `.error-summary` and per-field `.error-message`; bind
  `aria-describedby`. *Acceptance:* an intentionally empty required
  field surfaces a linked error summary entry and an inline message.
- [ ] **1.5  Wire `.step-list` to wizard state.** `data-status` reflects
  waiting/in-progress/finished/error; `aria-current="step"` set on the
  active step. *Acceptance:* clicking step indicators jumps and updates
  attributes correctly.
- [ ] **1.6  Refactor
  `front-end-dashboard-with-html/index.html`** to use `.data-table-*`
  classes; filters use `.text-input` and `.select`. *Acceptance:*
  filter + sort still work; rows render via Lily classes.
- [ ] **1.7  Browser smoke test via `file://`** in Chrome and Safari for
  both form and dashboard. *Acceptance:* no console errors; localStorage
  drafts round-trip.
- [ ] **1.8  LocalStorage compatibility check.** Save a draft on the
  pre-refactor build, then load on the refactored build. *Acceptance:*
  all answered fields restore.
- [ ] **1.9  Commit the canonical reference** as the template the generator
  will emit. *Acceptance:* a single squashed commit on a feature branch
  identifying it as the canonical Lily reference.

---

## Phase 2 — Generator

- [ ] **2.1  Add `bin/generate-front-end-form-with-html.py`.** Reads
  per-form SQL schema and `AGENTS.md`, emits `index.html`, `css/style.css`,
  `js/app.js`, `js/types.js`. *Acceptance:* runs against the canonical
  form and produces output byte-equivalent to the hand-refactored version
  (modulo `*-rules.js`, `*-grader.js`, `flagged-issues.js` which it does
  not touch).
- [ ] **2.2  Add `bin/generate-front-end-dashboard-with-html.py`.** Same
  shape for dashboards. *Acceptance:* canonical dashboard regenerates
  identically.
- [ ] **2.3  Add `--check` mode** that diffs current files against generator
  output without writing. *Acceptance:* CI-friendly exit code; used in
  Phase 4 to detect drift.
- [ ] **2.4  Add `--respect-existing` mode** that leaves `*-rules.js`,
  `*-grader.js`, `flagged-issues.js` and any hand-curated step copy
  unchanged. *Acceptance:* re-running the generator on a previously
  migrated form does not stomp domain files.
- [ ] **2.5  Support the no-wizard variant** for privacy notices and other
  one-pagers (omits step-list and progress, single fieldset). *Acceptance:*
  generating `care-privacy-notice` produces a valid one-pager.
- [ ] **2.6  Generator regression test.** `bin/test-front-end-html-generator`
  regenerates the canonical reference into a tmpdir and diffs against
  the committed reference. *Acceptance:* zero diff.

---

## Phase 3 — Batch migration

For each batch: run generator → spot-check 2 forms in a browser → run
`bin/test` for every touched form → commit.

- [ ] **3.1  Batch: privacy notices and one-page acknowledgements.**
  `care-privacy-notice`, `legal-requirements-privacy-notice`,
  `research-and-planning-privacy-notice`, `screening-program-privacy-notice`,
  `code-of-conduct-notice`, `united-states-hipaa-authorization-form`.
- [ ] **3.2  Batch: training and onboarding checklists.**
  `agile-checklist`, `cardiopulmonary-resuscitation-training`,
  `employee-offboarding-checklist`, `employee-onboarding-checklist`,
  `first-aid-training-checklist`, `lifeguard-certification-checklist`,
  `vaccinations-checklist`, `who-surgical-safety-checklist`.
- [ ] **3.3  Batch: surveys and feedback.**
  `employee-satisfaction-survey`, `encounter-satisfaction`,
  `patient-satisfaction-survey`, `workplace-climate-assessment`,
  `workplace-safety-assessment`, `workplace-stress-assessment`.
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
- [ ] **3.7  Batch: cardiovascular calculators.**
  `framingham-risk-score-for-hard-coronary-heart-disease`,
  `heart-health-check`, `predicting-risk-of-cardiovascular-disease-events`,
  `systematic-coronary-risk-evaluation-2-diabetes`.
- [ ] **3.8  Batch: language assessments.**
  `medical-language-speaking-assessment-for-cymraeg`,
  `medical-language-speaking-assessment-for-english`.
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
