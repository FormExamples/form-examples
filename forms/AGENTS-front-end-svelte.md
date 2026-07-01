# AGENTS — `front-end-with-svelte/` (Lily Design System Svelte headless)

Conventions for every form's **consolidated** `front-end-with-svelte/`
subproject — a single SvelteKit app that serves both the input form (wizard)
and the dashboard from **RESTful, resource-oriented routes**, sharing one
scoring engine (`src/lib/engine/`) and UI component set
(`src/lib/components/ui/`). This consolidated single-app layout is the **gold
standard**. Legacy forms may still have split `front-end-form-with-svelte/` +
`front-end-dashboard-with-svelte/` directories, or the older flat
`+page.svelte` (wizard) / `dashboard/+page.svelte` layout; migrate them to the
RESTful routes below when touched.

## Routing (RESTful, gold standard)

The URL space is the form's **collection**, named by the **pluralised slug**
(the form's resource name — e.g. `cardiology-requests`,
`cardiology-responses`, `medical-operation-notes`). Collections use a plural
base directory; individual items use a dynamic `[id]` route parameter:

| Route file | URL | Purpose |
| --- | --- | --- |
| `src/routes/<plural>/+page.svelte` | `/<plural>/` | **Dashboard** — the collection list |
| `src/routes/<plural>/[id]/+page.svelte` | `/<plural>/[id]` | **Input form** — the single-page wizard for one item (`[id] = new` to create) |
| `src/routes/<plural>/[id]/report/+page.svelte` | `/<plural>/[id]/report` | Report view for one item (PDF via `report/pdf/+server.ts`) |
| `src/routes/+page.svelte` | `/` | **Welcome page** — explains the work (purpose, spec, documentation) and shows prominent links to the form route and the dashboard route |

So for `cardiology-requests`: `/cardiology-requests/` is the dashboard list and
`/cardiology-requests/[id]` (e.g. `/cardiology-requests/new`) is the input form.
Do **not** put the wizard at the app root (`/`) or the dashboard at
`/dashboard` — those are the legacy flat layout.

The app root (`/`) is a **welcome page**, not a form and not a dashboard. It is
a plain `+page.svelte` (no redirect loader) that explains the form's purpose,
specification, and documentation, then offers two prominent links: one to the
input form (`/<plural>/new`) and one to the dashboard (`/<plural>/`). The nav in
`+layout.svelte` links its brand to `/` and exposes Welcome / form / dashboard.
Reference implementations: `forms/cardiology-request/` and
`forms/cardiology-response/`.

## Theming (Lily themes, gold standard)

Every `front-end-with-svelte/` uses the **prebuilt Lily Design System theme
system** — do not hand-roll theme CSS.

- **Vendored themes.** All Lily theme stylesheets are copied to
  `static/themes/<name>.css` (light, dark, dim, dracula, nord, the NHS
  England/Scotland/Wales patient & practitioner themes, GDS, USWDS, …). Each is
  a standalone file; load **exactly one at a time** via a swappable
  `<link rel="stylesheet" href="{base}/themes/{theme}.css">` in `+layout.svelte`
  (they cannot be `@import`-ed together — each includes a bare `:where(:root)`
  block and they would collide).
- **The default theme is the Lily light theme.** The `@theme` block in
  `app.css` carries the Lily *light* token values, so the baseline render is
  Lily light before any stylesheet loads; the persisted default selection is
  `light` (`src/lib/config/themes.ts` `DEFAULT_THEME`). There is no "system"
  option (it would 404 on a missing stylesheet).
- **Prebuilt control.** Switch themes with the Lily `ThemeSelect` +
  `ThemeSelectOption` components (`src/lib/components/ui/`), mirroring the
  upstream headless API (classes `theme-select` / `theme-select-option`), bound
  to the theme state and reflected onto `<html data-theme>`.
