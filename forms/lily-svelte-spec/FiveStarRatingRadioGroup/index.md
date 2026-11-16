# FiveStarRatingRadioGroup

A headless fieldset that groups related radio buttons under the ARIA `radiogroup` role. Renders a `<fieldset role="radiogroup" aria-label="…">` so screen readers announce the group name and its options as a related set.

## What it is

- Component: `FiveStarRatingRadioGroup`
- HTML element: `<fieldset>`
- Role: `radiogroup`
- Category: grouped form control container

## What it does

- Renders a `<fieldset>` with `role="radiogroup"` and an accessible `aria-label`.
- Renders its children — typically `FiveStarRatingRadioInput` elements or native `<input type="radio">` wrapped in `<label>`.
- Does no state management; selection is handled by native radio behavior (same `name` attribute makes the radios mutually exclusive).

## When to use it

- Any mutually exclusive choice from a small, visible set of options (size, shipping method, preference).
- When you want a semantic group landmark that assistive tech announces as a whole.

## When not to use it

- For a dropdown of options — use `Select` + `Option`.
- For a button-style segmented control — use `SegmentGroup` + `SegmentGroupItem`.
- For multi-select — use `CheckboxGroup`.
- For a single toggle — use `SwitchButton`.

## How to use it

Import and wrap radios — each with the same `name` — inside.

```svelte
import FiveStarRatingRadioGroup from './FiveStarRatingRadioGroup.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `five-star-rating-radio-group`.
- `label`: string, required. Accessible name for the group via `aria-label`.
- `children`: Snippet, required. Radio inputs and their labels.
- `...restProps`: spread onto the `<fieldset>`.

## Usage

### Basic radio group with `<label>`-wrapped inputs

```svelte
<script lang="ts">
  import FiveStarRatingRadioGroup from "./FiveStarRatingRadioGroup.svelte";
</script>

<FiveStarRatingRadioGroup label="Size">
  <label
    ><input
      type="radio"
      name="size"
      value="s"
    /> Small</label
  >
  <label
    ><input
      type="radio"
      name="size"
      value="m"
    /> Medium</label
  >
  <label
    ><input
      type="radio"
      name="size"
      value="l"
    /> Large</label
  >
</FiveStarRatingRadioGroup>
```

### Composed with FiveStarRatingRadioInput

```svelte
<script lang="ts">
  import FiveStarRatingRadioGroup from "./FiveStarRatingRadioGroup.svelte";
  import FiveStarRatingRadioInput from "../FiveStarRatingRadioInput/FiveStarRatingRadioInput.svelte";
</script>

<FiveStarRatingRadioGroup label="Shipping method">
  <FiveStarRatingRadioInput
    label="Standard"
    name="shipping"
    value="standard"
    checked
  />
  <FiveStarRatingRadioInput
    label="Express"
    name="shipping"
    value="express"
  />
  <FiveStarRatingRadioInput
    label="Overnight"
    name="shipping"
    value="overnight"
  />
</FiveStarRatingRadioGroup>
```

### Binding selected value

```svelte
<script lang="ts">
  import FiveStarRatingRadioGroup from "./FiveStarRatingRadioGroup.svelte";

  let choice = $state("yes");
</script>

<FiveStarRatingRadioGroup label="Subscribe to newsletter?">
  <label
    ><input
      type="radio"
      name="sub"
      value="yes"
      bind:group={choice}
    /> Yes</label
  >
  <label
    ><input
      type="radio"
      name="sub"
      value="no"
      bind:group={choice}
    /> No</label
  >
</FiveStarRatingRadioGroup>
<p>You chose: {choice}</p>
```

### From data

```svelte
<script lang="ts">
  import FiveStarRatingRadioGroup from "./FiveStarRatingRadioGroup.svelte";

  const options = [
    { value: "s", label: "Small" },
    { value: "m", label: "Medium" },
    { value: "l", label: "Large" },
  ];
  let size = $state("m");
</script>

<FiveStarRatingRadioGroup label="Size">
  {#each options as o}
    <label>
      <input
        type="radio"
        name="size"
        value={o.value}
        bind:group={size}
      />
      {o.label}
    </label>
  {/each}
</FiveStarRatingRadioGroup>
```

### Disabled group

```svelte
<script lang="ts">
  import FiveStarRatingRadioGroup from "./FiveStarRatingRadioGroup.svelte";
</script>

<FiveStarRatingRadioGroup
  label="Region"
  disabled
>
  <label
    ><input
      type="radio"
      name="region"
      value="eu"
      disabled
    /> EU</label
  >
  <label
    ><input
      type="radio"
      name="region"
      value="us"
      disabled
    /> US</label
  >
</FiveStarRatingRadioGroup>
```

## Accessibility

- `role="radiogroup"` + `aria-label` announces the group's purpose.
- Native `<fieldset>` with same-named `<input type="radio">` children provides built-in mutual exclusion and roving tab-stop behavior (Arrow keys move selection; Tab enters / exits the group).
- If you prefer a visible legend, use a native `<fieldset>` / `<legend>` instead of `FiveStarRatingRadioGroup`.

## Related components

- `FiveStarRatingRadioInput` — a single bare `<input type="radio">` for use inside the group.
- `CheckboxGroup` — multi-select equivalent.
- `SegmentGroup` / `SegmentGroupItem` — button-styled segmented alternative.
- `Select` + `Option` — dropdown alternative.
- `Fieldset` — generic field grouping with a `<legend>`.

---

Lily™ and Lily Design System™ are trademarks.
