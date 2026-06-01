<script lang="ts">
    // ContainerWithFixedWidth component
    //
    // A headless centered content wrapper with a fixed max-width breakpoint. Renders
    // a `<div>` with inline `max-width` and `margin-inline: auto` so the container
    // centers within its parent. Consumer CSS may further refine spacing or breakpoints.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   maxWidth — string, default "1200px". Max width CSS value.
    //   children — Snippet, required. The content to wrap.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <ContainerWithFixedWidth maxWidth="960px">…</ContainerWithFixedWidth>
    //
    // Examples:
    //   <ContainerWithFixedWidth maxWidth="80ch">
    //     <article>…</article>
    //   </ContainerWithFixedWidth>
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
    //   - Headless: only inline styles are `max-width` and `margin-inline` (functional layout)
    //
    // References:
    //   - CSS Container Queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        maxWidth = "1200px",
        children,
        ...restProps
    }: {
        /** Max width CSS value */
        maxWidth?: string;
        /** Container content */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ContainerWithFixedWidth.svelte -->
<div
    class={`container-with-fixed-width ${className}`}
    data-max-width={maxWidth}
    style={`max-width: ${maxWidth}; margin-inline: auto;`}
    {...restProps}
>
    {@render children?.()}
</div>
