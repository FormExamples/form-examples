<script lang="ts">
    // TableFoot component
    //
    // The footer section of a Table, rendered as a <tfoot> element.
    // Contains TableRow elements with footer/summary cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. TableRow elements with footer/summary cells.
    //   ...restProps — additional HTML attributes spread onto the <tfoot>.
    //
    // Syntax:
    //   <TableFoot>...</TableFoot>
    //
    // Keyboard:
    //   None — tables are non-interactive structural wrappers.
    //
    // Accessibility:
    //   - <tfoot> provides native table-section semantics
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a Table
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
        /** TableRow elements with footer/summary cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TableFoot.svelte -->
<tfoot
    class={`table-foot ${className}`}
    {...restProps}
>
    {@render children?.()}
</tfoot>
