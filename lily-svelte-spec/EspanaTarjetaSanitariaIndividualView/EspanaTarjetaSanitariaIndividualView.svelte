<script lang="ts">
    // EspanaTarjetaSanitariaIndividualView component
    //
    // A headless display component for showing a España Tarjeta Sanitaria
    // Individual (TSI) / CIP-SNS in a read-only format. The TSI is the unique
    // Spanish national healthcare identifier printed on the tarjeta sanitaria.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label via aria-label.
    //   value — string, default "". The TSI string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <EspanaTarjetaSanitariaIndividualView label="TSI" value="BBBB12345678" />
    //
    // Keyboard:
    //   - None -- passive display-only component
    //
    // Accessibility:
    //   - aria-label provides the accessible name for screen readers
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Companion to EspanaTarjetaSanitariaIndividualInput

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- EspanaTarjetaSanitariaIndividualView.svelte -->
<span
    class={`espana-tarjeta-sanitaria-individual-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span>
