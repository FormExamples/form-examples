<script lang="ts">
    // RingChart component
    //
    // A headless chart container for a pie chart with a hollow centre, often used to show progress or a share of a total. The consumer supplies the inline
    // svg as `children`; the component draws nothing. The graphic is a
    // role="img" wrapper named by `label`. The optional `dataTable` snippet
    // renders the accessible table alternative as a SIBLING of that image
    // wrapper, never inside it: a role="img" element makes its descendants
    // presentational, so a table placed inside would be invisible to
    // assistive technology.
    //
    // Props:
    //   class — string, optional. Consumer class appended after the base class.
    //   label — string, optional. Accessible name of the chart image.
    //   children — Snippet. The consumer-supplied inline svg.
    //   dataTable — Snippet, optional. The accessible table alternative.
    //   ...restProps — spread onto the root <figure>.
    //
    // Markup:
    //   <figure class="ring-chart">
    //     <div class="ring-chart-graphic" role="img" aria-label>…svg…</div>
    //     <div class="ring-chart-data-table">…table…</div>   (only when provided)
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
        label = undefined,
        children,
        dataTable,
        ...restProps
    }: {
        /** Accessible name for the chart. */
        label?: string;
        /** The consumer-supplied inline svg. */
        children: Snippet;
        /** Optional accessible data table alternative. */
        dataTable?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- RingChart.svelte -->
<figure
    class={`ring-chart ${className}`}
    {...restProps}
>
    <div
        class="ring-chart-graphic"
        role="img"
        aria-label={label}
    >
        {@render children?.()}
    </div>
    {#if dataTable}
        <div class="ring-chart-data-table">
            {@render dataTable()}
        </div>
    {/if}
</figure>
