# TimePickerInput

A headless time picker wrapping a native `<input type="time">` for selecting a time of day, with `aria-label`, bindable `value`, and optional `required`/`disabled` attributes.

## What it is

`TimePickerInput` is a Svelte 5 component that renders `<input type="time">` and exposes a bindable string value in `HH:MM` format. It is typically used alongside a date picker in forms and scheduling interfaces.

## What it does

- Renders `<input type="time" class="time-picker-input {className}">`.
- Provides `aria-label={label}` for the accessible name.
- Binds `value` via `bind:value`.
- Forwards `required` and `disabled`.
- Spreads additional HTML attributes onto the `<input>` (e.g. `min`, `max`, `step`).

## When to use it

- Appointment and booking forms.
- Deadline and departure-time pickers in travel / logistics flows.
- Any form where the user picks a time of day independent of a calendar date.

## When not to use it

- Don't use it when you also need a date — use `DateTimeLocalInput` or `DateTimeNowInput`.
- Don't use it for a date-only input — use `DateInput`.
- Don't use it for time durations — use `NumberInput` with minute/second labels.
- Don't use it for countdowns or elapsed time displays — use `Timer`.

## How to use it

Import, bind `value`, and pass a translated `label`. Use `min`/`max`/`step` via rest-props to constrain the allowed values.

## Props

- `class` — string, optional. Extra CSS class appended to `time-picker-input`.
- `label` — string, required. Accessible name via `aria-label`.
- `value` — string, default `""`, bindable via `bind:value`. Time value in `HH:MM` format.
- `required` — boolean, default `false`. Whether the input is required.
- `disabled` — boolean, default `false`. Whether the input is disabled.
- `...restProps` — any additional HTML attributes spread onto the `<input>`.

## Usage

```svelte
<script lang="ts">
  import TimePickerInput from "./TimePickerInput.svelte";

  let t = $state("");
</script>

<TimePickerInput label="Appointment time" bind:value={t} />
```

```svelte
<script lang="ts">
  import TimePickerInput from "./TimePickerInput.svelte";

  let departure = $state("");
</script>

<TimePickerInput label="Departure time" bind:value={departure} required />
```

```svelte
<script lang="ts">
  import TimePickerInput from "./TimePickerInput.svelte";
  import DateInput from "../DateInput/DateInput.svelte";

  let date = $state("");
  let time = $state("");
</script>

<DateInput label="Date" bind:value={date} />
<TimePickerInput label="Time" bind:value={time} />
```

```svelte
<script lang="ts">
  import TimePickerInput from "./TimePickerInput.svelte";

  let t = $state("12:00");
</script>

<TimePickerInput
  label="Lunch slot"
  bind:value={t}
  min="11:00"
  max="14:00"
  step={900}
/>
```

## Accessibility

- `aria-label` provides the accessible name since no visible `<label>` is rendered.
- Native time input offers keyboard navigation (Arrow keys adjust segments, Tab between segments).
- The browser renders the appropriate 12-hour / 24-hour UI based on locale while the stored value is always `HH:MM`.

## Related components

- `TimeInput` — an alternative `<input type="time">` wrapper with an equivalent API.
- `DateInput` — date-only entry.
- `DateTimeLocalInput` — combined date and time.
- `DateTimeNowInput` — combined date + time with a "now" button.
