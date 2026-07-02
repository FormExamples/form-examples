# CalendarTableFoot

The footer section of a `CalendarTable`. Renders a `<tfoot>` for summary or aggregate rows (e.g. week totals).

## What it is

A headless Svelte 5 structural wrapper. Category: calendar grid structural primitive, sibling of `CalendarTableHead` and `CalendarTableBody`; inside a `CalendarTable`.

## What it does

- Renders `<tfoot class="calendar-table-foot {className}">`.
- Spreads additional HTML attributes onto the `<tfoot>`.
- No behavior — purely structural.

## When to use it

- For summary rows at the bottom of a calendar (e.g. "Week total", "Month total").
- For footnotes about the calendar data.

## When not to use it

- Outside a `CalendarTable`.
- For month-navigation controls — use `Button` with your own layout.

## How to use it

Import `CalendarTableFoot` from `./CalendarTableFoot.svelte`. Place inside `CalendarTable` after `CalendarTableBody`.

## Props

- `class` — string, default `""`. CSS class appended to `calendar-table-foot`.
- `children` — `Snippet`, required. `CalendarTableRow` elements with footer cells.
- `...restProps` — additional HTML attributes spread onto the `<tfoot>`.

## Usage

### Week total row

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="Week view">
  <CalendarTableBody>
    <CalendarTableRow>
      {#each [1, 2, 3, 4, 5] as d}
        <CalendarTableTD>{d}</CalendarTableTD>
      {/each}
    </CalendarTableRow>
  </CalendarTableBody>
  <CalendarTableFoot>
    <CalendarTableRow>
      <CalendarTableTD>Week Total: 5</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableFoot>
</CalendarTable>
```

### Summary footer

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="January 2025">
  <CalendarTableFoot>
    <CalendarTableRow>
      <CalendarTableTD>31 days, 5 weekends</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableFoot>
</CalendarTable>
```

### With data hook

```svelte
<script lang="ts">
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTableFoot data-section="summary">
  <CalendarTableRow>
    <CalendarTableTD>Total: 31</CalendarTableTD>
  </CalendarTableRow>
</CalendarTableFoot>
```

### Conditional foot

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';

  let showTotals = $state(true);
</script>

<CalendarTable label="Week">
  <CalendarTableBody>
    <CalendarTableRow><CalendarTableTD>1</CalendarTableTD></CalendarTableRow>
  </CalendarTableBody>
  {#if showTotals}
    <CalendarTableFoot>
      <CalendarTableRow><CalendarTableTD>Total: 1</CalendarTableTD></CalendarTableRow>
    </CalendarTableFoot>
  {/if}
</CalendarTable>
```

### Multiple footer rows

```svelte
<script lang="ts">
  import CalendarTableFoot from './CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTableFoot>
  <CalendarTableRow><CalendarTableTD>Weekdays: 21</CalendarTableTD></CalendarTableRow>
  <CalendarTableRow><CalendarTableTD>Weekends: 10</CalendarTableTD></CalendarTableRow>
</CalendarTableFoot>
```

## Accessibility

- `<tfoot>` provides structural footer semantics; no ARIA override.
- Keyboard navigation is handled at the `CalendarTable` grid level.

## Related components

- `CalendarTable`, `CalendarTableHead`, `CalendarTableBody`, `CalendarTableRow`, `CalendarTableTD`, `CalendarTableTD`.
- `DataTableFoot`, `GanttTableTfoot`, `KanbanTableFoot`, `TableFoot`.
