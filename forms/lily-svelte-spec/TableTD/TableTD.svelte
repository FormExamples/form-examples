<script lang="ts">
    // TableTD component
    //
    // A data cell within a Table, rendered as a <td> element. Used inside a
    // <TableRow> within <TableBody> or <TableFoot> to hold one cell of data.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   colSpan — number, optional. Number of columns this cell spans.
    //   rowSpan — number, optional. Number of rows this cell spans.
    //   children — Snippet, optional. Cell content.
    //   ...restProps — additional HTML attributes spread onto the <td>.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a <tr> within a Table
    //
    // References:
    //   - HTML td element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        colSpan = undefined,
        rowSpan = undefined,
        children,
        ...restProps
    }: {
        /** Number of columns this cell spans. */
        colSpan?: number;
        /** Number of rows this cell spans. */
        rowSpan?: number;
        /** Cell content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TableTD.svelte -->
<td
    class={`table-td ${className}`}
    colspan={colSpan || undefined}
    rowspan={rowSpan || undefined}
    {...restProps}
>
    {@render children?.()}
</td>
