<script lang="ts">
    // CalendarYearTable component
    //
    // A calendar grid for a grid of the twelve months of one year (typically 3 x 4 or 4 x 3 month cells). A structural wrapper like CalendarTable:
    // a <table> with role="grid" and data-view="year"; the consumer supplies the
    // head, body and rows by reusing the CalendarTable* sub-elements.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name describing the period shown, e.g. a year (e.g. "2025").
    //   caption — string, optional. Visible caption text displayed above the table.
    //   children — Snippet, required. CalendarTableHead, CalendarTableBody, CalendarTableFoot elements.
    //   ...restProps — additional HTML attributes spread onto the <table>.
    //
    // Syntax:
    //   <CalendarYearTable label="2025">
    //     <CalendarTableBody>...</CalendarTableBody>
    //   </CalendarYearTable>
    //
    // Keyboard:
    //   Arrows, Home, End, Ctrl+Home, Ctrl+End, PageUp, PageDown, Enter, F2 and Escape over the cells, with one tab stop; data-consumer-keys on the root turns them off.
    //
    // Accessibility:
    //   - role="grid" identifies the table as an interactive grid widget
    //   - aria-label provides an accessible name describing the period
    //   - data-view="year" lets consumer CSS and JS key on the view
    //
    // Internationalization:
    //   - label and caption supply all text; locale formatting (Intl) and cell
    //     content are the consumer's concern
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Reuse the CalendarTable* sub-elements; there are no CalendarYearTable* sub-elements
    //
    // References:
    //   - WAI-ARIA Grid Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

    import type { Snippet } from "svelte";
    import { warnMissingName } from "../dev-warning";
    import { attachGrid } from "../widget-keys";

    let {
        class: className = "",
        label,
        caption = undefined,
        children,
        ...restProps
    }: {
        /** Accessible name describing the period shown. */
        label: string;
        /** Visible caption for the table. */
        caption?: string;
        /** CalendarTableHead, CalendarTableBody, CalendarTableFoot elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() => warnMissingName("CalendarYearTable", label, restProps["aria-labelledby"]));

    let rootEl = $state<HTMLElement>();
    $effect(() => (rootEl ? attachGrid(rootEl) : undefined));
</script>

<!-- CalendarYearTable.svelte -->
<table
    bind:this={rootEl}
    class={`calendar-year-table ${className}`}
    role="grid"
    aria-label={label}
    data-view="year"
    {...restProps}
>
    {#if caption}
        <caption>{caption}</caption>
    {/if}
    {@render children?.()}
</table>
