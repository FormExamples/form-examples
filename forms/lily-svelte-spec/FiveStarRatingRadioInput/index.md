# FiveStarRatingRadioInput

A headless bare `<input type="radio">` without a wrapping label, for custom five-star-rating-radio-group layouts where labels are positioned separately or provided by the container.

## What it is

- Component: `FiveStarRatingRadioInput`
- HTML element: `<input type="radio">`
- Role: native `radio`
- Category: form input (used inside `FiveStarRatingRadioGroup`)

## What it does

- Renders a native radio input.
- Applies `aria-label` as the accessible name.
- Supports `name`, `value`, `checked`, and `disabled` via native attributes.
- Forwards any other attributes (e.g. `bind:group`, event handlers) onto the `<input>`.

## When to use it

- Inside a `FiveStarRatingRadioGroup` when you want custom layout (cards, tiles, segmented buttons) where the visible label is rendered separately.
- When you need a bare radio element without a native `<label>` wrapper.

## When not to use it

- For a labeled radio with a visible text label — wrap a native `<input type="radio">` inside a `<label>` element, or use a different component.
- For multi-select — use a checkbox, `CheckboxInput`, or `CheckboxGroup`.
- For a toggle — use `SwitchButton`.

## How to use it

Import and place inside a `FiveStarRatingRadioGroup`. Use the same `name` across radios to make them mutually exclusive.

```svelte
import FiveStarRatingRadioInput from './FiveStarRatingRadioInput.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `five-star-rating-radio-input`.
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
  import FiveStarRatingRadioInput from "./FiveStarRatingRadioInput.svelte";
</script>

<FiveStarRatingRadioInput
  label="Option A"
  name="choice"
  value="a"
/>
```

### Group of radios inside a FiveStarRatingRadioGroup

```svelte
<script lang="ts">
  import FiveStarRatingRadioGroup from "../FiveStarRatingRadioGroup/FiveStarRatingRadioGroup.svelte";
  import FiveStarRatingRadioInput from "./FiveStarRatingRadioInput.svelte";
</script>

<FiveStarRatingRadioGroup label="Size">
  <FiveStarRatingRadioInput
    label="Small"
    name="size"
    value="small"
    checked
  />
  <FiveStarRatingRadioInput
    label="Medium"
    name="size"
    value="medium"
  />
  <FiveStarRatingRadioInput
    label="Large"
    name="size"
    value="large"
  />
</FiveStarRatingRadioGroup>
```

### Bind a group to state

```svelte
<script lang="ts">
  import FiveStarRatingRadioGroup from "../FiveStarRatingRadioGroup/FiveStarRatingRadioGroup.svelte";
  import FiveStarRatingRadioInput from "./FiveStarRatingRadioInput.svelte";

  let shipping = $state<"standard" | "express" | "overnight">("standard");
</script>

<FiveStarRatingRadioGroup label="Shipping">
  <FiveStarRatingRadioInput
    label="Standard"
    name="shipping"
    value="standard"
    bind:group={shipping}
  />
  <FiveStarRatingRadioInput
    label="Express"
    name="shipping"
    value="express"
    bind:group={shipping}
  />
  <FiveStarRatingRadioInput
    label="Overnight"
    name="shipping"
    value="overnight"
    bind:group={shipping}
  />
</FiveStarRatingRadioGroup>
```

### Card-style custom layout

```svelte
<script lang="ts">
  import FiveStarRatingRadioGroup from "../FiveStarRatingRadioGroup/FiveStarRatingRadioGroup.svelte";
  import FiveStarRatingRadioInput from "./FiveStarRatingRadioInput.svelte";
</script>

<FiveStarRatingRadioGroup label="Plan">
  <div class="card">
    <FiveStarRatingRadioInput
      label="Free"
      name="plan"
      value="free"
    />
    <h3>Free</h3>
    <p>Basic features</p>
  </div>
  <div class="card">
    <FiveStarRatingRadioInput
      label="Pro"
      name="plan"
      value="pro"
    />
    <h3>Pro</h3>
    <p>All features</p>
  </div>
</FiveStarRatingRadioGroup>
```

### Disabled option

```svelte
<FiveStarRatingRadioInput
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

- `FiveStarRatingRadioGroup` — the `fieldset role="radiogroup"` container.
- `CheckboxInput`, `CheckboxGroup` — multi-select equivalents.
- `SegmentGroup` / `SegmentGroupItem` — button-styled exclusive choice.
- `SwitchButton` — on/off toggle.

---

Lily™ and Lily Design System™ are trademarks.
