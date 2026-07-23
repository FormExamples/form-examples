# ToggleButton

A binary on/off toggle rendered as a `<button type="button" role="switch">` with `aria-checked` reflecting the bindable `pressed` state, supporting Space-to-toggle keyboard interaction.

## What it is

`ToggleButton` is a headless Svelte 5 component that implements the WAI-ARIA switch pattern. It renders a native `<button>` with `role="switch"` and uses `aria-checked` to communicate on/off state. The `pressed` state is bindable for two-way data flow.

## What it does

- Renders `<button class="toggle-button {className}" type="button" role="switch" aria-checked={pressed} aria-label={label}>`.
- Toggles `pressed` on `click` (unless disabled).
- Toggles `pressed` when `Space` is pressed (preventing default page scroll) unless disabled.
- Forwards `disabled`.
- Renders optional `children` content inside the button.
- Spreads additional HTML attributes onto the `<button>`.

## When to use it

- Dark mode / light mode toggles.
- Feature flags in settings panels.
- Mute/unmute, notifications on/off, autoplay on/off.
- Any binary state that benefits from switch semantics.

## When not to use it

- Don't use it for triggering actions — use a plain `Button` or `ToolBarButton`.
- Don't use it for mutually exclusive options — use `RadioGroup` / `SegmentGroup`.
- Don't use it for multi-select toggles — use `CheckboxGroup`.
- Don't use it for pressed-state buttons where a switch role is semantically wrong — use a plain `<button>` with `aria-pressed`.

## How to use it

Import, bind `pressed`, and pass a translated `label`. Optionally render visible content via `children`.

## Props

- `class` — string, optional. Extra CSS class appended to `toggle-button`.
- `label` — string, required. Accessible name via `aria-label`.
- `pressed` — boolean, default `false`, bindable via `bind:pressed`. Whether the toggle is on.
- `disabled` — boolean, default `false`. Whether the toggle is disabled.
- `children` — Snippet, optional. Button content.
- `...restProps` — any additional HTML attributes spread onto the `<button>`.

## Usage

```svelte
<script lang="ts">
  import ToggleButton from "./ToggleButton.svelte";

  let dark = $state(false);
</script>

<ToggleButton label="Dark mode" bind:pressed={dark} />
```

```svelte
<script lang="ts">
  import ToggleButton from "./ToggleButton.svelte";

  let muted = $state(false);
  let locked = $state(false);
</script>

<ToggleButton label="Mute audio" bind:pressed={muted} disabled={locked}>
  {muted ? "Muted" : "Audible"}
</ToggleButton>
```

```svelte
<script lang="ts">
  import ToggleGroup from "../ToggleGroup/ToggleGroup.svelte";
  import ToggleButton from "./ToggleButton.svelte";

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
  import ToggleButton from "./ToggleButton.svelte";

  let autosave = $state(true);
</script>

<ToggleButton label="Autosave" bind:pressed={autosave}>
  Autosave: {autosave ? "On" : "Off"}
</ToggleButton>
```

## Accessibility

- `role="switch"` identifies the element as a two-state control.
- `aria-checked` reflects the current state.
- `aria-label` provides the accessible name.
- `Space` and click both toggle state; the component prevents `Space`'s default page scroll.
- `disabled` removes the button from the tab sequence and is conveyed natively.

## Related components

- `ToggleGroup` — container grouping related toggle buttons.
- `SwitchButton` — traditional on/off switch styled toggle.
- `Button` — standard button for actions.
- `CheckboxInput` — checkbox equivalent for form-submission contexts.

---

Lily™ and Lily Design System™ are trademarks.
