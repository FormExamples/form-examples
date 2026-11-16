<script lang="ts">
    // GanttTable component
    //
    // An interactive Gantt table that displays project tasks and their timelines
    // as a structured grid widget. Renders a <table> element with role="grid" and
    // an accessible label. Supports an optional visible caption. Commonly used in
    // project management tools and resource planning applications.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the Gantt table content.
    //   caption — string, optional. Visible caption text displayed above the table.
    //   children — Snippet, required. GanttTableHead, GanttTableBody, GanttTableTfoot elements.
    //   ...restProps — additional HTML attributes spread onto the <table>.
    //
    // Syntax:
    //   <GanttTable label="Project timeline">
    //     <GanttTableHead>
    //       <GanttTableTr>
    //         <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
    //       </GanttTableTr>
    //     </GanttTableHead>
    //     <GanttTableBody>
    //       <GanttTableTr>
    //         <th>Design</th>
    //         <GanttTableTD active>---</GanttTableTD>
    //         <GanttTableTD />
    //         <GanttTableTD />
    //       </GanttTableTr>
    //     </GanttTableBody>
    //   </GanttTable>
    //
    // Keyboard:
    //   Arrows, Home, End, Ctrl+Home, Ctrl+End, PageUp, PageDown, Enter, F2 and Escape over the cells, with one tab stop; data-consumer-keys on the root turns them off.
    //
    // Accessibility:
    //   - role="grid" identifies the table as an interactive grid widget
    //   - aria-label provides an accessible name describing the Gantt table
    //   - <caption> provides a visible accessible name when the caption prop is set
    //
    // Internationalization:
    //   - The label and caption props provide all text; no hardcoded strings
    //   - All content comes through the children snippet
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: use with GanttTableHead, GanttTableBody, GanttTableTfoot,
    //     GanttTableTr, GanttTableTD, and GanttTableTH
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

    import type { Snippet } from "svelte";
    import { warnMissingName } from "../dev-warning";
    import { attachGrid } from "../widget-keys";

    let {
        class: className = "",
        label,
        caption = undefined,
        children,
        ...restProps
    }: {
        /** Accessible name describing the Gantt table content. */
        label: string;
        /** Visible caption for the table. */
        caption?: string;
        /** GanttTableHead, GanttTableBody, GanttTableTfoot elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => warnMissingName("GanttTable", label, restProps["aria-labelledby"]));

    let rootEl = $state<HTMLElement>();
    $effect(() => (rootEl ? attachGrid(rootEl) : undefined));
</script>

<!-- GanttTable.svelte -->
<table
    bind:this={rootEl}
    class={`gantt-table ${className}`}
    role="grid"
    aria-label={label}
    {...restProps}
>
    {#if caption}
        <caption>{caption}</caption>
    {/if}
    {@render children?.()}
</table>
