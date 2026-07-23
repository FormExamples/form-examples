# PaginationList

A headless pagination list. Renders a semantic `<nav>` wrapping an `<ol>` of pagination items. The component owns the ordered list so consumers only need to provide `PaginationListItem` children.

## What it is

- Component: `PaginationList`
- HTML element: `<nav>` containing `<ol>`
- Role: navigation landmark + ordered list
- Category: navigation list (middle of the PaginationNav → PaginationList → PaginationListItem composition)

## What it does

- Renders `<nav aria-label="…">` as an accessible navigation region.
- Renders an inner `<ol>` so the numeric ordering of pages is semantically preserved.
- Renders its children inside the `<ol>` — typically `PaginationListItem` elements.

## When to use it

- As the list portion of a pagination control, directly inside `PaginationNav` or standalone.
- To render Previous/Next and numbered page items in a semantically ordered list.

## When not to use it

- For hierarchical navigation — use `TreeList`.
- For breadcrumb trails — use `BreadcrumbList`.
- For contents / outline lists — use `ContentsList`.

## How to use it

Wrap items in `PaginationList`; place inside `PaginationNav` for a named landmark.

```svelte
import PaginationList from './PaginationList.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `pagination-list`.
- `label`: string, required. Accessible name for the navigation via `aria-label`.
- `children`: Snippet, required. Pagination list items.
- `...restProps`: spread onto the wrapping `<nav>`.

## Usage

### Inside a PaginationNav

```svelte
<script lang="ts">
  import PaginationNav from '../PaginationNav/PaginationNav.svelte';
  import PaginationList from './PaginationList.svelte';
  import PaginationListItem from '../PaginationListItem/PaginationListItem.svelte';
</script>

<PaginationNav label="Pagination">
  <PaginationList label="Search results">
    <PaginationListItem><a href="/page/1">1</a></PaginationListItem>
    <PaginationListItem><a href="/page/2" aria-current="page">2</a></PaginationListItem>
    <PaginationListItem><a href="/page/3">3</a></PaginationListItem>
  </PaginationList>
</PaginationNav>
```

### Standalone with Previous/Next

```svelte
<script lang="ts">
  import PaginationList from './PaginationList.svelte';
  import PaginationListItem from '../PaginationListItem/PaginationListItem.svelte';
</script>

<PaginationList label="Article pages">
  <PaginationListItem><a href="/article?p=1">Previous</a></PaginationListItem>
  <PaginationListItem><a href="/article?p=2" aria-current="page">2</a></PaginationListItem>
  <PaginationListItem><a href="/article?p=3">Next</a></PaginationListItem>
</PaginationList>
```

### Generated from a range

```svelte
<script lang="ts">
  import PaginationList from './PaginationList.svelte';
  import PaginationListItem from '../PaginationListItem/PaginationListItem.svelte';

  let current = $state(4);
  const total = 10;
</script>

<PaginationList label="Results pages">
  {#each Array.from({ length: total }, (_, i) => i + 1) as n}
    <PaginationListItem>
      <a href={`?p=${n}`} aria-current={n === current ? "page" : undefined}>{n}</a>
    </PaginationListItem>
  {/each}
</PaginationList>
```

### With buttons

```svelte
<script lang="ts">
  import PaginationList from './PaginationList.svelte';
  import PaginationListItem from '../PaginationListItem/PaginationListItem.svelte';

  let page = $state(1);
</script>

<PaginationList label="Pages">
  <PaginationListItem>
    <button type="button" onclick={() => (page = Math.max(1, page - 1))}>Previous</button>
  </PaginationListItem>
  <PaginationListItem>
    <button type="button" onclick={() => (page += 1)}>Next</button>
  </PaginationListItem>
</PaginationList>
```

### With ellipsis indicators

```svelte
<PaginationList label="Pages">
  <PaginationListItem><a href="/p/1">1</a></PaginationListItem>
  <PaginationListItem aria-hidden="true">…</PaginationListItem>
  <PaginationListItem><a href="/p/50" aria-current="page">50</a></PaginationListItem>
</PaginationList>
```

## Accessibility

- The wrapping `<nav aria-label>` creates a navigation landmark. If this list is already inside `PaginationNav`, both are landmarks — prefer distinct labels, or omit nesting if you don't need the inner landmark.
- The inner `<ol>` preserves page ordering for assistive technology.
- Apply `aria-current="page"` on the link for the current page.

## Related components

- `PaginationNav` — the outer navigation landmark for a full pagination region.
- `PaginationListItem` — a single list item inside this list.
- `BreadcrumbList`, `TreeList`, `ContentsList`, `TimelineList` — sibling list containers.

---

Lily™ and Lily Design System™ are trademarks.
