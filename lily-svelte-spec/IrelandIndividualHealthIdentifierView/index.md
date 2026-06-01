# IrelandIndividualHealthIdentifierView

IrelandIndividualHealthIdentifierView is a headless Svelte 5 display component that shows an Ireland Individual Health Identifier (IHI) as read-only text. The IHI is the 10-digit clinical identifier used by the Irish Health Service Executive (HSE) to match patients with their medical records.

## What it is

A thin, unstyled `<span>` wrapper that renders an IHI string with an `aria-label` for additional screen-reader context. It is the read-only companion to `IrelandIndividualHealthIdentifierInput` in the Input/View pattern.

## What it does

- Renders a `<span>` with `class="ireland-individual-health-identifier-view"` plus any consumer-provided CSS class.
- Displays the `value` prop as the element's text content.
- Applies `aria-label` from the required `label` prop.
- Spreads `...restProps` onto the `<span>` for consumer customization.

## When to use it

- Displaying an IHI on a patient record, summary page, or print-friendly view.
- Read-only presentation of an identifier alongside other patient details.
- Confirming a previously-entered IHI back to the user within a summary step.

## When not to use it

- Do not use for editing — use `IrelandIndividualHealthIdentifierInput`.
- Do not use for other national healthcare identifiers — use the matching country-specific view.
- Do not use when the identifier should be masked or redacted — wrap with your own redaction logic.
- Do not use to display free-form text — use `BodyText` or plain markup.

## How to use it

Import the component, pass the `value` (the IHI string) and a `label`, and render it inline or inside a summary list.

## Props

- `class` (string, optional) — consumer CSS class appended to the base class.
- `label` (string, required) — accessible name applied via `aria-label`.
- `value` (string, optional, default `""`) — the IHI string to display.
- `...restProps` (unknown) — additional HTML attributes spread onto the `<span>`.

## Usage

### Simple IHI display

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierView from "./IrelandIndividualHealthIdentifierView.svelte";
</script>

<IrelandIndividualHealthIdentifierView label="IHI" value="1234567890" />
```

### IHI inline with descriptive text

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierView from "./IrelandIndividualHealthIdentifierView.svelte";
    let ihi = $state("1234567890");
</script>

<p>
    Patient IHI:
    <IrelandIndividualHealthIdentifierView label="IHI" value={ihi} />
</p>
```

### IHI inside a summary list

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierView from "./IrelandIndividualHealthIdentifierView.svelte";
</script>

<dl>
    <dt>Individual Health Identifier</dt>
    <dd>
        <IrelandIndividualHealthIdentifierView
            label="IHI"
            value="1234567890"
        />
    </dd>
</dl>
```

### Consumer-styled IHI

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierView from "./IrelandIndividualHealthIdentifierView.svelte";
</script>

<IrelandIndividualHealthIdentifierView
    class="ihi-monospace"
    label="IHI"
    value="1234567890"
/>

<style>
    :global(.ihi-monospace) {
        font-family: ui-monospace, monospace;
        letter-spacing: 0.05em;
    }
</style>
```

### Empty state

```svelte
<script lang="ts">
    import IrelandIndividualHealthIdentifierView from "./IrelandIndividualHealthIdentifierView.svelte";
    let ihi = $state("");
</script>

<IrelandIndividualHealthIdentifierView
    label="IHI (not recorded)"
    value={ihi || "—"}
/>
```

## Accessibility

- `aria-label` supplies an accessible name so screen readers can describe the value context.
- Text content is inherently accessible — no additional ARIA is needed.
- Compliant with WCAG 2.2 AAA when the consumer supplies sufficient colour contrast.

## Related components

- `IrelandIndividualHealthIdentifierInput` — paired input for entering the same identifier.
- `UnitedKingdomNationalHealthServiceNumberView` / `UnitedKingdomNationalHealthServiceNumberInput` — UK NHS number.
- `UnitedStatesSocialSecurityNumberView` / `UnitedStatesSocialSecurityNumberInput` — US SSN.
- `FranceNumeroDIdentificationAuRepertoireView` / `FranceNumeroDIdentificationAuRepertoireInput` — French NIR.
- `EspanaTarjetaSanitariaIndividualView` / `EspanaTarjetaSanitariaIndividualInput` — Spanish TSI.
- `NorthernIrelandHealthAndCareNumberView` / `NorthernIrelandHealthAndCareNumberInput` — Northern Ireland H&C number.
