# ScrollArea

A headless, keyboard-focusable landmark region for overflowing content. Consumers bring the CSS (`overflow`, `max-height`, etc.); the component brings the semantics.

## What it is

`ScrollArea` is a Svelte 5 headless component that renders a single `<div class="scroll-area ...">` with `role="region"`, `aria-label`, and `tabindex="0"`. The `children` snippet supplies whatever content should be scrollable.

## What it does

- Wraps arbitrary content in a named landmark region.
- Makes the container keyboard-focusable so users can operate native scroll keybindings (Arrow, Page, Home, End) without a mouse.
- Forwards any additional attributes to the root `<div>` via `...restProps`.

The component does not apply any `overflow` or sizing rule itself; the consumer's CSS must set the actual scroll behavior.

## When to use it

- Long lists, chat transcripts, log viewers, or code blocks that need to scroll inside a bounded box.
- Any scroll container that should also be a keyboard-reachable landmark (for example, a table of contents pane).
- Content that must remain operable for keyboard-only users who cannot grab a scrollbar with a pointer.

## When not to use it

- Page-level scrolling - the browser handles that natively on `<html>`/`<body>`.
- Content that fits on screen and never overflows - a plain element is simpler.
- Split panels with a draggable handle - use `Splitter` and `Resizable`.
- Custom scrollbars with visible drag thumbs - pair with `ScrollBar` for the thumb semantics.

## How to use it

1. Import the component from its source file.
2. Provide a translated `label` describing what is scrollable.
3. Add CSS that sets `overflow`, dimensions, and any custom focus indicator.
4. Put the scrollable content in the `children` snippet.

## Props

- `class` (string, optional, default `""`) - merged with the base `scroll-area` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - scrollable content.
- `...restProps` - spread onto the root `<div>`.

## Usage

Chat transcript pane:

```svelte
<script lang="ts">
    import ScrollArea from "./ScrollArea.svelte";
    let messages = $state(["Hello", "Hi", "How are you?"]);
</script>

<ScrollArea label="Chat messages">
    {#each messages as m}<p>{m}</p>{/each}
</ScrollArea>
```

Code block with inline style:

```svelte
<script lang="ts">
    import ScrollArea from "./ScrollArea.svelte";
</script>

<ScrollArea label="Source code" style="overflow:auto; max-height:300px;">
    <pre><code>{source}</code></pre>
</ScrollArea>
```

Log viewer with consumer CSS class:

```svelte
<script lang="ts">
    import ScrollArea from "./ScrollArea.svelte";
</script>

<ScrollArea label="Build log" class="log-viewer">
    {#each logLines as line}<div>{line}</div>{/each}
</ScrollArea>
```

Horizontally scrolling gallery:

```svelte
<script lang="ts">
    import ScrollArea from "./ScrollArea.svelte";
</script>

<ScrollArea label="Image gallery" style="overflow-x:auto; white-space:nowrap;">
    {#each images as img}<img src={img.src} alt={img.alt} />{/each}
</ScrollArea>
```

## Accessibility

- `role="region"` with `aria-label` creates a named landmark.
- `tabindex="0"` enables keyboard scrolling on the container (browser native).
- Consumers must provide a visible focus indicator so keyboard users can see focus.
- No custom key handler - scrolling relies on the browser's built-in key mapping.

References:
- WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
- WCAG 2.1 Reflow: https://www.w3.org/WAI/WCAG21/Understanding/reflow.html

## Related components

- `ScrollBar` - custom scrollbar handle with ARIA scrollbar role.
- `Resizable` - focusable region with resize semantics.
- `Splitter` - separator between two panels.
- `Sidebar` - complementary landmark without scroll guarantees.

---

Lily™ and Lily Design System™ are trademarks.
