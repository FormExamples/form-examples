<script lang="ts">
    // MaltaNationalIdentificationNumberView component
    //
    // A headless display component for showing Malta's
    // Malta National Identification Number in a read-only format.
    // Format: 8 characters: 7 digits and a letter (A, B, G, H, L, M, P, or Z) that encodes geographic origin and registration era.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MaltaNationalIdentificationNumberView label="Malta National Identification Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Malta

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

<!-- MaltaNationalIdentificationNumberView.svelte -->
<span
    class={`malta-national-identification-number-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
