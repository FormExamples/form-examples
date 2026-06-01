# GanttTableTH

A column header cell within a `GanttTable`. Renders a `<th scope="col">` element, intended to live inside a `GanttTableTR` within `GanttTableHead`, where it labels a time-period column.

## What it is

A Svelte 5 component that renders `<th class="gantt-table-th ..." scope="col">` with optional `colspan` and `rowspan` attributes. Renders header text via `children`.

## What it does

- Renders `<th>` with `scope="col"` by default.
- Applies `colspan` / `rowspan` only when truthy.
- Accepts an alternative `scope` (e.g. `"colgroup"`).
- Renders header text via `children`.
- Spreads additional HTML attributes onto the `<th>`.

## When to use it

- For time-period column headers (days, weeks, months, milestones).
- For grouped header cells (e.g. a quarter spanning three months) via `colspan`.

## When not to use it

- For task data cells — use `GanttTableTD`.
- For row headers — use a `<th scope="row">` directly inside `GanttTableTR`.
- For column-wide styling hooks via `<colgroup>` / `<col>` — write those directly inside `GanttTable`.

## How to use it

Place `GanttTableTH` elements inside a `GanttTableTR` within `GanttTableHead`, one per time-period column.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-th` class.
- `colspan` (number, optional) - Number of columns this header spans.
- `rowspan` (number, optional) - Number of rows this header spans.
- `scope` (`"col" | "row" | "colgroup" | "rowgroup"`, default `"col"`).
- `children` (Snippet, optional) - Header cell content.
- `...restProps` - Additional HTML attributes spread onto the `<th>`.

## Usage

### Weekly columns

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTH from "./GanttTableTH.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Project schedule">
    <GanttTableHead>
        <GanttTableTR>
            <GanttTableTH>Task</GanttTableTH>
            <GanttTableTH>W1</GanttTableTH>
            <GanttTableTH>W2</GanttTableTH>
            <GanttTableTH>W3</GanttTableTH>
            <GanttTableTH>W4</GanttTableTH>
        </GanttTableTR>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableTR>
            <th scope="row">Design</th>
            <GanttTableTD />
            <GanttTableTD />
            <GanttTableTD />
            <GanttTableTD />
        </GanttTableTR>
    </GanttTableBody>
</GanttTable>
```

### Grouped quarter and month headers

```svelte
<GanttTableHead>
    <GanttTableTR>
        <GanttTableTH rowspan={2}>Task</GanttTableTH>
        <GanttTableTH colspan={3} scope="colgroup">Q1</GanttTableTH>
        <GanttTableTH colspan={3} scope="colgroup">Q2</GanttTableTH>
    </GanttTableTR>
    <GanttTableTR>
        <GanttTableTH>Jan</GanttTableTH>
        <GanttTableTH>Feb</GanttTableTH>
        <GanttTableTH>Mar</GanttTableTH>
        <GanttTableTH>Apr</GanttTableTH>
        <GanttTableTH>May</GanttTableTH>
        <GanttTableTH>Jun</GanttTableTH>
    </GanttTableTR>
</GanttTableHead>
```

### Dynamic column headers

```svelte
<script lang="ts">
    const weeks = [1, 2, 3, 4];
</script>

<GanttTableHead>
    <GanttTableTR>
        <GanttTableTH>Task</GanttTableTH>
        {#each weeks as w}<GanttTableTH>W{w}</GanttTableTH>{/each}
    </GanttTableTR>
</GanttTableHead>
```

## Accessibility

- `<th scope="col">` associates the header with its column for assistive tech.
- Use `scope="colgroup"` together with `colspan` for grouped column headers.

## Related components

- `GanttTable` - parent grid.
- `GanttTableHead` / `GanttTableBody` / `GanttTableTfoot` - sections.
- `GanttTableTR` - row wrapper.
- `GanttTableTD` - data cell primitive.
- `DataTableTD`, `CalendarTableTD`, `KanbanTableTD`, `TableTD` - sibling header-cell components in other tables.
