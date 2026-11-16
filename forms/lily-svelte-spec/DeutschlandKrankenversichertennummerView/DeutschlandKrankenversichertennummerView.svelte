<script lang="ts">
    // DeutschlandKrankenversichertennummerView component
    //
    // A headless display component for showing Germany's
    // Krankenversichertennummer (KVNR) in a read-only format.
    // Format: a random capital letter followed by eight random digits and a Luhn check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <DeutschlandKrankenversichertennummerView label="Health Insurance Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://de.wikipedia.org/wiki/Krankenversichertennummer

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

<!-- DeutschlandKrankenversichertennummerView.svelte -->
<span
    class={`deutschland-krankenversichertennummer-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
