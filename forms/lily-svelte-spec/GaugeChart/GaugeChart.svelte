<script lang="ts">
    // GaugeChart component
    //
    // A headless chart container. The consumer supplies the inline svg as
    // `children`; the component draws nothing. The graphic is a
    // role="img" wrapper named by `label`. The optional `dataTable` snippet
    // renders the accessible table alternative as a SIBLING of that image
    // wrapper, never inside it: a role="img" element makes its descendants
    // presentational, so a table placed inside would be invisible to
    // assistive technology.
    //
    // Props:
    //   class — string, optional. Consumer class appended after the base class.
    //   label — string, required. Accessible name of the chart image.
    //   children — Snippet. The consumer-supplied inline svg.
    //   dataTable — Snippet, optional. The accessible table alternative.
    //   ...restProps — spread onto the root <figure>.
    //
    // Markup:
    //   <figure class="gauge-chart">
    //     <div class="gauge-chart-graphic" role="img" aria-label>…svg…</div>
    //     <div class="gauge-chart-data-table">…table…</div>   (only when provided)
    //   </figure>
    //
    // Keyboard: none on the graphic; the data table follows native table behaviour.
    //
    // Claude rules:
    //   - Headless: no CSS, no inline styles; no drawing.
    //   - No hardcoded user-facing strings.

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        dataTable,
        ...restProps
    }: {
        /** Accessible name for the chart. */
        label: string;
        /** The consumer-supplied inline svg. */
        children: Snippet;
        /** Optional accessible data table alternative. */
        dataTable?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GaugeChart.svelte -->
<figure
    class={`gauge-chart ${className}`}
    {...restProps}
>
    <div
        class="gauge-chart-graphic"
        role="img"
        aria-label={label}
    >
        {@render children?.()}
    </div>
    {#if dataTable}
        <div class="gauge-chart-data-table">
            {@render dataTable()}
        </div>
    {/if}
</figure>
