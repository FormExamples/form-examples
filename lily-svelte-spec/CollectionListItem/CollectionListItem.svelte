<script lang="ts">
    // CollectionListItem component
    //
    // A headless `<li>` that represents one entry in a `CollectionList`. Provides
    // optional thumbnail image, REQUIRED heading, optional meta line and
    // description, and optional children for additional body content. When
    // `href` is provided the heading text becomes a link.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   heading — string, REQUIRED. The item heading text.
    //   meta — string, optional. Meta line such as date or category.
    //   description — string, optional. Body description text.
    //   imageUrl — string, optional. Thumbnail src.
    //   imageAlt — string, optional. Thumbnail alt text.
    //   href — string, optional. When set, heading is wrapped in <a>.
    //   label — string, optional. aria-label override on the <li>.
    //   children — Snippet, optional. Additional body content.
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <CollectionListItem heading="Title" href="/x" meta="Mar 2026" />
    //
    // Accessibility:
    //   - <li> participates in <ul> list semantics
    //   - Image must have alt text supplied by the consumer (empty string for decorative)
    //   - Heading is an <h3>; consumer adjusts heading level via consumer CSS or wrapping context
    //
    // Internationalization:
    //   - All strings are consumer-supplied
    //
    // Claude rules:
    //   - Headless: no styles
    //   - heading is REQUIRED
    //   - href makes the heading a link

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        heading,
        meta = undefined,
        description = undefined,
        imageUrl = undefined,
        imageAlt = "",
        href = undefined,
        label = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Item heading (REQUIRED) */
        heading: string;
        /** Optional meta line, e.g. date or category */
        meta?: string;
        /** Optional description body text */
        description?: string;
        /** Optional thumbnail image src */
        imageUrl?: string;
        /** Optional thumbnail alt text */
        imageAlt?: string;
        /** Optional href: wraps heading in <a> when provided */
        href?: string;
        /** Optional aria-label override */
        label?: string;
        /** Optional additional body content */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- CollectionListItem.svelte -->
<li
    class={`collection-list-item ${className}`}
    aria-label={label}
    {...restProps}
>
    {#if imageUrl}
        <img
            class="collection-list-item-image"
            src={imageUrl}
            alt={imageAlt}
        />
    {/if}
    <h3 class="collection-list-item-heading">
        {#if href}
            <a href={href}>{heading}</a>
        {:else}
            {heading}
        {/if}
    </h3>
    {#if meta}
        <p class="collection-list-item-meta">{meta}</p>
    {/if}
    {#if description}
        <p class="collection-list-item-description">{description}</p>
    {/if}
    {#if children}
        {@render children?.()}
    {/if}
</li>
