<script lang="ts">
    // KanbanTable component
    //
    // A headless Kanban board that organizes work items into columns representing
    // different workflow stages such as "To Do", "In Progress", and "Done". Renders
    // as a <table> element with role="grid" and an accessible label. Commonly used
    // in project management tools, agile development platforms, and task tracking.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the board via aria-label.
    //   caption — string, optional. Visible caption text displayed above the table.
    //   children — Snippet, required. KanbanTableHead, KanbanTableBody, KanbanTableFoot elements.
    //   ...restProps — additional HTML attributes spread onto the <table>.
    //
    // Syntax:
    //   <KanbanTable label="Sprint 5 board">...</KanbanTable>
    //
    // Examples:
    //   <KanbanTable label="Sprint 5 board">
    //     <KanbanTableHead>
    //       <KanbanTableRow>
    //         <th>To Do</th><th>In Progress</th><th>Done</th>
    //       </KanbanTableRow>
    //     </KanbanTableHead>
    //     <KanbanTableBody>
    //       <KanbanTableRow>
    //         <KanbanTableTD>Task A</KanbanTableTD>
    //         <KanbanTableTD>Task B</KanbanTableTD>
    //         <KanbanTableTD>Task C</KanbanTableTD>
    //       </KanbanTableRow>
    //     </KanbanTableBody>
    //   </KanbanTable>
    //
    // Keyboard:
    //   None built-in — consumer should implement grid keyboard navigation
    //   (arrow keys for cell movement, Enter/Space for selection).
    //
    // Accessibility:
    //   - role="grid" identifies the table as an interactive grid widget
    //   - aria-label provides an accessible name for the kanban board
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: use with KanbanTableHead, KanbanTableBody, KanbanTableFoot,
    //     KanbanTableRow, KanbanTableTD, and KanbanTableTD
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        caption = undefined,
        children,
        ...restProps
    }: {
        /** Accessible name describing the kanban board. */
        label: string;
        /** Visible caption for the table. */
        caption?: string;
        /** KanbanTableHead, KanbanTableBody, KanbanTableFoot elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- KanbanTable.svelte -->
<table
    class={`kanban-table ${className}`}
    role="grid"
    aria-label={label}
    {...restProps}
>
    {#if caption}
        <caption>{caption}</caption>
    {/if}
    {@render children?.()}
</table>
