<script lang="ts">
    // TableHead component
    //
    // The header section of a Table, rendered as a <thead> element.
    // Contains TableRow elements with header cells.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. TableRow elements with header cells.
    //   ...restProps — additional HTML attributes spread onto the <thead>.
    //
    // Syntax:
    //   <TableHead>...</TableHead>
    //
    // Keyboard:
    //   None — tables are non-interactive structural wrappers.
    //
    // Accessibility:
    //   - <thead> provides native table-section semantics
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Must be used inside a Table
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
        /** TableRow elements with header cells. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TableHead.svelte -->
<thead
    class={`table-head ${className}`}
    {...restProps}
>
    {@render children?.()}
</thead>
