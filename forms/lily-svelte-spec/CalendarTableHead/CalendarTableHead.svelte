<script lang="ts">
    // CalendarTableHead component
    //
    // The header section of a CalendarTable, rendered as a <thead> element.
    // Contains CalendarTableRow elements with day-of-week column headers.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. CalendarTableRow elements with header cells.
    //   ...restProps — additional HTML attributes spread onto the <thead>.
    //
    // Syntax:
    //   <CalendarTableHead>
    //     <CalendarTableRow><th>Sun</th><th>Mon</th><th>Tue</th></CalendarTableRow>
    //   </CalendarTableHead>
    //
    // Keyboard:
    //   None built-in — keyboard navigation handled at the CalendarTable grid level.
    //
    // Accessibility:
    //   - <thead> provides structural header semantics for the table
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a CalendarTable
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML thead element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** CalendarTableRow elements with day-of-week header cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CalendarTableHead.svelte -->
<thead
    class={`calendar-table-head ${className}`}
    {...restProps}
>
    {@render children?.()}
</thead>
