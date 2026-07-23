# ColorPicker

A headless 2D selector for choosing coordinates on a picker board: `x` for saturation (0–100) and `y` for brightness (0–100). It uses `role="slider"` with keyboard arrow-key navigation and exposes `data-x`/`data-y` so consumers can position a visual cursor via CSS.

## What it is

ColorPicker renders a `<div role="slider">` with `tabindex="0"` (when enabled), `aria-valuenow` reflecting `x`, and `aria-valuemin=0`/`aria-valuemax=100`. Arrow keys update `x`/`y` by 1 (or 10 with Shift). Home/End set `x` to 0 or 100.

Both `x` and `y` use `$bindable()` for two-way binding.

## What it does

- Renders an accessible slider-like region with ARIA attributes.
- Handles keyboard navigation for 2D selection.
- Exposes coordinates via `data-x` and `data-y` for CSS cursor placement.
- Sets `aria-disabled` and `tabindex=-1` when disabled.

## When to use it

- Advanced color pickers where users pick saturation/brightness visually.
- 2D coordinate pickers where the axes represent any pair of values in 0–100.
- Composing with `ColorPickerButton` swatches for preset colors.

## When not to use it

- For selecting a single hex color — use `ColorInput`.
- For linear value selection — use `Slider` or `RangeInput`.
- For a hue ring — build a custom variant (hue is not covered here).

## How to use it

Bind `x` and `y` state, paint a background behind the component (hue gradient is the consumer's responsibility), and position a visual cursor from `[data-x]`/`[data-y]` in CSS.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `x` | `number` | `0` (bindable) | Horizontal position, 0–100. |
| `y` | `number` | `0` (bindable) | Vertical position, 0–100. |
| `label` | `string` | required | `aria-label`. |
| `disabled` | `boolean` | `false` | Disables keyboard interaction. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<div>`. |

## Usage

```svelte
<script lang="ts">
    import ColorPicker from "./ColorPicker.svelte";

    let saturation = $state(50);
    let brightness = $state(50);
</script>

<ColorPicker label="Saturation and brightness" bind:x={saturation} bind:y={brightness} />
<p>S: {saturation}, B: {brightness}</p>
```

```svelte
<script lang="ts">
    import ColorPicker from "./ColorPicker.svelte";
    import ColorPickerButton from "../ColorPickerButton/ColorPickerButton.svelte";

    let x = $state(0);
    let y = $state(0);
    let selected = $state("#ff0000");
    const presets = [
        { color: "#ff0000", label: "Red" },
        { color: "#00ff00", label: "Green" },
        { color: "#0000ff", label: "Blue" }
    ];
</script>

<ColorPicker label="Color board" bind:x bind:y />
{#each presets as p}
    <ColorPickerButton
        color={p.color}
        label={p.label}
        selected={selected === p.color}
        onclick={() => (selected = p.color)}
    />
{/each}
```

```svelte
<script lang="ts">
    import ColorPicker from "./ColorPicker.svelte";

    let x = $state(25);
    let y = $state(75);
</script>

<ColorPicker label="Color" bind:x bind:y disabled />
```

```svelte
<script lang="ts">
    import ColorPicker from "./ColorPicker.svelte";

    let x = $state(0);
    let y = $state(0);

    function reset() { x = 0; y = 0; }
</script>

<ColorPicker label="Pick" bind:x bind:y />
<button type="button" onclick={reset}>Reset</button>
```

## Accessibility

- `role="slider"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` exposes the numeric value.
- Keyboard support: ArrowLeft/Right change `x` by 1 (Shift = 10); ArrowUp/Down change `y`; Home/End set `x` to 0/100.
- `aria-disabled` and `tabindex=-1` when `disabled`.
- The slider pattern here only reflects `x` via `aria-valuenow`. For explicit Y exposure, screen-reader users may need supplementary announcements; combine with a separate `aria-live` readout if Y must be heard.

## Related components

- `ColorPickerButton` — preset swatch button.
- `ColorInput` — native `<input type="color">`.
- `Slider`, `RangeInput` — 1D selection.

---

Lily™ and Lily Design System™ are trademarks.
