<script lang="ts">
    // Figure component
    //
    // A container for graphical content such as charts, diagrams, illustrations,
    // or data visualizations. Renders a <figure> element with role="img" and an
    // accessible label. Used in dashboards, reports, analytics tools, and data-driven
    // applications. The consumer provides their preferred visualization (SVG, canvas,
    // or a charting library) as children.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the figure content.
    //   children — Snippet, required. The figure visualization content.
    //   ...restProps — additional HTML attributes spread onto the <figure> element.
    //
    // Syntax:
    //   <Figure label="Monthly revenue">
    //     <svg><!-- chart here --></svg>
    //   </Figure>
    //
    // Examples:
    //   <!-- Bar chart figure -->
    //   <Figure label="Monthly revenue for 2024">
    //     <svg><!-- bar chart SVG here --></svg>
    //   </Figure>
    //
    //   <!-- Canvas-based visualization -->
    //   <Figure label="User growth trend">
    //     <canvas><!-- canvas chart here --></canvas>
    //   </Figure>
    //
    // Keyboard:
    //   - None — passive container for data visualization
    //
    // Accessibility:
    //   - role="img" identifies the figure as a graphical image
    //   - aria-label provides an accessible name describing the figure content
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized descriptions
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No internal state — purely a structural wrapper
    //   - Consumer provides all chart rendering (SVG, canvas, D3, Chart.js, etc.)
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
    //   - MDN figure element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: { label: string; children: Snippet; [key: string]: unknown } = $props();
</script>

<!-- Figure.svelte -->
<figure
    class={`figure ${className}`}
    role="img"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</figure>
