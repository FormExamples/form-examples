# CollectionListItem

One item in a `CollectionList`, with optional image, required heading, optional meta and description, and optional children. This headless Svelte component renders an `<li>`.

## What it is

A headless Svelte 5 component for compact item rows in a collection. Inspired by the USWDS Collection component. Category: lists.

## What it does

- Renders an `<li>` with the base class `collection-list-item` plus consumer `class`.
- Renders an optional thumbnail `<img class="collection-list-item-image">`.
- Renders an `<h3 class="collection-list-item-heading">` containing the heading; when `href` is provided the heading text is wrapped in `<a>`.
- Renders optional `<p class="collection-list-item-meta">` and `<p class="collection-list-item-description">` paragraphs.
- Renders optional `children` after the description for additional body content.
- Spreads `...restProps` onto the `<li>`.

## When to use it

- Inside `CollectionList` for article, event, or directory entries.

## When not to use it

- For navigation links, use `BreadcrumbListItem` or `PaginationListItem`.
- For tabular rows, use `DataTableRow`.

## Props

- `class` — string, default `""`. CSS class appended to `collection-list-item`.
- `heading` — string, **required**. Item heading.
- `meta` — string, optional. Meta line.
- `description` — string, optional. Description body.
- `imageUrl` — string, optional. Thumbnail src.
- `imageAlt` — string, default `""`. Thumbnail alt text.
- `href` — string, optional. When provided, heading text is wrapped in `<a>`.
- `label` — string, optional. `aria-label` override on the `<li>`.
- `children` — `Snippet`, optional. Additional body content.
- `...restProps` — additional HTML attributes spread onto the `<li>`.

## Usage

```svelte
<script lang="ts">
  import CollectionList from '../CollectionList/CollectionList.svelte';
  import CollectionListItem from './CollectionListItem.svelte';
</script>

<CollectionList label="Articles">
  <CollectionListItem
    heading="My article"
    href="/articles/my-article"
    meta="March 2026"
    description="A short summary of the article."
  />
</CollectionList>
```

## Accessibility

- `<li>` participates in the parent `<ul>` list semantics.
- The heading is `<h3>` by default; supply your own heading hierarchy at the page level.
- Provide accurate `imageAlt`. For purely decorative images, pass an empty string.

## Related components

- `CollectionList` — the parent list wrapper.
- `Card` — heavier-weight content container.

## References

- USWDS Collection: https://designsystem.digital.gov/components/collection/
