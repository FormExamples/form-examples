<script lang="ts">
    // DocumentList component
    //
    // A list of documents. Renders a <ul> with the `document-list` hook; items are DocumentListItem.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The DocumentListItem children.
    //   ...restProps — additional HTML attributes spread onto the root <ul>.
    //
    // Syntax:
    //   <DocumentList label="…">…</DocumentList>
    //
    // Examples:
    //   <DocumentList label="Reports"><DocumentListItem>…</DocumentListItem></DocumentList>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <ul>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DocumentList.svelte -->
<ul
    class={`document-list ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</ul>
