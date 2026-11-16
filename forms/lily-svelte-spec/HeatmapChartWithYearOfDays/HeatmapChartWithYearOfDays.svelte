<script lang="ts">
    // HeatmapChartWithYearOfDays component
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
    //   year — number, required. The calendar year the chart shows (data-year).
    //   weekStart — number, required. First weekday row, 0 = Sunday … 6 = Saturday
    //     (data-week-start). Locale-dependent, so there is no default.
    //   children — Snippet. The consumer-supplied inline svg.
    //   dataTable — Snippet, optional. The accessible table alternative.
    //   ...restProps — spread onto the root <figure>.
    //
    // Markup:
    //   <figure class="heatmap-chart-with-year-of-days">
    //     <div class="heatmap-chart-with-year-of-days-graphic" role="img" aria-label>…svg…</div>
    //     <div class="heatmap-chart-with-year-of-days-data-table">…table…</div>   (only when provided)
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
        year,
        weekStart,
        children,
        dataTable,
        ...restProps
    }: {
        /** Accessible name for the chart. */
        label: string;
        /** The calendar year shown. */
        year: number;
        /** First weekday row: 0 = Sunday … 6 = Saturday. */
        weekStart: number;
        /** The consumer-supplied inline svg. */
        children: Snippet;
        /** Optional accessible data table alternative. */
        dataTable?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- HeatmapChartWithYearOfDays.svelte -->
<figure
    class={`heatmap-chart-with-year-of-days ${className}`}
    data-year={year}
    data-week-start={weekStart}
    {...restProps}
>
    <div
        class="heatmap-chart-with-year-of-days-graphic"
        role="img"
        aria-label={label}
    >
        {@render children?.()}
    </div>
    {#if dataTable}
        <div class="heatmap-chart-with-year-of-days-data-table">
            {@render dataTable()}
        </div>
    {/if}
</figure>
