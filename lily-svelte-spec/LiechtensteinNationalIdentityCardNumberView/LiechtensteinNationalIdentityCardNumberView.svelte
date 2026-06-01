<script lang="ts">
    // LiechtensteinNationalIdentityCardNumberView component
    //
    // A headless display component for showing Liechtenstein's
    // Liechtenstein National Identity Card Number in a read-only format.
    // Format: 2 letters followed by 8 digits (e.g. ID022143586); changes with each renewed card.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible label for screen readers via aria-label.
    //   value — string, default "". The identifier string to display.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <LiechtensteinNationalIdentityCardNumberView label="Liechtenstein National Identity Card Number" value={value} />
    //
    // Accessibility:
    //   - aria-label provides the accessible name so screen readers announce the purpose
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identity_card

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

<!-- LiechtensteinNationalIdentityCardNumberView.svelte -->
<span
    class={`liechtenstein-national-identity-card-number-view ${className}`}
    aria-label={label}
    {...restProps}>{value}</span
>
