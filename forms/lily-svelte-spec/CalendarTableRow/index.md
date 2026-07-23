# CalendarTableRow

A single row inside `CalendarTableHead`, `CalendarTableBody`, or `CalendarTableFoot`. Renders a `<tr>` that holds header cells (`<th>`) or `CalendarTableTD` cells.

## What it is

A headless Svelte 5 structural wrapper. Category: calendar grid row primitive; inside the head/body/foot of a `CalendarTable`.

## What it does

- Renders `<tr class="calendar-table-row {className}">`.
- Spreads additional HTML attributes onto the `<tr>`.
- No behavior — purely structural.

## When to use it

- For every row in a calendar: the day-of-week header row in `CalendarTableHead`, each week row in `CalendarTableBody`, and any summary row in `CalendarTableFoot`.

## When not to use it

- Outside a `CalendarTable` — use `DataTableRow`, `GanttTableTR`, `KanbanTableRow`, or `TableRow` as appropriate.

## How to use it

Import `CalendarTableRow` from `./CalendarTableRow.svelte`. Fill with `<th>` cells inside the head, or `CalendarTableTD` cells inside the body/foot.

## Props

- `class` — string, default `""`. CSS class appended to `calendar-table-row`.
- `children` — `Snippet`, required. Cells for the row.
- `...restProps` — additional HTML attributes spread onto the `<tr>`.

## Usage

### Week row in the body

```svelte
<script lang="ts">
  import CalendarTableRow from './CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTableRow>
  {#each [1, 2, 3, 4, 5, 6, 7] as d}
    <CalendarTableTD>{d}</CalendarTableTD>
  {/each}
</CalendarTableRow>
```

### Header row with `<th>` cells

```svelte
<script lang="ts">
  import CalendarTableRow from './CalendarTableRow.svelte';
</script>

<CalendarTableRow>
  <th scope="col">Mon</th>
  <th scope="col">Tue</th>
  <th scope="col">Wed</th>
</CalendarTableRow>
```

### Row in a foot for summary

```svelte
<script lang="ts">
  import CalendarTableRow from './CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTableRow>
  <CalendarTableTD>Total days: 7</CalendarTableTD>
</CalendarTableRow>
```

### Full composition inside a body

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from './CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="January 2025">
  <CalendarTableBody>
    <CalendarTableRow>
      {#each [1, 2, 3, 4, 5, 6, 7] as d}
        <CalendarTableTD>{d}</CalendarTableTD>
      {/each}
    </CalendarTableRow>
    <CalendarTableRow>
      {#each [8, 9, 10, 11, 12, 13, 14] as d}
        <CalendarTableTD>{d}</CalendarTableTD>
      {/each}
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

### With data attribute

```svelte
<script lang="ts">
  import CalendarTableRow from './CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTableRow data-week={1}>
  <CalendarTableTD>1</CalendarTableTD>
</CalendarTableRow>
```

## Accessibility

- `<tr>` has implicit row semantics inside the grid; no explicit ARIA needed.
- Keyboard navigation is handled at the `CalendarTable` grid level.

## Related components

- `CalendarTable`, `CalendarTableHead`, `CalendarTableBody`, `CalendarTableFoot`, `CalendarTableTD`, `CalendarTableTD`.
- `DataTableRow`, `GanttTableTR`, `KanbanTableRow`, `TableRow`.

---

Lily™ and Lily Design System™ are trademarks.
