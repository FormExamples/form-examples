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
- [x] **0.2  Add `bin/lily-sync`.** Doc-snapshotting helper that copies
  Lily's component HTML files (with their documentation comment blocks)
  from
  `~/git/lilydesignsystem/lily-design-system/lily-design-system-html-headless/components/`
  into `forms/lily-spec/` (407 files) and records the pinned upstream
  commit hash + date in `forms/lily-version.md`. **Not** a runtime sync.
  `bin/lily-sync --check` verifies the snapshot matches upstream
  without writing. Idempotent: re-running with no upstream change is
  a no-op. Acceptance met.
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
- [x] **3.4  Batch: simple single-grader assessments** (30 of 30 done;
  pilot asthma 3.0 + 29 in this batch). Mechanical pass `54937f23`;
  structural commits below.
  - [x] `allergy-assessment` (`54937f23` + `5a27d0aa`).
  - [x] `asthma-assessment` — pilot 3.0 (`a601dfb7` + `3ea76ccd`).
  - [x] `attention-deficit-assessment` (`54937f23` + `6972cc9d`).
  - [x] `audiology-assessment` (`54937f23` + `22014d0a`).
  - [x] `autism-assessment` (`54937f23` + `58ebdd4f`).
  - [x] `dental-assessment` (`54937f23` + `dff6f915`).
  - [x] `dermatology-assessment` (`54937f23` + `8b166bf7`).
  - [x] `diabetes-assessment` (`54937f23` + `fbb9fa07`).
  - [x] `dyslexia-assessment` (`54937f23` + `66d639e0`).
  - [x] `ergonomic-assessment` (`54937f23` + `c9698067`).
  - [x] `fall-risk-assessment` (`54937f23` + `fb5ddf17`).
  - [x] `fertility-assessment` (`54937f23` + `562e8ef9`).
  - [x] `gastroenterology-assessment` (`54937f23` + `0a693df4`).
  - [x] `genetics-assessment` (`54937f23` + `bde2dc0b`).
  - [x] `gerontology-assessment` (`54937f23` + `f163b138`).
  - [x] `hearing-aid-assessment` (`54937f23` + `69c32f47`).
  - [x] `hematology-assessment` (`54937f23` + `cab041a4`).
  - [x] `integumentary-assessment` (`54937f23` + `7617b24b`).
  - [x] `kinesiology-assessment` (`54937f23` + `2f11e484`).
  - [x] `learning-disability-assessment` (`54937f23` + `32a26b`).
  - [x] `mobility-assessment` (`54937f23` + `1d7813`).
  - [x] `nutrition-assessment` (`54937f23` + `48b585`).
  - [x] `ophthalmology-assessment` (`54937f23` + `2bde08`).
  - [x] `orthopedic-assessment` (`54937f23` + `d039b3`).
  - [x] `otolaryngology-assessment` (`54937f23` + `04504e73`).
  - [x] `sleep-quality-assessment` (`54937f23` + `225affa6`).
  - [x] `sports-medicine-assessment` (`54937f23` + `839d04eb`).
  - [x] `substance-abuse-assessment` (`54937f23` + `517051`).
  - [x] `urology-assessment` (`54937f23` + `7fb243`).
  - [x] `vaccinations-assessment` (`54937f23` + `0bbc6d`). Structurally
    different (ES-module app.js, separate report.html); shell + CSS
    converted, step-list/error-summary scaffolded but app.js wiring
    deferred — bin/test-form passes.
