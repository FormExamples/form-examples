<script lang="ts">
    // DocumentListItem component
    //
    // One document in a DocumentList. Renders an <li> with the `document-list-item` hook around the
    // consumer's link, type and size.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   children — Snippet, required. The document link and its details.
    //   ...restProps — additional HTML attributes spread onto the root <li>.
    //
    // Syntax:
    //   <DocumentListItem>…</DocumentListItem>
    //
    // Examples:
    //   <DocumentList><DocumentListItem><a href="/report.pdf">Report</a></DocumentListItem></DocumentList>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - Native semantics only; name the element through restProps (aria-labelledby) only if it needs one
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <li>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- DocumentListItem.svelte -->
<li
    class={`document-list-item ${className}`}
    {...restProps}
>
    {@render children?.()}
</li>
