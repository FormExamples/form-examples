# DateTimeNowInput

A headless composite of a date input, a time input, and a "Now" button wrapped in a grouping `<div>`. The "Now" button fills both inputs with the current local date and time in one click.

## What it is

`DateTimeNowInput` renders a `<div role="group">` containing `<input type="date">`, `<input type="time">`, and a `<button type="button">`. Date and time are bound independently through two separate bindable props, and the "Now" button sets both values using the user's local clock.

The component is fully headless: no styles, no icons, and no classes beyond the base `date-time-now-input` hook.

## What it does

- Renders a grouping `<div role="group" aria-label={label}>`.
- Renders a `<input type="date">` bound to `dateValue`.
- Renders a `<input type="time">` bound to `timeValue`.
- Renders a `<button type="button">` that sets both inputs to the current local date and time when clicked.
- Propagates `required` and `disabled` to all child controls.

## When to use it

- Incident or event logging where users should quickly capture the present moment.
- Timestamped notes, visit logs, clinical observations, audit entries.
- Any form where the user should be able to enter a specific date and time manually or "stamp" the current one.

## When not to use it

- When a single `<input type="datetime-local">` is sufficient. Use `DateTimeLocalInput` instead.
- When you do not need a "Now" affordance — use a pair of `DateInput` and `TimeInput` directly.
- When time zone awareness is required; this component captures local values only.

## How to use it

Bind both `dateValue` and `timeValue` and pass localised labels for the group, inputs, and button.

```svelte
<script lang="ts">
    import DateTimeNowInput from "./DateTimeNowInput.svelte";
    let dateValue = $state("");
    let timeValue = $state("");
</script>

<DateTimeNowInput
    label="Event time"
    bind:dateValue
    bind:timeValue
/>
```

## Props

| Prop         | Type      | Default  | Description                                      |
| ------------ | --------- | -------- | ------------------------------------------------ |
| `class`      | `string`  | `""`     | CSS class appended to the base class.           |
| `label`      | `string`  | required | Accessible name for the group via `aria-label`.  |
| `dateLabel`  | `string`  | `"Date"` | Accessible name for the date input.              |
| `timeLabel`  | `string`  | `"Time"` | Accessible name for the time input.              |
| `nowLabel`   | `string`  | `"Now"`  | Accessible label and visible text for the button.|
| `dateValue`  | `string`  | `""`     | Bindable date (`YYYY-MM-DD`).                    |
| `timeValue`  | `string`  | `""`     | Bindable time (`HH:mm`).                         |
| `required`   | `boolean` | `false`  | Whether the inputs are required.                 |
| `disabled`   | `boolean` | `false`  | Whether the inputs and button are disabled.      |
| `...rest`    | `unknown` | —        | Additional HTML attributes spread onto the `<div>`. |

## Usage

### 1. Basic now-stamp field

```svelte
<script lang="ts">
    import DateTimeNowInput from "./DateTimeNowInput.svelte";
    let dateValue = $state("");
    let timeValue = $state("");
</script>

<DateTimeNowInput label="Event time" bind:dateValue bind:timeValue />
```

### 2. Localised labels (French)

```svelte
<DateTimeNowInput
    label="Heure de l'événement"
    dateLabel="Date"
    timeLabel="Heure"
    nowLabel="Maintenant"
    bind:dateValue
    bind:timeValue
/>
```

### 3. Required and locked

```svelte
<DateTimeNowInput
    label="Appointment"
    bind:dateValue
    bind:timeValue
    required
    disabled={isLocked}
/>
```

### 4. Reset both values

```svelte
<script lang="ts">
    import DateTimeNowInput from "./DateTimeNowInput.svelte";
    let dateValue = $state("");
    let timeValue = $state("");
    function clear() { dateValue = ""; timeValue = ""; }
</script>

<DateTimeNowInput label="Observed at" bind:dateValue bind:timeValue />
<button type="button" onclick={clear}>Clear</button>
```

### 5. Inside a form with submission

```svelte
<form onsubmit={handleSubmit}>
    <DateTimeNowInput
        label="Incident time"
        bind:dateValue
        bind:timeValue
        required
    />
    <button type="submit">Log incident</button>
</form>
```

## Accessibility

- `role="group"` with `aria-label` groups the three controls semantically.
- Each control has its own `aria-label` via `dateLabel`, `timeLabel`, and `nowLabel`.
- Keyboard: Tab moves between the three controls; Enter/Space activates the "Now" button; Arrow keys operate the native pickers.

## Related components

- `DateTimeLocalInput` — single `<input type="datetime-local">` alternative.
- `DateInput`, `TimeInput` — the underlying pair without a "Now" button.
- `Form`, `Field` — form composition wrappers.
