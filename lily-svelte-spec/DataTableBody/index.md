# DataTableBody

The body section of a `DataTable`. Renders a `<tbody>` that contains `DataTableRow` elements with data cells.

## What it is

DataTableBody is a thin structural wrapper outputting `<tbody class="data-table-body ...">`. It is purely semantic — it carries no ARIA or state of its own.

## What it does

- Renders `<tbody>` with a base class.
- Renders children inside.
- Spreads `restProps` onto the `<tbody>`.

## When to use it

- Inside `DataTable`, wrapping body rows containing data cells.

## When not to use it

- For header rows — use `DataTableHead`.
- For summary/footer rows — use `DataTableFoot`.
- For static (non-grid) tables — use `TableBody`.

## How to use it

Place inside `DataTable`, populate with `DataTableRow` children containing `DataTableTD` cells.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `children` | `Snippet` | required | `DataTableRow` elements. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<tbody>`. |

## Usage

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "./DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";
</script>

<DataTable label="Users">
    <DataTableHead>
        <DataTableRow><th scope="col">Name</th></DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow><DataTableTD>Alice</DataTableTD></DataTableRow>
        <DataTableRow><DataTableTD>Bob</DataTableTD></DataTableRow>
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "./DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";

    const rows = [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@example.com" }
    ];
</script>

<DataTable label="Accounts">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        {#each rows as r (r.id)}
            <DataTableRow>
                <DataTableTD>{r.name}</DataTableTD>
                <DataTableTD>{r.email}</DataTableTD>
            </DataTableRow>
        {/each}
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "./DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";
</script>

<DataTable label="Empty state">
    <DataTableHead>
        <DataTableRow><th scope="col">Column</th></DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow><DataTableTD>No results yet.</DataTableTD></DataTableRow>
    </DataTableBody>
</DataTable>
```

## Accessibility

- `<tbody>` carries structural body semantics.
- Grid navigation is handled at the `DataTable` and `DataTableTD` level.

## Related components

- `DataTable` — parent grid.
- `DataTableHead`, `DataTableFoot` — other sections.
- `DataTableRow`, `DataTableTD` — row and cell parts.
