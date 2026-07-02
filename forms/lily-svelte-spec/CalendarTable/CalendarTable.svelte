<script lang="ts">
    // CalendarTable component
    //
    // An interactive calendar table that presents dates in a structured grid
    // layout using a <table> element with role="grid". Supports an optional
    // visible caption. Commonly used in scheduling apps, event planners, and
    // date pickers.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the calendar period (e.g. "January 2025").
    //   caption — string, optional. Visible caption text displayed above the table.
    //   children — Snippet, required. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
    //   ...restProps — additional HTML attributes spread onto the <table>.
    //
    // Syntax:
    //   <CalendarTable label="January 2025">
    //     <CalendarTableHead>
    //       <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></CalendarTableRow>
    //     </CalendarTableHead>
    //     <CalendarTableBody>
    //       <CalendarTableRow><CalendarTableTD>1</CalendarTableTD></CalendarTableRow>
    //     </CalendarTableBody>
    //   </CalendarTable>
    //
    // Keyboard:
    //   None built-in — consumer should implement grid keyboard navigation
    //   (arrow keys for cell movement, Enter/Space for selection).
    //
    // Accessibility:
    //   - role="grid" identifies the table as an interactive grid widget
    //   - aria-label provides an accessible name describing the calendar period
    //   - <caption> provides a visible accessible name when the caption prop is set
    //
    // Internationalization:
    //   - The label and caption props provide all text; no hardcoded strings
    //   - Day-of-week and date content is provided by the consumer
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: use with CalendarTableHead, CalendarTableBody, CalendarTableFoot,
    //     CalendarTableRow, CalendarTableTD, and CalendarTableTD
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
        /** Accessible name describing the calendar period (e.g. month and year). */
        label: string;
        /** Visible caption for the table. */
        caption?: string;
        /** CalendarTableHead, CalendarTableBody, CalendarTableFoot elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CalendarTable.svelte -->
<table
    class={`calendar-table ${className}`}
    role="grid"
    aria-label={label}
    {...restProps}
>
    {#if caption}
        <caption>{caption}</caption>
    {/if}
    {@render children?.()}
</table>
