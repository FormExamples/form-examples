# PaginationNav

A headless navigation landmark for paginated content. Renders a `<nav>` with an accessible label and wraps a `PaginationList` of `PaginationListItem` children for Previous/Next and numbered page links.

## What it is

- Component: `PaginationNav`
- HTML element: `<nav>`
- Role: implicit navigation landmark
- Category: navigation container (top of the PaginationNav → PaginationList → PaginationListItem composition)

## What it does

- Renders a `<nav>` with `aria-label` naming the pagination region.
- Renders its children inside the landmark.
- Provides a named landmark so screen reader users can jump directly to pagination controls.

## When to use it

- Search results pages, listing pages, and data tables with multi-page results.
- Any interface where users navigate across a sequence of pages by link.
- When multiple `<nav>` regions exist on a page and you want each identified by name.

## When not to use it

- For hierarchical navigation — use `TreeNav`.
- For a breadcrumb trail — use `BreadcrumbNav`.
- For an infinite-scroll or virtualized list — no pagination UI is needed.

## How to use it

Compose with `PaginationList` and `PaginationListItem`. Apply `aria-current="page"` to the active page link.

```svelte
import PaginationNav from './PaginationNav.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `pagination-nav`.
- `label`: string, required. Accessible name for the navigation landmark via `aria-label`.
- `children`: Snippet, required. A `PaginationList` element (with items inside).
- `...restProps`: spread onto the `<nav>`.

## Usage

### Full nav composition

```svelte
<script lang="ts">
  import PaginationNav from './PaginationNav.svelte';
  import PaginationList from '../PaginationList/PaginationList.svelte';
  import PaginationListItem from '../PaginationListItem/PaginationListItem.svelte';
</script>

<PaginationNav label="Pagination">
  <PaginationList label="Results pages">
    <PaginationListItem><a href="/page/1">Previous</a></PaginationListItem>
    <PaginationListItem><a href="/page/1">1</a></PaginationListItem>
    <PaginationListItem><a href="/page/2" aria-current="page">2</a></PaginationListItem>
    <PaginationListItem><a href="/page/3">3</a></PaginationListItem>
    <PaginationListItem><a href="/page/3">Next</a></PaginationListItem>
  </PaginationList>
</PaginationNav>
```

### Rendered from data

```svelte
<script lang="ts">
  import PaginationNav from './PaginationNav.svelte';
  import PaginationList from '../PaginationList/PaginationList.svelte';
  import PaginationListItem from '../PaginationListItem/PaginationListItem.svelte';

  let current = $state(2);
  const totalPages = 5;
</script>

<PaginationNav label="Pagination">
  <PaginationList label="Search results">
    {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
      <PaginationListItem>
        <a href={`/page/${page}`} aria-current={page === current ? "page" : undefined}>
          {page}
        </a>
      </PaginationListItem>
    {/each}
  </PaginationList>
</PaginationNav>
```

### With buttons instead of links

```svelte
<script lang="ts">
  import PaginationNav from './PaginationNav.svelte';
  import PaginationList from '../PaginationList/PaginationList.svelte';
  import PaginationListItem from '../PaginationListItem/PaginationListItem.svelte';

  let page = $state(1);
</script>

<PaginationNav label="Pagination">
  <PaginationList label="Report pages">
    <PaginationListItem>
      <button type="button" onclick={() => (page = Math.max(1, page - 1))}>Previous</button>
    </PaginationListItem>
    <PaginationListItem>Page {page}</PaginationListItem>
    <PaginationListItem>
      <button type="button" onclick={() => (page += 1)}>Next</button>
    </PaginationListItem>
  </PaginationList>
</PaginationNav>
```

### Localized labels

```svelte
<PaginationNav label="Paginación">
  <PaginationList label="Páginas de resultados">
    <PaginationListItem><a href="?p=1">Anterior</a></PaginationListItem>
    <PaginationListItem><a href="?p=2" aria-current="page">2</a></PaginationListItem>
    <PaginationListItem><a href="?p=3">Siguiente</a></PaginationListItem>
  </PaginationList>
</PaginationNav>
```

### With ellipsis indicators

```svelte
<PaginationNav label="Pagination">
  <PaginationList label="Pages">
    <PaginationListItem><a href="/page/1">1</a></PaginationListItem>
    <PaginationListItem aria-hidden="true">…</PaginationListItem>
    <PaginationListItem><a href="/page/99" aria-current="page">99</a></PaginationListItem>
    <PaginationListItem><a href="/page/100">100</a></PaginationListItem>
  </PaginationList>
</PaginationNav>
```

## Accessibility

- `<nav aria-label="…">` creates a named landmark that users of assistive technology can jump to directly.
- The consumer must apply `aria-current="page"` on the link representing the active page.
- Tab moves focus through the links; Enter activates.

## Related components

- `PaginationList` — the ordered list rendered inside this nav.
- `PaginationListItem` — a single `<li>` in the list.
- `BreadcrumbNav`, `TreeNav`, `ContentsNav` — other navigation landmarks.

---

Lily™ and Lily Design System™ are trademarks.
