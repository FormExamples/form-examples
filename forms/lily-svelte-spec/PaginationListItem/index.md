# PaginationListItem

A headless `<li>` for a single entry within a `PaginationList`. Holds a page link, Previous/Next control, or ellipsis indicator.

## What it is

- Component: `PaginationListItem`
- HTML element: `<li>`
- Role: implicit `listitem`
- Category: navigation list item (leaf of the PaginationNav → PaginationList → PaginationListItem composition)

## What it does

- Renders a semantic `<li>` wrapper.
- Renders arbitrary children (typically `<a>` or `<button>`) inside.
- Forwards all additional HTML attributes onto the `<li>`.

## When to use it

- For each page-link or control entry inside a `PaginationList`.
- For ellipsis indicators in long page runs (e.g. `1 … 50`).

## When not to use it

- For breadcrumb trails — use `BreadcrumbListItem`.
- For hierarchical navigation — use `TreeListItem`.
- For ordinary content lists — use a native `<li>` or `SummaryListItem`.

## How to use it

Place inside a `PaginationList`. Put the clickable link or button (or ellipsis text) inside.

```svelte
import PaginationListItem from './PaginationListItem.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `pagination-list-item`.
- `children`: Snippet, required. The item content — a link, button, or text.
- `...restProps`: spread onto the `<li>` (e.g. `aria-hidden`, `data-*`).

## Usage

### Basic page-number link

```svelte
<script lang="ts">
  import PaginationListItem from './PaginationListItem.svelte';
</script>

<PaginationListItem>
  <a href="/page/1">1</a>
</PaginationListItem>
```

### Current page with `aria-current`

```svelte
<script lang="ts">
  import PaginationListItem from './PaginationListItem.svelte';
</script>

<PaginationListItem>
  <a href="/page/2" aria-current="page">2</a>
</PaginationListItem>
```

### Previous / Next controls

```svelte
<script lang="ts">
  import PaginationList from '../PaginationList/PaginationList.svelte';
  import PaginationListItem from './PaginationListItem.svelte';
</script>

<PaginationList label="Pages">
  <PaginationListItem><a href="/page/1" rel="prev">Previous</a></PaginationListItem>
  <PaginationListItem><a href="/page/3" rel="next">Next</a></PaginationListItem>
</PaginationList>
```

### Ellipsis between page groups

```svelte
<script lang="ts">
  import PaginationListItem from './PaginationListItem.svelte';
</script>

<PaginationListItem aria-hidden="true">…</PaginationListItem>
```

### Inside the full PaginationNav composition

```svelte
<script lang="ts">
  import PaginationNav from '../PaginationNav/PaginationNav.svelte';
  import PaginationList from '../PaginationList/PaginationList.svelte';
  import PaginationListItem from './PaginationListItem.svelte';
</script>

<PaginationNav label="Pagination">
  <PaginationList label="Pages">
    <PaginationListItem><a href="/p/1">1</a></PaginationListItem>
    <PaginationListItem><a href="/p/2" aria-current="page">2</a></PaginationListItem>
    <PaginationListItem><a href="/p/3">3</a></PaginationListItem>
  </PaginationList>
</PaginationNav>
```

## Accessibility

- `<li>` provides implicit `listitem` semantics inside the parent `<ol>`.
- Apply `aria-current="page"` on the link for the active page.
- Use `aria-hidden="true"` on purely decorative ellipsis items so they are not announced.

## Related components

- `PaginationNav`, `PaginationList` — navigation landmark and list containers.
- `BreadcrumbListItem`, `TreeListItem`, `ContentsListItem` — sibling list-item components.
