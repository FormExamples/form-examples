<script lang="ts">
    // AlbaCommunityHealthIndexView component
    //
    // A headless display component for showing Scotland's
    // Community Health Index (CHI) in a read-only format.
    // Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AlbaCommunityHealthIndexView label="Community Health Index" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Health_Service_Central_Register

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

<!-- AlbaCommunityHealthIndexView.svelte -->
<span
    class={`alba-community-health-index-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
