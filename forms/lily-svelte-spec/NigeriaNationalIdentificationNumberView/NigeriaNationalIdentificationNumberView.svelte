<script lang="ts">
    // NigeriaNationalIdentificationNumberView component
    //
    // A headless display component for showing Nigeria's
    // National Identification Number (NIN) in a read-only format.
    // Format: Eleven digits issued by the National Identity Management Commission (NIMC). No check-digit algorithm is published, so only the length and digits can be checked.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <NigeriaNationalIdentificationNumberView label="National Identification Number (NIN)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Identity_Management_Commission

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

<!-- NigeriaNationalIdentificationNumberView.svelte -->
<span
    class={`nigeria-national-identification-number-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
