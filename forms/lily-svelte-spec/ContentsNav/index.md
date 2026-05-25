# ContentsNav

A headless navigation landmark for a table of contents. It renders a semantic `<nav aria-label>` that wraps a `ContentsList` of `ContentsListItem` entries.

## What it is

ContentsNav is a Svelte 5 component that emits `<nav class="contents-nav ..." aria-label={label}>`. It does not render the list itself; compose it with `ContentsList` and `ContentsListItem` children.

## What it does

- Renders `<nav aria-label={label}>`.
- Renders children inside the nav.
- Spreads `restProps` onto the `<nav>`.

## When to use it

- At the top of documentation pages, articles, or long forms as an on-page jump list.
- Anywhere a distinct "Contents" landmark is useful for keyboard and screen-reader navigation.

## When not to use it

- For site-wide navigation — use `NavigationMenu`.
- For breadcrumbs — use `BreadcrumbNav`.
- For pagination — use `PaginationNav`.

## How to use it

Wrap a `ContentsList` that contains `ContentsListItem`s, each containing an anchor link.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | Accessible name (e.g. "Contents"). |
| `children` | `Snippet` | required | Typically a `ContentsList`. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<nav>`. |

## Usage

```svelte
<script lang="ts">
    import ContentsNav from "./ContentsNav.svelte";
    import ContentsList from "../ContentsList/ContentsList.svelte";
    import ContentsListItem from "../ContentsListItem/ContentsListItem.svelte";
</script>

<ContentsNav label="On this page">
    <ContentsList>
        <ContentsListItem><a href="#introduction">Introduction</a></ContentsListItem>
        <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
        <ContentsListItem><a href="#examples">Examples</a></ContentsListItem>
    </ContentsList>
</ContentsNav>
```

```svelte
<script lang="ts">
    import ContentsNav from "./ContentsNav.svelte";
    import ContentsList from "../ContentsList/ContentsList.svelte";
    import ContentsListItem from "../ContentsListItem/ContentsListItem.svelte";

    const sections = [
        { id: "purpose", title: "Purpose" },
        { id: "scope", title: "Scope" },
        { id: "results", title: "Results" }
    ];
</script>

<ContentsNav label="Report contents">
    <ContentsList>
        {#each sections as s (s.id)}
            <ContentsListItem><a href={`#${s.id}`}>{s.title}</a></ContentsListItem>
        {/each}
    </ContentsList>
</ContentsNav>
```

```svelte
<script lang="ts">
    import ContentsNav from "./ContentsNav.svelte";
    import ContentsList from "../ContentsList/ContentsList.svelte";
    import ContentsListItem from "../ContentsListItem/ContentsListItem.svelte";
</script>

<ContentsNav label="Table of contents">
    <ContentsList>
        <ContentsListItem>
            <a href="#one">Chapter 1</a>
            <ContentsList>
                <ContentsListItem><a href="#one-a">1.a. Setup</a></ContentsListItem>
                <ContentsListItem><a href="#one-b">1.b. Running</a></ContentsListItem>
            </ContentsList>
        </ContentsListItem>
        <ContentsListItem><a href="#two">Chapter 2</a></ContentsListItem>
    </ContentsList>
</ContentsNav>
```

## Accessibility

- `<nav>` is a navigation landmark; `aria-label` distinguishes it from other nav landmarks.
- Keyboard navigation is provided by the inner anchor links.

## Related components

- `ContentsList` — ordered list inside this nav.
- `ContentsListItem` — individual entries.
- `BreadcrumbNav`, `PaginationNav`, `TreeNav` — other navigation variants.
