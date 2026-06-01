# BreadcrumbNav

A navigation landmark for a breadcrumb trail that shows the user's current position within the site hierarchy. Renders a `<nav>` with a required `aria-label`.

## What it is

A headless Svelte 5 compound component. Category: navigation-landmark primitive, sibling of `AccordionNav`, `ContentsNav`, `PaginationNav`, and `TreeNav`.

## What it does

- Renders `<nav class="breadcrumb-nav {className}" aria-label={label}>`.
- Provides the navigation landmark name so AT users can jump to the trail via landmark menus.
- Spreads additional HTML attributes onto the `<nav>`.

## When to use it

- At the top of any page with a hierarchical site structure.
- For e-commerce, documentation, CMSes, and deeply nested sections.

## When not to use it

- For primary site-wide navigation — use `NavigationMenu` or a plain `<nav>` with a `<ul>` of links.
- For one-step back navigation — use `BackLink`.
- For pagination trails — use `PaginationNav`.

## How to use it

Import `BreadcrumbNav` from `./BreadcrumbNav.svelte`. Always pass `label`. Wrap a `BreadcrumbList` inside.

## Props

- `class` — string, default `""`. CSS class appended to `breadcrumb-nav`.
- `label` — string, required. Accessible name via `aria-label`.
- `children` — `Snippet`, required. A `BreadcrumbList`.
- `...restProps` — additional HTML attributes spread onto the `<nav>`.

## Usage

### Standard trail

```svelte
<script lang="ts">
  import BreadcrumbNav from './BreadcrumbNav.svelte';
  import BreadcrumbList from '../BreadcrumbList/BreadcrumbList.svelte';
  import BreadcrumbListItem from '../BreadcrumbListItem/BreadcrumbListItem.svelte';
</script>

<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    <BreadcrumbListItem><a href="/shop">Shop</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Widget</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

### Localized label

```svelte
<script lang="ts">
  import BreadcrumbNav from './BreadcrumbNav.svelte';
  import BreadcrumbList from '../BreadcrumbList/BreadcrumbList.svelte';
  import BreadcrumbListItem from '../BreadcrumbListItem/BreadcrumbListItem.svelte';

  const label = 'Chemin de navigation';
</script>

<BreadcrumbNav {label}>
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Accueil</a></BreadcrumbListItem>
    <BreadcrumbListItem current>À propos</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

### Inside a page header

```svelte
<script lang="ts">
  import BreadcrumbNav from './BreadcrumbNav.svelte';
  import BreadcrumbList from '../BreadcrumbList/BreadcrumbList.svelte';
  import BreadcrumbListItem from '../BreadcrumbListItem/BreadcrumbListItem.svelte';
</script>

<header>
  <BreadcrumbNav label="You are here">
    <BreadcrumbList>
      <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
      <BreadcrumbListItem current>Dashboard</BreadcrumbListItem>
    </BreadcrumbList>
  </BreadcrumbNav>
  <h1>Dashboard</h1>
</header>
```

### With data hooks

```svelte
<script lang="ts">
  import BreadcrumbNav from './BreadcrumbNav.svelte';
  import BreadcrumbList from '../BreadcrumbList/BreadcrumbList.svelte';
  import BreadcrumbListItem from '../BreadcrumbListItem/BreadcrumbListItem.svelte';
</script>

<BreadcrumbNav label="Breadcrumb" data-testid="bc" id="page-breadcrumbs">
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Contact</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

### Nested inside an app frame

```svelte
<script lang="ts">
  import BreadcrumbNav from './BreadcrumbNav.svelte';
  import BreadcrumbList from '../BreadcrumbList/BreadcrumbList.svelte';
  import BreadcrumbListItem from '../BreadcrumbListItem/BreadcrumbListItem.svelte';
</script>

<main>
  <BreadcrumbNav label="Admin breadcrumb">
    <BreadcrumbList>
      <BreadcrumbListItem><a href="/admin">Admin</a></BreadcrumbListItem>
      <BreadcrumbListItem><a href="/admin/users">Users</a></BreadcrumbListItem>
      <BreadcrumbListItem current>Edit user</BreadcrumbListItem>
    </BreadcrumbList>
  </BreadcrumbNav>
</main>
```

## Accessibility

- `<nav>` with `aria-label` gives the trail a distinct landmark.
- If a page has multiple breadcrumb navs (rare), differentiate them with unique labels.
- Keyboard: native Tab through links.
- Screen readers announce "Breadcrumb, navigation" (or the localized label).

## Related components

- `BreadcrumbList`, `BreadcrumbListItem`, `BreadcrumbLink` — trail children.
- `BackLink` — one-step back navigation.
- `AccordionNav`, `ContentsNav`, `PaginationNav`, `TreeNav` — sibling landmarks.
- `NavigationMenu` — primary site navigation.
