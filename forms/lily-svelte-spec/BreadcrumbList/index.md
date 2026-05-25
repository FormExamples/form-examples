# BreadcrumbList

An ordered list of breadcrumb items forming the trail. Renders a semantic `<ol>` inside a `BreadcrumbNav`. Although AGENTS.md associates `list` components generally with `<ol>`, this component is specifically the trail's ordered list and expects `BreadcrumbListItem` children.

## What it is

A headless Svelte 5 compound component. Category: navigation list primitive, part of the BreadcrumbNav → BreadcrumbList → BreadcrumbListItem composition; sibling of `ContentsList`, `PaginationList`, `TreeList`.

## What it does

- Renders `<ol class="breadcrumb-list {className}">`.
- Spreads additional HTML attributes onto the `<ol>`.
- Separator characters between items (e.g. `"/"`, `">"`) are consumer-supplied.

## When to use it

- Inside `BreadcrumbNav` to hold breadcrumb items.
- Wherever you need a strictly ordered visual trail of ancestors.

## When not to use it

- For non-breadcrumb ordered lists — use a plain `<ol>`.
- For pagination — use `PaginationList`.
- For hierarchical tree navigation — use `TreeList`.

## How to use it

Import `BreadcrumbList` from `./BreadcrumbList.svelte`. Place inside `BreadcrumbNav`. Fill with `BreadcrumbListItem` children.

## Props

- `class` — string, default `""`. CSS class appended to `breadcrumb-list`.
- `children` — `Snippet`, required. `BreadcrumbListItem` elements.
- `...restProps` — additional HTML attributes spread onto the `<ol>`.

## Usage

### Basic trail

```svelte
<script lang="ts">
  import BreadcrumbNav from '../BreadcrumbNav/BreadcrumbNav.svelte';
  import BreadcrumbList from './BreadcrumbList.svelte';
  import BreadcrumbListItem from '../BreadcrumbListItem/BreadcrumbListItem.svelte';
</script>

<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
    <BreadcrumbListItem><a href="/products">Products</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Widget</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

### With CSS-supplied separators

```svelte
<script lang="ts">
  import BreadcrumbNav from '../BreadcrumbNav/BreadcrumbNav.svelte';
  import BreadcrumbList from './BreadcrumbList.svelte';
  import BreadcrumbListItem from '../BreadcrumbListItem/BreadcrumbListItem.svelte';
</script>

<BreadcrumbNav label="Docs">
  <BreadcrumbList data-separator="/">
    <BreadcrumbListItem><a href="/docs">Docs</a></BreadcrumbListItem>
    <BreadcrumbListItem><a href="/docs/guides">Guides</a></BreadcrumbListItem>
    <BreadcrumbListItem current>Installation</BreadcrumbListItem>
  </BreadcrumbList>
</BreadcrumbNav>
```

### Dynamic trail from data

```svelte
<script lang="ts">
  import BreadcrumbNav from '../BreadcrumbNav/BreadcrumbNav.svelte';
  import BreadcrumbList from './BreadcrumbList.svelte';
  import BreadcrumbListItem from '../BreadcrumbListItem/BreadcrumbListItem.svelte';

  let trail = $state([
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { label: 'Books' }
  ]);
</script>

<BreadcrumbNav label="Shop">
  <BreadcrumbList>
    {#each trail as crumb, i}
      <BreadcrumbListItem current={i === trail.length - 1}>
        {#if crumb.href}
          <a href={crumb.href}>{crumb.label}</a>
        {:else}
          {crumb.label}
        {/if}
      </BreadcrumbListItem>
    {/each}
  </BreadcrumbList>
</BreadcrumbNav>
```

### Inside an app shell

```svelte
<script lang="ts">
  import BreadcrumbNav from '../BreadcrumbNav/BreadcrumbNav.svelte';
  import BreadcrumbList from './BreadcrumbList.svelte';
  import BreadcrumbListItem from '../BreadcrumbListItem/BreadcrumbListItem.svelte';
</script>

<header>
  <BreadcrumbNav label="You are here">
    <BreadcrumbList>
      <BreadcrumbListItem><a href="/">Home</a></BreadcrumbListItem>
      <BreadcrumbListItem current>Dashboard</BreadcrumbListItem>
    </BreadcrumbList>
  </BreadcrumbNav>
</header>
```

## Accessibility

- `<ol>` conveys order semantics; screen readers announce item counts.
- No ARIA role override; implicit list semantics are sufficient inside a named `<nav>`.
- Keyboard: Tab/Enter handled by links inside items.
- Supply visual separators via CSS pseudo-content so AT doesn't read them.

## Related components

- `BreadcrumbNav` — outer `<nav>` landmark.
- `BreadcrumbListItem` — individual `<li>` in the trail.
- `BreadcrumbLink` — anchor styled for breadcrumbs.
- `PaginationList`, `TreeList`, `ContentsList` — sibling list types.
