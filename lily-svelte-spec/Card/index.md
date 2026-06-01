# Card

A headless card component that groups related content into a self-contained semantic `<article>` element with an optional configurable heading (h2-h6), an optional link on the heading, and a landmark label. Commonly used for product listings, user profiles, article previews, and dashboard widgets.

## What it is

Card is a headless Svelte 5 component that renders an `<article>` element wrapping user-provided content. When a `heading` prop is supplied, Card emits a heading tag matching the chosen `headingLevel` (2-6), optionally wrapped in an `<a>` when `href` is provided. An optional `label` prop applies `aria-label` so the article can be identified as a named landmark.

## What it does

- Renders content inside an `<article>` element.
- Renders an optional heading element at levels 2-6.
- Optionally wraps the heading text in an anchor.
- Optionally applies an `aria-label` to identify the article as a landmark.
- Spreads all additional props onto the `<article>`.

## When to use it

- Grouping self-contained, distributable content such as product tiles, blog summaries, profile cards, or dashboard tiles.
- Presenting a uniform set of items in a grid or list where each item represents a single unit of information.
- When you want the card heading to link to a detail page.

## When not to use it

- For purely presentational groupings with no semantic meaning — use a `<div>` directly.
- For modal dialogs, page headers, banners, or hero sections — use the dedicated components for those roles.
- When a card's title is not a real heading in the document outline — pass content via `children` without the `heading` prop.

## How to use it

Import the component and pass content through `children`. Use `heading` and `headingLevel` to add a heading matching the page outline, and `href` to make the heading a link.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `heading` | `string` | `undefined` | Heading text rendered inside the article. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `3` | HTML heading level for the heading. |
| `href` | `string` | `undefined` | When set, wraps the heading text in an `<a>`. |
| `label` | `string` | `undefined` | `aria-label` for the `<article>` landmark. |
| `children` | `Snippet` | required | Card body content. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<article>`. |

## Usage

```svelte
<script lang="ts">
    import Card from "./Card.svelte";
</script>

<Card>
    <h3>Plain card</h3>
    <p>Body content.</p>
</Card>
```

```svelte
<script lang="ts">
    import Card from "./Card.svelte";
</script>

<Card heading="Product name" href="/products/1">
    <p>Product description</p>
</Card>
```

```svelte
<script lang="ts">
    import Card from "./Card.svelte";
</script>

<Card heading="Dashboard" headingLevel={2} label="Sales dashboard">
    <p>Revenue metrics for Q1.</p>
</Card>
```

```svelte
<script lang="ts">
    import Card from "./Card.svelte";

    let items = $state([
        { id: 1, title: "One", body: "First" },
        { id: 2, title: "Two", body: "Second" }
    ]);
</script>

{#each items as item (item.id)}
    <Card heading={item.title} href={`/items/${item.id}`}>
        <p>{item.body}</p>
    </Card>
{/each}
```

```svelte
<script lang="ts">
    import Card from "./Card.svelte";
</script>

<Card heading="User profile" headingLevel={4}>
    <p>Name: Alice</p>
    <p>Role: Administrator</p>
</Card>
```

## Accessibility

- The `<article>` element provides an implicit `article` role.
- The optional `aria-label` identifies the card as a named landmark for screen readers.
- The heading contributes to the document outline at the specified level; choose a level that matches the card's place in the page hierarchy.
- When `href` is provided, the heading link is keyboard focusable (Tab) and activatable with Enter.

## Related components

- `CareCard` — medical care variant with urgency levels.
- `Alert`, `Banner` — for prominent page-level messages rather than grouped content.
- `Hero`, `Tile` — for larger feature presentations.
