# Plan: refactor `front-end-*-with-html/` to Lily Design System HTML headless

## 1. Goal

Replace the ad-hoc HTML/CSS/JS used in every form's
`front-end-form-with-html/` and `front-end-dashboard-with-html/` subprojects
with components from the **Lily Design System HTML headless** library, so that
all 133 forms share a single accessible, framework-free, semantically correct
component vocabulary.

Source library:
`~/git/lilydesignsystem/lily-design-system/lily-design-system-html-headless/`
(407 components, vanilla HTML + JS, zero CSS, WCAG 2.2 AAA semantics).

Conventions for the new layout are recorded in
[`AGENTS-front-end-html.md`](AGENTS-front-end-html.md).

**Empirical finding (Phase 0):** Lily components are passive markup
templates with documentation comments. Most ship zero JS. This means
Lily is consumed as a **spec/contract**, not as a runtime library —
nothing is loaded, bundled, or vendored at runtime. Forms simply conform
to Lily's class/attribute contract. See the conventions doc for details.

## 2. Why

- **Consistency.** 133 forms currently duplicate near-identical HTML/CSS/JS.
  Lily gives one shared vocabulary (`.field`, `.fieldset`, `.text-input`,
  `.step-list`, `.error-summary`, …).
- **Accessibility.** Lily ships semantic HTML + ARIA roles, keyboard
  navigation, focus management, and live-region patterns out of the box.
  Today's forms are accessible but reimplement these per-form.
- **Maintainability.** A single class vocabulary means a single stylesheet
  template and a single set of JS generators across every form.
- **Headless = no lock-in.** Lily ships zero CSS, so the existing custom
  CSS-variable palette (`--color-primary`, `--radius`, …) can be reused
  verbatim. The refactor is structural, not visual.

## 3. Scope

In scope:

- All `forms/<slug>/front-end-form-with-html/` (133 dirs).
- All `forms/<slug>/front-end-dashboard-with-html/` (133 dirs).
- The HTML page shell, CSS class vocabulary, and the JS that renders form
  fields, validates, navigates steps, and renders the dashboard table.

Out of scope:

- `front-end-form-with-svelte/`, `front-end-dashboard-with-svelte/`, and the
  Rust/Loco full-stack subprojects. (Lily for SvelteKit is a separate
  refactor with its own plan.)
- Domain logic: scoring rules, graders, flagged-issues detection,
  `types.js` factories. These remain untouched.
- LocalStorage keys (`<slug>.front-end-form-with-html.v1`). Preserved so
  existing in-browser state survives the migration.
- The Lily library itself. We consume it; we do not modify it.

## 4. Current state (summary)

Researched in this session — see findings in conversation.

- Standard layout per form:
  `index.html` (4–6 KB) + `css/style.css` (460–650 LOC) + `js/app.js`
  (102–1789 LOC) + `js/types.js` + form-specific `*-rules.js`, `*-grader.js`,
  `flagged-issues.js`.
- Vanilla classic `<script>` tags (no modules) so pages work via `file://`.
- LocalStorage persistence, IIFE wrappers, `window.FormNameCamelCase` namespace.
- Existing class vocabulary: `.btn`, `.btn-primary`, `.form-group`, `.label`,
  `.text-input`, `.select-input`, `.fieldset`, `.progress`, `.step-indicator`,
  `.report-region`, `.empty-message`, `.visually-hidden`.
- Highly consistent across the 133 forms; care-privacy-notice is the
  notable outlier (no scoring, inline `display:none` step divs).

## 5. Lily mapping (current → Lily class name)

