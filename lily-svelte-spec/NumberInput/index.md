# NumberInput

A headless numeric input that wraps a native `<input type="number">` with an accessible label and optional `min`, `max`, and `step` constraints. Supports two-way binding of a numeric value.

## What it is

- Component: `NumberInput`
- HTML element: `<input type="number">`
- Role: implicit spinbutton
- Category: form input

## What it does

- Renders a native numeric input with browser-provided up/down spinner controls.
- Applies native validation via `min`, `max`, and `step` attributes when supplied.
- Exposes a bindable `value: number | undefined` (defaults to `undefined`, not `0`, so empty fields don't coerce to zero).
- Forwards `required`, `disabled`, and any other attributes (e.g. `placeholder`) to the `<input>`.

## When to use it

- Quantity selectors, age inputs, price fields, and any configuration value entered as a number.
- Cases where you want the browser's built-in up/down spinners and validation.
- Fields where the value is mathematically numeric rather than a formatted token.

## When not to use it

- For formatted numeric tokens such as credit cards, phone numbers, PINs, postal codes, or national identifiers — use `TextInput`, `TelInput`, `PinInputDiv`, `PostalCodeInput`, or a national identifier input.
- For currency values that require locale-aware formatting — use `CurrencyInput`.
- For selecting along a bounded spectrum with a visual track — use `RangeInput`.
- For a narrow range of named steps — use `Select` + `Option` or a segment/tab group.

## How to use it

Import and bind a numeric value. Constraints are optional.

```svelte
import NumberInput from './NumberInput.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `number-input`.
- `label`: string, required. Accessible name via `aria-label`.
- `value`: `number | undefined`, default `undefined`. Bindable with `bind:value`.
- `min`: number, optional. Minimum allowed value.
- `max`: number, optional. Maximum allowed value.
- `step`: number, optional. Increment / decrement size.
- `required`: boolean, default `false`.
- `disabled`: boolean, default `false`.
- `...restProps`: spread onto the `<input>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import NumberInput from './NumberInput.svelte';

  let quantity = $state<number | undefined>(undefined);
</script>

<NumberInput label="Quantity" bind:value={quantity} />
```

### With min, max, and step

```svelte
<script lang="ts">
  import NumberInput from './NumberInput.svelte';

  let qty = $state<number | undefined>(1);
</script>

<NumberInput label="Quantity" bind:value={qty} min={0} max={100} step={1} />
```

### Required age field

```svelte
<script lang="ts">
  import NumberInput from './NumberInput.svelte';

  let age = $state<number | undefined>(undefined);
</script>

<NumberInput label="Age" bind:value={age} min={0} max={120} required />
```

### Decimal step

```svelte
<script lang="ts">
  import NumberInput from './NumberInput.svelte';

  let price = $state<number | undefined>(9.99);
</script>

<NumberInput label="Price" bind:value={price} min={0} step={0.01} />
```

### Disabled with a placeholder

```svelte
<script lang="ts">
  import NumberInput from './NumberInput.svelte';
</script>

<NumberInput label="Quantity" placeholder="0" disabled />
```

## Accessibility

- `aria-label` provides the accessible name since no visible `<label>` is rendered. Pair with a visible `<label for>` in a parent `Field` if you prefer a sighted-user label.
- Native `<input type="number">` has an implicit spinbutton role with up/down arrow key support.
- Native validation triggers `:invalid` pseudo-class when a value is outside `min`/`max` or violates `step`.
- WCAG 2.2 AAA: ensure a visible focus indicator via consumer CSS.

## Related components

- `RangeInput` — slider alternative for bounded numeric selection.
- `CurrencyInput` — locale-aware currency formatting.
- `TextInput` — generic text input for non-numeric strings.
- `Field`, `Label`, `Hint`, `ErrorMessage` — wrappers for adding visible labels and messages.
