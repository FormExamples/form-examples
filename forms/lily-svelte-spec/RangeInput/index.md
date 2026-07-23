# RangeInput

A headless slider using the native `<input type="range">` element. Supports `min`, `max`, `step`, and two-way binding of a numeric value.

## What it is

- Component: `RangeInput`
- HTML element: `<input type="range">`
- Role: implicit `slider`
- Category: form input (continuous numeric selection)

## What it does

- Renders a native range slider with a draggable handle and track.
- Exposes `bind:value` for two-way data binding; default value is `50`.
- Accepts `min` (default `0`), `max` (default `100`), and `step` (default `1`).
- Supports `disabled` and any additional HTML attributes.
- Provides keyboard support natively: Left/Right/Up/Down arrows, Home, End, Page Up, Page Down.

## When to use it

- Volume, brightness, zoom, and other continuous numeric controls.
- Price filters or tolerance sliders where discrete numeric entry is heavier than needed.
- Any bounded numeric selection where visual feedback of position helps.

## When not to use it

- For precise numeric entry — use `NumberInput`.
- For selecting an angle in degrees — use `AngleSliderRangeInput`.
- For a two-thumb range (min + max) — this single-thumb `<input type="range">` is insufficient; consider a dedicated range slider.
- For named, discrete levels — use `SegmentGroup` or `Select`.

## How to use it

Import and bind a numeric value.

```svelte
import RangeInput from './RangeInput.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `range-input`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: number, default `50`. Bindable with `bind:value`.
- `min`: number, default `0`.
- `max`: number, default `100`.
- `step`: number, default `1`.
- `disabled`: boolean, default `false`.
- `...restProps`: spread onto the `<input>`.

## Usage

### Basic volume slider

```svelte
<script lang="ts">
  import RangeInput from './RangeInput.svelte';

  let volume = $state(50);
</script>

<RangeInput label="Volume" bind:value={volume} min={0} max={100} />
```

### Price range with step

```svelte
<script lang="ts">
  import RangeInput from './RangeInput.svelte';

  let price = $state(100);
</script>

<RangeInput label="Price limit" bind:value={price} min={10} max={500} step={10} />
```

### Showing the live value

```svelte
<script lang="ts">
  import RangeInput from './RangeInput.svelte';

  let brightness = $state(70);
</script>

<RangeInput label="Brightness" bind:value={brightness} />
<output>{brightness}%</output>
```

### Disabled slider

```svelte
<script lang="ts">
  import RangeInput from './RangeInput.svelte';
</script>

<RangeInput label="Locked" value={30} disabled />
```

### Fine-grained decimal step

```svelte
<script lang="ts">
  import RangeInput from './RangeInput.svelte';

  let ratio = $state(1);
</script>

<RangeInput label="Zoom ratio" bind:value={ratio} min={0.5} max={2} step={0.01} />
```

## Accessibility

- `aria-label` provides the accessible name since no visible `<label>` is rendered.
- Native `<input type="range">` is announced as a slider and exposes value, min, and max automatically.
- Keyboard: Left/Right/Down/Up decrement/increment by `step`; Home/End jump to min/max; PageDown/PageUp move by a larger step.
- WCAG 2.2 AAA: consumer CSS must provide a visible focus indicator.

## Related components

- `NumberInput` — exact numeric entry.
- `AngleSliderRangeInput` — range input for angles (degrees).
- `Slider`, `SliderButton` — alternative slider patterns.
- `SegmentGroup` — discrete named levels.

---

Lily™ and Lily Design System™ are trademarks.