| Current                  | Lily HTML headless                       | Notes |
|--------------------------|-------------------------------------------|-------|
| `.btn` / `.btn-primary` / `.btn-secondary` | `.button` + `data-variant` attribute | Visual difference lives in consumer CSS keyed on `data-variant`. |
| `.form-group`            | `.field`                                  | Wrapper for label + input + error-message. |
| `.label`                 | `.label`                                  | Identical name. |
| `.text-input`            | `.text-input`                             | Identical name. |
| `<input type="email">`   | `.email-input`                            | Lily uses input-type-specific class. |
| `<input type="number">`  | `.number-input`                           | — |
| `<input type="date">`    | `.date-input`                             | — |
| `<textarea>`             | `.text-area-input`                        | — |
| `.select-input`          | `.select`                                 | Applied to `<select>`. |
| radios in a group        | `.radio-group` + `.radio-input`           | New structural wrapper. |
| checkboxes in a group    | `.checkbox-group` + `.checkbox-input`     | — |
| `.fieldset` / `.fieldset-legend` | `.fieldset` / `.fieldset-legend`  | Already aligned. |
| `.progress` / `.progress-bar` / `.progress-bar-fill` | `.progress` (HTML `<progress>`) | Replace div-based with native `<progress>`. |
| `.step-indicator` / `.step-indicator-list` / `.step-indicator-btn` | `.step-list` + `.step-list-item` (`<ol>` + `<li>`) with `data-status` and `aria-current="step"` | Per-step status now a data attribute. |
| ad-hoc inline errors     | `.error-message` (per field) + `.error-summary` (top of page) | New. |
| ad-hoc empty state       | `.alert` with `data-type="info"`          | Reuses Lily alert. |
| `.report-region`         | `.panel` with `role="region"` + `aria-live="polite"` | — |
| `.visually-hidden`       | unchanged (consumer utility; Lily has no CSS) | Stays in `style.css`. |
| dashboard `<table>`      | `.data-table` family (`.data-table-head`, `.data-table-body`, `.data-table-row`, `.data-table-th`, `.data-table-td`) | Filter inputs reuse `.text-input` / `.select`. |

Validation patterns (new):

- `.error-summary` rendered at top of form when validation fails on
  Next/Submit; links to each erroneous field by id.
- `.error-message` rendered inside `.field`, wired with
  `aria-describedby` on the input.

## 6. Strategy

Two-track approach:

1. **Template + regenerate.** Because the 133 forms are highly uniform,
   build a single canonical pair of templates (form + dashboard) and a
   generator script that produces every form's `front-end-*-with-html/`
   from the per-form spec (`forms/<slug>/AGENTS.md`, SQL schema, scoring
   rules).
2. **Curate the canonical reference first.** Pre-operative-assessment-by-
   clinician is already the canonical layout per `AGENTS.md`. Refactor it
   by hand to Lily, prove the pattern end-to-end, then propagate.

The generator approach is favored: it makes the next 130+ migrations
mechanical, surfaces template gaps early, and is the only sustainable way
to keep 133 frontends in sync with future Lily releases.

## 7. Phases

### Phase 0 — Foundations (do once)

- F0.1  **[done]** Decide Lily consumption model. **Resolved:** Lily is
  a spec, not a runtime. Generators read it at authoring time; no
  runtime dependency, no vendored runtime files, no bundler. Recorded
  in `AGENTS-front-end-html.md` §2.
- F0.2  **[done]** Write `forms/AGENTS-front-end-html.md` documenting
  the new Lily-based conventions (class vocabulary, JS load order,
  persistence key, accessibility patterns, validation pattern).
- F0.3  Add `bin/lily-sync` — a doc-snapshotting helper that copies
  Lily's spec comments into `doc/lily-spec/` and records the pinned
  commit hash in `doc/lily-version.md`. Not a runtime sync.
- F0.4  Write `bin/generate-front-end-form-with-html.py` and
  `bin/generate-front-end-dashboard-with-html.py` skeletons.

### Phase 1 — Canonical reference

- F1.1  Hand-refactor
  `forms/pre-operative-assessment-by-clinician/front-end-form-with-html/`
  to use Lily classes and structure.
