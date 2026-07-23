# KanbanTableTD

A column header cell within a `KanbanTable`. Renders a `<th scope="col">` element, intended to live inside a `KanbanTableRow` within `KanbanTableHead`, where it labels a workflow stage column.

## What it is

A headless Svelte 5 wrapper around `<th>` with `scope="col"` and optional `colspan` / `rowspan`. It carries the base class `kanban-table-th`.

## What it does

- Renders `<th class="kanban-table-th ..." scope="col">`.
- Applies `colspan` / `rowspan` only when truthy.
- Accepts an alternative `scope` (e.g. `"colgroup"`).
- Renders header text via `children`.
- Spreads `...restProps` onto the `<th>`.

## When to use it

- For workflow-stage column headers ("To do", "In progress", "Done").
- For grouped header cells via `colspan` / `rowspan`.

## When not to use it

- For task data cells — use `KanbanTableTD`.
- For row headers — use a `<th scope="row">` directly inside `KanbanTableRow`.
- For column-wide styling hooks via `<colgroup>` / `<col>` — write those directly inside `KanbanTable`.

## How to use it

Place `KanbanTableTD` elements inside a `KanbanTableRow` within `KanbanTableHead`, one per workflow stage.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `kanban-table-th` class.
- `colspan` (number, optional) — number of columns this header spans.
- `rowspan` (number, optional) — number of rows this header spans.
- `scope` (`"col" | "row" | "colgroup" | "rowgroup"`, default `"col"`).
- `children` (Snippet, optional) — header cell content.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<th>`.

## Usage

### Three-stage board

```svelte
<script lang="ts">
    import KanbanTable from "../KanbanTable/KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "./KanbanTableTD.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
</script>

<KanbanTable label="Board">
    <KanbanTableHead>
        <KanbanTableRow>
            <KanbanTableTD>To do</KanbanTableTD>
            <KanbanTableTD>In progress</KanbanTableTD>
            <KanbanTableTD>Done</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableTD>A</KanbanTableTD>
            <KanbanTableTD>B</KanbanTableTD>
            <KanbanTableTD>C</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableBody>
</KanbanTable>
```

### Spanning columns

```svelte
<KanbanTableHead>
    <KanbanTableRow>
        <KanbanTableTD colspan={2} scope="colgroup">Active</KanbanTableTD>
        <KanbanTableTD>Done</KanbanTableTD>
    </KanbanTableRow>
</KanbanTableHead>
```

### With per-column data hooks

```svelte
<KanbanTableHead>
    <KanbanTableRow>
        <KanbanTableTD data-stage="todo">To do</KanbanTableTD>
        <KanbanTableTD data-stage="doing">In progress</KanbanTableTD>
        <KanbanTableTD data-stage="done">Done</KanbanTableTD>
    </KanbanTableRow>
</KanbanTableHead>
```

## Accessibility

- `<th scope="col">` associates the header with its workflow column for assistive tech.
- Use `scope="colgroup"` together with `colspan` for grouped column headers.

## Related components

- `KanbanTable` — the root `<table>` with `role="grid"`.
- `KanbanTableHead` — the `<thead>` section containing column-header rows.
- `KanbanTableBody` — the `<tbody>` section containing task rows.
- `KanbanTableFoot` — the `<tfoot>` section for totals.
- `KanbanTableRow` — a `<tr>` row.
- `KanbanTableTD` — a `<td role="gridcell">` task cell.

---

Lily™ and Lily Design System™ are trademarks.
