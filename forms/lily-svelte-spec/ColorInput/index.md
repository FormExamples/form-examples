# ColorInput

A headless color input that wraps the native `<input type="color">` element. The value is a hex color string (for example, `"#ff0000"`) and supports two-way binding via `bind:value`.

## What it is

ColorInput renders a bare `<input type="color">` with `aria-label` for accessibility. The browser provides the native color picker UI. Use it anywhere you want a low-footprint hex color selector.

## What it does

- Renders `<input type="color" aria-label={label} />`.
- Two-way binds `value` (a hex color string, default `"#000000"`).
- Forwards `disabled`, `name`, and `id` to the input.
- Spreads `restProps` onto the input.

## When to use it

- Settings pages where users pick a single hex color.
- Theme builders, drawing apps, label-color pickers.
- When the native browser picker is sufficient.

## When not to use it

- When you need a custom UI (palette swatches, HSL sliders) — use `ColorPicker` and `ColorPickerButton`.
- For non-hex formats — the native control returns hex only.
- For multi-stop or gradient selection — build a custom component.

## How to use it

Bind `value` to a `$state` variable. Provide `label` for accessibility since the native color input has no visible label.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `value` | `string` | `"#000000"` (bindable) | Current hex color. |
| `label` | `string` | required | `aria-label`. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `name` | `string` | `undefined` | Form field name. |
| `id` | `string` | `undefined` | Element ID. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<input>`. |

## Usage

```svelte
<script lang="ts">
    import ColorInput from "./ColorInput.svelte";

    let color = $state("#2563eb");
</script>

<ColorInput label="Primary color" bind:value={color} />
<p>Selected: {color}</p>
```

```svelte
<script lang="ts">
    import ColorInput from "./ColorInput.svelte";

    let text = $state("#111827");
</script>

<ColorInput label="Text color" bind:value={text} name="text_color" />
```

```svelte
<script lang="ts">
    import ColorInput from "./ColorInput.svelte";

    let bg = $state("#ffffff");
    let locked = $state(true);
</script>

<ColorInput label="Background" bind:value={bg} disabled={locked} />
```

```svelte
<script lang="ts">
    import ColorInput from "./ColorInput.svelte";

    let fg = $state("#000000");
    let bg = $state("#ffffff");
</script>

<fieldset>
    <legend>Theme</legend>
    <ColorInput label="Foreground" bind:value={fg} />
    <ColorInput label="Background" bind:value={bg} />
</fieldset>
```

## Accessibility

- `aria-label` names the input; pair with a visible `<label for=...>` if sighted users also need text.
- The native picker provides keyboard support.

## Related components

- `ColorPicker` — 2D saturation/brightness picker.
- `ColorPickerButton` — single swatch button for predefined colors.
