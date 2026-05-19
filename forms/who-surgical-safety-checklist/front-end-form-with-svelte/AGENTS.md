# WHO Surgical Safety Checklist — SvelteKit form agent instructions

See [`../AGENTS.md`](../AGENTS.md) for the form-wide data model and
[`../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md`](../../../AGENTS/front-end-with-sveltekit-tailwind-svar.md)
for the project-wide SvelteKit conventions.

## Directory map

- `package.json` / `svelte.config.js` / `vite.config.ts` / `tsconfig.json` — scaffold
- `src/app.css` / `src/app.html` / `src/app.d.ts` — app shell
- `src/lib/checklist/`
  - `types.ts` — `WhoSurgicalSafetyChecklist`, `TeamMember`, `SafetyFlag`
  - `factory.ts` — `createEmptyChecklist()` / `createEmptyTeamMember()`
  - `flags.ts` — `computeSafetyFlags()` (pure)
  - `completion.ts` — `computeStatus()` and per-phase predicates (pure)
  - `flags.test.ts` / `completion.test.ts` — Vitest unit tests
- `src/lib/components/`
  - `Step0CaseDetails.svelte` … `Step4Summary.svelte`
  - `ui/TextField.svelte`, `NumberField.svelte`, `RadioGroup.svelte`,
    `YesNo.svelte`, `YesNoNa.svelte`, `YesNa.svelte`, `FlagBanner.svelte`,
    `StepNav.svelte`
- `src/lib/stores/checklist.svelte.ts` — class-based reactive store with
  localStorage persistence
- `src/lib/config/steps.ts` — step metadata (0–4)
- `src/lib/report/pdf-builder.ts` — `pdfmake` doc-definition builder
- `src/params/step.ts` — `/checklist/[step=step]/` param matcher (0–4)
- `src/routes/+layout.svelte` — header + localStorage load/save
- `src/routes/+page.svelte` — redirect to `/checklist/0`
- `src/routes/checklist/[step=step]/+page.svelte` — dynamic wizard step page

## Conventions

- Empty string `''` for unanswered text / enum fields; `null` for numeric.
- camelCase property names matching the SQL snake_case columns of
  `who_surgical_safety_checklist` and `team_member`.
- Step components 1-indexed by name (`Step0CaseDetails` through `Step4Summary`)
  to align with the project convention.
- UI components are pure `$bindable`-prop building blocks under
  `src/lib/components/ui/`.
- LocalStorage key: `who-surgical-safety-checklist-draft`.
- No `$effect` in the scoring engine; effects only in the layout (persistence)
  and the route page (URL → store sync).

## Verify

```sh
pnpm test
pnpm check
```
