# SplitView

A two-panel resizable layout container with a draggable divider between them.

## What it is

A headless Svelte 5 component that renders a wrapper `<div class="split-view">` with two `<section>` panels (`split-view-primary` and `split-view-secondary`) and either a custom divider snippet or a default `<div role="separator">`.

## What it does

- Sets `aria-label`, `data-orientation`, and `data-split-percent` on the wrapper for consumer styling.
- Renders `primary` and `secondary` snippets into semantic `<section>` panels.
- Renders the optional `divider` snippet between the panels; when no divider snippet is provided, renders a default `<div role="separator" aria-orientation aria-valuenow aria-valuemin aria-valuemax tabindex="0">`.

## When to use it

- Any two-pane resizable layout (editor + preview, list + detail, file tree + content).

## When not to use it

- For three or more panels, compose multiple `SplitView` components or use a grid layout.
- For a fixed two-column layout that does not resize, use `Grid` or `GrailLayout`.

## Props

- `class` — string, default `""`.
- `label` — string, **required**. `aria-label` for the container.
- `orientation` — `"horizontal" | "vertical"`, default `"horizontal"`.
- `primary` — `Snippet`, **required**. First panel content.
- `secondary` — `Snippet`, **required**. Second panel content.
- `divider` — `Snippet`, optional. Custom divider content.
- `splitPercent` — number `0–100`, default `50`.

## Usage

```svelte
<script lang="ts">
  import SplitView from './SplitView.svelte';
</script>

<SplitView label="Editor and preview" splitPercent={40}>
  {#snippet primary()}
    <textarea>Editor</textarea>
  {/snippet}
  {#snippet secondary()}
    <article>Preview</article>
  {/snippet}
</SplitView>
```

## Accessibility

- The default divider implements the WAI-ARIA Window Splitter pattern: `role="separator"`, `aria-orientation`, `aria-valuenow/min/max`, and `tabindex="0"` for keyboard resize.
- `aria-orientation` matches the divider direction.

## Related components

- `Splitter` — standalone splitter primitive.
- `GrailLayout` — full responsive page layout.

## References

- Adobe Spectrum SplitView: https://spectrum.adobe.com/page/split-view/
- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
