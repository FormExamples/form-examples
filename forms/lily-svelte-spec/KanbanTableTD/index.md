# KanbanTableTD

KanbanTableTD is a headless Svelte 5 component representing a single cell within a `KanbanTableRow`. It renders a `<td>` with `role="gridcell"` and supports a roving-tabindex pattern via the `active` prop.

## What it is

A grid cell that represents a task card or empty slot within a Kanban workflow column. It is semantically a `<td>` but carries `role="gridcell"` so screen readers treat it as a cell within the WAI-ARIA grid pattern. The `active` prop controls `aria-selected` and `tabindex` for roving focus.

## What it does

- Renders a `<td>` with `class="kanban-table-td"` plus any consumer-provided CSS class.
- Applies `role="gridcell"` for grid semantics.
- Sets `aria-selected` when `active` is `true` (otherwise omitted).
- Uses `tabindex={active ? 0 : -1}` so only the active cell participates in the tab sequence.
- Optionally applies `aria-label` from the `label` prop for extra context.
- Renders `children` when provided; otherwise leaves the cell empty (valid for empty workflow slots).
- Spreads `...restProps` onto the `<td>`.

## When to use it

- Task cards inside a Kanban board column.
- Empty cells to indicate a workflow slot with no current task.
- Cells in summary rows (inside `KanbanTableFoot`) that should still participate in grid keyboard navigation.

## When not to use it

- Do not use outside a `KanbanTableRow` — `<td>` is only valid inside `<tr>`.
- Do not use for a column header — use a plain `<th scope="col">` inside `KanbanTableHead`.
- Do not use for tabular data — use `DataTableTD`.

## How to use it

Place `KanbanTableTD` elements inside `KanbanTableRow`. Use `active` together with your own keyboard-navigation logic on the parent `KanbanTable` to implement roving tabindex.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `kanban-table-td` class.
- `active` (boolean, optional, default `false`) — marks the cell as currently selected; sets `aria-selected` and `tabindex=0`.
- `label` (string, optional) — accessible name for the cell via `aria-label`.
- `children` (Snippet, optional) — cell content such as task cards or text; omit for empty cells.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<td>`.

## Usage

### Simple task cell

```svelte
<script lang="ts">
    import KanbanTableTD from "./KanbanTableTD.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
</script>

<KanbanTableRow>
    <KanbanTableTD>Fix login bug</KanbanTableTD>
    <KanbanTableTD>Write docs</KanbanTableTD>
    <KanbanTableTD>Release 1.0</KanbanTableTD>
</KanbanTableRow>
```

### Cell with accessible label

```svelte
<script lang="ts">
    import KanbanTableTD from "./KanbanTableTD.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
</script>

<KanbanTableRow>
    <KanbanTableTD label="High priority: Fix login bug">
        Fix login bug
    </KanbanTableTD>
</KanbanTableRow>
```

### Empty cell (no children)

```svelte
<script lang="ts">
    import KanbanTableTD from "./KanbanTableTD.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
</script>

<KanbanTableRow>
    <KanbanTableTD>Design</KanbanTableTD>
    <KanbanTableTD />
    <KanbanTableTD />
</KanbanTableRow>
```

### Active cell with roving tabindex

```svelte
<script lang="ts">
    import KanbanTableTD from "./KanbanTableTD.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    let selectedId = $state("b");
</script>

<KanbanTableRow>
    <KanbanTableTD active={selectedId === "a"} label="Task A">Task A</KanbanTableTD>
    <KanbanTableTD active={selectedId === "b"} label="Task B">Task B</KanbanTableTD>
    <KanbanTableTD active={selectedId === "c"} label="Task C">Task C</KanbanTableTD>
</KanbanTableRow>
```

### Cell with a task-card child component

```svelte
<script lang="ts">
    import KanbanTableTD from "./KanbanTableTD.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import Card from "../Card/Card.svelte";
</script>

<KanbanTableRow>
    <KanbanTableTD label="Story: Add dark mode">
        <Card label="Add dark mode">
            <h3>Add dark mode</h3>
            <p>Support system preference.</p>
        </Card>
    </KanbanTableTD>
</KanbanTableRow>
```

## Accessibility

- `role="gridcell"` identifies the cell as part of a grid widget.
- `aria-selected` indicates active/selected state when `active` is `true`.
- `tabindex` follows the roving-tabindex pattern (`0` when active, `-1` otherwise).
- `aria-label` may provide an accessible name when the cell content is visual.
- Keyboard navigation must be implemented by the consumer at the `KanbanTable` level (arrow keys to move between active cells, Home/End, Enter/Space).

## Related components

- `KanbanTable` — the root `<table role="grid">`.
- `KanbanTableHead`, `KanbanTableBody`, `KanbanTableFoot` — section wrappers.
- `KanbanTableRow` — the `<tr>` row that contains `KanbanTableTD` cells.
- `KanbanTableTD` — `<col>` column definitions for `<colgroup>`.
- `DataTableTD`, `CalendarTableTD`, `GanttTableTD` — equivalent cells for other table types.

---

Lily™ and Lily Design System™ are trademarks.
