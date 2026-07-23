# AccordionNav

A navigation landmark that wraps an accordion (a grouped set of disclosure items). Renders a `<nav>` with a required `aria-label`, giving screen-reader users a named navigation landmark they can jump to.

## What it is

A headless Svelte 5 compound component forming the outermost layer of the AccordionNav → AccordionList → AccordionListItem composition. It is part of the navigation-landmark family alongside `BreadcrumbNav`, `ContentsNav`, `PaginationNav`, and `TreeNav`.

## What it does

- Renders `<nav class="accordion-nav {className}" aria-label={label}>`.
- Publishes the accordion as a navigation landmark named by `label`.
- Spreads additional HTML attributes onto the `<nav>` element.
- Passively contains the accordion; does not implement keyboard behavior itself.

## When to use it

- To expose an accordion as a distinct navigation region (FAQ page, mobile menu, sidebar filter group).
- Whenever you want AT users to find the accordion via landmark navigation.
- As the outer wrapper for `AccordionList` + `AccordionListItem` composition.

## When not to use it

- For non-navigational grouped disclosures that are not a landmark — use a bare `<section>` or `AccordionList` on its own.
- For primary site navigation with links — use `NavigationMenu` or a plain `<nav>` with a `<ul>` of links.
- For breadcrumbs — use `BreadcrumbNav`.

## How to use it

Import `AccordionNav` from `./AccordionNav.svelte`. Always pass a `label`. Provide an `AccordionList` as children.

## Props

- `class` — string, default `""`. CSS class appended to `accordion-nav`.
- `label` — string, required. Accessible name applied via `aria-label`.
- `children` — `Snippet`, required. An `AccordionList` element.
- `...restProps` — additional HTML attributes spread onto the `<nav>`.

## Usage

### FAQ navigation landmark

```svelte
<script lang="ts">
  import AccordionNav from './AccordionNav.svelte';
  import AccordionList from '../AccordionList/AccordionList.svelte';
  import AccordionListItem from '../AccordionListItem/AccordionListItem.svelte';
</script>

<AccordionNav label="Frequently Asked Questions">
  <AccordionList>
    <AccordionListItem>
      <summary>What is this?</summary>
      <p>A design system.</p>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

### Mobile filter menu

```svelte
<script lang="ts">
  import AccordionNav from './AccordionNav.svelte';
  import AccordionList from '../AccordionList/AccordionList.svelte';
  import AccordionListItem from '../AccordionListItem/AccordionListItem.svelte';
</script>

<AccordionNav label="Product filters">
  <AccordionList label="Filter groups">
    <AccordionListItem>
      <summary>Category</summary>
      <ul><li>Books</li><li>Games</li></ul>
    </AccordionListItem>
    <AccordionListItem>
      <summary>Price</summary>
      <input type="range" min="0" max="100" />
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

### With additional attributes

```svelte
<script lang="ts">
  import AccordionNav from './AccordionNav.svelte';
  import AccordionList from '../AccordionList/AccordionList.svelte';
  import AccordionListItem from '../AccordionListItem/AccordionListItem.svelte';
</script>

<AccordionNav label="Docs" id="docs-accordion" data-section="help">
  <AccordionList>
    <AccordionListItem>
      <summary>Getting Started</summary>
      <p>...</p>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

### Multiple accordions on a page (distinct labels)

```svelte
<AccordionNav label="Shipping FAQ">
  <AccordionList>
    <AccordionListItem><summary>Delivery times</summary><p>...</p></AccordionListItem>
  </AccordionList>
</AccordionNav>

<AccordionNav label="Returns FAQ">
  <AccordionList>
    <AccordionListItem><summary>Return policy</summary><p>...</p></AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## Accessibility

- `<nav>` creates a navigation landmark; `aria-label` names it so multiple landmarks on a page stay distinguishable.
- No keyboard handling is added at this level — disclosures inside handle their own Enter/Space.
- Follows the WAI-ARIA Accordion Pattern.

## Related components

- `AccordionList` — required inner `<ol>` group.
- `AccordionListItem` — individual `<details>` disclosure.
- `BreadcrumbNav`, `ContentsNav`, `PaginationNav`, `TreeNav` — sibling navigation landmarks.

---

Lily™ and Lily Design System™ are trademarks.
