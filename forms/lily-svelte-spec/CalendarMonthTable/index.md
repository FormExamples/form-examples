# CalendarMonthTable

A grid of the days of one month: week rows by seven day columns.

## Canonical documentation

See [components/calendar-month-table/index.md](../../../components/calendar-month-table/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import CalendarMonthTable from "./CalendarMonthTable.svelte";
</script>

<CalendarMonthTable label="January 2025">
  <!-- CalendarTableHead / CalendarTableBody -->
</CalendarMonthTable>
```

## Files

- `CalendarMonthTable.svelte` — Svelte 5 implementation using runes
- `CalendarMonthTable.test.ts` — vitest + @testing-library/svelte tests
- `CalendarMonthTable.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
