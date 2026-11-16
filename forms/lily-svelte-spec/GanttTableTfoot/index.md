# GanttTableTfoot

The footer section of a `GanttTable`, rendered as a native `<tfoot>` element. It contains `GanttTableTr` elements with summary or aggregate data cells.

## What it is

A Svelte 5 structural wrapper that renders `<tfoot class="gantt-table-tfoot ...">{children}</tfoot>`. It carries no internal state, no ARIA attributes, and no styling.

## What it does

- Renders `<tfoot class="gantt-table-tfoot ...">` around the `children` snippet.
- Spreads any additional HTML attributes onto the `<tfoot>`.

## When to use it

- Summary rows under a `GanttTableBody` - totals, averages, aggregates.
- Notes or legends that belong inside the table structure.

## When not to use it

- For body rows. Use `GanttTableBody`.
- For header rows. Use `GanttTableHead`.
- For footer content outside the table. Use `Footer`.

## How to use it

Place inside a `GanttTable` after `GanttTableBody` and populate with `GanttTableTr` elements.

## Props

- `class` (string, optional) - CSS class appended after the base `gantt-table-tfoot` class.
- `children` (Snippet, required) - `GanttTableTr` elements with footer cells.
- `...restProps` - Additional HTML attributes spread onto the `<tfoot>`.

## Usage

```svelte
<script lang="ts">
  import GanttTable from "../GanttTable/GanttTable.svelte";
  import GanttTableTfoot from "./GanttTableTfoot.svelte";
  import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
  import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Plan">
  <GanttTableTfoot>
    <GanttTableTr>
      <GanttTableTD>Total: 12 tasks</GanttTableTD>
    </GanttTableTr>
  </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
  import GanttTable from "../GanttTable/GanttTable.svelte";
  import GanttTableHead from "../GanttTableHead/GanttTableHead.svelte";
  import GanttTableBody from "../GanttTableBody/GanttTableBody.svelte";
  import GanttTableTfoot from "./GanttTableTfoot.svelte";
  import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
  import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Sprint">
  <GanttTableHead>
    <GanttTableTr><th>Task</th><th>W1</th><th>W2</th></GanttTableTr>
  </GanttTableHead>
  <GanttTableBody>
    <GanttTableTr>
      <th>Implement</th>
      <GanttTableTD active />
      <GanttTableTD />
    </GanttTableTr>
  </GanttTableBody>
  <GanttTableTfoot>
    <GanttTableTr>
      <GanttTableTD colspan="3">1 task in sprint</GanttTableTD>
    </GanttTableTr>
  </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
  import GanttTable from "../GanttTable/GanttTable.svelte";
  import GanttTableTfoot from "./GanttTableTfoot.svelte";
  import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
  import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Usage">
  <GanttTableTfoot
    class="summary-row"
    data-testid="gantt-foot"
  >
    <GanttTableTr>
      <GanttTableTD>Total utilisation: 68%</GanttTableTD>
    </GanttTableTr>
  </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
  import GanttTable from "../GanttTable/GanttTable.svelte";
  import GanttTableTfoot from "./GanttTableTfoot.svelte";
  import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
  import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
  const totals = [3, 4, 1];
</script>

<GanttTable label="Totals">
  <GanttTableTfoot>
    <GanttTableTr>
      <th>Total</th>
      {#each totals as t}<GanttTableTD>{t}</GanttTableTD>{/each}
    </GanttTableTr>
  </GanttTableTfoot>
</GanttTable>
```

```svelte
<script lang="ts">
  import GanttTable from "../GanttTable/GanttTable.svelte";
  import GanttTableTfoot from "./GanttTableTfoot.svelte";
  import GanttTableTr from "../GanttTableTr/GanttTableTr.svelte";
  import GanttTableTD from "../GanttTableTD/GanttTableTD.svelte";
</script>

<GanttTable label="Legend">
  <GanttTableTfoot>
    <GanttTableTr>
      <GanttTableTD>--- = scheduled</GanttTableTD>
      <GanttTableTD>◆ = milestone</GanttTableTD>
    </GanttTableTr>
  </GanttTableTfoot>
</GanttTable>
```

## Accessibility

- `<tfoot>` conveys structural footer semantics to assistive tech.
- No additional ARIA applied; grid semantics live on `GanttTable`.

## Related components

- `GanttTable` - parent grid.
- `GanttTableHead` - header section.
- `GanttTableBody` - body section.
- `GanttTableTr` - row wrapper.
- `GanttTableTD` - data cell primitive.
- `GanttTableTH` - column definition.

---

Lily™ and Lily Design System™ are trademarks.
