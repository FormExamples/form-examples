# DateTimeLocalInput

A headless native datetime-local input wrapping `<input type="datetime-local">` that captures both a date and a time (without time zone) in a single form field, using the browser-native picker UI.

## What it is

`DateTimeLocalInput` is a thin, unstyled Svelte 5 wrapper around the native HTML `<input type="datetime-local">` element. It provides an accessible `aria-label`, a bindable value, and optional `min`/`max` bounds. The component renders a single `<input>` with no surrounding markup, so every aspect of presentation is left to the consumer.

The value follows the canonical `YYYY-MM-DDThh:mm` format used by the platform. The browser supplies the calendar and clock pop-up.

## What it does

- Renders `<input type="datetime-local">` with the supplied `aria-label`.
- Supports two-way binding of the datetime string via `$bindable()`.
- Forwards `min`, `max`, `required`, and `disabled` to the native input.
- Spreads `restProps` onto the `<input>` for escape-hatch attributes (`name`, `id`, `data-*`, event handlers, etc.).

## When to use it

- Scheduling interfaces, appointment booking, event creation forms.
- Incident timestamps or any field that must capture both a calendar date and a clock time together.
- Wherever the user's locale and system picker should drive the selection UI.

## When not to use it

- When you need separate inputs with a "Now" button. Use `DateTimeNowInput` instead.
- When you need a time-zone-aware value. DateTime-local values are naive.
- When you only need a date (use `DateInput`) or only a time (use `TimeInput`).

## How to use it

Import the component and bind a string value in `YYYY-MM-DDThh:mm` format.

```svelte
<script lang="ts">
    import DateTimeLocalInput from "./DateTimeLocalInput.svelte";
    let when = $state("");
</script>

<DateTimeLocalInput label="Event start" bind:value={when} />
```

## Props

| Prop        | Type      | Default     | Description                                        |
| ----------- | --------- | ----------- | -------------------------------------------------- |
| `class`     | `string`  | `""`        | CSS class name appended to the base class.        |
| `label`     | `string`  | required    | Accessible name applied via `aria-label`.          |
| `value`     | `string`  | `""`        | Bindable datetime string (`YYYY-MM-DDThh:mm`).     |
| `min`       | `string`  | `undefined` | Minimum allowed datetime.                          |
| `max`       | `string`  | `undefined` | Maximum allowed datetime.                          |
| `required`  | `boolean` | `false`     | Whether the input is required.                     |
| `disabled`  | `boolean` | `false`     | Whether the input is disabled.                     |
| `...rest`   | `unknown` | —           | Additional HTML attributes spread onto the input. |

## Usage

### 1. Basic two-way binding

```svelte
<script lang="ts">
    import DateTimeLocalInput from "./DateTimeLocalInput.svelte";
    let start = $state("");
</script>

<DateTimeLocalInput label="Event start" bind:value={start} />
<p>Starts at: {start}</p>
```

### 2. Constrained range

```svelte
<script lang="ts">
    import DateTimeLocalInput from "./DateTimeLocalInput.svelte";
    let appointment = $state("");
</script>

<DateTimeLocalInput
    label="Appointment"
    bind:value={appointment}
    min="2026-01-01T08:00"
    max="2026-12-31T18:00"
/>
```

### 3. Required within a form

```svelte
<script lang="ts">
    import DateTimeLocalInput from "./DateTimeLocalInput.svelte";
    let departure = $state("");
</script>

<form>
    <DateTimeLocalInput label="Departure time" bind:value={departure} required />
    <button type="submit">Book</button>
</form>
```

### 4. Conditionally disabled

```svelte
<script lang="ts">
    import DateTimeLocalInput from "./DateTimeLocalInput.svelte";
    let meeting = $state("");
    let isLocked = $state(true);
</script>

<DateTimeLocalInput label="Meeting" bind:value={meeting} disabled={isLocked} />
```

### 5. With name and custom class

```svelte
<DateTimeLocalInput
    label="Deadline"
    bind:value={deadline}
    name="deadline"
    class="deadline-input"
/>
```

## Accessibility

- `aria-label` provides the accessible name because the component does not ship a visible `<label>` element.
- Keyboard behaviour, picker UI, and localisation all come from the browser's native datetime-local implementation.
- `required` and `disabled` states are communicated to assistive technology through standard HTML.

## Related components

- `DateTimeNowInput` — separate date + time inputs with a "Now" button.
- `DateInput` — date-only input.
- `TimeInput` — time-only input.
- `MonthInput`, `WeekInput` — alternative partial-date pickers.
