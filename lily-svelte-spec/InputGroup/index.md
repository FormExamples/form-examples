# InputGroup

A group wrapping an input with optional prefix and suffix addons. This headless Svelte component renders a `<div role="group">` containing an optional prefix span, the input the consumer places inside, and an optional suffix span. Useful for currency symbols, units, search icons, and copy buttons.

## What it is

A headless Svelte 5 component that renders a single `<div role="group">` element. Category: form composition.

## What it does

- Renders a `<div>` with the base class `input-group` plus consumer `class`.
- Applies `role="group"` and `aria-label` when provided.
- Renders an optional `prefix` snippet inside `<span class="input-group-prefix">`.
- Renders the children (the input) directly inside the group.
- Renders an optional `suffix` snippet inside `<span class="input-group-suffix">`.
- Spreads `...restProps`.

## When to use it

- Currency inputs (`$ [____] USD`).
- Search inputs with leading icons (`🔍 [____]`).
- Inputs paired with copy or clear buttons.
- Domain-prefixed inputs (`https:// [____]`).

## When not to use it

- For a label/control pair use `Field`.
- For grouping radio buttons use `RadioGroup`.
- For grouping checkboxes use `CheckboxGroup`.

## Props

- `class` — string, default `""`. CSS class appended to `input-group`.
- `label` — string, optional. Accessible label for the group.
- `prefix` — `Snippet`, optional. Content rendered before the input.
- `suffix` — `Snippet`, optional. Content rendered after the input.
- `children` — `Snippet`, required. The input element.
- `...restProps` — additional HTML attributes spread onto the `<div>`.

## Usage

### Currency input

```svelte
<script lang="ts">
  import InputGroup from './InputGroup.svelte';
</script>

<InputGroup label="Amount in US dollars">
  {#snippet prefix()}<span aria-hidden="true">$</span>{/snippet}
  <input type="number" min="0" step="0.01" />
  {#snippet suffix()}<span aria-hidden="true">USD</span>{/snippet}
</InputGroup>
```

### Search input with leading icon

```svelte
<InputGroup label="Search">
  {#snippet prefix()}<span aria-hidden="true">🔍</span>{/snippet}
  <input type="search" placeholder="Search…" />
</InputGroup>
```

## Accessibility

- `role="group"` plus `aria-label` ties the input and addons together for assistive tech.
- Mark purely decorative addon glyphs with `aria-hidden="true"`.
- The input's own `<label>` association still applies; this component does not replace it.

## Related components

- `Field` — label + input + error message wrapper.
- `Fieldset` — `<fieldset>` group with a `<legend>`.
- `RadioGroup` — group of radio buttons.
- `CheckboxGroup` — group of checkboxes.

## References

- WAI-ARIA `group`: https://www.w3.org/TR/wai-aria-1.2/#group
- HTML `<input>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
