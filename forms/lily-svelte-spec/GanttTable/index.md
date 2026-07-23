# GanttTable

An interactive Gantt table that displays project tasks and their timelines as a structured grid widget. Renders a `<table>` element with `role="grid"` and an accessible label, optionally accompanied by a visible `<caption>`.

## What it is

A Svelte 5 component that renders `<table role="grid">`, writing an optional `<caption>` when provided. The actual rows/cells are supplied by the composed sub-components `GanttTableHead`, `GanttTableBody`, `GanttTableTfoot`, `GanttTableTR`, and `GanttTableTD`.

## What it does

- Renders `<table class="gantt-table ..." role="grid" aria-label={label}>`.
- When `caption` is provided, emits `<caption>{caption}</caption>` as the first child of the table.
- Renders the `children` snippet (expected to be `GanttTableHead` / `GanttTableBody` / `GanttTableTfoot`) inside the table.
- Spreads extra attributes onto the `<table>` element.

## When to use it

- Project management tools that schedule tasks over a time axis.
- Resource planning views showing which resources are busy during which time periods.
- Any tabular visualisation of tasks vs. time with discrete columns per time period.

## When not to use it

- For non-time-based tabular data. Use `DataTable`.
- For a status-based kanban board. Use `KanbanTable`.
- For a calendar-by-date grid. Use `CalendarTable`.
- For a plain generic table. Use `Table`.

## How to use it

Import `GanttTable` along with the sub-components and compose head/body/foot rows. Each row mixes native `<th>` cells for task labels or time-period headers with `GanttTableTD` cells for the cells representing time periods.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table` class.
- `label` (string, required) - Accessible name via `aria-label`.
- `caption` (string, optional) - Visible `<caption>` text.
- `children` (Snippet, required) - `GanttTableHead` / `GanttTableBody` / `GanttTableTfoot` elements.
- `...restProps` - Additional HTML attributes spread onto the `<table>` element.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Project timeline" caption="Q2 plan">
    <GanttTableHead>
        <GanttTableTR>
            <th>Task</th>
            <th>Week 1</th>
            <th>Week 2</th>
            <th>Week 3</th>
        </GanttTableTR>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableTR>
            <th>Design</th>
            <GanttTableTD active>---</GanttTableTD>
            <GanttTableTD />
            <GanttTableTD />
        </GanttTableTR>
        <GanttTableTR>
            <th>Development</th>
            <GanttTableTD />
            <GanttTableTD active>---</GanttTableTD>
            <GanttTableTD active>---</GanttTableTD>
        </GanttTableTR>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableTfoot from "../GanttTableTfoot/GanttTableTfoot.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Release plan">
    <GanttTableHead>
        <GanttTableTR>
            <th>Feature</th><th>Jan</th><th>Feb</th><th>Mar</th>
        </GanttTableTR>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableTR>
            <th>Auth</th>
            <GanttTableTD active />
            <GanttTableTD active />
            <GanttTableTD />
        </GanttTableTR>
    </GanttTableBody>
    <GanttTableTfoot>
        <GanttTableTR>
            <GanttTableTD>Total: 1 feature</GanttTableTD>
        </GanttTableTR>
    </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
    import GanttTableTH from "../GanttTableTH/GanttTableTH.svelte";
</script>

<GanttTable label="Schedule with columns">
    <colgroup>
        <GanttTableTH />
        <GanttTableTH span={3} />
    </colgroup>
    <GanttTableHead>
        <GanttTableTR>
            <th>Task</th><th>W1</th><th>W2</th><th>W3</th>
        </GanttTableTR>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableTR>
            <th>Research</th>
            <GanttTableTD active />
            <GanttTableTD />
            <GanttTableTD />
        </GanttTableTR>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
    const weeks = ["W1", "W2", "W3", "W4"];
    const tasks = [
        { name: "Design", active: [true, true, false, false] },
        { name: "Build", active: [false, true, true, true] },
    ];
</script>

<GanttTable label="Four week plan">
    <GanttTableHead>
        <GanttTableTR>
            <th>Task</th>
            {#each weeks as w}<th>{w}</th>{/each}
        </GanttTableTR>
    </GanttTableHead>
    <GanttTableBody>
        {#each tasks as t}
            <GanttTableTR>
                <th>{t.name}</th>
                {#each t.active as active}
                    <GanttTableTD {active}>{active ? "---" : ""}</GanttTableTD>
                {/each}
            </GanttTableTR>
        {/each}
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "./GanttTable.svelte";
    import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable
    label="Sprint plan"
    class="sprint-gantt"
    data-testid="sprint-gantt"
>
    <GanttTableBody>
        <GanttTableTR>
            <th>Ticket 1</th>
            <GanttTableTD active>▮</GanttTableTD>
        </GanttTableTR>
    </GanttTableBody>
</GanttTable>
```

## Accessibility

- `role="grid"` turns the table into an interactive grid widget for assistive tech.
- `aria-label` gives the grid a name; `<caption>` provides a visible accessible name.
- Row cells representing active time periods use `aria-selected="true"` and a roving `tabindex`, wired in `GanttTableTD`.
- Consumers are expected to implement Arrow-key grid navigation (the component does not ship keyboard handlers).

## Related components

- `GanttTableHead`, `GanttTableBody`, `GanttTableTfoot` - structural sections.
- `GanttTableTR`, `GanttTableTD`, `GanttTableTH` - row, cell, and column primitives.
- `DataTable` - non-time-based tabular data.
- `CalendarTable` - calendar-by-date grid.
- `KanbanTable` - status-based board grid.
- `Table` - generic table.

---

Lily™ and Lily Design System™ are trademarks.
