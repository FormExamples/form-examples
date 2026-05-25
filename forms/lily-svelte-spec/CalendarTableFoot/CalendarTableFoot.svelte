<script lang="ts">
    // CalendarTableFoot component
    //
    // The footer section of a CalendarTable, rendered as a <tfoot> element.
    // Contains CalendarTableRow elements with summary or aggregate data cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. CalendarTableRow elements with footer cells.
    //   ...restProps — additional HTML attributes spread onto the <tfoot>.
    //
    // Syntax:
    //   <CalendarTableFoot>
    //     <CalendarTableRow>
    //       <CalendarTableTD>Week Total: 5</CalendarTableTD>
    //     </CalendarTableRow>
    //   </CalendarTableFoot>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the CalendarTable grid level.
    //
    // Accessibility:
    //   - <tfoot> provides structural footer semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a CalendarTable
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
        /** CalendarTableRow elements with footer cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CalendarTableFoot.svelte -->
<tfoot
    class={`calendar-table-foot ${className}`}
    {...restProps}
>
    {@render children?.()}
</tfoot>