- [x] **3.5  Batch: multi-grader clinical assessments** (34 of 34 done).
  Mechanical pass `84b1ce4a`; structural commits below.
  - [x] `anesthesiology-assessment` (`84b1ce4a` + `0ae7af`).
  - [x] `audio-vestibular-assessment` (`84b1ce4a` + `dd1261`).
  - [x] `birth-control-assessment` (`84b1ce4a` + `c0d8d6`).
  - [x] `blood-donation-assessment` (`84b1ce4a` + `4ed5f3`).
  - [x] `bone-marrow-donation-assessment` (`84b1ce4a` + `c482e2`).
  - [x] `cardiology-assessment` (`84b1ce4a` + `20cecc`).
  - [x] `cognitive-assessment` (`84b1ce4a` + `b42734`).
  - [x] `contraception-assessment` (`84b1ce4a` + `9851ad4`).
  - [x] `endocrinology-assessment` (`84b1ce4a` + `6567425`).
  - [x] `endometriosis-assessment` (`84b1ce4a` + `fa5f64a`).
  - [x] `first-responder-assessment` (`84b1ce4a` + `8a2fd52`).
  - [x] `hormone-replacement-therapy-assessment` (`84b1ce4a` + `bac3c0c`).
  - [x] `mast-cell-activation-syndrome-assessment` (`84b1ce4a` + `61ff976`).
  - [x] `mental-health-assessment` (`84b1ce4a` + `3020b38`).
  - [x] `neurology-assessment` (`84b1ce4a` + `cb4739c`).
  - [x] `obstetrics-assessment` (`84b1ce4a` + `b260d01`).
  - [x] `occupational-therapy-assessment` (`84b1ce4a` + `e19fa9b`).
  - [x] `oncology-assessment` (`84b1ce4a` + `ba9688d`).
  - [x] `organ-donation-assessment` (`84b1ce4a` + `05d60d2`).
  - [x] `palliative-assessment` (`84b1ce4a` + `8c7ad4a`).
  - [x] `pediatric-assessment` (`84b1ce4a` + `c86429f`).
  - [x] `plastic-surgery-assessment` (`84b1ce4a` + `b2f1a3`).
  - [x] `post-traumatic-stress-assessment` (`84b1ce4a` + `320869`).
  - [x] `prenatal-assessment` (`84b1ce4a` + `af9b9f`).
  - [x] `psychiatry-assessment` (`84b1ce4a` + `d0e280`).
  - [x] `psychology-assessment` (`84b1ce4a` + `911a92`).
  - [x] `pulmonology-assessment` (`84b1ce4a` + `480360`).
  - [x] `renal-assessment` (`84b1ce4a` + `b195e2`).
  - [x] `respirology-assessment` (`84b1ce4a` + `2e6c8d6`).
  - [x] `rheumatology-assessment` (`84b1ce4a` + `10c0001`).
  - [x] `seasonal-affective-disorder-assessment` (`84b1ce4a` + `8fbbac8`).
  - [x] `semaglutide-assessment` (`84b1ce4a` + `c653db8`).
  - [x] `stroke-assessment` (`84b1ce4a` + `e132abb`).
  - [x] `sundowner-syndrome-assessment` (`84b1ce4a` + `b6c74ad`).
- [x] **3.6  Batch: pre-op, post-op, intake, transfer** (9 of 10 done +
  1 N/A).
  - [x] `consent-to-treatment` (`9bfe03ec` + `24f9da9c`). 8 sections;
    sig as checkbox+date+name (HIPAA pattern).
  - [x] `hospital-discharge` (`9bfe03ec` + `5f449312`). 10 sections;
    list editors with LIST_SLOTS tracking.
  - [x] `medical-error-report` (`9bfe03ec` + `d1f43499`). 10 sections,
    conditional visibility honored in validateForm.
  - [x] `medical-records-release-permission` (`9bfe03ec` + `f9836e46`).
    8 sections; sig as patientSignatureConfirmed yes/no + date.
  - [x] `patient-intake` (`9bfe03ec` + `72c6168d`). 10 sections,
    checkboxGroup builder added for multi-select fields.
  - [x] `post-operative-report` (`9bfe03ec` + `b941e197`). 10 sections;
    Clavien-Dindo grade badges preserved.
  - [x] `pre-operative-assessment-by-patient` (`9bfe03ec` + `a08343c4`).
    16 sections (patient companion to canonical clinician). 27/27.
  - [x] `prescription-request` (`9bfe03ec` + `2874e50a`). 5 sections.
  - [x] `provider-transfer-request` (`9bfe03ec` + `c918f848`). 9
    sections, SBAR shape. 27/27.
  - [-] `return-to-work` — **N/A**. `front-end-form-with-html/`
    contains only docs (no index.html / css / js). Implementation
    hasn't been built; Lily refactor doesn't apply until the form
    is implemented.
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
- [x] **3.9  Batch: UK statutory forms** (8 of 8 done). Mechanical pass
  `5862a30a`; structural commits below.
  - [x] `united-kingdom-driver-and-vehicle-licensing-agency-b1-form`
    (`5862a30a` + `df160b5`).
  - [x] `united-kingdom-driver-and-vehicle-licensing-agency-m1-form`
    (`5862a30a` + `903ebbe`).
  - [x] `united-kingdom-driver-and-vehicle-licensing-agency-v1-form`
    (`5862a30a` + `c9b4219`).
  - [x] `united-kingdom-lasting-power-of-attorney-for-financial-decisions`
    (`5862a30a` + `4908c7f`). Special: Alpine.js wizard — kept x-model
    bindings, added Lily aliases in CSS only.
  - [x] `united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions`
    (`5862a30a` + `73ddbe1`). Sticky validity sidebar preserved.
  - [x] `united-kingdom-maternity-certificate-mat-b1` (`5862a30a` + `e7d10df`).
  - [x] `united-kingdom-nhs-england-medical-exemption-certificate`
    (`5862a30a` + `82e07ba`). Special: static HTML (not JS-rendered) —
    converted each `<section class="step">` to `<fieldset class="step fieldset">`.
  - [x] `united-kingdom-statement-of-fitness-for-work` (`5862a30a` + `7c170c1`).
