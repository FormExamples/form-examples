# CalendarTable

An interactive calendar grid built on a `<table>` with `role="grid"`. Provides the outer shell for a month/week calendar; the consumer fills head/body/foot sections with rows and day cells.

## What it is

A headless Svelte 5 compound component. Category: calendar grid primitive, top of the `CalendarTable` → `CalendarTableHead` / `CalendarTableBody` / `CalendarTableFoot` → `CalendarTableRow` → `CalendarTableTD` / `CalendarTableTD` composition.

## What it does

- Renders `<table class="calendar-table {className}" role="grid" aria-label={label}>`.
- Renders a `<caption>` when `caption` is provided.
- Spreads additional HTML attributes onto the `<table>`.
- Does not implement grid keyboard navigation; the consumer supplies arrow-key and Enter/Space handling.

## When to use it

- Month-view calendars for date pickers, schedules, event planners.
- Any tabular date display that benefits from `role="grid"` semantics.
- As the grid inside a `CalendarRangePicker`.

## When not to use it

- For data tables unrelated to calendars — use `DataTable`.
- For Gantt or kanban boards — use `GanttTable` or `KanbanTable`.
- For plain tabular data without interactive grid semantics — use `Table`.

## How to use it

Import `CalendarTable` from `./CalendarTable.svelte`. Always pass `label` (e.g. `"January 2025"`). Compose head/body/foot inside.

## Props

- `class` — string, default `""`. CSS class appended to `calendar-table`.
- `label` — string, required. Accessible name for the grid period.
- `caption` — string, optional. Visible caption text.
- `children` — `Snippet`, required. `CalendarTableHead`, `CalendarTableBody`, `CalendarTableFoot` elements.
- `...restProps` — additional HTML attributes spread onto the `<table>`.

## Usage

### Full composition

```svelte
<script lang="ts">
  import CalendarTable from './CalendarTable.svelte';
  import CalendarTableHead from '../CalendarTableHead/CalendarTableHead.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableFoot from '../CalendarTableFoot/CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow>
      <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
    </CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow>
      {#each [1, 2, 3, 4, 5, 6, 7] as d}
        <CalendarTableTD>{d}</CalendarTableTD>
      {/each}
    </CalendarTableRow>
  </CalendarTableBody>
  <CalendarTableFoot>
    <CalendarTableRow>
      <CalendarTableTD>Week total: 7</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableFoot>
</CalendarTable>
```

### With visible caption

```svelte
<script lang="ts">
  import CalendarTable from './CalendarTable.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="February 2025" caption="February 2025">
  <CalendarTableBody>
    <CalendarTableRow>
      <CalendarTableTD>1</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

### With selected "today" cell

```svelte
<script lang="ts">
  import CalendarTable from './CalendarTable.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';

  let selected = $state(15);
</script>

<CalendarTable label="January 2025">
  <CalendarTableBody>
    <CalendarTableRow>
      {#each [14, 15, 16] as d}
        <CalendarTableTD selected={d === selected} today={d === 15}>{d}</CalendarTableTD>
      {/each}
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

### With column definitions

```svelte
<script lang="ts">
  import CalendarTable from './CalendarTable.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="Week view">
  <colgroup>
    <CalendarTableTD />
    <CalendarTableTD span={5} />
    <CalendarTableTD />
  </colgroup>
  <CalendarTableBody>
    <CalendarTableRow>
      <CalendarTableTD>Sun</CalendarTableTD>
      <CalendarTableTD>Mon</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

### Inside a CalendarRangePicker

```svelte
<script lang="ts">
  import CalendarRangePicker from '../CalendarRangePicker/CalendarRangePicker.svelte';
  import CalendarTable from './CalendarTable.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarRangePicker label="Select date range">
  <CalendarTable label="March 2025">
    <CalendarTableBody>
      <CalendarTableRow>
        {#each [1, 2, 3, 4, 5] as d}
          <CalendarTableTD>{d}</CalendarTableTD>
        {/each}
      </CalendarTableRow>
    </CalendarTableBody>
  </CalendarTable>
</CalendarRangePicker>
```

## Accessibility

- `role="grid"` declares the widget as an interactive 2D grid.
- `aria-label` names the displayed period (month/year).
- `<caption>`, when provided, is the visible accessible name.
- Keyboard: the consumer must implement arrow-key navigation and Enter/Space selection across cells.

## Related components

- `CalendarTableHead`, `CalendarTableBody`, `CalendarTableFoot` — structural sections.
- `CalendarTableRow`, `CalendarTableTD`, `CalendarTableTD` — row / cell / column.
- `CalendarRangePicker` — outer range-selection container.
- `DataTable`, `GanttTable`, `KanbanTable`, `Table` — sibling table variants.
