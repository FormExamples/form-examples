# RedAmberGreenRadioInput

A headless bare `<input type="radio">` without a wrapping label, for custom red-amber-green-radio-group layouts where labels are positioned separately or provided by the container.

## What it is

- Component: `RedAmberGreenRadioInput`
- HTML element: `<input type="radio">`
- Role: native `radio`
- Category: form input (used inside `RedAmberGreenRadioGroup`)

## What it does

- Renders a native radio input.
- Applies `aria-label` as the accessible name.
- Supports `name`, `value`, `checked`, and `disabled` via native attributes.
- Forwards any other attributes (e.g. `bind:group`, event handlers) onto the `<input>`.

## When to use it

- Inside a `RedAmberGreenRadioGroup` when you want custom layout (cards, tiles, segmented buttons) where the visible label is rendered separately.
- When you need a bare radio element without a native `<label>` wrapper.

## When not to use it

- For a labeled radio with a visible text label — wrap a native `<input type="radio">` inside a `<label>` element, or use a different component.
- For multi-select — use a checkbox, `CheckboxInput`, or `CheckboxGroup`.
- For a toggle — use `SwitchButton`.

## How to use it

Import and place inside a `RedAmberGreenRadioGroup`. Use the same `name` across radios to make them mutually exclusive.

```svelte
import RedAmberGreenRadioInput from './RedAmberGreenRadioInput.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `red-amber-green-radio-input`.
- `label`: string, required. Accessible name via `aria-label`.
- `name`: string, optional. Radio group name for mutual exclusion.
- `value`: string, optional. The value representing this option.
- `checked`: boolean, default `false`. Whether this radio is selected.
- `disabled`: boolean, default `false`. Whether this radio is disabled.
- `...restProps`: spread onto the `<input>`.

## Usage

### Single radio input

```svelte
<script lang="ts">
  import RedAmberGreenRadioInput from "./RedAmberGreenRadioInput.svelte";
</script>

<RedAmberGreenRadioInput
  label="Option A"
  name="choice"
  value="a"
/>
```

### Group of radios inside a RedAmberGreenRadioGroup

```svelte
<script lang="ts">
  import RedAmberGreenRadioGroup from "../RedAmberGreenRadioGroup/RedAmberGreenRadioGroup.svelte";
  import RedAmberGreenRadioInput from "./RedAmberGreenRadioInput.svelte";
</script>

<RedAmberGreenRadioGroup label="Size">
  <RedAmberGreenRadioInput
    label="Small"
    name="size"
    value="small"
    checked
  />
  <RedAmberGreenRadioInput
    label="Medium"
    name="size"
    value="medium"
  />
  <RedAmberGreenRadioInput
    label="Large"
    name="size"
    value="large"
  />
</RedAmberGreenRadioGroup>
```

### Bind a group to state

```svelte
<script lang="ts">
  import RedAmberGreenRadioGroup from "../RedAmberGreenRadioGroup/RedAmberGreenRadioGroup.svelte";
  import RedAmberGreenRadioInput from "./RedAmberGreenRadioInput.svelte";

  let shipping = $state<"standard" | "express" | "overnight">("standard");
</script>

<RedAmberGreenRadioGroup label="Shipping">
  <RedAmberGreenRadioInput
    label="Standard"
    name="shipping"
    value="standard"
    bind:group={shipping}
  />
  <RedAmberGreenRadioInput
    label="Express"
    name="shipping"
    value="express"
    bind:group={shipping}
  />
  <RedAmberGreenRadioInput
    label="Overnight"
    name="shipping"
    value="overnight"
    bind:group={shipping}
  />
</RedAmberGreenRadioGroup>
```

### Card-style custom layout

```svelte
<script lang="ts">
  import RedAmberGreenRadioGroup from "../RedAmberGreenRadioGroup/RedAmberGreenRadioGroup.svelte";
  import RedAmberGreenRadioInput from "./RedAmberGreenRadioInput.svelte";
</script>

<RedAmberGreenRadioGroup label="Plan">
  <div class="card">
    <RedAmberGreenRadioInput
      label="Free"
      name="plan"
      value="free"
    />
    <h3>Free</h3>
    <p>Basic features</p>
  </div>
  <div class="card">
    <RedAmberGreenRadioInput
      label="Pro"
      name="plan"
      value="pro"
    />
    <h3>Pro</h3>
    <p>All features</p>
  </div>
</RedAmberGreenRadioGroup>
```

### Disabled option

```svelte
<RedAmberGreenRadioInput
  label="Region EU"
  name="region"
  value="eu"
  disabled
/>
```

## Accessibility

- `aria-label` provides the accessible name since no visible `<label>` is rendered.
- Native `<input type="radio">` provides `role="radio"`, focus management, and Arrow-key selection when grouped by `name`.
- WCAG 2.2 AAA: consumer CSS must provide a visible focus indicator.

## Related components

- `RedAmberGreenRadioGroup` — the `fieldset role="radiogroup"` container.
- `CheckboxInput`, `CheckboxGroup` — multi-select equivalents.
- `SegmentGroup` / `SegmentGroupItem` — button-styled exclusive choice.
- `SwitchButton` — on/off toggle.

---

Lily™ and Lily Design System™ are trademarks.
