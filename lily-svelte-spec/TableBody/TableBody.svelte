<script lang="ts">
    // TableBody component
    //
    // The body section of a Table, rendered as a <tbody> element.
    // Contains TableRow elements with data cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. TableRow elements with data cells.
    //   ...restProps — additional HTML attributes spread onto the <tbody>.
    //
    // Syntax:
    //   <TableBody>...</TableBody>
    //
    // Keyboard:
    //   None — tables are non-interactive structural wrappers.
    //
    // Accessibility:
    //   - <tbody> provides native table-section semantics
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a Table
    //   - No internal state — purely a structural wrapper
    //
    // References:
    //   - HTML tbody element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** TableRow elements with data cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TableBody.svelte -->
<tbody
    class={`table-body ${className}`}
    {...restProps}
>
    {@render children?.()}
</tbody>
