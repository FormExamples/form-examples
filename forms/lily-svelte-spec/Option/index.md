# Option

A headless `<option>` element wrapper designed to be used inside `<select>` dropdowns. It accepts a `value` prop for form submission and renders children as the visible label text.

## What it is

- Component: `Option`
- HTML element: `<option>`
- Role: native option (inherited from `<select>`)
- Category: form-control child

## What it does

- Renders a native `<option>` with the supplied `value`.
- Renders the `children` snippet as the visible label text.
- Supports native `selected` and `disabled` attributes.
- Spreads additional attributes onto the `<option>` for hooks like `data-*`.

## When to use it

- Inside a native `<select>`, `Select`, or `ThemeSelect` dropdown when you want to hand-author each option.
- When you need a compact form control with the browser's native dropdown UI.

## When not to use it

- For a combobox with filter / search — use `Combobox`.
- For multi-select with custom rendering — use `Listbox`.
- For radio-style exclusive choice rendered inline — use `RadioGroup` + `RadioInput`, or `SegmentGroup`.
- For theme selection specifically — use `ThemeSelectOption`.

## How to use it

Import and place inside a `<select>` or `Select`. The `value` is submitted; the `children` is the text a user sees.

```svelte
import Option from './Option.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `option`.
- `value`: string, required. Submitted form value.
- `selected`: boolean, default `false`. Whether this option is pre-selected.
- `disabled`: boolean, default `false`. Whether this option is disabled.
- `children`: Snippet, required. Visible label text.
- `...restProps`: spread onto the `<option>`.

## Usage

### Inside a native select

```svelte
<script lang="ts">
  import Option from './Option.svelte';
</script>

<select name="country">
  <Option value="us">United States</Option>
  <Option value="uk">United Kingdom</Option>
  <Option value="ca" disabled>Canada</Option>
</select>
```

### Inside the Select component

```svelte
<script lang="ts">
  import Select from '../Select/Select.svelte';
  import Option from './Option.svelte';

  let country = $state("us");
</script>

<Select label="Country" bind:value={country}>
  <Option value="us">United States</Option>
  <Option value="uk">United Kingdom</Option>
  <Option value="ca">Canada</Option>
</Select>
```

### With a pre-selected option

```svelte
<script lang="ts">
  import Option from './Option.svelte';
</script>

<select>
  <Option value="s">Small</Option>
  <Option value="m" selected>Medium</Option>
  <Option value="l">Large</Option>
</select>
```

### Rendered from an array

```svelte
<script lang="ts">
  import Option from './Option.svelte';

  const sizes = [
    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large' },
  ];
  let size = $state('m');
</script>

<select bind:value={size}>
  {#each sizes as s}
    <Option value={s.value}>{s.label}</Option>
  {/each}
</select>
```

### With a data attribute hook

```svelte
<Option value="urgent" data-priority="high">Urgent</Option>
```

## Accessibility

- Native `<option>` inherits all accessibility from its parent `<select>`: keyboard navigation (Up/Down, Home/End, type-ahead), announcement of selected state, and focus behavior.
- Avoid adding ARIA roles — the native semantics are already correct.
- Consumer must ensure the parent `<select>` has an accessible name.

## Related components

- `Select` — the native dropdown parent for `Option`.
- `ThemeSelect` + `ThemeSelectOption` — theme-specific select pair.
- `SelectWithExtras` — select with search or grouped options.
- `Combobox`, `Listbox` — richer alternatives to a native select.
