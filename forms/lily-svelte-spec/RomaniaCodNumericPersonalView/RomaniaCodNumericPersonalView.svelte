<script lang="ts">
    // RomaniaCodNumericPersonalView component
    //
    // A headless display component for showing Romania's
    // Cod Numeric Personal (CNP) in a read-only format.
    // Format: 13 digits: gender and century (1/3/5/7 male; 2/4/6/8 female; 9 foreigner), date of birth (YYMMDD), country zone (01-52, or 99 for Bucharest sectors), serial (3 digits), and a Modulus-11 checksum digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <RomaniaCodNumericPersonalView label="Personal Numerical Code" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Romania

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

<!-- RomaniaCodNumericPersonalView.svelte -->
<span
    class={`romania-cod-numeric-personal-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
