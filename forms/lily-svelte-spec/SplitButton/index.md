# SplitButton

A button with a primary action and a dropdown for related actions. This headless Svelte component renders a `<div role="group">` containing two native `<button>` elements (primary action and menu trigger) and a menu container that is hidden via the `hidden` attribute when `menuOpen` is false.

## What it is

A headless Svelte 5 component that renders a `<div role="group">` plus two `<button>` children and a `<div>` menu container. Category: composite controls / menu buttons.

## What it does

- Renders a `<div role="group">` with the base class `split-button` plus consumer `class`.
- Sets `aria-label` from `label` (required).
- Renders a primary `<button class="split-button-primary">` with `primaryLabel` text and an `onprimaryclick` handler.
- Renders a menu trigger `<button class="split-button-menu-trigger">` with `menuLabel` (`aria-label`), `aria-haspopup="menu"`, and `aria-expanded={menuOpen}`. Trigger has no inner content — consumer styles the chevron via CSS background or ::before/::after.
- Renders a `<div class="split-button-menu">` containing the `children` snippet, hidden via the `hidden` attribute when `menuOpen` is false.
- Applies `disabled` to both buttons.
- Spreads `...restProps`.

## When to use it

- A primary action that has variations (Save / Save and close / Save as draft).
- An export with a default format and additional formats (Export PDF / CSV / JSON).
- A "Send" action with scheduled-send variants.

## When not to use it

- For a single action, use `Button`.
- For a menu without a primary action, use `Menu` and a `Button` trigger or `DropdownMenu`.
- For navigation, use `ActionLink`.

## Props

- `class` — string, default `""`. CSS class appended to `split-button`.
- `label` — string, **required**. Accessible label for the group.
- `primaryLabel` — string, **required**. Primary button label.
- `menuLabel` — string, **required**. Accessible label for the menu trigger.
- `menuOpen` — boolean, default `false`. Whether the menu is open.
- `disabled` — boolean, default `false`. Disables both buttons.
- `onprimaryclick` — `(event: MouseEvent) => void`, optional. Primary handler.
- `onmenutoggle` — `(event: MouseEvent) => void`, optional. Menu toggle handler.
- `children` — `Snippet`, required. Menu content.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import SplitButton from './SplitButton.svelte';

  let menuOpen = $state(false);

  function save() { /* … */ }
  function toggleMenu() { menuOpen = !menuOpen; }
</script>

<SplitButton
  label="Save options"
  primaryLabel="Save"
  menuLabel="More save options"
  menuOpen={menuOpen}
  onprimaryclick={save}
  onmenutoggle={toggleMenu}
>
  <ul role="menu">
    <li role="menuitem">Save as draft</li>
    <li role="menuitem">Save and close</li>
  </ul>
</SplitButton>
```

## Accessibility

- `role="group"` ties the two buttons together; `aria-label` provides the group's accessible name.
- The menu trigger uses `aria-haspopup="menu"` and `aria-expanded` per the WAI-ARIA Menu Button pattern.
- The menu container is removed from interaction via the native `hidden` attribute when closed.
- Consumers must close the menu on Escape key and outside-click; this headless component does not implement those behaviors.
- Keyboard: **Tab** focuses each button; **Enter** and **Space** activate.

## Related components

- `Button` — single-action button.
- `Menu` / `MenuItem` — menu list and items.
- `DropdownMenu` — menu opened from a single trigger.
- `ContextMenu` — menu opened on right-click.

## References

- WAI-ARIA Menu Button: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
- WAI-ARIA `aria-haspopup`: https://www.w3.org/TR/wai-aria-1.2/#aria-haspopup
