<script lang="ts">
    // EestiIsikukoodView component
    //
    // A headless display component for showing Estonia's
    // Isikukood (IK) in a read-only format.
    // Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <EestiIsikukoodView label="Personal Identification Code" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Estonia

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

<!-- EestiIsikukoodView.svelte -->
<span
    class={`eesti-isikukood-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
