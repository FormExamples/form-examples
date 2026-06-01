# DataTableTD

A single data cell in a `DataTableRow`. Renders a `<td role="gridcell">` with optional `active` state (roving tabindex and `aria-selected`).

## What it is

DataTableTD is the interactive grid cell for `DataTable`. It exposes an `active` prop that flips `tabindex` between `0` and `-1` and sets `aria-selected="true"` when active. This supports the standard WAI-ARIA grid roving-focus pattern.

## What it does

- Renders `<td role="gridcell">`.
- `tabindex=0` when `active`, else `-1`.
- `aria-selected="true"` when `active`; omitted otherwise.
- Spreads `restProps` onto the `<td>`.

## When to use it

- Inside `DataTableRow` within a `DataTable`.
- When implementing grid keyboard navigation with roving focus.

## When not to use it

- For static tables with non-interactive cells — use `TableTD`.
- For column header cells — use `<th scope="col">`.

## How to use it

Control `active` from parent state tracking which cell is currently focusable. Only one cell per grid should typically be `active` at a time.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `active` | `boolean` | `false` | Makes the cell focusable and sets `aria-selected`. |
| `children` | `Snippet` | required | Cell content. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<td>`. |

## Usage

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "./DataTableTD.svelte";
</script>

<DataTable label="Simple">
    <DataTableHead>
        <DataTableRow><th scope="col">A</th><th scope="col">B</th></DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableTD>1</DataTableTD>
            <DataTableTD active>2</DataTableTD>
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "./DataTableTD.svelte";

    let row = $state(0);
    let col = $state(0);
    const rows = [
        ["A1", "A2"],
        ["B1", "B2"]
    ];
</script>

<DataTable label="Keyboard grid">
    <DataTableHead>
        <DataTableRow><th scope="col">Col 1</th><th scope="col">Col 2</th></DataTableRow>
    </DataTableHead>
    <DataTableBody>
        {#each rows as r, rIdx}
            <DataTableRow>
                {#each r as cell, cIdx}
                    <DataTableTD active={row === rIdx && col === cIdx}>{cell}</DataTableTD>
                {/each}
            </DataTableRow>
        {/each}
    </DataTableBody>
</DataTable>
```

```svelte
<script lang="ts">
    import DataTable from "../DataTable/DataTable.svelte";
    import DataTableHead from "../DataTableHead/DataTableHead.svelte";
    import DataTableBody from "../DataTableBody/DataTableBody.svelte";
    import DataTableRow from "../DataTableRow/DataTableRow.svelte";
    import DataTableTD from "./DataTableTD.svelte";
</script>

<DataTable label="Product list">
    <DataTableHead>
        <DataTableRow>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
        </DataTableRow>
    </DataTableHead>
    <DataTableBody>
        <DataTableRow>
            <DataTableTD>Widget</DataTableTD>
            <DataTableTD>$1.99</DataTableTD>
        </DataTableRow>
    </DataTableBody>
</DataTable>
```

## Accessibility

- `role="gridcell"` places the cell within the grid widget.
- `aria-selected` and roving `tabindex` communicate the active cell to assistive tech.
- Keyboard navigation (Arrow keys) must be wired at the grid or row level.

## Related components

- `DataTableRow`, `DataTableHead`, `DataTableBody`, `DataTableFoot`, `DataTableTD` — compound parts.
- `DataTable` — enclosing grid.
