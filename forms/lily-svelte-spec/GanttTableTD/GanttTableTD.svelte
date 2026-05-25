<script lang="ts">
    // GanttTableTD component
    //
    // A single cell within a GanttTableTR representing a time period in the
    // Gantt table grid. Renders as a <td> with role="gridcell". Supports an
    // active state to indicate the task spans this time period, communicated
    // via aria-selected for screen readers.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   active — boolean, default false. Whether this cell represents an active time period for the task.
    //   children — Snippet, optional. Cell content such as bar indicators or duration text.
    //   ...restProps — additional HTML attributes spread onto the <td>.
    //
    // Syntax:
    //   <GanttTableTD active>---</GanttTableTD>
    //   <GanttTableTD />
    //
    // Examples:
    //   <!-- Active time period with bar content -->
    //   <GanttTableTD active>---</GanttTableTD>
    //
    //   <!-- Inactive empty time period -->
    //   <GanttTableTD />
    //
    //   <!-- Active with milestone marker -->
    //   <GanttTableTD active>◆</GanttTableTD>
    //
    // Keyboard:
    //   None built-in — keyboard navigation is handled at the GanttTable grid level.
    //
    // Accessibility:
    //   - role="gridcell" identifies the cell as part of a grid
    //   - aria-selected set to true when active; omitted otherwise
    //   - Roving tabindex: tabindex="0" when active, "-1" otherwise
    //
    // Internationalization:
    //   - Cell content comes through children snippet; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a GanttTableTR (which provides the <tr>)
    //   - Children are optional — empty cells represent inactive time periods
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        active = false,
        children,
        ...restProps
    }: {
        /** Whether this cell represents an active time period for the task. */
        active?: boolean;
        /** Cell content such as bar indicators or duration text. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- GanttTableTD.svelte -->
<td
    class={`gantt-table-td ${className}`}
    role="gridcell"
    aria-selected={active || undefined}
    tabindex={active ? 0 : -1}
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
</td>
