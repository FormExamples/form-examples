# SelectWithExtras

A headless enhanced select. Wraps a native `<select>` inside a `<div class="select-with-extras ...">` and exposes optional `before` and `after` snippets to place supplementary content (icons, flags, status indicators) around the control.

## What it is

A Svelte 5 headless component that renders:

```html
<div class="select-with-extras ...">
  <!-- optional before snippet -->
  <select aria-label="..." bind:value ...>...</select>
  <!-- optional after snippet -->
</div>
```

## What it does

- Renders a native `<select>` inside a wrapping `<div>`.
- Optionally renders the `before` snippet before the `<select>`.
- Optionally renders the `after` snippet after the `<select>`.
- Binds `value` two-way via `$bindable("")`.
- Passes `required` and `disabled` to the `<select>`.
- Spreads `...restProps` onto the wrapper `<div>`, not the `<select>`.

## When to use it

- A select that needs an adjacent flag, icon, currency symbol, or helper text.
- Any place where you want to preserve native `<select>` accessibility and keyboard behavior but need surrounding layout.

## When not to use it

- Simple selects without decorations - use `Select`.
- Searchable or filtered dropdowns - use `Combobox`.
- Multi-select UIs - consider `Listbox` or a custom composite.

## How to use it

1. Import the component.
2. Pass a translated `label`.
3. Bind `value`.
4. Optionally pass `before` and `after` snippets.
5. Provide `<option>` children.

## Props

- `class` (string, optional, default `""`) - merged with the base `select-with-extras` class on the wrapper `<div>`.
- `label` (string, required) - applied to the `<select>` via `aria-label`.
- `value` (string, optional, default `""`, bindable).
- `required` (boolean, optional, default `false`).
- `disabled` (boolean, optional, default `false`).
- `children` (Snippet, required) - `<option>` elements inside the `<select>`.
- `before` (Snippet, optional) - rendered before the `<select>`.
- `after` (Snippet, optional) - rendered after the `<select>`.
- `...restProps` - spread onto the wrapper `<div>` (NOT the `<select>`).

## Usage

Flag before the select:

```svelte
<script lang="ts">
    import SelectWithExtras from "./SelectWithExtras.svelte";
    let country = $state("us");
</script>

<SelectWithExtras label="Country" bind:value={country}>
    {#snippet before()}<span aria-hidden="true">🇺🇸</span>{/snippet}
    <option value="us">United States</option>
    <option value="gb">United Kingdom</option>
</SelectWithExtras>
```

Unit label after the select:

```svelte
<script lang="ts">
    import SelectWithExtras from "./SelectWithExtras.svelte";
    let unit = $state("kg");
</script>

<SelectWithExtras label="Unit" bind:value={unit}>
    {#snippet after()}<span>selected</span>{/snippet}
    <option value="kg">Kilograms</option>
    <option value="lb">Pounds</option>
</SelectWithExtras>
```

Both before and after snippets:

```svelte
<script lang="ts">
    import SelectWithExtras from "./SelectWithExtras.svelte";
    let currency = $state("USD");
</script>

<SelectWithExtras label="Currency" bind:value={currency}>
    {#snippet before()}<span>$</span>{/snippet}
    {#snippet after()}<small>default</small>{/snippet}
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
</SelectWithExtras>
```

Required and disabled states:

```svelte
<script lang="ts">
    import SelectWithExtras from "./SelectWithExtras.svelte";
    let level = $state("");
</script>

<SelectWithExtras label="Level" bind:value={level} required disabled>
    <option value="">Pick a level</option>
    <option value="low">Low</option>
    <option value="high">High</option>
</SelectWithExtras>
```

Wrapper attributes (spread onto `<div>`):

```svelte
<script lang="ts">
    import SelectWithExtras from "./SelectWithExtras.svelte";
    let x = $state("a");
</script>

<SelectWithExtras label="Group" bind:value={x} data-testid="grp" class="inline">
    <option value="a">A</option>
    <option value="b">B</option>
</SelectWithExtras>
```

## Accessibility

- The `<select>` carries `aria-label={label}`; no visible `<label>` is rendered.
- `before` and `after` content is not semantically connected to the `<select>` - if meaningful, make sure it is announced (e.g., decorative icons should be `aria-hidden="true"`).
- Native keyboard support is preserved.

References:
- HTML `<select>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select

## Related components

- `Select` - bare native select wrapper.
- `Option` - option element.
- `Combobox` - filterable dropdown.
- `Field` - full label + input + error wrapper.

---

Lily™ and Lily Design System™ are trademarks.
