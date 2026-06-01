# ContentsList

A headless ordered list for a table of contents. It renders a semantic `<ol>` and is designed to live inside a `ContentsNav` landmark with `ContentsListItem` children.

## What it is

ContentsList is a thin wrapper that outputs `<ol class="contents-list ...">`. It does not impose any list semantics beyond what `<ol>` provides, and it does not include an `aria-label` (the label belongs on the parent `ContentsNav`).

## What it does

- Renders `<ol>` with a `contents-list` base class.
- Spreads `restProps` onto the `<ol>`.

## When to use it

- Building a table-of-contents structure inside `ContentsNav`.
- Rendering sequential page sections where order is meaningful.

## When not to use it

- For unordered lists — use a plain `<ul>` or `CheckList`.
- For breadcrumb/pagination navigation — use `BreadcrumbList`/`PaginationList`.
- As a standalone list without a nav landmark — use `<ol>` directly.

## How to use it

Place inside `ContentsNav`, with `ContentsListItem` children containing anchor links.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `children` | `Snippet` | required | `ContentsListItem` components. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<ol>`. |

## Usage

```svelte
<script lang="ts">
    import ContentsNav from "../ContentsNav/ContentsNav.svelte";
    import ContentsList from "./ContentsList.svelte";
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
    import ContentsNav from "../ContentsNav/ContentsNav.svelte";
    import ContentsList from "./ContentsList.svelte";
    import ContentsListItem from "../ContentsListItem/ContentsListItem.svelte";

    const sections = [
        { id: "overview", title: "Overview" },
        { id: "install", title: "Install" },
        { id: "api", title: "API" }
    ];
</script>

<ContentsNav label="Contents">
    <ContentsList>
        {#each sections as s (s.id)}
            <ContentsListItem><a href={`#${s.id}`}>{s.title}</a></ContentsListItem>
        {/each}
    </ContentsList>
</ContentsNav>
```

```svelte
<script lang="ts">
    import ContentsNav from "../ContentsNav/ContentsNav.svelte";
    import ContentsList from "./ContentsList.svelte";
    import ContentsListItem from "../ContentsListItem/ContentsListItem.svelte";
</script>

<ContentsNav label="Report contents">
    <ContentsList>
        <ContentsListItem>
            <a href="#results">Results</a>
            <ContentsList>
                <ContentsListItem><a href="#data">Data</a></ContentsListItem>
                <ContentsListItem><a href="#analysis">Analysis</a></ContentsListItem>
            </ContentsList>
        </ContentsListItem>
    </ContentsList>
</ContentsNav>
```

## Accessibility

- The `<ol>` provides implicit list semantics conveying sequential order.
- For assistive tech naming, place this list inside `ContentsNav` which supplies the `<nav aria-label>`.

## Related components

- `ContentsNav` — navigation landmark wrapper.
- `ContentsListItem` — individual entry.
- `ContentsLink` — single link variant.
