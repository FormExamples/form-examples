# EspanaTarjetaSanitariaIndividualView

A headless read-only display of a España Tarjeta Sanitaria Individual (TSI / CIP-SNS) identifier. Renders a `<span>` with an accessible label.

## What it is

`EspanaTarjetaSanitariaIndividualView` is the display-only companion to `EspanaTarjetaSanitariaIndividualInput`. It renders a `<span>` containing the TSI value, with an `aria-label` for screen readers. The component contributes no styling or formatting — the raw string is shown as-is.

## What it does

- Renders `<span class="espana-tarjeta-sanitaria-individual-view" aria-label={label}>{value}</span>`.
- Forwards `restProps` onto the `<span>`.

## When to use it

- Patient profiles, appointment summaries, check-in screens where a TSI should be visible but not editable.
- Confirmation screens echoing what the user entered.
- Any read-only surface that shows a TSI.

## When not to use it

- For capturing input. Use `EspanaTarjetaSanitariaIndividualInput` instead.
- For other healthcare identifiers. Use the matching country-specific view component.
- For general text display. Use a plain `<span>`.

## How to use it

Pass the TSI string and an accessible label.

```svelte
<script lang="ts">
    import EspanaTarjetaSanitariaIndividualView from "./EspanaTarjetaSanitariaIndividualView.svelte";
</script>

<EspanaTarjetaSanitariaIndividualView label="TSI" value="BBBB12345678" />
```

## Props

| Prop      | Type      | Default  | Description                              |
| --------- | --------- | -------- | ---------------------------------------- |
| `class`   | `string`  | `""`     | CSS class appended to the base class.   |
| `label`   | `string`  | required | Accessible name via `aria-label`.        |
| `value`   | `string`  | `""`     | TSI string to display.                   |
| `...rest` | `unknown` | —        | Additional HTML attributes on the span.  |

## Usage

### 1. Basic display

```svelte
<EspanaTarjetaSanitariaIndividualView label="TSI" value="BBBB12345678" />
```

### 2. In a summary list

```svelte
<SummaryList>
    <SummaryListItem term="TSI">
        <EspanaTarjetaSanitariaIndividualView label="TSI" value={patient.tsi} />
    </SummaryListItem>
</SummaryList>
```

### 3. Localised label

```svelte
<EspanaTarjetaSanitariaIndividualView
    label="Tarjeta Sanitaria Individual"
    value={patient.tsi}
/>
```

### 4. Paired with input for confirmation

```svelte
<EspanaTarjetaSanitariaIndividualInput label="TSI" bind:value={tsi} />
<p>Valor actual: <EspanaTarjetaSanitariaIndividualView label="TSI" value={tsi} /></p>
```

### 5. Styled via class

```svelte
<EspanaTarjetaSanitariaIndividualView
    label="TSI"
    value={patient.tsi}
    class="monospace"
/>
```

## Accessibility

- `aria-label` provides an explicit accessible name even when the surrounding context is insufficient.
- Passive display element; no keyboard interaction.

## Related components

- `EspanaTarjetaSanitariaIndividualInput` — input counterpart.
- `UnitedKingdomNationalHealthServiceNumberView`, `FranceNumeroDIdentificationAuRepertoireView`, `IrelandIndividualHealthIdentifierView`, `NorthernIrelandHealthAndCareNumberView`, `UnitedStatesSocialSecurityNumberView` — analogous views for other countries.
- `SummaryList`, `SummaryListItem` — key/value displays.

---

Lily™ and Lily Design System™ are trademarks.
