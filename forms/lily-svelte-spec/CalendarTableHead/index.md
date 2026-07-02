# CalendarTableHead

The header section of a `CalendarTable`. Renders a `<thead>` that holds the day-of-week header row.

## What it is

A headless Svelte 5 structural wrapper. Category: calendar grid structural primitive, sibling of `CalendarTableBody` and `CalendarTableFoot`; inside a `CalendarTable`.

## What it does

- Renders `<thead class="calendar-table-head {className}">`.
- Spreads additional HTML attributes onto the `<thead>`.
- No behavior — purely structural.

## When to use it

- Inside a `CalendarTable` to hold a `CalendarTableRow` of `<th>` day-of-week headers.

## When not to use it

- Outside a `CalendarTable`.
- For body or footer rows — use `CalendarTableBody` / `CalendarTableFoot`.

## How to use it

Import `CalendarTableHead` from `./CalendarTableHead.svelte`. Place at the top of `CalendarTable`, fill with a `CalendarTableRow` of `<th>` cells.

## Props

- `class` — string, default `""`. CSS class appended to `calendar-table-head`.
- `children` — `Snippet`, required. Typically a `CalendarTableRow` with `<th>` cells.
- `...restProps` — additional HTML attributes spread onto the `<thead>`.

## Usage

### Day-of-week header

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableHead from './CalendarTableHead.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
</script>

<CalendarTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow>
      <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
    </CalendarTableRow>
  </CalendarTableHead>
</CalendarTable>
```

### Abbreviated labels

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableHead from './CalendarTableHead.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
</script>

<CalendarTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow>
      {#each ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as d}
        <th><abbr title={d}>{d}</abbr></th>
      {/each}
    </CalendarTableRow>
  </CalendarTableHead>
</CalendarTable>
```

### Localized headers

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableHead from './CalendarTableHead.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
</script>

<CalendarTable label="Enero 2025">
  <CalendarTableHead>
    <CalendarTableRow>
      {#each days as d}<th scope="col">{d}</th>{/each}
    </CalendarTableRow>
  </CalendarTableHead>
</CalendarTable>
```

### With scope and data hooks

```svelte
<script lang="ts">
  import CalendarTableHead from './CalendarTableHead.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
</script>

<CalendarTableHead data-section="weekdays">
  <CalendarTableRow>
    <th scope="col">Mon</th>
    <th scope="col">Tue</th>
  </CalendarTableRow>
</CalendarTableHead>
```

### Full composition with body

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableHead from './CalendarTableHead.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="Feb 2025">
  <CalendarTableHead>
    <CalendarTableRow><th>Mon</th><th>Tue</th></CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow><CalendarTableTD>3</CalendarTableTD><CalendarTableTD>4</CalendarTableTD></CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

## Accessibility

- `<thead>` gives screen readers a header zone; use `<th scope="col">` for each day.
- Keyboard navigation is at the `CalendarTable` grid level.

## Related components

- `CalendarTable`, `CalendarTableBody`, `CalendarTableFoot`, `CalendarTableRow`, `CalendarTableTD`, `CalendarTableTD`.
- `DataTableHead`, `GanttTableHead`, `KanbanTableHead`, `TableHead`.