- [x] **3.10  Batch: WHO emergency/referral forms** (6 of 6 done).
  - [x] `who-acute-referral-form` (`b3e14cf3` + `3faec322`). 8-section
    SBAR shape. 61 Lily inputs.
  - [x] `who-counter-referral-form` (`b3e14cf3` + `339d3e2b`). 7
    sections; NHS-blue tokens.
  - [x] `who-emergency-first-aid-form` (`b3e14cf3` + `fc9b2c91`).
    12-section CFAR; 30/30 smoke checks.
  - [x] `who-emergency-unit-general-form` (`b3e14cf3` + `37b667f8`).
    16 sections; ROS/PE inset-block cards.
  - [x] `who-emergency-unit-trauma-form` (`b3e14cf3` + `c9865b98`).
    **17 sections** (largest in corpus by section count); 179
    error-message spans; app.js compacted 1789→1320 LOC.
  - [x] `who-prehospital-form` (`b3e14cf3` + `c7957f7e`). 16 EMS
    sections; empty-submit → 24 validation errors.
- [x] **3.11  Batch: misc / planning / templates** (7 done + 3 N/A).
  Mechanical pass `592c0963`; structural commits below.
  - [x] `casualty-card-form` (`592c0963` + `74cfeac5`). NEWS2, 14 steps.
  - [x] `emergency-medical-technician-psychomotor-examination`
    (`592c0963` + `664295e6`). Critical-criteria checklist, tri-state.
  - [x] `international-patient-summary` (`592c0963` + `022d1211`). 10 IPS sections.
  - [x] `medical-information-form-for-air-travel` (`592c0963` + `4e36a0ef`).
    Inline-HTML (no JS builders); Alpine.js `x-data` retained.
  - [x] `advance-decision-to-refuse-treatment` (`592c0963` + `460bf358`).
    Per-treatment subgroups, life-sustaining subgroup.
  - [x] `advance-statement-about-care` (`592c0963` + `e8b0e905`).
    People list editor.
  - [x] `issue-tracker` (`cfbaf235`). Small (151 LOC) inline-HTML
    wizard; single-page progress, no step-list needed.
  - [-] `arc42` — **N/A**. Dir-only, no front-end-form-with-html implementation.
  - [-] `international-certificate-of-vaccination-or-prophylaxis` — **N/A**.
  - [-] `objectives-and-key-results-tracker` — **N/A**.
- [x] **3.12  Reconcile** (9 stragglers + N/A confirmations). Mechanical
  passes `5c29097c` and `26b19624`. Nine forms not assigned to any
  earlier 3.x batch were refactored here:
  - [x] `architecture-decision-record` (`5c29097c` + `77c6cf`).
  - [x] `genetic-assessment` (`5c29097c` + `19d4f0`). Distinct from
    `genetics-assessment` (done in 3.4).
  - [x] `gynecology-assessment` (`5c29097c` + `11e131`).
  - [x] `agile-principles-assessment` (`26b19624` + `61184a0d`).
  - [x] `eye-prescription` (`26b19624` + `e38620b4`).
  - [x] `meeting` (`7ee60cf4`). No mechanical swaps needed.
  - [x] `agile-consulting-scorecard-for-hiring-help` (`1da183d7`).
    Static HTML (no JS builders) — Lily classes applied inline.
  - [x] `international-certificate-of-vaccination-or-prophylaxis`
    (`5f5b3a1f`). Non-standard `script.js` / `styles.css` paths preserved.
  - [x] `objectives-and-key-results-tracker` (`420d9ca5`). Non-standard
    top-level `app.js`/`engine.js` paths preserved; ES-module wiring kept.
  - Confirmed N/A (static informational HTML, no form/JS):
    `legal-requirements-privacy-notice`, `screening-program-privacy-notice`.
  - Confirmed N/A (no front-end-form-with-html implementation):
    `arc42`, `outpatient-outcome`, `return-to-work`,
    `uk-nhs-england-medical-exemption-certificate` (note: a stub directory
    that is not the same as `united-kingdom-nhs-england-medical-exemption-certificate`,
    which IS implemented and refactored in 3.9).
  - Canonical reference (already refactored in Phase 1):
    `pre-operative-assessment-by-clinician` (`2566291c` form,
    `be899e4d` dashboard, `5ac6e2a0` tasks-progress).

