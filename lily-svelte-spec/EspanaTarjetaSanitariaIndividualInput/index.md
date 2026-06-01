# EspanaTarjetaSanitariaIndividualInput

A headless text input for entering a España Tarjeta Sanitaria Individual (TSI / CIP-SNS), the unique Spanish national healthcare identifier.

## What it is

`EspanaTarjetaSanitariaIndividualInput` wraps an `<input type="text">` with `aria-label`, `autocomplete="off"` for sensitive health identifiers, and a bindable value. The TSI format varies by Autonomous Community but typically starts with four region digits followed by alphanumeric characters; this component stores the value as a plain string and leaves format validation to the consumer.

## What it does

- Renders `<input type="text" aria-label={label} autocomplete="off">`.
- Binds `value` via `$bindable()`.
- Forwards `required` and `disabled`.
- Spreads `restProps` onto the `<input>`.

## When to use it

- Forms collecting patient or member identifiers in Spanish healthcare applications.
- Registration and onboarding flows where a TSI must be captured.
- Any context where sensitive health ID input should disable browser autocomplete.

## When not to use it

- To display an existing TSI in read-only form. Use `EspanaTarjetaSanitariaIndividualView` instead.
- For other national healthcare identifiers. Use the dedicated component for each country (UK NHS number, France NIR, Ireland IHI, Northern Ireland H&C, US SSN).
- For generic text input. Use `TextInput`.

## How to use it

Provide a required `label` and bind the value.

```svelte
<script lang="ts">
    import EspanaTarjetaSanitariaIndividualInput from "./EspanaTarjetaSanitariaIndividualInput.svelte";
    let tsi = $state("");
</script>

<EspanaTarjetaSanitariaIndividualInput label="TSI" bind:value={tsi} />
```

## Props

| Prop       | Type      | Default | Description                                   |
| ---------- | --------- | ------- | --------------------------------------------- |
| `class`    | `string`  | `""`    | CSS class appended to the base class.        |
| `label`    | `string`  | required| Accessible name via `aria-label`.             |
| `value`    | `string`  | `""`    | Bindable TSI string.                          |
| `required` | `boolean` | `false` | Whether the input is required.                |
| `disabled` | `boolean` | `false` | Whether the input is disabled.                |
| `...rest`  | `unknown` | —       | Additional HTML attributes on the `<input>`.  |

## Usage

### 1. Basic input

```svelte
<EspanaTarjetaSanitariaIndividualInput label="TSI" bind:value={tsi} />
```

### 2. Required

```svelte
<EspanaTarjetaSanitariaIndividualInput label="TSI" bind:value={tsi} required />
```

### 3. Disabled (for previewing a pre-filled value)

```svelte
<EspanaTarjetaSanitariaIndividualInput
    label="TSI"
    value="BBBB12345678"
    disabled
/>
```

### 4. Inside a Field

```svelte
<Field label="Tarjeta Sanitaria Individual" description="Formato variable por CCAA">
    <EspanaTarjetaSanitariaIndividualInput label="TSI" bind:value={tsi} />
</Field>
```

### 5. With paired view for confirm screens

```svelte
<EspanaTarjetaSanitariaIndividualInput label="TSI" bind:value={tsi} />
<p>Confirmación: <EspanaTarjetaSanitariaIndividualView label="TSI" value={tsi} /></p>
```

## Accessibility

- `aria-label` provides the accessible name.
- `autocomplete="off"` prevents browsers from storing this sensitive health identifier.
- `required` and `disabled` states are communicated natively.

## Related components

- `EspanaTarjetaSanitariaIndividualView` — read-only display counterpart.
- `UnitedKingdomNationalHealthServiceNumberInput`, `FranceNumeroDIdentificationAuRepertoireInput`, `IrelandIndividualHealthIdentifierInput`, `NorthernIrelandHealthAndCareNumberInput`, `UnitedStatesSocialSecurityNumberInput` — analogous identifiers for other countries.
- `TextInput` — generic text input.
- `Field`, `Form` — form composition wrappers.