- **Components consume Lily tokens, not hardcoded greys.** `app.css` registers
  the Lily palette in `@theme` (`--color-base-100/200/300`, `--color-base-content`,
  `--color-primary`, `--color-error`, …) so Tailwind emits `bg-base-100`,
  `text-base-content`, `text-error`, etc. All chrome and pages use these token
  utilities (no `bg-white` / `text-gray-*`). Lily's theme files are *unlayered*,
  so they override Tailwind's layered `@theme` defaults at runtime — every theme
  re-skins the whole app, including headings.

## Dashboard grid (SVAR)

The collection dashboard (`/<plural>/`) renders the data table with the **SVAR
Svelte DataGrid** (`@svar-ui/svelte-grid`, `Grid` + `Willow`/`WillowDark`).
Graded columns render through the shared engine label helpers. The grid is
**client-only** (its packages are not SSR-safe), so the dashboard route sets
`export const ssr = false;` in `+page.ts`. Pick `WillowDark` vs `Willow` from the
active theme's `--color-base-100` lightness so the grid follows the Lily theme,
and wire `api.on('select-row', …)` to open `/<plural>/[id]`.

Companion docs: [`AGENTS-front-end-html.md`](AGENTS-front-end-html.md),
[`plan.md`](plan.md), [`tasks.md`](tasks.md).

## 1. What Lily Svelte headless is, for our purposes

`lily-design-system-svelte-headless` is a **library of Svelte 5 components**
that ship structural markup + ARIA + keyboard behaviour, with **no styling**.
Each component under
`~/git/lilydesignsystem/lily-design-system/lily-design-system-svelte-headless/components/`
is a folder containing:

- `<Name>.svelte` — the component itself (Svelte 5 runes: `$props`, `$bindable`, `Snippet`),
- `<Name>.stories.svelte` — Storybook-style usage examples,
- `<Name>.test.ts` — Vitest unit tests,
- `index.md` — prose documentation.

Crucially, every Lily Svelte component **emits the same CSS class names** as
the Lily HTML headless library: a `<TextInput>` renders an
`<input class="text-input">`, a `<RadioGroup>` renders a
`<fieldset role="radiogroup" class="radio-group">`, and so on. This is
deliberate — the two Lily libraries share one class vocabulary so the same
stylesheet works for both.

## 2. Consumption model (decision)

Lily Svelte is consumed as a **contract**, not as a runtime npm package:

- **Each form's local `src/lib/components/ui/` mirrors the Lily Svelte API.**
  Every local component has the same prop signature, the same `bind:value`
  shape, and emits the same Lily class names as the upstream Lily Svelte
  component of the same name.
- **No runtime dependency on Lily.** The form's `package.json` does not
  depend on `lily-design-system-svelte-headless` (it is not published to
  npm). Each form remains a self-contained pnpm/SvelteKit project.
- **Pinned upstream commit recorded in [`lily-svelte-version.md`](lily-svelte-version.md).**
  Component source snapshots live in [`lily-svelte-spec/`](lily-svelte-spec/),
  refreshed by `bin/lily-svelte-sync`.

This mirrors the Lily HTML consumption model (see
[`AGENTS-front-end-html.md`](AGENTS-front-end-html.md) §2). The libraries
are paired specs; the forms are paired conformant implementations.

## 3. Component vocabulary (Lily contract)

The local `src/lib/components/ui/` directory contains one Svelte component
per Lily class. Required components per form (subset of the full Lily
catalogue — every form picks the components it needs):

### Form structure

| Concept            | Component name        | Emits                                                |
|--------------------|-----------------------|------------------------------------------------------|
| Form root          | `Form.svelte`         | `<form class="form">`                                |
| Grouped fields     | `Fieldset.svelte`     | `<fieldset class="fieldset"><legend class="fieldset-legend">…</legend>…</fieldset>` |
| Single field       | `Field.svelte`        | `<div class="field"><label class="label">…</label><slot/><span class="error-message"/></div>` |
| Hint               | `Hint.svelte`         | `<span class="hint">`                                |
| Page-level errors  | `ErrorSummary.svelte` | `<div class="error-summary" role="alert">`           |

### Inputs

