# MeasurementInstanceView

MeasurementInstanceView is a headless Svelte 5 display component that shows a measurement instance value in a `<span>` element. A measurement instance is a concrete data point such as "72 kg", "98.6 F", or "120/80 mmHg". It is the read-only companion to `MeasurementInstanceInput`.

## What it is

A thin, unstyled `<span>` wrapper that renders a measurement string and optionally adds an `aria-label` for extra context.

## What it does

- Renders a `<span>` with `class="measurement-instance-view"` plus any consumer-provided CSS class.
- Displays the required `value` prop as text content.
- Applies `aria-label` from the optional `label` prop (omitted when not provided).
- Spreads `...restProps` onto the `<span>`.

## When to use it

- Displaying a previously-recorded measurement on a summary screen, patient record, or printable view.
- Showing a stored measurement next to a label in a description list or card.
- Confirming a submitted measurement back to the user in a review step.

## When not to use it

- Do not use when the value should be editable — use `MeasurementInstanceInput`.
- Do not use for free-form text unrelated to measurements — use a plain `<span>` or `BodyText`.

## How to use it

Import the component, pass the `value` string, and optionally provide a `label` for additional screen-reader context.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `value` (string, required) — the measurement instance value to display.
- `label` (string, optional) — accessible name via `aria-label`.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<span>`.

## Usage

### Simple measurement display

```svelte
<script lang="ts">
    import MeasurementInstanceView from "./MeasurementInstanceView.svelte";
</script>

<MeasurementInstanceView value="72 kg" />
```

### With an accessible label

```svelte
<script lang="ts">
    import MeasurementInstanceView from "./MeasurementInstanceView.svelte";
</script>

<MeasurementInstanceView value="98.6 F" label="Body temperature" />
```

### Inside a description list

```svelte
<script lang="ts">
    import MeasurementInstanceView from "./MeasurementInstanceView.svelte";
</script>

<dl>
    <dt>Weight</dt>
    <dd><MeasurementInstanceView value="72 kg" label="Weight" /></dd>
    <dt>Height</dt>
    <dd><MeasurementInstanceView value="178 cm" label="Height" /></dd>
</dl>
```

### With a consumer CSS class

```svelte
<script lang="ts">
    import MeasurementInstanceView from "./MeasurementInstanceView.svelte";
</script>

<MeasurementInstanceView class="value-strong" value="120/80 mmHg" label="Blood pressure" />

<style>
    :global(.value-strong) {
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }
</style>
```

### Bound from state

```svelte
<script lang="ts">
    import MeasurementInstanceView from "./MeasurementInstanceView.svelte";
    let reading = $state("36.7 C");
</script>

<MeasurementInstanceView value={reading} label="Latest temperature" />
```

## Accessibility

- `aria-label` optionally provides context beyond the displayed value.
- Text content is inherently accessible to screen readers.
- Compliant with WCAG 2.2 AAA when consumer provides sufficient colour contrast.

## Related components

- `MeasurementInstanceInput` — paired input for entering the same measurement.
- `MeasurementSystemView` / `MeasurementSystemInput` — measurement system.
- `MeasurementUnitView` / `MeasurementUnitInput` — measurement unit.
- `BodyText` — general text block.
