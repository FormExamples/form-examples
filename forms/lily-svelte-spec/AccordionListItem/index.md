# AccordionListItem

A single expandable disclosure item within an `AccordionList`, built on the native `<details>` element with a bindable `open` state. The consumer supplies the `<summary>` header and body content as children, getting browser-native keyboard and screen-reader behavior for free.

## What it is

A headless Svelte 5 component wrapping `<details>`. It is the leaf of the AccordionNav → AccordionList → AccordionListItem composition. Category: disclosure widget primitive, alongside `Collapsible` and `Details`.

## What it does

- Renders `<details class="accordion-list-item {className}">`.
- Exposes `open` via `$bindable(false)` so consumers can read or write the expanded state through `bind:open`.
- Delegates to the browser for toggle semantics, focus, keyboard handling, and expansion animation hooks.
- Spreads `...restProps` onto the `<details>` element.

## When to use it

- As a child of `AccordionList` inside an `AccordionNav`.
- For FAQ items, expandable settings rows, and single-fold content panels.
- Whenever you want native disclosure semantics without custom JavaScript.

## When not to use it

- For tree navigation with nested branches — use `TreeListItem`.
- For breadcrumb trails — use `BreadcrumbListItem`.
- When you need a fully custom expand/collapse animation tied to ARIA `aria-expanded` on a button — use a `Button` + controlled region instead.

## How to use it

Import `AccordionListItem` from `./AccordionListItem.svelte`. Provide a `<summary>` as the first child (the clickable header) followed by body content. Optionally use `bind:open` to control or observe expanded state.

## Props

- `class` — string, default `""`. CSS class appended to `accordion-list-item`.
- `open` — boolean, default `false`, bindable via `$bindable()`. Whether the disclosure is expanded.
- `children` — `Snippet`, required. A `<summary>` followed by body content.
- `...restProps` — additional HTML attributes spread onto the `<details>` element.

## Usage

### Basic expandable item

```svelte
<script lang="ts">
  import AccordionListItem from './AccordionListItem.svelte';
</script>

<AccordionListItem>
  <summary>What is Svelte?</summary>
  <p>A compiler-based UI framework.</p>
</AccordionListItem>
```

### Pre-expanded with binding

```svelte
<script lang="ts">
  import AccordionListItem from './AccordionListItem.svelte';

  let isOpen = $state(true);
</script>

<AccordionListItem bind:open={isOpen}>
  <summary>Details</summary>
  <p>Expanded content.</p>
</AccordionListItem>

<p>Is open: {isOpen}</p>
```

### Programmatically open from a button

```svelte
<script lang="ts">
  import AccordionListItem from './AccordionListItem.svelte';
  import Button from '../Button/Button.svelte';

  let open = $state(false);
</script>

<Button onclick={() => (open = !open)}>Toggle</Button>
<AccordionListItem bind:open>
  <summary>Advanced options</summary>
  <p>Advanced settings here.</p>
</AccordionListItem>
```

### Full composition inside Nav/List

```svelte
<script lang="ts">
  import AccordionNav from '../AccordionNav/AccordionNav.svelte';
  import AccordionList from '../AccordionList/AccordionList.svelte';
  import AccordionListItem from './AccordionListItem.svelte';
</script>

<AccordionNav label="FAQ">
  <AccordionList label="Questions">
    <AccordionListItem>
      <summary>Q1</summary>
      <p>A1</p>
    </AccordionListItem>
    <AccordionListItem>
      <summary>Q2</summary>
      <p>A2</p>
    </AccordionListItem>
  </AccordionList>
</AccordionNav>
```

## Accessibility

- Native `<details>` provides the disclosure role; screen readers announce the expanded/collapsed state automatically.
- Keyboard: **Tab** reaches `<summary>`; **Enter** and **Space** toggle open/closed — all native behavior.
- No explicit `aria-expanded` is added; the browser maps `<details>` state to assistive technology.
- Focus indicator is consumer-supplied CSS.

## Related components

- `AccordionList` — the `<ol>` wrapper.
- `AccordionNav` — the `<nav>` landmark wrapping the list.
- `Collapsible` — a generic expand/collapse container.
- `Details` — a single disclosure widget outside an accordion context.
- `TreeListItem` — hierarchical expandable tree node.
