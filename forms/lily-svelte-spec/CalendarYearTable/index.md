# CalendarYearTable

A grid of the twelve months of one year (typically 3 x 4 or 4 x 3 month cells).

## Canonical documentation

See [components/calendar-year-table/index.md](../../../components/calendar-year-table/index.md) for the full component documentation, including ARIA, keyboard interactions, props, and usage guidance.

## Svelte usage

```svelte
<script lang="ts">
  import CalendarYearTable from "./CalendarYearTable.svelte";
</script>

<CalendarYearTable label="2025">
  <!-- CalendarTableHead / CalendarTableBody -->
</CalendarYearTable>
```

## Files

- `CalendarYearTable.svelte` — Svelte 5 implementation using runes
- `CalendarYearTable.test.ts` — vitest + @testing-library/svelte tests
- `CalendarYearTable.stories.svelte` — Storybook stories

---

Lily™ and Lily Design System™ are trademarks.
