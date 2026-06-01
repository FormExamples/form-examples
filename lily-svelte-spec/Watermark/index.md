# Watermark

A decorative repeating overlay text or image marking a page. This headless Svelte component exposes the configuration as `data-*` attributes; the consumer provides the repeating-pattern CSS.

## What it is

A headless Svelte 5 component inspired by [Ant Design Watermark](https://ant.design/components/watermark). Category: feedback / decorative.

## What it does

- Renders a `<div class="watermark">` with consumer `class` appended and `data-rotate` / `data-gap` set from props.
- Renders a child `<div class="watermark-overlay" aria-hidden="true">` exposing `data-text` and `data-image-url`.
- Renders the children content beneath the overlay.

## When to use it

- Marking confidential, draft, or proprietary documents.
- Displaying a brand mark across content areas.

## When not to use it

- For copyright notices, use `Footer` and `Citation`.
- For status messages, use `Banner` or `Alert`.

## Props

- `class` — string, default `""`. CSS class appended to `watermark`.
- `text` — string, optional. Watermark text.
- `imageUrl` — string, optional. Watermark image URL (alternative to text).
- `gap` — string, default `"100px"`. Spacing between repeats (CSS length).
- `rotate` — number (deg), default `-22`. Rotation angle.
- `children` — `Snippet`, optional. Content beneath the watermark.
- `...restProps` — additional HTML attributes spread onto the root `<div>`.

## Usage

```svelte
<script lang="ts">
  import Watermark from './Watermark.svelte';
</script>

<Watermark text="Confidential">
  <article>…</article>
</Watermark>
```

The consumer is responsible for the actual repeating-pattern CSS, e.g. via a `background-image` on `.watermark` that reads the `data-text`, `data-rotate`, and `data-gap` attributes.

## Accessibility

- The overlay carries `aria-hidden="true"` so the watermark is decorative for assistive technology.
- The watermark text should not encode meaning that is unavailable elsewhere in the document.

## Related components

- `Banner`, `Alert` — visible status messages.
- `Footer`, `Citation` — attribution and licensing.

## References

- Ant Design Watermark: https://ant.design/components/watermark
