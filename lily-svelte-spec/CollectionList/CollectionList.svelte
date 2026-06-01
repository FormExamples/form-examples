<script lang="ts">
    // CollectionList component
    //
    // A headless `<ul>` that hosts a compact set of related items, such as
    // articles or events. The list semantics come from `<ul>` itself; an
    // optional `aria-label` names the collection for assistive technology.
    // Children are typically `CollectionListItem` components.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, optional. aria-label naming the list.
    //   children — Snippet, required. Collection list items.
    //   ...restProps — additional HTML attributes spread onto the <ul>.
    //
    // Syntax:
    //   <CollectionList label="Latest articles">…</CollectionList>
    //
    // Examples:
    //   <CollectionList label="Events">
    //     <CollectionListItem heading="Open day" />
    //     <CollectionListItem heading="Career fair" />
    //   </CollectionList>
    //
    // Accessibility:
    //   - <ul> conveys list semantics
    //   - Optional aria-label names the collection
    //
    // Internationalization:
    //   - label is consumer-supplied
    //
    // Claude rules:
    //   - Headless: no styles
    //
    // References:
    //   - USWDS Collection: https://designsystem.digital.gov/components/collection/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Optional aria-label naming the list */
        label?: string;
        /** Collection list item children */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CollectionList.svelte -->
<ul
    class={`collection-list ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</ul>
