# Slider

A headless range slider wrapping the native `<input type="range">` element.

## What it is

A Svelte 5 headless component that renders `<input class="slider ..." type="range">` with `aria-label`, `bind:value`, and `min`, `max`, `step`, `disabled` all forwarded to the native input.

## What it does

- Renders a native range input.
- Binds `value` two-way via `$bindable(50)` (default value 50).
- Forwards numeric `min`, `max`, `step` to the input attributes.
- Forwards `disabled`.
- Spreads `...restProps` onto the `<input>`.

All keyboard and drag behavior comes from the browser's native `<input type="range">`.

## When to use it

- Volume, brightness, zoom, opacity, or similar single-value numeric controls.
- Price-range filters.
- Any single-thumb slider where an accessible native control is sufficient.

## When not to use it

- Two-thumb range pickers - native `<input type="range">` does not support this; compose two sliders or build a custom widget.
- Angle pickers - use `AngleSliderRangeInput`.
- Dial-style rotary controls - use `Dial`.
- Discrete step choosers with labels - consider `SegmentGroup` or `RadioGroup`.

## How to use it

1. Import the component.
2. Supply a translated `label`.
3. Bind `value`.
4. Pass `min`, `max`, and `step` as needed.

## Props

- `class` (string, optional, default `""`) - merged with the base `slider` class.
- `label` (string, required) - accessible name via `aria-label`.
- `value` (number, optional, default `50`, bindable).
- `min` (number, optional, default `0`).
- `max` (number, optional, default `100`).
- `step` (number, optional, default `1`).
- `disabled` (boolean, optional, default `false`).
- `...restProps` - spread onto `<input>`.

## Usage

Volume slider:

```svelte
<script lang="ts">
    import Slider from "./Slider.svelte";
    let volume = $state(50);
</script>

<Slider label="Volume" bind:value={volume} />
<p>{volume}%</p>
```

Brightness:

```svelte
<script lang="ts">
    import Slider from "./Slider.svelte";
    let brightness = $state(75);
</script>

<Slider label="Brightness" bind:value={brightness} min={0} max={100} />
```

Price max:

```svelte
<script lang="ts">
    import Slider from "./Slider.svelte";
    let maxPrice = $state(250);
</script>

<Slider label="Max price" bind:value={maxPrice} min={0} max={1000} step={10} />
```

Disabled state:

```svelte
<script lang="ts">
    import Slider from "./Slider.svelte";
    let v = $state(20);
</script>

<Slider label="Locked" bind:value={v} disabled />
```

With name for form submission:

```svelte
<script lang="ts">
    import Slider from "./Slider.svelte";
    let v = $state(10);
</script>

<form>
    <Slider label="Quantity" bind:value={v} name="qty" min={1} max={100} />
    <button type="submit">Submit</button>
</form>
```

## Accessibility

- Native `<input type="range">` carries implicit `slider` role.
- `aria-label` supplies the accessible name.
- Keyboard: Arrow Up/Right increment, Arrow Down/Left decrement, Home/End jump to min/max, Page Up/Down jump by larger increments (browser-dependent).
- Consider pairing with a visible numeric readout for sighted users.

References:
- WAI-ARIA Slider Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
- MDN `input type="range"`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range

## Related components

- `RangeInput` - synonym; plain `<input type="range">` wrapper.
- `AngleSliderRangeInput` - angle-in-degrees variant.
- `SliderButton` - slide-to-confirm button.
- `Dial` - rotary selector.
