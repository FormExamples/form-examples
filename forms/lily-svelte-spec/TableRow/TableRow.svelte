<script lang="ts">
    // TableRow component
    //
    // A single row in a Table, rendered as a <tr> element.
    // Contains TableTH or TableTD cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. TableTH or TableTD cells.
    //   ...restProps — additional HTML attributes spread onto the <tr>.
    //
    // Syntax:
    //   <TableRow>...</TableRow>
    //
    // Keyboard:
    //   None — tables are non-interactive structural wrappers.
    //
    // Accessibility:
    //   - <tr> provides native table-section semantics
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a Table
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tr element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** TableTH or TableTD cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TableRow.svelte -->
<tr
    class={`table-row ${className}`}
    {...restProps}
>
    {@render children?.()}
</tr>
