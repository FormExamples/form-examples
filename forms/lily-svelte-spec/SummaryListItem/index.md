# SummaryListItem

A single term/value row inside a `SummaryList`. Renders a `<div>` wrapper containing a `<dt>` and a `<dd>`.

## What it is

A Svelte 5 headless component that renders:

```html
<div class="summary-list-item ...">
  <dt>{term}</dt>
  <dd><!-- children --></dd>
</div>
```

The HTML spec permits `<div>` as a direct child of `<dl>` for grouping paired `<dt>`/`<dd>`, which enables per-row styling and attribute targeting without breaking list semantics.

## What it does

- Renders a `<div>` wrapper that groups one `<dt>` and one `<dd>`.
- The `term` prop is rendered as the text content of `<dt>`.
- The `children` snippet is rendered inside the `<dd>` (arbitrary markup allowed).
- Spreads `...restProps` onto the `<div>` wrapper.

## When to use it

- As the child of `SummaryList` to build key/value review or summary rows.
- When you want to target individual rows with CSS or data attributes.

## When not to use it

- For nested/hierarchical data - use `TreeList`.
- For multi-column tabular data - use `DataTable` or `Table`.
- Outside a `<dl>` - this produces invalid HTML if not wrapped in a description list.

## How to use it

1. Import alongside `SummaryList`.
2. Pass the key in `term`.
3. Put the value in `children`.

## Props

- `class` (string, optional, default `""`) - merged with the base `summary-list-item` class.
- `term` (string, required) - text rendered in the `<dt>`.
- `children` (Snippet, required) - value rendered in the `<dd>`.
- `...restProps` - spread onto the wrapper `<div>`.

## Usage

Composition:

```svelte
<script lang="ts">
    import SummaryList from "../SummaryList/SummaryList.svelte";
    import SummaryListItem from "./SummaryListItem.svelte";
</script>

<SummaryList label="Order summary">
    <SummaryListItem term="Product">Widget</SummaryListItem>
    <SummaryListItem term="Quantity">3</SummaryListItem>
    <SummaryListItem term="Total">$29.97</SummaryListItem>
</SummaryList>
```

With interactive content in the value:

```svelte
<script lang="ts">
    import SummaryList from "../SummaryList/SummaryList.svelte";
    import SummaryListItem from "./SummaryListItem.svelte";
</script>

<SummaryList label="Account">
    <SummaryListItem term="Email">
        jane@example.com <button>Edit</button>
    </SummaryListItem>
</SummaryList>
```

With extra attributes on the wrapper:

```svelte
<script lang="ts">
    import SummaryList from "../SummaryList/SummaryList.svelte";
    import SummaryListItem from "./SummaryListItem.svelte";
</script>

<SummaryList label="Report">
    <SummaryListItem term="Status" data-status="ok">OK</SummaryListItem>
    <SummaryListItem term="Uptime" data-status="warn">98.2%</SummaryListItem>
</SummaryList>
```

Mixed list with plain `<dt>`/`<dd>` siblings:

```svelte
<script lang="ts">
    import SummaryList from "../SummaryList/SummaryList.svelte";
    import SummaryListItem from "./SummaryListItem.svelte";
</script>

<SummaryList label="Mixed">
    <SummaryListItem term="Name">Jane</SummaryListItem>
    <dt>Raw term</dt>
    <dd>Raw value</dd>
</SummaryList>
```

Dynamic rows:

```svelte
<script lang="ts">
    import SummaryList from "../SummaryList/SummaryList.svelte";
    import SummaryListItem from "./SummaryListItem.svelte";
    const rows = [{ k: "A", v: "1" }, { k: "B", v: "2" }];
</script>

<SummaryList label="Data">
    {#each rows as r}
        <SummaryListItem term={r.k}>{r.v}</SummaryListItem>
    {/each}
</SummaryList>
```

## Accessibility

- `<dt>`/`<dd>` are correctly announced as term/description by assistive tech, even wrapped in a `<div>`.
- The `<div>` wrapper is transparent to accessibility.
- Must appear inside a `<dl>` for valid HTML.

References:
- HTML spec - `<div>` in `<dl>`: https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element

## Related components

- `SummaryList` - the required parent.
- `Field` - form field wrapper with label.
- `DataTable`, `Table` - tabular alternatives.

---

Lily™ and Lily Design System™ are trademarks.
