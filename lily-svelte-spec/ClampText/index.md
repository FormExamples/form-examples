# ClampText

A clamp-text container truncates content to a maximum number of visible lines while keeping the full text in the DOM for assistive technology. This headless Svelte component renders a `<div>` with a `data-lines` attribute and a `--clamp-text-lines` CSS custom property so consumer CSS can apply `-webkit-line-clamp` or modern `line-clamp` rules.

## What it is

A headless Svelte 5 component that renders a single `<div>` element. It belongs to the design system's typography and layout primitives. Category: text presentation / overflow control.

## What it does

- Renders a `<div>` with the base class `clamp-text` plus any consumer-supplied `class`.
- Sets `data-lines={lines}` so consumer CSS can target specific clamp counts.
- Sets the inline CSS custom property `--clamp-text-lines: {lines}` for use with `line-clamp`.
- Keeps the full text content in the DOM (no `aria-hidden` truncation).
- Forwards `aria-label` when provided.
- Spreads `...restProps` onto the underlying `<div>`.

## When to use it

- Showing a multi-line excerpt of an article, comment, or description.
- Constraining card body text to a fixed number of lines for grid layouts.
- Preventing user-generated content from breaking surrounding layout.

## When not to use it

- For single-line truncation use a CSS `text-overflow: ellipsis` with `white-space: nowrap` on a normal element.
- For interactive show-more / show-less behavior use `Collapsible` or `Expander`.
- For decorative cropping of images use `AspectRatioContainer`.

## How to use it

Import `ClampText` and pass the `lines` prop. Provide consumer CSS that reads `--clamp-text-lines` and applies `line-clamp` and `overflow: hidden` to the element. Required prop: `children`.

## Props

- `class` — string, default `""`. CSS class appended to `clamp-text`.
- `lines` — number, default `2`. Maximum visible lines.
- `label` — string, optional. Accessible label via `aria-label`.
- `children` — `Snippet`, required. Text content.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import ClampText from './ClampText.svelte';
</script>

<ClampText lines={3}>
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
  incididunt ut labore et dolore magna aliqua.
</ClampText>
```

### Consumer CSS

```css
.clamp-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--clamp-text-lines);
  line-clamp: var(--clamp-text-lines);
  overflow: hidden;
}
```

## Accessibility

- Full text remains in the DOM and is read by screen readers; only the visual presentation is clipped.
- `aria-label` may be supplied to give a brief description (e.g., "Article excerpt").
- No keyboard interaction; the component is non-interactive.

## Related components

- `Collapsible` — show/hide content via a disclosure widget.
- `Expander` — interactive control to reveal more content.
- `BodyText` — body text block within a content width container.

## References

- MDN `line-clamp`: https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp
- WCAG 2.2 — Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color