---

## Phase 4 — Cleanup

- [x] **4.1  Delete dead CSS** (`b23413e8`). Audit found one outlier
  (`vaccinations-assessment`, legacy aliases retained by design for its
  ES-module engine); 3 forms had leftover old refs in HTML and were
  cleaned (MEDIF mismatched fieldset/section tags; both
  legal-requirements- and screening-program-privacy-notice
  acknowledgment forms upgraded `.form-group` → `.field`,
  `.btn-submit` → `.button[data-variant="primary"]`).
- [x] **4.2  Update per-form `front-end-*-with-html/AGENTS.md`** to
  reference Lily conventions (`d4cf19f8`). 266 files updated (133 form
  + 133 dashboard), each now linking to `forms/AGENTS-front-end-html.md`.
- [x] **4.3  Update top-level `AGENTS.md`** and `forms/AGENTS.md` (done
  pre-Phase 3 — link to `forms/AGENTS-front-end-html.md` present under
  Technology stacks since Phase 0.7).
- [x] **4.4  Run validation across all 133 forms** (Phase 3 + 4 commits).
  Per-form `bin/test-form` validation: zero Lily-related failures
  across 134 form directories. (Pre-existing infrastructure noise in
  svelte/cargo subprojects is unrelated to the Lily refactor.)
- [x] **4.5  Wire `--check` mode of `bin/lily-html-refactor` into CI**
  (`7f48ef66`). `bin/lily-html-refactor --check --all` exits non-zero
  on drift; passes cleanly today (0 safe swaps pending). Documented
  as the CI hook in `AGENTS-front-end-html.md` §10.
- [x] **4.6  Record pinned Lily upstream commit** (`310af3dd`).
  `forms/lily-version.md` records the pinned hash `7a51013`,
  pin-date 2026-05-24, and manual refresh procedure pending
  `bin/lily-sync` (Phase 0.2 is still open).

---

## Phase 5 — Lily Svelte conversion

- [x] **5.1  Add `bin/lily-svelte-sync`** + snapshot the Lily Svelte
  components into `forms/lily-svelte-spec/` (408 components, 1,628 files);
  record the pinned upstream commit `68d8081a` in
  `forms/lily-svelte-version.md`. `--check` mode added for CI drift.
- [x] **5.2  Write `forms/AGENTS-front-end-svelte.md`** — Lily Svelte
  contract doc with the component vocabulary, prop conventions, page
  shell, validation pattern, and accessibility commitments.
- [x] **5.3  Link the Svelte contract** from top-level `AGENTS.md`,
  `index.md`, `spec.md`, `forms/AGENTS.md`, and the per-stack
  `AGENTS/front-end-with-sveltekit-tailwind-svar.md`.
- [x] **5.4  Pilot-refactor canonical Svelte form** (`6fd8a437`).
  `pre-operative-assessment-by-clinician/front-end-form-with-svelte/`:
  22 Lily-shape UI components added under `src/lib/components/ui/`
  (TextInput, NumberInput, DateInput, EmailInput, TelInput, Select,
  TextAreaInput, RadioGroup, RadioInput, CheckboxGroup, CheckboxInput,
  Button, Form, Fieldset, Field, ErrorSummary, StepList, StepListItem,
  Progress, Panel, Hint, Alert), each mirroring the upstream
  `forms/lily-svelte-spec/<Name>/<Name>.svelte` API. `+page.svelte`
  rewritten to the AGENTS-front-end-svelte §5 page shell (native
  `<progress>`, `<ol class="step-list">`, `<Form>`, `<ErrorSummary>`,
  Lily `Button` variants, `<Panel>`). `assessment.svelte.ts` extended
  with `errors`, `errorSummaryHidden`, `submitted`, derived
  `percentComplete`, derived `steps[]` with per-step status, and a
  `validate()` method gating Submit on required fields. All 16
  `StepNN*.svelte` rewritten to use Lily `Fieldset` + `Field` +
  `TextInput`/`NumberInput`/`DateInput`/`Select`/`TextAreaInput`.
  `report/+page.svelte` wraps the report in `<Panel>` and uses
  `<Alert data-type>` for the composite-risk callout. `app.css`
  extended with minimal CSS rules for every Lily class name,
  tokenised through Tailwind 4 `@theme`. `pnpm check`: 0 errors,
  0 warnings. `pnpm test`: 16/16 passing. `pnpm build`: succeeds.
  Engine, store internals, and report content unchanged.
