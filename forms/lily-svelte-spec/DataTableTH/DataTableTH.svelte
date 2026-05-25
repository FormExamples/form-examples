<script lang="ts">
    // DataTableTD component
    //
    // A column header cell within a DataTable, rendered as a <th> element.
    // Used inside a <DataTableRow> within <DataTableHead> to label the columns
    // of the data table.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   colspan — number, optional. Number of columns this header cell spans.
    //   rowspan — number, optional. Number of rows this header cell spans.
    //   scope — "col" | "row" | "colgroup" | "rowgroup", default "col". Header scope.
    //   children — Snippet, optional. Header cell content.
    //   ...restProps — additional HTML attributes spread onto the <th>.
    //
    // Syntax:
    //   <DataTableHead>
    //     <DataTableRow>
    //       <DataTableTD>Name</DataTableTD>
    //       <DataTableTD>Email</DataTableTD>
    //     </DataTableRow>
    //   </DataTableHead>
    //
    // Keyboard:
    //   None — <th> is not interactive.
    //
    // Accessibility:
    //   - <th scope="col"> associates the header with its column for assistive tech
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a <tr> within a DataTable
    //   - All header text is provided by the consumer via children
    //
    // References:
    //   - HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        colspan,
        rowspan,
        scope = "col",
        children,
        ...restProps
    }: {
        /** Number of columns this header cell spans. */
        colspan?: number;
        /** Number of rows this header cell spans. */
        rowspan?: number;
        /** Header scope. */
        scope?: "col" | "row" | "colgroup" | "rowgroup";
        /** Header cell content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DataTableTD.svelte -->
<th
    class={`data-table-th ${className}`}
    {scope}
    colspan={colspan || undefined}
    rowspan={rowspan || undefined}
    {...restProps}
>
    {#if children}{@render children?.()}{/if}
</th>