| Concept            | Component name        | Emits                                                |
|--------------------|-----------------------|------------------------------------------------------|
| Single-line text   | `TextInput.svelte`    | `<input class="text-input" type="text">`             |
| Multi-line text   | `TextAreaInput.svelte` | `<textarea class="text-area-input">`                 |
| Email              | `EmailInput.svelte`   | `<input class="email-input" type="email">`           |
| Number             | `NumberInput.svelte`  | `<input class="number-input" type="number">`         |
| Date               | `DateInput.svelte`    | `<input class="date-input" type="date">`             |
| Time               | `TimeInput.svelte`    | `<input class="time-input" type="time">`             |
| Tel                | `TelInput.svelte`     | `<input class="tel-input" type="tel">`               |
| URL                | `UrlInput.svelte`     | `<input class="url-input" type="url">`               |
| File               | `FileInput.svelte`    | `<input class="file-input" type="file">`             |
| Range              | `RangeInput.svelte`   | `<input class="range-input" type="range">`           |
| Single checkbox    | `CheckboxInput.svelte`| `<input class="checkbox-input" type="checkbox">`     |
| Single radio       | `RadioInput.svelte`   | `<input class="radio-input" type="radio">`           |
| Select             | `Select.svelte`       | `<select class="select">…<option/>…</select>`        |
| Checkbox group     | `CheckboxGroup.svelte`| `<fieldset role="group" class="checkbox-group">`     |
| Radio group        | `RadioGroup.svelte`   | `<fieldset role="radiogroup" class="radio-group">`   |

### Buttons

| Concept            | Component name        | Emits                                                |
|--------------------|-----------------------|------------------------------------------------------|
| Generic button     | `Button.svelte`       | `<button class="button">` (variant via `data-variant`) |
| Submit             | `SubmitInput.svelte`  | `<input class="submit-input" type="submit">`         |
| Reset              | `ResetInput.svelte`   | `<input class="reset-input" type="reset">`           |

### Wizard / progress

| Concept            | Component name        | Emits                                                |
|--------------------|-----------------------|------------------------------------------------------|
| Step list          | `StepList.svelte`     | `<ol class="step-list">…<li/>…</ol>`                 |
| Step list item     | `StepListItem.svelte` | `<li class="step-list-item" data-status="…">…</li>`  |
| Progress bar       | `Progress.svelte`     | `<progress class="progress">`                        |

### Dashboard

| Concept            | Component name        | Emits                                                |
|--------------------|-----------------------|------------------------------------------------------|
| Data table         | `DataTable.svelte`    | `<table class="data-table">`                         |
| Table head         | (slot of DataTable)   | `<thead class="data-table-head">`                    |
| Table body         | (slot of DataTable)   | `<tbody class="data-table-body">`                    |
| Row                | `DataTableRow.svelte` | `<tr class="data-table-row">`                        |
| Header cell        | `DataTableTh.svelte`  | `<th class="data-table-th">`                         |
| Data cell          | `DataTableTd.svelte`  | `<td class="data-table-td">`                         |

### Status messages

| Concept            | Component name        | Emits                                                |
|--------------------|-----------------------|------------------------------------------------------|
| Alert              | `Alert.svelte`        | `<div class="alert" data-type="info|success|warning|error" role="alert">` |
| Panel (report)     | `Panel.svelte`        | `<section class="panel" role="region" aria-live="polite">` |

## 4. Prop conventions

Every component follows these patterns, derived from the upstream Lily
Svelte components:

- `class: className = ""` — accept an additional class via `class={…}`.
- `label: string` — accessible name (used as `aria-label` where there is no
  visible `<label>`).
- `value = $bindable("")` — text/number/date values are bindable.
- `checked = $bindable(false)` — checkbox / radio state is bindable.
- `disabled: boolean = false`, `required: boolean = false`.
- `...restProps` — spread onto the underlying HTML element.
- Children come through `Snippet`s (`children: Snippet`), not slots.

A consumer thus writes:

```svelte
<TextInput label="Full name" bind:value={data.fullName} required />
<RadioGroup label="Sex">
  {#each ['male', 'female', 'other'] as v}
    <label class="radio-input"><input type="radio" name="sex" bind:group={data.sex} value={v}> {v}</label>
  {/each}
</RadioGroup>
```

