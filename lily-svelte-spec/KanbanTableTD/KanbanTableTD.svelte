<script lang="ts">
    // KanbanTableTD component
    //
    // A single cell within a KanbanTableRow, rendered as a <td> with role="gridcell".
    // Represents a task card or content area within a workflow column. Supports an
    // optional accessible label for screen reader identification.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   active — boolean, optional. Marks the cell as currently active/selected.
    //   label — string, optional. Accessible name for the cell via aria-label.
    //   children — Snippet, optional. Cell content such as task cards or text.
    //   ...restProps — additional HTML attributes spread onto the <td>.
    //
    // Syntax:
    //   <KanbanTableTD>Task content</KanbanTableTD>
    //   <KanbanTableTD active label="Design task">...</KanbanTableTD>
    //
    // Examples:
    //   <KanbanTableRow>
    //     <KanbanTableTD label="Fix login bug">Fix login bug</KanbanTableTD>
    //     <KanbanTableTD />
    //     <KanbanTableTD />
    //   </KanbanTableRow>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the KanbanTable grid level.
    //
    // Accessibility:
    //   - role="gridcell" identifies the cell as part of a grid
    //   - aria-selected indicates the active/selected state when active is true
    //   - tabindex enables roving tabindex (0 when active, -1 otherwise)
    //   - aria-label optionally provides an accessible name for the cell
    //
    // Internationalization:
    //   - Cell content comes through children snippet; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a KanbanTableRow
    //   - Children are optional — empty cells represent empty workflow slots
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        active = false,
        label,
        children,
        ...restProps
    }: {
        /** Marks the cell as currently active/selected. */
        active?: boolean;
        /** Accessible name for the cell. */
        label?: string;
        /** Cell content such as task cards or text. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- KanbanTableTD.svelte -->
<td
    class={`kanban-table-td ${className}`}
    role="gridcell"
    aria-selected={active || undefined}
    tabindex={active ? 0 : -1}
    aria-label={label}
    {...restProps}
>
    {#if children}
        {@render children?.()}
    {/if}
</td>
