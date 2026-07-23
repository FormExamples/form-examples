# WeekInput

A headless week input built on the native HTML `<input type="week">` element. It renders a week picker control for selecting a specific week of the year, with values in ISO 8601 `YYYY-Www` format (for example `"2024-W01"`).

## What it is

A thin, unstyled wrapper around `<input type="week">`. The component owns no CSS, no visual styling, no placeholder, and no validation messaging — consumers supply all of those.

## What it does

- Renders `<input type="week">` with `aria-label` set from the `label` prop.
- Supports `bind:value` via Svelte 5 `$bindable("")`; value is an ISO 8601 week string.
- Passes through `required` and `disabled`.
- Spreads any additional HTML attributes (such as `name`, `id`, `min`, `max`) onto the native element.

## When to use it

- Scheduling tools where data is organized by week (weekly planners, timesheets).
- Report filters that select a reporting week rather than a specific date.
- Editorial or sports schedules organized around ISO 8601 weeks.

## When not to use it

- Selecting a specific date — use `DateInput`.
- Selecting a month — use `MonthInput`.
- Selecting a date range — use `DateRange` or `CalendarRangePicker`.
- When browser support for `<input type="week">` must be uniform; browsers may fall back to a plain text input.

## How to use it

Import the component, bind `value`, and supply an accessible `label`. Wrap in `Field` for visible labels, hints, and errors.

## Props

| Prop        | Type      | Default | Description                                                              |
| ----------- | --------- | ------- | ------------------------------------------------------------------------ |
| `class`     | `string`  | `""`    | Additional CSS class appended to the base class name.                    |
| `label`     | `string`  | —       | Required. Accessible name set on `aria-label`.                           |
| `value`     | `string`  | `""`    | Bindable week value in `YYYY-Www` format. Supports `bind:value`.         |
| `required`  | `boolean` | `false` | Sets the native `required` attribute.                                    |
| `disabled`  | `boolean` | `false` | Sets the native `disabled` attribute.                                    |
| `...rest`   | —         | —       | Additional HTML attributes (e.g., `min`, `max`), spread onto the input.  |

## Usage

```svelte
<script lang="ts">
    import WeekInput from "./WeekInput.svelte";

    let week = $state("");
</script>

<WeekInput label="Report week" bind:value={week} />
```

```svelte
<script lang="ts">
    import WeekInput from "./WeekInput.svelte";

    let week = $state("2024-W15");
</script>

<WeekInput
    label="Select week"
    bind:value={week}
    required
    min="2024-W01"
    max="2024-W52"
/>
```

```svelte
<script lang="ts">
    import WeekInput from "./WeekInput.svelte";
    import Field from "../Field/Field.svelte";

    let reportWeek = $state("");
    let error = $state("");
</script>

<Field label="Report week" required error={error}>
    <WeekInput label="Report week" bind:value={reportWeek} required />
</Field>
```

```svelte
<script lang="ts">
    import WeekInput from "./WeekInput.svelte";

    let week = $state("2024-W20");
</script>

<WeekInput label="Week" bind:value={week} />
<p>Selected: {week || "(none)"}</p>
```

```svelte
<script lang="ts">
    import WeekInput from "./WeekInput.svelte";
</script>

<WeekInput label="Read-only week" value="2024-W10" disabled />
```

## Accessibility

- `aria-label` is set from `label`, providing the accessible name when no visible `<label for>` element is associated.
- Native keyboard handling:
  - `Arrow Up` / `Arrow Down` adjust the focused segment (year or week number).
  - `Arrow Left` / `Arrow Right` move between year and week segments.
  - `Enter` confirms (varies by browser).
- When wrapped in `Field`, prefer an associated visible label plus `aria-describedby` for hint/error text.
- Consumer CSS must provide a visible focus indicator meeting WCAG 2.2 AAA contrast.
- Browser support varies; some browsers show a native picker while others fall back to a text input. Supply format hints in the visible label or hint for fallback cases.

## Related components

- `DateInput` — single date entry.
- `MonthInput` — month-and-year entry.
- `DateTimeLocalInput` — combined date and time entry.
- `DateRange` / `CalendarRangePicker` — date-range selection.
- `Field` — wraps the input with a visible label, hint, and error message.
- `Form` — form element for submission.

---

Lily™ and Lily Design System™ are trademarks.
