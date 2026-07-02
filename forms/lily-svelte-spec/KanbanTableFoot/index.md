# KanbanTableFoot

KanbanTableFoot is a headless Svelte 5 component representing the footer section of a `KanbanTable`. It renders a `<tfoot>` element and contains `KanbanTableRow` elements with summary or aggregate data cells.

## What it is

A structural wrapper around the native `<tfoot>` element. It marks the summary or totals section of a Kanban board but has no interactive behaviour, state, or styling.

## What it does

- Renders a `<tfoot>` with `class="kanban-table-foot"` plus any consumer-provided CSS class.
- Renders the required `children` snippet, which should be one or more `KanbanTableRow` elements with footer cells.
- Spreads `...restProps` onto the `<tfoot>` for consumer customization.

## When to use it

- Showing per-column totals or aggregate counts at the bottom of a Kanban board.
- Displaying summary metrics such as total story points per workflow stage.
- Hosting action cells (e.g., "Add task") at the bottom of each column.

## When not to use it

- Do not use outside a `KanbanTable` — `<tfoot>` is only valid inside `<table>`.
- Do not use for workflow-stage column headers — use `KanbanTableHead`.
- Do not use for data rows — use `KanbanTableBody`.

## How to use it

Place `KanbanTableFoot` after `KanbanTableBody` inside a `KanbanTable`, and nest `KanbanTableRow` elements containing summary cells.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `kanban-table-foot` class.
- `children` (Snippet, required) — `KanbanTableRow` elements with footer cells.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<tfoot>`.

## Usage

### Basic footer with column totals

```svelte
<script lang="ts">
    import KanbanTable from "../KanbanTable/KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
</script>

<KanbanTable label="Board">
    <KanbanTableHead>
        <KanbanTableRow>
            <th>To Do</th>
            <th>Done</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableTD>A</KanbanTableTD>
            <KanbanTableTD>B</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableBody>
    <KanbanTableFoot>
        <KanbanTableRow>
            <KanbanTableTD>Total: 3</KanbanTableTD>
            <KanbanTableTD>Total: 5</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableFoot>
</KanbanTable>
```

### Footer with "Add" action cells

```svelte
<script lang="ts">
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
</script>

<KanbanTableFoot>
    <KanbanTableRow>
        <KanbanTableTD>
            <button type="button">+ Add to To Do</button>
        </KanbanTableTD>
        <KanbanTableTD>
            <button type="button">+ Add to Doing</button>
        </KanbanTableTD>
        <KanbanTableTD>
            <button type="button">+ Add to Done</button>
        </KanbanTableTD>
    </KanbanTableRow>
</KanbanTableFoot>
```

### Footer summary bound to state

```svelte
<script lang="ts">
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";

    let totals = $state([3, 5, 2]);
    let labels = $state(["To Do", "Doing", "Done"]);
</script>

<KanbanTableFoot>
    <KanbanTableRow>
        {#each totals as t, i}
            <KanbanTableTD label={`${labels[i]} total`}>
                {labels[i]}: {t}
            </KanbanTableTD>
        {/each}
    </KanbanTableRow>
</KanbanTableFoot>
```

### Footer with consumer CSS class

```svelte
<script lang="ts">
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
</script>

<KanbanTableFoot class="foot-totals">
    <KanbanTableRow>
        <KanbanTableTD>12 pts</KanbanTableTD>
        <KanbanTableTD>8 pts</KanbanTableTD>
        <KanbanTableTD>20 pts</KanbanTableTD>
    </KanbanTableRow>
</KanbanTableFoot>
```

### Footer with multiple summary rows

```svelte
<script lang="ts">
    import KanbanTableFoot from "./KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
</script>

<KanbanTableFoot>
    <KanbanTableRow>
        <KanbanTableTD>Count: 3</KanbanTableTD>
        <KanbanTableTD>Count: 2</KanbanTableTD>
    </KanbanTableRow>
    <KanbanTableRow>
        <KanbanTableTD>Points: 8</KanbanTableTD>
        <KanbanTableTD>Points: 5</KanbanTableTD>
    </KanbanTableRow>
</KanbanTableFoot>
```

## Accessibility

- `<tfoot>` provides structural footer semantics for the table.
- No additional ARIA needed — the parent `KanbanTable` provides `role="grid"` and the `aria-label`.
- Cells inside footer rows still participate in grid semantics via `KanbanTableTD`.

## Related components

- `KanbanTable` — the root `<table role="grid">`.
- `KanbanTableHead` — the `<thead>` section with stage columns.
- `KanbanTableBody` — the `<tbody>` section with data rows.
- `KanbanTableRow` — a `<tr>` row.
- `KanbanTableTD` — a `<td role="gridcell">` data cell.
- `KanbanTableTD` — `<col>` column definitions for `<colgroup>`.
