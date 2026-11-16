<script lang="ts">
    // SchweizAhvNummerView component
    //
    // A headless display component for showing Switzerland's
    // AHV-Nummer / Numéro AVS in a read-only format.
    // Format: Thirteen digits, displayed as 756.NNNN.NNNN.NN, always beginning with the country prefix 756. It is a valid EAN-13 barcode number: the final digit is an EAN-13 check digit computed over the twelve preceding digits (alternating-position weights of 1 and 3). Replaced the old 11-digit AHV card number on 1 July 2008.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <SchweizAhvNummerView label="AHV-Nummer / Numéro AVS" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Data_codes_for_Switzerland

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

<!-- SchweizAhvNummerView.svelte -->
<span
    class={`schweiz-ahv-nummer-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
