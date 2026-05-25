# IconButton

A button containing only an icon, with a required accessible label. This headless Svelte component wraps the native HTML `<button>` element and enforces an `aria-label` so screen-reader users know what the icon means.

## What it is

A headless Svelte 5 component that renders a single native `<button>` element. Belongs alongside `Button`, `ToggleButton`, and `SwitchButton` as a core interaction primitive. Category: form controls / interactive primitives.

## What it does

- Renders a `<button>` with the base class `icon-button` plus consumer `class`.
- Defaults `type` to `"button"` to prevent accidental form submission.
- **Requires** the `label` prop and applies it as `aria-label`.
- Renders `aria-pressed` only when `pressed` is provided (toggle pattern).
- Supports disabled state via the native `disabled` attribute.
- Forwards `onclick` and spreads `...restProps`.
- Children render the icon (svg, glyph, or emoji) inside the button.

## When to use it

- Compact toolbars where text labels would not fit (close, settings, search, etc.).
- Iconography that is universally understood.
- Toggle states such as bookmark, mute, dark mode.

## When not to use it

- For text-labeled buttons, use `Button`.
- For navigation that changes the URL, use `ActionLink` or an `<a>` element.
- For an on/off setting styled as a switch, use `SwitchButton`.
- For mobile menu trigger, use `HamburgerMenu`.

## Props

- `class` — string, default `""`. CSS class appended to `icon-button`.
- `label` — string, **required**. Accessible name via `aria-label`.
- `type` — `"button" | "submit" | "reset"`, default `"button"`.
- `disabled` — boolean, default `false`.
- `pressed` — boolean | undefined, default `undefined`. Toggle state.
- `onclick` — `(event: MouseEvent) => void`, optional. Click handler.
- `children` — `Snippet`, required. Icon content.
- `...restProps` — additional HTML attributes spread onto the `<button>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import IconButton from './IconButton.svelte';

  function close() { /* … */ }
</script>

<IconButton label="Close dialog" onclick={close}>
  <span aria-hidden="true">×</span>
</IconButton>
```

### Toggle button

```svelte
<script lang="ts">
  import IconButton from './IconButton.svelte';

  let pinned = $state(false);
</script>

<IconButton label="Pin item" pressed={pinned} onclick={() => (pinned = !pinned)}>
  <span aria-hidden="true">📌</span>
</IconButton>
```

## Accessibility

- `aria-label` is required and is the entire accessible name; the visual icon is decorative.
- Mark inner icon content with `aria-hidden="true"` so screen readers do not announce it.
- `aria-pressed` is rendered only when the `pressed` prop is provided.
- Native disabled prevents activation; ensure focus behavior matches your design system.
- Keyboard: **Tab** focuses, **Enter** and **Space** activate.

## Related components

- `Button` — generic clickable button with text content.
- `ToggleButton` — dedicated two-state toggle.
- `SwitchButton` — on/off setting styled as a switch.
- `HamburgerMenu` — mobile-menu trigger button.

## References

- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- HTML `<button>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
