# CalendarRangePicker

A headless container for calendar-based date-range selection. Renders a `<div role="application">` with a required `aria-label`. Provides the semantic shell; the consumer supplies the calendar grid, range highlighting, and keyboard interactions.

## What it is

A headless Svelte 5 wrapper intended to host a `CalendarTable` (or similar) with custom selection logic. Category: date-picking primitive alongside `CalendarTable`, `DateInput`, `DateRange`, and `DateTimeLocalInput`.

## What it does

- Renders `<div class="calendar-range-picker {className}" role="application" aria-label={label}>`.
- Applies `role="application"` to signal that the widget manages its own keyboard interactions instead of standard document navigation.
- Spreads additional HTML attributes onto the `<div>`.

## When to use it

- Booking systems, travel planners, analytics reports where users pick start + end dates.
- Any custom calendar UI that wraps a `CalendarTable` with range-selection behavior.

## When not to use it

- For a single-day picker — use `DateInput`.
- For displaying a fixed range — use `DateRange`.
- For a full calendar grid — use `CalendarTable`.
- For month/week-only pickers — use `MonthInput` / `WeekInput`.

## How to use it

Import `CalendarRangePicker` from `./CalendarRangePicker.svelte`. Pass `label`. Compose the inner grid and custom keyboard/selection logic yourself.

## Props

- `class` — string, default `""`. CSS class appended after the base `calendar-range-picker` class.
- `label` — string, required. Accessible name via `aria-label`.
- `children` — `Snippet`, required. Calendar grid content.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Basic range picker with a CalendarTable

```svelte
<script lang="ts">
  import CalendarRangePicker from './CalendarRangePicker.svelte';
  import CalendarTable from '../CalendarTable/CalendarTable.svelte';
  import CalendarTableHead from '../CalendarTableHead/CalendarTableHead.svelte';
  import CalendarTableBody from '../CalendarTableBody/CalendarTableBody.svelte';
  import CalendarTableRow from '../CalendarTableRow/CalendarTableRow.svelte';
  import CalendarTableTD from '../CalendarTableTD/CalendarTableTD.svelte';
</script>

<CalendarRangePicker label="Select travel dates">
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
  </CalendarTable>
</CalendarRangePicker>
```

### Range state managed by consumer

```svelte
<script lang="ts">
  import CalendarRangePicker from './CalendarRangePicker.svelte';

  let start = $state<Date | null>(null);
  let end = $state<Date | null>(null);

  function onkeydown(e: KeyboardEvent) {
    // consumer implements arrow key navigation and Enter/Space selection
  }
</script>

<CalendarRangePicker label="Select dates" {onkeydown}>
  <div>
    Start: {start?.toDateString() ?? 'none'} — End: {end?.toDateString() ?? 'none'}
  </div>
</CalendarRangePicker>
```

### Localized label

```svelte
<script lang="ts">
  import CalendarRangePicker from './CalendarRangePicker.svelte';

  const label = 'Seleccionar fechas de viaje';
</script>

<CalendarRangePicker {label}>
  <p>Cuadrícula del calendario</p>
</CalendarRangePicker>
```

### With testing hooks

```svelte
<script lang="ts">
  import CalendarRangePicker from './CalendarRangePicker.svelte';
</script>

<CalendarRangePicker label="Date range" data-testid="range-picker" id="rp">
  <p>...</p>
</CalendarRangePicker>
```

## Accessibility

- `role="application"` tells screen readers the widget handles its own key handling; the consumer must implement arrow-key navigation, Enter/Space selection, and range extension (e.g. Shift+click).
- `aria-label` names the picker.
- Focus management and range highlighting are the consumer's responsibility.
- Follows the WAI-ARIA Application role and Grid pattern guidance.

## Related components

- `CalendarTable` + `CalendarTableHead`/`Body`/`Foot`/`Row`/`Data`/`Col` — the grid components.
- `DateInput`, `DateRange`, `DateField`, `DateTimeLocalInput`, `DateTimeNowInput`, `MonthInput`, `WeekInput` — related date inputs.
- `TimePickerInput`, `TimeInput` — time-selection counterparts.
