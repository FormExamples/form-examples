# Affix

A wrapper that pins its content to a viewport position while the page scrolls. This headless Svelte component uses CSS `position: sticky` so consumers do not need extra JavaScript.

## What it is

A headless Svelte 5 component that renders a single `<div class="affix">` whose content sticks to either the top or bottom edge of its scrolling container. Inspired by [Ant Design Affix](https://ant.design/components/affix). Category: layout primitives.

## What it does

- Renders a `<div>` with the base class `affix` plus consumer `class`.
- Applies inline `position: sticky;` and either `top: {offsetTop}px` or `bottom: {offsetBottom}px`.
- Defaults to `top: 0` when neither offset is provided.
- Sets `data-offset-top` / `data-offset-bottom` attributes for consumer CSS hooks.
- Forwards children and spreads `...restProps`.

## When to use it

- Sticky toolbars, navigation headers, or sidebars.
- Action panels that should remain visible while scrolling long content.

## When not to use it

- For modal overlays, use `Dialog` or `Sheet`.
- For full-viewport floating actions, use `FloatButton`.

## Props

- `class` — string, default `""`. CSS class appended to `affix`.
- `offsetTop` — number (px), optional. Distance from the top edge when affixed.
- `offsetBottom` — number (px), optional. Distance from the bottom edge when affixed.
- `children` — `Snippet`, required. The content to pin.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Pin to top

```svelte
<script lang="ts">
  import Affix from './Affix.svelte';
</script>

<Affix offsetTop={64}>
  <nav aria-label="Section">…</nav>
</Affix>
```

### Pin to bottom

```svelte
<Affix offsetBottom={16}>
  <div role="toolbar" aria-label="Quick actions">…</div>
</Affix>
```

## Accessibility

- The Affix wrapper is purely structural; it adds no ARIA roles.
- Use semantic landmarks (`<nav>`, `<aside>`, `<header>`, `<footer>`) inside the Affix as appropriate.

## Related components

- `Sidebar` — non-sticky side panel.
- `FloatButton` — viewport-fixed floating action.
- `Header`, `Footer` — semantic landmarks often used inside Affix.

## References

- Ant Design Affix: https://ant.design/components/affix
- MDN `position: sticky`: https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky_positioning
