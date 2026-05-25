# ThemeSelectOption

A single `<option>` element designed to be used inside a `ThemeSelect`, carrying a theme `value` and a visible label via `children`.

## What it is

`ThemeSelectOption` is a headless Svelte 5 component that wraps a native `<option>` element. It is the child element in the `ThemeSelect` → `ThemeSelectOption` composition pattern and carries a `value` attribute plus optional `selected`/`disabled` flags.

## What it does

- Renders `<option class="theme-select-option {className}" value={value} {selected} {disabled}>`.
- Displays the `children` snippet as the visible option label.
- Spreads additional HTML attributes onto the `<option>`.

## When to use it

- Inside a `ThemeSelect` to define one available theme choice.
- For compile-time or markup-driven lists of theme options.
- When iterating over a theme array with `{#each}`.

## When not to use it

- Don't use it outside of a `<select>` — an `<option>` element is invalid elsewhere.
- Don't use it for radio-style theme choice — use `ThemePicker` instead.
- Don't use it for generic non-theme options — use the generic `Option` component.
- Don't add ARIA roles — the native `<option>` provides all semantics through its parent `<select>`.

## How to use it

Import and place inside `ThemeSelect`. Provide a unique `value` and label content via the default snippet.

## Props

- `class` — string, optional. Extra CSS class appended to `theme-select-option`.
- `value` — string, required. The theme identifier submitted when selected.
- `selected` — boolean, default `false`. Whether this option is pre-selected.
- `disabled` — boolean, default `false`. Whether this option is disabled.
- `children` — Snippet, required. The visible label for this option.
- `...restProps` — any additional HTML attributes spread onto the `<option>`.

## Usage

```svelte
<script lang="ts">
  import ThemeSelect from "../ThemeSelect/ThemeSelect.svelte";
  import ThemeSelectOption from "./ThemeSelectOption.svelte";

  let theme = $state("");
</script>

<ThemeSelect label="Theme" bind:value={theme}>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
</ThemeSelect>
```

```svelte
<script lang="ts">
  import ThemeSelect from "../ThemeSelect/ThemeSelect.svelte";
  import ThemeSelectOption from "./ThemeSelectOption.svelte";

  let theme = $state("");
</script>

<ThemeSelect label="Theme" bind:value={theme}>
  <ThemeSelectOption value="" disabled>Select a theme…</ThemeSelectOption>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark" selected>Dark</ThemeSelectOption>
</ThemeSelect>
```

```svelte
<script lang="ts">
  import ThemeSelect from "../ThemeSelect/ThemeSelect.svelte";
  import ThemeSelectOption from "./ThemeSelectOption.svelte";

  const themes = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "high-contrast", label: "High Contrast" },
    { value: "system", label: "System Default" },
  ];
  let theme = $state("system");
</script>

<ThemeSelect label="Color scheme" bind:value={theme}>
  {#each themes as t}
    <ThemeSelectOption value={t.value}>{t.label}</ThemeSelectOption>
  {/each}
</ThemeSelect>
```

```svelte
<script lang="ts">
  import ThemeSelect from "../ThemeSelect/ThemeSelect.svelte";
  import ThemeSelectOption from "./ThemeSelectOption.svelte";

  let theme = $state("light");
  let premium = $state(false);
</script>

<ThemeSelect label="Theme" bind:value={theme}>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
  <ThemeSelectOption value="midnight" disabled={!premium}>
    Midnight (premium)
  </ThemeSelectOption>
</ThemeSelect>
```

## Accessibility

- Native `<option>` inherits all accessibility from the enclosing `<select>` — keyboard navigation, selection state, and screen reader announcement are handled automatically.
- Do not add explicit ARIA roles or attributes.
- The visible label text provides the accessible name.

## Related components

- `ThemeSelect` — the parent `<select>` container.
- `Option` — generic option for use with the generic `Select`.
- `ThemePicker` — radio-group alternative.
- `ThemePickerButton` — swatch-button alternative.
