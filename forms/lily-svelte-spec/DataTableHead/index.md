# DataTableHead

The header section of a `DataTable`. Renders a `<thead>` containing `DataTableRow` elements with column header cells (typically `<th scope="col">`).

## What it is

DataTableHead is a structural wrapper emitting `<thead class="data-table-head ...">`. It has no state or ARIA of its own.

## What it does

- Renders `<thead>`.
- Renders children inside.
- Spreads `restProps` onto the `<thead>`.

## When to use it

- At the top of a `DataTable` to declare column headers.

## When not to use it

- For body or footer rows — use `DataTableBody` or `DataTableFoot`.
- For static tables — use `TableHead`.

## How to use it

Place inside `DataTable`. Use `<th scope="col">` inside a `DataTableRow` for the actual header cells.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `children` | `Snippet` | required | `DataTableRow` elements with header cells. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<thead>`. |

## Usage

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "./DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";
</script>

<DataTable label="Employees">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableTD>Alice</DataTableTD>
            <DataTableTD>alice@example.com</DataTableTD>
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "./DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";

    const cols = ["Name", "Email", "Role"];
</script>

<DataTable label="Users">
    <DataTableHead>
        <DataTableRow>
            {#each cols as c}
                <th scope="col">{c}</th>
            {/each}
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
    import DataTableHead from "./DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";

    let sortKey = $state("name");

    function sortBy(k: string) {
        sortKey = k;
    }
</script>

<DataTable label="Sortable users">
    <DataTableHead>
        <DataTableRow>
            <th scope="col" aria-sort={sortKey === "name" ? "ascending" : "none"}>
                <button type="button" onclick={() => sortBy("name")}>Name</button>
            </th>
            <th scope="col" aria-sort={sortKey === "email" ? "ascending" : "none"}>
                <button type="button" onclick={() => sortBy("email")}>Email</button>
            </th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableTD>Alice</DataTableTD>
            <DataTableTD>alice@example.com</DataTableTD>
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

## Accessibility

- `<thead>` is the conventional container for column headers.
- Use `<th scope="col">` on each header cell for clear row/column associations.
- Use `aria-sort` on sortable header cells.

## Related components

- `DataTable`, `DataTableBody`, `DataTableFoot`, `DataTableRow`, `DataTableTD`, `DataTableTD`.

---

Lily™ and Lily Design System™ are trademarks.
