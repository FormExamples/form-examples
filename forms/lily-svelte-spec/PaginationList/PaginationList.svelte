<script lang="ts">
    // PaginationList component
    //
    // A headless ordered list of pagination items, intended to live inside a
    // PaginationNav landmark. Renders an <ol> element. Commonly used in search
    // results, product listings, data tables, and any interface with paginated
    // content.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name for the list via aria-label.
    //                Usually omitted, since PaginationNav already supplies the
    //                navigation landmark label.
    //   children — Snippet, required. PaginationListItem elements.
    //   ...restProps — additional HTML attributes spread onto the <ol>.
    //
    // Syntax:
    //   <PaginationNav label="Pagination">
    //     <PaginationList>
    //       <PaginationListItem>...</PaginationListItem>
    //     </PaginationList>
    //   </PaginationNav>
    //
    // Examples:
    //   <PaginationList>
    //     <PaginationListItem><a href="/page/1">1</a></PaginationListItem>
    //     <PaginationListItem><a href="/page/2" aria-current="page">2</a></PaginationListItem>
    //     <PaginationListItem><a href="/page/3">3</a></PaginationListItem>
    //   </PaginationList>
    //
    // Keyboard:
    //   - Tab: moves focus between pagination links/buttons in the list
    //   - Enter: activates the focused link or button to navigate to that page
    //
    // Accessibility:
    //   - <ol> conveys ordered-list semantics
    //   - Consumer should apply aria-current="page" on the link for the active page
    //   - Compound component; see PaginationNav for the navigation landmark and
    //     PaginationListItem for individual page items
    //
    // Internationalization:
    //   - The optional label prop accepts any translated string
    //   - All page link text comes through children
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - This is a compound component child; use inside PaginationNav with
    //     PaginationListItem children
    //
    // References:
    //   - HTML ol element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        /** Optional accessible label for the list. */
        label?: string;
        /** PaginationListItem elements. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- PaginationList.svelte -->
<ol
    class={`pagination-list ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</ol>
