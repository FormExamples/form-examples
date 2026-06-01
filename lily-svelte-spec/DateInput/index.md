# DateInput

A headless date input — a minimal wrapper around the native `<input type="date">` with `aria-label` for accessibility. The value is a YYYY-MM-DD string with two-way binding support.

## What it is

DateInput renders a bare `<input type="date">` with `aria-label={label}` and `bind:value`. It supports `min`/`max` constraints, `required`, and `disabled`. The browser provides the native date picker UI.

## What it does

- Renders `<input type="date" aria-label={label}>`.
- Two-way binds `value` via `$bindable()`.
- Forwards `min`, `max`, `required`, `disabled` to the input.
- Spreads `restProps` onto the input.

## When to use it

- Where you need a compact date input without a visible label.
- Inside your own custom field layout.
- Composed with other controls in a row.

## When not to use it

- When you need an integrated label, description, and error — use `DateField`.
- For a start/end pair — use `DateRange`.
- For datetime with time zones — see `DateTimeLocalInput` or custom.

## How to use it

Provide `label` (used as `aria-label`). Bind `value` to a `$state` variable.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | `aria-label`. |
| `value` | `string` | `""` (bindable) | Date in YYYY-MM-DD. |
| `min` | `string` | `undefined` | Minimum date (YYYY-MM-DD). |
| `max` | `string` | `undefined` | Maximum date (YYYY-MM-DD). |
| `required` | `boolean` | `false` | Marks the input required. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<input>`. |

## Usage

```svelte
<script lang="ts">
    import DateInput from "./DateInput.svelte";

    let date = $state("");
</script>

<DateInput label="Birth date" bind:value={date} />
```

```svelte
<script lang="ts">
    import DateInput from "./DateInput.svelte";

    let due = $state("");
</script>

<DateInput label="Deadline" bind:value={due} min="2024-01-01" max="2024-12-31" />
```

```svelte
<script lang="ts">
    import DateInput from "./DateInput.svelte";

    let date = $state("");
    let locked = $state(false);
</script>

<DateInput label="Start date" bind:value={date} required disabled={locked} />
```

```svelte
<script lang="ts">
    import DateInput from "./DateInput.svelte";

    let start = $state("");
    let end = $state("");
</script>

<label>
    Start
    <DateInput label="Start date" bind:value={start} />
</label>
<label>
    End
    <DateInput label="End date" bind:value={end} min={start} />
</label>
```

## Accessibility

- `aria-label` names the input; pair with a visible `<label>` if needed.
- Native date picker supports keyboard interaction.

## Related components

- `DateField` — date input with label/description/error.
- `DateRange` — start/end pair.
- `DateTimeLocalInput`, `MonthInput`, `WeekInput`, `TimeInput` — related input types.
