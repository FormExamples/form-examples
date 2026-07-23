# KanbanTableHead

KanbanTableHead is a headless Svelte 5 component representing the header section of a `KanbanTable`. It renders a `<thead>` element and contains `KanbanTableRow` elements with column headers for the workflow stages.

## What it is

A structural wrapper around the native `<thead>` element. It marks the column-header section of a Kanban board but has no interactive behaviour, state, or styling.

## What it does

- Renders a `<thead>` with `class="kanban-table-head"` plus any consumer-provided CSS class.
- Renders the required `children` snippet, which should be one or more `KanbanTableRow` elements containing `<th scope="col">` header cells for each workflow stage.
- Spreads `...restProps` onto the `<thead>` for consumer customization.

## When to use it

- Naming the workflow columns ("To Do", "In Progress", "Done", etc.) at the top of a Kanban board.
- Providing screen-reader context for every cell in the board via `<th scope="col">`.

## When not to use it

- Do not use outside a `KanbanTable` — `<thead>` is only valid inside `<table>`.
- Do not use for data rows — use `KanbanTableBody`.
- Do not use for totals/actions — use `KanbanTableFoot`.

## How to use it

Place `KanbanTableHead` inside a `KanbanTable` and nest a `KanbanTableRow` containing one `<th>` per workflow stage.

## Props

- `class` (string, optional) — consumer CSS class appended to the base `kanban-table-head` class.
- `children` (Snippet, required) — `KanbanTableRow` elements with header cells.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<thead>`.

## Usage

### Basic three-stage header

```svelte
<script lang="ts">
    import KanbanTable from "../KanbanTable/KanbanTable.svelte";
    import KanbanTableHead from "./KanbanTableHead.svelte";
    import KanbanTableBody from "../KanbanTableBody/KanbanTableBody.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    import KanbanTableTD from "../KanbanTableTD/KanbanTableTD.svelte";
</script>

<KanbanTable label="Board">
    <KanbanTableHead>
        <KanbanTableRow>
            <th scope="col">To Do</th>
            <th scope="col">In Progress</th>
            <th scope="col">Done</th>
        </KanbanTableRow>
    </KanbanTableHead>
    <KanbanTableBody>
        <KanbanTableRow>
            <KanbanTableTD>Task A</KanbanTableTD>
            <KanbanTableTD>Task B</KanbanTableTD>
            <KanbanTableTD>Task C</KanbanTableTD>
        </KanbanTableRow>
    </KanbanTableBody>
</KanbanTable>
```

### Header with counts per stage

```svelte
<script lang="ts">
    import KanbanTableHead from "./KanbanTableHead.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    let counts = $state({ todo: 3, doing: 2, done: 5 });
</script>

<KanbanTableHead>
    <KanbanTableRow>
        <th scope="col">To Do ({counts.todo})</th>
        <th scope="col">Doing ({counts.doing})</th>
        <th scope="col">Done ({counts.done})</th>
    </KanbanTableRow>
</KanbanTableHead>
```

### Header populated from state

```svelte
<script lang="ts">
    import KanbanTableHead from "./KanbanTableHead.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
    let stages = $state(["Backlog", "Design", "Build", "Test", "Ship"]);
</script>

<KanbanTableHead>
    <KanbanTableRow>
        {#each stages as stage}
            <th scope="col">{stage}</th>
        {/each}
    </KanbanTableRow>
</KanbanTableHead>
```

### Header with interactive filter buttons

```svelte
<script lang="ts">
    import KanbanTableHead from "./KanbanTableHead.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";

    function filterStage(stage: string) {
        // consumer-specific filter handler
    }
</script>

<KanbanTableHead>
    <KanbanTableRow>
        <th scope="col">
            <button type="button" onclick={() => filterStage("todo")}>To Do</button>
        </th>
        <th scope="col">
            <button type="button" onclick={() => filterStage("doing")}>Doing</button>
        </th>
        <th scope="col">
            <button type="button" onclick={() => filterStage("done")}>Done</button>
        </th>
    </KanbanTableRow>
</KanbanTableHead>
```

### Header with a consumer CSS class

```svelte
<script lang="ts">
    import KanbanTableHead from "./KanbanTableHead.svelte";
    import KanbanTableRow from "../KanbanTableRow/KanbanTableRow.svelte";
</script>

<KanbanTableHead class="sticky-top">
    <KanbanTableRow>
        <th scope="col">To Do</th>
        <th scope="col">Doing</th>
        <th scope="col">Done</th>
    </KanbanTableRow>
</KanbanTableHead>

<style>
    :global(.sticky-top) {
        position: sticky;
        top: 0;
    }
</style>
```

## Accessibility

- `<thead>` provides structural header semantics for the table.
- Use `<th scope="col">` inside each row so assistive technology associates each task cell with its stage.
- No additional ARIA needed — the parent `KanbanTable` provides `role="grid"` and the accessible name.

## Related components

- `KanbanTable` — the root `<table role="grid">`.
- `KanbanTableBody` — the `<tbody>` section with data rows.
- `KanbanTableFoot` — the `<tfoot>` section for totals or actions.
- `KanbanTableRow` — a `<tr>` row used inside head/body/foot.
- `KanbanTableTD` — a `<td role="gridcell">` task cell.
- `KanbanTableTD` — `<col>` column definitions for `<colgroup>`.

---

Lily™ and Lily Design System™ are trademarks.
