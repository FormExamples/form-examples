<script lang="ts">
    // CalendarTableRow component
    //
    // A single row within a CalendarTable grid. Renders as a <tr>,
    // containing CalendarTableTD cells for each day in the week.
    // Used inside CalendarTableHead, CalendarTableBody, or CalendarTableFoot.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. CalendarTableTD cells for each day in the row.
    //   ...restProps — additional HTML attributes spread onto the <tr>.
    //
    // Syntax:
    //   <CalendarTableRow>
    //     <CalendarTableTD>1</CalendarTableTD>
    //     <CalendarTableTD>2</CalendarTableTD>
    //   </CalendarTableRow>
    //
    // Keyboard:
    //   None built-in — keyboard navigation is handled at the CalendarTable grid level.
    //
    // Accessibility:
    //   - <tr> has implicit role="row" within the grid (no explicit role needed)
    //
    // Internationalization:
    //   - All cell content comes through children snippet; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a CalendarTable component (which provides the <table>)
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
        /** CalendarTableTD cells for this row. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CalendarTableRow.svelte -->
<tr
    class={`calendar-table-row ${className}`}
    {...restProps}
>
    {@render children?.()}
</tr>
