# MeasurementUnitView

MeasurementUnitView is a headless Svelte 5 display component that shows a measurement unit in a `<span>` element. A measurement unit is a standard quantity used to express a physical measurement, such as "kg", "lb", "cm", or "inch".

## What it is

A thin, unstyled `<span>` wrapper that renders a unit string with an optional `aria-label` for screen-reader context (useful for abbreviations). It is the read-only companion to `MeasurementUnitInput`.

## What it does

- Renders a `<span>` with `class="measurement-unit-view"` plus any consumer-provided CSS class.
- Displays the required `value` prop as text content.
- Applies `aria-label` from the optional `label` prop.
- Spreads `...restProps` onto the `<span>`.

## When to use it

- Displaying a measurement unit alongside a numeric value (e.g., "72" + "kg").
- Showing a stored unit next to a label in a description list, card, or table cell.
- Expanding an abbreviated unit via `label` so screen readers announce its full name.

## When not to use it

- Do not use when the value should be editable — use `MeasurementUnitInput`.
- Do not use for a measurement value — use `MeasurementInstanceView`.
- Do not use for a measurement system — use `MeasurementSystemView`.

## How to use it

Import the component, pass the unit `value`, and optionally provide a `label` with the long form for accessibility.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `value` (string, required) — the measurement unit to display.
- `label` (string, optional) — accessible name via `aria-label`.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<span>`.

## Usage

### Simple unit abbreviation

```svelte
<script lang="ts">
    import MeasurementUnitView from "./MeasurementUnitView.svelte";
</script>

<MeasurementUnitView value="kg" />
```

### With accessible long-form label

```svelte
<script lang="ts">
    import MeasurementUnitView from "./MeasurementUnitView.svelte";
</script>

<MeasurementUnitView value="lb" label="Pounds" />
```

### Beside a numeric value

```svelte
<script lang="ts">
    import MeasurementUnitView from "./MeasurementUnitView.svelte";
</script>

<p>
    Weight: 72&nbsp;<MeasurementUnitView value="kg" label="Kilograms" />
</p>
```

### In a description list

```svelte
<script lang="ts">
    import MeasurementUnitView from "./MeasurementUnitView.svelte";
</script>

<dl>
    <dt>Unit</dt>
    <dd><MeasurementUnitView value="cm" label="Centimetres" /></dd>
</dl>
```

### With a consumer CSS class

```svelte
<script lang="ts">
    import MeasurementUnitView from "./MeasurementUnitView.svelte";
</script>

<MeasurementUnitView class="unit-muted" value="mmHg" label="Millimetres of mercury" />

<style>
    :global(.unit-muted) {
        color: #6b7280;
        margin-left: 0.25rem;
    }
</style>
```

## Accessibility

- `aria-label` optionally provides the long form of an abbreviation (e.g., "kg" → "Kilograms").
- Text content is inherently accessible to screen readers.
- Compliant with WCAG 2.2 AAA when the consumer provides sufficient colour contrast.

## Related components

- `MeasurementUnitInput` — paired input for entering the same unit.
- `MeasurementInstanceView` / `MeasurementInstanceInput` — value + unit together.
- `MeasurementSystemView` / `MeasurementSystemInput` — measurement system.
- `BodyText` — general text block.
