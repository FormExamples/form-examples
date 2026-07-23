# GanttTableTD

A single cell within a `GanttTableTR` representing a time period in the Gantt grid. Renders a `<td>` with `role="gridcell"` and supports an `active` state communicated via `aria-selected` and a roving `tabindex`.

## What it is

A Svelte 5 component that renders `<td class="gantt-table-td ..." role="gridcell">` with the optional `children` snippet as content.

## What it does

- Renders `<td class="gantt-table-td ..." role="gridcell">`.
- When `active` is true: sets `aria-selected="true"` and `tabindex="0"`.
- When `active` is false/undefined: omits `aria-selected` and sets `tabindex="-1"`.
- Renders the `children` snippet if provided; otherwise the cell is empty (representing an inactive time period).
- Spreads additional HTML attributes onto the `<td>`.

## When to use it

- To represent a single time-period cell for a task in a Gantt chart.
- Empty cells for inactive periods, and filled cells with bars or markers for active periods.

## When not to use it

- For non-grid tabular data cells. Use `DataTableTD` or `TableTD`.
- For calendar dates or kanban statuses. Use `CalendarTableTD` or `KanbanTableTD`.
- For column headers. Use native `<th>` inside a `GanttTableTR`.

## How to use it

Inside a `GanttTableTR`, place one `GanttTableTD` per time-period column. Set `active` on cells where the task is scheduled.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-td` class.
- `active` (boolean, default `false`) - Whether this cell represents an active time period. Controls `aria-selected` and `tabindex`.
- `children` (Snippet, optional) - Cell content, e.g. bar markers or duration text.
- `...restProps` - Additional HTML attributes spread onto the `<td>`.

## Usage

```svelte
<script lang="ts">
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "./GanttTableTD.svelte";
</script>

<GanttTableTR>
    <th>Task A</th>
    <GanttTableTD active>---</GanttTableTD>
    <GanttTableTD />
    <GanttTableTD />
</GanttTableTR>
```

```svelte
<script lang="ts">
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "./GanttTableTD.svelte";
</script>

<GanttTableTR>
    <th>Launch</th>
    <GanttTableTD />
    <GanttTableTD active>◆</GanttTableTD>
    <GanttTableTD />
</GanttTableTR>
```

```svelte
<script lang="ts">
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "./GanttTableTD.svelte";
    const period = [false, true, true, false];
</script>

<GanttTableTR>
    <th>Build</th>
    {#each period as a}
        <GanttTableTD active={a}>{a ? "---" : ""}</GanttTableTD>
    {/each}
</GanttTableTR>
```

```svelte
<script lang="ts">
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "./GanttTableTD.svelte";
</script>

<GanttTableTR>
    <th>QA</th>
    <GanttTableTD
        active
        class="critical"
        data-testid="cell-qa-w1"
        onclick={() => console.log("clicked")}
    >
        ●
    </GanttTableTD>
</GanttTableTR>
```

```svelte
<script lang="ts">
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "./GanttTableTD.svelte";
    let focused = $state<number | null>(null);
</script>

<GanttTableTR>
    <th>Review</th>
    {#each [0, 1, 2] as i}
        <GanttTableTD
            active={focused === i}
            onfocus={() => (focused = i)}
        >
            {focused === i ? "▮" : ""}
        </GanttTableTD>
    {/each}
</GanttTableTR>
```

## Accessibility

- `role="gridcell"` identifies the cell as part of the grid.
- `aria-selected="true"` + `tabindex="0"` on active cells enables roving-tabindex keyboard traversal.
- Inactive cells use `tabindex="-1"` so they are not in the Tab sequence, but consumers can focus them programmatically during Arrow-key navigation.
- The grid-level Arrow-key handlers must be implemented by the consumer.

## Related components

- `GanttTable` - parent grid.
- `GanttTableTR` - row wrapper (`<tr>`).
- `GanttTableHead` / `GanttTableBody` / `GanttTableTfoot` - sections.
- `GanttTableTH` - column definition (`<col>`).
- `DataTableTD`, `CalendarTableTD`, `KanbanTableTD`, `TableTD` - data-cell variants in other table families.

---

Lily™ and Lily Design System™ are trademarks.
