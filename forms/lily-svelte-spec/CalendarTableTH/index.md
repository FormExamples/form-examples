# CalendarTableTD

A column header cell within a `CalendarTable`. Renders a `<th scope="col">` element, intended to live inside a `CalendarTableRow` within `CalendarTableHead`.

## What it is

A headless Svelte 5 element rendering `<th class="calendar-table-th ..." scope="col">`, with optional `colspan` and `rowspan`. Category: calendar grid column-header primitive.

## What it does

- Renders `<th>` with `scope="col"` by default.
- Applies `colspan` / `rowspan` only when truthy.
- Accepts an alternative `scope` (e.g. `"colgroup"`).
- Renders header text via `children`.
- Spreads additional HTML attributes onto the `<th>`.

## When to use it

- For day-of-week labels and other column headers in a calendar grid.
- For grouped headers spanning multiple day columns via `colspan`.

## When not to use it

- For data cells — use `CalendarTableTD`.
- For row headers — use a `<th scope="row">` directly inside `CalendarTableRow`.
- For column-wide styling hooks via `<colgroup>` / `<col>` — write those directly inside `CalendarTable`.

## How to use it

Import `CalendarTableTD` and place inside a `CalendarTableRow` within `CalendarTableHead`.

## Props

- `class` — string, default `""`. CSS class appended to `calendar-table-th`.
- `colspan` — number, optional. Number of columns this header spans.
- `rowspan` — number, optional. Number of rows this header spans.
- `scope` — `"col" | "row" | "colgroup" | "rowgroup"`, default `"col"`.
- `children` — Snippet, optional. Header cell content.
- `...restProps` — additional HTML attributes spread onto the `<th>`.

## Usage

### Day-of-week headers

```svelte
<script lang="ts">
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableHead from '../CalendarTableHead/CalendarTableHead.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from './CalendarTableTD.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarTable label="January 2025">
  <CalendarTableHead>
    <CalendarTableRow>
      <CalendarTableTD>Sun</CalendarTableTD>
      <CalendarTableTD>Mon</CalendarTableTD>
      <CalendarTableTD>Tue</CalendarTableTD>
      <CalendarTableTD>Wed</CalendarTableTD>
      <CalendarTableTD>Thu</CalendarTableTD>
      <CalendarTableTD>Fri</CalendarTableTD>
      <CalendarTableTD>Sat</CalendarTableTD>
    </CalendarTableRow>
  </CalendarTableHead>
  <CalendarTableBody>
    <CalendarTableRow>
      {#each [1, 2, 3, 4, 5, 6, 7] as d}
        <CalendarTableTD>{d}</CalendarTableTD>
      {/each}
    </CalendarTableRow>
  </CalendarTableBody>
</CalendarTable>
```

### Spanned header

```svelte
<CalendarTableHead>
  <CalendarTableRow>
    <CalendarTableTD colspan={5} scope="colgroup">Weekdays</CalendarTableTD>
    <CalendarTableTD colspan={2} scope="colgroup">Weekend</CalendarTableTD>
  </CalendarTableRow>
</CalendarTableHead>
```

## Accessibility

- `<th scope="col">` associates the header with its column for assistive tech.
- Use `scope="colgroup"` together with `colspan` for grouped column headers.

## Related components

- `CalendarTable`, `CalendarTableHead`, `CalendarTableBody`, `CalendarTableFoot`, `CalendarTableRow`, `CalendarTableTD`.
- `DataTableTD`, `GanttTableTH`, `KanbanTableTD`, `TableTD` — sibling header-cell components in other tables.
