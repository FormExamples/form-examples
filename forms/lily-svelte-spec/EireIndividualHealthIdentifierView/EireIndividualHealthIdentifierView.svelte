<script lang="ts">
    // EireIndividualHealthIdentifierView component
    //
    // A headless display component for showing an Eire Individual Health
    // Identifier (IHI) in a read-only format. The IHI is a 10-digit clinical
    // identifier used by the HSE to match patients with medical records.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The IHI string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <EireIndividualHealthIdentifierView label="IHI" value="1234567890" />
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Companion to EireIndividualHealthIdentifierInput

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

<!-- EireIndividualHealthIdentifierView.svelte -->
<span
    class={`eire-individual-health-identifier-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
