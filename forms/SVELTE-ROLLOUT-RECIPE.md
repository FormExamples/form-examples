# Svelte consolidation rollout recipe

Consolidate one form's legacy split SvelteKit front-end (`front-end-form-with-svelte` +
`front-end-dashboard-with-svelte`) into a single gold-standard `front-end-with-svelte/`,
then delete the two legacy dirs. You are given `SLUG`, `PLURAL`, `TITLE`.

All paths are under `/Users/jph/git/formexamples/form-examples/forms/`.

## STEP 0 — permission self-test (FAIL FAST)
Run exactly this one Bash command FIRST (a REAL mutation test — do NOT use `cp --version`, BSD/macOS `cp` has no `--version` flag and gives a false negative):
`d=/tmp/_pt$$; mkdir -p "$d" && echo x > "$d/f" && perl -i -pe 's/x/y/' "$d/f" && cp "$d/f" "$d/g" && rm -rf "$d" && pnpm --version >/dev/null 2>&1 && echo PERMS_OK || echo PERMS_FAIL`
If the output is not exactly `PERMS_OK`, STOP IMMEDIATELY and reply with only: `PERMISSION BLOCKED`. Do NOT attempt any Write/Edit-based workaround (no copying files one-by-one, no spawning sub-agents). Only continue if you saw `PERMS_OK`.

## Worked template — STUDY IT FIRST, then mirror exactly
`cardiology-assessment/front-end-with-svelte/` is a COMPLETE, verified gold consolidation of a nested-data-model assessment form whose store is `assessment.svelte.ts` exporting `assessment` — structurally identical to your target. Read ALL of it:
- `src/lib/stores/assessment.svelte.ts` — id-keyed store: `id`, `loadForId(id, seed)`, `reset()`, localStorage persistence via `$effect.root`, the in-place **`deepAssign`** deep-merge, and `export function createDefaultAssessment()`.
- `src/routes/+layout.svelte` — theme wiring (swappable `<link>` to `static/themes/<theme>.css`, `ThemeSelect`, default Lily light, token-utility nav).
- `src/routes/+page.svelte` — welcome page (purpose/spec/docs + prominent links to form `/<plural>/new` and dashboard `/<plural>`).
- `src/routes/cardiology-assessments/+page.svelte` + `+page.ts` — SVAR DataGrid dashboard, `export const ssr = false`, Willow/WillowDark auto-follow, `select-row` → `/<plural>/[id]`.
- `src/routes/cardiology-assessments/[id]/+page.svelte` — wizard (id hydration from sample seed, Progress+StepList header, validation + ErrorSummary).
- `src/routes/cardiology-assessments/[id]/report/+page.svelte` + `report/pdf/+server.ts` — report view + PDF.
- `src/lib/data/sample-reports.ts` — sample records + engine-derived dashboard rows.
- `src/lib/config/themes.ts`, `src/lib/components/ui/ThemeSelect.svelte` + `ThemeSelectOption.svelte`, `src/app.css` (Lily token `@theme` + `:root`), `package.json`, `static/themes/`.

## Source (logic/content to port)
`SLUG/front-end-form-with-svelte/` — engine `lib/engine/`, step components `lib/components/steps/`, ui `lib/components/ui/`, store `assessment.svelte.ts` (exports `assessment`), maybe `lib/report/pdf-builder.ts` + `routes/report`. `SLUG/front-end-dashboard-with-svelte/` — `lib/data.ts`/`types.ts` (or `lib/data/`) for sample rows + columns. READ the engine's grader entry points, GradingResult type, and `utils.ts` label/colour helpers to choose dashboard columns and the report layout. If the source has no report/pdf, create them fresh (port + adapt from cardiology-assessment).

