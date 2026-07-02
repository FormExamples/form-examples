# NorthernIrelandHealthAndCareNumberView

A headless read-only display for a Northern Ireland Health and Care (H&C) Number. Renders the value inside a `<span>` with an accessible label so screen readers announce both the field name and the displayed number.

## What it is

- Component: `NorthernIrelandHealthAndCareNumberView`
- HTML element: `<span>`
- Role: inline text; accessible name via `aria-label`
- Category: view (read-only display half of the Input/View pattern)

## What it does

- Displays an H&C Number as inline text content.
- Announces context to assistive technology through `aria-label`.
- Forwards any extra HTML attributes onto the `<span>` (for example `data-testid` or color-coding hooks).
- Performs no validation, formatting, or masking — the consumer supplies the already-formatted value (typically `XXX XXX XXXX`).

## When to use it

- Patient summary panels, confirmation pages, and printed records.
- Dashboards and reports where the identifier is informational and not editable.
- Alongside other read-only demographic data in a `SummaryList`.

## When not to use it

- To capture or edit the identifier — use `NorthernIrelandHealthAndCareNumberInput`.
- For a different jurisdiction — use `UnitedKingdomNationalHealthServiceNumberView`, `IrelandIndividualHealthIdentifierView`, etc.
- For a generic read-only string — use an inline `<span>` or another view component.

## How to use it

Import and render with the required `label`. The `value` prop is rendered verbatim between the `<span>` tags.

```svelte
import NorthernIrelandHealthAndCareNumberView from './NorthernIrelandHealthAndCareNumberView.svelte';
```

## Props

- `class` (`className`): string, default `""`. CSS class appended to `northern-ireland-health-and-care-number-view`.
- `label`: string, required. Accessible name announced by screen readers via `aria-label`.
- `value`: string, default `""`. The H&C Number text to display.
- `...restProps`: spread onto the `<span>`.

## Usage

### Basic example

```svelte
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberView from './NorthernIrelandHealthAndCareNumberView.svelte';
</script>

<NorthernIrelandHealthAndCareNumberView label="H&C Number" value="320 000 0001" />
```

### Dynamic value

```svelte
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberView from './NorthernIrelandHealthAndCareNumberView.svelte';

  let hc = $state("320 000 0001");
</script>

<NorthernIrelandHealthAndCareNumberView label="Patient H&C Number" value={hc} />
```

### Inline within a sentence

```svelte
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberView from './NorthernIrelandHealthAndCareNumberView.svelte';
</script>

<p>
  Registered H&C Number:
  <NorthernIrelandHealthAndCareNumberView label="H&C Number" value="320 000 0001" />
</p>
```

### Paired with the input counterpart

```svelte
<script lang="ts">
  import NorthernIrelandHealthAndCareNumberInput from '../NorthernIrelandHealthAndCareNumberInput/NorthernIrelandHealthAndCareNumberInput.svelte';
  import NorthernIrelandHealthAndCareNumberView from './NorthernIrelandHealthAndCareNumberView.svelte';

  let hc = $state("320 000 0001");
  let editing = $state(false);
</script>

{#if editing}
  <NorthernIrelandHealthAndCareNumberInput label="H&C Number" bind:value={hc} />
{:else}
  <NorthernIrelandHealthAndCareNumberView label="H&C Number" value={hc} />
{/if}
```

### With extra attributes

```svelte
<NorthernIrelandHealthAndCareNumberView
  label="H&C Number"
  value="320 000 0001"
  data-testid="patient-hc"
/>
```

## Accessibility

- `aria-label` provides the accessible name on an inline, non-interactive element.
- The component is not focusable and exposes no keyboard affordances.
- WCAG 2.2 AAA: consumer CSS must maintain adequate contrast with surrounding text.

## Related components

- `NorthernIrelandHealthAndCareNumberInput` — editable form control sibling.
- `UnitedKingdomNationalHealthServiceNumberView`, `IrelandIndividualHealthIdentifierView`, `EspanaTarjetaSanitariaIndividualView`, `FranceNumeroDIdentificationAuRepertoireView` — other jurisdiction view siblings.
- `SummaryList`, `SummaryListItem` — common containers for read-only identifier rows.
