# CalendarDayTable

A grid of the time slots of one day: one row per slot.

## Canonical documentation

See [components/calendar-day-table/index.md](../../../components/calendar-day-table/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import CalendarDayTable from "./CalendarDayTable.svelte";
</script>

<CalendarDayTable label="Monday 6 January 2025">
  <!-- CalendarTableHead / CalendarTableBody -->
</CalendarDayTable>
```

## Files

- `CalendarDayTable.svelte` — Svelte 5 implementation using runes
- `CalendarDayTable.test.ts` — vitest + @testing-library/svelte tests
- `CalendarDayTable.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
