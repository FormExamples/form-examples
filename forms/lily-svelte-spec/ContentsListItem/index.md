# ContentsListItem

A headless `<li>` for use inside `ContentsList`. It wraps consumer-provided content, typically an anchor link, and supports nesting for hierarchical document structures.

## What it is

ContentsListItem renders a bare `<li>` with spread attributes. It is a minimal structural element intended for use inside `<ol>`/`<ul>` (typically `ContentsList`).

Note: the current source does not apply any base `class` to the `<li>`; the `className` prop is accepted but not applied.

## What it does

- Renders `<li>` with all `restProps` spread onto it.
- Renders children inside the `<li>`.

## When to use it

- Each entry in a table of contents.
- Nested contents entries by placing another `<ol>`/`ContentsList` inside.
- Any list item that should inherit `contents-list` semantics from a parent list.

## When not to use it

- For breadcrumb items — use `BreadcrumbListItem`.
- For pagination items — use `PaginationListItem`.
- For task items — use `CheckListItem` or `TaskListItem`.

## How to use it

Place inside `ContentsList`. Wrap a link inside. Use `aria-current="page"` or `aria-current="true"` to mark the current page.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name (accepted but not applied in current source). |
| `children` | `Snippet` | required | List item content. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<li>`. |

## Usage

```svelte
<script lang="ts">
    import ContentsNav from "../ContentsNav/ContentsNav.svelte";
    import ContentsList from "../ContentsList/ContentsList.svelte";
    import ContentsListItem from "./ContentsListItem.svelte";
</script>

<ContentsNav label="On this page">
    <ContentsList>
        <ContentsListItem><a href="#intro">Introduction</a></ContentsListItem>
        <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
    </ContentsList>
</ContentsNav>
```

```svelte
<script lang="ts">
    import ContentsNav from "../ContentsNav/ContentsNav.svelte";
    import ContentsList from "../ContentsList/ContentsList.svelte";
    import ContentsListItem from "./ContentsListItem.svelte";
</script>

<ContentsNav label="Report">
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

```svelte
<script lang="ts">
    import ContentsNav from "../ContentsNav/ContentsNav.svelte";
    import ContentsList from "../ContentsList/ContentsList.svelte";
    import ContentsListItem from "./ContentsListItem.svelte";

    const currentId = "usage";
</script>

<ContentsNav label="Docs">
    <ContentsList>
        <ContentsListItem aria-current={currentId === "install" ? "true" : undefined}>
            <a href="#install">Install</a>
        </ContentsListItem>
        <ContentsListItem aria-current={currentId === "usage" ? "true" : undefined}>
            <a href="#usage">Usage</a>
        </ContentsListItem>
    </ContentsList>
</ContentsNav>
```

## Accessibility

- Semantic `<li>` provides the `listitem` role when inside a list.
- Apply `aria-current="page"` or `aria-current="true"` on the `<li>` or on the inner anchor to flag the current entry.

## Related components

- `ContentsList` — parent list.
- `ContentsNav` — navigation landmark.
- `ContentsLink` — standalone link variant.
