<script lang="ts">
    // AlbaCommunityHealthIndexView component
    //
    // A headless display component for showing Scotland's
    // Community Health Index (CHI) in a read-only format.
    // Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <AlbaCommunityHealthIndexView label="Community Health Index" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Health_Service_Central_Register

    let {
        class: className = "",
        label,
        value = "",
        ...restProps
    }: {
        label: string;
        value?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- AlbaCommunityHealthIndexView.svelte -->
<span
    class={`alba-community-health-index-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
