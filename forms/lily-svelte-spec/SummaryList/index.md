# SummaryList

A headless description list for presenting key-value summary data. Renders a semantic `<dl>` with an accessible label.

## What it is

A Svelte 5 headless component that renders `<dl class="summary-list ...">` with `aria-label` and the supplied `children`. Children are typically `SummaryListItem` components (or direct `<dt>` / `<dd>` pairs).

## What it does

- Renders the semantic description-list container.
- Applies the required `aria-label`.
- Spreads `...restProps` onto the `<dl>`.

No layout, no keyboard support, no state.

## When to use it

- Order summaries at checkout.
- Account settings review screens.
- Form confirmation pages.
- Any place with a set of term/definition rows (label / value).

## When not to use it

- Generic vertical lists - use `<ul>` or relevant `List` components.
- Tables of data with multiple columns - use `Table` or `DataTable`.
- Menus of actions - use `Menu` or `DropdownMenu`.

## How to use it

1. Import both `SummaryList` and `SummaryListItem`.
2. Provide a translated `label`.
3. Render one `SummaryListItem` per row, passing `term` and the value in `children`.

## Props

- `class` (string, optional, default `""`) - merged with the base `summary-list` class.
- `label` (string, required) - accessible name via `aria-label`.
- `children` (Snippet, required) - list content (typically `SummaryListItem`s).
- `...restProps` - spread onto `<dl>`.

## Usage

Composition with `SummaryListItem`:

```svelte
<script lang="ts">
    import SummaryList from "./SummaryList.svelte";
    import SummaryListItem from "../SummaryListItem/SummaryListItem.svelte";
</script>

<SummaryList label="Order summary">
    <SummaryListItem term="Product">Widget</SummaryListItem>
    <SummaryListItem term="Quantity">3</SummaryListItem>
    <SummaryListItem term="Total">$29.97</SummaryListItem>
</SummaryList>
```

Plain `<dt>`/`<dd>` children:

```svelte
<script lang="ts">
    import SummaryList from "./SummaryList.svelte";
</script>

<SummaryList label="Account details">
    <dt>Name</dt><dd>Jane Doe</dd>
    <dt>Email</dt><dd>jane@example.com</dd>
</SummaryList>
```

Dynamic rows:

```svelte
<script lang="ts">
    import SummaryList from "./SummaryList.svelte";
    import SummaryListItem from "../SummaryListItem/SummaryListItem.svelte";
    const rows = [
        { term: "Plan", value: "Pro" },
        { term: "Seats", value: "5" },
        { term: "Renewal", value: "2026-06-01" },
    ];
</script>

<SummaryList label="Subscription">
    {#each rows as r}
        <SummaryListItem term={r.term}>{r.value}</SummaryListItem>
    {/each}
</SummaryList>
```

With nested interactive values:

```svelte
<script lang="ts">
    import SummaryList from "./SummaryList.svelte";
    import SummaryListItem from "../SummaryListItem/SummaryListItem.svelte";
</script>

<SummaryList label="Shipping">
    <SummaryListItem term="Address">
        123 Main St
        <button>Edit</button>
    </SummaryListItem>
</SummaryList>
```

With custom class:

```svelte
<script lang="ts">
    import SummaryList from "./SummaryList.svelte";
    import SummaryListItem from "../SummaryListItem/SummaryListItem.svelte";
</script>

<SummaryList label="Invoice" class="stripe-rows">
    <SummaryListItem term="Subtotal">$100.00</SummaryListItem>
    <SummaryListItem term="Tax">$8.25</SummaryListItem>
    <SummaryListItem term="Total">$108.25</SummaryListItem>
</SummaryList>
```

## Accessibility

- `<dl>` is the correct semantic element for term-description pairs.
- `aria-label` adds a descriptive name so screen readers announce the list's purpose.
- `<dt>` and `<dd>` children are announced as term/description by assistive tech.

References:
- MDN `<dl>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl

## Related components

- `SummaryListItem` - the intended row component.
- `DataTable`, `Table` - tabular alternatives.
- `Fieldset` - grouping form fields.

---

Lily™ and Lily Design System™ are trademarks.