## 5. Page shell

Every input-form route (`front-end-with-svelte/src/routes/<plural>/[id]/+page.svelte`,
the wizard) follows this skeleton:

```svelte
<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Form from '$lib/components/ui/Form.svelte';
  import Progress from '$lib/components/ui/Progress.svelte';
  import StepList from '$lib/components/ui/StepList.svelte';
  import StepListItem from '$lib/components/ui/StepListItem.svelte';
  import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Panel from '$lib/components/ui/Panel.svelte';
  // …step imports…
</script>

<header class="page-header">
  <div class="page-header-inner">
    <h1>{title}</h1>
    <p class="subtitle">{subtitle}</p>
    <Progress max={100} value={percentComplete} aria-label="Form completion" />
    <StepList label={`${title} steps`} current={currentStep}>
      {#each steps as s}
        <StepListItem step={s.step} status={s.status}>{s.title}</StepListItem>
      {/each}
    </StepList>
  </div>
</header>

<main>
  <Form aria-label={title}>
    <ErrorSummary errors={errors} bind:hidden={errorSummaryHidden} />
    <!-- Step components render Lily Fieldset + Field shapes -->
    <!-- …step components… -->
    <div class="button-group">
      <Button data-variant="secondary" onclick={prev}>Previous</Button>
      <Button data-variant="primary" onclick={next}>Next</Button>
      <Button type="submit" data-variant="primary">Submit</Button>
    </div>
  </Form>
  <Panel label="Report" aria-live="polite">
    {#if !result}<p class="empty-message">Submit the form to see the report.</p>
    {:else}<!-- report rendered here -->{/if}
  </Panel>
</main>
```

Dashboards follow the analogous `DataTable` shell.

## 6. State management

- **Class-based Svelte 5 store** in `src/lib/stores/<name>.svelte.ts`
  (typically `assessment.svelte.ts`). No legacy `writable` stores.
- Public fields: `.data`, `.result`, `.currentStep`, `.reset()`,
  `.errors` (validation), plus form-specific helpers.
- Persistence key: `<slug>.front-end-with-svelte.v1` (mirrors the HTML
  convention to allow draft portability across stacks).

## 7. Validation pattern

On Next / Submit:

1. Run validators for the current step (or the whole form on Submit).
2. For each failing field, set `aria-invalid="true"` and update
   `errors[fieldId]`.
3. `ErrorSummary` populates with a `<ul>` of anchor links to each erroneous
   field by `id`. Show the summary; focus moves to it.
4. On the next successful validation, hide the summary and clear field
   errors.

`Alert data-type="error"` MAY be used in place of `ErrorSummary` when only
one error is involved.

## 8. Accessibility commitments

Identical to the HTML contract (see [`AGENTS-front-end-html.md`](AGENTS-front-end-html.md) §8).

## 9. Canonical reference

The canonical consolidated reference is:

- `forms/cardiology-response/front-end-with-svelte/` — RESTful routes:
  dashboard list at `src/routes/cardiology-responses/+page.svelte`, input form
  at `src/routes/cardiology-responses/[id]/+page.svelte`, one shared scoring
  engine and UI component set.

Legacy split references (`front-end-form-with-svelte/` +
`front-end-dashboard-with-svelte/`) remain in older forms such as
`forms/pre-operative-assessment-by-clinician/` until consolidated.
`bin/lily-svelte-refactor` propagates the Lily class contract across forms.

## 10. Upstream pin and drift detection

The pinned upstream Lily Svelte commit hash lives in
[`lily-svelte-version.md`](lily-svelte-version.md). Component snapshots
live in `lily-svelte-spec/` — refresh via `bin/lily-svelte-sync`. Drift
detection: `bin/lily-svelte-sync --check`.

## 11. Out of scope here

- HTML subprojects (`front-end-*-with-html/`) — see
  [`AGENTS-front-end-html.md`](AGENTS-front-end-html.md).
- The Loco/Rust back-end JSON API subproject — see
  [`/AGENTS/back-end-with-loco.md`](../AGENTS/back-end-with-loco.md).
- The Lily library's own development.
