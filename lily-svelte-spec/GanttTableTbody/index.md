# GanttTableBody

The body section of a `GanttTable`, rendered as a native `<tbody>` element. It contains `GanttTableTR` elements with task data cells.

## What it is

A Svelte 5 structural wrapper that renders `<tbody class="gantt-table-tbody ...">{children}</tbody>`. It carries no internal state, no ARIA attributes, and no styling.

## What it does

- Renders `<tbody class="gantt-table-tbody ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<tbody>`.

## When to use it

- Inside a `GanttTable` to group the body rows containing task-vs-time cells.

## When not to use it

- For header rows. Use `GanttTableHead`.
- For footer/summary rows. Use `GanttTableTfoot`.
- For non-Gantt table bodies. Use `DataTableBody`, `CalendarTableBody`, `KanbanTableBody`, or `TableBody`.

## How to use it

Place inside a `GanttTable` and fill with `GanttTableTR` elements.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-tbody` class.
- `children` (Snippet, required) - `GanttTableTR` elements with task data cells.
- `...restProps` - Additional HTML attributes spread onto the `<tbody>`.

## Usage

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Project timeline">
    <GanttTableBody>
        <GanttTableTR>
            <th>Design</th>
            <GanttTableTD active>---</GanttTableTD>
            <GanttTableTD />
        </GanttTableTR>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Release plan">
    <GanttTableHead>
        <GanttTableTR><th>Task</th><th>W1</th></GanttTableTR>
    </GanttTableHead>
    <GanttTableBody>
        <GanttTableTR>
            <th>Ship v1</th>
            <GanttTableTD active>---</GanttTableTD>
        </GanttTableTR>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
    const tasks = [
        { name: "Scope", active: [true, false] },
        { name: "Build", active: [false, true] },
    ];
</script>

<GanttTable label="Tasks">
    <GanttTableBody>
        {#each tasks as t}
            <GanttTableTR>
                <th>{t.name}</th>
                {#each t.active as a}
                    <GanttTableTD active={a} />
                {/each}
            </GanttTableTR>
        {/each}
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Custom styling demo">
    <GanttTableBody class="striped" data-testid="gantt-body">
        <GanttTableTR><th>Row</th><GanttTableTD /></GanttTableTR>
    </GanttTableBody>
</GanttTable>
```

```svelte
<script lang="ts">
    import GanttTable from "../GanttTable/GanttTable.svelte";
    import GanttTableBody from "./GanttTableBody.svelte";
    import GanttTableTR from "../GanttTableTR/GanttTableTR.svelte";
    import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Grouped body">
    <GanttTableBody>
        <GanttTableTR><th>Group A</th><GanttTableTD active /></GanttTableTR>
    </GanttTableBody>
    <GanttTableBody>
        <GanttTableTR><th>Group B</th><GanttTableTD /></GanttTableTR>
    </GanttTableBody>
</GanttTable>
```

## Accessibility

- `<tbody>` conveys structural body semantics natively.
- No additional ARIA applied; grid-level semantics live on `GanttTable` (`role="grid"`).
- Keyboard navigation is expected to be implemented by the consumer at the grid level.

## Related components

- `GanttTable` - the parent grid.
- `GanttTableHead` - header section.
- `GanttTableTfoot` - footer section.
- `GanttTableTR` - row wrapper.
- `GanttTableTD` - cell primitive with `role="gridcell"` and `active` state.
- `GanttTableTH` - column definition for `<colgroup>`.
