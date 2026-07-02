# ThemeSelect

A dropdown `<select>` for choosing a visual theme, with `aria-label`, bindable `value`, and `ThemeSelectOption` children defining the available themes.

## What it is

`ThemeSelect` is a headless Svelte 5 component that renders a native `<select>` element for theme selection. It is the parent in the `ThemeSelect` → `ThemeSelectOption` composition pattern. The consumer binds `value` to track the selected theme and applies it to the page.

## What it does

- Renders `<select class="theme-select {className}" aria-label={label}>`.
- Binds `value` two-way via `bind:value`.
- Delegates option rendering to `children`, expected to be `ThemeSelectOption` elements.
- Spreads additional HTML attributes onto the `<select>`.

## When to use it

- Settings pages where a compact dropdown is preferred over visible radios.
- Forms that save user theme preference.
- Places where the number of themes is long or benefits from space efficiency.

## When not to use it

- Don't use it when you want always-visible radio options — use `ThemeSelect`.
- Don't use it for read-only display — use `ThemeView`.
- Don't use it for non-theme selects — use the generic `Select` component.
- Don't use it for multiple simultaneous selections — `<select>` by default is single-select.

## How to use it

Import both `ThemeSelect` and `ThemeSelectOption`. Pass a `label`, bind `value`, and provide one `ThemeSelectOption` per theme.

## Props

- `class` — string, optional. Extra CSS class appended to `theme-select`.
- `label` — string, required. Accessible name via `aria-label`.
- `value` — string, default `""`, bindable via `bind:value`. The selected theme identifier.
- `children` — Snippet, required. `ThemeSelectOption` elements.
- `...restProps` — any additional HTML attributes spread onto the `<select>`.

## Usage

```svelte
<script lang="ts">
  import ThemeSelect from "./ThemeSelect.svelte";
  import ThemeSelectOption from "../ThemeSelectOption/ThemeSelectOption.svelte";

  let theme = $state("light");
</script>

<ThemeSelect label="Theme" bind:value={theme}>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
  <ThemeSelectOption value="system">System Default</ThemeSelectOption>
</ThemeSelect>
```

```svelte
<script lang="ts">
  import ThemeSelect from "./ThemeSelect.svelte";
  import ThemeSelectOption from "../ThemeSelectOption/ThemeSelectOption.svelte";
  import ThemeView from "../ThemeView/ThemeView.svelte";

  let theme = $state("dark");
</script>

<ThemeSelect label="Color scheme" bind:value={theme}>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
  <ThemeSelectOption value="high-contrast">High Contrast</ThemeSelectOption>
</ThemeSelect>

<p>Active: <ThemeView label="Active theme" value={theme} /></p>
```

```svelte
<script lang="ts">
  import ThemeSelect from "./ThemeSelect.svelte";
  import ThemeSelectOption from "../ThemeSelectOption/ThemeSelectOption.svelte";

  const themes = [
    { value: "light", name: "Clair" },
    { value: "dark", name: "Sombre" },
    { value: "system", name: "Système" },
  ];
  let theme = $state("system");
</script>

<ThemeSelect label="Thème" bind:value={theme}>
  {#each themes as t}
    <ThemeSelectOption value={t.value}>{t.name}</ThemeSelectOption>
  {/each}
</ThemeSelect>
```

```svelte
<script lang="ts">
  import ThemeSelect from "./ThemeSelect.svelte";
  import ThemeSelectOption from "../ThemeSelectOption/ThemeSelectOption.svelte";

  let theme = $state("dark");

  $effect(() => {
    document.documentElement.dataset.theme = theme;
  });
</script>

<ThemeSelect label="Theme" bind:value={theme}>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
</ThemeSelect>
```

## Accessibility

- Native `<select>` provides `combobox`-like keyboard interaction: Space/Enter open, Arrow keys navigate, Escape closes, type-ahead search works.
- `aria-label` supplies the accessible name.
- The browser's OS-native dropdown is used, maximizing platform and screen reader compatibility.

## Related components

- `ThemeSelectOption` — option child used inside `ThemeSelect`.
- `ThemeSelect` — radio-group alternative.
- `ThemeView` — read-only display of the current theme.
- `Select` — generic select for non-theme use cases.
