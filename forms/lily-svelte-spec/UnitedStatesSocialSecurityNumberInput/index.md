# UnitedStatesSocialSecurityNumberInput

An input for entering a 9-digit US Social Security Number in `XXX-XX-XXXX` format, rendered as `<input type="text">` with `inputmode="numeric"`, a strict `pattern`, `autocomplete="off"`, and bindable `value`.

## What it is

`UnitedStatesSocialSecurityNumberInput` is a headless Svelte 5 component for collecting a US Social Security Number (SSN) — a 9-digit identifier issued by the Social Security Administration. The display format is `XXX-XX-XXXX`: a 3-digit area number, a 2-digit group number, and a 4-digit serial number. It is the editable half of the Input/View pattern with `UnitedStatesSocialSecurityNumberView`.

## What it does

- Renders `<input type="text" class="united-states-social-security-number-input {className}">`.
- Sets `aria-label={label}` for the accessible name.
- Sets `inputmode="numeric"` for digit-friendly mobile keyboards.
- Sets `pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"` (held as a constant to avoid Svelte curly-brace parsing) to enforce the SSN format at form validation.
- Sets `autocomplete="off"` to protect sensitive PII.
- Binds `value` via `bind:value`.
- Forwards `required` and `disabled`.
- Spreads additional HTML attributes onto the `<input>` (e.g. `placeholder`, `id`).

## When to use it

- Tax forms and employment applications.
- Benefits enrollment and financial onboarding.
- US government identity verification flows.
- Any authorized US context that requires an SSN.

## When not to use it

- Don't use it for UK NHS numbers — use `UnitedKingdomNationalHealthServiceNumberInput`.
- Don't use it for Ireland IHI — use `IrelandIndividualHealthIdentifierInput`.
- Don't use it for generic numeric entry — use `NumberInput`.
- Don't use it to display an existing SSN read-only — use `UnitedStatesSocialSecurityNumberView`.
- Don't collect SSNs without a clear legal basis and appropriate security controls.

## How to use it

Import and bind `value`. Pass a translated `label`. Mark `required` when the form demands it.

## Props

- `class` — string, optional. Extra CSS class appended to `united-states-social-security-number-input`.
- `label` — string, required. Accessible name via `aria-label`.
- `value` — string, default `""`, bindable via `bind:value`. The SSN string.
- `required` — boolean, default `false`. Whether the input is required.
- `disabled` — boolean, default `false`. Whether the input is disabled.
- `...restProps` — any additional HTML attributes spread onto the `<input>`.

## Usage

```svelte
<script lang="ts">
  import UnitedStatesSocialSecurityNumberInput from "./UnitedStatesSocialSecurityNumberInput.svelte";

  let ssn = $state("");
</script>

<UnitedStatesSocialSecurityNumberInput
  label="Social Security Number"
  bind:value={ssn}
/>
```

```svelte
<script lang="ts">
  import UnitedStatesSocialSecurityNumberInput from "./UnitedStatesSocialSecurityNumberInput.svelte";

  let ssn = $state("");
</script>

<form>
  <UnitedStatesSocialSecurityNumberInput
    label="Social Security Number"
    bind:value={ssn}
    required
    placeholder="000-00-0000"
  />
  <button type="submit">Submit</button>
</form>
```

```svelte
<script lang="ts">
  import UnitedStatesSocialSecurityNumberInput from "./UnitedStatesSocialSecurityNumberInput.svelte";

  let ssn = $state("123-45-6789");
  let locked = $state(true);
</script>

<UnitedStatesSocialSecurityNumberInput
  label="SSN"
  bind:value={ssn}
  disabled={locked}
/>
<button type="button" onclick={() => (locked = !locked)}>
  {locked ? "Unlock" : "Lock"}
</button>
```

```svelte
<script lang="ts">
  import UnitedStatesSocialSecurityNumberInput from "./UnitedStatesSocialSecurityNumberInput.svelte";

  let ssn = $state("");
  let err = $state("");

  function validate(v: string) {
    err = /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/.test(v) ? "" : "Use XXX-XX-XXXX format";
  }
</script>

<UnitedStatesSocialSecurityNumberInput
  label="SSN"
  bind:value={ssn}
  oninput={(e) => validate((e.currentTarget as HTMLInputElement).value)}
  aria-describedby="ssn-err"
  required
/>
{#if err}<p id="ssn-err" role="alert">{err}</p>{/if}
```

## Accessibility

- `aria-label` supplies the accessible name (no visible `<label>`).
- `inputmode="numeric"` gives a digit-focused mobile keyboard.
- `pattern` enforces `XXX-XX-XXXX` during browser form validation.
- `autocomplete="off"` protects sensitive PII.
- `required` and `disabled` are conveyed natively.

## Related components

- `UnitedStatesSocialSecurityNumberView` — paired read-only display component.
- `UnitedKingdomNationalHealthServiceNumberInput` / `UnitedKingdomNationalHealthServiceNumberView` — UK NHS number.
- `IrelandIndividualHealthIdentifierInput` / `IrelandIndividualHealthIdentifierView` — Ireland IHI.
- `NorthernIrelandHealthAndCareNumberInput` / `NorthernIrelandHealthAndCareNumberView` — NI H&C number.
