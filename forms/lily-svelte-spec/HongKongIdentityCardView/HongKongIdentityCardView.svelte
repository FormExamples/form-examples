<script lang="ts">
    // HongKongIdentityCardView component
    //
    // A headless display component for showing Hong Kong's
    // Hong Kong Identity Card Number in a read-only format.
    // Format: One or two letters, six digits and a check digit in parentheses, such as A123456(3). The check digit is 0 to 9 or A. Each letter counts as A=10 to Z=35, and a single letter is preceded by a space counted as 36; the eight values are multiplied by 9,8,7,6,5,4,3,2 and summed, and the check digit is 11 minus the sum's Modulus-11 remainder (0 when the remainder is 0, and A when the result is 10).
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <HongKongIdentityCardView label="Hong Kong Identity Card Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Hong_Kong_identity_card

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

<!-- HongKongIdentityCardView.svelte -->
<span
    class={`hong-kong-identity-card-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
