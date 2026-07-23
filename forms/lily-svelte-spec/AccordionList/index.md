# AccordionList

A container for `AccordionListItem` children, placed inside an `AccordionNav`. Renders a `<div>` with `role="group"` so assistive technologies perceive the enclosed disclosure widgets as a related set. (A `<div>` is used rather than `<ol>` because each `AccordionListItem` renders `<details>`, which is not a valid child of `<ol>` / `<ul>`.)

## What it is

A headless Svelte 5 compound component that groups a set of collapsible items. It is the middle level of the AccordionNav → AccordionList → AccordionListItem composition pattern, part of the navigation-and-disclosure family alongside `BreadcrumbList`, `ContentsList`, and `TreeList`.

## What it does

- Renders a `<div class="accordion-list {className}">`.
- Applies `role="group"` so grouped disclosure widgets are announced together.
- Maps the optional `label` prop to `aria-label` (emits the attribute only when truthy).
- Spreads any additional HTML attributes onto the `<div>` element.
- Renders children, which are expected to be `AccordionListItem` elements.

## When to use it

- As the direct child of `AccordionNav` to hold a list of `AccordionListItem` disclosures.
- For FAQs, collapsible settings groups, filter panels, and similar grouped disclosure sets.
- Whenever an ordered, grouped set of expand/collapse widgets needs a semantic wrapper.

## When not to use it

- For a single standalone disclosure — use `AccordionListItem` directly or `Collapsible`/`Details`.
- For navigation trails — use `BreadcrumbList` instead.
- For generic bulleted lists — use a plain `<ul>`; this component implies grouped disclosure semantics.
- For hierarchical tree navigation — use `TreeList`.

## How to use it

Import `AccordionList` from `./AccordionList.svelte`. Place it inside an `AccordionNav` and fill it with `AccordionListItem` children. The `children` snippet is required; `label` is optional.

## Props

- `class` — string, default `""`. CSS class appended to the base `accordion-list` class.
- `label` — string, default `""`. Optional accessible name applied via `aria-label` when non-empty.
- `children` — `Snippet`, required. `AccordionListItem` elements.
- `...restProps` — any additional HTML attributes spread onto the `<div>`.

## Usage

### Basic FAQ list

```svelte
<script lang="ts">
  import AccordionNav from '../AccordionNav/AccordionNav.svelte';
  import AccordionList from './AccordionList.svelte';
  import AccordionListItem from '../AccordionListItem/AccordionListItem.svelte';
</script>

<AccordionNav label="FAQ">
  <AccordionList label="Questions">
    <AccordionListItem>
      <summary>What is this?</summary>
      <p>A design system.</p>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

### Multiple grouped items

```svelte
<script lang="ts">
  import AccordionNav from '../AccordionNav/AccordionNav.svelte';
  import AccordionList from './AccordionList.svelte';
  import AccordionListItem from '../AccordionListItem/AccordionListItem.svelte';
</script>

<AccordionNav label="Help Topics">
  <AccordionList label="Account">
    <AccordionListItem>
      <summary>How do I reset my password?</summary>
      <p>Use the password reset link on the login page.</p>
    </AccordionListItem>
    <AccordionListItem>
      <summary>How do I update my email?</summary>
      <p>Go to profile settings.</p>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

### Bound open state on children

```svelte
<script lang="ts">
  import AccordionNav from '../AccordionNav/AccordionNav.svelte';
  import AccordionList from './AccordionList.svelte';
  import AccordionListItem from '../AccordionListItem/AccordionListItem.svelte';

  let firstOpen = $state(true);
</script>

<AccordionNav label="Docs">
  <AccordionList label="Getting started">
    <AccordionListItem bind:open={firstOpen}>
      <summary>Install</summary>
      <p>Instructions...</p>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

### With custom data attributes

```svelte
<AccordionList label="Filters" data-testid="filter-group">
  <AccordionListItem>
    <summary>Category</summary>
    <ul><li>Books</li><li>Games</li></ul>
  </AccordionListItem>
</AccordionList>
```

## Accessibility

- The `<div>` has an explicit `role="group"` so the children are announced as a grouped set.
- `aria-label` names the group when `label` is provided; omitted otherwise.
- Keyboard interaction is handled by `AccordionListItem` children (Tab to reach `<summary>`, Enter/Space to toggle).
- Focus management is native via `<details>/<summary>`.

## Related components

- `AccordionNav` — the outer `<nav>` landmark wrapping this list.
- `AccordionListItem` — the individual disclosure, renders `<details>`.
- `AccordionLink` — a link inside an accordion trail.
- `Collapsible` / `Details` — single-item disclosure widgets.
- `TreeList` — hierarchical expandable list.

---

Lily™ and Lily Design System™ are trademarks.
