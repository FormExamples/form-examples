# CalendarWeekTable

A grid of the seven days of one week as day columns.

## Canonical documentation

See [components/calendar-week-table/index.md](../../../components/calendar-week-table/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import CalendarWeekTable from "./CalendarWeekTable.svelte";
</script>

<CalendarWeekTable label="Week of 6 January 2025">
  <!-- CalendarTableHead / CalendarTableBody -->
</CalendarWeekTable>
```

## Files

- `CalendarWeekTable.svelte` — Svelte 5 implementation using runes
- `CalendarWeekTable.test.ts` — vitest + @testing-library/svelte tests
- `CalendarWeekTable.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
