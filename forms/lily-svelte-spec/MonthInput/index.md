# MonthInput

MonthInput is a headless Svelte 5 month input that wraps a native `<input type="month">` with accessible labelling. It provides a bindable value in `YYYY-MM` format and supports required and disabled states — useful for credit-card expirations, report periods, billing cycles, or any date selection at month granularity.

## What it is

A thin wrapper around `<input type="month">`. The browser handles the picker UI and keyboard behaviour natively; this component exposes just the props needed for accessible labelling and two-way binding.

## What it does

- Renders an `<input type="month">` with `class="month-input"` plus any consumer-provided CSS class.
- Applies `aria-label` from the required `label` prop.
- Provides a bindable `value` (string, `YYYY-MM` format) via `$bindable("")`.
- Forwards `required` and `disabled` HTML attributes.
- Spreads `...restProps` onto the `<input>` — consumers typically pass `min`, `max`, `step`, or `name`.

## When to use it

- Credit-card expiration date entry.
- Report or billing cycle selection.
- Any month-level date picker (e.g., subscription start month).
- Scheduling recurring monthly events where only the month and year matter.

## When not to use it

- Do not use for a full date — use `DateInput`.
- Do not use for a time — use `TimeInput`.
- Do not use for a date + time — use `DateTimeLocalInput`.
- Do not use for week selection — use `WeekInput`.

## How to use it

Import the component, pass a `label`, and bind the `value` (which will be a `YYYY-MM` string). Optionally constrain with `min` / `max` via `restProps`.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `value` (string, optional, default `""`) — bindable month value in `YYYY-MM` format.
- `required` (boolean, optional, default `false`) — whether the input is required.
- `disabled` (boolean, optional, default `false`) — whether the input is disabled.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<input>` (for example `min`, `max`, `step`).

## Usage

### Basic month picker

```svelte
<script lang="ts">
    import MonthInput from "./MonthInput.svelte";
    let month = $state("");
</script>

<MonthInput label="Start month" bind:value={month} />
```

### Required with min/max constraints

```svelte
<script lang="ts">
    import MonthInput from "./MonthInput.svelte";
    let month = $state("");
</script>

<MonthInput
    label="Expiration"
    bind:value={month}
    required
    min="2024-01"
    max="2030-12"
/>
```

### Disabled with a preselected month

```svelte
<script lang="ts">
    import MonthInput from "./MonthInput.svelte";
    let month = $state("2025-04");
</script>

<MonthInput label="Report month" bind:value={month} disabled />
```

### Credit-card expiration

```svelte
<script lang="ts">
    import MonthInput from "./MonthInput.svelte";
    let expiration = $state("");
</script>

<MonthInput
    label="Card expiration"
    bind:value={expiration}
    required
    min="2026-04"
    name="expiration"
/>
```

### Derived date from the bound value

```svelte
<script lang="ts">
    import MonthInput from "./MonthInput.svelte";
    let month = $state("2026-01");
    const firstOfMonth = $derived(month ? `${month}-01` : "");
</script>

<MonthInput label="Start month" bind:value={month} />
<p>First day of month: {firstOfMonth}</p>
```

## Accessibility

- `aria-label` provides the accessible name in the absence of a visible `<label>`.
- Native `<input type="month">` exposes appropriate semantics and keyboard behaviour to the browser and assistive technology.
- `required` and `disabled` attributes are forwarded.
- Compliant with WCAG 2.2 AAA when the consumer provides sufficient focus indicators.

## Related components

- `DateInput` — a full date picker (`<input type="date">`).
- `WeekInput` — a week + year picker (`<input type="week">`).
- `TimeInput` — a time picker (`<input type="time">`).
- `DateTimeLocalInput` — date + time without a timezone.
- `DateTimeNowInput` — date + time with a "now" button.
- `DateRange` — display of a start/end date range.
