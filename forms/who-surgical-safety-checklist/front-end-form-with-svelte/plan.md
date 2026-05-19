# WHO Surgical Safety Checklist — SvelteKit form plan

## Phase 1 — Scaffold

- [x] `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`,
      `.gitignore`.
- [x] App shell `src/app.css`, `src/app.html`, `src/app.d.ts`.

## Phase 2 — Engine

- [x] `src/lib/checklist/types.ts` — `WhoSurgicalSafetyChecklist`, `TeamMember`,
      `SafetyFlag`.
- [x] `src/lib/checklist/factory.ts` — `createEmptyChecklist()` /
      `createEmptyTeamMember()`.
- [x] `src/lib/checklist/flags.ts` — `computeSafetyFlags()` (pure).
- [x] `src/lib/checklist/completion.ts` — `computeStatus()` plus per-phase
      predicates (pure).
- [x] `src/lib/checklist/flags.test.ts` — Vitest coverage for every flag and
      its non-trigger inverse.
- [x] `src/lib/checklist/completion.test.ts` — Vitest coverage for each
      lifecycle transition.

## Phase 3 — UI

- [x] `src/lib/config/steps.ts` — step metadata (0–4).
- [x] `src/lib/stores/checklist.svelte.ts` — class-based reactive store with
      localStorage persistence under `who-surgical-safety-checklist-draft`.
- [x] UI components in `src/lib/components/ui/`.
- [x] `Step0CaseDetails`, `Step1SignIn`, `Step2TimeOut`, `Step3SignOut`,
      `Step4Summary`.

## Phase 4 — Routing

- [x] `src/params/step.ts` — `[step=step]` matcher for 0–4.
- [x] `src/routes/+layout.svelte` — header + localStorage bind.
- [x] `src/routes/+page.svelte` — redirect to `/checklist/0`.
- [x] `src/routes/checklist/[step=step]/+page.svelte` — dynamic wizard page.

## Phase 5 — Export

- [x] `src/lib/report/pdf-builder.ts` — `pdfmake` doc-definition builder.
- [x] Step 4 download buttons for PDF and JSON.

## Phase 6 — Verification

- [ ] `pnpm install` (deferred — run manually).
- [ ] `pnpm test` — Vitest passes.
- [ ] `pnpm check` — svelte-check passes.
- [ ] `bin/test-form who-surgical-safety-checklist` passes.
