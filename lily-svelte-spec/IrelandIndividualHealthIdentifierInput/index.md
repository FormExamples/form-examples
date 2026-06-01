# IrelandIndividualHealthIdentifierInput

IrelandIndividualHealthIdentifierInput is a headless Svelte 5 input for entering an Ireland Individual Health Identifier (IHI) — a 10-digit clinical identifier used by the Irish Health Service Executive (HSE) to safely match patients with their medical records across hospitals and GPs.

## What it is

A specialised `<input type="text">` configured for the Irish IHI format with accessibility-focused defaults: `inputmode="numeric"`, `pattern="[0-9]{10}"`, and `autocomplete="off"` to protect sensitive health data.

## What it does

- Renders an `<input type="text">` with `class="ireland-individual-health-identifier-input"` plus any consumer-provided CSS class.
- Applies `aria-label` from the required `label` prop.
- Sets `inputmode="numeric"` so mobile devices show a numeric keyboard.
- Sets `pattern="[0-9]{10}"` to enforce 10-digit validation at submit time.
- Sets `autocomplete="off"` to protect sensitive health identifiers.
- Provides a bindable `value` via `$bindable("")` for two-way binding.
- Supports `required` and `disabled` HTML states.
- Spreads `...restProps` onto the `<input>` for consumer customization.

## When to use it

- Collecting an Irish patient's IHI within a clinical or administrative form.
- Admission, registration, or identity-verification flows within the Irish healthcare context.
- Any application that needs to reference the HSE's unique patient identifier.

## When not to use it

- Do not use for other national healthcare identifiers — use the corresponding UK (`UnitedKingdomNationalHealthServiceNumberInput`), US (`UnitedStatesSocialSecurityNumberInput`), French (`FranceNumeroDIdentificationAuRepertoireInput`), or Spanish (`EspanaTarjetaSanitariaIndividualInput`) components.
- Do not use for display-only contexts — use `IrelandIndividualHealthIdentifierView`.
- Do not use when you cannot protect the value appropriately — IHIs are sensitive personal data.
- Do not use for non-numeric identifiers or free-form text — use `TextInput`.

## How to use it

Import the component, pass a `label` (for example "IHI" or a localised equivalent), and bind the `value`. Consumers are responsible for checksum-level validation and server-side verification.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `value` (string, optional, default `""`) — bindable IHI value via `bind:value`.
- `required` (boolean, optional, default `false`) — whether the input is required.
- `disabled` (boolean, optional, default `false`) — whether the input is disabled.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<input>`.

## Usage

### Basic IHI entry

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierInput from "./IrelandIndividualHealthIdentifierInput.svelte";
    let ihi = $state("");
</script>

<IrelandIndividualHealthIdentifierInput label="IHI" bind:value={ihi} />
```

### Required IHI input

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierInput from "./IrelandIndividualHealthIdentifierInput.svelte";
    let ihi = $state("");
</script>

<IrelandIndividualHealthIdentifierInput
    label="Individual Health Identifier"
    bind:value={ihi}
    required
/>
```

### Disabled IHI input

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierInput from "./IrelandIndividualHealthIdentifierInput.svelte";
    let ihi = $state("1234567890");
</script>

<IrelandIndividualHealthIdentifierInput label="IHI" bind:value={ihi} disabled />
```

### Inside a field with a localised label

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierInput from "./IrelandIndividualHealthIdentifierInput.svelte";
    let ihi = $state("");
    const t = { label: "Uimhir Aitheantais Sláinte Aonair" };
</script>

<IrelandIndividualHealthIdentifierInput label={t.label} bind:value={ihi} required />
```

### IHI input with placeholder

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierInput from "./IrelandIndividualHealthIdentifierInput.svelte";
    let ihi = $state("");
</script>

<IrelandIndividualHealthIdentifierInput
    label="IHI"
    bind:value={ihi}
    placeholder="10 digits"
/>
```

## Accessibility

- `aria-label` supplies an accessible name when no visible `<label>` is present.
- `inputmode="numeric"` surfaces a numeric keypad on mobile browsers.
- `pattern="[0-9]{10}"` enables native form validation.
- `autocomplete="off"` avoids storing sensitive health data in browser autofill.
- Native `required` and `disabled` attributes are conveyed to assistive technology.
- Compliant with WCAG 2.2 AAA with consumer-provided focus indicators.

## Related components

- `IrelandIndividualHealthIdentifierView` — paired read-only display of the same identifier.
- `UnitedKingdomNationalHealthServiceNumberInput` / `UnitedKingdomNationalHealthServiceNumberView` — UK NHS number.
- `UnitedStatesSocialSecurityNumberInput` / `UnitedStatesSocialSecurityNumberView` — US SSN.
- `FranceNumeroDIdentificationAuRepertoireInput` / `FranceNumeroDIdentificationAuRepertoireView` — French NIR.
- `EspanaTarjetaSanitariaIndividualInput` / `EspanaTarjetaSanitariaIndividualView` — Spanish TSI.
- `NorthernIrelandHealthAndCareNumberInput` / `NorthernIrelandHealthAndCareNumberView` — Northern Ireland H&C number.