- F1.2  Hand-refactor the matching `front-end-dashboard-with-html/`.
- F1.3  Verify in browser via `file://` (no build step required).
- F1.4  Lock the resulting HTML/CSS/JS as the template the generator emits.

### Phase 2 — Refactor tool (was: Generator)

**Reframed 2026-05-23.** The original plan called for a scaffold
generator that emits fresh HTML/CSS/JS from a SQL+AGENTS spec. But the
132 other forms each carry 100–1700 LOC of hand-coded `app.js` — step
renderers, scoring wiring, conditional logic, list editors, report
rendering — that a scaffold generator would either clobber or have to
`--respect-existing` (at which point it isn't really generating).

The lever for migrating 132 existing forms is a **mechanical refactor
tool**, not a generator. It applies safe regex-level class swaps to
`index.html`, `css/style.css`, and `js/app.js` while leaving custom
rendering logic untouched. Semantic restructuring (radio-group
fieldset shape, `sectionCard` → `<fieldset class="fieldset">`, new
step-list/validation wiring) needs a parallel subagent pass per
form — that's Phase 3 batch work, not generator territory.

The scaffold generator stays in scope but is deferred to a later
phase for new forms.

- F2.1  Add `bin/lily-html-refactor` (Python). Applies safe class
  swaps in-place. Idempotent; supports `--dry-run`,
  `--scope=form|dashboard|both`, `--all`.
- F2.2  Define the safe-swap catalogue: `btn btn-*` →
  `button` + `data-variant`; `textarea` → `text-area-input`;
  `select-input` → `select`; `form-actions` → `button-group`;
  `report-region` → `panel`; `status-banner` → `alert[data-type]`;
  `<thead>`/`<tbody>` get `data-table-head`/`data-table-body`; JS
  `className = 'btn btn-*'` variants.
- F2.3  Risky-change reporting mode. Patterns the tool refuses to
  touch (`section-card`, `radio-options`, custom progress markup,
  `assessment-form`) get listed with file:line so a subagent pass can
  handle them.
- F2.4  Smoke-test the refactor tool on a held-out simple form
  (`agile-checklist`).
- F2.5  Deferred: scaffold generator for new forms.

### Phase 3 — Batch migration

Migrate in batches of ~10 forms grouped by complexity (simplest first):

- B3.1  Privacy notices and one-page acknowledgements (~6 forms).
- B3.2  Simple checklists (~10 forms).
- B3.3  Surveys (~6 forms).
- B3.4  Single-grader assessments (~30 forms).
- B3.5  Multi-grader clinical assessments (~50 forms).
- B3.6  WHO emergency/trauma forms and the rest (~30 forms).

Per batch:

1. Regenerate via generator.
2. Spot-check 1–2 forms in the batch by hand in a browser.
3. Run `bin/test` and `bin/test-form <slug>` per touched form.
4. Commit.

### Phase 4 — Cleanup (HTML)

- F4.1  Remove obsolete class names from per-form `style.css` files that
  are now superseded by the Lily-based base stylesheet template.
- F4.2  Update each form's `front-end-form-with-html/AGENTS.md` and
  `front-end-dashboard-with-html/AGENTS.md` to reference the new
  conventions.
- F4.3  Update top-level `AGENTS.md` and the per-stack docs to point at
  the Lily-based layout.

### Phase 5 — Lily Svelte conversion (in progress)

Mirror the Lily HTML refactor in the SvelteKit subprojects: rewrite every
form's `src/lib/components/ui/*.svelte` to conform to the
**Lily Design System Svelte headless** contract (same props as the
upstream component of the same name; same emitted CSS class names; same
ARIA + keyboard behaviour). Conventions live in
[`AGENTS-front-end-svelte.md`](AGENTS-front-end-svelte.md).

- F5.1  **[done]** Snapshot Lily Svelte components into
  `forms/lily-svelte-spec/` (408 components, 1,628 files). Pin the
  upstream commit in `forms/lily-svelte-version.md`. Tool:
  `bin/lily-svelte-sync`.
- F5.2  **[done]** Author the contract doc
  ([`AGENTS-front-end-svelte.md`](AGENTS-front-end-svelte.md)) covering
  the component vocabulary, prop conventions, page shell, validation
  pattern, and accessibility commitments.
- F5.3  **[done]** Link the contract from top-level `AGENTS.md`,
  `index.md`, `spec.md`, `forms/AGENTS.md`, and the per-stack
  `AGENTS/front-end-with-sveltekit-tailwind-svar.md`.
- F5.4  Pilot-refactor a canonical Svelte form (target:
  `pre-operative-assessment-by-clinician/front-end-form-with-svelte/`).
  Lock the resulting layout as the template the batch refactor mirrors.
- F5.5  Add `bin/lily-svelte-refactor` (analogous to
  `bin/lily-html-refactor`) — mechanical Svelte prop / class swaps with
  `--dry-run`, `--check`, `--scope`, `--all` flags.
- F5.6  Batch migrate the remaining 132 forms via subagent waves,
  committing per form with `git commit --only forms/<slug>/`.
- F5.7  Cleanup: ensure no legacy `Badge.svelte`/`SectionCard.svelte`/etc.
  with non-Lily class output remains; align Tailwind theme tokens to the
  shared Lily class names.

## 8. Compatibility

- **LocalStorage keys unchanged.** Existing browsers with saved drafts
  must continue to load after the refactor. The generator preserves
  `<slug>.front-end-form-with-html.v1` and runs a one-time merge over an
  empty Lily-shaped state.
- **No build step introduced.** Pages must continue to work via
  `file://`. Lily ships HTML+JS; we copy files, we do not bundle.
- **Visual parity.** First pass keeps the existing CSS palette. Visual
  redesign is a separate effort.
- **No breaking URL changes.** Directory structure
  (`forms/<slug>/front-end-form-with-html/index.html`) is preserved.

## 9. Risks

- **Outlier forms.** care-privacy-notice and the simplest one-pagers don't
  use a step-list at all. The generator must support a "no-wizard" mode
  that omits `.step-list` and the progress bar.
- **Field-type coverage.** Some forms use measurement inputs, signatures,
  PIN-style inputs, NHS-number-style inputs. Verify the corresponding
  Lily components exist before reaching those batches (they appear to —
  `measurement-instance-input`, `signature-pad`,
  `united-kingdom-national-health-service-number-input`, etc.).
- **Lily 0.2.0 is pre-1.0.** Class names may still change. Pin to a
  specific commit in the vendored snapshot and document the pinned hash.
- **JS-namespace collisions.** Lily's per-component IIFEs run `querySelectorAll`
  on page load. Confirm they don't conflict with the form's own IIFE.
- **Generator round-trip drift.** Hand-edits to a generated file would be
  silently overwritten next run. Mitigation: keep the boundary clear —
  generated files are HTML/CSS/JS scaffolds; domain logic stays in
  separately-named files the generator leaves alone.

## 10. Acceptance criteria

- Every `forms/<slug>/front-end-form-with-html/index.html` references
  only Lily class names (plus `.visually-hidden` and per-page layout
  helpers).
- Every dashboard renders via `.data-table-*` classes.
- `bin/test` passes for every form.
- Opening any form via `file://` in Chrome and Safari loads, advances
  through steps, validates, and generates a report — without console
  errors.
- LocalStorage drafts from before the refactor still load.

## 11. Open questions

- Vendor Lily by copy, by submodule, or by symlink? (Plan assumes copy.)
- One shared `css/style.css` per form (current), or a single shared
  stylesheet pulled in by relative path from a top-level
  `front-end-html-shared/css/`? (Plan defers this to Phase 4.)
- Do we want a shared `js/lily/` directory under each form, or a single
  top-level `front-end-html-shared/lily/` referenced by relative paths?
  (Trade-off: `file://` portability vs. duplication.)
