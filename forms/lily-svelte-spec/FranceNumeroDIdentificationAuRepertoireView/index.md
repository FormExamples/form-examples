# FranceNumeroDIdentificationAuRepertoireView

A headless read-only display of a France numéro d'identification au répertoire (NIR). Renders the value as an inline `<span>` with an accessible `aria-label`. This is the View counterpart to `FranceNumeroDIdentificationAuRepertoireInput` in the Input/View pattern.

## What it is

A Svelte 5 component that renders an inline `<span>` containing the supplied NIR string, with the base class `france-numero-d-identification-au-repertoire-view` and `aria-label={label}`.

## What it does

- Renders `<span class="france-numero-d-identification-au-repertoire-view ..." aria-label={label}>{value}</span>`.
- Spreads additional HTML attributes onto the `<span>`.
- Performs no formatting, validation, or masking - the consumer supplies a pre-formatted value.

## When to use it

- Patient records, summaries, and confirmation screens showing an already-captured NIR.
- Any read-only context where the NIR needs to be visible but not editable.

## When not to use it

- For capturing or editing the NIR. Use `FranceNumeroDIdentificationAuRepertoireInput`.
- For other countries' healthcare identifiers. Use the corresponding country-specific `-View` component.
- For general text output. Use a plain `<span>` or `BodyText`.

## How to use it

Supply the `value` string (pre-formatted as `X XX XX XX XXX XXX XX`) and a localized `label` describing its purpose.

## Props

- `class` (string, optional) - CSS class appended after the base component class.
- `label` (string, required) - Accessible label for screen readers via `aria-label`.
- `value` (string, default `""`) - The NIR string to display.
- `...restProps` - Additional HTML attributes spread onto the `<span>`.

## Usage

```svelte
<script lang="ts">
    import FranceNumeroDIdentificationAuRepertoireView from "./FranceNumeroDIdentificationAuRepertoireView.svelte";
</script>

<FranceNumeroDIdentificationAuRepertoireView
    label="Numéro de sécurité sociale"
    value="1 85 05 75 012 345 67"
/>
```

```svelte
<script lang="ts">
    import FranceNumeroDIdentificationAuRepertoireView from "./FranceNumeroDIdentificationAuRepertoireView.svelte";
    const patient = { nir: "2 73 12 13 456 789 42" };
</script>

<dl>
    <dt>NIR</dt>
    <dd>
        <FranceNumeroDIdentificationAuRepertoireView
            label="NIR"
            value={patient.nir}
        />
    </dd>
</dl>
```

```svelte
<script lang="ts">
    import FranceNumeroDIdentificationAuRepertoireView from "./FranceNumeroDIdentificationAuRepertoireView.svelte";
    let patients = $state([
        { name: "Alice", nir: "1 85 05 75 012 345 67" },
        { name: "Bruno", nir: "2 90 11 95 999 888 11" },
    ]);
</script>

<ul>
    {#each patients as p}
        <li>
            {p.name}:
            <FranceNumeroDIdentificationAuRepertoireView
                label="NIR"
                value={p.nir}
            />
        </li>
    {/each}
</ul>
```

```svelte
<script lang="ts">
    import FranceNumeroDIdentificationAuRepertoireView from "./FranceNumeroDIdentificationAuRepertoireView.svelte";
</script>

<FranceNumeroDIdentificationAuRepertoireView
    label="NIR"
    value="1 85 05 75 012 345 67"
    class="identifier"
    data-testid="nir-display"
/>
```

```svelte
<script lang="ts">
    import FranceNumeroDIdentificationAuRepertoireInput from "../FranceNumeroDIdentificationAuRepertoireInput/FranceNumeroDIdentificationAuRepertoireInput.svelte";
    import FranceNumeroDIdentificationAuRepertoireView from "./FranceNumeroDIdentificationAuRepertoireView.svelte";
    let editing = $state(true);
    let nir = $state("");
</script>

{#if editing}
    <FranceNumeroDIdentificationAuRepertoireInput label="NIR" bind:value={nir} />
    <button onclick={() => (editing = false)}>Save</button>
{:else}
    <FranceNumeroDIdentificationAuRepertoireView label="NIR" value={nir} />
    <button onclick={() => (editing = true)}>Edit</button>
{/if}
```

## Accessibility

- `aria-label` ensures screen readers announce the semantic purpose of the value.
- Passive display - no keyboard behaviour.
- Consumers should avoid exposing the full NIR when not necessary (it is sensitive personal data).

## Related components

- `FranceNumeroDIdentificationAuRepertoireInput` - editable input counterpart (Input/View pattern).
- `EspanaTarjetaSanitariaIndividualView` - Spanish TSI display.
- `IrelandIndividualHealthIdentifierView` - Irish IHI display.
- `UnitedKingdomNationalHealthServiceNumberView` - UK NHS number display.
- `UnitedStatesSocialSecurityNumberView` - US SSN display.
- `NorthernIrelandHealthAndCareNumberView` - Northern Ireland H&C number display.

---

Lily™ and Lily Design System™ are trademarks.
