<script lang="ts">
    // TableTH component
    //
    // A header cell within a Table, rendered as a <th> element. Used inside
    // a <TableRow> within <TableHead> to label columns, or with scope="row"
    // to label a row.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   colSpan — number, optional. Number of columns this header cell spans.
    //   rowSpan — number, optional. Number of rows this header cell spans.
    //   scope — "col" | "row" | "colgroup" | "rowgroup", default "col". Header scope.
    //   children — Snippet, optional. Header cell content.
    //   ...restProps — additional HTML attributes spread onto the <th>.
    //
    // Accessibility:
    //   - <th scope="col"> associates the header with its column
    //   - <th scope="row"> associates the header with its row
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a <tr> within a Table
    //
    // References:
    //   - HTML th element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        colSpan = undefined,
        rowSpan = undefined,
        scope = "col",
        children,
        ...restProps
    }: {
        /** Number of columns this header cell spans. */
        colSpan?: number;
        /** Number of rows this header cell spans. */
        rowSpan?: number;
        /** Header scope. */
        scope?: "col" | "row" | "colgroup" | "rowgroup";
        /** Header cell content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TableTH.svelte -->
<th
    class={`table-th ${className}`}
    {scope}
    colspan={colSpan || undefined}
    rowspan={rowSpan || undefined}
    {...restProps}
>
    {@render children?.()}
</th>
