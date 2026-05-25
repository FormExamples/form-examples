# BreadcrumbListItem

A single step in a breadcrumb trail. Renders a semantic `<li>`, with `aria-current="page"` applied when `current` is true to indicate the user's location.

## What it is

A headless Svelte 5 component. Category: breadcrumb-trail leaf, part of the BreadcrumbNav → BreadcrumbList → BreadcrumbListItem composition.

## What it does

- Renders `<li class="breadcrumb-list-item {className}" aria-current={current ? "page" : undefined}>`.
- Typically contains an `<a>` for ancestor pages or plain text for the current page.
- Spreads additional HTML attributes onto the `<li>`.

## When to use it

- Inside `BreadcrumbList` to represent each crumb.
- For both navigable ancestors and the current page.

## When not to use it

- Outside a breadcrumb trail — use a plain `<li>` or another list item variant (`ContentsListItem`, `PaginationListItem`).
- For single-screen step trackers — prefer a custom component or `TimelineList`.

## How to use it

Import `BreadcrumbListItem` from `./BreadcrumbListItem.svelte`. Put inside `BreadcrumbList`. Mark the last crumb with `current`.

## Props

- `class` — string, default `""`. CSS class appended to `breadcrumb-list-item`.
- `current` — boolean, default `false`. Sets `aria-current="page"` when true.
- `children` — `Snippet`, required. Crumb content (link or text).
- `...restProps` — additional HTML attributes spread onto the `<li>`.

## Usage

### Navigable ancestor

```svelte
<script lang="ts">
  import BreadcrumbListItem from './BreadcrumbListItem.svelte';
</script>

<BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>
```

### Current page (no link)

```svelte
<script lang="ts">
  import BreadcrumbListItem from './BreadcrumbListItem.svelte';
</script>

<BreadcrumbListItem current>About</BreadcrumbListItem>
```

### Full trail composition

```svelte
<script lang="ts">
  import BreadcrumbNav from '../BreadcrumbNav/BreadcrumbNav.svelte';
  import BreadcrumbList from '../BreadcrumbList/BreadcrumbList.svelte';
  import BreadcrumbListItem from './BreadcrumbListItem.svelte';
</script>

<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    <BreadcrumbListItem><a href="/support">Support</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Contact us</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

### Reactive current flag

```svelte
<script lang="ts">
  import BreadcrumbListItem from './BreadcrumbListItem.svelte';

  let path = $state('/about');
</script>

<BreadcrumbListItem current={path === '/about'}>
  {path === '/about' ? 'About' : <a href="/about">About</a>}
</BreadcrumbListItem>
```

### With data attribute

```svelte
<script lang="ts">
  import BreadcrumbListItem from './BreadcrumbListItem.svelte';
</script>

<BreadcrumbListItem data-depth="2"><a href="/guides">Guides</a></BreadcrumbListItem>
```

## Accessibility

- Implicit `listitem` role from `<li>`.
- `aria-current="page"` announces the current location; only applied when `current` is true.
- Keyboard interaction comes from contained links.

## Related components

- `BreadcrumbNav` — outer `<nav>`.
- `BreadcrumbList` — `<ol>` wrapper.
- `BreadcrumbLink` — styled link for breadcrumbs.
- `PaginationListItem`, `ContentsListItem`, `TreeListItem` — sibling list items.
