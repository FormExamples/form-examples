# ThemeView

A read-only inline display of the current theme name, rendered as a `<span>` with an accessible `aria-label`.

## What it is

`ThemeView` is a headless Svelte 5 component that shows the name of the currently active theme as plain text inside a `<span>`. It is the read-only counterpart in an Input/View pattern alongside `ThemeSelect` or `ThemeSelect`.

## What it does

- Renders `<span class="theme-view {className}" aria-label={label}>{value}</span>`.
- Spreads additional HTML attributes onto the `<span>`.
- Has no interactive behavior or internal state.

## When to use it

- Status bars, footers, or account summaries that show the active theme.
- Settings pages where users can see the current theme alongside controls that change it.
- Confirmation screens and receipts where theme preference is displayed.

## When not to use it

- Don't use it to change the theme — use `ThemeSelect` or `ThemeSelect`.
- Don't use it to show arbitrary read-only text — use a plain `<span>` or `Character`.
- Don't use it for theme swatches — use `ThemeSelectButton`.

## How to use it

Import and pass the `label` (for accessibility) and the `value` (the theme name to display).

## Props

- `class` — string, optional. Extra CSS class appended to `theme-view`.
- `label` — string, required. Accessible name via `aria-label`.
- `value` — string, required. Theme name text content.
- `...restProps` — any additional HTML attributes spread onto the `<span>`.

## Usage

```svelte
<script lang="ts">
  import ThemeView from "./ThemeView.svelte";
</script>

<ThemeView label="Current theme" value="dark" />
```

```svelte
<script lang="ts">
  import ThemeSelect from "../ThemeSelect/ThemeSelect.svelte";
  import ThemeSelectOption from "../ThemeSelectOption/ThemeSelectOption.svelte";
  import ThemeView from "./ThemeView.svelte";

  let theme = $state("light");
</script>

<ThemeSelect label="Theme" bind:value={theme}>
  <ThemeSelectOption value="light">Light</ThemeSelectOption>
  <ThemeSelectOption value="dark">Dark</ThemeSelectOption>
</ThemeSelect>

<p>Active: <ThemeView label="Active theme" value={theme} /></p>
```

```svelte
<script lang="ts">
  import ThemeView from "./ThemeView.svelte";

  let theme = $state("system");
</script>

<ThemeView
  label="Thème actif"
  value={theme === "system" ? "Système" : theme === "dark" ? "Sombre" : "Clair"}
/>
```

```svelte
<script lang="ts">
  import ThemeView from "./ThemeView.svelte";
</script>

<footer>
  Theme: <ThemeView label="Current theme" value="high-contrast" data-testid="theme" />
</footer>
```

## Accessibility

- `aria-label` supplies the accessible name that describes what the displayed value represents.
- Passive element — no focus, no keyboard interaction.
- The `value` string should itself be translated if the consumer shows localized theme names.

## Related components

- `ThemeSelect` — interactive radio-group for theme selection.
- `ThemeSelect` / `ThemeSelectOption` — dropdown alternative.
- `ThemeSelectButton` — swatch-button alternative.
- `Character` — single-character display element.

---

Lily™ and Lily Design System™ are trademarks.
