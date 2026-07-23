# ToggleGroup

A container grouping related toggle buttons, rendered as a `<div role="group">` with an accessible `aria-label`, typically holding `ToggleButton` children.

## What it is

`ToggleGroup` is a headless Svelte 5 container for a collection of independently toggleable buttons. It renders a `<div>` with `role="group"` and `aria-label` to semantically associate the child toggles. It does not manage mutual exclusivity — each child button owns its own state.

## What it does

- Renders `<div class="toggle-group {className}" role="group" aria-label={label}>`.
- Renders the `children` snippet inside.
- Spreads additional HTML attributes onto the `<div>`.

## When to use it

- Text-formatting toolbars with independently toggleable styles (bold, italic, underline).
- View-mode selectors where multiple independent options can be on or off.
- Feature-flag clusters in admin panels.
- Any UI where a group of toggle buttons should be announced as a single semantic unit.

## When not to use it

- Don't use it for mutually exclusive choices — use `RadioGroup` or `SegmentGroup`.
- Don't use it for primary-action buttons — use plain buttons or a `TaskBar`.
- Don't use it for radio-like theme selection — use `ThemeSelect`.
- Don't use it for keyboard roving-focus toolbars — use `ToolBar`, which handles arrow-key navigation.

## How to use it

Import and wrap `ToggleButton` children (or any buttons using `aria-pressed`/`aria-checked`). Pass a translated `label`.

## Props

- `class` — string, optional. Extra CSS class appended to `toggle-group`.
- `label` — string, required. Accessible name via `aria-label`.
- `children` — Snippet, required. Toggle button elements.
- `...restProps` — any additional HTML attributes spread onto the `<div>`.

## Usage

```svelte
<script lang="ts">
  import ToggleGroup from "./ToggleGroup.svelte";
  import ToggleButton from "../ToggleButton/ToggleButton.svelte";

  let bold = $state(false);
  let italic = $state(false);
  let underline = $state(false);
</script>

<ToggleGroup label="Text formatting">
  <ToggleButton label="Bold" bind:pressed={bold}>B</ToggleButton>
  <ToggleButton label="Italic" bind:pressed={italic}>I</ToggleButton>
  <ToggleButton label="Underline" bind:pressed={underline}>U</ToggleButton>
</ToggleGroup>
```

```svelte
<script lang="ts">
  import ToggleGroup from "./ToggleGroup.svelte";
</script>

<ToggleGroup label="View options">
  <button type="button" aria-pressed="true">Grid</button>
  <button type="button" aria-pressed="false">List</button>
</ToggleGroup>
```

```svelte
<script lang="ts">
  import ToggleGroup from "./ToggleGroup.svelte";
  import ToggleButton from "../ToggleButton/ToggleButton.svelte";

  const flags = $state({ beta: false, debug: false, analytics: true });
</script>

<ToggleGroup label="Feature flags">
  {#each Object.keys(flags) as key}
    <ToggleButton label={key} bind:pressed={flags[key]}>{key}</ToggleButton>
  {/each}
</ToggleGroup>
```

```svelte
<script lang="ts">
  import ToggleGroup from "./ToggleGroup.svelte";
  import ToggleButton from "../ToggleButton/ToggleButton.svelte";

  let notifications = $state(true);
  let sounds = $state(false);
</script>

<ToggleGroup label="Préférences">
  <ToggleButton label="Notifications" bind:pressed={notifications}>
    Notifications
  </ToggleButton>
  <ToggleButton label="Sons" bind:pressed={sounds}>Sons</ToggleButton>
</ToggleGroup>
```

## Accessibility

- `role="group"` identifies the container as a semantic grouping.
- `aria-label` supplies the accessible name for the group.
- Focus moves with standard Tab order; no built-in arrow-key navigation.
- For keyboard roving focus, use `ToolBar` instead.

## Related components

- `ToggleButton` — the preferred child component.
- `RadioGroup` — mutually exclusive radio selection.
- `SegmentGroup` / `SegmentGroupItem` — segmented single-select.
- `ToolBar` / `ToolBarButton` — toolbar with arrow-key roving focus.

---

Lily™ and Lily Design System™ are trademarks.
