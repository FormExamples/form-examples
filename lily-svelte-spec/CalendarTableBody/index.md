# CalendarTableBody

The body section of a `CalendarTable`. Renders a `<tbody>` that holds rows of day cells.

## What it is

A headless Svelte 5 structural wrapper. Category: calendar grid structural primitive, sibling of `CalendarTableHead` and `CalendarTableFoot`; inside a `CalendarTable`.

## What it does

- Renders `<tbody class="calendar-table-body {className}">`.
- Spreads additional HTML attributes onto the `<tbody>`.
- No behavior — purely structural.

## When to use it

- Inside `CalendarTable` to hold the main body of day rows.

## When not to use it

- Outside a `CalendarTable` — use `DataTableBody`, `GanttTableBody`, `KanbanTableBody`, or `TableBody` as appropriate.

## How to use it

Import `CalendarTableBody` from `./CalendarTableBody.svelte`. Place inside `CalendarTable` and fill with `CalendarTableRow`s.

## Props

- `class` — string, default `""`. CSS class appended to `calendar-table-body`.
- `children` — `Snippet`, required. `CalendarTableRow` elements with day cells.
- `...restProps` — additional HTML attributes spread onto the `<tbody>`.

## Usage

### Minimal body

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableBody from './CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="January 2025">
  <CalendarTableBody>
    <CalendarTableRow>
      <CalendarTableTD>1</CalendarTableTD>
      <CalendarTableTD>2</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

### Multiple rows

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableBody from './CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
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

### With head and foot siblings

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableHead from '../CalendarTableHead/CalendarTableHead.svelte';
  import CalendarTableBody from './CalendarTableBody.svelte';
  import CalendarTableFoot from '../CalendarTableFoot/CalendarTableFoot.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="Feb 2025">
  <CalendarTableHead>
    <CalendarTableRow><th>Mon</th><th>Tue</th></CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow><CalendarTableTD>3</CalendarTableTD></CalendarTableRow>
  </CalendarTableBody>
  <CalendarTableFoot>
    <CalendarTableRow><CalendarTableTD>Total</CalendarTableTD></CalendarTableRow>
  </CalendarTableFoot>
</CalendarTable>
```

### With data attribute

```svelte
<CalendarTableBody data-month="january">
  <CalendarTableRow>
    <CalendarTableTD>1</CalendarTableTD>
  </CalendarTableRow>
</CalendarTableBody>
```

### Reactive rows from a date array

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableBody from './CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';

  let weeks = $state([[1, 2, 3, 4, 5, 6, 7]]);
</script>

<CalendarTable label="Week">
  <CalendarTableBody>
    {#each weeks as week}
      <CalendarTableRow>
        {#each week as d}<CalendarTableTD>{d}</CalendarTableTD>{/each}
      </CalendarTableRow>
    {/each}
  </CalendarTableBody>
</CalendarTable>
```

## Accessibility

- `<tbody>` provides structural body semantics; no ARIA override.
- Keyboard navigation is handled at the `CalendarTable` grid level.

## Related components

- `CalendarTable`, `CalendarTableHead`, `CalendarTableFoot`, `CalendarTableRow`, `CalendarTableTD`, `CalendarTableTD`.
- `DataTableBody`, `GanttTableBody`, `KanbanTableBody`, `TableBody` — sibling variants.
