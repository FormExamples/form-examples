<script lang="ts">
    // GanttTableHead component
    //
    // The header section of a GanttTable, rendered as a <thead> element.
    // Contains GanttTableTR elements with column headers for task names,
    // dates, durations, or other Gantt chart metadata.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. GanttTableTR elements with header cells.
    //   ...restProps — additional HTML attributes spread onto the <thead>.
    //
    // Syntax:
    //   <GanttTableHead>
    //     <GanttTableTR><th>Task</th><th>Start</th><th>End</th></GanttTableTR>
    //   </GanttTableHead>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the GanttTable grid level.
    //
    // Accessibility:
    //   - <thead> provides structural header semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a GanttTable
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** GanttTableTR elements with header cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GanttTableHead.svelte -->
<thead
    class={`gantt-table-thead ${className}`}
    {...restProps}
>
    {@render children?.()}
</thead>
