# AngleSliderRangeInput

A range slider for selecting an angle value in degrees (0–360 by default). Built on native `<input type="range">` with full ARIA slider semantics and a human-readable `aria-valuetext` that appends a degree suffix.

## What it is

A headless Svelte 5 input wrapping `<input type="range">`. Category: range input / slider primitive, alongside `RangeInput`, `Slider`, and `Dial`.

## What it does

- Renders `<input type="range" class="angle-slider-range-input {className}">`.
- Exposes `value` via `$bindable(0)`.
- Sets `min`, `max`, `step`, `disabled`, `name`, `id` from props.
- Applies ARIA slider semantics: `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- Derives `aria-valuetext` as `{value}{valueTextSuffix}` (default suffix `"°"`), e.g. `"90°"` for screen readers.
- Spreads any additional HTML attributes onto the `<input>`.

## When to use it

- Rotation, compass heading, or hue selection.
- Any circular/angular numeric input 0–360°.
- Wherever a range slider with degree semantics is clearer than a number input.

## When not to use it

- For general numeric values — use `NumberInput` or `RangeInput`.
- For two-dimensional hue/saturation picking — use `ColorPicker`.
- For a rotary knob UI — use `Dial`.
- For selecting a slider confirmation gesture — use `SliderButton`.

## How to use it

Import `AngleSliderRangeInput` from `./AngleSliderRangeInput.svelte`. Provide `label` (required). Bind `value` for two-way state.

## Props

- `class` — string, default `""`. Appended to `angle-slider-range-input`.
- `value` — number, default `0`, bindable. Current angle.
- `min` — number, default `0`.
- `max` — number, default `360`.
- `step` — number, default `1`.
- `label` — string, required. Accessible name.
- `disabled` — boolean, default `false`.
- `name` — string, optional. Form field name.
- `id` — string, optional.
- `valueTextSuffix` — string, default `"°"`. Suffix for `aria-valuetext`.
- `...restProps` — additional HTML attributes spread onto the `<input>`.

## Usage

### Basic angle slider

```svelte
<script lang="ts">
  import AngleSliderRangeInput from './AngleSliderRangeInput.svelte';

  let angle = $state(0);
</script>

<AngleSliderRangeInput label="Rotation" bind:value={angle} />
<p>Current angle: {angle}°</p>
```

### Stepped compass direction

```svelte
<script lang="ts">
  import AngleSliderRangeInput from './AngleSliderRangeInput.svelte';

  let heading = $state(90);
</script>

<AngleSliderRangeInput label="Direction" bind:value={heading} step={15} />
```

### Custom range with localized suffix

```svelte
<script lang="ts">
  import AngleSliderRangeInput from './AngleSliderRangeInput.svelte';

  let hue = $state(0);
</script>

<AngleSliderRangeInput
  label="Hue"
  min={0}
  max={360}
  valueTextSuffix=" degrees"
  bind:value={hue}
/>
```

### Disabled

```svelte
<script lang="ts">
  import AngleSliderRangeInput from './AngleSliderRangeInput.svelte';
</script>

<AngleSliderRangeInput label="Locked angle" value={45} disabled />
```

### Named form field

```svelte
<script lang="ts">
  import AngleSliderRangeInput from './AngleSliderRangeInput.svelte';
</script>

<form>
  <AngleSliderRangeInput label="Orientation" name="orientation" id="orient" />
  <button type="submit">Save</button>
</form>
```

## Accessibility

- Implicit `slider` role via `<input type="range">`.
- `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` describe the range.
- `aria-valuetext` gives screen readers a friendly value (e.g. `"90°"`).
- Keyboard (native): Arrow keys step; Page Up/Down jump larger; Home/End jump to min/max.
- Focus is browser-native; consumer provides focus styling.

## Related components

- `RangeInput` — general numeric range input.
- `Slider` — draggable slider UI.
- `Dial` — rotary value picker.
- `NumberInput` — plain number input.
- `ColorPicker` — hue/saturation 2D picker.
