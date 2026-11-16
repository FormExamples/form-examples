<script lang="ts">
    // LiechtensteinNationalIdentityCardNumberView component
    //
    // A headless display component for showing Liechtenstein's
    // Liechtenstein National Identity Card Number in a read-only format.
    // Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <LiechtensteinNationalIdentityCardNumberView label="Liechtenstein National Identity Card Number" value={value} />
    //
    // Accessibility:
    //   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identity_card

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

<!-- LiechtensteinNationalIdentityCardNumberView.svelte -->
<span
    class={`liechtenstein-national-identity-card-number-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}{value}</span
>
