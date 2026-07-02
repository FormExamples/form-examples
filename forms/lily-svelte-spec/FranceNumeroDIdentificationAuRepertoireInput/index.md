# FranceNumeroDIdentificationAuRepertoireInput

A headless input for entering a France numéro d'identification au répertoire (NIR) - the unique 15-digit French national healthcare identifier printed on the Carte Vitale. The standard display format is `X XX XX XX XXX XXX XX`.

## What it is

A Svelte 5 component that renders a native `<input type="text">` pre-configured with `inputmode="numeric"`, a `pattern` enforcing the NIR spacing format, and `autocomplete="off"` to protect sensitive health data.

## What it does

- Renders `<input class="france-numero-d-identification-au-repertoire-input ..." type="text">`.
- Sets `aria-label={label}` for screen reader name.
- Sets `inputmode="numeric"` so mobile keyboards default to the numeric keypad.
- Applies `pattern="[0-9]{1} [0-9]{2} [0-9]{2} [0-9]{2} [0-9]{3} [0-9]{3} [0-9]{2}"` for native validation on submit.
- Sets `autocomplete="off"` to prevent browser autofill of a sensitive identifier.
- Binds the `value` prop with `bind:value` via `$bindable`.
- Reflects `required` and `disabled` states on the input.

## When to use it

- Forms collecting a patient or beneficiary's French NIR (numéro de sécurité sociale).
- Healthcare registration, benefits, or carte Vitale-related forms.
- Any flow that must capture the NIR in the standard spaced format.

## When not to use it

- For read-only display of an already captured NIR. Use `FranceNumeroDIdentificationAuRepertoireView`.
- For other countries' national healthcare identifiers. Use the appropriate country-specific component (`UnitedKingdomNationalHealthServiceNumberInput`, `IrelandIndividualHealthIdentifierInput`, etc.).
- For generic numeric input. Use `NumberInput`.
- For a social security number in another jurisdiction. Use `UnitedStatesSocialSecurityNumberInput`.

## How to use it

Pass a required localized `label` and optionally bind `value`. The consumer renders their own label, hint, and error messages around the input (for example using `Field`).

## Props

- `class` (string, optional) - CSS class appended after the base component class.
- `label` (string, required) - Accessible label via `aria-label`.
- `value` (string, default `""`) - Input value. Bindable via `bind:value`.
- `required` (boolean, default `false`) - Whether the input is required.
- `disabled` (boolean, default `false`) - Whether the input is disabled.
- `...restProps` - Additional HTML attributes spread onto the `<input>`.

## Usage

```svelte
<script lang="ts">
    import FranceNumeroDIdentificationAuRepertoireInput from "./FranceNumeroDIdentificationAuRepertoireInput.svelte";
    let nir = $state("");
</script>

<FranceNumeroDIdentificationAuRepertoireInput
    label="Numéro de sécurité sociale"
    bind:value={nir}
/>
```

```svelte
<script lang="ts">
    import FranceNumeroDIdentificationAuRepertoireInput from "./FranceNumeroDIdentificationAuRepertoireInput.svelte";
    let nir = $state("1 85 05 75 012 345 67");
</script>

<FranceNumeroDIdentificationAuRepertoireInput
    label="NIR"
    bind:value={nir}
    required
/>
```

```svelte
<script lang="ts">
    import FranceNumeroDIdentificationAuRepertoireInput from "./FranceNumeroDIdentificationAuRepertoireInput.svelte";
</script>

<FranceNumeroDIdentificationAuRepertoireInput
    label="NIR"
    disabled
    value="1 85 05 75 012 345 67"
/>
```

```svelte
<script lang="ts">
    import Form from "../Form/Form.svelte";
    import Field from "../Field/Field.svelte";
    import FranceNumeroDIdentificationAuRepertoireInput from "./FranceNumeroDIdentificationAuRepertoireInput.svelte";
    import Button from "../Button/Button.svelte";
    let nir = $state("");
</script>

<Form label="Patient registration" onsubmit={() => console.log(nir)}>
    <Field label="NIR">
        <FranceNumeroDIdentificationAuRepertoireInput
            label="NIR"
            bind:value={nir}
            required
        />
    </Field>
    <Button type="submit" label="Register">Register</Button>
</Form>
```

```svelte
<script lang="ts">
    import FranceNumeroDIdentificationAuRepertoireInput from "./FranceNumeroDIdentificationAuRepertoireInput.svelte";
    let nir = $state("");
</script>

<FranceNumeroDIdentificationAuRepertoireInput
    label="NIR"
    bind:value={nir}
    class="nir-field"
    data-testid="nir-input"
    aria-describedby="nir-hint"
/>
<p id="nir-hint">Format: X XX XX XX XXX XXX XX</p>
```

## Accessibility

- `aria-label` provides the accessible name for screen readers.
- `inputmode="numeric"` hints a numeric keyboard on mobile devices.
- `pattern` enables native form validation feedback on submit.
- `autocomplete="off"` prevents autofill of sensitive identifiers.
- `required` and `disabled` are reflected on the input element.

## Related components

- `FranceNumeroDIdentificationAuRepertoireView` - read-only display counterpart (Input/View pattern).
- `EspanaTarjetaSanitariaIndividualInput` / `EspanaTarjetaSanitariaIndividualView` - Spanish TSI input/view.
- `IrelandIndividualHealthIdentifierInput` / `IrelandIndividualHealthIdentifierView` - Irish IHI.
- `UnitedKingdomNationalHealthServiceNumberInput` / ...`View` - UK NHS number.
- `UnitedStatesSocialSecurityNumberInput` / ...`View` - US SSN.
- `NumberInput` - generic numeric input.
