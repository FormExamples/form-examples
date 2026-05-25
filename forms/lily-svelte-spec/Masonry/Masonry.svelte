<script lang="ts">
    // Masonry component
    //
    // A headless masonry layout container for variable-height items using the CSS
    // multi-column approach. Renders a `<div>` with inline `column-count` and
    // `column-gap`. Children should set `break-inside: avoid` via consumer CSS so
    // items are not split across columns.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   columns — number, default 3. Number of columns.
    //   gap — string, default "1rem". Column gap CSS value.
    //   children — Snippet, required. Masonry items.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Masonry columns={4} gap="0.5rem">…</Masonry>
    //
    // Examples:
    //   <Masonry columns={3} gap="1rem">
    //     <article>…</article>
    //     <article>…</article>
    //   </Masonry>
    //
    // Keyboard:
    //   - None (purely structural)
    //
    // Accessibility:
    //   - No ARIA role (presentational layout container)
    //   - Reading order matches DOM order (left-to-right, top-to-bottom in each column)
    //
    // Internationalization:
    //   - All text comes through children; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: only inline styles are CSS columns behavior
    //   - Consumers must apply `break-inside: avoid` to children
    //
    // References:
    //   - MDN CSS Multi-column: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_multicol_layout

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        columns = 3,
        gap = "1rem",
        children,
        ...restProps
    }: {
        /** Number of columns */
        columns?: number;
        /** Column gap CSS value */
        gap?: string;
        /** Masonry items */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Masonry.svelte -->
<div
    class={`masonry ${className}`}
    data-columns={columns}
    style={`column-count: ${columns}; column-gap: ${gap};`}
    {...restProps}
>
    {@render children?.()}
</div>
