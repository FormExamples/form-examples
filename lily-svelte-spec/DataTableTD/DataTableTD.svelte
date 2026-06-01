<script lang="ts">
    // DataTableTD component
    //
    // A single data cell within a DataTableRow. Renders as a <td> with
    // role="gridcell". Supports an active state for indicating the currently
    // focused or selected cell, communicated via aria-selected for screen
    // readers. Uses a roving tabindex pattern.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   active — boolean, default false. Whether this cell is active/selected.
    //   children — Snippet, required. Cell content.
    //   ...restProps — additional HTML attributes spread onto the <td>.
    //
    // Syntax:
    //   <DataTableTD>Alice</DataTableTD>
    //   <DataTableTD active>Bob</DataTableTD>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the DataTable grid level.
    //
    // Accessibility:
    //   - role="gridcell" identifies the cell as part of an interactive grid
    //   - aria-selected set to true when active; omitted otherwise
    //   - Roving tabindex: tabindex="0" when active, "-1" otherwise
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a DataTableRow
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
        /** Whether this cell is active/selected. */
        active?: boolean;
        /** Cell content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DataTableTD.svelte -->
<td
    class={`data-table-td ${className}`}
    role="gridcell"
    aria-selected={active || undefined}
    tabindex={active ? 0 : -1}
    {...restProps}
>
    {@render children?.()}
</td>
