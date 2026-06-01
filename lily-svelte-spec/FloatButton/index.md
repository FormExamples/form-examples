# FloatButton

A floating action button anchored to a viewport corner. This headless Svelte component renders a native `<button>` positioned with `position: fixed` and corner offsets.

## What it is

A headless Svelte 5 component inspired by [Ant Design FloatButton](https://ant.design/components/float-button). Category: form controls / interactive primitives.

## What it does

- Renders a `<button class="float-button" type={type}>` with consumer `class` appended.
- Requires a `label` prop applied as `aria-label` (icon-only button).
- Applies inline `position: fixed` plus corner offsets (1rem) for the chosen `position`.
- Sets `data-position` for consumer CSS hooks.
- Forwards `onclick` and spreads `...restProps`.

## When to use it

- Persistent quick actions like help, feedback, or scroll-to-top.
- Single primary action that should always be reachable on long pages.

## When not to use it

- For inline page actions, use `Button` or `IconButton`.
- For navigation, use a link component or `BackLink`.

## Props

- `class` — string, default `""`. CSS class appended to `float-button`.
- `label` — string, **required**. Accessible name via `aria-label`.
- `position` — `"top-left" | "top-right" | "bottom-left" | "bottom-right"`, default `"bottom-right"`.
- `disabled` — boolean, default `false`.
- `type` — `"button" | "submit" | "reset"`, default `"button"`.
- `onclick` — `(event: MouseEvent) => void`, optional.
- `children` — `Snippet`, required. Icon content.
- `...restProps` — additional HTML attributes spread onto the `<button>`.

## Usage

```svelte
<script lang="ts">
  import FloatButton from './FloatButton.svelte';
</script>

<FloatButton label="Open help" onclick={openHelp}>
  <span aria-hidden="true">?</span>
</FloatButton>
```

## Accessibility

- `aria-label` is required and provides the entire accessible name.
- Mark inner icon content with `aria-hidden="true"` so screen readers do not announce it.
- Native `<button>` provides focus, Tab order, and Enter/Space activation.

## Related components

- `IconButton` — generic icon-only button without fixed positioning.
- `Affix` — sticky positioning within the scroll context.
- `Button` — generic clickable button with text.

## References

- Ant Design FloatButton: https://ant.design/components/float-button
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
