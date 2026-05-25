<script lang="ts">
    // PaginationNav component
    //
    // A navigation landmark for pagination controls that allow users to navigate
    // between pages of content. Renders a <nav> element with an accessible label.
    // Contains a PaginationList which holds PaginationListItem children. Commonly
    // used in search results, product listings, data tables, and any interface
    // with paginated content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name for the navigation landmark.
    //   children — Snippet, required. PaginationList element.
    //   ...restProps — additional HTML attributes spread onto the <nav>.
    //
    // Syntax:
    //   <PaginationNav label="Pagination">
    //     <PaginationList>...</PaginationList>
    //   </PaginationNav>
    //
    // Examples:
    //   <!-- Full pagination navigation -->
    //   <PaginationNav label="Pagination">
    //     <PaginationList>
    //       <PaginationListItem><a href="/page/1">Previous</a></PaginationListItem>
    //       <PaginationListItem><a href="/page/1">1</a></PaginationListItem>
    //       <PaginationListItem><a href="/page/2" aria-current="page">2</a></PaginationListItem>
    //       <PaginationListItem><a href="/page/3">3</a></PaginationListItem>
    //       <PaginationListItem><a href="/page/3">Next</a></PaginationListItem>
    //     </PaginationList>
    //   </PaginationNav>
    //
    // Keyboard:
    //   - Tab: Focus moves between pagination links in the list
    //   - Enter: Activates the focused link to navigate to that page
    //
    // Accessibility:
    //   - <nav> with aria-label creates a navigation landmark
    //   - Screen readers announce the landmark name for orientation
    //   - Consumer should apply aria-current="page" on the active page link
    //
    // Internationalization:
    //   - Label text comes through the label prop; no hardcoded strings
    //
    // Claude rules:
    //   - Compound component — use with PaginationList and PaginationListItem
    //   - Headless: no CSS, no styles — consumer provides all styling
    //
    // References:
    //   - WAI-ARIA Navigation role: https://www.w3.org/TR/wai-aria-1.2/#navigation
    //   - HTML nav element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible label for the pagination navigation. */
        label: string;
        /** PaginationList element. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- PaginationNav.svelte -->
<nav
    class={`pagination-nav ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</nav>
