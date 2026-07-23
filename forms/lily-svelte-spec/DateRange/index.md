# DateRange

A headless paired start/end date range control. It renders a `<fieldset aria-label>` containing two native `<input type="date">` elements, each with its own `aria-label`. Both `start` and `end` are bindable.

## What it is

DateRange renders:

```html
<fieldset aria-label={label}>
  <input type="date" aria-label={startLabel} bind:value={start} />
  <input type="date" aria-label={endLabel} bind:value={end} />
</fieldset>
```

It groups two date inputs semantically under a shared label.

## What it does

- Renders a `<fieldset>` with `aria-label`.
- Renders two `<input type="date">` elements with individual `aria-label`s.
- Two-way binds `start` and `end`.

## When to use it

- Date ranges in booking forms, reports, timelines, filters.
- Any UI where a pair of related dates must be labelled together.

## When not to use it

- For a single date — use `DateField` or `DateInput`.
- For more complex range pickers with a calendar — use `CalendarRangePicker`.
- For a datetime range — compose `DateTimeLocalInput` manually.

## How to use it

Provide three labels: `label` (group), `startLabel`, `endLabel`. Bind `start` and `end` to `$state` strings.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | Group `aria-label` on the `<fieldset>`. |
| `startLabel` | `string` | required | `aria-label` for the start input. |
| `endLabel` | `string` | required | `aria-label` for the end input. |
| `start` | `string` | `""` (bindable) | Start date (YYYY-MM-DD). |
| `end` | `string` | `""` (bindable) | End date (YYYY-MM-DD). |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<fieldset>`. |

## Usage

```svelte
<script lang="ts">
    import DateRange from "./DateRange.svelte";

    let start = $state("");
    let end = $state("");
</script>

<DateRange
    label="Trip dates"
    startLabel="Departure"
    endLabel="Return"
    bind:start
    bind:end
/>
```

```svelte
<script lang="ts">
    import DateRange from "./DateRange.svelte";

    let start = $state("");
    let end = $state("");
</script>

<DateRange
    label="Project timeline"
    startLabel="Start date"
    endLabel="End date"
    bind:start
    bind:end
/>
<p>From {start} to {end}</p>
```

```svelte
<script lang="ts">
    import DateRange from "./DateRange.svelte";

    let start = $state("2025-01-01");
    let end = $state("2025-01-31");
</script>

<DateRange
    label="January"
    startLabel="Start"
    endLabel="End"
    bind:start
    bind:end
/>
```

```svelte
<script lang="ts">
    import DateRange from "./DateRange.svelte";

    let start = $state("");
    let end = $state("");

    function submit(e: SubmitEvent) {
        e.preventDefault();
        console.log({ start, end });
    }
</script>

<form onsubmit={submit}>
    <DateRange
        label="Booking window"
        startLabel="Check-in"
        endLabel="Check-out"
        bind:start
        bind:end
    />
    <button type="submit">Search</button>
</form>
```

## Accessibility

- `<fieldset aria-label>` groups the two inputs semantically.
- Each input has its own `aria-label` for screen-reader navigation.
- Native `<input type="date">` provides the date picker UI and keyboard support.
- Consider adding `min={start}` on the end input to enforce chronological order.

## Related components

- `DateField` — single date with description and error.
- `DateInput` — single bare date input.
- `CalendarRangePicker` — full calendar-based range picker.

---

Lily™ and Lily Design System™ are trademarks.