## Recipe
1. Copy the source WITHOUT its (often multi-GB) build artefacts — never `cp -r` the whole dir, its `node_modules` can be 20GB+: `rsync -a --exclude node_modules --exclude .svelte-kit --exclude build SLUG/front-end-form-with-svelte/ SLUG/front-end-with-svelte/`. Then `cd` in; remove legacy flat routes (`src/routes/+page.svelte`, `src/routes/assessment/`, `src/routes/report/` if present). When deleting the two legacy dirs in step 9, their gitignored `node_modules` are huge — move-aside + background `rm -rf` so it doesn't block.
2. `package.json`: name → `SLUG-front-end`; add `"@svar-ui/svelte-grid": "^2.5.1"` to dependencies. If tsconfig uses `moduleResolution: "NodeNext"`, switch to `"bundler"`, and align build deps to the gold versions (vite ^7, @sveltejs/kit ^2.50, @sveltejs/vite-plugin-svelte ^6, @sveltejs/adapter-auto ^7, svelte-check ^4.3, vitest ^4, pdfmake ^0.3, @types/pdfmake ^0.3) — otherwise SVAR's `svelte` export condition breaks the SSR build.
3. Rewrite the store id-keyed exactly like cardiology-assessment's (KEEP export name `assessment`): add `id`, `loadForId(id, seed)` + `reset()` that **merge in place via `deepAssign`** (copy it verbatim, casting `this.data as unknown as Record<string, unknown>`), localStorage key `SLUG.front-end-with-svelte.<id>.v1`, and `export function createDefaultAssessment()`.
4. Build routes under `src/routes/PLURAL/`: `+page.svelte` (SVAR dashboard) + `+page.ts` (`export const ssr = false;`), `[id]/+page.svelte` (wizard; hydrate `assessment.loadForId(id, seed)` from sample-reports; Progress+StepList header; light validation + ErrorSummary anchored to REAL input ids in the step components), `[id]/report/+page.svelte` (report; id-based; POST to `…/[id]/report/pdf`), `[id]/report/pdf/+server.ts`. Plus `src/routes/+page.svelte` (welcome) and rewrite `src/routes/+layout.svelte` (theme wiring + nav, title TITLE).
5. `src/lib/data/sample-reports.ts`: ~4 sample full records (`createDefaultAssessment()` + overrides spanning the grade range) with ids like `XX-2026-0001..4`, plus a derived `sampleAssessmentRows: DashboardRow[]` produced by running the engine grader over each. Dashboard columns from the engine's GradingResult (+ a couple of data-derived flags) with the engine's label helpers; two sensible dropdown filters.
6. Themes: copy cardiology-assessment's `src/lib/config/themes.ts` (change the storage key to `SLUG.theme.v1`), copy both `ThemeSelect*.svelte`, and `cp ~/git/lilydesignsystem/lily-design-system/themes/*.css static/themes/` (ONE glob — 45 files).
7. `src/app.css`: `cp` cardiology-assessment's `src/app.css` over it (the bespoke component CSS below the token block is the shared Lily template — identical across forms). If the form has extra bespoke CSS, re-append it; otherwise the copy is complete.
8. Full token migration — NO hardcoded `bg-white`/`text-gray-*`/`bg-blue-*`/status palette anywhere. Sweep every `.svelte` and `lib/engine/utils.ts` to Lily token utilities (`bg-base-100`, `text-base-content/70`, `text-base-content/60`, `border-base-300`, `text-primary`, `bg-primary/10`; status triples → `bg-<token> text-<token>-content border-<token>` where green→success, yellow/orange→warning, red→error, blue→info, gray→base-300). Use **`perl -i -pe`** with `\b` word boundaries (BSD sed lacks `\b`), and `find … -print0 | xargs -0` (paths contain `[id]` brackets).
9. Delete `SLUG/front-end-form-with-svelte` and `SLUG/front-end-dashboard-with-svelte`.

## Critical gotchas
1. **Store reactivity:** step components capture `const d = assessment.data.<section>`. `loadForId` MUST deep-merge in place (NOT reassign `data`), or seeds never reach the inputs. Cast both args `as unknown as Record<string, unknown>`.
2. **SVAR not SSR-safe:** dashboard `+page.ts` MUST have `export const ssr = false;` (the bug only appears in `pnpm run build`, not `dev`).
3. `page.params.id ?? 'new'` (it is `string | undefined`).
4. Grid Willow/WillowDark via `--color-base-100` lightness + a `data-theme` MutationObserver (copy cardiology-assessment's dashboard logic verbatim).
5. The report `Badge` may take a numeric `grade`; if this form has no numeric grade, render the severity/classification text instead.
6. **`novalidate` on the form (CRITICAL):** add the `novalidate` attribute to the `<form>` in `src/lib/components/ui/Form.svelte`. Without it, native HTML5 constraint validation silently BLOCKS the submit event whenever any `required` field in any (later) step is empty — so the wizard's submit button does nothing and never reaches the report. Validation is done by the wizard's own `validate()` + `ErrorSummary`, not the browser. Verify submit→report works on a seeded sample id.

## Verify before reporting (run pnpm; fix until ALL green)
```
cd SLUG/front-end-with-svelte
pnpm install --prefer-offline
pnpm run check     # 0 errors, 0 warnings
pnpm run build     # MUST succeed (catches the SVAR/SSR bug)
pnpm exec vitest run   # existing engine tests pass
```
Confirm `grep -rnE "(bg|text|border)-(gray|white|blue|red|green|yellow|orange)-[0-9]" src` is empty. Do NOT use a browser.

## Report back
Plural slug, dashboard columns, the deepAssign + ssr=false handling, the exact check/build/test results, and confirm both legacy dirs were deleted.
