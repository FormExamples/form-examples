# Blockquote

A block-level quotation with optional source citation. This headless Svelte component wraps the native HTML `<blockquote>` element and optionally renders a `<footer>` with attribution text.

## What it is

A headless Svelte 5 component that renders a single native `<blockquote>` element with optional citation footer. Category: typography / content.

## What it does

- Renders a `<blockquote>` with the base class `blockquote` plus consumer `class`.
- Forwards an optional `cite` attribute (URL of the source).
- Renders a `<footer class="blockquote-citation">` when `citationText` is provided.
- Supports `aria-label` override via `label` prop.
- Spreads `...restProps` onto the root element.

## When to use it

- Long quotations from another source that should be visually offset from surrounding content.
- Pull quotes in editorial content with attribution.

## When not to use it

- For inline short quotations, use a `<q>` element directly.
- For citations of works (titles), use the `Citation` component.

## Props

- `class` — string, default `""`. CSS class appended to `blockquote`.
- `cite` — string, optional. URL of the source.
- `citationText` — string, optional. Visible attribution text.
- `label` — string, optional. `aria-label` override.
- `children` — `Snippet`, optional. The quote content.
- `...restProps` — additional HTML attributes spread onto the `<blockquote>`.

## Usage

```svelte
<script lang="ts">
  import Blockquote from './Blockquote.svelte';
</script>

<Blockquote cite="https://example.com" citationText="— Jane Doe, A Book">
  <p>The best way to predict the future is to invent it.</p>
</Blockquote>
```

## Accessibility

- Native `<blockquote>` semantics.
- Optional `aria-label` override via `label`.

## Related components

- `Citation` — inline acknowledgement of a referenced work.
- `BodyText` — generic prose container.

## References

- HTML `<blockquote>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote
- Mozilla Protocol Design System: https://protocol.mozilla.org
