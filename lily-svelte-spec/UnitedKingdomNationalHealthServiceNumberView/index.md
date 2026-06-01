# UnitedKingdomNationalHealthServiceNumberView

A read-only inline display of a UK NHS number, rendered as `<span>` with `aria-label` for accessible labeling.

## What it is

`UnitedKingdomNationalHealthServiceNumberView` is a headless Svelte 5 component that shows a UK NHS number as plain text inside a `<span>`. It is the read-only counterpart to `UnitedKingdomNationalHealthServiceNumberInput` in an Input/View pattern; the input collects the value while the view displays it.

## What it does

- Renders `<span class="united-kingdom-national-health-service-number-view {className}" aria-label={label}>{value}</span>`.
- Performs no formatting or validation — the consumer provides the already-formatted NHS number string.
- Spreads additional HTML attributes onto the `<span>`.

## When to use it

- Patient record summaries where the NHS number appears but is not editable.
- Confirmation screens after submitting a form.
- Printable patient documents and receipts.
- Any NHS context that displays the number alongside other patient details.

## When not to use it

- Don't use it to collect the NHS number — use `UnitedKingdomNationalHealthServiceNumberInput`.
- Don't use it for other countries' identifiers — use the corresponding country-specific view components.
- Don't use it for arbitrary inline text — use `Character` or a plain `<span>`.
- Don't use it without a `label` prop — screen readers need the context.

## How to use it

Import the component and pass a translated `label` plus the `value` string (pre-formatted as `XXX XXX XXXX`).

## Props

- `class` — string, optional. Extra CSS class appended to `united-kingdom-national-health-service-number-view`.
- `label` — string, required. Accessible label via `aria-label`.
- `value` — string, default `""`. The NHS number to display.
- `...restProps` — any additional HTML attributes spread onto the `<span>`.

## Usage

```svelte
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberView from "./UnitedKingdomNationalHealthServiceNumberView.svelte";
</script>

<UnitedKingdomNationalHealthServiceNumberView
  label="NHS Number"
  value="123 456 7890"
/>
```

```svelte
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberView from "./UnitedKingdomNationalHealthServiceNumberView.svelte";

  const patient = { name: "Alice", nhs: "987 654 3210" };
</script>

<dl>
  <dt>Name</dt>
  <dd>{patient.name}</dd>
  <dt>NHS Number</dt>
  <dd>
    <UnitedKingdomNationalHealthServiceNumberView
      label="Patient NHS Number"
      value={patient.nhs}
    />
  </dd>
</dl>
```

```svelte
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberInput from "../UnitedKingdomNationalHealthServiceNumberInput/UnitedKingdomNationalHealthServiceNumberInput.svelte";
  import UnitedKingdomNationalHealthServiceNumberView from "./UnitedKingdomNationalHealthServiceNumberView.svelte";

  let value = $state("123 456 7890");
  let editing = $state(false);
</script>

{#if editing}
  <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" bind:value />
  <button type="button" onclick={() => (editing = false)}>Done</button>
{:else}
  <UnitedKingdomNationalHealthServiceNumberView label="NHS Number" {value} />
  <button type="button" onclick={() => (editing = true)}>Edit</button>
{/if}
```

```svelte
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberView from "./UnitedKingdomNationalHealthServiceNumberView.svelte";
</script>

<UnitedKingdomNationalHealthServiceNumberView
  label="Numéro NHS"
  value="123 456 7890"
  data-testid="nhs-view"
/>
```

## Accessibility

- `aria-label` supplies the accessible name so screen readers announce the purpose before reading the number.
- Passive display element — no focus, no keyboard interaction.
- Consumers should provide the value already formatted as `XXX XXX XXXX`.

## Related components

- `UnitedKingdomNationalHealthServiceNumberInput` — the paired input component.
- `IrelandIndividualHealthIdentifierView` — Ireland IHI read-only view.
- `NorthernIrelandHealthAndCareNumberView` — NI H&C number view.
- `UnitedStatesSocialSecurityNumberView` — US SSN read-only view.
