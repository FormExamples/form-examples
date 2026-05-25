# ActionBarButton

One action button inside an action bar.

## What it is

A headless Svelte 5 component that renders a native `<button class="action-bar-button">` with a required accessible label. Designed for use as a child of `ActionBar`.

## What it does

- Renders a `<button>` with the base class `action-bar-button` plus consumer `class`.
- Defaults `type` to `"button"` so it does not accidentally submit forms.
- **Requires** `label` and applies it as `aria-label`.
- Supports disabled state and `onclick`.
- Children render the button content (icon and/or text).

## When to use it

- Inside an `ActionBar` for bulk actions on selected items (delete, archive, etc.).

## When not to use it

- For a generic button outside a contextual selection bar, use `Button`.
- For a tool button in a permanent toolbar, use `ToolBarButton`.

## Props

- `class` — string, default `""`. CSS class appended to `action-bar-button`.
- `label` — string, **required**. `aria-label` for the button.
- `type` — `"button" | "submit" | "reset"`, default `"button"`.
- `disabled` — boolean, default `false`.
- `onclick` — `(event: MouseEvent) => void`, optional.
- `children` — `Snippet`, optional. Button content.

## Usage

```svelte
<script lang="ts">
  import ActionBarButton from './ActionBarButton.svelte';
</script>

<ActionBarButton label="Delete" onclick={handleDelete}>
  Delete
</ActionBarButton>
```

## Accessibility

- `aria-label` is required so icon-only variants remain announced by screen readers.
- Keyboard: **Tab** focuses, **Enter** and **Space** activate.

## Related components

- `ActionBar` — the toolbar that contains these buttons.
- `Button` — generic clickable button.
- `IconButton` — icon-only button.
- `ToolBarButton` — button inside a permanent toolbar.

## References

- Adobe Spectrum ActionBar: https://spectrum.adobe.com/page/action-bar/
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
