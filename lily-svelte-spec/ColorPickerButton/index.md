# ColorPickerButton

A headless `<button>` representing a single predefined color swatch. It renders a button with an inline `background-color` style, a `data-color` attribute, and `aria-pressed` reflecting its selected state. Used inside palettes, theme builders, and customization forms.

## What it is

ColorPickerButton is a Svelte 5 component that renders:

```html
<button type="button" aria-label={label} aria-pressed={selected} data-color={color} style:background-color={color} />
```

It intentionally includes an inline `background-color` style because the color is the swatch's purpose. All other styling comes from the consumer.

Note: the component's `.md` file refers to it as "ColorPickerSwatchButton"; the actual Svelte file and directory are `ColorPickerButton`.

## What it does

- Renders an accessible `<button>` with `aria-label` and `aria-pressed`.
- Paints the button background to the `color` prop.
- Exposes `data-color` for CSS targeting.
- Forwards `disabled` and `onclick`.

## When to use it

- Showing preset color swatches in a palette or picker.
- Theme customization forms where users pick from a curated list.
- Alongside `ColorPicker` for combined preset + freeform selection.

## When not to use it

- For a native `<input type="color">` — use `ColorInput`.
- For a 2D value region — use `ColorPicker`.
- For generic selection buttons — use `Button` or `ToggleButton`.

## How to use it

Set `color` to a CSS color. Provide a human-readable `label` (e.g. "Ocean Blue") for screen readers. Control `selected` from parent state to reflect which swatch is active.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `color` | `string` | required | CSS color value used for background and `data-color`. |
| `label` | `string` | required | `aria-label`. |
| `selected` | `boolean` | `false` | Reflected in `aria-pressed`. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `onclick` | `(event: MouseEvent) => void` | `undefined` | Click handler. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<button>`. |

## Usage

```svelte
<script lang="ts">
    import ColorPicker from "../ColorPicker/ColorPicker.svelte";
    import ColorPickerButton from "./ColorPickerButton.svelte";

    let x = $state(0);
    let y = $state(0);
    let selected = $state("#2563eb");

    const palette = [
        { color: "#ef4444", label: "Red" },
        { color: "#f59e0b", label: "Amber" },
        { color: "#16a34a", label: "Green" },
        { color: "#2563eb", label: "Blue" }
    ];
</script>

<ColorPicker label="Color board" bind:x bind:y />

{#each palette as p}
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
    import ColorPickerButton from "./ColorPickerButton.svelte";
</script>

<ColorPickerButton color="#0066cc" label="Blue" selected={true} />
<ColorPickerButton color="#cccccc" label="Gray" disabled={true} />
```

```svelte
<script lang="ts">
    import ColorPickerButton from "./ColorPickerButton.svelte";

    let chosen = $state<string | null>(null);
    const swatches = ["#ff0000", "#00ff00", "#0000ff"];
</script>

{#each swatches as color}
    <ColorPickerButton
        {color}
        label={`Color ${color}`}
        selected={chosen === color}
        onclick={() => (chosen = color)}
    />
{/each}
```

```svelte
<script lang="ts">
    import ColorPickerButton from "./ColorPickerButton.svelte";

    function handle(event: MouseEvent) {
        const el = event.currentTarget as HTMLButtonElement;
        console.log("Picked:", el.dataset.color);
    }
</script>

<ColorPickerButton color="#2563eb" label="Brand Blue" onclick={handle} />
```

## Accessibility

- `aria-label` provides a name since the button has no visible text.
- `aria-pressed` communicates toggle state in a palette UI.
- `<button type="button">` ensures clicks are not treated as form submissions.

## Related components

- `ColorPicker` — 2D color region.
- `ColorInput` — native color input.
- `ToggleButton` — generic pressed/unpressed toggle.
