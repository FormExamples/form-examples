# KanbanTable

KanbanTable is a headless Svelte 5 component that organizes work items into columns representing different workflow stages such as "To Do", "In Progress", and "Done". It renders as a `<table>` element with `role="grid"` and an accessible label, and is the root of the Kanban compound component family.

## What it is

The root container of a Kanban board built on top of an HTML `<table>`. It adopts the WAI-ARIA grid pattern (`role="grid"`) so rows and cells can be navigated with a keyboard. It has no visual styling — consumers use `display: grid`, `display: flex`, or other CSS to lay the board out visually.

## What it does

- Renders a `<table>` with `class="kanban-table"` plus any consumer-provided CSS class.
- Applies `role="grid"` and `aria-label` for the accessible name of the board.
- Optionally renders a `<caption>` above the table when `caption` is provided.
- Renders `children` which should include `KanbanTableHead`, `KanbanTableBody`, and optionally `KanbanTableFoot`.
- Spreads `...restProps` onto the `<table>` for consumer customization.

## When to use it

- Agile sprint boards, task tracking, and workflow-stage visualizations.
- Grouping items into columns for drag-and-drop management (consumer-provided).
- Project management tools that need keyboard-accessible grids.

## When not to use it

- Do not use for tabular data — use `DataTable`.
- Do not use for calendar or date data — use `CalendarTable`.
- Do not use for Gantt schedule visualizations — use `GanttTable`.
- Do not use for a plain non-interactive table — use `Table`.

## How to use it

Import the compound components, compose them with a `KanbanTableHead` for the workflow-stage column headers, a `KanbanTableBody` for task cells organized in rows, and optionally a `KanbanTableFoot` for totals or actions. Provide a `label` describing the board.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `kanban-table` class.
- `label` (string, required) — accessible name for the board via `aria-label`.
- `caption` (string, optional) — visible caption text displayed inside a `<caption>` above the table.
- `children` (Snippet, required) — `KanbanTableHead`, `KanbanTableBody`, `KanbanTableFoot` elements.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<table>`.

## Usage

### Basic Kanban board with Head, Body, Row, Col, Data

```svelte
<script lang="ts">
    import KanbanTable from "./KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
</script>

<KanbanTable label="Sprint 5 board" caption="Sprint 5">
    <colgroup>
        <KanbanTableTD span={1} />
        <KanbanTableTD span={1} />
        <KanbanTableTD span={1} />
    </colgroup>
    <KanbanTableHead>
        <KanbanTableRow>
            <th scope="col">To Do</th>
            <th scope="col">In Progress</th>
            <th scope="col">Done</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableTD label="Task A">Task A</KanbanTableTD>
            <KanbanTableTD label="Task B">Task B</KanbanTableTD>
            <KanbanTableTD label="Task C">Task C</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableBody>
</KanbanTable>
```

### Kanban board with an active cell (roving tabindex)

```svelte
<script lang="ts">
    import KanbanTable from "./KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
    let selected = $state("a");
</script>

<KanbanTable label="Backlog">
    <KanbanTableHead>
        <KanbanTableRow>
            <th scope="col">To Do</th>
            <th scope="col">Doing</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableTD active={selected === "a"} label="Fix login bug">
                Fix login bug
            </KanbanTableTD>
            <KanbanTableTD active={selected === "b"} label="Write docs">
                Write docs
            </KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableBody>
</KanbanTable>
```

### Kanban board with a footer summary

```svelte
<script lang="ts">
    import KanbanTable from "./KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableFoot from "../KanbanTableFoot/KanbanTableFoot.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
</script>

<KanbanTable label="Team board">
    <KanbanTableHead>
        <KanbanTableRow>
            <th scope="col">To Do</th>
            <th scope="col">Done</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableTD>T1</KanbanTableTD>
            <KanbanTableTD>D1</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableBody>
    <KanbanTableFoot>
        <KanbanTableRow>
            <KanbanTableTD>Total: 1</KanbanTableTD>
            <KanbanTableTD>Total: 1</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableFoot>
</KanbanTable>
```

### Kanban board with data from state

```svelte
<script lang="ts">
    import KanbanTable from "./KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";

    let columns = $state(["To Do", "In Progress", "Done"]);
    let tasks = $state([
        ["Design", "Build", "Ship"],
        ["Spec", "Review", "Release"],
    ]);
</script>

<KanbanTable label="Team sprint">
    <KanbanTableHead>
        <KanbanTableRow>
            {#each columns as col}
                <th scope="col">{col}</th>
            {/each}
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        {#each tasks as row}
            <KanbanTableRow>
                {#each row as cell}
                    <KanbanTableTD>{cell}</KanbanTableTD>
                {/each}
            </KanbanTableRow>
        {/each}
    </KanbanTableBody>
</KanbanTable>
```

### Kanban board with a visible caption

```svelte
<script lang="ts">
    import KanbanTable from "./KanbanTable.svelte";
    import KanbanTableHead from "../KanbanTableHead/KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
</script>

<KanbanTable label="Q1 roadmap" caption="Q1 2026 Roadmap">
    <KanbanTableHead>
        <KanbanTableRow>
            <th scope="col">Planned</th>
            <th scope="col">Shipped</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableTD>Feature A</KanbanTableTD>
            <KanbanTableTD>Feature B</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableBody>
</KanbanTable>
```

## Accessibility

- `role="grid"` identifies the `<table>` as an interactive grid widget.
- `aria-label` provides the accessible name of the board.
- Consumers are responsible for wiring grid keyboard navigation (arrow keys, Home, End) between active cells via the `active` prop on `KanbanTableTD` (roving tabindex).
- Screen readers announce column headers (`<th scope="col">`) for each workflow stage.
- Compliant with WCAG 2.2 AAA when focus indicators and colour contrast are provided by the consumer.

## Related components

- `KanbanTableHead` — the `<thead>` section for stage columns.
- `KanbanTableBody` — the `<tbody>` section for task rows.
- `KanbanTableFoot` — the `<tfoot>` section for totals or actions.
- `KanbanTableRow` — a `<tr>` row within Head/Body/Foot.
- `KanbanTableTD` — a `<th scope="col">` column header cell inside `<thead><tr>`.
- `KanbanTableTD` — a `<td>` cell with `role="gridcell"` and roving tabindex.
- `DataTable` — for displaying tabular data.
- `GanttTable` — for schedule visualization.
- `CalendarTable` — for date grids.

---

Lily™ and Lily Design System™ are trademarks.
