<script lang="ts">
    // Caption component
    //
    // A headless caption for providing supplementary text alongside images, videos,
    // charts, or other media. Renders as a semantic <figcaption> element, which
    // provides an implicit association with a parent <figure> element. Commonly used
    // in galleries, product pages, data visualizations, and educational content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. The caption text or content to display.
    //   ...restProps — additional HTML attributes spread onto the <figcaption>.
    //
    // Syntax:
    //   <Caption>Photo of a sunset over the ocean.</Caption>
    //
    // Examples:
    //   <!-- Caption for a chart with an id for aria-describedby -->
    //   <Caption id="chart-caption">Figure 1: Revenue growth over time.</Caption>
    //
    //   <!-- Caption inside a figure -->
    //   <figure>
    //     <img src="sunset.jpg" alt="Sunset over the ocean" />
    //     <Caption>Photo taken at Malibu beach.</Caption>
    //   </figure>
    //
    // Keyboard:
    //   None — this component is a passive container for descriptive text.
    //
    // Accessibility:
    //   - Implicit semantics from <figcaption> — automatically associated with parent <figure>
    //   - Can be referenced via id and aria-describedby from other elements
    //
    // Internationalization:
    //   - All text comes through children snippet; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Should be placed inside a <figure> for proper semantic association
    //
    // References:
    //   - MDN figcaption: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Caption.svelte -->
<figcaption
    class={`caption ${className}`}
    {...restProps}
>
    {@render children?.()}
</figcaption>
