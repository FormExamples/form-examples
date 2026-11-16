<script lang="ts">
    // VietNamCanCuocCongDanView component
    //
    // A headless display component for showing Viet Nam's
    // Citizen Identification Number (CCCD) in a read-only format.
    // Format: Twelve digits: a three-digit code for the province or country of registration, one digit for gender and century of birth (0 male and 1 female for the 1900s, 2 male and 3 female for the 2000s, and so on in pairs), the last two digits of the year of birth, and six random digits. There is no published check digit.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <VietNamCanCuocCongDanView label="Citizen Identification Number (CCCD)" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Vietnamese_identity_card

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

<!-- VietNamCanCuocCongDanView.svelte -->
<span
    class={`viet-nam-can-cuoc-cong-dan-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
