<script lang="ts">
    // Grid component
    //
    // A headless CSS grid layout container with configurable columns and gap.
    // Renders a `<div>` with inline `display: grid` and a `grid-template-columns`
    // built from a number (equal columns) or a custom CSS string.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   columns — number | string, default 12. Number of equal columns OR custom grid-template-columns.
    //   gap — string, default "1rem". Gap CSS value.
    //   children — Snippet, required. Grid items.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Grid columns={3} gap="1rem">…</Grid>
    //
    // Examples:
    //   <Grid columns="200px 1fr 200px" gap="1rem">
    //     <aside>L</aside><main>M</main><aside>R</aside>
    //   </Grid>
    //
    // Keyboard:
    //   - None (purely structural)
    //
    // Accessibility:
    //   - No ARIA role (presentational layout container)
    //
    // Internationalization:
    //   - All text comes through children; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: only inline styles are grid behavior (display, template, gap)
    //   - When columns is a number, uses repeat(N, minmax(0, 1fr))
    //   - When columns is a string, uses it as-is
    //
    // References:
    //   - MDN CSS Grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        columns = 12,
        gap = "1rem",
        children,
        ...restProps
    }: {
        /** Number of equal columns OR custom grid-template-columns string */
        columns?: number | string;
        /** Gap CSS value */
        gap?: string;
        /** Grid items */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    const templateColumns = $derived(
        typeof columns === "number"
            ? `repeat(${columns}, minmax(0, 1fr))`
            : columns
    );
</script>

<!-- Grid.svelte -->
<div
    class={`grid ${className}`}
    data-columns={String(columns)}
    style={`display: grid; grid-template-columns: ${templateColumns}; gap: ${gap};`}
    {...restProps}
>
    {@render children?.()}
</div>
