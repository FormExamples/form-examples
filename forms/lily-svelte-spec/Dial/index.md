# Dial

A rotary dial or knob control for selecting a numeric value along a range, exposed as a `<div role="slider">` with full keyboard support.

## What it is

`Dial` is an accessible, headless primitive that provides the ARIA semantics and keyboard behaviour of a slider without rendering any visual track, knob, or pointer. The consumer draws the dial appearance via CSS or nested markup; the component handles range bounds, key handling, and accessibility.

## What it does

- Renders a focusable `<div role="slider">` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- Clamps the value to `[min, max]`.
- Supports keyboard increment/decrement by `step`, with Shift for a 10× multiplier.
- Supports `Home` to jump to `min` and `End` to jump to `max`.
- Exposes `aria-disabled` and manages `tabindex` based on `disabled`.

## When to use it

- Volume controls, thermostats, rotary knobs, audio equipment emulation.
- Control panels where a circular affordance is more natural than a linear slider.
- Any value selection that benefits from a rotary metaphor rendered in CSS/SVG.

## When not to use it

- When a linear slider is more appropriate. Use `Slider` or `RangeInput` instead.
- When you need discrete options with labels. Use a `RadioGroup` or `SegmentGroup`.
- When the value represents an angle in degrees. Use `AngleSliderRangeInput`.

## How to use it

Bind a numeric value, define `min`/`max`/`step`, and provide an accessible `label`.

```svelte
<script lang="ts">
    import Dial from "./Dial.svelte";
    let volume = $state(50);
</script>

<Dial label="Volume" bind:value={volume} min={0} max={100} step={1} />
```

## Props

| Prop       | Type      | Default  | Description                                    |
| ---------- | --------- | -------- | ---------------------------------------------- |
| `class`    | `string`  | `""`     | CSS class appended to the base class.         |
| `value`    | `number`  | `0`      | Current value. Bindable.                       |
| `min`      | `number`  | `0`      | Minimum value.                                 |
| `max`      | `number`  | `100`    | Maximum value.                                 |
| `step`     | `number`  | `1`      | Increment per arrow key press.                 |
| `label`    | `string`  | required | Accessible name via `aria-label`.              |
| `disabled` | `boolean` | `false`  | Whether the dial is disabled.                  |
| `...rest`  | `unknown` | —        | Additional HTML attributes on the `<div>`.     |

## Usage

### 1. Basic dial

```svelte
<script lang="ts">
    import Dial from "./Dial.svelte";
    let value = $state(25);
</script>

<Dial label="Brightness" bind:value />
```

### 2. Custom range and step

```svelte
<Dial label="Temperature" bind:value={temp} min={10} max={30} step={0.5} />
```

### 3. Disabled dial

```svelte
<Dial label="Locked control" value={30} disabled />
```

### 4. Multiple dials in a group

```svelte
<script lang="ts">
    import Dial from "./Dial.svelte";
    import DialGroup from "../DialGroup/DialGroup.svelte";
    let bass = $state(0), mid = $state(0), treble = $state(0);
</script>

<DialGroup label="Equalizer">
    <Dial label="Bass" bind:value={bass} min={-10} max={10} />
    <Dial label="Mid" bind:value={mid} min={-10} max={10} />
    <Dial label="Treble" bind:value={treble} min={-10} max={10} />
</DialGroup>
```

### 5. Keyboard shortcut with Shift

```svelte
<Dial label="Volume" bind:value={volume} min={0} max={100} step={1} />
<!-- ArrowUp: +1 | Shift+ArrowUp: +10 | Home: 0 | End: 100 -->
```

## Accessibility

- `role="slider"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.
- Keyboard: Arrow keys step by `step`; Shift+Arrow steps by `step * 10`; Home/End jump to bounds.
- `aria-disabled` is set and the element is removed from the tab order when disabled.

## Related components

- `DialGroup` — groups multiple dial controls.
- `Slider`, `RangeInput` — linear alternatives.
- `AngleSliderRangeInput` — specialised angle input.

---

Lily™ and Lily Design System™ are trademarks.
