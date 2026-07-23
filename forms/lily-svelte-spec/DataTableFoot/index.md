# DataTableFoot

The footer section of a `DataTable`. Renders a `<tfoot>` containing summary or aggregate rows.

## What it is

DataTableFoot is a structural wrapper emitting `<tfoot class="data-table-foot ...">`. It has no state and no ARIA of its own.

## What it does

- Renders `<tfoot>`.
- Renders children inside.
- Spreads `restProps` onto the `<tfoot>`.

## When to use it

- Showing totals, aggregates, or summary rows at the bottom of a `DataTable`.

## When not to use it

- For header rows — use `DataTableHead`.
- For regular data rows — use `DataTableBody`.

## How to use it

Place inside `DataTable`, after `DataTableBody`. Populate with `DataTableRow` children.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `children` | `Snippet` | required | Footer rows. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<tfoot>`. |

## Usage

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableFoot from "./DataTableFoot.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";
</script>

<DataTable label="Budget">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Item</th>
            <th scope="col">Amount</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableTD>Travel</DataTableTD>
            <DataTableTD>$1,200</DataTableTD>
        </DataTableRow>
        <DataTableRow>
            <DataTableTD>Lodging</DataTableTD>
            <DataTableTD>$800</DataTableTD>
        </DataTableRow>
    </DataTableBody>
    <DataTableFoot>
        <DataTableRow>
            <DataTableTD>Total</DataTableTD>
            <DataTableTD>$2,000</DataTableTD>
        </DataTableRow>
    </DataTableFoot>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableFoot from "./DataTableFoot.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";

    const lines = [
        { label: "A", amount: 10 },
        { label: "B", amount: 20 },
        { label: "C", amount: 30 }
    ];
    const total = lines.reduce((s, l) => s + l.amount, 0);
</script>

<DataTable label="Totals">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Label</th>
            <th scope="col">Amount</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        {#each lines as l}
            <DataTableRow>
                <DataTableTD>{l.label}</DataTableTD>
                <DataTableTD>{l.amount}</DataTableTD>
            </DataTableRow>
        {/each}
    </DataTableBody>
    <DataTableFoot>
        <DataTableRow>
            <DataTableTD>Sum</DataTableTD>
            <DataTableTD>{total}</DataTableTD>
        </DataTableRow>
    </DataTableFoot>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableFoot from "./DataTableFoot.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "../DataTableTD/DataTableTD.svelte";
</script>

<DataTable label="With empty foot">
    <DataTableHead>
        <DataTableRow><th scope="col">X</th></DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow><DataTableTD>1</DataTableTD></DataTableRow>
    </DataTableBody>
    <DataTableFoot>
        <DataTableRow><DataTableTD>—</DataTableTD></DataTableRow>
    </DataTableFoot>
</DataTable>
```

## Accessibility

- `<tfoot>` adds structural footer semantics.

## Related components

- `DataTable`, `DataTableHead`, `DataTableBody`, `DataTableRow`, `DataTableTD`.

---

Lily™ and Lily Design System™ are trademarks.
