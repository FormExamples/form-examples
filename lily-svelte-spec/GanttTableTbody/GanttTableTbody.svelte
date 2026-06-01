<script lang="ts">
    // GanttTableBody component
    //
    // The body section of a GanttTable, rendered as a <tbody> element.
    // Contains GanttTableTR elements with task data cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. GanttTableTR elements with data cells.
    //   ...restProps — additional HTML attributes spread onto the <tbody>.
    //
    // Syntax:
    //   <GanttTableBody>
    //     <GanttTableTR>
    //       <GanttTableTD>Design</GanttTableTD>
    //       <GanttTableTD>Jan 1</GanttTableTD>
    //     </GanttTableTR>
    //   </GanttTableBody>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the GanttTable grid level.
    //
    // Accessibility:
    //   - <tbody> provides structural body semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a GanttTable
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** GanttTableTR elements with task data cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GanttTableBody.svelte -->
<tbody
    class={`gantt-table-tbody ${className}`}
    {...restProps}
>
    {@render children?.()}
</tbody>
