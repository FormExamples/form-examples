# DataTableTD

A column header cell within a `DataTable`. Renders a `<th scope="col">` element, intended to live inside a `DataTableRow` within `DataTableHead`.

## What it is

DataTableTD outputs `<th class="data-table-th ..." scope="col">`, with optional `colspan` and `rowspan` attributes for header grouping.

## What it does

- Renders `<th>` with `scope="col"` by default.
- Applies `colspan` / `rowspan` when set; omits when falsy.
- Accepts an alternative `scope` (e.g. `"colgroup"`).
- Renders header text via `children`.
- Spreads `restProps` onto the `<th>`.

## When to use it

- For column header cells in the header row of a data table.
- For grouped header cells via `colspan` / `rowspan`.

## When not to use it

- For per-cell data — use `DataTableTD`.
- For column-wide styling hooks via `<colgroup>` / `<col>` — write those directly inside `DataTable`.

## How to use it

Place inside a `DataTableRow` within `DataTableHead`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `colspan` | `number` | `undefined` | Number of columns this header cell spans. |
| `rowspan` | `number` | `undefined` | Number of rows this header cell spans. |
| `scope` | `"col" \| "row" \| "colgroup" \| "rowgroup"` | `"col"` | Header scope for assistive tech. |
| `children` | `Snippet` | `undefined` | Header cell content. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<th>`. |

## Usage

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "./DataTableTD.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";
</script>

<DataTable label="Users">
    <DataTableHead>
        <DataTableRow>
            <DataTableTD>Name</DataTableTD>
            <DataTableTD>Email</DataTableTD>
            <DataTableTD>Role</DataTableTD>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableTD>Alice</DataTableTD>
            <DataTableTD>alice@example.com</DataTableTD>
            <DataTableTD>Admin</DataTableTD>
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "./DataTableTD.svelte";
</script>

<!-- Grouped header spanning multiple columns -->
<DataTable label="Sales">
    <DataTableHead>
        <DataTableRow>
            <DataTableTD rowspan={2}>Region</DataTableTD>
            <DataTableTD colspan={2} scope="colgroup">2025</DataTableTD>
        </DataTableRow>
        <DataTableRow>
            <DataTableTD>Q1</DataTableTD>
            <DataTableTD>Q2</DataTableTD>
        </DataTableRow>
    </DataTableHead>
</DataTable>
```

## Accessibility

- `<th scope="col">` associates the header with its column for screen readers.
- Use `scope="colgroup"` together with `colspan` for grouped column headers.

## Related components

- `DataTable`, `DataTableHead`, `DataTableBody` — enclosing components.
- `DataTableRow`, `DataTableTD` — row and cell.