- [x] **5.5  Add `bin/lily-svelte-refactor`** (mechanical refactor tool).
  Safe class-attribute swaps with `--dry-run`, `--check`, `--scope`,
  `--all`, `--show-risky` flags. Reports risky-pattern catalogue per
  form (renames needed, raw `<input>` / `<select>` / `<textarea>`
  tags outside `src/lib/components/ui/`, non-Lily progress markup).
  Skips raw-tag detection inside `src/lib/components/ui/` because the
  Lily UI components legitimately wrap native inputs there. Total
  drift across the corpus: 2,003 risky lines — 661× SectionCard,
  421× inline `<input>`, 320× TextArea, 318× inline `<select>`,
  193× SelectInput, 83× inline `<textarea>`, plus a long tail.
- [~] **5.6  Batch-migrate the remaining forms** (66 of 79 implemented
  forms done; ~13 still pending; ~54 are empty scaffolds out of scope).
  - **wave 0** (3 forms): agile-checklist `621f0c86`, care-privacy-notice
    `647418d3`, encounter-satisfaction `4a21c35b`.
  - **wave 1** (14 forms): research-and-planning-privacy-notice
    `ebef5ade`, code-of-conduct-notice `2e891181`, framingham
    `3d03932b`, heart-health-check `c3426498`, predicting-cvd
    `3f7903af`, score2-diabetes `4d9325c3`, medical-language-english
    `103426c0` (placeholder shell), medical-language-cymraeg `595e738b`
    (placeholder shell), allergy `8f763f08`, asthma `c273fa4e`,
    attention-deficit `ef1482ee`, audiology `08c89535`, autism
    `106cce34`, dental `01117b2b`. Skipped 8 empty scaffolds (HIPAA,
    employee-onboarding-checklist, vaccinations-checklist, first-aid-
    training-checklist, all 5 wave-1B surveys + CPR-training).
  - **wave 2** (31 forms): consent-to-treatment `b7cb4f86`, medical-
    records-release-permission `099ac2a3`, patient-intake `2aeca781`,
    advance-decision `d4ed710b`, advance-statement `607c128b`,
    pre-op-by-patient `914e5d0d`, hematology `36217d56`, cardiology
    `357be484`, cognitive `410cbf48`, contraception `9765e9a9`,
    dermatology `a5592e0f`, diabetes `dfd88de7`, gastroenterology
    `dad222f9`, gerontology `a7fbebb6`, hearing-aid `5db30e88`,
    kinesiology `ad829630`, mast-cell `694a10ef`, mental-health
    `051216b7`, mobility `5c975902`, neurology `e1cce2b6`,
    occupational-therapy `984f839e`, oncology `f0ee8fe2`, ophthalmology
    `57f6f634`, orthopedic `eda1c37f`, pediatric `064ee14a`,
    post-traumatic-stress `5a3bf347`, prenatal `4203dcc4`, psychiatry
    `c2263c81`, psychology `b16807e3`, pulmonology `8a177e6a`,
    respirology `56036abf`. Skipped: ergonomic (empty).
  - **wave 3** (17 forms; partial — subagent quota exhausted):
    rheumatology `a69d90a9`, semaglutide `76cb5f3f`, casualty-card
    `1f33e799`/`abcea0f2`, MEDIF `919426be`, genetic `9c3f0fb5`,
    gynecology `65b97d83`, agile-principles `06a2f7af`, outpatient-
    outcome `6d114c03`, UK DVLA B1 `7c6f10a4`, UK DVLA M1 `aca9f3de`,
    UK MAT B1 `286262c8`, WHO acute-referral `b7c1c0a3`, WHO counter-
    referral `1518a81a`, WHO emergency-first-aid `efbba49d`, WHO
    emergency-unit-general `b8a97a5e`, WHO emergency-unit-trauma
    `069fe1e8`.
  - **Still pending** (subagent quota exhaustion; resume after reset):
    sleep-quality, stroke, urology, vaccinations, hormone-replacement-
    therapy, UK DVLA V1, UK LPA-financial, UK LPA-health-care, UK
    NHS-medical-exemption, UK fit-note, who-prehospital-form (partial
    WIP in working tree), architecture-decision-record (partial WIP),
    eye-prescription, arc42 (likely empty scaffold). Plus ICVP not yet
    tackled. Total ~13 forms.
- [ ] **5.7  Cleanup.** Remove legacy non-Lily Svelte components; align
  Tailwind theme tokens to the shared Lily class names; ensure
  `bin/lily-svelte-sync --check` and `pnpm check` are clean.

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
