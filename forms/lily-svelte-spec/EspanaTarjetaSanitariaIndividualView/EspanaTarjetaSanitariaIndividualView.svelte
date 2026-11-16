<script lang="ts">
    // EspanaTarjetaSanitariaIndividualView component
    //
    // A headless display component for showing a España Tarjeta Sanitaria
    // Individual (TSI) / CIP-SNS in a read-only format. The TSI is the unique
    // Spanish national healthcare identifier printed on the tarjeta sanitaria.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
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
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
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
        label?: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- EspanaTarjetaSanitariaIndividualView.svelte -->
<span
    class={`espana-tarjeta-sanitaria-individual-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
