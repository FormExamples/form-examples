<script lang="ts">
    // GanttTableTr component
    //
    // A single row within a GanttTable grid. Renders as a <tr> containing
    // GanttTableTD cells for each time period and task header cells.
    // Used inside GanttTableHead, GanttTableBody, or GanttTableTfoot.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. GanttTableTD cells and header cells for this row.
    //   ...restProps — additional HTML attributes spread onto the <tr>.
    //
    // Syntax:
    //   <GanttTableTr>
    //     <th>Design</th>
    //     <GanttTableTD active>---</GanttTableTD>
    //     <GanttTableTD />
    //   </GanttTableTr>
    //
    // Examples:
    //   <!-- Task row with active time periods -->
    //   <GanttTableTr>
    //     <th>Development</th>
    //     <GanttTableTD />
    //     <GanttTableTD active>---</GanttTableTD>
    //     <GanttTableTD active>---</GanttTableTD>
    //   </GanttTableTr>
    //
    //   <!-- Header row with time period labels -->
    //   <GanttTableTr>
    //     <th>Task</th><th>Week 1</th><th>Week 2</th><th>Week 3</th>
    //   </GanttTableTr>
    //
    // Keyboard:
    //   None built-in — keyboard navigation is handled at the GanttTable grid level.
    //
    // Accessibility:
    //   - <tr> has implicit role="row" within the grid (no explicit role needed)
    //
    // Internationalization:
    //   - All cell content comes through children snippet; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a GanttTable component (which provides the <table>)
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** GanttTableTD cells and header cells for this row. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GanttTableTr.svelte -->
<tr
    class={`gantt-table-tr ${className}`}
    {...restProps}
>
    {@render children?.()}
</tr>
