# ThemeSelect

A radio-group container for selecting between visual themes (e.g. light, dark, system), rendered as a `<fieldset role="radiogroup">` with an accessible `aria-label`.

## What it is

`ThemeSelect` is a headless Svelte 5 container that semantically groups a set of radio-button theme options. It renders a `<fieldset>` with `role="radiogroup"` and `aria-label`, and expects consumer-supplied `<input type="radio">` elements (or a higher-level wrapper) as children.

## What it does

- Renders `<fieldset class="theme-select {className}" role="radiogroup" aria-label={label}>`.
- Delegates all option rendering to the `children` snippet — consumers supply the radio buttons.
- Spreads additional HTML attributes onto the `<fieldset>`.

## When to use it

- Settings screens and preference panels where users pick a visual theme.
- Any interface that needs an exclusive choice between theme variants (light/dark/system/high-contrast).
- When you want fieldset grouping semantics together with a radiogroup role.

## When not to use it

- Don't use it when a dropdown is a better fit — use `ThemeSelect` + `ThemeSelectOption`.
- Don't use it for read-only display of the current theme — use `ThemeView`.
- Don't use it for theme swatches as buttons — use `ThemeSelectButton` components inside a different container.
- Don't use it for mutually non-exclusive choices — use `CheckboxGroup` or `ToggleGroup`.

## How to use it

Import the component and provide radio inputs as children. Share a common `name` attribute across radios so they form a proper radio group.

## Props

- `class` — string, optional. Extra CSS class appended to `theme-select`.
- `label` — string, required. Accessible name for the radio group via `aria-label`.
- `children` — Snippet, required. Radio button option elements.
- `...restProps` — any additional HTML attributes spread onto the `<fieldset>`.

## Usage

```svelte
<script lang="ts">
  import ThemeSelect from "./ThemeSelect.svelte";

  let theme = $state("light");
</script>

<ThemeSelect label="Theme">
  <label><input type="radio" name="theme" value="light" bind:group={theme} /> Light</label>
  <label><input type="radio" name="theme" value="dark" bind:group={theme} /> Dark</label>
  <label><input type="radio" name="theme" value="system" bind:group={theme} /> System</label>
</ThemeSelect>
```

```svelte
<script lang="ts">
  import ThemeSelect from "./ThemeSelect.svelte";
  import ThemeView from "../ThemeView/ThemeView.svelte";

  let theme = $state("dark");
</script>

<ThemeSelect label="Color scheme">
  {#each ["light", "dark", "high-contrast"] as t}
    <label>
      <input type="radio" name="scheme" value={t} bind:group={theme} /> {t}
    </label>
  {/each}
</ThemeSelect>

<ThemeView label="Current theme" value={theme} />
```

```svelte
<script lang="ts">
  import ThemeSelect from "./ThemeSelect.svelte";

  let theme = $state("system");
</script>

<ThemeSelect label="Thème">
  <label><input type="radio" name="theme-fr" value="light" bind:group={theme} /> Clair</label>
  <label><input type="radio" name="theme-fr" value="dark" bind:group={theme} /> Sombre</label>
  <label><input type="radio" name="theme-fr" value="system" bind:group={theme} /> Système</label>
</ThemeSelect>
```

```svelte
<script lang="ts">
  import ThemeSelect from "./ThemeSelect.svelte";

  let theme = $state("light");
  let locked = $state(false);
</script>

<ThemeSelect label="Theme" data-locked={locked}>
  <label>
    <input type="radio" name="theme" value="light" bind:group={theme} disabled={locked} /> Light
  </label>
  <label>
    <input type="radio" name="theme" value="dark" bind:group={theme} disabled={locked} /> Dark
  </label>
</ThemeSelect>
```

## Accessibility

- `role="radiogroup"` on the `<fieldset>` identifies the set of radios as a single group.
- `aria-label` supplies the accessible name of the group.
- Native radio inputs give Arrow-key navigation and Space to select.
- Consumers should ensure all radios in the group share the same `name` attribute.

## Related components

- `ThemeSelect` / `ThemeSelectOption` — dropdown alternative.
- `ThemeView` — read-only display of the current theme.
- `ThemeSelectButton` — a button-style swatch for use inside custom picker layouts.
- `RadioGroup` / `RadioInput` — lower-level radio group primitives.
