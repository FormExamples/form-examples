# DateField

A headless date field with a visible label, an `<input type="date">`, and optional description and error messages — all wired up with auto-generated IDs for accessible ARIA relationships.

## What it is

DateField renders a `<div>` wrapper containing a `<label>`, an `<input type="date">` with `bind:value`, and conditional `<p>` elements for description and error. It auto-generates a stable input ID if one is not provided, and derives `descriptionId` and `errorId` from it using `$derived()`.

When `error` is set, the input receives `aria-invalid="true"` and `aria-errormessage={errorId}`, and the error paragraph has `role="alert"`.

## What it does

- Renders a labelled date input.
- Optionally renders a description paragraph linked via `aria-describedby`.
- Optionally renders an error paragraph with `role="alert"`, linked via `aria-errormessage`.
- Supports two-way binding on `value` (YYYY-MM-DD).

## When to use it

- Form inputs for dates (DOB, due dates, start/end) that need full labelling and validation.
- When you want native date picking with graceful description and error display.

## When not to use it

- For bare date inputs without extra scaffolding — use `DateInput`.
- For ranges — use `DateRange`.
- For time-only — use `TimeInput` or `TimePickerInput`.

## How to use it

Bind `value`. Provide `label`. Pass `error` on validation failure; the alert will be announced.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `label` | `string` | required | Visible label. |
| `value` | `string` | `""` (bindable) | Date value in YYYY-MM-DD. |
| `description` | `string` | `undefined` | Helper text below the input. |
| `error` | `string` | `undefined` | Error message; triggers `aria-invalid`. |
| `required` | `boolean` | `false` | Marks the field required. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `id` | `string` | `undefined` | Custom input ID; auto-generated if omitted. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the wrapper `<div>`. |

## Usage

```svelte
<script lang="ts">
    import DateField from "./DateField.svelte";

    let start = $state("");
</script>

<DateField label="Start date" bind:value={start} />
```

```svelte
<script lang="ts">
    import DateField from "./DateField.svelte";

    let end = $state("");
    let error = $derived(end === "" ? "Please choose a date." : undefined);
</script>

<DateField label="End date" bind:value={end} {error} required />
```

```svelte
<script lang="ts">
    import DateField from "./DateField.svelte";

    let birthday = $state("");
</script>

<DateField label="Birthday" bind:value={birthday} description="Format: YYYY-MM-DD" />
```

```svelte
<script lang="ts">
    import DateField from "./DateField.svelte";

    let deadline = $state("");
</script>

<DateField
    label="Deadline"
    id="deadline-field"
    bind:value={deadline}
    description="Must be a future date."
/>
```

## Accessibility

- `<label for=...>` binds the visible label to the input.
- `aria-describedby` links the input to its description.
- `aria-invalid` and `aria-errormessage` link the input to the error.
- `role="alert"` announces error messages to screen readers.

## Related components

- `DateInput` — bare `<input type="date">`.
- `DateRange` — paired start/end date inputs.
- `Field` — generic field wrapper for any input.

---

Lily™ and Lily Design System™ are trademarks.
