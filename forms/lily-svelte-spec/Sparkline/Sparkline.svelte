<script lang="ts">
    // Sparkline component
    //
    // A headless sparkline chart container that provides a semantic wrapper with
    // role="img" for compact, minimalist data visualizations. Sparklines display
    // trends or variations as tiny line, bar, or win/loss charts, typically embedded
    // within text or tables. The consumer provides SVG, canvas, or other rendering.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the sparkline data via aria-label.
    //   children — Snippet, required. The visualization content (SVG, canvas, etc.).
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <Sparkline label="Sales trend">
    //     <svg><!-- sparkline SVG --></svg>
    //   </Sparkline>
    //
    // Examples:
    //   <!-- Inline sparkline in a table cell -->
    //   <Sparkline label="Revenue trend over past 7 days">
    //     <svg viewBox="0 0 100 20"><polyline points="0,20 20,10 40,15 60,5 80,12 100,2" /></svg>
    //   </Sparkline>
    //
    //   <!-- With canvas rendering -->
    //   <Sparkline label="Temperature last 24 hours">
    //     <canvas width="100" height="20"></canvas>
    //   </Sparkline>
    //
    // Keyboard:
    //   - None — this is a passive container for data visualization.
    //
    // Accessibility:
    //   - role="img" identifies the container as a graphical image
    //   - aria-label describes what the sparkline represents
    //   - Screen readers announce the label in place of the visual content
    //
    // Internationalization:
    //   - The label prop externalizes the data description for localization
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - No internal state or chart rendering — purely a structural wrapper
    //   - Consumer provides all visualization content via children snippet
    //
    // References:
    //   - WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img

    import type { Snippet } from "svelte";
    import { warnMissingProp } from "../dev-warning";
    let {
        class: className = "",
        label,
        pointCount = undefined,
        minimumPoints = undefined,
        insufficientLabel = undefined,
        children,
        ...restProps
    }: {
        label: string;
        /** How many readings the consumer's graphic shows. */
        pointCount?: number;
        /**
         * Fewer readings than this are not a trend: the graphic is not shown, only insufficientLabel, as text
         * (spec/lessons/zoblocks). Rendered as data-insufficient.
         */
        minimumPoints?: number;
        /** Why there is no line, in the consumer's words ("Not enough readings for a trend"); required with minimumPoints. */
        insufficientLabel?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    const insufficient = $derived(
        pointCount !== undefined && minimumPoints !== undefined && pointCount < minimumPoints,
    );

    $effect(() => {
        if (minimumPoints !== undefined)
            warnMissingProp(
                "Sparkline",
                "insufficientLabel",
                insufficientLabel,
                "a sparkline that draws no line must say why in words.",
            );
    });
</script>

<!-- Sparkline.svelte: below minimumPoints the root is plain text (no role="img", which would hide it behind the label). -->
<span
    class={`sparkline ${className}`}
    role={insufficient ? undefined : "img"}
    aria-label={insufficient ? undefined : label}
    data-insufficient={insufficient ? "" : undefined}
    {...restProps}
>
    {#if insufficient}<span class="sparkline-insufficient">{insufficientLabel}</span
        >{:else}{@render children?.()}{/if}
</span>
