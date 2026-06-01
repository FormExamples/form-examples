# CollectionList

A compact list of multiple related items such as articles or events. This headless Svelte component renders a `<ul>` with the base class `collection-list`.

## What it is

A headless Svelte 5 component inspired by the U.S. Web Design System (USWDS) Collection component. It is the wrapper used together with `CollectionListItem`. Category: lists.

## What it does

- Renders a `<ul>` with the base class `collection-list` plus consumer `class`.
- Adds an optional `aria-label` to name the collection.
- Spreads `...restProps` onto the `<ul>`.

## When to use it

- A roundup of articles, events, or news posts.
- A directory of related content cards.
- A search-results page where items share the same shape.

## When not to use it

- For tabular data, use `DataTable`.
- For navigation, use `BreadcrumbNav` or `NavigationMenu`.
- For a hierarchical structure, use `TreeList`.

## Props

- `class` — string, default `""`. CSS class appended to `collection-list`.
- `label` — string, optional. Accessible name applied as `aria-label`.
- `children` — `Snippet`, required. Collection list item children.
- `...restProps` — additional HTML attributes spread onto the `<ul>`.

## Usage

```svelte
<script lang="ts">
  import CollectionList from './CollectionList.svelte';
  import CollectionListItem from '../CollectionListItem/CollectionListItem.svelte';
</script>

<CollectionList label="Latest articles">
  <CollectionListItem heading="Article one" href="/a/1" />
  <CollectionListItem heading="Article two" href="/a/2" />
</CollectionList>
```

## Accessibility

- `<ul>` conveys list semantics natively.
- Optional `aria-label` provides a name for the collection when context is unclear.

## Related components

- `CollectionListItem` — one item within the list.
- `IconList` — list with leading icon per item.
- `SummaryList` — key-value pairs.

## References

- USWDS Collection: https://designsystem.digital.gov/components/collection/
