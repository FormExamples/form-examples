<script lang="ts">
    // KanbanTableFoot component
    //
    // The footer section of a KanbanTable, rendered as a <tfoot> element.
    // Contains KanbanTableRow elements with summary or aggregate data cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. KanbanTableRow elements with footer cells.
    //   ...restProps — additional HTML attributes spread onto the <tfoot>.
    //
    // Syntax:
    //   <KanbanTableFoot>
    //     <KanbanTableRow>
    //       <KanbanTableTD>Total: 3</KanbanTableTD>
    //       <KanbanTableTD>Total: 5</KanbanTableTD>
    //     </KanbanTableRow>
    //   </KanbanTableFoot>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the KanbanTable grid level.
    //
    // Accessibility:
    //   - <tfoot> provides structural footer semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a KanbanTable
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tfoot element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** KanbanTableRow elements with footer cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- KanbanTableFoot.svelte -->
<tfoot
    class={`kanban-table-foot ${className}`}
    {...restProps}
>
    {@render children?.()}
</tfoot>
