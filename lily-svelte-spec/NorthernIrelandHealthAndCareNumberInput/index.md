# NorthernIrelandHealthAndCareNumberInput

A headless input for entering a Northern Ireland Health and Care (H&C) Number — a 10-digit identifier displayed as `XXX XXX XXXX` and used by Health and Social Care Northern Ireland to uniquely identify patients.

## What it is

- Component: `NorthernIrelandHealthAndCareNumberInput`
- HTML element: `<input type="text">`
- Role: implicit text input
- Category: input (form control half of the Input/View pattern for the H&C Number)

## What it does

- Renders a single text input pre-configured for the 3-3-4 H&C format.
- Applies `inputmode="numeric"` so mobile devices present a numeric keypad.
- Applies `pattern="[0-9]{3} [0-9]{3} [0-9]{4}"` so native form validation rejects mis-formatted entries.
- Applies `autocomplete="off"` to protect a sensitive national healthcare identifier.
- Exposes `bind:value` for two-way data binding.
- Forwards `required`, `disabled`, and any other HTML attributes to the underlying `<input>`.

## When to use it

- Patient registration or intake forms in Northern Ireland HSC systems.
- Clinical applications that need to capture or update an H&C Number.
- Any flow that needs native browser validation of the 3-3-4 digit format.

## When not to use it

- To display an already-captured H&C Number as read-only — use a view component on a `<span>` instead.
- For a different jurisdiction's identifier — use the matching country-specific component (`UnitedKingdomNationalHealthServiceNumberInput`, `IrelandIndividualHealthIdentifierInput`, etc.).
- For free-form text — use `TextInput`.

## How to use it

Import the component from its directory and bind a string value. Text containing spaces between the 3-3-4 groups passes the pattern validator.

```svelte
import NorthernIrelandHealthAndCareNumberInput from './NorthernIrelandHealthAndCareNumberInput.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `northern-ireland-health-and-care-number-input`.
- `label`: string, required. Accessible label applied via `aria-label`.
- `value`: string, default `""`. Bindable with `bind:value`.
- `required`: boolean, default `false`. Marks the input as required for form submission.
- `disabled`: boolean, default `false`. Disables the input.
- `...restProps`: spread onto the `<input>` (e.g. `placeholder`, `data-testid`, event handlers).

## Usage

### Basic example

```svelte
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberInput from './NorthernIrelandHealthAndCareNumberInput.svelte';

  let hc = $state("");
</script>

<NorthernIrelandHealthAndCareNumberInput label="H&C Number" bind:value={hc} />
```

### Required field

```svelte
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberInput from './NorthernIrelandHealthAndCareNumberInput.svelte';
</script>

<NorthernIrelandHealthAndCareNumberInput label="H&C Number" required />
```

### Disabled field

```svelte
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberInput from './NorthernIrelandHealthAndCareNumberInput.svelte';
</script>

<NorthernIrelandHealthAndCareNumberInput label="H&C Number" value="320 000 0001" disabled />
```

### With a placeholder and submission

```svelte
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberInput from './NorthernIrelandHealthAndCareNumberInput.svelte';

  let hc = $state("");
  function submit(e: SubmitEvent) { e.preventDefault(); /* send hc */ }
</script>

<form onsubmit={submit}>
  <NorthernIrelandHealthAndCareNumberInput
    label="H&C Number"
    bind:value={hc}
    placeholder="320 000 0001"
    required
  />
  <button type="submit">Save</button>
</form>
```

### Toggling between input and view

```svelte
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberInput from './NorthernIrelandHealthAndCareNumberInput.svelte';
  import NorthernIrelandHealthAndCareNumberView from '../NorthernIrelandHealthAndCareNumberView/NorthernIrelandHealthAndCareNumberView.svelte';

  let hc = $state("320 000 0001");
  let editing = $state(false);
</script>

{#if editing}
  <NorthernIrelandHealthAndCareNumberInput label="H&C Number" bind:value={hc} />
{:else}
  <NorthernIrelandHealthAndCareNumberView label="H&C Number" value={hc} />
{/if}
<button onclick={() => (editing = !editing)}>Toggle</button>
```

## Accessibility

- `aria-label` is the accessible name; no visible `<label>` is rendered.
- `inputmode="numeric"` hints mobile soft keyboards to show digits.
- `pattern` enables native invalid-state feedback and blocks non-matching submits.
- `autocomplete="off"` discourages browser storage of a sensitive identifier.
- WCAG 2.2 AAA: consumer CSS must supply a visible focus indicator and an error state for `:invalid`.

## Related components

- `NorthernIrelandHealthAndCareNumberView` — read-only display sibling for the same H&C Number.
- `UnitedKingdomNationalHealthServiceNumberInput` / `UnitedKingdomNationalHealthServiceNumberView` — UK NHS Number equivalents.
- `IrelandIndividualHealthIdentifierInput` / `IrelandIndividualHealthIdentifierView` — Republic of Ireland IHI equivalents.
- `EspanaTarjetaSanitariaIndividualInput`, `FranceNumeroDIdentificationAuRepertoireInput` — other jurisdictions.
- `TextInput` — generic text input for non-identifier fields.
