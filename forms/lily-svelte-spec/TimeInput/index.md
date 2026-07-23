# TimeInput

A headless time input rendered as a native `<input type="time">` with `aria-label`, bindable `value` in `HH:MM` format, and optional `required`/`disabled` attributes.

## What it is

`TimeInput` is a Svelte 5 component wrapping `<input type="time">`. It surfaces the browser's native time picker UI and provides a bindable string value in 24-hour `HH:MM` format.

## What it does

- Renders `<input type="time" class="time-input {className}">`.
- Sets `aria-label={label}` as the accessible name.
- Binds `value` via `bind:value`.
- Forwards `required` and `disabled`.
- Spreads additional HTML attributes onto the `<input>` (e.g. `min`, `max`, `step`, `id`).

## When to use it

- Scheduling forms (start/end times, deadlines, appointments).
- Event planners and booking systems.
- Any form where the user must select a specific time of day.

## When not to use it

- Don't use it for a date and time together — use `DateTimeLocalInput`.
- Don't use it for a date only — use `DateInput`.
- Don't use it for durations — use `NumberInput` with a unit label.
- Don't use it for time ranges — combine two `TimeInput` instances or use a range picker.

## How to use it

Import, bind `value`, and pass a translated `label`. Optionally constrain the allowed range with `min`/`max`/`step`.

## Props

- `class` — string, optional. Extra CSS class appended to `time-input`.
- `label` — string, required. Accessible name via `aria-label`.
- `value` — string, default `""`, bindable via `bind:value`. Time value in `HH:MM` format.
- `required` — boolean, default `false`. Whether the field is required.
- `disabled` — boolean, default `false`. Whether the field is disabled.
- `...restProps` — any additional HTML attributes spread onto the `<input>`.

## Usage

```svelte
<script lang="ts">
  import TimeInput from "./TimeInput.svelte";

  let start = $state("");
</script>

<TimeInput label="Start time" bind:value={start} />
```

```svelte
<script lang="ts">
  import TimeInput from "./TimeInput.svelte";

  let deadline = $state("");
</script>

<TimeInput
  label="Deadline"
  bind:value={deadline}
  min="09:00"
  max="17:00"
  required
/>
```

```svelte
<script lang="ts">
  import TimeInput from "./TimeInput.svelte";

  let start = $state("09:00");
  let end = $state("17:00");
</script>

<TimeInput label="Open from" bind:value={start} />
<TimeInput label="Open until" bind:value={end} min={start} />
```

```svelte
<script lang="ts">
  import TimeInput from "./TimeInput.svelte";

  let value = $state("12:30");
  let locked = $state(true);
</script>

<TimeInput label="Reminder time" bind:value={value} disabled={locked} />
<button type="button" onclick={() => (locked = !locked)}>
  {locked ? "Edit" : "Lock"}
</button>
```

## Accessibility

- `aria-label` provides the accessible name since no visible `<label>` is rendered.
- Native `<input type="time">` supports Arrow key adjustment of hour/minute segments and Tab between them.
- Time is always stored internally in 24-hour `HH:MM` format; the browser may present 12-hour UI based on locale.

## Related components

- `TimePickerInput` — similar but framed as a picker wrapper with separate stories.
- `DateInput` — date-only input.
- `DateTimeLocalInput` — combined date + time.
- `DateTimeNowInput` — date + time with a "now" button.

---

Lily™ and Lily Design System™ are trademarks.
