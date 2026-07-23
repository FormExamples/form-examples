# MeasurementUnitInput

MeasurementUnitInput is a headless Svelte 5 text input for entering a measurement unit, such as "kg", "lb", "cm", "inch", "F", or "C". A measurement unit is a standard quantity used to express a physical measurement.

## What it is

A thin wrapper around `<input type="text">` for capturing a measurement unit as a free-form string. It does no enumeration or validation of valid units — consumers can constrain values via `list` or `pattern` attributes. Part of the Input/View pattern; pairs with `MeasurementUnitView`.

## What it does

- Renders an `<input type="text">` with `class="measurement-unit-input"` plus any consumer-provided CSS class.
- Applies `aria-label` from the required `label` prop.
- Provides a bindable `value` via `$bindable("")`.
- Supports `required` and `disabled` HTML states.
- Spreads `...restProps` onto the `<input>`.

## When to use it

- Capturing a measurement unit as text alongside a separate numeric value.
- Flexible entry where the consumer wants to support arbitrary units.
- Paired with a `<datalist>` of common units for suggestions.

## When not to use it

- Do not use when only one unit is allowed — hardcode it in labels/display.
- Do not use for a measurement value — use `NumberInput` or `MeasurementInstanceInput`.
- Do not use for a fixed set of choices — use `Select`.

## How to use it

Import the component, pass a `label`, and bind the `value`. Optionally combine with a `<datalist>` for suggestions.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `value` (string, optional, default `""`) — bindable measurement unit via `bind:value`.
- `required` (boolean, optional, default `false`) — whether the input is required.
- `disabled` (boolean, optional, default `false`) — whether the input is disabled.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<input>`.

## Usage

### Basic unit input

```svelte
<script lang="ts">
    import MeasurementUnitInput from "./MeasurementUnitInput.svelte";
    let unit = $state("");
</script>

<MeasurementUnitInput label="Unit" bind:value={unit} />
```

### Required unit input

```svelte
<script lang="ts">
    import MeasurementUnitInput from "./MeasurementUnitInput.svelte";
    let unit = $state("");
</script>

<MeasurementUnitInput label="Unit of measure" bind:value={unit} required />
```

### Paired with a numeric value

```svelte
<script lang="ts">
    import MeasurementUnitInput from "./MeasurementUnitInput.svelte";
    let amount = $state("");
    let unit = $state("");
</script>

<label>
    Amount
    <input type="number" bind:value={amount} />
</label>
<MeasurementUnitInput label="Unit" bind:value={unit} />
```

### With datalist suggestions

```svelte
<script lang="ts">
    import MeasurementUnitInput from "./MeasurementUnitInput.svelte";
    let unit = $state("");
</script>

<MeasurementUnitInput label="Unit" bind:value={unit} list="units" />
<datalist id="units">
    <option value="kg" />
    <option value="lb" />
    <option value="cm" />
    <option value="in" />
</datalist>
```

### Disabled with a prefilled unit

```svelte
<script lang="ts">
    import MeasurementUnitInput from "./MeasurementUnitInput.svelte";
    let unit = $state("kg");
</script>

<MeasurementUnitInput label="Unit" bind:value={unit} disabled />
```

## Accessibility

- `aria-label` supplies an accessible name when no visible `<label>` is present.
- Native `required` and `disabled` attributes are forwarded.
- Standard browser keyboard behaviour for text editing.
- Compliant with WCAG 2.2 AAA with consumer-provided focus indicators.

## Related components

- `MeasurementUnitView` — paired read-only display of the same unit.
- `MeasurementInstanceInput` / `MeasurementInstanceView` — value + unit together.
- `MeasurementSystemInput` / `MeasurementSystemView` — measurement system.
- `Select` — constrained alternative when the unit must come from a fixed list.
- `TextInput` — plain text input without measurement-unit semantics.

---

Lily™ and Lily Design System™ are trademarks.
