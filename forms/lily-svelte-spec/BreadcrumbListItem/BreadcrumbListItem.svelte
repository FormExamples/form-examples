<script lang="ts">
    // BreadcrumbListItem component
    //
    // A single step in a breadcrumb navigation trail. Renders as a semantic <li>
    // element designed to be placed inside a BreadcrumbList component. Supports
    // aria-current="page" to indicate the user's current location. Typically
    // contains a link for ancestor pages, or plain text for the current page.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   current — boolean, default false. Whether this item represents the current page.
    //   children — Snippet, required. Breadcrumb content, typically an <a> link or plain text.
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    //
    // Examples:
    //   <!-- Navigable ancestor page -->
    //   <BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>
    //
    //   <!-- Current page (no link) -->
    //   <BreadcrumbListItem current>About</BreadcrumbListItem>
    //
    // Keyboard:
    //   None directly — keyboard interaction is handled by the contained links.
    //
    // Accessibility:
    //   - Implicit listitem role from the semantic <li> element
    //   - aria-current="page" set when current is true, indicating the user's location
    //
    // Internationalization:
    //   - All text comes through children snippet; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Compound component: must be used inside a BreadcrumbList
    //
    // References:
    //   - WAI-ARIA Breadcrumb Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        current = false,
        children,
        ...restProps
    }: {
        /** Whether this is the current page. */
        current?: boolean;
        /** Breadcrumb content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- BreadcrumbListItem.svelte -->
<li
    class={`breadcrumb-list-item ${className}`}
    aria-current={current ? "page" : undefined}
    {...restProps}
>
    {@render children?.()}
</li>
