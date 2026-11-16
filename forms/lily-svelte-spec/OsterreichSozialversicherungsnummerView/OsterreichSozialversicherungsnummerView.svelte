<script lang="ts">
    // OsterreichSozialversicherungsnummerView component
    //
    // A headless display component for showing Austria's
    // Sozialversicherungsnummer (SVNR) in a read-only format.
    // Format: Ten digits, displayed as NNNN DDMMYY. The first three digits are a serial number (the first not zero) followed by a Modulus-11 check digit as the fourth digit; the remaining six digits encode date of birth (DDMMYY). If the Modulus-11 remainder is 10, the serial number is incremented by one and the check digit recalculated.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <OsterreichSozialversicherungsnummerView label="Sozialversicherungsnummer (SVNR)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://de.wikipedia.org/wiki/Sozialversicherungsnummer

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

<!-- OsterreichSozialversicherungsnummerView.svelte -->
<span
    class={`osterreich-sozialversicherungsnummer-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
