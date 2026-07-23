# UnitedKingdomNationalHealthServiceNumberInput

An input for entering a 10-digit UK NHS number in `XXX XXX XXXX` format, rendered as `<input type="text">` with `inputmode="numeric"`, a strict `pattern`, `autocomplete="off"`, and bindable `value`.

## What it is

`UnitedKingdomNationalHealthServiceNumberInput` is a headless Svelte 5 component for collecting a UK NHS number — a 10-digit identifier assigned to patients registered with the NHS in England, Wales, and the Isle of Man. The display format is three space-separated groups: `XXX XXX XXXX`. It is the editable half of the Input/View pattern with `UnitedKingdomNationalHealthServiceNumberView`.

## What it does

- Renders `<input type="text" class="united-kingdom-national-health-service-number-input {className}">`.
- Sets `aria-label={label}` for the accessible name.
- Sets `inputmode="numeric"` so mobile keyboards default to digits.
- Sets `pattern="[0-9]{3} [0-9]{3} [0-9]{4}"` (defined as a constant to avoid Svelte curly-brace parsing) to enforce the NHS format on form validation.
- Sets `autocomplete="off"` to protect sensitive health information.
- Binds `value` via `bind:value`.
- Forwards `required` and `disabled`.
- Spreads additional HTML attributes onto the `<input>` (e.g. `placeholder`, `id`).

## When to use it

- NHS patient registration and intake forms.
- Medical records, appointments, and prescription flows that need the patient's NHS number.
- Any UK healthcare interface identifying patients by NHS number.

## When not to use it

- Don't use it for US Social Security Numbers — use `UnitedStatesSocialSecurityNumberInput`.
- Don't use it for Ireland IHI — use `IrelandIndividualHealthIdentifierInput`.
- Don't use it for Northern Ireland Health and Care number — use `NorthernIrelandHealthAndCareNumberInput`.
- Don't use it for read-only NHS number display — use `UnitedKingdomNationalHealthServiceNumberView`.

## How to use it

Import the component and bind `value`. Pass a translated `label`. Add `required` when the field must be completed.

## Props

- `class` — string, optional. Extra CSS class appended to `united-kingdom-national-health-service-number-input`.
- `label` — string, required. Accessible name via `aria-label`.
- `value` — string, default `""`, bindable via `bind:value`. The NHS number string.
- `required` — boolean, default `false`. Whether the input is required.
- `disabled` — boolean, default `false`. Whether the input is disabled.
- `...restProps` — any additional HTML attributes spread onto the `<input>`.

## Usage

```svelte
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberInput from "./UnitedKingdomNationalHealthServiceNumberInput.svelte";

  let nhs = $state("");
</script>

<UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" bind:value={nhs} />
```

```svelte
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberInput from "./UnitedKingdomNationalHealthServiceNumberInput.svelte";

  let nhs = $state("");
</script>

<form>
  <UnitedKingdomNationalHealthServiceNumberInput
    label="NHS Number"
    bind:value={nhs}
    required
    placeholder="000 000 0000"
  />
  <button type="submit">Submit</button>
</form>
```

```svelte
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberInput from "./UnitedKingdomNationalHealthServiceNumberInput.svelte";
  import UnitedKingdomNationalHealthServiceNumberView from "../UnitedKingdomNationalHealthServiceNumberView/UnitedKingdomNationalHealthServiceNumberView.svelte";

  let nhs = $state("123 456 7890");
  let editing = $state(false);
</script>

{#if editing}
  <UnitedKingdomNationalHealthServiceNumberInput label="NHS Number" bind:value={nhs} />
  <button type="button" onclick={() => (editing = false)}>Done</button>
{:else}
  <UnitedKingdomNationalHealthServiceNumberView label="NHS Number" value={nhs} />
  <button type="button" onclick={() => (editing = true)}>Edit</button>
{/if}
```

```svelte
<script lang="ts">
  import UnitedKingdomNationalHealthServiceNumberInput from "./UnitedKingdomNationalHealthServiceNumberInput.svelte";

  let nhs = $state("999 999 9999");
  let locked = $state(true);
</script>

<UnitedKingdomNationalHealthServiceNumberInput
  label="NHS Number"
  bind:value={nhs}
  disabled={locked}
/>
<button type="button" onclick={() => (locked = !locked)}>
  {locked ? "Unlock" : "Lock"}
</button>
```

## Accessibility

- `aria-label` supplies the accessible name (no visible `<label>`).
- `inputmode="numeric"` hints mobile keyboards to show digits.
- `pattern` enforces `XXX XXX XXXX` format during browser form validation.
- `autocomplete="off"` avoids autofilling sensitive health identifiers.
- `required` and `disabled` are communicated natively.

## Related components

- `UnitedKingdomNationalHealthServiceNumberView` — paired read-only display component.
- `IrelandIndividualHealthIdentifierInput` / `IrelandIndividualHealthIdentifierView` — Ireland IHI.
- `NorthernIrelandHealthAndCareNumberInput` / `NorthernIrelandHealthAndCareNumberView` — NI H&C number.
- `UnitedStatesSocialSecurityNumberInput` / `UnitedStatesSocialSecurityNumberView` — US SSN.

---

Lily™ and Lily Design System™ are trademarks.
