# MeasurementSystemInput

MeasurementSystemInput is a headless Svelte 5 text input for entering a measurement system name, such as "metric", "imperial", or "SI". A measurement system is a collection of units and rules for measuring physical quantities.

## What it is

A thin `<input type="text">` wrapper for capturing a measurement-system label. It does no enumerated validation — consumers can constrain the allowed values via `list` attribute or custom logic. Part of the Input/View pattern; pairs with `MeasurementSystemView`.

## What it does

- Renders an `<input type="text">` with `class="measurement-system-input"` plus any consumer-provided CSS class.
- Applies `aria-label` from the required `label` prop.
- Provides a bindable `value` via `$bindable("")`.
- Supports `required` and `disabled` HTML states.
- Spreads `...restProps` onto the `<input>`.

## When to use it

- Capturing the name of a measurement system in a settings form.
- A free-form field where the user can type "metric", "imperial", "SI", etc.
- Paired with a `<datalist>` to suggest common system names.

## When not to use it

- Do not use for a constrained choice — use `Select` or `RadioGroup` with known system options.
- Do not use for a specific measurement value — use `MeasurementInstanceInput`.
- Do not use for display only — use `MeasurementSystemView`.

## How to use it

Import the component, pass a `label`, and bind the `value`. Optionally provide a `list` attribute to pair with a `<datalist>` of suggestions.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `value` (string, optional, default `""`) — bindable measurement system name via `bind:value`.
- `required` (boolean, optional, default `false`) — whether the input is required.
- `disabled` (boolean, optional, default `false`) — whether the input is disabled.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<input>`.

## Usage

### Basic measurement system input

```svelte
<script lang="ts">
    import MeasurementSystemInput from "./MeasurementSystemInput.svelte";
    let system = $state("");
</script>

<MeasurementSystemInput label="Measurement system" bind:value={system} />
```

### Required system input

```svelte
<script lang="ts">
    import MeasurementSystemInput from "./MeasurementSystemInput.svelte";
    let system = $state("");
</script>

<MeasurementSystemInput label="System" bind:value={system} required />
```

### With a datalist of common systems

```svelte
<script lang="ts">
    import MeasurementSystemInput from "./MeasurementSystemInput.svelte";
    let system = $state("");
</script>

<MeasurementSystemInput
    label="Measurement system"
    bind:value={system}
    list="systems"
/>
<datalist id="systems">
    <option value="metric" />
    <option value="imperial" />
    <option value="SI" />
</datalist>
```

### Disabled with a prefilled value

```svelte
<script lang="ts">
    import MeasurementSystemInput from "./MeasurementSystemInput.svelte";
    let system = $state("metric");
</script>

<MeasurementSystemInput label="System" bind:value={system} disabled />
```

### With a placeholder via restProps

```svelte
<script lang="ts">
    import MeasurementSystemInput from "./MeasurementSystemInput.svelte";
    let system = $state("");
</script>

<MeasurementSystemInput
    label="Measurement system"
    bind:value={system}
    placeholder="metric, imperial, SI…"
/>
```

## Accessibility

- `aria-label` provides the accessible name when no visible `<label>` is present.
- Native `required` and `disabled` attributes are forwarded.
- Standard browser keyboard behaviour for text editing.
- Compliant with WCAG 2.2 AAA with consumer-provided focus indicators.

## Related components

- `MeasurementSystemView` — paired read-only display of the same system name.
- `MeasurementInstanceInput` / `MeasurementInstanceView` — measurement value + unit together.
- `MeasurementUnitInput` / `MeasurementUnitView` — individual unit.
- `Select`, `RadioGroup` — constrained alternatives when only a fixed set of systems is valid.
- `TextInput` — plain text input without measurement-system semantics.

---

Lily™ and Lily Design System™ are trademarks.
